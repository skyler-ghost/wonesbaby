import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

// Real-life photos: shows the bottles in use, which sells the product better than studio shots alone.
const LittleMoments = () => {
  return (
    <section className='mt-8 md:mt-10 rounded-3xl bg-linear-to-r from-peach via-[#fde9df] to-blush/70 p-4 md:p-8 grid md:grid-cols-[0.9fr_1.1fr] gap-5 md:gap-8 items-center'>
      <div className='order-2 md:order-1'>
        <p className='font-script text-2xl md:text-3xl text-primary'>Little moments</p>
        <h2 className='font-baloo text-2xl md:text-4xl font-bold text-plum leading-tight mt-1'>Made for real life, <br /> loved by tiny hands</h2>
        <p className='text-sm text-gray-700 mt-3 max-w-md'>
          Easy-grip, soft silicone that little ones can hold on their own. From first feeds to high-chair adventures, our bottles are built to handle every messy, happy moment.
        </p>
        <ul className='mt-4 space-y-2 text-sm font-semibold text-gray-800'>
          <li><i className='fa-solid fa-circle-check text-leaf mr-2'></i>Easy for baby to grip and hold</li>
          <li><i className='fa-solid fa-circle-check text-leaf mr-2'></i>Soft, flexible and gentle on little hands</li>
          <li><i className='fa-solid fa-circle-check text-leaf mr-2'></i>Simple to clean after every feed</li>
        </ul>
        <Link to='/shop?category=Feeding' className='inline-flex items-center gap-2 mt-5 px-7 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all'>
          Shop Feeding <i className='fa-solid fa-arrow-right'></i>
        </Link>
      </div>

      <div className='order-1 md:order-2 grid grid-cols-2 gap-3 md:gap-4'>
        <img src={assets.moments.highchair} alt='Baby in a high chair holding a pink Wones bottle' loading='lazy' className='w-full aspect-4/5 object-cover rounded-3xl shadow-md' />
        <img src={assets.moments.bottleReach} alt='Baby reaching for a pink Wones silicone bottle' loading='lazy' className='w-full aspect-4/5 object-cover rounded-3xl shadow-md mt-6 md:mt-10' />
      </div>
    </section>
  )
}

export default LittleMoments
