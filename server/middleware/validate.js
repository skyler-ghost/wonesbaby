import { HttpError } from './errorHandler.js'

// requireFields('email', 'password') -> 400 if any are missing or blank
export const requireFields =
  (...fields) =>
  (req, res, next) => {
    const missing = fields.filter((f) => {
      const v = req.body?.[f]
      return v === undefined || v === null || (typeof v === 'string' && !v.trim())
    })
    if (missing.length) return next(new HttpError(400, `Missing required fields: ${missing.join(', ')}`))
    next()
  }

export const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
