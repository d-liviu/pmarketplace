const licenseService = require('../services/licenseService')

async function listLicenses(req, res, next) {
  try {
    const licenses = await licenseService.getLicenses(req.user.id)
    res.json(licenses)
  } catch (error) {
    next(error)
  }
}

async function getLicense(req, res, next) {
  try {
    const license = await licenseService.getLicenseForPlugin(
      req.user.id,
      req.params.pluginId
    )

    if (!license) {
      return res.status(404).json({ message: 'License not found' })
    }

    res.json(license)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listLicenses,
  getLicense
}
