import { Router } from 'express'
import { registerCustomer, loginCustomer, getProfile } from '../controllers/customerController.js'
import { protectCustomer } from '../middleware/authMiddleware.js'
import { requireFields } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/register', authLimiter, requireFields('name', 'email', 'password'), registerCustomer)
router.post('/login', authLimiter, requireFields('email', 'password'), loginCustomer)
router.get('/me', protectCustomer, getProfile)

export default router
