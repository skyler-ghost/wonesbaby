import { Router } from 'express'
import { loginAdmin, getMe, addAdmin, listAdmins } from '../controllers/authController.js'
import { protectAdmin, requireOwner } from '../middleware/authMiddleware.js'
import { requireFields } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/login', authLimiter, requireFields('email', 'password'), loginAdmin)
router.get('/me', protectAdmin, getMe)

// Only the owner can add or list admins
router.post('/admins', protectAdmin, requireOwner, requireFields('email', 'password'), addAdmin)
router.get('/admins', protectAdmin, requireOwner, listAdmins)

export default router
