const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')
const { requireFields } = require('../utils/validation')
const { signToken } = require('../utils/jwt')

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left))
  const rightBuffer = Buffer.from(String(right))

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

function getClearCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  }
}

function getConfiguredAdminCredentials() {
  return {
    username: process.env.ADMIN_PANEL_USERNAME,
    password: process.env.ADMIN_PANEL_PASSWORD
  }
}

function sanitizeAdminUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }
}

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

async function login(req, res, next) {
  try {
    requireFields(req.body, ['username', 'password'])

    const configured = getConfiguredAdminCredentials()
    if (!configured.username || !configured.password) {
      const error = new Error('Admin panel credentials are not configured')
      error.status = 500
      throw error
    }

    const validUsername = safeEqual(req.body.username, configured.username)
    const validPassword = safeEqual(req.body.password, configured.password)
    if (!validUsername || !validPassword) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    const adminUser = {
      id: 0,
      username: configured.username,
      email: `${configured.username}@admin.local`,
      role: 'admin'
    }

    const token = signToken(adminUser)
    res.cookie('admin_token', token, getCookieOptions())

    return res.json({ user: sanitizeAdminUser(adminUser), token })
  } catch (error) {
    return next(error)
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie('admin_token', getClearCookieOptions())
    return res.json({ message: 'Logged out' })
  } catch (error) {
    return next(error)
  }
}

async function session(req, res, next) {
  try {
    return res.json({
      authenticated: true,
      user: sanitizeAdminUser(req.user)
    })
  } catch (error) {
    return next(error)
  }
}

async function uploadPhar(req, res, next) {
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

    const relativePath = path.posix.join(
      'uploads',
      'plugins',
      year,
      month,
      safeName
    )

    return res.status(201).json({
      filePath: relativePath,
      originalName: baseName,
      size: req.body.length
    })
  } catch (error) {
    return next(error)
  }
}

async function uploadImage(req, res, next) {
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
    return next(error)
  }
}

module.exports = {
  login,
  logout,
  session,
  uploadPhar,
  uploadImage
}
