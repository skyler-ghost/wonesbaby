import { features } from '../assets/assets'

const Features = () => {
  return (
    <section className='grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mt-5'>
      {features.map((f, i) => (
        <div key={f.title} className={`flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] ${i === 3 ? 'max-lg:hidden' : ''}`}>
          <div className={`w-8 h-8 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center text-sm md:text-xl ${f.bg} ${f.color}`}>
            <i className={`fa-solid ${f.icon}`}></i>
          </div>
          <div>
            <p className='text-[10px] md:text-sm font-bold text-gray-800 leading-tight'>{f.title}</p>
            <p className='text-[8px] md:text-xs text-gray-500 leading-tight'>{f.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Features
