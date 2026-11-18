import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const MobileTabBar = () => {
  const { count } = useCart()

  const tab = ({ isActive }) =>
    `flex flex-col items-center gap-1 text-[11px] font-semibold ${isActive ? 'text-primary' : 'text-gray-600'}`

  return (
    <div className='md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-100 shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] grid grid-cols-4 py-2'>
      <NavLink to='/' end className={tab}><i className='fa-solid fa-house text-lg'></i>Home</NavLink>
      <NavLink to='/shop' className={tab}><i className='fa-solid fa-bag-shopping text-lg'></i>Shop</NavLink>
      <NavLink to={'/cart'} className={(s) =>`relative ${tab(s)}`}>
        <i className='fa-solid fa-cart-shopping text-lg'></i>Cart
        {count > 0 && <span className='absolute top-0 left-1/2 ml-1 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-white text-[9px] flex items-center justify-center'>{count}</span>}
      </NavLink>
      <NavLink to='/track' className={tab}><i className='fa-solid fa-truck-fast text-lg'></i>Track</NavLink>
    </div>
  )
}

export default MobileTabBar
