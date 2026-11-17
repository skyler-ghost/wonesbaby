import mongoose from 'mongoose'

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
export const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Failed', 'Refunded']

const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // Snapshot of the product at purchase time
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    // Set only when a logged-in customer places the order. Guests leave it empty.
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    // Always required, this is what guests use to track their order
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    shipping: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, required: true, trim: true },
    },
    items: { type: [itemSchema], validate: (v) => v.length > 0 },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, required: true, uppercase: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    trackingNumber: { type: String, trim: true },
    payment: {
      provider: { type: String, default: 'manual' },
      reference: { type: String, index: true, sparse: true },
      status: { type: String, enum: PAYMENT_STATUSES, default: 'Unpaid' },
      paidAt: Date,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
