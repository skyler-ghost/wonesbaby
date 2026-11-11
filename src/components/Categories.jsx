import { Link } from 'react-router-dom'
import Title from './Title'
import { categories } from '../assets/assets'

const Categories = () => {
  return (
    <section className='mt-8 md:mt-10'>
      <Title title='Shop by Category' subTitle='Explore our carefully curated collections for every stage.' link='/shop' />
      <div className='flex lg:grid grid-cols-5 gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x'>
        {categories.map((cat) => (
          <Link key={cat.name} to='/shop' className='snap-start shrink-0 w-36 sm:w-48 lg:w-auto rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all'>
            <img src={cat.image} alt={cat.name} className='w-full' />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categories
