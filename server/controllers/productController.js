import fs from 'fs/promises'
import path from 'path'
import Product from '../models/Product.js'
import { uploadsDir } from '../middleware/uploadMiddleware.js'
import { asyncHandler, HttpError } from '../middleware/errorHandler.js'

const SORTS = {
  newest: '-createdAt',
  'price-asc': 'price',
  'price-desc': '-price',
  rating: '-rating',
}

const buildFilter = (query, { includeInactive = false } = {}) => {
  const filter = includeInactive ? {} : { active: true }
  if (query.category) filter.category = query.category
  if (query.featured === 'true') filter.featured = true
  if (query.search) filter.$text = { $search: String(query.search) }
  if (query.minPrice || query.maxPrice) {
    filter.price = {}
    if (query.minPrice) filter.price.$gte = Number(query.minPrice)
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice)
  }
  return filter
}

const paginate = async (req, res, includeInactive) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
  const filter = buildFilter(req.query, { includeInactive })
  const sort = SORTS[req.query.sort] || SORTS.newest

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ])
  res.json({ products, total, page, pages: Math.ceil(total / limit) })
}

// GET /api/products  (public: active products only)
export const listProducts = asyncHandler((req, res) => paginate(req, res, false))

// GET /api/products/admin/all  (admin: includes inactive)
export const listAllProducts = asyncHandler((req, res) => paginate(req, res, true))

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product || !product.active) throw new HttpError(404, 'Product not found')
  res.json({ product })
})

const fields = ['name', 'description', 'category', 'price', 'oldPrice', 'stock', 'rating', 'reviews', 'featured', 'active']

const pick = (body) => Object.fromEntries(fields.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]))

const parseImageList = (value) => {
  if (value === undefined) return undefined
  try {
    const list = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(list) ? list.map(String) : undefined
  } catch {
    return undefined
  }
}

const removeFiles = (images = []) =>
  Promise.all(
    images
      .filter((img) => img.startsWith('/uploads/'))
      .map((img) => fs.unlink(path.join(uploadsDir, path.basename(img))).catch(() => {}))
  )

// POST /api/products  (multipart form, image files under "images")
export const createProduct = asyncHandler(async (req, res) => {
  const uploaded = (req.files || []).map((f) => `/uploads/${f.filename}`)
  const product = await Product.create({ ...pick(req.body), images: uploaded })
  res.status(201).json({ product })
})

// PUT /api/products/:id
// Optional body.images (JSON array) sets which existing images to keep;
// any newly uploaded files are added after them.
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw new HttpError(404, 'Product not found')

  const keep = parseImageList(req.body.images)
  if (keep) {
    await removeFiles(product.images.filter((img) => !keep.includes(img)))
    product.images = keep
  }
  const uploaded = (req.files || []).map((f) => `/uploads/${f.filename}`)
  product.images.push(...uploaded)

  product.set(pick(req.body))
  await product.save()
  res.json({ product })
})

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) throw new HttpError(404, 'Product not found')
  await removeFiles(product.images)
  res.json({ message: 'Product deleted' })
})
