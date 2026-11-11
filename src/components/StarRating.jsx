const StarRating = ({ rating = 4 }) => {
  return (
    <div className='flex items-center gap-0.5 text-[11px] text-amber-400'>
      {Array(5).fill('').map((_, i) => {
        const icon = rating >= i + 1 ? 'fa-solid fa-star' : rating >= i + 0.5 ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star'
        return <i key={i} className={icon}></i>
      })}
    </div>
  )
}

export default StarRating
