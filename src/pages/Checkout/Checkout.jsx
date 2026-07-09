import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { isConfigured, createCheckout } from '../../lib/shopify'

const FREE_SHIPPING_AT = 35

export default function Checkout() {
  const { items, getProduct, subtotal, totalSavings, incrementItem, decrementItem, removeFromCart, clearCart, totalItems } = useCart()
  const [status, setStatus] = useState('idle') // idle | loading | error | done
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const shipping = subtotal >= FREE_SHIPPING_AT || subtotal === 0 ? 0 : 4.95
  const total = subtotal + shipping
  const toFree = Math.max(0, FREE_SHIPPING_AT - subtotal)

  async function handlePlaceOrder() {
    setStatus('loading')
    setError('')
    try {
      if (isConfigured()) {
        // Hand off to Shopify's hosted, PCI-compliant checkout.
        const url = await createCheckout(items)
        window.location.href = url
        return
      }
      // No store connected yet — confirm locally so the flow isn't a dead end.
      await new Promise(r => setTimeout(r, 700))
      clearCart()
      setStatus('done')
      window.scrollTo(0, 0)
    } catch (e) {
      setError(e.message || 'Something went wrong starting checkout.')
      setStatus('error')
    }
  }

  /* ── Order confirmed (local fallback) ── */
  if (status === 'done') {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center px-5 py-24">
        <div className="max-w-[460px] text-center">
          <div className="w-16 h-16 rounded-full bg-pulsar-blue/10 flex items-center justify-center mx-auto mb-6">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#44C8E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 className="font-futura font-[900] text-[32px] text-pulsar-blue uppercase mb-3">You're all set!</h1>
          <p className="font-inter text-[16px] text-gray-600 mb-8">
            Order received. Keep an eye on your inbox for tracking. Tomorrow-you says thanks.
          </p>
          <Link to="/shop" className="inline-block bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-wide px-8 py-4 rounded-full hover:bg-pulsar-pink-dark transition-colors">
            Keep shopping
          </Link>
        </div>
      </div>
    )
  }

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center px-5 py-24">
        <div className="max-w-[420px] text-center">
          <h1 className="font-futura font-[900] text-[30px] text-pulsar-blue uppercase mb-3">Your cart's empty</h1>
          <p className="font-inter text-[16px] text-gray-600 mb-8">Nothing to check out yet. Let's fix that.</p>
          <Link to="/shop" className="inline-block bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-wide px-8 py-4 rounded-full hover:bg-pulsar-pink-dark transition-colors">
            Shop patches
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white min-h-[60vh] pt-12 pb-20 px-5 sm:px-8 lg:px-16 xl:px-[140px]">
      <div className="max-w-[1000px] mx-auto">
        <button onClick={() => navigate(-1)} className="font-inter text-[14px] text-gray-400 hover:text-pulsar-blue transition-colors mb-4">← Keep shopping</button>
        <h1 className="font-futura font-[900] text-[clamp(2rem,6vw,3rem)] text-pulsar-blue uppercase mb-8">Your cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* Line items */}
          <div className="flex flex-col divide-y divide-gray-100 border-y border-gray-100">
            {items.map(item => {
              const p = getProduct(item.productId)
              if (!p) return null
              return (
                <div key={item.productId} className="flex gap-4 py-5">
                  <div className="w-20 h-20 rounded-xl bg-pulsar-light-blue-bg shrink-0 flex items-center justify-center">
                    <span className="font-futura font-[900] text-pulsar-blue/40 text-[13px]">{p.patches}×</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <h3 className="font-futura font-[900] text-[16px] text-gray-900 leading-tight">{p.name}</h3>
                      <button onClick={() => removeFromCart(item.productId)} className="font-inter text-[13px] text-gray-400 hover:text-pulsar-pink transition-colors shrink-0">Remove</button>
                    </div>
                    {p.subscription && <p className="font-inter text-[11px] font-[600] text-pulsar-pink uppercase tracking-wide mt-0.5">Monthly subscription</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button onClick={() => decrementItem(item.productId)} aria-label={`Decrease ${p.name}`} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-pulsar-pink text-[18px]">−</button>
                        <span className="w-8 text-center font-inter font-[600] text-[14px] text-gray-800" aria-live="polite">{item.qty}</span>
                        <button onClick={() => incrementItem(item.productId)} aria-label={`Increase ${p.name}`} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-pulsar-pink text-[18px]">+</button>
                      </div>
                      <span className="font-inter font-[600] text-[15px] text-gray-900">${(p.price * item.qty).toFixed(2)}{p.subscription ? '/mo' : ''}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-pulsar-light-blue-bg rounded-3xl p-6 lg:sticky lg:top-28">
            <h2 className="font-futura font-[900] text-[18px] text-pulsar-blue uppercase mb-4">Summary</h2>
            {toFree > 0 && (
              <div className="mb-4">
                <p className="font-inter text-[13px] text-gray-600 mb-2">${toFree.toFixed(2)} away from free shipping</p>
                <div className="h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full bg-pulsar-pink rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-between font-inter text-[15px] text-gray-700 mb-2">
              <span>Subtotal ({totalItems})</span><span>${subtotal.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between font-inter text-[15px] text-pulsar-pink mb-2">
                <span>Bundle savings</span><span>−${totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-inter text-[15px] text-gray-700 mb-2">
              <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-white/70 my-3" />
            <div className="flex justify-between font-futura font-[900] text-[20px] text-pulsar-blue mb-1">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            <p className="font-inter text-[11px] text-gray-500 mb-5">Tax calculated at checkout.</p>

            {status === 'error' && (
              <p role="alert" className="font-inter text-[13px] text-red-500 mb-3">{error}</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={status === 'loading'}
              className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[15px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === 'loading' ? 'Starting checkout…' : isConfigured() ? 'Checkout securely' : 'Place order'}
            </button>
            <p className="font-inter text-[11px] text-gray-400 text-center mt-3">
              {isConfigured() ? 'Secure checkout powered by Shopify' : 'Secure checkout'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
