import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { assets } from '../assets/assets'
import { api, formatMoney, imageUrl } from '../lib/api'

const input = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary'
const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered']

const Track = () => {
  const [params] = useSearchParams()
  const [form, setForm] = useState({ orderNumber: params.get('order') || '', email: '' })
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [payBusy, setPayBusy] = useState(false)
  const [payMsg, setPayMsg] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setOrder(null)
    try {
      const data = await api('/api/orders/track', { method: 'POST', body: form })
      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // Start (or restart) payment for an unpaid order, e.g. after closing the Stripe page
  const payNow = async () => {
    setPayBusy(true)
    setPayMsg('')
    try {
      const pay = await api('/api/payments/initiate', { method: 'POST', body: { orderNumber: order.orderNumber, email: form.email } })
      if (pay.paymentUrl) window.location.href = pay.paymentUrl
      else setPayMsg("We'll contact you with payment details for this order.")
    } catch (err) {
      setPayMsg(err.message)
    } finally {
      setPayBusy(false)
    }
  }

  const money = (n) => formatMoney(n, order?.currency)
  const stepIndex = order ? STEPS.indexOf(order.status) : -1

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero crumb='Track Order' title='Track Your' accent='Order' text='Enter your order number and the email you used at checkout.' image={assets.heroBaby} />

      <form onSubmit={onSubmit} className='mt-6 max-w-xl mx-auto rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-5 md:p-6 space-y-3'>
        <input value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} required placeholder='Order number (e.g. WB-XXXX-XXXX)' className={input} />
        <input type='email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder='Email address' className={input} />
        <button type='submit' disabled={busy} className='w-full py-3 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold cursor-pointer transition-all'>
          <i className='fa-solid fa-magnifying-glass mr-2'></i>{busy ? 'Looking…' : 'Track Order'}
        </button>
        {error && <p className='text-sm font-semibold text-red-600 text-center'>{error}</p>}
      </form>

      {order && (
        <div className='mt-6 max-w-3xl mx-auto rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-5 md:p-6'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div>
              <p className='text-xs text-gray-500'>Order</p>
              <p className='font-baloo text-xl font-bold text-plum'>{order.orderNumber}</p>
            </div>
            <p className={`px-4 py-1.5 rounded-full text-sm font-bold ${order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-lilac text-plum'}`}>{order.status}</p>
          </div>

          {order.status !== 'Cancelled' && (
            <div className='grid grid-cols-4 gap-2 mt-5'>
              {STEPS.map((s, i) => (
                <div key={s} className='text-center'>
                  <div className={`h-2 rounded-full ${i <= stepIndex ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <p className={`mt-1 text-[11px] font-semibold ${i <= stepIndex ? 'text-plum' : 'text-gray-400'}`}>{s}</p>
                </div>
              ))}
            </div>
          )}

          <div className='mt-4 text-sm text-gray-700 space-y-1'>
            <p>Payment: <b>{order.paymentStatus}</b></p>
            {['Unpaid', 'Failed'].includes(order.paymentStatus) && order.status !== 'Cancelled' && (
              <div className='py-1'>
                <button onClick={payNow} disabled={payBusy} className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-sm font-bold cursor-pointer transition-all'>
                  <i className='fa-solid fa-credit-card mr-2'></i>{payBusy ? 'One moment…' : 'Pay Now'}
                </button>
                {payMsg && <p className='mt-2 text-xs font-semibold text-red-600'>{payMsg}</p>}
              </div>
            )}
            {order.trackingNumber && <p>Tracking number: <b>{order.trackingNumber}</b></p>}
            <p>Delivering to: <b>{order.shippingTo.city}, {order.shippingTo.country}</b></p>
          </div>

          <div className='mt-4 divide-y divide-gray-100'>
            {order.items.map((i) => (
              <div key={`${i.product}-${i.name}`} className='flex items-center gap-3 py-2 text-sm'>
                <img src={imageUrl(i.image)} alt='' className='w-12 h-12 rounded-lg object-cover' />
                <p className='flex-1 min-w-0'>{i.name} <span className='text-gray-500'>× {i.quantity}</span></p>
                <b>{money(i.price * i.quantity)}</b>
              </div>
            ))}
          </div>
          <div className='mt-3 pt-3 border-t border-gray-100 text-sm space-y-1'>
            <p className='flex justify-between'><span>Subtotal</span><b>{money(order.subtotal)}</b></p>
            <p className='flex justify-between'><span>Shipping</span><b>{order.shippingFee > 0 ? money(order.shippingFee) : 'Free'}</b></p>
            <p className='flex justify-between font-baloo text-lg text-plum'><span className='font-bold'>Total</span><b>{money(order.total)}</b></p>
          </div>

          {order.statusHistory?.length > 0 && (
            <div className='mt-5'>
              <p className='font-baloo font-bold text-plum mb-1'>History</p>
              <ul className='text-xs text-gray-600 space-y-1'>
                {[...order.statusHistory].reverse().map((h, i) => (
                  <li key={i}><b>{h.status}</b>{h.note ? ` — ${h.note}` : ''} <span className='text-gray-400'>({new Date(h.at).toLocaleString()})</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Track
