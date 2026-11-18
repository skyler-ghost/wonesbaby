import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { api, ApiError } from '../lib/api'
import Dashboard from '../admin/Dashboard'
import ProductsAdmin from '../admin/ProductsAdmin'
import OrdersAdmin from '../admin/OrdersAdmin'

const TOKEN_KEY = 'wones-admin-token'
const readToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

const NAV = [
  { key: 'dashboard', name: 'Dashboard', icon: 'fa-house' },
  { key: 'products', name: 'Products', icon: 'fa-box' },
  { key: 'orders', name: 'Orders', icon: 'fa-cart-shopping' },
]

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await api('/api/auth/login', { method: 'POST', body: form })
      onLogin(data.token, data.admin)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary'
  return (
    <div className='min-h-screen bg-lilac/30 flex items-center justify-center px-4'>
      <form onSubmit={submit} className='w-full max-w-sm rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-6 space-y-3'>
        <img src={assets.logo} alt='Wones Baby' className='h-14 mx-auto mix-blend-multiply' />
        <h1 className='font-baloo text-2xl font-bold text-plum text-center'>Admin Login</h1>
        <input type='email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder='Email' autoComplete='username' className={input} />
        <input type='password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder='Password' autoComplete='current-password' className={input} />
        {error && <p className='text-sm font-semibold text-red-600 text-center'>{error}</p>}
        <button type='submit' disabled={busy} className='w-full py-3 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold cursor-pointer transition-all'>{busy ? 'Signing in…' : 'Sign In'}</button>
        <Link to='/' className='block text-center text-xs font-semibold text-plum'>← Back to store</Link>
      </form>
    </div>
  )
}

const Admin = () => {
  const [token, setToken] = useState(readToken)
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(Boolean(readToken()))
  const [tab, setTab] = useState('dashboard')
  const [open, setOpen] = useState(false)

  const logout = useCallback(() => {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
    setToken('')
    setAdmin(null)
  }, [])

  const onLogin = (newToken, newAdmin) => {
    try { localStorage.setItem(TOKEN_KEY, newToken) } catch { /* ignore */ }
    setToken(newToken)
    setAdmin(newAdmin)
  }

  // Check a saved token is still valid when the page loads
  useEffect(() => {
    if (!token || admin) { setChecking(false); return }
    api('/api/auth/me', { token })
      .then((d) => setAdmin(d.admin))
      .catch((err) => { if (err.status === 401) logout() })
      .finally(() => setChecking(false))
  }, [token, admin, logout])

  // Authenticated request helper: logs out automatically if the session has expired
  const call = useCallback(
    async (path, opts = {}) => {
      try {
        return await api(path, { ...opts, token })
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout()
        throw err
      }
    },
    [token, logout]
  )

  if (checking) return <p className='min-h-screen flex items-center justify-center text-sm text-gray-500'>Loading…</p>
  if (!token || !admin) return <Login onLogin={onLogin} />

  const go = (key) => { setTab(key); setOpen(false) }

  const sidebar = (
    <div className='h-full bg-white flex flex-col'>
      <div className='px-5 py-4'>
        <img src={assets.logo} alt='Wones Baby' className='h-12 mix-blend-multiply' />
        <p className='text-xs font-bold text-plum ml-1'><i className='fa-solid fa-star text-amber-400 text-[9px] mr-1'></i>Admin</p>
      </div>
      <nav className='px-3 mt-2 space-y-1 flex-1'>
        {NAV.map((n) => (
          <button key={n.key} onClick={() => go(n.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${tab === n.key ? 'bg-lilac text-plum' : 'text-gray-700 hover:bg-gray-50'}`}>
            <i className={`fa-solid ${n.icon} w-5 text-center`}></i>{n.name}
          </button>
        ))}
      </nav>
      <Link to='/' className='mx-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50'>
        <i className='fa-solid fa-store w-5 text-center'></i>View Store
      </Link>
      <button onClick={logout} className='m-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer'>
        <i className='fa-solid fa-right-from-bracket w-5 text-center'></i>Logout
      </button>
    </div>
  )

  const initials = (admin.name || admin.email).slice(0, 2).toUpperCase()

  return (
    <div className='min-h-screen bg-lilac/30 lg:grid lg:grid-cols-[220px_1fr]'>
      <aside className='hidden lg:block sticky top-0 h-screen border-r border-gray-100'>{sidebar}</aside>
      {open && (
        <div className='lg:hidden fixed inset-0 z-50 flex'>
          <div className='w-60 shadow-xl'>{sidebar}</div>
          <div className='flex-1 bg-black/30' onClick={() => setOpen(false)}></div>
        </div>
      )}

      <div className='min-w-0'>
        <header className='flex items-center justify-between px-4 md:px-6 py-3 bg-white/80'>
          <button onClick={() => setOpen(true)} className='lg:hidden text-xl text-gray-700 cursor-pointer' aria-label='Menu'><i className='fa-solid fa-bars'></i></button>
          <img src={assets.logo} alt='' className='lg:hidden h-9 mix-blend-multiply' />
          <div className='flex items-center gap-2 ml-auto text-sm font-semibold text-gray-700'>
            <span className='w-8 h-8 rounded-full bg-plum text-white text-xs flex items-center justify-center'>{initials}</span>
            <span className='hidden sm:inline'>{admin.name || admin.email}</span>
          </div>
        </header>

        <main className='p-4 md:p-6'>
          {tab === 'dashboard' && <Dashboard call={call} admin={admin} go={go} />}
          {tab === 'products' && <ProductsAdmin call={call} />}
          {tab === 'orders' && <OrdersAdmin call={call} />}
        </main>
      </div>
    </div>
  )
}

export default Admin
