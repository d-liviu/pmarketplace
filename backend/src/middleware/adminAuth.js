const jwt = require('jsonwebtoken')

function parseAdminToken(req) {
  const authHeader = req.headers.authorization || ''
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '').trim()
  }

  if (!req.headers.cookie) {
    return null
  }

  const cookie = req.headers.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('admin_token='))

  if (!cookie) {
    return null
  }

  return cookie.replace('admin_token=', '')
}

function requireAdminAuth(req, res, next) {
  const token = parseAdminToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = {
  requireAdminAuth
}
