const express = require('express')
const controller = require('../controllers/cartController')
const { requireAuth, requireUser } = require('../middleware/auth')

const router = express.Router()

router.get('/', requireAuth, requireUser, controller.getCart)
router.post('/add', requireAuth, requireUser, controller.addToCart)
router.delete('/remove', requireAuth, requireUser, controller.removeFromCart)

module.exports = router
