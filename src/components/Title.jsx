import { Link } from 'react-router-dom'

const Title = ({ title, subTitle, link = '/' }) => {
  return (
    <div className='flex items-end justify-between mb-4'>
      <div>
        <h2 className='font-baloo text-xl md:text-2xl font-bold text-gray-800'>{title}</h2>
        {subTitle && <p className='text-xs md:text-sm text-gray-500 hidden sm:block'>{subTitle}</p>}
      </div>
      <Link to={link} className='text-xs md:text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all'>
        View All <i className='fa-solid fa-arrow-right text-[10px]'></i>
      </Link>
    </div>
  )
}

export default Title
