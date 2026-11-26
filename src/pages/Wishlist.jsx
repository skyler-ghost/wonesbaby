import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { assets } from '../assets/assets'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { useWishlist } from '../context/WishlistContext'
import { api, imageUrl } from '../lib/api'

const Wishlist = () => {
  const { ids, remove } = useWishlist()
  const { addToCart } = useCart()
  const { money } = useStore()
  const [products, setProducts] = useState({}) // id -> product, fetched from the API
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  // Fetch the real product details for the saved IDs (only ones we don't have yet)
  const missing = ids.filter((id) => !products[id]).join(',')
  useEffect(() => {
    if (!missing) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    const wanted = missing.split(',')
    Promise.allSettled(wanted.map((id) => api(`/api/products/${id}`))).then((results) => {
      if (cancelled) return
      const found = {}
      let networkError = false
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') found[wanted[i]] = r.value.product
        // A product that was deleted/hidden (404) or has a bad id (400) is dropped from the wishlist.
        else if ([404, 400].includes(r.reason?.status)) remove(wanted[i])
        else networkError = true
      })
      setProducts((prev) => ({ ...prev, ...found }))
      setFailed(networkError)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [missing, remove])

  const items = ids.map((id) => products[id]).filter(Boolean)

  // Move to cart = add to the cart, then take it off the wishlist
  const moveToCart = (product) => {
    addToCart(product, 1)
    remove(product._id)
  }
  const moveAll = () => items.filter((p) => p.stock > 0).forEach(moveToCart)
  const inStockCount = items.filter((p) => p.stock > 0).length

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero title='Your Wishlist' accent='' text='Products you love, saved on this device' image={assets.heroBottle} />

      {ids.length === 0 ? (
        <div className='text-center py-16'>
          <i className='fa-regular fa-heart text-5xl text-blush'></i>
          <p className='font-baloo text-2xl font-bold text-plum mt-4'>Your wishlist is empty</p>
          <p className='text-sm text-gray-500 mt-1'>Tap the heart on any product to save it here.</p>
          <Link to='/shop' className='inline-block mt-5 px-8 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold transition-all'>Browse Products</Link>
        </div>
      ) : (
        <>
          <div className='flex flex-wrap items-center justify-between gap-3 mt-6'>
            <p className='text-sm font-semibold text-plum'>{ids.length} saved {ids.length === 1 ? 'item' : 'items'}</p>
            {inStockCount > 1 && (
              <button onClick={moveAll} className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold cursor-pointer transition-all'>
                <i className='fa-solid fa-cart-shopping mr-2'></i>Move all to cart
              </button>
            )}
          </div>

          {failed && <p className='mt-3 text-sm font-semibold text-red-600'>Some products couldn't be loaded. Check your connection and refresh.</p>}
          {loading && items.length === 0 && <p className='py-10 text-center text-sm text-gray-500'>Loading your wishlist…</p>}

          <div className='mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5'>
            {items.map((p) => {
              const soldOut = p.stock <= 0
              const onSale = p.oldPrice > p.price
              return (
                <div key={p._id} className='relative rounded-2xl bg-white overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.06)]'>
                  <Link to={`/product/${p._id}`}>
                    <img src={imageUrl(p.images?.[0])} alt={p.name} loading='lazy' className={`w-full aspect-square object-cover bg-peach/30 ${soldOut ? 'opacity-60' : ''}`} />
                  </Link>
                  <button onClick={() => remove(p._id)} aria-label={`Remove ${p.name} from wishlist`} title='Remove' className='absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow text-gray-500 hover:text-red-500 cursor-pointer'>
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                  <div className='p-3'>
                    <Link to={`/product/${p._id}`}><p className='text-sm font-semibold text-gray-800 leading-tight min-h-9'>{p.name}</p></Link>
                    <p className='mt-1 text-sm'>
                      <span className='font-bold text-gray-800'>{money(p.price)}</span>
                      {onSale && <span className='ml-2 text-[11px] text-primary line-through'>{money(p.oldPrice)}</span>}
                    </p>
                    {soldOut && <p className='mt-1 text-xs font-semibold text-gray-500'>Currently out of stock</p>}
                    <button onClick={() => moveToCart(p)} disabled={soldOut} className='mt-3 w-full py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed'>
                      <i className='fa-solid fa-cart-shopping mr-1.5'></i>{soldOut ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default Wishlist
