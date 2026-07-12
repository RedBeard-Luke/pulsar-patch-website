/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { fetchLivePrices } from '../lib/shopify'

/* Format a number as a display price, e.g. 6 → "$6.00". */
export function formatPrice(amount) {
  return `$${Number(amount || 0).toFixed(2)}`
}

/* ── Product catalog: these prices are PLACEHOLDER fallbacks. When Shopify is
   configured, live prices are fetched on load and override these, so the site
   always shows what checkout actually charges. ── */
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
  // live prices pulled from Shopify (keyed by catalog id); empty until loaded
  const [livePrices, setLivePrices] = useState({})

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable (private mode) — cart stays in memory */
    }
  }, [items])

  // On load, pull live prices from Shopify. Falls back silently to placeholders.
  useEffect(() => {
    let cancelled = false
    fetchLivePrices().then(prices => {
      if (!cancelled && prices && Object.keys(prices).length) setLivePrices(prices)
    })
    return () => { cancelled = true }
  }, [])

  // Merge live prices over the placeholder catalog. This is what the whole app reads.
  const catalog = useMemo(() => PRODUCTS.map(p => {
    const live = livePrices[p.id]
    if (!live) return p
    return { ...p, price: live.price, originalPrice: live.originalPrice, currency: live.currency }
  }), [livePrices])

  const getProduct = useCallback((productId) => catalog.find(p => p.id === productId), [catalog])

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
      PRODUCTS: catalog,
      pricesLive: Object.keys(livePrices).length > 0,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
