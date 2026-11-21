import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { env } from './config/env.js'
import connectDB from './config/db.js'
import Admin from './models/Admin.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { uploadsDir } from './middleware/uploadMiddleware.js'
import { startOrderCleanup } from './services/orderCleanup.js'

import authRoutes from './routes/authRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.set('trust proxy', 1) // correct client IPs for rate limiting behind a host's proxy
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })) // lets the frontend load /uploads images
app.use(cors({ origin: env.clientUrl }))

// The payment webhook needs the untouched raw body to check the gateway's signature,
// so this must come before express.json().
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '1mb' }))

app.use('/api', apiLimiter)
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (req, res) => res.json({ ok: true }))
// Public store settings the frontend needs (so currency and shipping are never hardcoded there)
app.get('/api/config', (req, res) =>
  res.json({ currency: env.defaultCurrency, shippingFee: env.shippingFee, paymentProvider: env.paymentProvider })
)
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)

// Serve the built React app (the dist/ folder created by `npm run build`) from this same server.
// It is served whenever the build exists, so it cannot be silently skipped by a missing NODE_ENV.
const dist = path.join(__dirname, '..', 'dist')
const hasBuild = fs.existsSync(path.join(dist, 'index.html'))
if (hasBuild) {
  app.use(express.static(dist))
  app.get(/^(?!\/(api|uploads)\/).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')))
} else {
  // Visible explanation instead of a confusing 404 when the build step did not run
  app.get(/^(?!\/(api|uploads)\/).*/, (req, res) =>
    res
      .status(503)
      .type('text/plain')
      .send(
        'The API is running, but the website has not been built (no dist folder).\n' +
          'On Render set Build Command to:  npm install --include=dev && npm run build\n' +
          'and Start Command to:  npm start'
      )
  )
}

app.use(notFound)
app.use(errorHandler)

// Creates the first (owner) admin from .env if there are no admins yet
const ensureOwnerAdmin = async () => {
  if ((await Admin.countDocuments()) > 0) return
  if (!env.adminEmail || !env.adminPassword) {
    console.warn('No admin exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env and restart.')
    return
  }
  await Admin.create({ name: 'Owner', email: env.adminEmail, password: env.adminPassword, role: 'owner' })
  console.log(`Owner admin created: ${env.adminEmail}`)
}

const start = async () => {
  await connectDB()
  await ensureOwnerAdmin()
  startOrderCleanup()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} (NODE_ENV=${env.nodeEnv})`)
    console.log(hasBuild ? 'Website: serving the built site from dist/' : 'WARNING: dist/ not found. API only, the build step did not run.')
    console.log(`Image storage: ${env.cloudinaryUrl ? 'Cloudinary' : 'LOCAL DISK (images will be lost on Render!)'}`)
    console.log(`Payments: ${env.paymentProvider}${env.paymentProvider === 'stripe' && !env.paymentSecretKey ? ' (WARNING: PAYMENT_SECRET_KEY missing)' : ''}`)
  })
}

start()
