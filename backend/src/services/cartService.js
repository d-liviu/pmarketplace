const db = require('../config/db')
const { userHasPurchased } = require('./pluginService')
const { getPrimaryMediaMap } = require('./mediaService')

async function getOrCreateCart(userId) {
  const [rows] = await db.query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId])
  if (rows.length > 0) {
    return rows[0].id
  }

  const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId])
  return result.insertId
}

async function getCart(userId) {
  const cartId = await getOrCreateCart(userId)

  const [items] = await db.query(
    `SELECT p.id, p.name, p.slug, p.short_description, p.price, p.is_free
     FROM cart_items ci
     JOIN plugins p ON ci.plugin_id = p.id
     WHERE ci.cart_id = ?`,
    [cartId]
  )

  const mediaMap = await getPrimaryMediaMap(items.map((item) => item.id))
  const enrichedItems = items.map((item) => ({
    ...item,
    media: mediaMap[item.id] || []
  }))

  return {
    id: cartId,
    items: enrichedItems
  }
}

async function addToCart(userId, pluginId) {
  const purchased = await userHasPurchased(userId, pluginId)
  if (purchased) {
    const error = new Error('Plugin already purchased')
    error.status = 409
    throw error
  }

  const cartId = await getOrCreateCart(userId)

  const [existing] = await db.query(
    'SELECT plugin_id FROM cart_items WHERE cart_id = ? AND plugin_id = ? LIMIT 1',
    [cartId, pluginId]
  )
  if (existing.length > 0) {
    return getCart(userId)
  }

  await db.query('INSERT INTO cart_items (cart_id, plugin_id) VALUES (?, ?)', [cartId, pluginId])
  return getCart(userId)
}

async function removeFromCart(userId, pluginId) {
  const cartId = await getOrCreateCart(userId)
  await db.query('DELETE FROM cart_items WHERE cart_id = ? AND plugin_id = ?', [cartId, pluginId])
  return getCart(userId)
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart
}
