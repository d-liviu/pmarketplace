const path = require('path')

function ensureInsideRoot(baseDir, targetPath) {
  const normalizedBase = path.resolve(baseDir)
  const resolvedPath = path.resolve(baseDir, targetPath)

  if (!resolvedPath.startsWith(normalizedBase)) {
    const error = new Error('Invalid path')
    error.status = 400
    throw error
  }

  return resolvedPath
}

module.exports = {
  ensureInsideRoot
}
