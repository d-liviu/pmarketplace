require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const errorHandler = require('./src/middleware/errorHandler')

const authRoutes = require('./src/routes/auth')
const adminRoutes = require('./src/routes/admin')
const pluginRoutes = require('./src/routes/plugins')
const cartRoutes = require('./src/routes/cart')
const checkoutRoutes = require('./src/routes/checkout')
const licenseRoutes = require('./src/routes/licenses')
const downloadRoutes = require('./src/routes/download')
const ordersRoutes = require('./src/routes/orders')

const app = express()

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3001'

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
)

app.use(express.json())

if (process.env.PLUGIN_STORAGE_ROOT) {
  const publicMediaRoot = path.resolve(process.env.PLUGIN_STORAGE_ROOT, 'uploads', 'media')
  app.use(
    '/uploads/media',
    express.static(publicMediaRoot, {
      fallthrough: true,
      index: false
    })
  )
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/plugins', pluginRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/licenses', licenseRoutes)
app.use('/api/download', downloadRoutes)
app.use('/api/orders', ordersRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
