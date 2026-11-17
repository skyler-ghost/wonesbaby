import Customer from '../models/Customer.js'
import generateToken from '../utils/generateToken.js'
import { asyncHandler, HttpError } from '../middleware/errorHandler.js'
import { isEmail } from '../middleware/validate.js'

const publicCustomer = (c) => ({ id: c._id, name: c.name, email: c.email, phone: c.phone })

// Optional accounts. Checkout never requires these.
// POST /api/customers/register
export const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  if (!isEmail(email)) throw new HttpError(400, 'A valid email is required')
  if (String(password).length < 8) throw new HttpError(400, 'Password must be at least 8 characters')

  const customer = await Customer.create({ name, email, password, phone })
  res.status(201).json({ token: generateToken(customer._id, 'customer'), customer: publicCustomer(customer) })
})

// POST /api/customers/login
export const loginCustomer = asyncHandler(async (req, res) => {
  const email = String(req.body.email).toLowerCase().trim()
  const customer = await Customer.findOne({ email }).select('+password')

  if (!customer || !(await customer.matchPassword(String(req.body.password)))) {
    throw new HttpError(401, 'Invalid email or password')
  }

  res.json({ token: generateToken(customer._id, 'customer'), customer: publicCustomer(customer) })
})

// GET /api/customers/me
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ customer: publicCustomer(req.customer) })
})
