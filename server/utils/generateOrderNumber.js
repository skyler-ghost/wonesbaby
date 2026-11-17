import crypto from 'crypto'

// Example: WB-LX3K9A-7F2D. Random suffix makes numbers hard to guess.
const generateOrderNumber = () => {
  const time = Date.now().toString(36).toUpperCase()
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase()
  return `WB-${time}-${rand}`
}

export default generateOrderNumber
