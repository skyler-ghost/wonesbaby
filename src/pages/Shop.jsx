import { useState } from 'react'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import ContactBanner from '../components/ContactBanner'
import { assets, allProducts, shopCategories, priceRanges } from '../assets/assets'

const PAGE_SIZE = 8

const Shop = () => {
  const [cats, setCats] = useState([])
  const [prices, setPrices] = useState([])
  const [sort, setSort] = useState('popular')
  const [page, setPage] = useState(1)
  const [list, setList] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const toggle = (arr, setArr, value) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
    setPage(1)
  }

  let items = allProducts.filter((p) =>
    (cats.length === 0 || cats.includes(p.category)) &&
    (prices.length === 0 || prices.some((i) => p.price >= priceRanges[i].min && p.price < priceRanges[i].max))
  )
  if (sort === 'popular') items = [...items].sort((a, b) => b.reviews - a.reviews)
  if (sort === 'low') items = [...items].sort((a, b) => a.price - b.price)
  if (sort === 'high') items = [...items].sort((a, b) => b.price - a.price)

  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visible = items.slice(start, start + PAGE_SIZE)

  const check = 'flex items-center gap-2 text-sm cursor-pointer'

  const filters = (
    <div className='rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-4 space-y-5'>
      <div>
        <h3 className='font-baloo font-bold text-plum flex justify-between items-center'>Categories <i className='fa-solid fa-chevron-up text-[10px]'></i></h3>
        <div className='mt-2 space-y-2'>
          {shopCategories.map((c) => (
            <label key={c} className={check}>
              <input type='checkbox' checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} className='accent-primary' /> {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className='font-baloo font-bold text-plum flex justify-between items-center'>Price Range <i className='fa-solid fa-chevron-up text-[10px]'></i></h3>
        <div className='mt-2 space-y-2'>
          {priceRanges.map((r, i) => (
            <label key={r.label} className={check}>
              <input type='checkbox' checked={prices.includes(i)} onChange={() => toggle(prices, setPrices, i)} className='accent-primary' /> {r.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className='font-baloo font-bold text-plum mb-2'>Sort By</h3>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none'>
          <option value='popular'>Most Popular</option>
          <option value='low'>Price: Low to High</option>
          <option value='high'>Price: High to Low</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-24 pb-10'>
      <PageHero
        crumb='Shop'
        title='Shop Our'
        accent='Baby Products'
        text='Safe, fun and stylish essentials for your little one.'
        image={assets.heroBaby}
        button={{ label: 'Browse Products', to: '/shop' }}
      />

      {/* Category strip (desktop) */}
      <div className='hidden lg:flex gap-4 mt-5'>
        {[['Newborn', assets.categories.newborn], ['Feeding', assets.categories.feeding], ['Bath Time', assets.categories.bathTime], ['Toys & Play', assets.categories.toysPlay], ['On The Go', assets.categories.onTheGo]].map(([name, img]) => (
          <button key={name} onClick={() => { setCats([name]); setPage(1) }} className='rounded-2xl overflow-hidden bg-peach/50 hover:-translate-y-1 transition-all cursor-pointer'>
            <img src={img} alt={name} className='w-full h-20 object-cover object-top mix-blend-multiply' />
            <p className='text-xs font-bold text-gray-800 py-2'>{name}</p>
          </button>
        ))}
      </div>

      <div className='mt-6 grid md:grid-cols-[200px_1fr] gap-6'>
        {/* Filters */}
        <aside>
          <button onClick={() => setShowFilters(!showFilters)} className='md:hidden mb-3 px-4 py-2 rounded-full bg-lilac text-plum text-sm font-bold cursor-pointer'>
            <i className='fa-solid fa-sliders mr-2'></i>Filters
          </button>
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>{filters}</div>
        </aside>

        {/* Products */}
        <div>
          <div className='flex items-center justify-between mb-4 text-sm'>
            <p>{items.length === 0 ? 'No products found' : `Showing ${start + 1}–${start + visible.length} of ${items.length} products`}</p>
            <div className='flex gap-1'>
              <button onClick={() => setList(false)} aria-label='Grid view' className={`w-8 h-8 rounded-lg cursor-pointer ${!list ? 'bg-lilac text-plum' : 'text-gray-400'}`}><i className='fa-solid fa-table-cells-large'></i></button>
              <button onClick={() => setList(true)} aria-label='List view' className={`w-8 h-8 rounded-lg cursor-pointer ${list ? 'bg-lilac text-plum' : 'text-gray-400'}`}><i className='fa-solid fa-list'></i></button>
            </div>
          </div>

          <div className={list ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'}>
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-6'>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-full text-sm font-bold cursor-pointer ${page === i + 1 ? 'bg-plum text-white' : 'bg-white shadow text-gray-600'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(Math.min(pages, page + 1))} className='w-8 h-8 rounded-full bg-white shadow text-gray-600 cursor-pointer' aria-label='Next page'><i className='fa-solid fa-chevron-right text-xs'></i></button>
            </div>
          )}
        </div>
      </div>

      <ContactBanner title='Need Help Choosing?' text='Our baby product experts are here to help!' image={assets.products.elephantTeether} />
    </div>
  )
}

export default Shop
