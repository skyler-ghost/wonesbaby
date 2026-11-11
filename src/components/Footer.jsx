import { Link } from 'react-router-dom'
import { assets, footerLinks } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-linear-to-b from-white to-blush/40'>
      <div className='px-4 md:px-8 lg:px-16 xl:px-24 py-8 grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1.4fr] gap-6 text-xs'>
        <div className='col-span-2 md:col-span-1'>
          <img src={assets.logo} alt='Wones Baby' className='h-14 mix-blend-multiply' />
          <p className='font-semibold text-gray-700 mt-1'>Simple. Safe. Special.</p>
          <div className='flex gap-4 mt-3 text-lg text-gray-700'>
            <a href='#' aria-label='Instagram'><i className='fa-brands fa-instagram hover:text-primary'></i></a>
            <a href='#' aria-label='TikTok'><i className='fa-brands fa-tiktok hover:text-primary'></i></a>
            <a href='#' aria-label='YouTube'><i className='fa-brands fa-youtube hover:text-primary'></i></a>
            <a href='#' aria-label='X'><i className='fa-brands fa-x-twitter hover:text-primary'></i></a>
          </div>
        </div>

        <div>
          <h4 className='font-bold text-gray-800 mb-2'>Quick Links</h4>
          <ul className='space-y-1.5'>
            {footerLinks.quick.map((l) => (
              <li key={l.name}>
                {l.external ? <a href={l.path} className='hover:text-primary'>{l.name}</a> : <Link to={l.path} className='hover:text-primary'>{l.name}</Link>}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='font-bold text-gray-800 mb-2'>Customer Care</h4>
          <ul className='space-y-1.5'>
            {footerLinks.care.map((l) => (
              <li key={l}><Link to='/' className='hover:text-primary'>{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className='col-span-2 md:col-span-1'>
          <h4 className='font-bold text-gray-800 mb-2'>Contact Us</h4>
          <p className='flex items-center gap-2'><i className='fa-regular fa-envelope text-primary'></i> wonesbaby@gmail.com</p>
          <h4 className='font-bold text-gray-800 mt-3 mb-1'>Visit Us</h4>
          <p className='flex items-start gap-2'><i className='fa-solid fa-location-dot text-primary mt-0.5'></i> Surulere, Lagos & Gonin-Gora, Kaduna</p>
        </div>
      </div>

      <div className='bg-leaf/70 px-4 md:px-8 lg:px-16 xl:px-24 py-2 flex justify-between text-[10px] text-gray-700'>
        <p>© 2024 Wones Baby. All rights reserved.</p>
        <p className='hidden sm:block'>Made with <i className='fa-solid fa-heart text-primary'></i> for little ones</p>
      </div>
    </footer>
  )
}

export default Footer
