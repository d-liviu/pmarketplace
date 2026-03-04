const path = require('path')

function safeResolve(baseDir, targetPath) {
  const normalizedBase = path.resolve(baseDir)
  const resolvedPath = path.resolve(baseDir, targetPath)

  if (!resolvedPath.startsWith(normalizedBase)) {
    const error = new Error('Invalid file path')
    error.status = 400
    throw error
  }

  return resolvedPath
}

module.exports = {
  safeResolve
}
