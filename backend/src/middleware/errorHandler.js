function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.message || 'Server error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  const payload = { message }
  if (err.code) {
    payload.code = err.code
  }
  if (err.details) {
    payload.details = err.details
  }

  res.status(status).json(payload)
}

module.exports = errorHandler
