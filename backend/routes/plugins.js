const express = require('express')
const router = express.Router()
const {
  getPlugins,
  getPluginBySlug
} = require('../controllers/pluginsController')

router.get('/', getPlugins)
router.get('/:slug', getPluginBySlug)

module.exports = router