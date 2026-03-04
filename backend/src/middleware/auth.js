const jwt = require('jsonwebtoken')

function parseToken(req) {
  const authHeader = req.headers.authorization || ''
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '').trim()
  }

  if (req.headers.cookie) {
    const cookie = req.headers.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('token='))

    if (cookie) {
      return cookie.replace('token=', '')
    }
  }

  return null
}

function requireAuth(req, res, next) {
  const token = parseToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

function optionalAuth(req, res, next) {
  const token = parseToken(req)
  if (!token) {
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
  } catch (error) {
    req.user = null
  }

  return next()
}

function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.user.role !== 'user') {
    return res.status(403).json({
      message: 'Admin session detected. Sign in with a user account to continue.'
    })
  }

  return next()
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireUser
}
