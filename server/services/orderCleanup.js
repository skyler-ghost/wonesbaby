import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { env } from '../config/env.js'

// Stock is reserved the moment an order is placed. If a customer abandons the Stripe page the order
// would hold that stock forever, so unpaid online-payment orders are cancelled and restocked after
// UNPAID_ORDER_HOURS. Manual orders (bank transfer / pay on delivery) are left for the owner to handle.
export const cancelStaleUnpaidOrders = async () => {
  const cutoff = new Date(Date.now() - env.unpaidOrderHours * 3600 * 1000)
  const stale = await Order.find({
    status: 'Pending',
    'payment.provider': { $ne: 'manual' },
    'payment.status': { $in: ['Unpaid', 'Failed'] },
    createdAt: { $lt: cutoff },
  }).limit(50)

  for (const candidate of stale) {
    // Atomic claim: only one process (or one run) can flip this order to Cancelled, so stock is restored once
    const order = await Order.findOneAndUpdate(
      { _id: candidate._id, status: 'Pending', 'payment.status': { $in: ['Unpaid', 'Failed'] } },
      { $set: { status: 'Cancelled' }, $push: { statusHistory: { status: 'Cancelled', note: 'Cancelled automatically: payment was not completed', at: new Date() } } },
      { new: true }
    )
    if (!order) continue
    await Promise.all(order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } })))
    console.log(`Cancelled unpaid order ${order.orderNumber} and restored its stock`)
  }
}

export const startOrderCleanup = () => {
  const run = () => cancelStaleUnpaidOrders().catch((err) => console.error(`Order cleanup failed: ${err.message}`))
  setTimeout(run, 30 * 1000) // shortly after boot
  setInterval(run, 30 * 60 * 1000).unref() // then every 30 minutes
}
