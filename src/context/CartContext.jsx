import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0)
  const addToCart = () => setCount((c) => c + 1)
  return <CartContext.Provider value={{ count, addToCart }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
