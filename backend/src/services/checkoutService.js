const db = require('../config/db')
const { createLicense } = require('./licenseService')
const { userHasPurchased } = require('./pluginService')

async function ensurePurchasingUser(userId) {
  const [rows] = await db.query('SELECT id, role FROM users WHERE id = ? LIMIT 1', [userId])
  if (rows.length === 0) {
    const error = new Error('User not found')
    error.status = 401
    throw error
  }

  if (rows[0].role !== 'user') {
    const error = new Error('User account required for checkout')
    error.status = 403
    throw error
  }

  return rows[0]
}

async function createOrderFromCart(userId, paymentProvider = 'manual', paymentId = null) {
  await ensurePurchasingUser(userId)
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const [cartRows] = await connection.query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId])
    if (cartRows.length === 0) {
      const error = new Error('Cart is empty')
      error.status = 400
      error.code = 'CART_EMPTY'
      throw error
    }

    const cartId = cartRows[0].id

    const [items] = await connection.query(
      `SELECT p.id, p.price, p.is_free
       FROM cart_items ci
       JOIN plugins p ON ci.plugin_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    )

    if (items.length === 0) {
      const error = new Error('Cart is empty')
      error.status = 400
      error.code = 'CART_EMPTY'
      throw error
    }

    const alreadyPurchased = []
    for (const item of items) {
      const purchased = await userHasPurchased(userId, item.id)
      if (purchased) {
        alreadyPurchased.push(item.id)
      }
    }

    if (alreadyPurchased.length > 0) {
      const error = new Error('Plugin already purchased')
      error.status = 409
      error.code = 'ALREADY_PURCHASED'
      error.details = { pluginIds: alreadyPurchased }
      throw error
    }

    const total = items.reduce((sum, item) => {
      if (item.is_free) {
        return sum
      }
      return sum + Number(item.price || 0)
    }, 0)

    const status = total === 0 ? 'paid' : 'paid'

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total, status, payment_provider, payment_id)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, total, status, paymentProvider, paymentId]
    )

    const orderId = orderResult.insertId

    for (const item of items) {
      const price = item.is_free ? 0 : Number(item.price || 0)
      await connection.query(
        'INSERT INTO order_items (order_id, plugin_id, price) VALUES (?, ?, ?)',
        [orderId, item.id, price]
      )
    }

    for (const item of items) {
      await createLicense({ userId, pluginId: item.id })
    }

    await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId])
    await connection.commit()

    return {
      id: orderId,
      total,
      status
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

async function createOrderForPlugin(userId, pluginId) {
  await ensurePurchasingUser(userId)
  const [rows] = await db.query(
    'SELECT id, price, is_free FROM plugins WHERE id = ? LIMIT 1',
    [pluginId]
  )

  if (rows.length === 0) {
    const error = new Error('Plugin not found')
    error.status = 404
    error.code = 'PLUGIN_NOT_FOUND'
    throw error
  }

  const plugin = rows[0]
  const alreadyPurchased = await userHasPurchased(userId, pluginId)
  if (alreadyPurchased) {
    const error = new Error('Plugin already purchased')
    error.status = 409
    error.code = 'ALREADY_PURCHASED'
    throw error
  }

  const price = plugin.is_free ? 0 : Number(plugin.price || 0)

  const [orderResult] = await db.query(
    `INSERT INTO orders (user_id, total, status, payment_provider, payment_id)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, price, 'paid', 'manual', null]
  )

  const orderId = orderResult.insertId
  await db.query('INSERT INTO order_items (order_id, plugin_id, price) VALUES (?, ?, ?)', [
    orderId,
    pluginId,
    price
  ])

  await createLicense({ userId, pluginId })

  return {
    id: orderId,
    total: price,
    status: 'paid'
  }
}

async function markOrderPaid(orderId) {
  await db.query('UPDATE orders SET status = ? WHERE id = ?', ['paid', orderId])

  const [orderRows] = await db.query('SELECT user_id FROM orders WHERE id = ?', [orderId])
  if (orderRows.length === 0) {
    return null
  }

  const userId = orderRows[0].user_id
  const [items] = await db.query('SELECT plugin_id FROM order_items WHERE order_id = ?', [orderId])
  for (const item of items) {
    await createLicense({ userId, pluginId: item.plugin_id })
  }

  return { orderId }
}

module.exports = {
  createOrderFromCart,
  createOrderForPlugin,
  markOrderPaid
}
