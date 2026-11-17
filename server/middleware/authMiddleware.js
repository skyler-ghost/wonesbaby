import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import Admin from '../models/Admin.js'
import Customer from '../models/Customer.js'
import { asyncHandler, HttpError } from './errorHandler.js'

const readToken = (req) => {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}

const decode = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret)
  } catch {
    return null
  }
}

// Admin-only routes
export const protectAdmin = asyncHandler(async (req, res, next) => {
  const payload = decode(readToken(req) || '')
  if (!payload || payload.role !== 'admin') throw new HttpError(401, 'Admin login required')

  const admin = await Admin.findById(payload.id)
  if (!admin) throw new HttpError(401, 'Admin account no longer exists')

  req.admin = admin
  next()
})

// Only the owner admin (can add other admins)
export const requireOwner = (req, res, next) => {
  if (req.admin?.role !== 'owner') return next(new HttpError(403, 'Owner access required'))
  next()
}

// Logged-in customers only
export const protectCustomer = asyncHandler(async (req, res, next) => {
  const payload = decode(readToken(req) || '')
  if (!payload || payload.role !== 'customer') throw new HttpError(401, 'Please log in')

  const customer = await Customer.findById(payload.id)
  if (!customer) throw new HttpError(401, 'Account no longer exists')

  req.customer = customer
  next()
})

// Accounts are optional: attach the customer if a valid token is sent,
// otherwise carry on as a guest.
export const optionalCustomer = asyncHandler(async (req, res, next) => {
  const token = readToken(req)
  const payload = token ? decode(token) : null
  if (payload?.role === 'customer') {
    req.customer = await Customer.findById(payload.id)
  }
  next()
})
