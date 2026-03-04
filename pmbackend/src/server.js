require('dotenv').config()

const fs = require('fs')
const path = require('path')
const cors = require('cors')
const express = require('express')
const db = require('./config/db')
const storageRoutes = require('./routes/storage')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const port = Number(process.env.PORT) || 3010

function getAllowedOrigins() {
  return String(process.env.PMBACKEND_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const allowedOrigins = getAllowedOrigins()
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: false
  })
)

const storageRoot = path.resolve(
  process.env.PMBACKEND_STORAGE_ROOT || path.resolve(__dirname, '..', 'storage')
)
const publicStorageRoot = path.join(storageRoot, 'public')
fs.mkdirSync(publicStorageRoot, { recursive: true })

app.use(
  '/files',
  express.static(publicStorageRoot, {
    index: false,
    fallthrough: true,
    maxAge: '365d',
    immutable: true
  })
)

app.get('/health', async (_req, res, next) => {
  try {
    await db.query('SELECT 1')
    return res.json({ status: 'ok' })
  } catch (error) {
    return next(error)
  }
})

app.use('/api/storage', storageRoutes)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`PMBackend running on port ${port}`)
})
