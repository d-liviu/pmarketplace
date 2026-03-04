function requireFields(payload, fields) {
  const missing = fields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '')
  if (missing.length > 0) {
    const error = new Error(`Missing fields: ${missing.join(', ')}`)
    error.status = 400
    throw error
  }
}

function ensureNumber(value, fieldName) {
  if (value === undefined || value === null) {
    return
  }
  if (Number.isNaN(Number(value))) {
    const error = new Error(`${fieldName} must be a number`)
    error.status = 400
    throw error
  }
}

module.exports = {
  requireFields,
  ensureNumber
}
