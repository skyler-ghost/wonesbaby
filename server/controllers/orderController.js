import Order, { ORDER_STATUSES, PAYMENT_STATUSES } from '../models/Order.js'
import Product from '../models/Product.js'
import Customer from '../models/Customer.js'
import generateOrderNumber from '../utils/generateOrderNumber.js'
import { env } from '../config/env.js'
import { asyncHandler, HttpError } from '../middleware/errorHandler.js'
import { isEmail } from '../middleware/validate.js'
import { sendOrderConfirmation, sendStatusUpdate } from '../services/notificationService.js'
import { markOrderPaid, markOrderPaymentFailed } from '../services/paymentService.js'

const SHIPPING_FIELDS = ['fullName', 'phone', 'address', 'city', 'country']

// What a customer or guest is allowed to see about an order
const publicOrder = (o) => ({
  orderNumber: o.orderNumber,
  status: o.status,
  statusHistory: o.statusHistory,
  trackingNumber: o.trackingNumber,
  items: o.items,
  subtotal: o.subtotal,
  shippingFee: o.shippingFee,
  total: o.total,
  currency: o.currency,
  paymentStatus: o.payment.status,
  shippingTo: { city: o.shipping.city, country: o.shipping.country },
  createdAt: o.createdAt,
})

// POST /api/orders   guest checkout, or logged-in customer if a token is sent
// body: { email, shipping: {...}, items: [{ productId, quantity }] }
export const createOrder = asyncHandler(async (req, res) => {
  const { shipping, items } = req.body
  const email = String(req.body.email || req.customer?.email || '').toLowerCase().trim()

  if (!isEmail(email)) throw new HttpError(400, 'A valid email is required')
  if (!shipping || SHIPPING_FIELDS.some((f) => !String(shipping[f] || '').trim())) {
    throw new HttpError(400, `Shipping details required: ${SHIPPING_FIELDS.join(', ')}`)
  }
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'Your cart is empty')

  // Merge duplicate lines and validate quantities
  const wanted = new Map()
  for (const item of items) {
    const qty = Number(item.quantity)
    if (!item.productId || !Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new HttpError(400, 'Each item needs a productId and a quantity between 1 and 99')
    }
    wanted.set(String(item.productId), (wanted.get(String(item.productId)) || 0) + qty)
  }

  // Prices always come from the database, never from the browser
  const products = await Product.find({ _id: { $in: [...wanted.keys()] }, active: true })
  if (products.length !== wanted.size) throw new HttpError(400, 'One or more products are no longer available')

  const lines = products.map((p) => ({
    product: p._id,
    name: p.name,
    price: p.price,
    image: p.images[0],
    quantity: wanted.get(String(p._id)),
  }))

  // Reserve stock one product at a time, undoing earlier ones if a later one fails
  const reserved = []
  try {
    for (const line of lines) {
      const result = await Product.updateOne(
        { _id: line.product, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } }
      )
      if (result.modifiedCount !== 1) throw new HttpError(409, `Not enough stock for "${line.name}"`)
      reserved.push(line)
    }
  } catch (err) {
    await Promise.all(reserved.map((l) => Product.updateOne({ _id: l.product }, { $inc: { stock: l.quantity } })))
    throw err
  }

  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0) * 100) / 100
  const shippingFee = env.shippingFee
  let order
  try {
    order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.customer?._id || null,
      email,
      shipping: Object.fromEntries(
        ['fullName', 'phone', 'address', 'city', 'state', 'postalCode', 'country'].map((k) => [k, shipping[k]])
      ),
      items: lines,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      // Single price list for now, so every order is in the default currency
      currency: env.defaultCurrency,
      statusHistory: [{ status: 'Pending', note: 'Order placed' }],
      payment: { provider: env.paymentProvider },
    })
  } catch (err) {
    await Promise.all(lines.map((l) => Product.updateOne({ _id: l.product }, { $inc: { stock: l.quantity } })))
    throw err
  }

  sendOrderConfirmation(order)
  res.status(201).json({ order: publicOrder(order) })
})

// POST /api/orders/track   guests track with order number + email
export const trackOrder = asyncHandler(async (req, res) => {
  const orderNumber = String(req.body.orderNumber).trim().toUpperCase()
  const email = String(req.body.email).trim().toLowerCase()

  const order = await Order.findOne({ orderNumber, email })
  // Same message whether the number or the email was wrong
  if (!order) throw new HttpError(404, 'No order found with that order number and email')

  res.json({ order: publicOrder(order) })
})

// GET /api/orders/my   logged-in customers
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.customer._id }).sort('-createdAt')
  res.json({ orders: orders.map(publicOrder) })
})

// GET /api/orders   admin
export const listOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.paymentStatus) filter['payment.status'] = req.query.paymentStatus
  if (req.query.q) {
    const q = String(req.query.q).trim()
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ orderNumber: rx }, { email: rx }, { 'shipping.fullName': rx }]
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ])
  res.json({ orders, total, page, pages: Math.ceil(total / limit) })
})

// GET /api/orders/:id   admin
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw new HttpError(404, 'Order not found')
  res.json({ order })
})

// PATCH /api/orders/:id/status   admin. body: { status, note?, trackingNumber? }
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body
  if (!ORDER_STATUSES.includes(status)) {
    throw new HttpError(400, `Status must be one of: ${ORDER_STATUSES.join(', ')}`)
  }

  const order = await Order.findById(req.params.id)
  if (!order) throw new HttpError(404, 'Order not found')

  const wasCancelled = order.status === 'Cancelled'
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber

  const changed = order.status !== status
  order.status = status
  if (changed || note) order.statusHistory.push({ status, note })
  await order.save()

  // Put stock back the first time an order is cancelled
  if (status === 'Cancelled' && !wasCancelled) {
    await Promise.all(
      order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } }))
    )
  }

  if (changed) sendStatusUpdate(order, note)
  res.json({ order })
})

// PATCH /api/orders/:id/payment   admin, for bank transfer / pay on delivery
// body: { status: 'Paid' | 'Failed' | 'Unpaid' | 'Refunded' }
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!PAYMENT_STATUSES.includes(status)) {
    throw new HttpError(400, `Status must be one of: ${PAYMENT_STATUSES.join(', ')}`)
  }

  const order = await Order.findById(req.params.id)
  if (!order) throw new HttpError(404, 'Order not found')

  if (status === 'Paid') await markOrderPaid(order, 'Payment marked as received by admin')
  else if (status === 'Failed') await markOrderPaymentFailed(order)
  else {
    order.payment.status = status
    await order.save()
  }
  res.json({ order })
})

// GET /api/orders/admin/stats   numbers for the admin dashboard
export const getStats = asyncHandler(async (req, res) => {
  const since = new Date()
  since.setMonth(since.getMonth() - 5)
  since.setDate(1)
  since.setHours(0, 0, 0, 0)

  const [totalOrders, pendingOrders, customers, products, revenueAgg, monthly] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'Pending' }),
    Customer.countDocuments(),
    Product.countDocuments({ active: true }),
    Order.aggregate([
      { $match: { 'payment.status': 'Paid' } },
      { $group: { _id: null, revenue: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { 'payment.status': 'Paid', createdAt: { $gte: since } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, value: { $sum: '$total' } } },
    ]),
  ])

  // Always return the last 6 months, including empty ones
  const sales = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(since.getFullYear(), since.getMonth() + i, 1)
    const hit = monthly.find((x) => x._id.y === d.getFullYear() && x._id.m === d.getMonth() + 1)
    sales.push({ month: d.toLocaleString('en', { month: 'short' }), value: hit ? hit.value : 0 })
  }

  const recent = await Order.find().sort('-createdAt').limit(8)

  res.json({
    totalOrders,
    pendingOrders,
    customers,
    products,
    revenue: revenueAgg[0]?.revenue || 0,
    currency: env.defaultCurrency,
    sales,
    recentOrders: recent,
  })
})
