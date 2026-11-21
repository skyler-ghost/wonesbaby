import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { assets } from '../assets/assets'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { api, imageUrl } from '../lib/api'

const input = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary'
const empty = { email: '', fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', country: '' }

const Checkout = () => {
  const { cartItems, subtotal, shipping, total, clearCart, syncCart } = useCart()
  const { money, paymentProvider } = useStore()
  const card = paymentProvider === 'stripe'
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState(null) // { orderNumber, email, total, currency }

  useEffect(() => { syncCart() }, [syncCart])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { email, ...shippingDetails } = form
      const { order } = await api('/api/orders', {
        method: 'POST',
        body: {
          email,
          shipping: shippingDetails,
          items: cartItems.map((i) => ({ productId: i.product.id, quantity: i.qty })),
        },
      })

      // Start the payment. "manual" has no gateway page; a real gateway returns a URL to send the customer to.
      let paymentUrl = null
      let paymentFailed = false
      try {
        const pay = await api('/api/payments/initiate', { method: 'POST', body: { orderNumber: order.orderNumber, email } })
        paymentUrl = pay.paymentUrl
      } catch {
        paymentFailed = true // the order exists; the customer can pay from the Track Order page
      }

      clearCart()
      if (paymentUrl) {
        window.location.href = paymentUrl
        return
      }
      setPlaced({ orderNumber: order.orderNumber, email, total: order.total, currency: order.currency, paymentFailed })
    } catch (err) {
      setError(err.message)
      syncCart() // stock or prices may have changed
    } finally {
      setBusy(false)
    }
  }

  if (placed) {
    return (
      <div className='px-4 md:px-8 lg:px-16 xl:px-24 py-16 text-center max-w-xl mx-auto'>
        <i className='fa-solid fa-circle-check text-6xl text-leaf'></i>
        <h1 className='font-baloo text-3xl font-bold text-plum mt-4'>Thank you for your order!</h1>
        <p className='mt-2 text-gray-700'>Your order number is</p>
        <p className='font-baloo text-2xl font-bold text-primary mt-1 select-all'>{placed.orderNumber}</p>
        <p className='mt-3 text-sm text-gray-600'>We've sent a confirmation to <b>{placed.email}</b>. Keep your order number: you can track your order with it and your email address.</p>
        {placed.paymentFailed ? (
          <p className='mt-3 text-sm font-semibold text-red-600'>We couldn't open the payment page. Your order is saved: use "Track My Order" below and press Pay Now to try again.</p>
        ) : (
          <p className='mt-3 text-sm text-gray-600'>We'll contact you with payment details and delivery arrangements.</p>
        )}
        <div className='flex flex-wrap justify-center gap-3 mt-6'>
          <Link to={`/track?order=${encodeURIComponent(placed.orderNumber)}`} className='px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold transition-all'>Track My Order</Link>
          <Link to='/shop' className='px-6 py-3 rounded-full bg-lilac text-plum font-bold'>Keep Shopping</Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className='px-4 py-20 text-center'>
        <p className='font-baloo text-2xl font-bold text-plum'>Your cart is empty</p>
        <Link to='/shop' className='inline-block mt-4 px-6 py-2 rounded-full bg-primary text-white font-bold'>Shop Now</Link>
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero title='Checkout' accent='' text='Tell us where to send your order. No account needed.' image={assets.heroBaby} />

      <form onSubmit={onSubmit} className='mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-6'>
        <div className='rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-5 md:p-6'>
          <h2 className='font-baloo text-xl font-bold text-plum mb-4'>Delivery Details</h2>
          <div className='grid sm:grid-cols-2 gap-3'>
            <input name='fullName' value={form.fullName} onChange={onChange} required placeholder='Full Name *' autoComplete='name' className={input} />
            <input name='phone' type='tel' value={form.phone} onChange={onChange} required placeholder='Phone *' autoComplete='tel' className={input} />
          </div>
          <input name='email' type='email' value={form.email} onChange={onChange} required placeholder='Email * (used to track your order)' autoComplete='email' className={`${input} mt-3`} />
          <input name='address' value={form.address} onChange={onChange} required placeholder='Street Address *' autoComplete='street-address' className={`${input} mt-3`} />
          <div className='grid sm:grid-cols-2 gap-3 mt-3'>
            <input name='city' value={form.city} onChange={onChange} required placeholder='City *' className={input} />
            <input name='state' value={form.state} onChange={onChange} placeholder='State / Province' className={input} />
            <input name='postalCode' value={form.postalCode} onChange={onChange} placeholder='Postal Code' className={input} />
            <input name='country' value={form.country} onChange={onChange} required placeholder='Country *' className={input} />
          </div>
        </div>

        <aside className='h-fit rounded-2xl bg-linear-to-b from-blush/70 to-blush/30 p-5 md:p-6'>
          <h2 className='font-baloo text-xl md:text-2xl font-bold text-plum'>Order Summary</h2>
          <div className='mt-3 space-y-3'>
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} className='flex items-center gap-3 text-sm'>
                <img src={imageUrl(product.image)} alt='' className='w-12 h-12 rounded-lg object-cover' />
                <p className='flex-1 min-w-0 leading-tight'>{product.name} <span className='text-gray-500'>× {qty}</span></p>
                <b>{money(product.price * qty)}</b>
              </div>
            ))}
          </div>
          <div className='mt-4 pt-3 border-t border-white space-y-2 text-sm'>
            <p className='flex justify-between'><span>Subtotal</span><b>{money(subtotal)}</b></p>
            <p className='flex justify-between'><span>Shipping</span><b>{shipping > 0 ? money(shipping) : 'Free'}</b></p>
          </div>
          <p className='flex justify-between items-baseline mt-3 pt-3 border-t border-white font-baloo text-plum'>
            <span className='text-xl font-bold'>Total</span><span className='text-2xl font-bold'>{money(total)}</span>
          </p>
          {error && <p className='mt-3 text-sm font-semibold text-red-600 bg-white/70 rounded-xl px-3 py-2'>{error}</p>}
          <button type='submit' disabled={busy} className='w-full mt-4 py-3 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold cursor-pointer transition-all'>
            <i className={`fa-solid ${card ? 'fa-credit-card' : 'fa-lock'} mr-2 text-sm`}></i>{busy ? 'Please wait…' : card ? 'Pay with Card' : 'Place Order'}
          </button>
          <p className='mt-2 text-center text-xs text-gray-600'>
            {card
              ? <><i className='fa-brands fa-stripe text-lg align-middle mr-1'></i>You'll pay securely on Stripe's payment page next.</>
              : "We'll contact you with payment details after you place your order."}
          </p>
          <Link to='/cart' className='block text-center mt-3 text-sm font-bold text-plum'><i className='fa-solid fa-arrow-left mr-2'></i>Back to cart</Link>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
