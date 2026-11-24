import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext()
const KEY = 'wones-wishlist-v1'

// Only product IDs are stored. Names, prices, photos and stock are always fetched fresh from the API.
const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(saved) ? [...new Set(saved.filter((id) => typeof id === 'string' && id))] : []
  } catch {
    return []
  }
}

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(load)

  // Save on every change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {
      /* storage unavailable: wishlist just won't persist */
    }
  }, [ids])

  // Keep several open tabs in step
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setIds(load()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])
  const add = useCallback((id) => setIds((prev) => (prev.includes(id) ? prev : [id, ...prev])), [])
  const remove = useCallback((id) => setIds((prev) => prev.filter((x) => x !== id)), [])
  const toggle = useCallback((id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({ ids, count: ids.length, has, add, remove, toggle, clear }),
    [ids, has, add, remove, toggle, clear]
  )
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => useContext(WishlistContext)
