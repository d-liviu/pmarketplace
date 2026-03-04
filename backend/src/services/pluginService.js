const db = require('../config/db')
const { toSlug } = require('../utils/slug')
const { getPrimaryMediaMap } = require('./mediaService')

function normalizeTags(row) {
  if (!row.tags) {
    return []
  }
  return row.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function parseBoolean(value) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value === 1
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on'
  }

  return false
}

function parseMaybeJson(value) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return value
  }

  if (
    !(trimmed.startsWith('[') && trimmed.endsWith(']')) &&
    !(trimmed.startsWith('{') && trimmed.endsWith('}'))
  ) {
    return value
  }

  try {
    return JSON.parse(trimmed)
  } catch (error) {
    return value
  }
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value === undefined || value === null) {
      continue
    }

    const asString = String(value).trim()
    if (asString) {
      return asString
    }
  }

  return ''
}

function splitLinesOrCsv(value) {
  if (value === undefined || value === null) {
    return []
  }

  const parsed = parseMaybeJson(value)
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => String(item).trim())
      .filter(Boolean)
  }

  return String(parsed)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeTagsInput(value) {
  const parsed = parseMaybeJson(value)
  if (!parsed) {
    return []
  }

  const source = Array.isArray(parsed) ? parsed : String(parsed).split(',')
  const seen = new Set()

  return source
    .map((item) => {
      if (item && typeof item === 'object' && item.name !== undefined) {
        return String(item.name).trim()
      }
      return String(item).trim()
    })
    .filter(Boolean)
    .filter((tag) => {
      const normalized = tag.toLowerCase()
      if (seen.has(normalized)) {
        return false
      }
      seen.add(normalized)
      return true
    })
}

function normalizeMediaInput(value) {
  const parsed = parseMaybeJson(value)
  const source = Array.isArray(parsed) ? parsed : []

  return source
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          type: 'image',
          url: item.trim(),
          position: index + 1
        }
      }

      const position = Number(item?.position)
      return {
        type: item?.type === 'video' ? 'video' : 'image',
        url: item?.url ? String(item.url).trim() : '',
        position: Number.isFinite(position) && position > 0 ? position : index + 1
      }
    })
    .filter((item) => item.url)
}

function extractLegacyMedia(payload) {
  const primaryImageUrl = firstNonEmpty(
    payload.primaryImageUrl,
    payload.primary_image_url,
    payload.primary_image,
    payload.imageUrl,
    payload.image_url
  )

  const galleryUrls = [
    ...splitLinesOrCsv(payload.galleryImageUrls),
    ...splitLinesOrCsv(payload.gallery_image_urls),
    ...splitLinesOrCsv(payload.gallery_images)
  ]
  const videoUrls = [
    ...splitLinesOrCsv(payload.videoUrls),
    ...splitLinesOrCsv(payload.video_urls),
    ...splitLinesOrCsv(payload.videos)
  ]

  const imageUrls = [primaryImageUrl, ...galleryUrls].filter(Boolean)

  const imageMedia = imageUrls.map((url, index) => ({
    type: 'image',
    url,
    position: index + 1
  }))
  const videoMedia = videoUrls.map((url, index) => ({
    type: 'video',
    url,
    position: imageMedia.length + index + 1
  }))

  return [...imageMedia, ...videoMedia]
}

function normalizeVersionsInput(value) {
  const parsed = parseMaybeJson(value)
  let source = []
  if (Array.isArray(parsed)) {
    source = parsed
  } else if (parsed && typeof parsed === 'object') {
    source = [parsed]
  }

  return source
    .map((item) => ({
      version: firstNonEmpty(item?.version, item?.initial_version, item?.initialVersion),
      changelog: item?.changelog ? String(item.changelog) : '',
      pocketmineVersion: item?.pocketmine_version
        ? String(item.pocketmine_version).trim()
        : item?.pocketmineVersion
          ? String(item.pocketmineVersion).trim()
          : '',
      filePath: item?.file_path
        ? String(item.file_path).trim()
        : item?.filePath
          ? String(item.filePath).trim()
          : item?.phar_path
            ? String(item.phar_path).trim()
          : ''
    }))
    .filter((item) => item.version)
}

function extractLegacyVersions(payload) {
  const version = firstNonEmpty(
    payload.initialVersion,
    payload.initial_version,
    payload.version,
    payload.plugin_version
  )

  if (!version) {
    return []
  }

  return [
    {
      version,
      changelog: firstNonEmpty(payload.changelog, payload.initial_changelog),
      pocketmine_version: firstNonEmpty(
        payload.pocketmineVersion,
        payload.pocketmine_version,
        payload.pm_version
      ),
      file_path: firstNonEmpty(
        payload.filePath,
        payload.file_path,
        payload.pharPath,
        payload.phar_path
      )
    }
  ]
}

async function upsertTag(connection, name) {
  const normalizedName = String(name).trim()
  const [existingRows] = await connection.query(
    'SELECT id FROM tags WHERE LOWER(name) = LOWER(?) LIMIT 1',
    [normalizedName]
  )

  if (existingRows.length > 0) {
    return existingRows[0].id
  }

  const [result] = await connection.query('INSERT INTO tags (name) VALUES (?)', [
    normalizedName
  ])
  return result.insertId
}

async function attachTags(connection, pluginId, tags) {
  for (const tag of tags) {
    const tagId = await upsertTag(connection, tag)
    const [existingLinks] = await connection.query(
      'SELECT plugin_id FROM plugin_tags WHERE plugin_id = ? AND tag_id = ? LIMIT 1',
      [pluginId, tagId]
    )
    if (existingLinks.length === 0) {
      await connection.query('INSERT INTO plugin_tags (plugin_id, tag_id) VALUES (?, ?)', [
        pluginId,
        tagId
      ])
    }
  }
}

async function insertMedia(connection, pluginId, media) {
  for (const item of media) {
    await connection.query(
      'INSERT INTO plugin_media (plugin_id, type, url, position) VALUES (?, ?, ?, ?)',
      [pluginId, item.type, item.url, Number(item.position) || 1]
    )
  }
}

async function insertVersions(connection, pluginId, versions) {
  for (const version of versions) {
    if (!version.filePath) {
      const error = new Error(`Missing file_path for version ${version.version}`)
      error.status = 400
      throw error
    }

    await connection.query(
      'INSERT INTO plugin_versions (plugin_id, version, changelog, pocketmine_version, file_path) VALUES (?, ?, ?, ?, ?)',
      [
        pluginId,
        version.version,
        version.changelog || '',
        version.pocketmineVersion || null,
        version.filePath
      ]
    )
  }
}

async function listPlugins({ includeDrafts = false, search = '', tag = '', price = '', version = '' } = {}) {
  const params = []
  const conditions = []

  if (!includeDrafts) {
    conditions.push('p.status = "published"')
  }

  if (search) {
    const term = `%${search}%`
    conditions.push(
      '(p.name LIKE ? OR p.short_description LIKE ? OR p.full_description LIKE ? OR t.name LIKE ?)'
    )
    params.push(term, term, term, term)
  }

  if (tag) {
    conditions.push('LOWER(t.name) = ?')
    params.push(tag.toLowerCase())
  }

  if (price == 'free') {
    conditions.push('p.is_free = 1')
  } else if (price == 'under-20') {
    conditions.push('p.price < 20')
  } else if (price == 'under-50') {
    conditions.push('p.price < 50')
  } else if (price == '50-plus') {
    conditions.push('p.price >= 50')
  }

  if (version) {
    const trimmedVersion = String(version).trim()
    if (trimmedVersion.toLowerCase().endsWith('x')) {
      const prefix = trimmedVersion.slice(0, -1)
      conditions.push('pv.pocketmine_version LIKE ?')
      params.push(`${prefix}%`)
    } else {
      conditions.push('pv.pocketmine_version = ?')
      params.push(trimmedVersion)
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [rows] = await db.query(
    `SELECT p.id, p.name, p.slug, p.short_description, p.price, p.is_free, p.featured, p.status, p.created_at, p.updated_at,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags
     FROM plugins p
     LEFT JOIN plugin_tags pt ON p.id = pt.plugin_id
     LEFT JOIN tags t ON pt.tag_id = t.id
     LEFT JOIN plugin_versions pv ON p.id = pv.plugin_id
     ${whereClause}
     GROUP BY p.id
     ORDER BY p.featured DESC, p.created_at DESC`,
    params
  )

  const plugins = rows.map((row) => ({
    ...row,
    tags: normalizeTags(row)
  }))

  const mediaMap = await getPrimaryMediaMap(plugins.map((plugin) => plugin.id))

  return plugins.map((plugin) => ({
    ...plugin,
    media: mediaMap[plugin.id] || []
  }))
}

async function getPluginBySlug(slug, { includeDrafts = false } = {}) {
  const params = [slug]
  let statusFilter = ''
  if (!includeDrafts) {
    statusFilter = 'AND p.status = "published"'
  }

  const [rows] = await db.query(
    `SELECT p.*, GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags
     FROM plugins p
     LEFT JOIN plugin_tags pt ON p.id = pt.plugin_id
     LEFT JOIN tags t ON pt.tag_id = t.id
     WHERE p.slug = ? ${statusFilter}
     GROUP BY p.id
     LIMIT 1`,
    params
  )

  if (rows.length === 0) {
    return null
  }

  const row = rows[0]
  return {
    ...row,
    tags: normalizeTags(row)
  }
}

async function getPluginById(id) {
  const [rows] = await db.query('SELECT * FROM plugins WHERE id = ? LIMIT 1', [id])
  return rows[0] || null
}

async function getPluginWithRelationsById(id) {
  const [rows] = await db.query(
    `SELECT p.*, GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') as tags
     FROM plugins p
     LEFT JOIN plugin_tags pt ON p.id = pt.plugin_id
     LEFT JOIN tags t ON pt.tag_id = t.id
     WHERE p.id = ?
     GROUP BY p.id
     LIMIT 1`,
    [id]
  )

  if (rows.length === 0) {
    return null
  }

  const plugin = {
    ...rows[0],
    tags: normalizeTags(rows[0])
  }

  const [media, versions] = await Promise.all([getMedia(id), getVersions(id)])
  return {
    ...plugin,
    media,
    versions
  }
}

async function ensureUniqueSlug(baseSlug, pluginId = null) {
  let slug = baseSlug
  let suffix = 1

  while (true) {
    const [rows] = await db.query('SELECT id FROM plugins WHERE slug = ? LIMIT 1', [slug])
    if (rows.length === 0 || (pluginId && rows[0].id === pluginId)) {
      return slug
    }
    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

async function createPlugin(payload) {
  const slugBase = payload.slug ? toSlug(payload.slug) : toSlug(payload.name)
  const safeSlugBase = slugBase || `plugin-${Date.now()}`
  const isFree = parseBoolean(payload.is_free)
  const featured = parseBoolean(payload.featured)
  const status = payload.status === 'published' ? 'published' : 'draft'
  const parsedPrice = Number(payload.price || 0)
  const price = isFree ? 0 : Number.isNaN(parsedPrice) ? 0 : parsedPrice

  const tags = normalizeTagsInput(payload.tags ?? payload.tagsCsv ?? payload.tags_csv)

  const normalizedMedia = normalizeMediaInput(payload.media)
  const media =
    normalizedMedia.length > 0 ? normalizedMedia : normalizeMediaInput(extractLegacyMedia(payload))

  const normalizedVersions = normalizeVersionsInput(payload.versions)
  const versions =
    normalizedVersions.length > 0
      ? normalizedVersions
      : normalizeVersionsInput(extractLegacyVersions(payload))

  if (tags.length === 0) {
    const error = new Error('At least one tag is required')
    error.status = 400
    throw error
  }

  if (media.length === 0) {
    const error = new Error('At least one media item is required')
    error.status = 400
    throw error
  }

  if (versions.length === 0) {
    const error = new Error('At least one plugin version is required')
    error.status = 400
    throw error
  }

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const slug = await ensureUniqueSlug(safeSlugBase)

    const [result] = await connection.query(
      `INSERT INTO plugins (name, slug, short_description, full_description, price, is_free, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.name,
        slug,
        payload.short_description || '',
        payload.full_description || '',
        price,
        isFree,
        status,
        featured
      ]
    )

    const pluginId = result.insertId

    if (tags.length > 0) {
      await attachTags(connection, pluginId, tags)
    }

    if (media.length > 0) {
      await insertMedia(connection, pluginId, media)
    }

    if (versions.length > 0) {
      await insertVersions(connection, pluginId, versions)
    }

    await connection.commit()
    return getPluginWithRelationsById(pluginId)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

async function createVersion(pluginId, payload) {
  const plugin = await getPluginById(pluginId)
  if (!plugin) {
    const error = new Error('Plugin not found')
    error.status = 404
    throw error
  }

  const fromArray = normalizeVersionsInput(payload?.versions)
  const versions = fromArray.length > 0 ? fromArray : normalizeVersionsInput([payload || {}])
  const nextVersion = versions[0]

  if (!nextVersion || !nextVersion.version) {
    const error = new Error('Version is required')
    error.status = 400
    throw error
  }

  if (!nextVersion.filePath) {
    const error = new Error(`Missing file_path for version ${nextVersion.version}`)
    error.status = 400
    throw error
  }

  const [result] = await db.query(
    `INSERT INTO plugin_versions (plugin_id, version, changelog, pocketmine_version, file_path)
     VALUES (?, ?, ?, ?, ?)`,
    [
      plugin.id,
      nextVersion.version,
      nextVersion.changelog || '',
      nextVersion.pocketmineVersion || null,
      nextVersion.filePath
    ]
  )

  const [rows] = await db.query(
    `SELECT id, plugin_id, version, changelog, pocketmine_version, file_path, created_at
     FROM plugin_versions
     WHERE id = ?
     LIMIT 1`,
    [result.insertId]
  )

  return rows[0] || null
}

async function updatePlugin(id, payload) {
  const existing = await getPluginById(id)
  if (!existing) {
    const error = new Error('Plugin not found')
    error.status = 404
    throw error
  }

  const name = payload.name ?? existing.name
  const slugInput = payload.slug ? toSlug(payload.slug) : toSlug(name)
  const slug = await ensureUniqueSlug(slugInput, id)
  const isFree =
    payload.is_free !== undefined ? parseBoolean(payload.is_free) : Boolean(existing.is_free)
  const featured =
    payload.featured !== undefined ? parseBoolean(payload.featured) : Boolean(existing.featured)
  const price = isFree ? 0 : Number(payload.price ?? existing.price ?? 0)

  await db.query(
    `UPDATE plugins
     SET name = ?, slug = ?, short_description = ?, full_description = ?, price = ?, is_free = ?, status = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      name,
      slug,
      payload.short_description ?? existing.short_description,
      payload.full_description ?? existing.full_description,
      price,
      isFree,
      payload.status ?? existing.status,
      featured,
      id
    ]
  )

  return getPluginById(id)
}

async function deletePlugin(id) {
  await db.query('DELETE FROM plugins WHERE id = ?', [id])
}

async function getVersions(pluginId) {
  const [rows] = await db.query(
    `SELECT id, plugin_id, version, changelog, pocketmine_version, created_at
     FROM plugin_versions WHERE plugin_id = ? ORDER BY created_at DESC`,
    [pluginId]
  )
  return rows
}

async function getMedia(pluginId) {
  const [rows] = await db.query(
    `SELECT id, plugin_id, type, url, position FROM plugin_media WHERE plugin_id = ? ORDER BY position ASC`,
    [pluginId]
  )
  return rows
}

async function getReviews(pluginId) {
  const [rows] = await db.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.username
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.plugin_id = ? ORDER BY r.created_at DESC`,
    [pluginId]
  )
  return rows
}

async function userHasPurchased(userId, pluginId) {
  const [rows] = await db.query(
    `SELECT oi.order_id
     FROM order_items oi
     JOIN orders o ON oi.order_id = o.id
     WHERE o.user_id = ? AND oi.plugin_id = ? AND o.status = 'paid' LIMIT 1`,
    [userId, pluginId]
  )
  return rows.length > 0
}

async function addReview({ pluginId, userId, rating, comment }) {
  const hasPurchased = await userHasPurchased(userId, pluginId)
  if (!hasPurchased) {
    const error = new Error('Purchase required to review')
    error.status = 403
    throw error
  }

  const [existing] = await db.query(
    'SELECT id FROM reviews WHERE user_id = ? AND plugin_id = ? LIMIT 1',
    [userId, pluginId]
  )
  if (existing.length > 0) {
    const error = new Error('Review already submitted')
    error.status = 409
    throw error
  }

  const [result] = await db.query(
    'INSERT INTO reviews (user_id, plugin_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, pluginId, rating, comment]
  )

  const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [result.insertId])
  return rows[0]
}

module.exports = {
  listPlugins,
  getPluginBySlug,
  getPluginById,
  createPlugin,
  createVersion,
  updatePlugin,
  deletePlugin,
  getVersions,
  getMedia,
  getReviews,
  addReview,
  userHasPurchased
}
