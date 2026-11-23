import dotenv from 'dotenv'

dotenv.config()

const required = ['MONGODB_URI', 'JWT_SECRET']
const missing = required.filter((key) => !process.env[key])

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  console.error('Copy .env.example to .env and fill them in.')
  process.exit(1)
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Public URL of the site (no trailing slash). Used for CORS and Stripe's success/cancel redirects.
  clientUrl: (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, ''),
  // First admin, created on startup if no admin exists yet
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  // Payments
  paymentProvider: process.env.PAYMENT_PROVIDER || 'manual',
  paymentSecretKey: process.env.PAYMENT_SECRET_KEY,
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET,
  defaultCurrency: (process.env.DEFAULT_CURRENCY || 'CAD').toUpperCase(),
  shippingFee: Number(process.env.SHIPPING_FEE) || 0,
  // Image storage: set CLOUDINARY_URL (cloudinary://KEY:SECRET@CLOUD_NAME) in production.
  // Without it, uploads go to server/uploads on local disk (fine for development only).
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  // Unpaid online-payment orders are cancelled (and their stock released) after this many hours
  unpaidOrderHours: Number(process.env.UNPAID_ORDER_HOURS) || 24,
  // Email (optional: without SMTP, emails are logged to the console)
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'Wones Baby <no-reply@wonesbaby.com>',
  },
}
