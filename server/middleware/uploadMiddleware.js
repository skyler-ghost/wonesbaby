import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { HttpError } from './errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const allowed = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
export const allowedImageTypes = allowed

// Files are held in memory and then handed to imageService, which stores them on
// Cloudinary (production) or in server/uploads (local development).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (req, file, cb) => {
    if (allowed[file.mimetype]) return cb(null, true)
    cb(new HttpError(400, 'Only JPG, PNG or WebP images are allowed'))
  },
})

// Form field name: "images" (up to 6 files, 5MB each)
export const uploadProductImages = upload.array('images', 6)
