import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import ContactBanner from '../components/ContactBanner'
import { assets, allProducts, categoryInfo, currency } from '../assets/assets'
import { useCart } from '../context/CartContext'

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
  const product = allProducts.find((p) => p.id === Number(id))

  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [wish, setWish] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className='px-4 py-20 text-center'>
        <p className='font-baloo text-2xl font-bold text-plum'>Product not found</p>
        <Link to='/shop' className='inline-block mt-4 px-6 py-2 rounded-full bg-primary text-white font-bold'>Back to Shop</Link>
      </div>
    )
  }

  // Gallery: this product's photo first, then other photos from the same category
  const gallery = [product.image, ...allProducts.filter((p) => p.category === product.category && p.id !== product.id).map((p) => p.image)].slice(0, 4)

  const save = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

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
            <img src={gallery[active]} alt={product.name} onClick={() => setZoom(!zoom)} className={`w-full aspect-square object-cover transition-transform duration-300 cursor-zoom-in ${zoom ? 'scale-150 cursor-zoom-out' : ''}`} />
            <p className='absolute top-4 left-4 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold'>In Stock</p>
            <button onClick={() => setZoom(!zoom)} aria-label='Zoom' className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow text-plum cursor-pointer'>
              <i className='fa-solid fa-magnifying-glass-plus'></i>
            </button>
          </div>
          <div className='grid grid-cols-4 gap-3 mt-3'>
            {gallery.map((img, i) => (
              <button key={i} onClick={() => { setActive(i); setZoom(false) }} className={`rounded-xl overflow-hidden border-2 cursor-pointer ${active === i ? 'border-primary' : 'border-transparent'}`}>
                <img src={img} alt='' className='w-full aspect-square object-cover' />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className='min-w-0'>
          <div className='flex items-start justify-between gap-4'>
            <h1 className='font-baloo text-2xl md:text-4xl font-bold text-plum leading-tight'>{product.name}</h1>
            <button onClick={() => setWish(!wish)} aria-label='Wishlist' className='text-3xl text-primary cursor-pointer'>
              <i className={`${wish ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
            </button>
          </div>

          <div className='flex items-center gap-2 mt-2'>
            <StarRating rating={product.rating} />
            <span className='text-sm text-gray-700'>{product.rating} ({product.reviews} reviews)</span>
          </div>

          <p className='mt-4 flex flex-wrap items-center gap-3'>
            <span className='font-baloo text-3xl md:text-4xl font-bold text-primary'>{currency}{product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <>
                <span className='text-gray-500 line-through'>{currency}{product.oldPrice}</span>
                <span className='px-3 py-1 rounded-full bg-blush text-primary text-xs font-bold'>Save {save}%</span>
              </>
            )}
          </p>

          <p className='mt-4 text-sm md:text-base text-gray-700 max-w-xl'>
            The <b>{product.name}</b> {categoryInfo[product.category]}
          </p>

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
              <button onClick={() => setQty(qty + 1)} aria-label='Increase' className='w-8 h-8 rounded-full bg-blush text-plum cursor-pointer'><i className='fa-solid fa-plus text-xs'></i></button>
            </div>
            <button onClick={handleAdd} className='flex-1 min-w-[180px] py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/30 transition-all cursor-pointer'>
              <i className='fa-solid fa-cart-shopping mr-2'></i>{added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>

          <button onClick={() => setWish(!wish)} className='w-full mt-3 py-2 rounded-full bg-blush/60 text-primary font-semibold text-sm cursor-pointer'>
            <i className={`${wish ? 'fa-solid' : 'fa-regular'} fa-heart mr-2`}></i>{wish ? 'Added to Wishlist' : 'Add to Wishlist'}
          </button>

          <div className='flex flex-wrap gap-x-10 gap-y-2 mt-5 text-sm'>
            <p><i className='fa-solid fa-location-dot text-plum mr-2'></i><b className='text-plum'>Availability:</b> <span className='text-leaf font-semibold'>● In Stock</span></p>
            <p><i className='fa-solid fa-truck-fast text-leaf mr-2'></i><b className='text-plum'>Estimated Delivery:</b> 2 – 5 Business Days</p>
          </div>

          {/* Tabs */}
          <div className='mt-6 rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-3 md:p-4'>
            <div className='flex gap-2 overflow-x-auto no-scrollbar'>
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold cursor-pointer ${tab === t.key ? 'bg-plum text-white' : 'text-plum'}`}>
                  <i className={`fa-regular ${t.icon}`}></i>
                  {t.label}{t.key === 'reviews' && ` (${product.reviews})`}
                </button>
              ))}
            </div>
            <div className='mt-3 px-2 text-sm text-gray-700'>
              {tab === 'description' && (
                <p>The {product.name} {categoryInfo[product.category]}</p>
              )}
              {tab === 'reviews' && (
                <p className='flex items-center gap-2'><StarRating rating={product.rating} /> {product.rating} out of 5, based on {product.reviews} reviews.</p>
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
