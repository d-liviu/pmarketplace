const { createOrderFromCart, createOrderForPlugin, markOrderPaid } = require('../services/checkoutService')

async function checkout(req, res, next) {
  try {
    if (req.body && req.body.pluginId) {
      const order = await createOrderForPlugin(req.user.id, req.body.pluginId)
      return res.status(201).json({
        order,
        message: 'Order completed'
      })
    }

    const order = await createOrderFromCart(req.user.id, 'manual', null)

    res.status(201).json({
      order,
      message: 'Order completed'
    })
  } catch (error) {
    next(error)
  }
}

async function stripeWebhook(req, res, next) {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' })
    }

    await markOrderPaid(orderId)
    res.json({ received: true })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkout,
  stripeWebhook
}
