// Wraps async route handlers so thrown errors reach errorHandler
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Throw this from anywhere to send a specific status and message
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const notFound = (req, res, next) => {
  next(new HttpError(404, `Not found: ${req.method} ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500
  let message = err.message || 'Server error'

  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  } else if (err.name === 'CastError') {
    status = 400
    message = `Invalid ${err.path}`
  } else if (err.code === 11000) {
    status = 409
    message = `${Object.keys(err.keyValue || {}).join(', ') || 'Value'} already exists`
  } else if (err.name === 'MulterError') {
    status = 400
  }

  if (status >= 500) console.error(err)

  res.status(status).json({
    message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Server error' : message,
  })
}
