import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

// Shared banner for Shop / FAQ / About
const PageHero = ({ crumb, badge, title, accent, smallAccent, script, text, image, visual, button }) => {
  return (
    <section className='relative overflow-hidden rounded-3xl bg-linear-to-r from-[#fbe6f2] via-[#f8dcee] to-[#f3d0e8] min-h-[250px] md:min-h-[320px] flex items-center'>
      <img src={assets.blobGreen} alt='' className='absolute -top-10 -right-10 w-32 md:w-48 opacity-70' />
      <img src={assets.blobGreen} alt='' className='absolute -bottom-12 -left-10 w-32 md:w-48 opacity-60' />
      <img src={assets.heartOutline} alt='' className='hidden md:block absolute top-10 left-[48%] w-9 rotate-12' />

      <div className='relative z-10 px-5 md:px-12 w-[62%] md:w-1/2 py-6'>
        <div className='flex flex-wrap items-center gap-2 mb-3'>
          {crumb && (
            <p className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-[10px] md:text-xs font-bold text-plum'>
              <Link to='/'>Home</Link> <i className='fa-solid fa-angle-right text-[8px]'></i> {crumb}
            </p>
          )}
          {badge && <p className='px-3 py-1 rounded-full bg-lilac text-[10px] md:text-xs font-bold text-plum'>{badge}</p>}
        </div>
        <h1 className='font-baloo font-bold text-plum text-[26px] sm:text-4xl md:text-5xl leading-[1.05]'>
         {title}
         {accent && (
          <>
            <br />
            <span className={`text-primary ${smallAccent ? 'text-lg sm:text-2xl md:text-3xl' : ''}`}>
              {accent}
            </span>
          </>
         )}
        </h1>
        <p className='text-[11px] sm:text-sm md:text-base text-gray-700 mt-3 max-w-sm'>{text}</p>
        {button && (
          <Link to={button.to} className='hidden md:inline-flex items-center gap-2 mt-5 px-7 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all'>
            {button.label} <i className='fa-solid fa-arrow-right'></i>
          </Link>
        )}
      </div>

      {image && (
        <img src={image} alt='' className='absolute right-0 top-0 h-full w-[46%] md:w-[52%] object-cover object-center mask-l-from-60% mask-b-from-80%' />
      )}
      {script && (
        <p className='hidden lg:block absolute top-28 left-[47%] z-10 font-script text-3xl text-plum leading-tight -rotate-6'>{script}</p>
      )}
      {visual && <div className='absolute right-4 md:right-16 top-1/2 -translate-y-1/2'>{visual}</div>}
    </section>
  )
}

export default PageHero
