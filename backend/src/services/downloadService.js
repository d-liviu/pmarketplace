const db = require('../config/db')
const { safeResolve } = require('../utils/file')

async function getLatestVersion(pluginId) {
  const [rows] = await db.query(
    `SELECT id, file_path, version, created_at
     FROM plugin_versions
     WHERE plugin_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [pluginId]
  )
  return rows[0] || null
}

async function getVersionById(pluginId, versionId) {
  const [rows] = await db.query(
    `SELECT id, file_path, version, created_at
     FROM plugin_versions
     WHERE id = ? AND plugin_id = ?
     LIMIT 1`,
    [versionId, pluginId]
  )
  return rows[0] || null
}

async function userHasLicense(userId, pluginId) {
  const [rows] = await db.query(
    'SELECT id FROM licenses WHERE user_id = ? AND plugin_id = ? LIMIT 1',
    [userId, pluginId]
  )
  return rows.length > 0
}

async function logDownload(userId, pluginId) {
  await db.query(
    'INSERT INTO downloads (user_id, plugin_id) VALUES (?, ?)',
    [userId, pluginId]
  )
}

async function getDownloadPath(userId, pluginId, { versionId = null } = {}) {
  const hasLicense = await userHasLicense(userId, pluginId)
  if (!hasLicense) {
    const error = new Error('Valid license required')
    error.status = 403
    error.code = 'LICENSE_REQUIRED'
    throw error
  }

  const version = versionId
    ? await getVersionById(pluginId, versionId)
    : await getLatestVersion(pluginId)

  if (!version) {
    const error = new Error('No version available')
    error.status = 404
    error.code = 'VERSION_NOT_FOUND'
    throw error
  }

  const storageRoot = process.env.PLUGIN_STORAGE_ROOT
  if (!storageRoot) {
    const error = new Error('Storage root not configured')
    error.status = 500
    error.code = 'STORAGE_ROOT_MISSING'
    throw error
  }

  const resolvedPath = safeResolve(storageRoot, version.file_path)

  await logDownload(userId, pluginId)

  return {
    path: resolvedPath,
    version
  }
}

module.exports = {
  getDownloadPath
}
