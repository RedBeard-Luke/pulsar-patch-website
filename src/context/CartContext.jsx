/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/* ── Product catalog (single source of truth for all prices) ── */
export const PRODUCTS = [
  { id: 'single',    name: 'Single Patch',        price: 6.00,  originalPrice: null,  subscription: false, patches: 1 },
  { id: '3pack',     name: '3 Patch Bundle',      price: 15.80, originalPrice: 18.00, subscription: false, patches: 3 },
  { id: '6pack',     name: '6 Patch Combo',       price: 25.20, originalPrice: 36.00, subscription: false, patches: 6 },
  { id: 'kickback',  name: 'Kick Back Pack',      price: 35.33, originalPrice: 60.00, subscription: false, patches: 10 },
  { id: 'party',     name: 'Party Pack',          price: 90.00, originalPrice: 180.00, subscription: false, patches: 30 },
  { id: 'sub-weekend', name: 'The Weekend Warrior', price: 21.00, originalPrice: null, subscription: true, patches: 4 },
  { id: 'sub-social',  name: 'The Social Calendar', price: 36.00, originalPrice: null, subscription: true, patches: 8 },
  { id: 'sub-jugular', name: 'The Jugular',         price: 70.00, originalPrice: null, subscription: true, patches: 20 },
]

const STORAGE_KEY = 'pulsar-cart-v1'
const MAX_QTY = 99

const CartContext = createContext()

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Only keep entries that still exist in the catalog
    return parsed
      .filter(i => i && typeof i.productId === 'string' && PRODUCTS.some(p => p.id === i.productId))
      .map(i => ({ productId: i.productId, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(Number(i.qty) || 1))) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  // cart items: [{ productId, qty }]
  const [items, setItems] = useState(loadCart)
  // last product added — lets UI show a "just added" confirmation
  const [lastAdded, setLastAdded] = useState(null)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable (private mode) — cart stays in memory */
    }
  }, [items])

  const getProduct = useCallback((productId) => PRODUCTS.find(p => p.id === productId), [])

  const addToCart = useCallback((productId, qty = 1) => {
    if (!PRODUCTS.some(p => p.id === productId)) return
    const amount = Math.max(1, Math.floor(qty))
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (existing) {
        return prev.map(i =>
          i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + amount) } : i
        )
      }
      return [...prev, { productId, qty: Math.min(MAX_QTY, amount) }]
    })
    setLastAdded({ productId, at: Date.now() })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const decrementItem = useCallback((productId) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (!existing) return prev
      if (existing.qty <= 1) return prev.filter(i => i.productId !== productId)
      return prev.map(i =>
        i.productId === productId ? { ...i, qty: i.qty - 1 } : i
      )
    })
  }, [])

  const incrementItem = useCallback((productId) => {
    setItems(prev => prev.map(i =>
      i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i
    ))
  }, [])

  const setQuantity = useCallback((productId, qty) => {
    const clean = Math.floor(Number(qty))
    if (!clean || clean < 1) {
      setItems(prev => prev.filter(i => i.productId !== productId))
      return
    }
    setItems(prev => prev.map(i =>
      i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, clean) } : i
    ))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => {
    const product = getProduct(i.productId)
    return sum + (product ? product.price * i.qty : 0)
  }, 0)
  // Total savings vs. original prices (for a little conversion nudge)
  const totalSavings = items.reduce((sum, i) => {
    const product = getProduct(i.productId)
    if (product?.originalPrice) return sum + (product.originalPrice - product.price) * i.qty
    return sum
  }, 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      decrementItem,
      incrementItem,
      setQuantity,
      clearCart,
      getProduct,
      totalItems,
      subtotal,
      totalPrice: subtotal, // backwards-compatible alias
      totalSavings,
      lastAdded,
      PRODUCTS,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
