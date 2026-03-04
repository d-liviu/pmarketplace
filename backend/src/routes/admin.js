const express = require('express')
const controller = require('../controllers/adminController')
const { requireAdminAuth } = require('../middleware/adminAuth')

const router = express.Router()

router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.get('/session', requireAdminAuth, controller.session)
router.post(
  '/upload',
  requireAdminAuth,
  express.raw({ type: 'application/octet-stream', limit: '200mb' }),
  controller.uploadPhar
)
router.post(
  '/upload-image',
  requireAdminAuth,
  express.raw({ type: '*/*', limit: '25mb' }),
  controller.uploadImage
)

module.exports = router
