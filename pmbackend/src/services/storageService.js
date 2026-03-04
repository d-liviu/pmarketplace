const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')
const db = require('../config/db')
const { ensureInsideRoot } = require('../utils/path')

const IMAGE_EXTENSIONS = new Set(['.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'])
const PHAR_EXTENSIONS = new Set(['.phar'])

const MIME_TO_EXTENSION = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
  'application/x-httpd-php': '.phar',
  'application/octet-stream': '.bin',
  'application/zip': '.zip',
  'application/pdf': '.pdf',
  'text/plain': '.txt'
}

const EXTENSION_TO_MIME = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.phar': 'application/octet-stream',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.json': 'application/json'
}

function getStorageRoot() {
  const root = process.env.PMBACKEND_STORAGE_ROOT
  if (!root) {
    const error = new Error('PMBACKEND_STORAGE_ROOT is not configured')
    error.status = 500
    throw error
  }

  return path.resolve(root)
}

function parseKind(value) {
  const normalized = String(value || 'any').trim().toLowerCase()
  if (normalized === 'image' || normalized === 'phar' || normalized === 'any') {
    return normalized
  }
  return 'any'
}

function parseVisibility(value) {
  const normalized = String(value || 'public').trim().toLowerCase()
  return normalized === 'private' ? 'private' : 'public'
}

function sanitizeBaseName(fileName) {
  const baseName = path.basename(String(fileName || '').trim())
  return baseName.replace(/[^a-zA-Z0-9._-]/g, '-')
}

function normalizeExtension(rawExtension) {
  if (!rawExtension) {
    return ''
  }

  const lower = rawExtension.toLowerCase()
  if (lower === '.jpg') {
    return '.jpeg'
  }

  return lower
}

function inferExtension(fileName, mimeType) {
  const fileExtension = normalizeExtension(path.extname(fileName))
  if (fileExtension) {
    return fileExtension
  }

  const normalizedMime = String(mimeType || '').split(';')[0].trim().toLowerCase()
  return MIME_TO_EXTENSION[normalizedMime] || '.bin'
}

function inferMimeType(extension, providedMimeType) {
  const normalizedProvided = String(providedMimeType || '').split(';')[0].trim().toLowerCase()
  if (normalizedProvided) {
    return normalizedProvided
  }

  return EXTENSION_TO_MIME[extension] || 'application/octet-stream'
}

function validateExtensionForKind(extension, kind) {
  if (kind === 'image') {
    return IMAGE_EXTENSIONS.has(extension)
  }

  if (kind === 'phar') {
    return PHAR_EXTENSIONS.has(extension)
  }

  return true
}

function normalizeBucket(bucket) {
  const normalized = String(bucket || 'default').trim().toLowerCase()
  const safe = normalized.replace(/[^a-z0-9/_-]/g, '-').replace(/\/+/g, '/')
  return safe || 'default'
}

function normalizeFileId(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeAssetRow(row, baseUrl) {
  if (!row) {
    return null
  }

  const fileId = row.file_id
  const cleanedBaseUrl = String(baseUrl || '').replace(/\/+$/, '')
  const publicRelative = row.visibility === 'public' ? row.stored_path.replace(/^public\//, '') : ''

  return {
    fileId,
    originalName: row.original_name,
    mimeType: row.mime_type,
    extension: row.extension,
    kind: row.kind,
    bucket: row.bucket,
    visibility: row.visibility,
    sizeBytes: Number(row.size_bytes),
    sourceApp: row.source_app,
    createdAt: row.created_at,
    url:
      row.visibility === 'public' && cleanedBaseUrl
        ? `${cleanedBaseUrl}/files/${publicRelative}`
        : null,
    downloadUrl: cleanedBaseUrl ? `${cleanedBaseUrl}/api/storage/${fileId}/download` : null
  }
}

function resolveAbsoluteStoredPath(storedPath) {
  return ensureInsideRoot(getStorageRoot(), storedPath)
}

async function getAssetRowByFileId(fileId) {
  const [rows] = await db.query(
    `SELECT id, file_id, original_name, stored_name, stored_path, mime_type, size_bytes, extension, kind, bucket, visibility, source_app, created_at
     FROM asset_files
     WHERE file_id = ? AND deleted_at IS NULL
     LIMIT 1`,
    [normalizeFileId(fileId)]
  )

  return rows[0] || null
}

async function storeBuffer({
  buffer,
  fileName,
  mimeType,
  kind = 'any',
  visibility = 'public',
  bucket = 'default',
  sourceApp = null
}) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const error = new Error('Missing file content')
    error.status = 400
    throw error
  }

  const normalizedKind = parseKind(kind)
  const normalizedVisibility = parseVisibility(visibility)
  const normalizedBucket = normalizeBucket(bucket)
  const safeFileName = sanitizeBaseName(fileName)
  if (!safeFileName) {
    const error = new Error('Missing file name')
    error.status = 400
    throw error
  }

  const extension = normalizeExtension(inferExtension(safeFileName, mimeType))
  if (!validateExtensionForKind(extension, normalizedKind)) {
    const error = new Error(`Invalid file extension for kind "${normalizedKind}"`)
    error.status = 400
    throw error
  }

  const normalizedMimeType = inferMimeType(extension, mimeType)
  const now = new Date()
  const year = String(now.getUTCFullYear())
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const uniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension}`

  const storedDir = path.posix.join(normalizedVisibility, normalizedBucket, year, month)
  const storedPath = path.posix.join(storedDir, uniqueName)
  const storageRoot = getStorageRoot()
  const absoluteDir = ensureInsideRoot(storageRoot, storedDir)
  const absoluteFilePath = ensureInsideRoot(storageRoot, storedPath)

  await fs.mkdir(absoluteDir, { recursive: true })
  await fs.writeFile(absoluteFilePath, buffer)

  const fileId = crypto.randomUUID()
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex')

  await db.query(
    `INSERT INTO asset_files
      (file_id, original_name, stored_name, stored_path, mime_type, size_bytes, extension, kind, bucket, visibility, source_app, sha256)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fileId,
      safeFileName,
      uniqueName,
      storedPath,
      normalizedMimeType,
      buffer.length,
      extension,
      normalizedKind,
      normalizedBucket,
      normalizedVisibility,
      sourceApp ? String(sourceApp).slice(0, 64) : null,
      sha256
    ]
  )

  return getAssetRowByFileId(fileId)
}

async function getAssetByFileId(fileId, baseUrl) {
  const row = await getAssetRowByFileId(fileId)
  return normalizeAssetRow(row, baseUrl)
}

async function getAssetRowForDownload(fileId) {
  const row = await getAssetRowByFileId(fileId)
  if (!row) {
    return null
  }

  return {
    ...row,
    absolutePath: resolveAbsoluteStoredPath(row.stored_path)
  }
}

async function deleteAsset(fileId) {
  const row = await getAssetRowByFileId(fileId)
  if (!row) {
    return false
  }

  const absolutePath = resolveAbsoluteStoredPath(row.stored_path)
  await fs.rm(absolutePath, { force: true })

  await db.query('UPDATE asset_files SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [row.id])
  return true
}

module.exports = {
  parseKind,
  parseVisibility,
  normalizeAssetRow,
  storeBuffer,
  getAssetByFileId,
  getAssetRowForDownload,
  deleteAsset
}
