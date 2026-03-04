const express = require('express')
const controller = require('../controllers/downloadController')
const { requireAuth, requireUser } = require('../middleware/auth')

const router = express.Router()

router.get('/:pluginId', requireAuth, requireUser, controller.download)

module.exports = router
