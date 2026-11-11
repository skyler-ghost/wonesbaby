import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const OurStory = () => {
  return (
    <section className='relative overflow-hidden mt-8 md:mt-10 rounded-3xl bg-linear-to-r from-peach to-[#fbe3d8] flex items-center'>
      <img src={assets.story.baby} alt='Smiling baby wrapped in a towel' className='w-[38%] md:w-[34%] self-stretch object-cover mask-r-from-75%' />
      <div className='py-5 pr-4 md:pr-8 flex-1'>
        <h2 className='font-baloo text-xl md:text-3xl font-bold text-gray-800'>Our Story</h2>
        <p className='text-xs md:text-sm text-gray-700 font-semibold'>Born from love, made for little ones.</p>
        <p className='hidden md:block text-sm text-gray-600 mt-2 max-w-xl'>
          The initial idea for Wones Baby was sparked in 2022 when I was pregnant with my first child, Fay. In trying to prepare for my daughter’s nursery, i dreamed up products that i myself wanted, particularly in gender neutral designs and styles, bright colors and inspired by a minimalistic approach. 
          Fay was soon born, and i continued to build on my ideas slowly whilst adjusting to life as a new mother. 
        </p>
        <Link to='/about' className='inline-flex items-center gap-2 mt-3 px-4 py-1.5 md:py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all'>
          Learn More <i className='fa-solid fa-arrow-right'></i>
        </Link>
      </div>
      <p className='hidden lg:block absolute top-5 right-10 font-script text-2xl text-plum text-right leading-tight'>
        Safe <br /> Simple <br /> Special
      </p>
    </section>
  )
}

export default OurStory
