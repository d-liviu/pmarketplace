const express = require('express')
const controller = require('../controllers/pluginsController')
const { requireAuth, optionalAuth, requireUser } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/admin')

const router = express.Router()

router.get('/my/plugins', requireAuth, requireUser, controller.listMyPlugins)
router.post(
  '/my/upload/phar',
  requireAuth,
  requireUser,
  express.raw({ type: 'application/octet-stream', limit: '200mb' }),
  controller.uploadMyPhar
)
router.post(
  '/my/upload-image',
  requireAuth,
  requireUser,
  express.raw({ type: '*/*', limit: '25mb' }),
  controller.uploadMyImage
)
router.post('/my/plugins', requireAuth, requireUser, controller.createMyPlugin)
router.post('/my/plugins/:id/versions', requireAuth, requireUser, controller.createMyVersion)

router.get('/', optionalAuth, controller.listPlugins)
router.get('/:slug', optionalAuth, controller.getPlugin)

router.post('/', requireAuth, requireAdmin, controller.createPlugin)
router.post('/:id/versions', requireAuth, requireAdmin, controller.createVersion)
router.put('/:id', requireAuth, requireAdmin, controller.updatePlugin)
router.delete('/:id', requireAuth, requireAdmin, controller.deletePlugin)

router.get('/:id/versions', optionalAuth, controller.getVersions)
router.get('/:id/media', optionalAuth, controller.getMedia)
router.get('/:id/reviews', optionalAuth, controller.getReviews)
router.post('/:id/reviews', requireAuth, controller.addReview)

module.exports = router
