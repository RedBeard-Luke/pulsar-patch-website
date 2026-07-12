import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { submitLead, isEmail } from '../../lib/forms'
import squiggle from '../../assets/Squigle_What is Pulsar.svg'
import patchFront from '../../assets/patch-front.svg'

/*
 * DiscountPopup — first-visit "15% off" email capture for the home page.
 *
 * Shows once (localStorage-gated) a moment after the home page loads. On submit
 * it fires a 'welcome-discount' lead so the backend can (1) email the visitor
 * their one-time code and (2) add them to the newsletter list, then reveals the
 * code on screen so they have it immediately either way.
 *
 * The code itself is a shared code you create in Shopify and set to "one use
 * per customer" (see README / setup notes). Swap WELCOME_CODE to match it.
 */

const STORAGE_KEY = 'pulsar-welcome-15' // set once claimed or dismissed
const WELCOME_CODE = 'PULSAR15' // must match the discount code created in Shopify
const SHOW_DELAY = 1600 // ms after mount before it appears

export default function DiscountPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  // First-time visitors only, after a short delay
  useEffect(() => {
    let seen = null
    try { seen = localStorage.getItem(STORAGE_KEY) } catch { /* ignore */ }
    if (seen) return
    const t = setTimeout(() => setOpen(true), SHOW_DELAY)
    return () => clearTimeout(t)
  }, [])

  // Lock scroll + focus the field + Escape to close, while open
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusT = setTimeout(() => inputRef.current?.focus(), 350)
    const onKey = (e) => { if (e.key === 'Escape') close('dismissed') }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      clearTimeout(focusT)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function close(reason) {
    setOpen(false)
    try { localStorage.setItem(STORAGE_KEY, reason) } catch { /* ignore */ }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isEmail(email)) { setError('Enter a valid email so we can send your code.'); return }
    setStatus('loading')
    try {
      await submitLead('welcome-discount', {
        email: email.trim(),
        code: WELCOME_CODE,
        source: 'home-welcome-popup',
      })
      setStatus('done')
      try { localStorage.setItem(STORAGE_KEY, 'claimed') } catch { /* ignore */ }
    } catch {
      setStatus('error')
      setError('Something went wrong. Try again in a sec.')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => close('dismissed')}
      role="dialog"
      aria-modal="true"
      aria-label="15% off your first order"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[430px] rounded-[28px] overflow-hidden shadow-2xl bg-pulsar-blue text-white animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* Texture + faded patch */}
        <img src={squiggle} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none" />
        <img src={patchFront} alt="" className="absolute -right-8 -bottom-8 w-[150px] opacity-20 rotate-[18deg] pointer-events-none select-none" draggable={false} />

        {/* Close */}
        <button
          onClick={() => close('dismissed')}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>

        <div className="relative z-10 px-7 sm:px-9 py-10 text-center">
          {status === 'done' ? (
            /* ── Success ── */
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-5">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#DE64A5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h2 className="font-futura font-[900] text-[28px] uppercase tracking-wide leading-none mb-3">You're in!</h2>
              <p className="font-inter text-[14px] text-white/85 leading-[1.6] mb-5">
                Here's your code for 15% off your first order. We just emailed it to you too, so it's easy to find at checkout.
              </p>
              <div className="w-full border-2 border-dashed border-white/50 rounded-[14px] py-4 mb-6">
                <span className="font-futura font-[900] text-[26px] tracking-[3px] text-white">{WELCOME_CODE}</span>
              </div>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[15px] uppercase tracking-widest py-3.5 rounded-full shadow-md transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            /* ── Capture ── */
            <>
              <span className="inline-block font-futura font-bold text-[12px] uppercase tracking-[3px] text-white/70 mb-4">First time here?</span>
              <h2 className="font-futura font-[900] text-[34px] sm:text-[38px] uppercase leading-[0.95] tracking-wide">You've got</h2>
              <div className="inline-block bg-pulsar-pink px-5 py-1.5 my-3 -rotate-1 shadow-md">
                <span className="font-futura font-[900] text-[38px] sm:text-[44px] uppercase leading-none tracking-wide">15% off</span>
              </div>
              <p className="font-inter text-[14px] text-white/85 leading-[1.6] mb-6 max-w-[320px] mx-auto">
                Drop your email and we'll send a one-time code for 15% off your first order. Plus the occasional good email, never spam.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                <input
                  ref={inputRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  aria-label="Email address"
                  className="w-full bg-white rounded-full px-5 py-3.5 font-inter text-[15px] text-gray-800 placeholder-gray-400 outline-none focus:ring-4 focus:ring-white/30"
                />
                {error && <p className="font-inter text-[13px] text-white bg-pulsar-pink-dark/80 rounded-full px-4 py-2">{error}</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-pulsar-pink text-white font-futura font-[800] text-[15px] uppercase tracking-widest py-3.5 rounded-full shadow-md transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === 'loading' ? 'Sending…' : 'Send my code'}
                </button>
              </form>

              <button
                onClick={() => close('dismissed')}
                className="mt-4 font-inter text-[13px] text-white/60 hover:text-white underline underline-offset-4 transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
