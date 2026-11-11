import { useState } from 'react'
import { assets } from '../assets/assets'

const StoryAndNewsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <section className='grid lg:grid-cols-[0.9fr_1.1fr] gap-4 mt-4'>
      {/* Video card */}
      <div className='flex items-center gap-4 p-3 rounded-3xl bg-linear-to-r from-mint to-[#d3e7a8]'>
        <img src={assets.story.videoThumbnail} alt='Watch our story' className='w-32 md:w-44 rounded-2xl cursor-pointer' />
        <div>
          <h3 className='font-baloo text-lg md:text-xl font-bold text-gray-800'>Watch Our Story</h3>
          <p className='text-xs text-gray-600'>See how Wones Baby started and grew.</p>
        </div>
      </div>

      {/* Newsletter card */}
      <div className='relative p-5 rounded-3xl bg-lilac'>
        <div className='flex items-start gap-3'>
          <i className='fa-regular fa-envelope text-3xl text-plum'></i>
          <div>
            <h3 className='font-baloo text-lg md:text-xl font-bold text-gray-800 leading-tight'>Join Our Community</h3>
            <p className='text-xs text-gray-600'>Be the first to know about new products, special offers and parenting tips.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className='flex mt-3 bg-white rounded-full p-1'>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' required placeholder='Enter your email address' className='flex-1 min-w-0 px-4 text-xs outline-none bg-transparent' />
          <button type='submit' className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold cursor-pointer transition-all'>Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default StoryAndNewsletter
