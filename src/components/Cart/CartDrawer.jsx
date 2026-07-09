import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

const FREE_SHIPPING_AT = 35

export default function CartDrawer() {
  const { items, getProduct, incrementItem, decrementItem, removeFromCart, addToCart, subtotal, totalItems, totalSavings, PRODUCTS } = useCart()
  const { cartOpen, closeCart } = useUI()

  const toFree = Math.max(0, FREE_SHIPPING_AT - subtotal)
  const suggestions = PRODUCTS.filter(p => !p.subscription && !items.find(i => i.productId === p.id)).slice(0, 2)

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[1500] transition-opacity duration-300 ${cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-[100dvh] bg-white shadow-2xl z-[2000] w-full max-w-[440px] flex flex-col transform transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-gray-100 shrink-0">
          <span className="font-futura font-[800] text-[15px] text-pulsar-blue uppercase tracking-wide">Your Cart ({totalItems})</span>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 -mr-2 hover:opacity-60 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center pt-10">
              <div className="w-16 h-16 rounded-full bg-pulsar-light-blue-bg flex items-center justify-center mb-5">
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="#44C8E8" strokeWidth="1.8"><path d="M1 1H3.5L5.5 13H16L18.5 4.5H4.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="17" r="1.5" fill="#44C8E8" /><circle cx="15" cy="17" r="1.5" fill="#44C8E8" /></svg>
              </div>
              <h3 className="font-futura font-[900] text-[22px] text-pulsar-blue uppercase mb-2">Your cart's empty</h3>
              <p className="font-inter text-[14px] text-gray-500 mb-6">Tomorrow-you is waiting. Let's stock up.</p>
              <Link to="/shop" onClick={closeCart} className="bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest py-3.5 px-8 rounded-full shadow-md transition-transform hover:-translate-y-0.5">
                Shop patches
              </Link>
            </div>
          ) : (
            <>
              {/* Free shipping nudge */}
              <div className="mb-6">
                <p className="font-inter text-[13px] text-gray-600 mb-2">
                  {toFree > 0 ? <>You're <strong className="text-pulsar-pink">${toFree.toFixed(2)}</strong> from free shipping</> : <span className="text-pulsar-pink font-[600]">You've unlocked free shipping!</span>}
                </p>
                <div className="h-2 rounded-full bg-pulsar-light-blue-bg overflow-hidden">
                  <div className="h-full bg-pulsar-pink rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)}%` }} />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {items.map(item => {
                  const p = getProduct(item.productId)
                  if (!p) return null
                  return (
                    <div key={item.productId} className="flex gap-4">
                      <div className="w-[76px] h-[76px] rounded-xl bg-pulsar-light-blue-bg shrink-0 flex items-center justify-center">
                        <span className="font-futura font-[900] text-pulsar-blue/40 text-[13px]">{p.patches}×</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <span className="font-futura font-[900] text-[15px] text-gray-900 leading-tight">{p.name}</span>
                          <button onClick={() => removeFromCart(item.productId)} aria-label={`Remove ${p.name}`} className="text-gray-300 hover:text-pulsar-pink transition-colors shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                          </button>
                        </div>
                        {p.subscription && <span className="font-inter text-[11px] font-[600] text-pulsar-pink uppercase tracking-wide">Monthly</span>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-full">
                            <button onClick={() => decrementItem(item.productId)} aria-label={`Decrease ${p.name} quantity`} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pulsar-pink text-[18px] leading-none">−</button>
                            <span className="w-7 text-center font-inter font-[600] text-[14px] text-gray-800">{item.qty}</span>
                            <button onClick={() => incrementItem(item.productId)} aria-label={`Increase ${p.name} quantity`} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pulsar-pink text-[18px] leading-none">+</button>
                          </div>
                          <span className="font-inter font-[600] text-[15px] text-gray-900">${(p.price * item.qty).toFixed(2)}{p.subscription ? '/mo' : ''}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-futura font-[900] text-[13px] text-pulsar-blue uppercase tracking-wide mb-4">Add & save more</h4>
                  <div className="flex flex-col gap-3">
                    {suggestions.map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-pulsar-light-blue-bg shrink-0 flex items-center justify-center">
                          <span className="font-futura font-[900] text-pulsar-blue/40 text-[11px]">{p.patches}×</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-futura font-[800] text-[13px] text-gray-800 truncate">{p.name}</p>
                          <p className="font-inter text-[13px] text-gray-500">${p.price.toFixed(2)}</p>
                        </div>
                        <button onClick={() => addToCart(p.id)} className="bg-pulsar-blue text-white font-futura font-[800] text-[11px] uppercase px-4 py-2 rounded-full hover:bg-pulsar-blue-dark transition-colors">Add</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer / checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 sm:px-8 py-5 shrink-0">
            {totalSavings > 0 && (
              <div className="flex justify-between font-inter text-[13px] text-pulsar-pink mb-1">
                <span>You're saving</span><span>${totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-futura font-[900] text-[16px] text-gray-900 uppercase tracking-wide">Subtotal</span>
              <span className="font-inter font-[700] text-[20px] text-pulsar-blue">${subtotal.toFixed(2)}</span>
            </div>
            <p className="font-inter text-[11px] text-gray-400 mb-4">Shipping & tax calculated at checkout.</p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[16px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5 text-center block"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
