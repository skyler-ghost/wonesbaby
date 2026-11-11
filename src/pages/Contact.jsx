import { useState } from 'react'
import PageHero from '../components/PageHero'
import { assets } from '../assets/assets'

const EMAIL = 'wonesbaby@gmail.com'

const info = [
  { icon: 'fa-envelope', title: 'Email Us', lines: [EMAIL], note: 'We usually reply within 24 hours.', bg: 'bg-blush', iconBg: 'bg-primary/15 text-primary' },
  { icon: 'fa-phone', title: 'Call Us', lines: ['+234 901 234 5678'], note: 'Mon – Fri, 8am – 5pm (WAT)', bg: 'bg-mint', iconBg: 'bg-leaf/30 text-leaf' },
  { icon: 'fa-location-dot', title: 'Our Pickup Locations', lines: ['Surulere, Lagos &', 'Gonin-Gora, Kaduna'], bg: 'bg-peach', iconBg: 'bg-orange-200 text-orange-500' },
  { icon: 'fa-clock', title: 'Business Hours', lines: ['Mon – Fri: 8:00am – 5:30pm'], bg: 'bg-lilac', iconBg: 'bg-white text-plum' },
]

const socials = ['fa-instagram', 'fa-tiktok', 'fa-youtube', 'fa-whatsapp']

const input = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // No backend yet: opens the visitor's email app with the message filled in
  const onSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || 'Message from website')
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero
        crumb='Contact'
        title='Contact Us'
        accent="We'd love to hear from you!"
        smallAccent
        script={<>Let's stay <br /> connected! <i className='fa-solid fa-heart text-primary text-xl'></i></>}
        text='Have a question, need assistance, or want to share your experience? We’re here to help.'
        image={assets.heroBaby}
      />

      <div className='mt-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-5'>
        {/* Info cards */}
        <div className='space-y-3'>
          {info.map((i) => (
            <div key={i.title} className={`flex items-center gap-4 rounded-2xl p-4 ${i.bg}`}>
              <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-xl ${i.iconBg}`}>
                <i className={`fa-solid ${i.icon}`}></i>
              </div>
              <div>
                <p className='font-baloo font-bold text-plum'>{i.title}</p>
                {i.lines.map((l) => <p key={l} className='text-sm text-gray-800 leading-snug'>{l}</p>)}
                {i.note && <p className='text-xs text-gray-500'>{i.note}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className='rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-5 md:p-6'>
          <h2 className='font-baloo text-xl md:text-2xl font-bold text-plum'>Send Us a Message</h2>
          <p className='text-xs md:text-sm text-gray-500 mb-4'>Fill out the form below and we'll get back to you shortly.</p>
          <div className='grid sm:grid-cols-2 gap-3'>
            <input name='name' value={form.name} onChange={onChange} required placeholder='Your Name *' className={input} />
            <input name='email' type='email' value={form.email} onChange={onChange} required placeholder='Your Email *' className={input} />
          </div>
          <select name='subject' value={form.subject} onChange={onChange} className={`${input} mt-3`}>
            <option value=''>Subject</option>
            <option>Product question</option>
            <option>Order help</option>
            <option>Shipping & pickup</option>
            <option>Returns & refunds</option>
            <option>Other</option>
          </select>
          <textarea name='message' value={form.message} onChange={onChange} required rows={4} placeholder='Your Message *' className={`${input} mt-3 resize-none`}></textarea>
          <button type='submit' className='mt-4 w-full py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold transition-all cursor-pointer'>
            <i className='fa-solid fa-paper-plane mr-2'></i>Send Message
          </button>
          {sent && <p className='mt-3 text-sm text-leaf font-semibold text-center'>Thank you! Your email app should open so you can send your message.</p>}
        </form>
      </div>

      {/* Map + social */}
      <div className='mt-5 grid lg:grid-cols-[1.2fr_0.8fr] gap-5'>
        <div className='relative overflow-hidden rounded-2xl h-56 lg:h-60 bg-gray-100'>
          <iframe title='Wones Baby location' src='https://www.google.com/maps?q=Surulere,Lagos&output=embed' className='w-full h-full border-0' loading='lazy'></iframe>
          <div className='absolute left-4 bottom-4 bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3'>
            <i className='fa-solid fa-location-dot text-primary text-2xl'></i>
            <div>
              <p className='text-sm font-bold text-gray-800'>Wones Baby</p>
              <p className='text-xs text-gray-500'>Surulere, Lagos</p>
              <a href='https://www.google.com/maps/search/?api=1&query=Surulere,Lagos' target='_blank' rel='noreferrer' className='text-xs font-semibold text-primary'>Get Directions →</a>
            </div>
          </div>
        </div>

        <div className='relative overflow-hidden rounded-2xl bg-linear-to-r from-blush to-peach p-5 md:p-6 flex flex-col justify-center'>
          <img src={assets.blobGreen} alt='' className='absolute -top-8 -right-8 w-28 opacity-70' />
          <h3 className='font-baloo text-xl md:text-2xl font-bold text-plum relative'>Follow Our Journey</h3>
          <p className='text-sm text-gray-700 mt-1 max-w-[220px] relative'>Stay updated on new products, special offers and more!</p>
          <div className='flex gap-3 mt-4 relative'>
            {socials.map((s) => (
              <a key={s} href='#' aria-label={s.replace('fa-', '')} className='w-9 h-9 rounded-full bg-plum text-white flex items-center justify-center hover:bg-primary transition-colors'>
                <i className={`fa-brands ${s}`}></i>
              </a>
            ))}
          </div>
          <img src={assets.products.teetherElephant} alt='' className='hidden sm:block absolute right-4 bottom-4 h-24 rounded-2xl rotate-6 shadow' />
        </div>
      </div>
    </div>
  )
}

export default Contact
