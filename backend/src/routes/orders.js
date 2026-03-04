const express = require('express')
const controller = require('../controllers/ordersController')
const { requireAuth, requireUser } = require('../middleware/auth')

const router = express.Router()

router.get('/', requireAuth, requireUser, controller.listOrders)
router.get('/:id/receipt', requireAuth, requireUser, controller.downloadReceipt)

module.exports = router
