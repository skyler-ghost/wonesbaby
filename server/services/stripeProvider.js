import Stripe from 'stripe'
import { env } from '../config/env.js'
import { HttpError } from '../middleware/errorHandler.js'

/*
 * Stripe Checkout (Stripe's hosted payment page). Card details never touch this server.
 *   PAYMENT_PROVIDER=stripe
 *   PAYMENT_SECRET_KEY=sk_live_... (or sk_test_...)
 *   PAYMENT_WEBHOOK_SECRET=whsec_... (from the webhook endpoint in the Stripe dashboard)
 *
 * Fits the provider interface in paymentService.js. payment.reference is the Checkout Session id.
 * Amounts: Stripe uses the smallest currency unit. CAD, USD and NGN all have 2 decimals, so x100.
 */

let client
const stripe = () => {
  if (!env.paymentSecretKey) throw new HttpError(500, 'Stripe is not configured (set PAYMENT_SECRET_KEY)')
  return (client ||= new Stripe(env.paymentSecretKey))
}

const toMinor = (amount) => Math.round(amount * 100)
const toMajor = (minor) => (minor ?? 0) / 100

// Stripe only accepts absolute https image URLs (Cloudinary ones qualify, local /uploads paths don't)
const stripeImages = (image) => (image && /^https:\/\//.test(image) ? [image] : undefined)

// Checkout Sessions may expire between 30 minutes and 24 hours from now. Expire a little before
// the unpaid-order cleanup cancels the order, so a customer can't pay for an order that was cancelled.
const expiresAt = () => {
  const hours = Math.min(24, Math.max(0.5, env.unpaidOrderHours - 1))
  return Math.floor(Date.now() / 1000 + hours * 3600)
}

const stripeProvider = {
  name: 'stripe',

  async initialize(order) {
    const lineItems = order.items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: order.currency.toLowerCase(),
        unit_amount: toMinor(i.price),
        product_data: { name: i.name, images: stripeImages(i.image) },
      },
    }))
    if (order.shippingFee > 0) {
      lineItems.push({
        quantity: 1,
        price_data: { currency: order.currency.toLowerCase(), unit_amount: toMinor(order.shippingFee), product_data: { name: 'Shipping' } },
      })
    }

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.email,
      client_reference_id: order.orderNumber,
      metadata: { orderNumber: order.orderNumber },
      expires_at: expiresAt(),
      success_url: `${env.clientUrl}/payment/result?reference={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/track?order=${encodeURIComponent(order.orderNumber)}`,
    })
    return { reference: session.id, paymentUrl: session.url }
  },

  // True only if the request really came from Stripe (checks the Stripe-Signature header)
  verifyWebhook(rawBody, headers) {
    try {
      stripe().webhooks.constructEvent(rawBody, headers['stripe-signature'], env.paymentWebhookSecret)
      return true
    } catch {
      return false
    }
  },

  // Returns null for events we don't act on, the controller then just answers 200
  parseWebhook(event) {
    const session = event?.data?.object
    if (!session?.id) return null
    const base = { reference: session.id, amount: toMajor(session.amount_total), currency: session.currency }

    switch (event.type) {
      case 'checkout.session.completed':
        // Card payments are "paid" immediately; delayed methods stay "unpaid" until async_payment_succeeded
        return session.payment_status === 'paid' ? { ...base, status: 'success' } : null
      case 'checkout.session.async_payment_succeeded':
        return { ...base, status: 'success' }
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        return { ...base, status: 'failed' }
      default:
        return null
    }
  },

  // Used when the customer returns from Stripe: asks Stripe directly, never trusts the browser
  async verifyTransaction(reference) {
    const session = await stripe().checkout.sessions.retrieve(reference)
    const amount = toMajor(session.amount_total)
    if (session.payment_status === 'paid') return { status: 'success', amount, currency: session.currency }
    if (session.status === 'expired') return { status: 'failed', amount, currency: session.currency }
    return { status: 'pending', amount, currency: session.currency }
  },
}

export default stripeProvider
