import { createContext, useContext, useEffect, useState } from "react";
import { allProducts } from "../assets/assets";

const CartContext = createContext();

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("wones-cart")) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(load); // [{ id, qty }]

  useEffect(() => {
    try {
      localStorage.setItem("wones-cart", JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      return found
        ? prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i,
          )
        : [...prev, { id: product.id, qty }];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const cartItems = items
    .map((i) => ({
      product: allProducts.find((p) => p.id === i.id),
      qty: i.qty,
    }))
    .filter((i) => i.product);

  const count = cartItems.reduce((n, i) => n + i.qty, 0);
  const subtotal = cartItems.reduce((n, i) => n + i.qty * i.product.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        count,
        subtotal,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
