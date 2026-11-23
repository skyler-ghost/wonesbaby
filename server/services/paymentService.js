import { env } from '../config/env.js'
import Order from '../models/Order.js'
import { HttpError } from '../middleware/errorHandler.js'
import { sendPaymentReceived } from './notificationService.js'
import stripeProvider from './stripeProvider.js'

/*
 * All gateway-specific code lives behind this small interface, so adding a
 * second gateway later means registering another provider, nothing else changes.
 *
 * A provider is an object with:
 *   name                                  string
 *   initialize(order)                     -> { reference, paymentUrl }   start a payment
 *   verifyWebhook(rawBody, headers)       -> boolean                     check the signature
 *   parseWebhook(body)                    -> { reference, status, amount, currency }
 *                                            status is 'success' or 'failed'
 *   verifyTransaction(reference)          -> { status, amount, currency }  (optional)
 *
 * Set PAYMENT_PROVIDER in .env to choose which one is used for new payments.
 */

const providers = {
  // Pay on delivery / bank transfer: no gateway, an admin marks the order paid.
  manual: {
    name: 'manual',
    async initialize(order) {
      return { reference: `MAN-${order.orderNumber}`, paymentUrl: null }
    },
  },
  // Card payments through Stripe Checkout. Selected with PAYMENT_PROVIDER=stripe
  stripe: stripeProvider,
}

export const registerProvider = (provider) => {
  providers[provider.name] = provider
}

export const getProvider = (name = env.paymentProvider) => {
  const provider = providers[name]
  if (!provider) {
    throw new HttpError(501, `Payment provider "${name}" is not set up yet`)
  }
  return provider
}

// Idempotent and safe against the webhook and the return-page check running at the same moment:
// the unpaid -> paid flip is one atomic update, so only one caller wins and sends the receipt.
export const markOrderPaid = async (order, note = 'Payment confirmed') => {
  if (order.payment.status === 'Paid') return order

  const claimed = await Order.findOneAndUpdate(
    { _id: order._id, 'payment.status': { $ne: 'Paid' } },
    { $set: { 'payment.status': 'Paid', 'payment.paidAt': new Date() } },
    { new: true }
  )
  if (!claimed) return Order.findById(order._id) // someone else already marked it paid

  if (claimed.status === 'Pending') {
    claimed.status = 'Processing'
    claimed.statusHistory.push({ status: 'Processing', note })
    await claimed.save()
  }
  sendPaymentReceived(claimed)
  return claimed
}

export const markOrderPaymentFailed = async (order) => {
  if (order.payment.status === 'Paid') return order
  order.payment.status = 'Failed'
  await order.save()
  return order
}

export const findOrderByReference = (reference) => Order.findOne({ 'payment.reference': reference })
