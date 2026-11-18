import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import ContactBanner from '../components/ContactBanner'
import { assets } from '../assets/assets'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { useApi } from '../lib/useApi'
import { imageUrl } from '../lib/api'

const highlights = [
  { icon: 'fa-shield-halved', label: 'Safe & Non-Toxic' },
  { icon: 'fa-leaf', label: 'BPA Free' },
  { icon: 'fa-face-smile', label: 'Easy to Clean' },
  { icon: 'fa-gem', label: 'Durable & Flexible' },
]

const tabs = [
  { key: 'description', label: 'Description', icon: 'fa-file-lines' },
  { key: 'reviews', label: 'Reviews', icon: 'fa-star' },
  { key: 'shipping', label: 'Shipping & Returns', icon: 'fa-truck' },
]

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { money } = useStore()
  const { data, loading, error, status } = useApi(`/api/products/${id}`)
  const product = data?.product

  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [wish, setWish] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [added, setAdded] = useState(false)

  if (loading) {
    return <p className='px-4 py-20 text-center text-sm text-gray-500'>Loading product…</p>
  }

  if (!product) {
    return (
      <div className='px-4 py-20 text-center'>
        <p className='font-baloo text-2xl font-bold text-plum'>{status === 404 || status === 400 ? 'Product not found' : 'Something went wrong'}</p>
        {error && status !== 404 && status !== 400 && <p className='text-sm text-gray-500 mt-1'>{error}</p>}
        <Link to='/shop' className='inline-block mt-4 px-6 py-2 rounded-full bg-primary text-white font-bold'>Back to Shop</Link>
      </div>
    )
  }

  const gallery = product.images.map(imageUrl)
  const onSale = product.oldPrice > product.price
  const save = onSale ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const soldOut = product.stock <= 0
  const lowStock = !soldOut && product.stock <= 5
  const maxQty = Math.min(99, Math.max(1, product.stock))
  const description = product.description || `The ${product.name} is a safe, soft and BPA-free silicone product made for little ones.`

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      {/* Breadcrumb */}
      <p className='inline-flex flex-wrap items-center gap-2 mt-4 px-4 py-2 rounded-full bg-blush/60 text-xs font-semibold text-plum'>
        <i className='fa-solid fa-house text-[10px]'></i>
        <Link to='/'>Home</Link> <i className='fa-solid fa-angle-right text-[8px]'></i>
        <Link to='/shop'>Shop</Link> <i className='fa-solid fa-angle-right text-[8px]'></i>
        <span className='text-gray-600'>{product.name}</span>
      </p>

      <div className='mt-5 grid lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-10'>
        {/* Gallery */}
        <div className='min-w-0'>
          <div className='relative overflow-hidden rounded-3xl bg-peach/40'>
            <img src={gallery[active] || ''} alt={product.name} onClick={() => setZoom(!zoom)} className={`w-full aspect-square object-cover transition-transform duration-300 cursor-zoom-in ${zoom ? 'scale-150 cursor-zoom-out' : ''}`} />
            <p className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-white text-xs font-bold ${soldOut ? 'bg-gray-500' : 'bg-primary'}`}>{soldOut ? 'Out of Stock' : lowStock ? `Only ${product.stock} left` : 'In Stock'}</p>
            <button onClick={() => setZoom(!zoom)} aria-label='Zoom' className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow text-plum cursor-pointer'>
              <i className='fa-solid fa-magnifying-glass-plus'></i>
            </button>
          </div>
          {gallery.length > 1 && <div className='grid grid-cols-4 gap-3 mt-3'>
            {gallery.map((img, i) => (
              <button key={i} onClick={() => { setActive(i); setZoom(false) }} className={`rounded-xl overflow-hidden border-2 cursor-pointer ${active === i ? 'border-primary' : 'border-transparent'}`}>
                <img src={img} alt='' className='w-full aspect-square object-cover' />
              </button>
            ))}
          </div>}
        </div>

        {/* Details */}
        <div className='min-w-0'>
          <div className='flex items-start justify-between gap-4'>
            <h1 className='font-baloo text-2xl md:text-4xl font-bold text-plum leading-tight'>{product.name}</h1>
            <button onClick={() => setWish(!wish)} aria-label='Wishlist' className='text-3xl text-primary cursor-pointer'>
              <i className={`${wish ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
            </button>
          </div>

          {product.reviews > 0 && (
            <div className='flex items-center gap-2 mt-2'>
              <StarRating rating={product.rating} />
              <span className='text-sm text-gray-700'>{product.rating} ({product.reviews} reviews)</span>
            </div>
          )}

          <p className='mt-4 flex flex-wrap items-center gap-3'>
            <span className='font-baloo text-3xl md:text-4xl font-bold text-primary'>{money(product.price)}</span>
            {onSale && (
              <>
                <span className='text-gray-500 line-through'>{money(product.oldPrice)}</span>
                <span className='px-3 py-1 rounded-full bg-blush text-primary text-xs font-bold'>Save {save}%</span>
              </>
            )}
          </p>

          <p className='mt-4 text-sm md:text-base text-gray-700 max-w-xl'>{description}</p>

          {/* Highlights */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5'>
            {highlights.map((h) => (
              <div key={h.label} className='rounded-2xl bg-blush/60 py-4 px-2 text-center'>
                <i className={`fa-solid ${h.icon} text-xl text-plum`}></i>
                <p className='text-xs font-semibold text-gray-800 mt-2'>{h.label}</p>
              </div>
            ))}
          </div>

          {/* Quantity + cart */}
          <div className='flex flex-wrap items-center gap-3 mt-6'>
            <span className='font-bold text-plum'>Quantity:</span>
            <div className='flex items-center gap-4 rounded-full border-2 border-blush px-2 py-1'>
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label='Decrease' className='w-8 h-8 rounded-full bg-blush text-plum cursor-pointer'><i className='fa-solid fa-minus text-xs'></i></button>
              <span className='w-4 text-center font-bold'>{qty}</span>
              <button onClick={() => setQty(Math.min(maxQty, qty + 1))} aria-label='Increase' className='w-8 h-8 rounded-full bg-blush text-plum cursor-pointer'><i className='fa-solid fa-plus text-xs'></i></button>
            </div>
            <button onClick={handleAdd} disabled={soldOut} className='flex-1 min-w-[180px] py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/30 transition-all cursor-pointer disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed'>
              <i className='fa-solid fa-cart-shopping mr-2'></i>{soldOut ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>

          <button onClick={() => setWish(!wish)} className='w-full mt-3 py-2 rounded-full bg-blush/60 text-primary font-semibold text-sm cursor-pointer'>
            <i className={`${wish ? 'fa-solid' : 'fa-regular'} fa-heart mr-2`}></i>{wish ? 'Added to Wishlist' : 'Add to Wishlist'}
          </button>

          <div className='flex flex-wrap gap-x-10 gap-y-2 mt-5 text-sm'>
            <p><i className='fa-solid fa-location-dot text-plum mr-2'></i><b className='text-plum'>Availability:</b> {soldOut ? <span className='text-gray-500 font-semibold'>● Out of Stock</span> : <span className='text-leaf font-semibold'>● In Stock</span>}</p>
            <p><i className='fa-solid fa-truck-fast text-leaf mr-2'></i><b className='text-plum'>Estimated Delivery:</b> 2 – 5 Business Days</p>
          </div>

          {/* Tabs */}
          <div className='mt-6 rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-3 md:p-4'>
            <div className='flex gap-2 overflow-x-auto no-scrollbar'>
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold cursor-pointer ${tab === t.key ? 'bg-plum text-white' : 'text-plum'}`}>
                  <i className={`fa-regular ${t.icon}`}></i>
                  {t.label}{t.key === 'reviews' && product.reviews > 0 && ` (${product.reviews})`}
                </button>
              ))}
            </div>
            <div className='mt-3 px-2 text-sm text-gray-700'>
              {tab === 'description' && (
                <p>{description}</p>
              )}
              {tab === 'reviews' && (
                product.reviews > 0
                  ? <p className='flex items-center gap-2'><StarRating rating={product.rating} /> {product.rating} out of 5, based on {product.reviews} reviews.</p>
                  : <p>No reviews yet.</p>
              )}
              {tab === 'shipping' && (
                <p>Orders are delivered within 2 – 5 business days. Local pickup is available in Surulere, Lagos and Gonin-Gora, Kaduna. If something isn't right with your order, contact us and we'll help with a return or exchange.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ContactBanner title='Need Help Choosing?' text='Our baby product experts are here to help!' image={assets.story.baby} />
    </div>
  )
}

export default ProductDetails
