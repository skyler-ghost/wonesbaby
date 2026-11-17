import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Accounts are optional. Guests check out with just an email and are never
// forced to create a Customer.
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
)

customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

customerSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

export default mongoose.model('Customer', customerSchema)
