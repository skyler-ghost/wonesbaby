import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { imageUrl } from '../lib/api'

const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useCart()
  const { money } = useStore()
  const onSale = product.oldPrice > product.price
  const soldOut = product.stock <= 0

  return (
    <div className={`relative rounded-2xl bg-white overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.06)] ${className}`}>
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl(product.images?.[0])}
          alt={product.name}
          loading='lazy'
          className={`w-full aspect-square object-cover bg-peach/30 ${soldOut ? 'opacity-60' : ''}`}
        />
      </Link>
      {(soldOut || onSale) && (
        <p className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-[10px] font-bold ${soldOut ? 'bg-gray-500' : 'bg-primary'}`}>
          {soldOut ? 'Sold out' : 'Sale'}
        </p>
      )}
      <div className='p-3'>
        <Link to={`/product/${product._id}`}>
          <p className='text-sm font-semibold text-gray-800 leading-tight min-h-9'>{product.name}</p>
        </Link>
        {product.reviews > 0 && (
          <div className='flex items-center gap-1.5 mt-1'>
            <StarRating rating={product.rating} />
            <span className='text-[10px] text-gray-400'>({product.reviews})</span>
          </div>
        )}
        <p className='mt-1 text-sm'>
          <span className='font-bold text-gray-800'>{money(product.price)}</span>
          {onSale && <span className='ml-2 text-[11px] text-primary line-through'>{money(product.oldPrice)}</span>}
        </p>
        <button
          onClick={() => addToCart(product)}
          disabled={soldOut}
          className='mt-3 w-full py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed'
        >
          <i className='fa-solid fa-cart-shopping mr-1.5'></i>{soldOut ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
