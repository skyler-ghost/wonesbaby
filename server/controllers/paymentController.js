import Order from '../models/Order.js'
import { asyncHandler, HttpError } from '../middleware/errorHandler.js'
import {
  getProvider,
  findOrderByReference,
  markOrderPaid,
  markOrderPaymentFailed,
} from '../services/paymentService.js'

// POST /api/payments/initiate   body: { orderNumber, email }
// Guests prove they own the order with the same order number + email used for tracking.
export const initiatePayment = asyncHandler(async (req, res) => {
  const orderNumber = String(req.body.orderNumber).trim().toUpperCase()
  const email = String(req.body.email).trim().toLowerCase()

  const order = await Order.findOne({ orderNumber, email })
  if (!order) throw new HttpError(404, 'Order not found')
  if (order.payment.status === 'Paid') throw new HttpError(409, 'This order is already paid')
  if (order.status === 'Cancelled') throw new HttpError(409, 'This order was cancelled')

  const provider = getProvider(order.payment.provider)
  const { reference, paymentUrl } = await provider.initialize(order)

  order.payment.provider = provider.name
  order.payment.reference = reference
  await order.save()

  res.json({ reference, paymentUrl, provider: provider.name })
})

// GET /api/payments/verify/:reference
// For when the customer returns from the gateway's page. Uses the gateway's own
// records, never anything sent from the browser.
export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await findOrderByReference(req.params.reference)
  if (!order) throw new HttpError(404, 'Payment not found')

  const provider = getProvider(order.payment.provider)
  if (provider.verifyTransaction && order.payment.status !== 'Paid') {
    const result = await provider.verifyTransaction(order.payment.reference)
    const amountOk = result.amount === undefined || Math.abs(result.amount - order.total) < 0.01
    const currencyOk = !result.currency || result.currency.toUpperCase() === order.currency

    if (result.status === 'success' && amountOk && currencyOk) await markOrderPaid(order)
    else if (result.status === 'failed') await markOrderPaymentFailed(order)
  }

  res.json({ orderNumber: order.orderNumber, paymentStatus: order.payment.status })
})

// POST /api/payments/webhook   called by the gateway (raw body, see server.js)
export const handleWebhook = asyncHandler(async (req, res) => {
  const provider = getProvider()
  if (!provider.verifyWebhook || !provider.parseWebhook) {
    throw new HttpError(400, 'This payment provider does not use webhooks')
  }

  const raw = req.body // Buffer, because the route uses express.raw
  if (!provider.verifyWebhook(raw, req.headers)) throw new HttpError(401, 'Invalid signature')

  const event = provider.parseWebhook(JSON.parse(raw.toString('utf8')))
  const order = event && (await findOrderByReference(event.reference))

  // Always answer 200 for events we don't recognise so the gateway stops retrying
  if (!order) return res.sendStatus(200)

  const amountOk = event.amount === undefined || Math.abs(event.amount - order.total) < 0.01
  const currencyOk = !event.currency || event.currency.toUpperCase() === order.currency

  if (event.status === 'success' && amountOk && currencyOk) await markOrderPaid(order)
  else if (event.status === 'failed') await markOrderPaymentFailed(order)

  res.sendStatus(200)
})
