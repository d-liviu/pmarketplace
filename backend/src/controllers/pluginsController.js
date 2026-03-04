const { requireFields, ensureNumber } = require('../utils/validation')
const pluginService = require('../services/pluginService')

async function listPlugins(req, res, next) {
  try {
    const includeDrafts = req.user?.role === 'admin'
    const search = req.query.search ? String(req.query.search) : ''
    const tag = req.query.tag ? String(req.query.tag) : ''
    const price = req.query.price ? String(req.query.price) : ''
    const version = req.query.version ? String(req.query.version) : ''

    const plugins = await pluginService.listPlugins({
      includeDrafts,
      search,
      tag,
      price,
      version
    })
    res.json(plugins)
  } catch (error) {
    next(error)
  }
}

async function getPlugin(req, res, next) {
  try {
    const includeDrafts = req.user?.role === 'admin'
    const plugin = await pluginService.getPluginBySlug(req.params.slug, { includeDrafts })
    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' })
    }
    res.json(plugin)
  } catch (error) {
    next(error)
  }
}

async function createPlugin(req, res, next) {
  try {
    requireFields(req.body, ['name'])
    if (req.body.price !== undefined) {
      ensureNumber(req.body.price, 'price')
    }

    const plugin = await pluginService.createPlugin(req.body)
    res.status(201).json(plugin)
  } catch (error) {
    next(error)
  }
}

async function createVersion(req, res, next) {
  try {
    const version = await pluginService.createVersion(req.params.id, req.body)
    res.status(201).json(version)
  } catch (error) {
    next(error)
  }
}

async function updatePlugin(req, res, next) {
  try {
    if (req.body.price !== undefined) {
      ensureNumber(req.body.price, 'price')
    }

    const plugin = await pluginService.updatePlugin(req.params.id, req.body)
    res.json(plugin)
  } catch (error) {
    next(error)
  }
}

async function deletePlugin(req, res, next) {
  try {
    await pluginService.deletePlugin(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

async function getVersions(req, res, next) {
  try {
    const versions = await pluginService.getVersions(req.params.id)
    res.json(versions)
  } catch (error) {
    next(error)
  }
}

async function getMedia(req, res, next) {
  try {
    const media = await pluginService.getMedia(req.params.id)
    res.json(media)
  } catch (error) {
    next(error)
  }
}

async function getReviews(req, res, next) {
  try {
    const reviews = await pluginService.getReviews(req.params.id)
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

async function addReview(req, res, next) {
  try {
    requireFields(req.body, ['rating', 'comment'])
    const rating = Number(req.body.rating)
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      const error = new Error('Rating must be between 1 and 5')
      error.status = 400
      throw error
    }

    const review = await pluginService.addReview({
      pluginId: req.params.id,
      userId: req.user.id,
      rating,
      comment: req.body.comment
    })

    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listPlugins,
  getPlugin,
  createPlugin,
  createVersion,
  updatePlugin,
  deletePlugin,
  getVersions,
  getMedia,
  getReviews,
  addReview
}
