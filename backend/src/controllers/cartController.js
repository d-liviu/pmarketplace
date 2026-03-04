const { requireFields } = require('../utils/validation')
const cartService = require('../services/cartService')

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.user.id)
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

async function addToCart(req, res, next) {
  try {
    requireFields(req.body, ['pluginId'])
    const cart = await cartService.addToCart(req.user.id, req.body.pluginId)
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

async function removeFromCart(req, res, next) {
  try {
    requireFields(req.body, ['pluginId'])
    const cart = await cartService.removeFromCart(req.user.id, req.body.pluginId)
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart
}
