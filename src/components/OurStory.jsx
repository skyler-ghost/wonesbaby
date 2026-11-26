
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const OurStory = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <section className='relative overflow-hidden mt-8 md:mt-10 rounded-3xl bg-linear-to-r from-peach to-[#fbe3d8]'>

      <div className='grid md:grid-cols-[34%_66%] min-h-[560px]'>

        {/* Baby Image */}
        <img
        src={assets.story.home}
        alt='Baby in a high chair holding a pink Wones bottle'
        className='w-full h-64 md:h-full min-h-[560px] object-cover object-[50%_28%] mask-r-from-75%'
        />

        {/* Right Content */}
        <div className='relative flex flex-col justify-between gap-8 p-5 md:p-8 lg:p-10'>

          {/* Safe Simple Special */}
          <p className='hidden lg:block absolute top-5 right-10 font-script text-2xl text-plum text-right leading-tight'>
            Safe
            <br />
            Simple
            <br />
            Special
          </p>

          {/* Our Story */}
          <div className='flex flex-col justify-center flex-1 max-w-xl'>
            <h2 className='font-baloo text-xl md:text-3xl font-bold text-gray-800'>
              Our Story
            </h2>

            <p className='text-xs md:text-sm text-gray-700 font-semibold'>
              Born from love, made for little ones.
            </p>

            <p className='text-xs md:text-sm text-gray-600 mt-2'>
              The initial idea for Wones was sparked in 2022 when I was pregnant with my first child, Fay. In trying to prepare for my daughter’s nursery, I dreamed up products that I myself wanted, particularly in gender neutral designs and styles, bright colors and inspired by a minimalistic approach. Fay was soon born, and I continued to build on my ideas slowly whilst adjusting to life as a new mother.
            </p>

            <Link
              to='/about'
              className='inline-flex items-center gap-2 mt-3 w-fit px-4 py-1.5 md:py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all'
            >
              Learn More
              <i className='fa-solid fa-arrow-right'></i>
            </Link>
          </div>

          {/* Newsletter - Bottom Right */}
          <div className='w-full max-w-xl self-end p-4 rounded-2xl bg-lilac'>

            <div className='flex items-start gap-3'>
              <i className='fa-regular fa-envelope text-2xl text-plum'></i>

              <div>
                <h3 className='font-baloo text-lg font-bold text-gray-800 leading-tight'>
                  Join Our Community
                </h3>

                <p className='text-xs text-gray-600'>
                  Be the first to know about new products, special offers and parenting tips.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className='flex mt-3 bg-white rounded-full p-1'
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                required
                placeholder='Enter your email address'
                className='flex-1 min-w-0 px-4 text-xs outline-none bg-transparent'
              />

              <button
                type='submit'
                className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold cursor-pointer transition-all'
              >
                Subscribe
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
