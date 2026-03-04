const express = require('express')
const controller = require('../controllers/storageController')
const { requireApiKey, optionalApiKey } = require('../middleware/auth')

const router = express.Router()

router.post(
  '/upload',
  requireApiKey,
  express.raw({ type: '*/*', limit: '350mb' }),
  controller.upload
)
router.get('/:fileId', optionalApiKey, controller.metadata)
router.get('/:fileId/download', optionalApiKey, controller.download)
router.delete('/:fileId', requireApiKey, controller.remove)

module.exports = router
