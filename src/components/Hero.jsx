import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

// Mint banner that matches the product photo's own background, so the bottle appears to sit right on the banner.
const Hero = () => {
  return (
    <section className='relative overflow-hidden rounded-3xl bg-linear-to-r from-[#eaf7ef] via-[#dff2e6] to-[#d5ecdc] min-h-[340px] md:min-h-[460px] flex items-center'>
      {/* Decorative shapes */}
      <img src={assets.blobGreen} alt='' className='absolute -top-10 -left-12 w-36 md:w-56 opacity-50' />
      <img src={assets.heartOutline} alt='' className='hidden md:block absolute top-14 left-[44%] w-10 rotate-12' />
      <img src={assets.sparkle} alt='' className='hidden md:block absolute bottom-12 left-[46%] w-8' />

      {/* Text */}
      <div className='relative z-10 px-5 md:px-12 w-[56%] md:w-1/2 py-8'>
        <p className='inline-block px-3 py-1 rounded-full bg-white/70 text-[8px] md:text-xs font-bold tracking-wider text-plum uppercase'>
          Safe &nbsp;•&nbsp; Non-Toxic &nbsp;•&nbsp; Made for little hands
        </p>
        <h1 className='font-baloo font-bold text-plum text-[26px] min-[400px]:text-[30px] sm:text-5xl md:text-6xl leading-[1.05] mt-3 md:mt-4'>
          Feeding Time, <br /> <span className='text-primary'>Made Simple</span>
        </h1>
        <p className='text-[11px] sm:text-sm md:text-base text-gray-700 mt-3 md:mt-4 max-w-sm'>
          Soft, food-grade silicone bottles and baby essentials designed for safe play, happy moments and healthy development.
        </p>
        <div className='flex flex-wrap items-center gap-2 md:gap-3 mt-4 md:mt-6'>
          <Link to='/shop' className='inline-flex items-center gap-2 px-5 md:px-8 py-2 md:py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-xs md:text-base font-bold shadow-lg shadow-primary/30 transition-all'>
            Shop Now <i className='fa-solid fa-arrow-right'></i>
          </Link>
          <Link to='/shop?category=Feeding' className='hidden sm:inline-flex items-center gap-2 px-5 md:px-7 py-2 md:py-3 rounded-full bg-white/80 hover:bg-white text-plum text-xs md:text-base font-bold transition-all'>
            Feeding Sets
          </Link>
        </div>
      </div>

      {/* Product photo */}
      <img
        src={assets.heroBottle}
        alt='Wones silicone baby bottle with straw kit, spoon and soft blanket'
        className='absolute right-0 top-0 h-full w-[48%] md:w-[50%] object-cover object-[50%_45%] mask-l-from-65%'
      />

      {/* Floating badges over the photo */}
      <p className='hidden md:flex absolute right-8 top-8 z-10 items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow text-xs font-bold text-plum'>
        <i className='fa-solid fa-leaf text-leaf'></i> 100% Food-grade Silicone
      </p>
      <p className='hidden md:flex absolute right-10 bottom-8 z-10 items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow text-xs font-bold text-plum'>
        <i className='fa-solid fa-shield-halved text-primary'></i> BPA, PVC &amp; Phthalate Free
      </p>

      {/* Script tagline (desktop) */}
      <p className='hidden lg:block absolute top-10 left-[52%] z-10 font-script text-3xl text-plum leading-tight -rotate-3'>
        Simple. <br /> Safe. <br /> Special. <i className='fa-solid fa-heart text-primary text-lg'></i>
      </p>
    </section>
  )
}

export default Hero
