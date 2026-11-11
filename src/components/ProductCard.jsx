import StarRating from './StarRating'
import { currency } from '../assets/assets'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useCart()

  return (
    <div className={`relative rounded-2xl bg-white overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.06)] ${className}`}>
      <img src={product.image} alt={product.name} className='w-full aspect-square object-cover' />
      {product.sale && <p className='absolute top-2 right-2 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold'>Sale</p>}
      <div className='p-3'>
        <p className='text-sm font-semibold text-gray-800 leading-tight min-h-9'>{product.name}</p>
        <div className='flex items-center gap-1.5 mt-1'>
          <StarRating rating={product.rating} />
          <span className='text-[10px] text-gray-400'>({product.reviews})</span>
        </div>
        <p className='mt-1 text-sm'>
          <span className='font-bold text-gray-800'>{currency}{product.price.toFixed(2)}</span>
          {product.oldPrice && <span className='ml-2 text-[11px] text-primary line-through'>{currency}{product.oldPrice}</span>}
        </p>
        <button onClick={addToCart} className='mt-3 w-full py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer'>
          <i className='fa-solid fa-cart-shopping mr-1.5'></i>Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
