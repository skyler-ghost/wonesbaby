import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { assets, currency } from '../assets/assets'
import { useCart } from '../context/CartContext'

const money = (n) => `${currency}${n.toFixed(2)}`

const Qty = ({ qty, onChange }) => (
  <div className='inline-flex items-center gap-3 rounded-full border-2 border-blush px-1.5 py-0.5'>
    <button onClick={() => onChange(qty - 1)} aria-label='Decrease' className='w-6 h-6 rounded-full bg-blush text-plum cursor-pointer'><i className='fa-solid fa-minus text-[9px]'></i></button>
    <span className='w-4 text-center text-sm font-bold'>{qty}</span>
    <button onClick={() => onChange(qty + 1)} aria-label='Increase' className='w-6 h-6 rounded-full bg-blush text-plum cursor-pointer'><i className='fa-solid fa-plus text-[9px]'></i></button>
  </div>
)

const Cart = () => {
  const { cartItems, subtotal, updateQty, removeItem, clearCart } = useCart()

  // No checkout page yet: opens an email with the order details
  const checkout = () => {
    const lines = cartItems.map((i) => `${i.qty} x ${i.product.name} - ${money(i.qty * i.product.price)}`).join('\n')
    const body = encodeURIComponent(`Hello Wones Baby, I'd like to order:\n\n${lines}\n\nTotal: ${money(subtotal)}`)
    window.location.href = `mailto:wonesbaby@gmail.com?subject=${encodeURIComponent('New order')}&body=${body}`
    clearCart()
  }

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero
        title='Your Shopping Cart'
        accent=''
        text='Review your items and proceed to checkout'
        image={assets.heroBaby}
      />

      {cartItems.length === 0 ? (
        <div className='text-center py-16'>
          <i className='fa-solid fa-cart-shopping text-5xl text-blush'></i>
          <p className='font-baloo text-2xl font-bold text-plum mt-4'>Your cart is empty</p>
          <p className='text-sm text-gray-500 mt-1'>Add something your little one will love.</p>
          <Link to='/shop' className='inline-block mt-5 px-8 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold transition-all'>Shop Now</Link>
        </div>
      ) : (
        <div className='mt-6 grid lg:grid-cols-[1.8fr_1fr] gap-6'>
          {/* Items */}
          <div className='min-w-0'>
            <div className='rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-3 md:p-5'>
              {/* Desktop header */}
              <div className='hidden md:grid grid-cols-[2.2fr_0.9fr_1.5fr_1fr_0.5fr] gap-2 px-3 pb-3 text-sm font-bold text-plum border-b border-gray-100'>
                <p>Product</p><p>Price</p><p>Quantity</p><p>Total</p><p>Action</p>
              </div>

              {cartItems.map(({ product, qty }) => (
                <div key={product.id} className='py-3 border-b border-gray-100 last:border-0'>
                  {/* Desktop row */}
                  <div className='hidden md:grid grid-cols-[2.2fr_0.9fr_1.5fr_1fr_0.5fr] gap-2 items-center px-3'>
                    <div className='flex items-center gap-3'>
                      <img src={product.image} alt={product.name} className='w-20 h-16 rounded-xl object-cover' />
                      <div>
                        <Link to={`/product/${product.id}`} className='text-sm font-bold text-gray-800 hover:text-primary'>{product.name}</Link>
                        <p className='text-xs text-gray-500'>{product.category} • Safe • BPA Free</p>
                      </div>
                    </div>
                    <p className='font-bold text-gray-800'>{money(product.price)}</p>
                    <Qty qty={qty} onChange={(n) => updateQty(product.id, n)} />
                    <p className='font-bold text-gray-800'>{money(product.price * qty)}</p>
                    <button onClick={() => removeItem(product.id)} aria-label='Remove' className='text-primary text-lg cursor-pointer w-fit'><i className='fa-regular fa-trash-can'></i></button>
                  </div>

                  {/* Mobile row */}
                  <div className='md:hidden flex items-center gap-3'>
                    <img src={product.image} alt={product.name} className='w-20 h-20 rounded-xl object-cover' />
                    <div className='flex-1 min-w-0'>
                      <Link to={`/product/${product.id}`} className='text-sm font-bold text-gray-800 leading-tight block'>{product.name}</Link>
                      <p className='text-sm font-bold text-gray-800 mt-0.5'>{money(product.price)}</p>
                      <div className='mt-1'><Qty qty={qty} onChange={(n) => updateQty(product.id, n)} /></div>
                    </div>
                    <div className='flex flex-col items-end gap-3'>
                      <button onClick={() => removeItem(product.id)} aria-label='Remove' className='text-primary cursor-pointer'><i className='fa-regular fa-trash-can'></i></button>
                      <p className='text-sm font-bold text-gray-800'>{money(product.price * qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex flex-wrap items-center justify-between gap-4 mt-5'>
              <Link to='/shop' className='font-bold text-plum text-sm'><i className='fa-solid fa-arrow-left mr-2'></i>Continue Shopping</Link>
              <p className='hidden md:block text-sm'>Subtotal: <span className='font-baloo text-2xl font-bold text-primary ml-1'>{money(subtotal)}</span></p>
              <button onClick={checkout} className='hidden md:inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold transition-all cursor-pointer'>
                <i className='fa-solid fa-lock text-sm'></i> Proceed to Checkout <i className='fa-solid fa-arrow-right text-sm'></i>
              </button>
            </div>
          </div>

          {/* Summary */}
          <aside className='h-fit rounded-2xl bg-linear-to-b from-blush/70 to-blush/30 p-5 md:p-6'>
            <h2 className='font-baloo text-xl md:text-2xl font-bold text-plum'>Order Summary</h2>
            <div className='mt-4 space-y-2 text-sm'>
              <p className='flex justify-between'><span>Subtotal</span><b>{money(subtotal)}</b></p>
              <p className='flex justify-between'><span>Shipping</span><b>Free</b></p>
            </div>
            <p className='flex justify-between items-baseline mt-4 pt-3 border-t border-white font-baloo text-plum'>
              <span className='text-xl font-bold'>Total</span><span className='text-2xl font-bold'>{money(subtotal)}</span>
            </p>
            <button onClick={checkout} className='md:hidden w-full mt-4 py-3 rounded-full bg-primary text-white font-bold cursor-pointer'>
              <i className='fa-solid fa-lock mr-2 text-sm'></i>Proceed to Checkout <i className='fa-solid fa-arrow-right ml-1 text-sm'></i>
            </button>
            <div className='flex items-center gap-3 mt-5 text-plum'>
              <i className='fa-solid fa-shield-halved text-3xl'></i>
              <div>
                <p className='text-sm font-bold'>Secure Checkout</p>
                <p className='text-xs text-gray-600'>Your information is safe with us.</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Cart
