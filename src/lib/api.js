// Thin wrapper around fetch for the Express API.
// In development Vite proxies /api and /uploads to the server (see vite.config.js).
// If the frontend is hosted separately from the API, set VITE_API_URL (e.g. https://api.example.com).
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Product images are stored as "/uploads/abc.jpg" (or a full URL)
export const imageUrl = (path) => {
  if (!path) return ''
  return /^(https?:)?\/\//.test(path) ? path : `${BASE}${path}`
}

export const api = async (path, { method = 'GET', body, token, form } = {}) => {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (form) {
    payload = form // FormData: the browser sets the multipart boundary itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.message || `Request failed (${res.status})`, res.status)
  return data
}

export const formatMoney = (amount, currency = 'USD') => {
  const locale = currency === 'NGN' ? 'en-NG' : 'en-US'
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(amount) || 0)
  } catch {
    return `${currency} ${(Number(amount) || 0).toFixed(2)}`
  }
}
