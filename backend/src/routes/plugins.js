const express = require('express')
const controller = require('../controllers/pluginsController')
const { requireAuth, optionalAuth } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/admin')

const router = express.Router()

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
