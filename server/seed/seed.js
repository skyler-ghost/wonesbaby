// Loads the 13 sample products into MongoDB and uploads their photos to the image
// store (Cloudinary when CLOUDINARY_URL is set, otherwise server/uploads).
//
//   npm run seed           skips if products already exist
//   npm run seed -- --force  deletes ALL products first, then re-seeds
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { env } from '../config/env.js'
import Product from '../models/Product.js'
import { saveImage } from '../services/imageService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, 'images')

const products = [
  { name: 'Silicone Elephant Teether (Blue)', category: 'Teethers', image: 'teether-elephant-blue.jpeg', rating: 4.5, reviews: 124, price: 15, oldPrice: 19.99, featured: true },
  { name: 'Silicone Cat Teether (Pink)', category: 'Teethers', image: 'teether-cat-pink.jpeg', rating: 4.5, reviews: 98, price: 15, featured: true },
  { name: 'Silicone Bear Teether (Black)', category: 'Teethers', image: 'teether-bear-black.jpeg', rating: 4, reviews: 76, price: 15, featured: true },
  { name: 'Silicone Baby Bottle (Green)', category: 'Feeding', image: 'feeding-1.jpeg', rating: 4.5, reviews: 86, price: 32, featured: true },
  { name: 'Baby Bottle Set with Straw (Pink & Green)', category: 'Feeding', image: 'feeding-2.jpeg', rating: 4.5, reviews: 64, price: 45, featured: true },
  { name: 'Silicone Bottle with Straw Kit (Green)', category: 'Feeding', image: 'feeding-3.jpeg', rating: 4, reviews: 52, price: 38 },
  { name: 'Silicone Baby Bottle (Pink)', category: 'Feeding', image: 'feeding-4.jpeg', rating: 4.5, reviews: 92, price: 32 },
  { name: 'Wide-Neck Baby Bottle (Pink)', category: 'Feeding', image: 'feeding-6.jpeg', rating: 4, reviews: 71, price: 34 },
  { name: 'Silicone Baby Bottle Duo (Green)', category: 'Feeding', image: 'feeding-7.jpeg', rating: 4, reviews: 48, price: 40 },
  { name: 'Silicone Baby Bottle with Cap (Pink)', category: 'Feeding', image: 'feeding-8.jpeg', rating: 4, reviews: 67, price: 33 },
  { name: 'Baby Bottle Twin Pack (Pink & Green)', category: 'Feeding', image: 'feeding-9.jpeg', rating: 4.5, reviews: 59, price: 58 },
  { name: 'Bottle & Accessories Set (Pink)', category: 'Feeding', image: 'feeding-10.jpeg', rating: 4.5, reviews: 41, price: 52 },
  { name: 'Silicone Baby Bottle Pair (Green & Pink)', category: 'Feeding', image: 'feeding-11.jpeg', rating: 4, reviews: 38, price: 56 },
]

const descriptions = {
  Teethers:
    'Made from 100% food-grade silicone, BPA-free, and designed to be soft, safe and easy for little hands to hold. Its grip-friendly design helps with hand-eye coordination, fine motor skill development and provides relief for teething gums.',
  Feeding:
    'Made from soft, flexible, food-grade silicone that is BPA-free, non-toxic and gentle on your baby. Its easy-grip shape makes feeding time simpler for both baby and parent, and it is easy to clean after every use.',
}

const run = async () => {
  await mongoose.connect(env.mongoUri)

  const existing = await Product.countDocuments()
  if (existing > 0 && !process.argv.includes('--force')) {
    console.log(`${existing} products already exist. Use --force to delete them and re-seed.`)
    return
  }
  if (existing > 0) await Product.deleteMany({})

  const docs = []
  for (const { image, ...rest } of products) {
    const buffer = await fs.readFile(path.join(imagesDir, image))
    // Fixed public id, so re-seeding replaces the photo instead of piling up duplicates
    const url = await saveImage({ buffer, mimetype: 'image/jpeg' }, { publicId: path.parse(image).name })
    docs.push({ ...rest, images: [url], stock: 50, description: descriptions[rest.category] || '' })
  }

  await Product.insertMany(docs)
  console.log(`Seeded ${docs.length} products (stock 50 each).`)
}

run()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
