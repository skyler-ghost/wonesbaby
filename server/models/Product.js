import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    // Image paths, e.g. /uploads/abc.jpg (or a full URL)
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', description: 'text' })

export default mongoose.model('Product', productSchema)
