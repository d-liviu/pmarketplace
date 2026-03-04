const crypto = require('crypto')
const db = require('../config/db')

function generateKey() {
  return crypto.randomBytes(24).toString('hex')
}

async function createLicense({ userId, pluginId }) {
  const [existing] = await db.query(
    'SELECT id, license_key FROM licenses WHERE user_id = ? AND plugin_id = ? LIMIT 1',
    [userId, pluginId]
  )

  if (existing.length > 0) {
    return existing[0]
  }

  const licenseKey = generateKey()
  await db.query(
    'INSERT INTO licenses (user_id, plugin_id, license_key) VALUES (?, ?, ?)',
    [userId, pluginId, licenseKey]
  )

  const [rows] = await db.query(
    'SELECT id, license_key FROM licenses WHERE user_id = ? AND plugin_id = ? LIMIT 1',
    [userId, pluginId]
  )

  return rows[0]
}

async function getLicenses(userId) {
  const [rows] = await db.query(
    `SELECT l.id, l.plugin_id, l.license_key, l.created_at, p.name, p.slug
     FROM licenses l
     JOIN plugins p ON l.plugin_id = p.id
     WHERE l.user_id = ?`,
    [userId]
  )
  return rows
}

async function getLicenseForPlugin(userId, pluginId) {
  const [rows] = await db.query(
    `SELECT l.id, l.license_key, l.created_at
     FROM licenses l
     WHERE l.user_id = ? AND l.plugin_id = ? LIMIT 1`,
    [userId, pluginId]
  )
  return rows[0] || null
}

module.exports = {
  createLicense,
  getLicenses,
  getLicenseForPlugin
}
