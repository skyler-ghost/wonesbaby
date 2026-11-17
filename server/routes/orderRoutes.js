import { Router } from 'express'
import {
  createOrder,
  trackOrder,
  getMyOrders,
  listOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getStats,
} from '../controllers/orderController.js'
import { protectAdmin, protectCustomer, optionalCustomer } from '../middleware/authMiddleware.js'
import { requireFields } from '../middleware/validate.js'
import { trackLimiter } from '../middleware/rateLimit.js'

const router = Router()

// Guests and logged-in customers (token optional)
router.post('/', optionalCustomer, createOrder)
router.post('/track', trackLimiter, requireFields('orderNumber', 'email'), trackOrder)

// Logged-in customers
router.get('/my', protectCustomer, getMyOrders)

// Admin (fixed paths before '/:id')
router.get('/admin/stats', protectAdmin, getStats)
router.get('/', protectAdmin, listOrders)
router.get('/:id', protectAdmin, getOrder)
router.patch('/:id/status', protectAdmin, requireFields('status'), updateOrderStatus)
router.patch('/:id/payment', protectAdmin, requireFields('status'), updatePaymentStatus)

export default router
