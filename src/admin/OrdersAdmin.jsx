import { useCallback, useEffect, useState } from 'react'
import { formatMoney, imageUrl } from '../lib/api'
import { statusStyle } from './Dashboard'

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Failed', 'Refunded']
const sel = 'text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white'

const OrderDetail = ({ order, call, onChanged, onClose }) => {
  const [status, setStatus] = useState(order.status)
  const [note, setNote] = useState('')
  const [tracking, setTracking] = useState(order.trackingNumber || '')
  const [payment, setPayment] = useState(order.payment.status)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ text: '', bad: false })
  const money = (n) => formatMoney(n, order.currency)

  const run = async (fn, ok) => {
    setBusy(true)
    setMsg({ text: '', bad: false })
    try {
      await fn()
      setMsg({ text: ok, bad: false })
      onChanged()
    } catch (err) {
      setMsg({ text: err.message, bad: true })
    } finally {
      setBusy(false)
    }
  }

  const saveStatus = () =>
    run(() => call(`/api/orders/${order._id}/status`, { method: 'PATCH', body: { status, note: note || undefined, trackingNumber: tracking } }), 'Order updated. The customer is emailed when the status changes.')
  const savePayment = () =>
    run(() => call(`/api/orders/${order._id}/payment`, { method: 'PATCH', body: { status: payment } }), 'Payment status updated.')

  return (
    <div className='fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center overflow-y-auto p-3'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-5 my-4 space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='font-baloo text-xl font-bold text-plum'>{order.orderNumber}</h2>
            <p className='text-xs text-gray-500'>{new Date(order.createdAt).toLocaleString()} · {order.email}</p>
          </div>
          <button onClick={onClose} aria-label='Close' className='text-gray-500 text-xl cursor-pointer'><i className='fa-solid fa-xmark'></i></button>
        </div>

        <div className='grid sm:grid-cols-2 gap-4 text-sm'>
          <div className='rounded-xl bg-lilac/40 p-3'>
            <p className='font-bold text-plum mb-1'>Ship to</p>
            <p>{order.shipping.fullName}</p>
            <p>{order.shipping.phone}</p>
            <p>{order.shipping.address}</p>
            <p>{[order.shipping.city, order.shipping.state, order.shipping.postalCode].filter(Boolean).join(', ')}</p>
            <p>{order.shipping.country}</p>
          </div>
          <div className='rounded-xl bg-blush/40 p-3'>
            <p className='font-bold text-plum mb-1'>Payment</p>
            <p>Method: {order.payment.provider}</p>
            <div className='flex items-center gap-2 mt-2'>
              <select value={payment} onChange={(e) => setPayment(e.target.value)} className={sel}>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              <button disabled={busy || payment === order.payment.status} onClick={savePayment} className='px-3 py-2 rounded-lg bg-plum text-white text-xs font-bold disabled:opacity-40 cursor-pointer'>Update</button>
            </div>
          </div>
        </div>

        <div className='divide-y divide-gray-100'>
          {order.items.map((i) => (
            <div key={`${i.product}`} className='flex items-center gap-3 py-2 text-sm'>
              <img src={imageUrl(i.image)} alt='' className='w-10 h-10 rounded-lg object-cover' />
              <p className='flex-1 min-w-0'>{i.name} <span className='text-gray-500'>× {i.quantity}</span></p>
              <b>{money(i.price * i.quantity)}</b>
            </div>
          ))}
          <p className='flex justify-between pt-2 text-sm'><span>Shipping</span><b>{money(order.shippingFee)}</b></p>
          <p className='flex justify-between pt-2 font-baloo text-plum'><span className='font-bold'>Total</span><b className='text-lg'>{money(order.total)}</b></p>
        </div>

        <div className='rounded-xl border border-gray-100 p-3 space-y-2'>
          <p className='font-bold text-plum text-sm'>Order status</p>
          <div className='flex flex-wrap gap-2'>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder='Tracking number' className={`${sel} flex-1 min-w-[140px]`} />
          </div>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder='Note for the customer (optional)' className={`${sel} w-full`} />
          <button disabled={busy} onClick={saveStatus} className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-sm font-bold cursor-pointer'>{busy ? 'Saving…' : 'Save'}</button>
          {msg.text && <p className={`text-sm font-semibold ${msg.bad ? 'text-red-600' : 'text-green-700'}`}>{msg.text}</p>}
        </div>
      </div>
    </div>
  )
}

const OrdersAdmin = ({ call }) => {
  const [filters, setFilters] = useState({ status: '', paymentStatus: '', q: '' })
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const query = new URLSearchParams({ page, limit: 15, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }).toString()

  const load = useCallback(() => {
    call(`/api/orders?${query}`).then((d) => { setData(d); setError('') }).catch((e) => setError(e.message))
  }, [call, query])
  useEffect(() => { load() }, [load])

  // Keep the open order in sync after an update
  useEffect(() => {
    if (selected && data) {
      const fresh = data.orders.find((o) => o._id === selected._id)
      if (fresh && fresh.updatedAt !== selected.updatedAt) setSelected(fresh)
    }
  }, [data, selected])

  const setFilter = (k) => (e) => { setFilters({ ...filters, [k]: e.target.value }); setPage(1) }

  return (
    <>
      <h1 className='font-baloo text-2xl md:text-3xl font-bold text-plum'>Orders</h1>
      <div className='flex flex-wrap gap-2 mt-4'>
        <input value={filters.q} onChange={setFilter('q')} placeholder='Search order #, email or name' className={`${sel} flex-1 min-w-[200px]`} />
        <select value={filters.status} onChange={setFilter('status')} className={sel}><option value=''>All statuses</option>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={filters.paymentStatus} onChange={setFilter('paymentStatus')} className={sel}><option value=''>All payments</option>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      {error && <p className='mt-3 text-sm font-semibold text-red-600'>{error}</p>}
      {!data && !error && <p className='mt-4 text-sm text-gray-500'>Loading orders…</p>}
      {data && data.orders.length === 0 && <p className='mt-6 text-sm text-gray-500'>No orders found.</p>}

      {data && data.orders.length > 0 && (
        <div className='mt-4 rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-3 overflow-x-auto'>
          <table className='w-full text-sm min-w-[620px]'>
            <thead>
              <tr className='text-left text-xs text-gray-500'><th className='p-2 font-semibold'>Order</th><th className='font-semibold'>Customer</th><th className='font-semibold'>Total</th><th className='font-semibold'>Payment</th><th className='font-semibold'>Status</th><th className='font-semibold'>Date</th></tr>
            </thead>
            <tbody>
              {data.orders.map((o) => (
                <tr key={o._id} onClick={() => setSelected(o)} className='border-t border-gray-100 hover:bg-lilac/20 cursor-pointer'>
                  <td className='p-2 font-semibold'>{o.orderNumber}</td>
                  <td>{o.shipping.fullName}</td>
                  <td className='font-bold'>{formatMoney(o.total, o.currency)}</td>
                  <td>{o.payment.status}</td>
                  <td><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[o.status]}`}>{o.status}</span></td>
                  <td className='text-gray-500'>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.pages > 1 && (
        <div className='flex justify-center items-center gap-3 mt-4 text-sm'>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className='px-3 py-1.5 rounded-full bg-white shadow disabled:opacity-40 cursor-pointer'>Prev</button>
          <span>Page {data.page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className='px-3 py-1.5 rounded-full bg-white shadow disabled:opacity-40 cursor-pointer'>Next</button>
        </div>
      )}

      {selected && <OrderDetail key={selected._id} order={selected} call={call} onChanged={load} onClose={() => setSelected(null)} />}
    </>
  )
}

export default OrdersAdmin
