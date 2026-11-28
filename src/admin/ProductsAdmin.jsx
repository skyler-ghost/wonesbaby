import { useCallback, useEffect, useState } from 'react'
import { formatMoney, imageUrl } from '../lib/api'
import { useStore } from '../context/StoreContext'


const CATEGORY_OPTIONS = ['Feeding', 'Teethers', 'Bath Time', 'Toys & Play', 'On The Go']

const input = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary'
const blank = { name: '', category: '', price: '', oldPrice: '', stock: '0', description: '', featured: false, active: true }

const ProductForm = ({ product, categories, call, onClose, onSaved }) => {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          category: product.category,
          price: String(product.price),
          oldPrice: product.oldPrice ? String(product.oldPrice) : '',
          stock: String(product.stock),
          description: product.description || '',
          featured: product.featured,
          active: product.active,
        }
      : blank
  )
  const [keep, setKeep] = useState(product?.images || []) // existing images to keep
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (product) fd.append('images', JSON.stringify(keep)) // tells the server which old images to keep
      // Note: the file field is also called "images"; multer reads files, req.body.images is the JSON list
      files.forEach((f) => fd.append('images', f))

      const path = product ? `/api/products/${product._id}` : '/api/products'
      await call(path, { method: product ? 'PUT' : 'POST', form: fd })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center overflow-y-auto p-3'>
      <form onSubmit={submit} className='w-full max-w-xl rounded-2xl bg-white p-5 space-y-3 my-4'>
        <div className='flex items-center justify-between'>
          <h2 className='font-baloo text-xl font-bold text-plum'>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button type='button' onClick={onClose} aria-label='Close' className='text-gray-500 text-xl cursor-pointer'><i className='fa-solid fa-xmark'></i></button>
        </div>

        <input value={form.name} onChange={set('name')} required placeholder='Product name *' className={input} />
        <div className='grid sm:grid-cols-2 gap-3'>
          <div>
            <select value={form.category} onChange={set('category')} required className={input}>
            <option value='' disabled>Select category *</option>
              {[...new Set([...CATEGORY_OPTIONS, ...categories])].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input type='number' min='0' value={form.stock} onChange={set('stock')} required placeholder='Stock' className={input} />
          <input type='number' min='0' step='0.01' value={form.price} onChange={set('price')} required placeholder='Price *' className={input} />
          <input type='number' min='0' step='0.01' value={form.oldPrice} onChange={set('oldPrice')} placeholder='Old price (optional, shows a sale)' className={input} />
        </div>
        <textarea value={form.description} onChange={set('description')} rows={3} placeholder='Description' className={`${input} resize-none`}></textarea>

        <div className='flex flex-wrap gap-5 text-sm'>
          <label className='flex items-center gap-2 cursor-pointer'><input type='checkbox' checked={form.featured} onChange={set('featured')} className='accent-primary' /> Featured on home page</label>
          <label className='flex items-center gap-2 cursor-pointer'><input type='checkbox' checked={form.active} onChange={set('active')} className='accent-primary' /> Visible in store</label>
        </div>

        <div>
          <p className='text-sm font-semibold text-plum mb-2'>Images</p>
          <div className='flex flex-wrap gap-2'>
            {keep.map((img) => (
              <div key={img} className='relative'>
                <img src={imageUrl(img)} alt='' className='w-16 h-16 rounded-lg object-cover' />
                <button type='button' onClick={() => setKeep(keep.filter((k) => k !== img))} aria-label='Remove image' className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] cursor-pointer'><i className='fa-solid fa-xmark'></i></button>
              </div>
            ))}
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`} className='relative'>
                <img src={URL.createObjectURL(f)} alt='' className='w-16 h-16 rounded-lg object-cover ring-2 ring-primary/40' />
                <button type='button' onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label='Remove image' className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] cursor-pointer'><i className='fa-solid fa-xmark'></i></button>
              </div>
            ))}
          </div>
          <input type='file' accept='image/jpeg,image/png,image/webp' multiple onChange={(e) => setFiles([...files, ...e.target.files].slice(0, 6 - keep.length))} className='mt-2 text-xs' />
          <p className='text-[11px] text-gray-400 mt-1'>JPG, PNG or WebP, up to 5MB each, 6 images max. The first image is the main photo.</p>
        </div>

        {error && <p className='text-sm font-semibold text-red-600'>{error}</p>}
        <div className='flex gap-3 pt-1'>
          <button type='submit' disabled={busy} className='flex-1 py-2.5 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold cursor-pointer'>{busy ? 'Saving…' : 'Save Product'}</button>
          <button type='button' onClick={onClose} className='px-6 py-2.5 rounded-full bg-lilac text-plum font-bold cursor-pointer'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

const ProductsAdmin = ({ call }) => {
  const { currency } = useStore()
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product

  const load = useCallback(() => {
    call('/api/products/admin/all?limit=100&sort=newest').then((d) => setProducts(d.products)).catch((e) => setError(e.message))
  }, [call])
  useEffect(() => { load() }, [load])

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      await call(`/api/products/${p._id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const categories = [...new Set((products || []).map((p) => p.category))]

  return (
    <>
      <div className='flex items-center justify-between gap-3'>
        <h1 className='font-baloo text-2xl md:text-3xl font-bold text-plum'>Products</h1>
        <button onClick={() => setEditing('new')} className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold cursor-pointer'><i className='fa-solid fa-plus mr-2'></i>Add Product</button>
      </div>
      {error && <p className='mt-3 text-sm font-semibold text-red-600'>{error}</p>}
      {!products && !error && <p className='mt-4 text-sm text-gray-500'>Loading products…</p>}
      {products && products.length === 0 && <p className='mt-6 text-sm text-gray-500'>No products yet. Add your first one, or run <code>npm run seed</code> to load the sample catalogue.</p>}

      {products && products.length > 0 && (
        <div className='mt-4 rounded-2xl bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-3 overflow-x-auto'>
          <table className='w-full text-sm min-w-[560px]'>
            <thead>
              <tr className='text-left text-xs text-gray-500'><th className='p-2 font-semibold'>Product</th><th className='font-semibold'>Category</th><th className='font-semibold'>Price</th><th className='font-semibold'>Stock</th><th className='font-semibold'>Status</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className='border-t border-gray-100'>
                  <td className='p-2'>
                    <div className='flex items-center gap-3'>
                      <img src={imageUrl(p.images[0])} alt='' className='w-10 h-10 rounded-lg object-cover bg-peach/30' />
                      <span className='font-semibold text-gray-800'>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td className='font-bold'>{formatMoney(p.price, currency)}</td>
                  <td className={p.stock <= 5 ? 'text-primary font-bold' : ''}>{p.stock}</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.active ? 'bg-mint text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.active ? 'Live' : 'Hidden'}</span>
                    {p.featured && <span className='ml-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sunny/60 text-orange-500'>Featured</span>}
                  </td>
                  <td className='text-right whitespace-nowrap'>
                    <button onClick={() => setEditing(p)} aria-label='Edit' className='w-8 h-8 rounded-lg text-plum hover:bg-lilac cursor-pointer'><i className='fa-solid fa-pen'></i></button>
                    <button onClick={() => remove(p)} aria-label='Delete' className='w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer'><i className='fa-regular fa-trash-can'></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing._id}
          product={editing === 'new' ? null : editing}
          categories={categories}
          call={call}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </>
  )
}

export default ProductsAdmin
