// One-time fix for products whose images are still "/uploads/..." paths (lost on Render's wiped disk).
// Uploads each photo to Cloudinary and rewrites the product. Photos are looked up in server/uploads
// first, then server/seed/images (the sample catalogue photos that ship with the repo).
//
//   CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD node server/seed/migrateImages.js
//
// Uses MONGODB_URI from .env, so run it from your computer against the same Atlas database Render uses.
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { env } from '../config/env.js'
import Product from '../models/Product.js'
import { uploadsDir } from '../middleware/uploadMiddleware.js'
import { saveImage, usingCloudinary } from '../services/imageService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedImages = path.join(__dirname, 'images')
const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

const find = async (name) => {
  for (const dir of [uploadsDir, seedImages]) {
    try {
      return await fs.readFile(path.join(dir, name))
    } catch {
      /* try the next folder */
    }
  }
  return null
}

const run = async () => {
  if (!usingCloudinary()) throw new Error('Set CLOUDINARY_URL first, otherwise there is nowhere to move the images to.')
  await mongoose.connect(env.mongoUri)

  let moved = 0
  const missing = []
  for (const product of await Product.find({ images: /^\/uploads\// })) {
    const next = []
    for (const img of product.images) {
      if (!img.startsWith('/uploads/')) {
        next.push(img)
        continue
      }
      const name = path.basename(img)
      const buffer = await find(name)
      if (!buffer) {
        missing.push(`${product.name}: ${img}`)
        next.push(img) // keep the old path so nothing is lost silently
        continue
      }
      next.push(await saveImage({ buffer, mimetype: types[path.extname(name).toLowerCase()] || 'image/jpeg' }, { publicId: path.parse(name).name }))
      moved++
    }
    product.images = next
    await product.save()
  }

  console.log(`Moved ${moved} image(s) to Cloudinary.`)
  if (missing.length) {
    console.log(`\n${missing.length} image(s) could not be found (re-upload these in the admin Products screen):`)
    missing.forEach((m) => console.log(` - ${m}`))
  }
}

run()
  .catch((err) => {
    console.error(err.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
