const express = require('express')
const controller = require('../controllers/licenseController')
const { requireAuth, requireUser } = require('../middleware/auth')

const router = express.Router()

router.get('/', requireAuth, requireUser, controller.listLicenses)
router.get('/:pluginId', requireAuth, requireUser, controller.getLicense)

module.exports = router
