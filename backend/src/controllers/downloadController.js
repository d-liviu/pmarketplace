const { getDownloadPath } = require('../services/downloadService')

async function download(req, res, next) {
  try {
    const pluginId = req.params.pluginId
    const versionId = req.query.versionId ? Number(req.query.versionId) : null
    const result = await getDownloadPath(req.user.id, pluginId, {
      versionId: Number.isNaN(versionId) ? null : versionId
    })
    res.download(result.path)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  download
}
