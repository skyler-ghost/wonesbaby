import Admin from '../models/Admin.js'
import generateToken from '../utils/generateToken.js'
import { asyncHandler, HttpError } from '../middleware/errorHandler.js'
import { isEmail } from '../middleware/validate.js'

const publicAdmin = (a) => ({ id: a._id, name: a.name, email: a.email, role: a.role })

// POST /api/auth/login
export const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email).toLowerCase().trim()
  const admin = await Admin.findOne({ email }).select('+password')

  if (!admin || !(await admin.matchPassword(String(req.body.password)))) {
    throw new HttpError(401, 'Invalid email or password')
  }

  res.json({ token: generateToken(admin._id, 'admin'), admin: publicAdmin(admin) })
})

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ admin: publicAdmin(req.admin) })
})

// POST /api/auth/admins  (owner only)
export const addAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!isEmail(email)) throw new HttpError(400, 'A valid email is required')
  if (String(password).length < 8) throw new HttpError(400, 'Password must be at least 8 characters')

  const admin = await Admin.create({ name, email, password, role: 'admin' })
  res.status(201).json({ admin: publicAdmin(admin) })
})

// GET /api/auth/admins  (owner only)
export const listAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().sort('createdAt')
  res.json({ admins: admins.map(publicAdmin) })
})
