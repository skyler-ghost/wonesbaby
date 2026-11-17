import { Router } from 'express'
import {
  listProducts,
  listAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'
import { uploadProductImages } from '../middleware/uploadMiddleware.js'
import { requireFields } from '../middleware/validate.js'

const router = Router()

// Public
router.get('/', listProducts)

// Admin (must come before '/:id')
router.get('/admin/all', protectAdmin, listAllProducts)

router.get('/:id', getProduct)

// Multer runs before requireFields so multipart form fields are in req.body
router.post('/', protectAdmin, uploadProductImages, requireFields('name', 'category', 'price'), createProduct)
router.put('/:id', protectAdmin, uploadProductImages, updateProduct)
router.delete('/:id', protectAdmin, deleteProduct)

export default router
