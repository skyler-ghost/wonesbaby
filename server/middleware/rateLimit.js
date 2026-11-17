import rateLimit from 'express-rate-limit'

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  })

// Whole API
export const apiLimiter = make(15, 300, 'Too many requests, please try again later')
// Login and signup: slows down password guessing
export const authLimiter = make(15, 20, 'Too many attempts, please try again later')
// Guest order tracking: slows down order-number guessing
export const trackLimiter = make(15, 30, 'Too many lookups, please try again later')
