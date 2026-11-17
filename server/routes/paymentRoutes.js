import { Router } from 'express'
import { initiatePayment, verifyPayment, handleWebhook } from '../controllers/paymentController.js'
import { requireFields } from '../middleware/validate.js'

const router = Router()

router.post('/initiate', requireFields('orderNumber', 'email'), initiatePayment)
router.get('/verify/:reference', verifyPayment)

// server.js mounts express.raw on this exact path, so req.body is the raw Buffer
router.post('/webhook', handleWebhook)

export default router
