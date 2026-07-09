import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

/**
 * Global "added to cart" confirmation. Watches CartContext.lastAdded so every
 * add-to-cart on the site gets feedback without touching each page.
 */
export default function CartToast() {
  const { lastAdded, getProduct } = useCart()
  const { openCart, cartOpen } = useUI()
  const [visible, setVisible] = useState(false)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!lastAdded) return
    const p = getProduct(lastAdded.productId)
    if (!p) return
    // Reacting to an external "add to cart" event — an effect is the right tool here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProduct(p)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3200)
    return () => clearTimeout(t)
  }, [lastAdded, getProduct])

  // Don't stack the toast on top of the open drawer
  const show = visible && !cartOpen

  return (
    <div
      aria-live="polite"
      className={`fixed z-[1400] left-1/2 -translate-x-1/2 bottom-5 sm:left-auto sm:right-6 sm:translate-x-0 w-[calc(100%-2.5rem)] sm:w-[360px] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      {product && (
        <div className="bg-white rounded-2xl shadow-2xl border border-pulsar-light-blue p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-pulsar-blue/10 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#44C8E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-futura font-[800] text-[13px] text-pulsar-blue uppercase tracking-wide leading-tight">Added to cart</p>
            <p className="font-inter text-[13px] text-gray-600 truncate">{product.name}</p>
          </div>
          <button
            onClick={() => { setVisible(false); openCart() }}
            className="shrink-0 bg-pulsar-pink text-white font-futura font-[800] text-[11px] uppercase tracking-wide px-4 py-2 rounded-full hover:bg-pulsar-pink-dark transition-colors"
          >
            View
          </button>
        </div>
      )}
    </div>
  )
}
