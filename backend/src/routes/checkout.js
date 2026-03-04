const express = require('express')
const controller = require('../controllers/checkoutController')
const { requireAuth, requireUser } = require('../middleware/auth')

const router = express.Router()

router.post('/', requireAuth, requireUser, controller.checkout)
router.post('/webhook/stripe', controller.stripeWebhook)

module.exports = router
