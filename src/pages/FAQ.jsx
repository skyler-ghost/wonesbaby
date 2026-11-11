import { useState } from 'react'
import PageHero from '../components/PageHero'
import ContactBanner from '../components/ContactBanner'
import { assets, faqTopics, faqs } from '../assets/assets'

const FAQ = () => {
  const [topic, setTopic] = useState('General')
  const [open, setOpen] = useState(0)

  const shown = topic === 'General' ? faqs : faqs.filter((f) => f.topic === topic)

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero
        crumb='FAQ'
        title='Frequently Asked'
        accent='Questions'
        text='Find quick answers to common questions about our products, orders and more.'
        visual={<img src={assets.questionMark} alt='' className='h-40 md:h-64' />}
      />

      <div className='mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6'>
        {/* Topics */}
        <aside className='min-w-0 rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-4 h-fit'>
          <h3 className='font-baloo font-bold text-plum text-lg mb-2'>Browse Topics</h3>
          <div className='flex md:flex-col gap-1 overflow-x-auto no-scrollbar'>
            {faqTopics.map((t) => (
              <button key={t.name} onClick={() => { setTopic(t.name); setOpen(0) }} className={`shrink-0 flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-left cursor-pointer transition-all ${topic === t.name ? 'bg-lilac text-plum' : 'text-gray-700 hover:bg-gray-50'}`}>
                <i className={`fa-solid ${t.icon} w-5 text-center`}></i> {t.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Accordion */}
        <div className='min-w-0 space-y-3'>
          {shown.length === 0 && <p className='text-sm'>No questions in this topic yet.</p>}
          {shown.map((f, i) => (
            <div key={f.q} className={`rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.06)] ${open === i ? 'bg-lilac/50' : 'bg-white'}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className='w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-plum cursor-pointer'>
                {f.q}
                <i className={`fa-solid fa-chevron-down text-xs transition-transform ${open === i ? 'rotate-180' : ''}`}></i>
              </button>
              {open === i && <p className='px-5 pb-5 text-sm text-gray-700'>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      <ContactBanner title='Still have questions?' text='Feel free to reach out to our support team.' icon='fa-envelope' image={assets.starFace} />
    </div>
  )
}

export default FAQ
