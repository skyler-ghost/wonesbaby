import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { env } from '../config/env.js'
import { uploadsDir, allowedImageTypes } from '../middleware/uploadMiddleware.js'

/*
 * Where product photos are stored.
 *  - CLOUDINARY_URL set  -> Cloudinary. Products keep full https:// URLs that survive redeploys.
 *  - not set             -> local disk (server/uploads), paths like /uploads/abc.jpg.
 *                           Render's disk is wiped on every deploy, so never rely on this in production.
 */

const FOLDER = 'wonesbaby'
let cloudinary // loaded lazily so local development works without the package configured

const getCloudinary = async () => {
  if (cloudinary) return cloudinary
  const url = new URL(env.cloudinaryUrl) // cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  const { v2 } = await import('cloudinary')
  v2.config({
    cloud_name: url.hostname,
    api_key: decodeURIComponent(url.username),
    api_secret: decodeURIComponent(url.password),
    secure: true,
  })
  cloudinary = v2
  return cloudinary
}

export const usingCloudinary = () => Boolean(env.cloudinaryUrl)

// file: { buffer, mimetype }. Returns the URL/path to store on the product.
const saveOne = async (file, { publicId } = {}) => {
  if (usingCloudinary()) {
    const cld = await getCloudinary()
    return new Promise((resolve, reject) => {
      const stream = cld.uploader.upload_stream(
        { folder: FOLDER, public_id: publicId, overwrite: Boolean(publicId), resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result.secure_url))
      )
      stream.end(file.buffer)
    })
  }
  const ext = allowedImageTypes[file.mimetype] || '.jpg'
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
  await fs.mkdir(uploadsDir, { recursive: true })
  await fs.writeFile(path.join(uploadsDir, name), file.buffer)
  return `/uploads/${name}`
}

export const saveImages = (files = []) => Promise.all(files.map((f) => saveOne(f)))
export const saveImage = saveOne

// "https://res.cloudinary.com/demo/image/upload/v123/wonesbaby/abc.jpg" -> "wonesbaby/abc"
export const publicIdFromUrl = (url) => {
  const m = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(wonesbaby\/[^.]+)\.[a-z0-9]+$/i.exec(url)
  return m ? m[1] : null
}

// Never throws: a failed cleanup must not block saving or deleting a product.
export const deleteImages = async (images = []) => {
  await Promise.all(
    images.map(async (img) => {
      try {
        if (img.startsWith('/uploads/')) {
          await fs.unlink(path.join(uploadsDir, path.basename(img)))
        } else if (usingCloudinary()) {
          const id = publicIdFromUrl(img)
          if (id) await (await getCloudinary()).uploader.destroy(id)
        }
      } catch (err) {
        console.warn(`Could not delete image ${img}: ${err.message}`)
      }
    })
  )
}
