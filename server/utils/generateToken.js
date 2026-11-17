import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

// role is 'admin' (covers owner too) or 'customer'
const generateToken = (id, role) =>
  jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

export default generateToken
