const db = require('../config/db')

async function listOrders(userId) {
  const [orders] = await db.query(
    `SELECT id, total, status, payment_provider, payment_id, created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  )

  if (orders.length === 0) {
    return []
  }

  const orderIds = orders.map((order) => order.id)
  const [items] = await db.query(
    `SELECT oi.order_id, oi.plugin_id, oi.price, p.name, p.slug
     FROM order_items oi
     JOIN plugins p ON oi.plugin_id = p.id
     WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})`,
    orderIds
  )

  const itemsByOrder = items.reduce((acc, item) => {
    if (!acc[item.order_id]) {
      acc[item.order_id] = []
    }
    acc[item.order_id].push(item)
    return acc
  }, {})

  return orders.map((order) => ({
    ...order,
    items: itemsByOrder[order.id] || []
  }))
}

async function getOrderWithItems(userId, orderId) {
  const [orders] = await db.query(
    `SELECT id, total, status, payment_provider, payment_id, created_at
     FROM orders
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [orderId, userId]
  )

  if (orders.length === 0) {
    return null
  }

  const order = orders[0]
  const [items] = await db.query(
    `SELECT oi.order_id, oi.plugin_id, oi.price, p.name, p.slug
     FROM order_items oi
     JOIN plugins p ON oi.plugin_id = p.id
     WHERE oi.order_id = ?`,
    [order.id]
  )

  return {
    ...order,
    items
  }
}

module.exports = {
  listOrders,
  getOrderWithItems
}
