const fs = require('fs')
const path = require('path')
const storageService = require('../services/storageService')

function getBaseUrl() {
  return String(process.env.PMBACKEND_BASE_URL || '').replace(/\/+$/, '')
}

function parseDownloadFlag(value) {
  const normalized = String(value || '').trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

function sanitizeDownloadName(fileName) {
  return path.basename(String(fileName || '').trim()).replace(/[^a-zA-Z0-9._-]/g, '-')
}

function decodeHeaderFileName(value) {
  try {
    return decodeURIComponent(String(value || ''))
  } catch (_error) {
    return String(value || '')
  }
}

async function upload(req, res, next) {
  try {
    const fileName = req.headers['x-file-name']
    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ message: 'Missing X-File-Name header' })
    }

    const row = await storageService.storeBuffer({
      buffer: req.body,
      fileName: decodeHeaderFileName(fileName),
      mimeType: req.headers['content-type'],
      kind: req.headers['x-file-kind'],
      visibility: req.headers['x-file-visibility'],
      bucket: req.headers['x-file-bucket'],
      sourceApp: req.headers['x-source-app']
    })

    const asset = storageService.normalizeAssetRow(row, getBaseUrl())
    return res.status(201).json(asset)
  } catch (error) {
    return next(error)
  }
}

async function metadata(req, res, next) {
  try {
    const row = await storageService.getAssetRowForDownload(req.params.fileId)
    if (!row) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (row.visibility === 'private' && !req.apiKeyAuthorized) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const asset = storageService.normalizeAssetRow(row, getBaseUrl())
    return res.json(asset)
  } catch (error) {
    return next(error)
  }
}

async function download(req, res, next) {
  try {
    const row = await storageService.getAssetRowForDownload(req.params.fileId)
    if (!row) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (row.visibility === 'private' && !req.apiKeyAuthorized) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const forceDownload = parseDownloadFlag(req.query.download)
    const safeName = sanitizeDownloadName(row.original_name || row.stored_name || 'file')
    const dispositionType = forceDownload ? 'attachment' : 'inline'

    res.setHeader('Content-Type', row.mime_type || 'application/octet-stream')
    res.setHeader('Content-Length', String(row.size_bytes))
    res.setHeader('Content-Disposition', `${dispositionType}; filename="${safeName}"`)
    res.setHeader('Cache-Control', row.visibility === 'public' ? 'public, max-age=31536000, immutable' : 'private, max-age=0, no-store')

    const stream = fs.createReadStream(row.absolutePath)
    stream.on('error', (error) => {
      next(error)
    })
    stream.pipe(res)
  } catch (error) {
    return next(error)
  }
}

async function remove(req, res, next) {
  try {
    const removed = await storageService.deleteAsset(req.params.fileId)
    if (!removed) {
      return res.status(404).json({ message: 'File not found' })
    }

    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  upload,
  metadata,
  download,
  remove
}
