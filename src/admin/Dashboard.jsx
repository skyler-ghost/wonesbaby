import { useEffect, useState } from 'react'
import { formatMoney } from '../lib/api'

export const statusStyle = {
  Pending: 'bg-amber-100 text-amber-600',
  Processing: 'bg-lilac text-plum',
  Shipped: 'bg-sky-100 text-sky-700',
  Delivered: 'bg-mint text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
}

// Round the chart's top value up to a "nice" number so the axis labels read well
const niceMax = (v) => {
  if (v <= 0) return 100
  const pow = 10 ** Math.floor(Math.log10(v))
  return Math.ceil(v / pow) * pow
}

const compact = (n) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

// Simple SVG line chart (no chart library needed)
const SalesChart = ({ data }) => {
  const W = 420, H = 190, padL = 40, padB = 24, padT = 10
  const max = niceMax(Math.max(...data.map((d) => d.value), 0))
  const x = (i) => padL + (i * (W - padL - 10)) / Math.max(1, data.length - 1)
  const y = (v) => padT + (1 - v / max) * (H - padT - padB)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${H - padB} L${x(0)},${H - padB} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className='w-full'>
      <defs>
        <linearGradient id='fill' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#FF4D8D' stopOpacity='0.25' />
          <stop offset='1' stopColor='#FF4D8D' stopOpacity='0' />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((n) => {
        const t = (max / 3) * n
        return (
          <g key={n}>
            <line x1={padL} x2={W - 10} y1={y(t)} y2={y(t)} stroke='#eee' />
            <text x={padL - 6} y={y(t) + 3} textAnchor='end' fontSize='9' fill='#888'>{compact(t)}</text>
          </g>
        )
      })}
      <path d={area} fill='url(#fill)' />
      <path d={line} fill='none' stroke='#FF4D8D' strokeWidth='2.5' strokeLinejoin='round' />
      {data.map((d, i) => (
        <g key={`${d.month}-${i}`}>
          <circle cx={x(i)} cy={y(d.value)} r='3.5' fill='#fff' stroke='#FF4D8D' strokeWidth='2' />
          <text x={x(i)} y={H - 6} textAnchor='middle' fontSize='9' fill='#888'>{d.month}</text>
        </g>
      ))}
    </svg>
  )
}

const Dashboard = ({ call, admin, go }) => {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [range, setRange] = useState(6)

  useEffect(() => {
    call('/api/orders/admin/stats').then(setStats).catch((e) => setError(e.message))
  }, [call])

  if (error) return <p className='text-sm font-semibold text-red-600'>{error}</p>
  if (!stats) return <p className='text-sm text-gray-500'>Loading dashboard…</p>

  const money = (n, c = stats.currency) => formatMoney(n, c)
  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: 'fa-cart-shopping', bg: 'bg-blush', color: 'text-primary' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: 'fa-hourglass-half', bg: 'bg-peach', color: 'text-orange-400' },
    { label: 'Revenue (paid)', value: money(stats.revenue), icon: 'fa-wallet', bg: 'bg-lilac', color: 'text-plum' },
    { label: 'Active Products', value: stats.products, icon: 'fa-box', bg: 'bg-mint', color: 'text-leaf' },
  ]
  const card = 'rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-4'

  return (
    <>
      <h1 className='font-baloo text-2xl md:text-3xl font-bold text-plum'>Dashboard</h1>
      <p className='text-sm text-gray-600'>Welcome back, {admin.name || admin.email}! Here's what's happening.</p>

      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mt-5'>
        {cards.map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.bg}`}>
            <i className={`fa-solid ${s.icon} text-2xl md:text-3xl ${s.color} hidden sm:block`}></i>
            <div className='min-w-0'>
              <p className='text-xs text-gray-600'>{s.label}</p>
              <p className='font-baloo text-xl md:text-2xl font-bold text-gray-800 truncate'>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid xl:grid-cols-[1fr_1.35fr_0.7fr] gap-4 mt-4'>
        <section className={card}>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='font-baloo font-bold text-plum'>Sales Overview</h2>
            <select value={range} onChange={(e) => setRange(Number(e.target.value))} className='text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none'>
              <option value={6}>Last 6 Months</option>
              <option value={3}>Last 3 Months</option>
            </select>
          </div>
          <SalesChart data={stats.sales.slice(-range)} />
          <p className='text-[11px] text-gray-400 mt-1'>Paid orders only, in {stats.currency}.</p>
        </section>

        <section className={`${card} overflow-x-auto`}>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='font-baloo font-bold text-plum'>Recent Orders</h2>
            <button onClick={() => go('orders')} className='text-xs font-semibold text-primary cursor-pointer'>View All <i className='fa-solid fa-arrow-right text-[9px]'></i></button>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className='text-sm text-gray-500 py-6 text-center'>No orders yet.</p>
          ) : (
            <table className='w-full text-xs min-w-[380px]'>
              <thead>
                <tr className='text-left text-gray-500'><th className='py-2 font-semibold'>Order</th><th className='font-semibold'>Customer</th><th className='font-semibold'>Amount</th><th className='font-semibold'>Status</th><th className='font-semibold'>Date</th></tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className='border-t border-gray-100'>
                    <td className='py-3'>{o.orderNumber}</td>
                    <td>{o.shipping.fullName}</td>
                    <td className='font-bold'>{money(o.total, o.currency)}</td>
                    <td><span className={`px-2.5 py-1 rounded-full font-semibold ${statusStyle[o.status]}`}>{o.status}</span></td>
                    <td className='text-gray-500'>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={card}>
          <h2 className='font-baloo font-bold text-plum mb-2'>Quick Actions</h2>
          <div className='space-y-2'>
            {[['Manage Products', 'fa-tag', 'products'], ['View Orders', 'fa-cart-shopping', 'orders']].map(([name, icon, key]) => (
              <button key={key} onClick={() => go(key)} className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-lilac/60 text-sm font-semibold text-plum hover:bg-lilac cursor-pointer'>
                <i className={`fa-solid ${icon} w-5 text-center`}></i>{name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default Dashboard
