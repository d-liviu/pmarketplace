const ordersService = require('../services/ordersService')
const { generateReceiptPdf } = require('../utils/pdf')

async function listOrders(req, res, next) {
  try {
    const orders = await ordersService.listOrders(req.user.id)
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

async function downloadReceipt(req, res, next) {
  try {
    const orderId = Number(req.params.id)
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' })
    }

    const order = await ordersService.getOrderWithItems(req.user.id, orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const pdfBuffer = generateReceiptPdf(order)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="pmhub-order-${order.id}.pdf"`
    )
    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listOrders,
  downloadReceipt
}
