function getConfiguredKeys() {
  return String(process.env.PMBACKEND_API_KEYS || '')
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean)
}

function extractApiKey(req) {
  const headerKey = req.headers['x-pmbackend-key']
  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim()
  }

  const authHeader = req.headers.authorization || ''
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '').trim()
  }

  return ''
}

function optionalApiKey(req, _res, next) {
  const configured = getConfiguredKeys()
  if (configured.length === 0) {
    req.apiKeyAuthorized = true
    return next()
  }

  const provided = extractApiKey(req)
  req.apiKeyAuthorized = Boolean(provided && configured.includes(provided))
  return next()
}

function requireApiKey(req, res, next) {
  const configured = getConfiguredKeys()
  if (configured.length === 0) {
    return next()
  }

  const provided = extractApiKey(req)
  if (!provided || !configured.includes(provided)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return next()
}

module.exports = {
  requireApiKey,
  optionalApiKey
}
