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
// The real reviews carried over from the old Pulsar site. No titles (these are
// Google-style reviews) and all verified buyers.
const SEED_LIVE = [
  { id: 1, stars: 5, text: "These have become a staple amongst my fellow parents at hockey tournaments (we're all in the same hotel and don't have to drive anywhere, so...). It works every time for everyone who uses it!", author: 'SEAN', date: '5 MONTHS AGO', verified: true, status: 'live' },
  { id: 2, stars: 5, text: "I've tried multiple patches and never have seem to really understand the whole hangover cure thing from just a patch. But as soon as I tried Pulsar Patch, I kid you not, I felt completely normal the next day. I was not expecting that feeling especially with the amount of alcohol I do intake. I have already recommend several friends this product and they all LOVE it.", author: 'GABRIELLA', date: '10 MONTHS AGO', verified: true, status: 'live' },
  { id: 3, stars: 5, text: "The patch worked great! Slapped it on right before we started drinking and woke up feeling good the next day with no headache or hangover. I usually wake up with a massive headache and this time I didn't. I had tried some anti-hangover drinks before and to start off, they taste nasty, left a nasty taste in my mouth and didn't work. The patch is very unnoticeable and you forget it's even on. I highly recommend you try it.", author: 'CHRIS M.', date: '1 YEAR AGO', verified: true, status: 'live' },
  { id: 4, stars: 5, text: 'Love it! Easy to use and very effective!', author: 'ADAM', date: '1 YEAR AGO', verified: true, status: 'live' },
  { id: 5, stars: 5, text: 'Very easily accessible and looks nice as well, can tell there was effort put into this.', author: 'SAMUEL', date: '1 YEAR AGO', verified: true, status: 'live' },
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

// Coarse "5 MONTHS AGO" label from a timestamp, for the public review cards.
function relativeDate(input) {
  if (!input) return 'JUST NOW'
  const then = new Date(input).getTime()
  if (Number.isNaN(then)) return 'JUST NOW'
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days < 1) return 'JUST NOW'
  if (days < 30) return `${days} DAY${days === 1 ? '' : 'S'} AGO`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} MONTH${months === 1 ? '' : 'S'} AGO`
  const years = Math.floor(months / 12)
  return `${years} YEAR${years === 1 ? '' : 'S'} AGO`
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
    didItWork: r.did_it_work,
    recommend: r.recommend,
    status: r.status,
    held: r.held,
    submittedAt: r.created_at ? new Date(r.created_at).toLocaleString() : 'Just now',
    date: relativeDate(r.created_at),
    verified: r.verified ?? true,
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
    did_it_work: review.didItWork ?? null,
    recommend: review.recommend ?? null,
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
