import { useRef } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { products } from '../assets/assets'

const FeaturedProducts = () => {
  const trackRef = useRef(null)

  const scroll = (dir) => {
    const el = trackRef.current
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const arrow = 'w-8 h-8 shrink-0 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:text-primary cursor-pointer'

  return (
    <section className='mt-8 md:mt-10'>
      <Title title='Featured Products' subTitle='Our most loved products, chosen by parents like you.' link='/shop' />
      <div className='flex items-center gap-2'>
        <button onClick={() => scroll(-1)} className={arrow} aria-label='Previous'><i className='fa-solid fa-chevron-left text-xs'></i></button>
        <div ref={trackRef} className='flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 w-full'>
          {products.map((p) => <ProductCard key={p.id} product={p} className='snap-start shrink-0 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(20%-13px)]' />)}
        </div>
        <button onClick={() => scroll(1)} className={arrow} aria-label='Next'><i className='fa-solid fa-chevron-right text-xs'></i></button>
      </div>
    </section>
  )
}

export default FeaturedProducts
