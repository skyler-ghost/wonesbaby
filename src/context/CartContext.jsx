import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useStore } from './StoreContext'

const CartContext = createContext()
const KEY = 'wones-cart-v2'
const MAX_QTY = 99

// A cart line keeps a small snapshot of the product so the cart renders instantly.
// Prices are re-checked against the server in syncCart(), and the server always
// recalculates prices at checkout, so this snapshot is never trusted for payment.
const snapshot = (p) => ({
  id: p._id,
  name: p.name,
  price: p.price,
  category: p.category,
  image: p.images?.[0] || '',
  stock: p.stock,
})

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(saved) ? saved.filter((i) => i?.product?.id && i.qty > 0) : []
  } catch {
    return []
  }
}

const limit = (product, qty) => Math.max(1, Math.min(qty, MAX_QTY, product.stock > 0 ? product.stock : MAX_QTY))

export const CartProvider = ({ children }) => {
  const { shippingFee } = useStore()
  const [items, setItems] = useState(load) // [{ product: snapshot, qty }]

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable: cart just won't persist */
    }
  }, [items])

  const addToCart = (product, qty = 1) => {
    const snap = snapshot(product)
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === snap.id)
      return found
        ? prev.map((i) => (i.product.id === snap.id ? { product: snap, qty: limit(snap, i.qty + qty) } : i))
        : [...prev, { product: snap, qty: limit(snap, qty) }]
    })
  }

  const updateQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: limit(i.product, qty) } : i)))
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id))
  const clearCart = () => setItems([])

  // Refresh prices and stock from the server; drop products that no longer exist.
  const syncCart = useCallback(async () => {
    const current = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (!current.length) return
    const results = await Promise.allSettled(current.map((i) => api(`/api/products/${i.product.id}`)))
    setItems((prev) =>
      prev
        .map((line, idx) => {
          const r = results[idx]
          if (!r || r.status === 'fulfilled') {
            if (!r) return line
            const snap = snapshot(r.value.product)
            return { product: snap, qty: limit(snap, line.qty) }
          }
          // Only remove on a definite "not found" / invalid id, keep the line on network errors
          return [404, 400].includes(r.reason?.status) ? null : line
        })
        .filter(Boolean)
    )
  }, [])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => n + i.qty * i.product.price, 0)
  const shipping = items.length ? shippingFee : 0

  return (
    <CartContext.Provider
      value={{
        cartItems: items,
        count,
        subtotal,
        shipping,
        total: subtotal + shipping,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
