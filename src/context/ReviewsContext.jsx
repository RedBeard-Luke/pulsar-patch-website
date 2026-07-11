/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { notifyReviewScreening, submitLead } from '../lib/forms'
import { buildReviewScreeningEmail, SCREENING_RECIPIENTS } from '../lib/reviewEmail'
import { supabase } from '../lib/supabase'

/**
 * Reviews store. Two modes:
 *   - Supabase configured → real database. Public reads live reviews and submits
 *     pending ones; admins (signed in) also see pending and can approve/deny/hold.
 *   - Not configured → falls back to localStorage so local dev / preview still works.
 *
 * A new review is always 'pending' and never shows publicly until approved.
 */

const ReviewsContext = createContext()
const STORAGE_KEY = 'pulsar-reviews-v1'

// ── localStorage seeds (fallback mode only) ──────────────────────────────
const SEED_LIVE = [
  { id: 1, stars: 5, title: 'IT REALLY WORKS!', text: "I've tried a bunch of patches and honestly didn't think a patch could do much for a hangover. But at least once a week I'm out having fun, and I feel so much better the next morning. No headache, no nausea. I cannot recommend this enough.", author: 'GABRIELA', date: '4 MONTHS AGO', verified: true, status: 'live' },
  { id: 2, stars: 5, title: 'INTERESTING, IT WORKS', text: "I bought this for a concert and put it on right before we started drinking. Woke up the next day with no headache! The patch is so unnoticeable you forget it's even on. Highly recommend.", author: 'JORDAN M.', date: '7 MONTHS AGO', verified: true, status: 'live' },
  { id: 3, stars: 5, title: 'LOVE IT', text: 'Love it! Easy to use and very effective!', author: 'ADAM', date: '1 YEAR AGO', verified: true, status: 'live' },
  { id: 4, stars: 4, title: 'REALLY GOOD PRODUCT', text: "Really good product. Takes about 30 min to kick in but once it does, you're golden. Will definitely order again.", author: 'JESSICA', date: '5 MONTHS AGO', verified: true, status: 'live' },
  { id: 5, stars: 5, title: 'BACHELOR PARTY HERO', text: "Bought this for my bachelor party and every single person was amazed the next day. We felt great!", author: 'CHRIS', date: '4 MONTHS AGO', verified: true, status: 'live' },
  { id: 6, stars: 5, title: 'LIFESAVER', text: "As someone who gets terrible hangovers, this has been a lifesaver. Only three ingredients too, love the simplicity.", author: 'EMMA', date: '3 MONTHS AGO', verified: true, status: 'live' },
  { id: 7, stars: 3, title: 'DECENT', text: "It helped a bit but I still felt a little rough. Maybe I needed to apply it earlier. Will try again.", author: 'JAKE', date: '2 MONTHS AGO', verified: true, status: 'live' },
]
const SEED_PENDING = [
  { id: 'seed-bad-1', stars: 1, title: 'PATCH DID NOTHING FOR ME', text: 'Total waste of money. Put one on before a wedding and still woke up feeling awful. Nothing changed. Would not buy again.', author: 'MARCUS T.', email: 'marcus.t@example.com', phone: '(480) 555-0173', orderNumber: '#PUL-3092', date: 'JUST NOW', submittedAt: 'Just now', verified: true, status: 'pending', held: false },
]

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return [...SEED_PENDING, ...SEED_LIVE]
}

// ── DB row <-> app shape mapping ─────────────────────────────────────────
function fromRow(r) {
  return {
    id: r.id,
    stars: r.stars,
    title: r.title,
    text: r.text,
    author: r.author,
    email: r.email,
    phone: r.phone,
    orderNumber: r.order_number,
    status: r.status,
    held: r.held,
    submittedAt: r.created_at ? new Date(r.created_at).toLocaleString() : 'Just now',
    date: 'JUST NOW',
    verified: false,
  }
}
function toRow(review) {
  return {
    stars: review.stars,
    title: review.title || null,
    text: review.text,
    author: review.author,
    email: review.email || null,
    phone: review.phone || null,
    order_number: review.orderNumber || null,
    status: 'pending',
  }
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => (supabase ? [] : loadLocal()))

  // Pull whatever this viewer is allowed to see (public → live only; admin → all).
  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setReviews(data.map(fromRow))
  }, [])

  useEffect(() => {
    if (!supabase) return
    // Load happens via an async fetch (state set after await), not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
    // Re-pull when an admin signs in/out so the pending queue appears/disappears.
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh())
    return () => sub.subscription.unsubscribe()
  }, [refresh])

  // Persist to localStorage only in fallback mode.
  useEffect(() => {
    if (supabase) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)) } catch { /* ignore */ }
  }, [reviews])

  const submitReview = useCallback(async (data) => {
    const review = {
      id: Date.now(),
      date: 'JUST NOW',
      submittedAt: new Date().toLocaleString(),
      verified: false,
      held: false,
      status: 'pending',
      ...data,
    }

    if (supabase) {
      // No .select() — a pending row isn't readable by the public, and we don't
      // need it back. Errors here are non-fatal for the reviewer.
      const { error } = await supabase.from('reviews').insert(toRow(review))
      if (error) console.warn('Review insert failed:', error.message)
    } else {
      setReviews((prev) => [review, ...prev])
    }

    const adminBase = typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined
    const html = buildReviewScreeningEmail(review, adminBase)
    notifyReviewScreening(review, { html, recipients: SCREENING_RECIPIENTS, adminBase }).catch(() => {})

    return review
  }, [])

  const setStatus = useCallback(async (id, status, held) => {
    if (supabase) {
      const { error } = await supabase.from('reviews').update({ status, held }).eq('id', id)
      if (error) console.warn('Review update failed:', error.message)
      await refresh()
    } else {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status, held } : r)))
      if (held && status === 'pending') {
        const target = reviews.find((r) => r.id === id)
        if (target) submitLead('review-hold', { to: SCREENING_RECIPIENTS, note: 'Held for outreach before publishing.', review: target }).catch(() => {})
      }
    }
  }, [refresh, reviews])

  const approveReview = useCallback((id) => setStatus(id, 'live', false), [setStatus])
  const denyReview = useCallback((id) => setStatus(id, 'denied', false), [setStatus])
  const holdReview = useCallback((id) => setStatus(id, 'pending', true), [setStatus])

  const value = useMemo(() => {
    const liveReviews = reviews.filter((r) => r.status === 'live')
    const pendingReviews = reviews.filter((r) => r.status === 'pending')
    return { reviews, liveReviews, pendingReviews, submitReview, approveReview, denyReview, holdReview, refresh }
  }, [reviews, submitReview, approveReview, denyReview, holdReview, refresh])

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  return useContext(ReviewsContext)
}
