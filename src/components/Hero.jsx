import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <section className='relative overflow-hidden rounded-3xl bg-linear-to-r from-[#fbe6f2] via-[#f8dcee] to-[#f3d0e8] min-h-[300px] md:min-h-[400px] flex items-center'>
      {/* Decorative blobs */}
      <img src={assets.blobGreen} alt='' className='absolute -top-10 -right-10 w-36 md:w-56 opacity-70' />
      <img src={assets.blobGreen} alt='' className='absolute -bottom-12 -left-10 w-36 md:w-52 opacity-60' />
      <img src={assets.heartOutline} alt='' className='hidden md:block absolute top-16 left-[52%] w-10 rotate-12' />
      <img src={assets.sparkle} alt='' className='hidden md:block absolute bottom-10 right-[8%] w-8' />

      {/* Text */}
      <div className='relative z-10 px-5 md:px-12 w-[58%] md:w-1/2'>
        <p className='text-[8px] md:text-xs font-bold tracking-wider text-primary uppercase'>
          Safe &nbsp;•&nbsp; Non-Toxic &nbsp;•&nbsp; Made for little hands
        </p>
        <h1 className='font-baloo font-bold text-plum text-[22px] min-[400px]:text-[26px] sm:text-5xl md:text-6xl leading-[1.05] mt-2 md:mt-3'>
          Little Hands <br /> Big Adventures
        </h1>
        <p className='text-[11px] sm:text-sm md:text-base text-gray-700 mt-3 md:mt-4 max-w-sm'>
          Premium silicone baby products designed for safe play, happy moments and healthy development.
        </p>
        <Link to='/shop' className='inline-flex items-center gap-2 mt-4 md:mt-6 px-5 md:px-8 py-2 md:py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-xs md:text-base font-bold shadow-lg shadow-primary/30 transition-all'>
          Shop Now <i className='fa-solid fa-arrow-right'></i>
        </Link>
      </div>

      {/* Baby image */}
      <img
        src={assets.heroBaby}
        alt='Baby playing with an elephant teether'
        className='absolute right-0 top-0 h-full w-[48%] md:w-[55%] object-cover object-center mask-l-from-60% mask-b-from-80%'
      />

      {/* Script tagline (desktop) */}
      <p className='hidden lg:block absolute top-10 left-[52%] z-10 font-script text-3xl text-plum leading-tight'>
        Safe toys <br /> for brighter <br /> tomorrows <i className='fa-solid fa-heart text-primary text-lg'></i>
      </p>
    </section>
  )
}

export default Hero
