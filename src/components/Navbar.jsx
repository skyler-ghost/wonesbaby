import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets, navLinks } from '../assets/assets'
import { useCart } from '../context/CartContext'

const socials = [
  { icon: 'fa-instagram', label: 'Instagram', url:'https://www.instagram.com/wones_babyglobal?mdxt=MTU4ZW9mczNjZ2pkeg=='},
  { icon: 'fa-threads', label: 'Threads', url:'https://www.threads.com/@wones_babyglobal?igshid=NTc4MTIwNjQ2YQ=='},
  { icon: 'fa-whatsapp', label: 'Whatsapp', url:'https://wa.me/+2348170596237'},
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  const linkClass = ({ isActive }) =>
    `transition-colors hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-700'}`

  return (
    <nav className='sticky top-0 z-50 bg-white/95 backdrop-blur flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24 py-2'>
      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt='Wones Baby' className='h-12 md:h-14 mix-blend-multiply' />
      </Link>

      {/* Desktop links */}
      <div className='hidden lg:flex items-center gap-8 text-sm font-semibold'>
        {navLinks.map((link) =>
          link.external ? (
            <a key={link.name} href={link.path} className='text-gray-700 hover:text-primary transition-colors'>{link.name}</a>
          ) : (
            <NavLink key={link.name} to={link.path} end className={linkClass}>{link.name}</NavLink>
          )
        )}
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2 md:gap-3'>
        {socials.map((s) => (
          <a key={s.icon} href={s.url} aria-label={s.label} className='w-7 h-7 md:w-8 md:h-8 rounded-full bg-plum text-white text-xs md:text-sm flex items-center justify-center hover:bg-primary transition-colors'>
            <i className={`fa-brands ${s.icon}`}></i>
          </a>
        ))}
        <button className='relative ml-1 text-lg md:text-xl text-gray-700 hover:text-primary cursor-pointer' aria-label='Cart'>
          <i className='fa-solid fa-cart-shopping'></i>
          <span className='absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] flex items-center justify-center'>{count}</span>
        </button>
        <span className='h-6 w-px bg-gray-300 mx-1 lg:hidden'></span>
        <button onClick={() => setOpen(!open)} className='lg:hidden text-xl text-gray-700 cursor-pointer' aria-label='Menu'>
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className='lg:hidden absolute top-full left-0 w-full bg-white shadow-lg flex flex-col px-6 py-3 text-sm font-semibold'>
          {navLinks.map((link) =>
            link.external ? (
              <a key={link.name} href={link.path} className='py-3 border-b border-gray-100 last:border-0'>{link.name}</a>
            ) : (
              <Link key={link.name} to={link.path} onClick={() => setOpen(false)} className='py-3 border-b border-gray-100 last:border-0'>{link.name}</Link>
            )
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
