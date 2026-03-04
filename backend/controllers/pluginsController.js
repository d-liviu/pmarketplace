const db = require('../db')

const getPlugins = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, slug, short_description, price, version FROM plugins ORDER BY created_at DESC'
    )

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getPluginBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const [rows] = await db.query(
      'SELECT * FROM plugins WHERE slug = ?',
      [slug]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Plugin not found' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getPlugins,
  getPluginBySlug
}