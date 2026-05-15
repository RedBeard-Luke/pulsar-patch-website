import { createContext, useContext, useState } from 'react'

/* ── Product catalog (single source of truth for all prices) ── */
export const PRODUCTS = [
  { id: 'single',    name: 'Single Patch',        price: 6.00,  originalPrice: null,  subscription: false },
  { id: '3pack',     name: '3 Patch Bundle',      price: 15.80, originalPrice: 18.00, subscription: false },
  { id: '6pack',     name: '6 Patch Combo',       price: 25.20, originalPrice: 36.00, subscription: false },
  { id: 'kickback',  name: 'Kick Back Pack',      price: 35.33, originalPrice: 60.00, subscription: false },
  { id: 'party',     name: 'Party Pack',          price: 90.00, originalPrice: 180.00, subscription: false },
  { id: 'sub-weekend', name: 'The Weekend Warrior', price: 21.00, originalPrice: null, subscription: true, patches: 4 },
  { id: 'sub-social',  name: 'The Social Calendar', price: 36.00, originalPrice: null, subscription: true, patches: 8 },
  { id: 'sub-jugular', name: 'The Jugular',         price: 70.00, originalPrice: null, subscription: true, patches: 20 },
]

const CartContext = createContext()

export function CartProvider({ children }) {
  // cart items: [{ productId, qty }]
  const [items, setItems] = useState([])

  function addToCart(productId) {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (existing) {
        return prev.map(i =>
          i.productId === productId ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { productId, qty: 1 }]
    })
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  function decrementItem(productId) {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (!existing) return prev
      if (existing.qty <= 1) return prev.filter(i => i.productId !== productId)
      return prev.map(i =>
        i.productId === productId ? { ...i, qty: i.qty - 1 } : i
      )
    })
  }

  function getProduct(productId) {
    return PRODUCTS.find(p => p.id === productId)
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => {
    const product = getProduct(i.productId)
    return sum + (product ? product.price * i.qty : 0)
  }, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, decrementItem, getProduct, totalItems, totalPrice, PRODUCTS }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
