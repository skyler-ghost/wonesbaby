import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

// Where Stripe sends the customer after paying. The browser's word is never trusted:
// the server asks Stripe directly (GET /api/payments/verify/:reference).
const PaymentResult = () => {
  const [params] = useSearchParams()
  const reference = params.get('reference')
  const [result, setResult] = useState({ state: reference ? 'checking' : 'error' }) // checking | paid | pending | failed | error

  useEffect(() => {
    if (!reference) return
    let cancelled = false
    let tries = 0

    const check = async () => {
      try {
        const data = await api(`/api/payments/verify/${encodeURIComponent(reference)}`)
        if (cancelled) return
        if (data.paymentStatus === 'Paid') return setResult({ state: 'paid', orderNumber: data.orderNumber })
        if (data.paymentStatus === 'Failed') return setResult({ state: 'failed', orderNumber: data.orderNumber })
        // Still unpaid: give Stripe a few seconds, then tell the customer we're waiting for confirmation
        if (++tries < 4) setTimeout(check, 2500)
        else setResult({ state: 'pending', orderNumber: data.orderNumber })
      } catch (err) {
        if (!cancelled) setResult({ state: 'error', message: err.message })
      }
    }
    check()
    return () => { cancelled = true }
  }, [reference])

  const { state, orderNumber, message } = result
  const trackTo = orderNumber ? `/track?order=${encodeURIComponent(orderNumber)}` : '/track'

  const view = {
    checking: { icon: 'fa-spinner fa-spin text-primary', title: 'Confirming your payment…', text: 'Please wait a moment, do not close this page.' },
    paid: { icon: 'fa-circle-check text-leaf', title: 'Payment received. Thank you!', text: `Your order ${orderNumber} is confirmed. We've emailed you a receipt and will start preparing it.` },
    pending: { icon: 'fa-clock text-amber-400', title: 'Payment is being confirmed', text: `We haven't received confirmation from the bank yet for order ${orderNumber}. You'll get an email as soon as it clears.` },
    failed: { icon: 'fa-circle-xmark text-red-500', title: 'Payment was not completed', text: `Order ${orderNumber} has not been paid. You can try again from the order page.` },
    error: { icon: 'fa-triangle-exclamation text-red-500', title: "We couldn't check your payment", text: message || 'This payment link looks incomplete. If you were charged, contact us with your order number.' },
  }[state]

  return (
    <div className='px-4 py-16 text-center max-w-xl mx-auto'>
      <i className={`fa-solid ${view.icon} text-6xl`}></i>
      <h1 className='font-baloo text-3xl font-bold text-plum mt-4'>{view.title}</h1>
      <p className='mt-3 text-sm text-gray-600'>{view.text}</p>
      {state !== 'checking' && (
        <div className='flex flex-wrap justify-center gap-3 mt-6'>
          <Link to={trackTo} className='px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold transition-all'>{state === 'failed' ? 'Try Again' : 'Track My Order'}</Link>
          <Link to='/shop' className='px-6 py-3 rounded-full bg-lilac text-plum font-bold'>Keep Shopping</Link>
        </div>
      )}
    </div>
  )
}

export default PaymentResult
