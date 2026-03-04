const db = require('../config/db')

async function getPrimaryMediaMap(pluginIds) {
  if (!pluginIds || pluginIds.length === 0) {
    return {}
  }

  const [rows] = await db.query(
    `SELECT pm.plugin_id, pm.url
     FROM plugin_media pm
     INNER JOIN (
       SELECT plugin_id, MIN(COALESCE(position, 0)) AS min_position
       FROM plugin_media
       WHERE type = 'image'
       GROUP BY plugin_id
     ) first_media
     ON pm.plugin_id = first_media.plugin_id AND COALESCE(pm.position, 0) = first_media.min_position
     WHERE pm.type = 'image' AND pm.plugin_id IN (${pluginIds.map(() => '?').join(',')})`,
    pluginIds
  )

  return rows.reduce((acc, row) => {
    acc[row.plugin_id] = [{ url: row.url }]
    return acc
  }, {})
}

module.exports = {
  getPrimaryMediaMap
}
