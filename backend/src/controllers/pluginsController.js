const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')
const { requireFields, ensureNumber } = require('../utils/validation')
const pluginService = require('../services/pluginService')

function decodeHeaderFileName(encodedFileName) {
  if (!encodedFileName || typeof encodedFileName !== 'string') {
    return ''
  }

  try {
    return decodeURIComponent(encodedFileName)
  } catch (error) {
    return encodedFileName
  }
}

function sanitizeBaseName(fileName) {
  return path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '-')
}

function getImageExt(baseName, contentType = '') {
  const fromName = path.extname(baseName).toLowerCase()
  if (fromName) {
    if (fromName === '.jpg') {
      return '.jpeg'
    }
    return fromName
  }

  const normalizedType = String(contentType).toLowerCase().split(';')[0].trim()
  const byMime = {
    'image/jpeg': '.jpeg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif'
  }

  return byMime[normalizedType] || ''
}

function isAllowedImageExt(ext) {
  return ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.gif' || ext === '.avif'
}

function canUseCloudinary() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET)
}

async function uploadImageToCloudinary(buffer, fileName, contentType) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  const folder = process.env.CLOUDINARY_FOLDER || 'pmarketplace/plugins'

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const formData = new FormData()
  const blob = new Blob([buffer], {
    type: contentType || 'application/octet-stream'
  })

  formData.append('file', blob, fileName)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.secure_url) {
    const error = new Error(payload?.error?.message || 'Cloudinary upload failed')
    error.status = 502
    throw error
  }

  return payload.secure_url
}

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

async function listMyPlugins(req, res, next) {
  try {
    const plugins = await pluginService.getPluginsByOwner(req.user.id)
    res.json(plugins)
  } catch (error) {
    next(error)
  }
}

async function uploadMyPhar(req, res, next) {
  try {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'Missing file content' })
    }

    const encodedFileName = req.headers['x-file-name']
    if (!encodedFileName || typeof encodedFileName !== 'string') {
      return res.status(400).json({ message: 'Missing X-File-Name header' })
    }

    const decodedFileName = decodeHeaderFileName(encodedFileName)
    const baseName = sanitizeBaseName(decodedFileName)
    if (!baseName.toLowerCase().endsWith('.phar')) {
      return res.status(400).json({ message: 'Only .phar files are allowed' })
    }

    const storageRoot = process.env.PLUGIN_STORAGE_ROOT
    if (!storageRoot) {
      return res.status(500).json({ message: 'PLUGIN_STORAGE_ROOT is not configured' })
    }

    const now = new Date()
    const year = String(now.getUTCFullYear())
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const safeName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}`

    const relativeDir = path.join('uploads', 'plugins', year, month)
    const absoluteDir = path.resolve(storageRoot, relativeDir)
    await fs.mkdir(absoluteDir, { recursive: true })

    const absolutePath = path.resolve(absoluteDir, safeName)
    await fs.writeFile(absolutePath, req.body)

    const relativePath = path.posix.join('uploads', 'plugins', year, month, safeName)
    return res.status(201).json({
      filePath: relativePath,
      originalName: baseName,
      size: req.body.length
    })
  } catch (error) {
    next(error)
  }
}

async function uploadMyImage(req, res, next) {
  try {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'Missing image file content' })
    }

    const encodedFileName = req.headers['x-file-name']
    if (!encodedFileName || typeof encodedFileName !== 'string') {
      return res.status(400).json({ message: 'Missing X-File-Name header' })
    }

    const decodedFileName = decodeHeaderFileName(encodedFileName)
    const baseName = sanitizeBaseName(decodedFileName)
    const contentType = typeof req.headers['content-type'] === 'string' ? req.headers['content-type'] : ''
    const ext = getImageExt(baseName, contentType)

    if (!isAllowedImageExt(ext)) {
      return res.status(400).json({
        message: 'Only jpeg, png, webp, gif, and avif images are allowed'
      })
    }

    if (canUseCloudinary()) {
      const safeName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`
      const imageUrl = await uploadImageToCloudinary(req.body, safeName, contentType)
      return res.status(201).json({
        url: imageUrl,
        originalName: baseName,
        size: req.body.length,
        storage: 'cloudinary'
      })
    }

    const storageRoot = process.env.PLUGIN_STORAGE_ROOT
    if (!storageRoot) {
      return res.status(500).json({ message: 'PLUGIN_STORAGE_ROOT is not configured' })
    }

    const now = new Date()
    const year = String(now.getUTCFullYear())
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const safeName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`

    const relativeDir = path.join('uploads', 'media', year, month)
    const absoluteDir = path.resolve(storageRoot, relativeDir)
    await fs.mkdir(absoluteDir, { recursive: true })

    const absolutePath = path.resolve(absoluteDir, safeName)
    await fs.writeFile(absolutePath, req.body)

    const relativeUrl = path.posix.join('uploads', 'media', year, month, safeName)
    return res.status(201).json({
      url: `/${relativeUrl}`,
      originalName: baseName,
      size: req.body.length,
      storage: 'local'
    })
  } catch (error) {
    next(error)
  }
}

async function createMyPlugin(req, res, next) {
  try {
    requireFields(req.body, ['name'])
    if (req.body.price !== undefined) {
      ensureNumber(req.body.price, 'price')
    }

    const plugin = await pluginService.createPlugin(req.body, {
      ownerUserId: req.user.id,
      allowFeatured: false,
      defaultStatus: 'published'
    })

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

async function createMyVersion(req, res, next) {
  try {
    const version = await pluginService.createVersion(req.params.id, req.body, {
      enforceOwnership: true,
      actorUserId: req.user.id,
      actorRole: req.user.role
    })
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
  listMyPlugins,
  uploadMyPhar,
  uploadMyImage,
  createMyPlugin,
  createPlugin,
  createMyVersion,
  createVersion,
  updatePlugin,
  deletePlugin,
  getVersions,
  getMedia,
  getReviews,
  addReview
}
