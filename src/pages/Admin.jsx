import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets, adminNav, adminStats, adminSales, adminOrders, adminActions, currency } from '../assets/assets'

const statusStyle = {
  Pending: 'bg-amber-100 text-amber-600',
  Delivered: 'bg-mint text-green-700',
  Processing: 'bg-lilac text-plum',
}

// Simple SVG line chart (no chart library needed)
const SalesChart = ({ data }) => {
  const W = 420, H = 190, padL = 36, padB = 24, padT = 10, max = 150
  const x = (i) => padL + (i * (W - padL - 10)) / (data.length - 1)
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
      {[0, 50, 100, 150].map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - 10} y1={y(t)} y2={y(t)} stroke='#eee' />
          <text x={padL - 6} y={y(t) + 3} textAnchor='end' fontSize='9' fill='#888'>{t === 0 ? '0' : `${t}k`}</text>
        </g>
      ))}
      <path d={area} fill='url(#fill)' />
      <path d={line} fill='none' stroke='#FF4D8D' strokeWidth='2.5' strokeLinejoin='round' />
      {data.map((d, i) => (
        <g key={d.month}>
          <circle cx={x(i)} cy={y(d.value)} r='3.5' fill='#fff' stroke='#FF4D8D' strokeWidth='2' />
          <text x={x(i)} y={H - 6} textAnchor='middle' fontSize='9' fill='#888'>{d.month}</text>
        </g>
      ))}
    </svg>
  )
}

const Admin = () => {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState(6)

  const sidebar = (
    <div className='h-full bg-white flex flex-col'>
      <div className='px-5 py-4'>
        <img src={assets.logo} alt='Wones Baby' className='h-12 mix-blend-multiply' />
        <p className='text-xs font-bold text-plum ml-1'><i className='fa-solid fa-star text-amber-400 text-[9px] mr-1'></i>Admin</p>
      </div>
      <nav className='px-3 mt-2 space-y-1 flex-1'>
        {adminNav.map((n) => (
          <button key={n.name} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${n.active ? 'bg-lilac text-plum' : 'text-gray-700 hover:bg-gray-50'}`}>
            <i className={`fa-solid ${n.icon} w-5 text-center`}></i>
            {n.name}
            {n.badge && <span className='ml-auto w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center'>{n.badge}</span>}
          </button>
        ))}
      </nav>
      <Link to='/' className='m-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50'>
        <i className='fa-solid fa-right-from-bracket w-5 text-center'></i>Logout
      </Link>
    </div>
  )

  const card = 'rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-4'

  return (
    <div className='min-h-screen bg-lilac/30 lg:grid lg:grid-cols-[220px_1fr]'>
      {/* Sidebar: fixed column on desktop, drawer on mobile */}
      <aside className='hidden lg:block sticky top-0 h-screen border-r border-gray-100'>{sidebar}</aside>
      {open && (
        <div className='lg:hidden fixed inset-0 z-50 flex'>
          <div className='w-60 shadow-xl'>{sidebar}</div>
          <div className='flex-1 bg-black/30' onClick={() => setOpen(false)}></div>
        </div>
      )}

      <div className='min-w-0'>
        {/* Top bar */}
        <header className='flex items-center justify-between px-4 md:px-6 py-3 bg-white/80'>
          <button onClick={() => setOpen(true)} className='lg:hidden text-xl text-gray-700 cursor-pointer' aria-label='Menu'><i className='fa-solid fa-bars'></i></button>
          <img src={assets.logo} alt='' className='lg:hidden h-9 mix-blend-multiply' />
          <div className='flex items-center gap-2 ml-auto text-sm font-semibold text-gray-700'>
            <span className='w-8 h-8 rounded-full bg-plum text-white text-xs flex items-center justify-center'>SA</span>
            <span className='hidden sm:inline'>Admin</span>
            <i className='fa-solid fa-chevron-down text-[9px]'></i>
          </div>
        </header>

        <main className='p-4 md:p-6'>
          <h1 className='font-baloo text-2xl md:text-3xl font-bold text-plum'>Dashboard</h1>
          <p className='text-sm text-gray-600'>Welcome back, Saheed! Here's what's happening.</p>

          {/* Stats */}
          <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mt-5'>
            {adminStats.map((s) => (
              <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.bg}`}>
                <i className={`fa-solid ${s.icon} text-2xl md:text-3xl ${s.color} hidden sm:block`}></i>
                <div className='min-w-0'>
                  <p className='text-xs text-gray-600'>{s.label}</p>
                  <p className='font-baloo text-xl md:text-2xl font-bold text-gray-800 truncate'>{s.value}</p>
                  <p className='text-[11px] font-semibold text-green-600'><i className='fa-solid fa-arrow-up text-[9px]'></i> {s.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='grid xl:grid-cols-[1fr_1.35fr_0.7fr] gap-4 mt-4'>
            {/* Sales */}
            <section className={card}>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='font-baloo font-bold text-plum'>Sales Overview</h2>
                <select value={range} onChange={(e) => setRange(Number(e.target.value))} className='text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none'>
                  <option value={6}>Last 6 Months</option>
                  <option value={3}>Last 3 Months</option>
                </select>
              </div>
              <SalesChart data={adminSales.slice(-range)} />
            </section>

            {/* Orders */}
            <section className={`${card} overflow-x-auto`}>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='font-baloo font-bold text-plum'>Recent Orders</h2>
                <button className='text-xs font-semibold text-primary cursor-pointer'>View All <i className='fa-solid fa-arrow-right text-[9px]'></i></button>
              </div>
              <table className='w-full text-xs min-w-[380px]'>
                <thead>
                  <tr className='text-left text-gray-500'><th className='py-2 font-semibold'>#</th><th className='font-semibold'>Customer</th><th className='font-semibold'>Amount</th><th className='font-semibold'>Status</th><th className='font-semibold'>Date</th></tr>
                </thead>
                <tbody>
                  {adminOrders.map((o) => (
                    <tr key={o.id} className='border-t border-gray-100'>
                      <td className='py-3'>{o.id}</td>
                      <td>{o.customer}</td>
                      <td className='font-bold'>{currency}{o.amount.toFixed(2)}</td>
                      <td><span className={`px-2.5 py-1 rounded-full font-semibold ${statusStyle[o.status]}`}>{o.status}</span></td>
                      <td className='text-gray-500'>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Quick actions */}
            <section className={card}>
              <h2 className='font-baloo font-bold text-plum mb-2'>Quick Actions</h2>
              <div className='space-y-2'>
                {adminActions.map((a) => (
                  <button key={a.name} className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-lilac/60 text-sm font-semibold text-plum hover:bg-lilac cursor-pointer'>
                    <i className={`fa-solid ${a.icon} w-5 text-center`}></i>{a.name}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Admin
