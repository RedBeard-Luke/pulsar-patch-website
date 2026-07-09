/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { notifyReviewScreening, submitLead } from '../lib/forms'
import { buildReviewScreeningEmail, SCREENING_RECIPIENTS } from '../lib/reviewEmail'

/**
 * Single source of truth for reviews and their screening state.
 *
 * Every review has a `status`:
 *   - 'pending'  submitted, waiting for the team to screen it (NOT shown on site)
 *   - 'live'     approved and public
 *   - 'denied'   rejected, kept out of the public list
 *
 * New reviews always land as 'pending' and trigger a screening email to the
 * team, so a rough review can be caught and handled before it publishes.
 */

const ReviewsContext = createContext()
const STORAGE_KEY = 'pulsar-reviews-v1'

// Approved reviews that ship with the site.
const SEED_LIVE = [
  { id: 1, stars: 5, title: 'IT REALLY WORKS!', text: "I've tried a bunch of patches and honestly didn't think a patch could do much for a hangover. But let me be real, at least once a week I'm out at an event or just having fun, and I feel so much better the next morning. No headache, no nausea. I cannot recommend this enough. I've already told several friends about it and they all LOVE it.", author: 'GABRIELA', date: '4 MONTHS AGO', verified: true, status: 'live' },
  { id: 2, stars: 5, title: 'INTERESTING, IT WORKS', text: "I bought this for a concert and put it on right before we started drinking. Woke up the next day with no headache or hangover! I usually wake up with a massive headache and the jitters, but not this time. I told my whole group about it and got them all on it too, and they love it. It was easy to put on and didn't smell. The patch is so unnoticeable you forget it's even on. I highly recommend this.", author: 'JORDAN M.', date: '7 MONTHS AGO', verified: true, status: 'live' },
  { id: 3, stars: 5, title: 'LOVE IT', text: 'Love it! Easy to use and very effective!', author: 'ADAM', date: '1 YEAR AGO', verified: true, status: 'live' },
  { id: 4, stars: 4, title: 'REALLY GOOD PRODUCT', text: "Really good product. Takes about 30 min to kick in but once it does, you're golden. Will definitely order again.", author: 'JESSICA', date: '5 MONTHS AGO', verified: true, status: 'live' },
  { id: 5, stars: 5, title: 'BACHELOR PARTY HERO', text: "Bought this for my bachelor party and every single person was amazed the next day. We felt great!", author: 'CHRIS', date: '4 MONTHS AGO', verified: true, status: 'live' },
  { id: 6, stars: 5, title: 'LIFESAVER', text: "As someone who gets terrible hangovers, this has been a lifesaver. Only three ingredients too, love the simplicity.", author: 'EMMA', date: '3 MONTHS AGO', verified: true, status: 'live' },
  { id: 7, stars: 3, title: 'DECENT', text: "It helped a bit but I still felt a little rough. Maybe I needed to apply it earlier. Will try again.", author: 'JAKE', date: '2 MONTHS AGO', verified: true, status: 'live' },
]

// A proactive bad review sitting in the screening queue so the flow is visible
// from the first load. This is the review shown in the Admin email preview.
const SEED_PENDING = [
  {
    id: 'seed-bad-1',
    stars: 1,
    title: 'PATCH DID NOTHING FOR ME',
    text: "Total waste of money. Put one on before a wedding like the instructions said and still woke up feeling awful. Nothing changed at all. Pretty disappointed for the price and would not buy again.",
    author: 'MARCUS T.',
    email: 'marcus.t@example.com',
    phone: '(480) 555-0173',
    orderNumber: '#PUL-3092',
    date: 'JUST NOW',
    submittedAt: 'Just now',
    verified: true,
    status: 'pending',
    held: false,
  },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return [...SEED_PENDING, ...SEED_LIVE]
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    } catch {
      /* storage unavailable */
    }
  }, [reviews])

  // Submit a new review: save as pending + notify the team for screening.
  const submitReview = useCallback((data) => {
    const review = {
      id: Date.now(),
      date: 'JUST NOW',
      submittedAt: new Date().toLocaleString(),
      verified: false,
      held: false,
      status: 'pending',
      ...data,
    }
    setReviews((prev) => [review, ...prev])

    const adminBase = typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined
    const html = buildReviewScreeningEmail(review, adminBase)
    notifyReviewScreening(review, { html, recipients: SCREENING_RECIPIENTS, adminBase }).catch(() => {
      /* Non-fatal: the review is queued regardless of email delivery. */
    })

    return review
  }, [])

  const approveReview = useCallback((id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'live', held: false, date: r.date === 'JUST NOW' ? 'JUST NOW' : r.date } : r)))
  }, [])

  const denyReview = useCallback((id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'denied', held: false } : r)))
  }, [])

  // "Wait": keep it out of the public list and flag that we're reaching out.
  const holdReview = useCallback((id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'pending', held: true } : r)))

    const target = reviews.find((r) => r.id === id)
    if (target) {
      submitLead('review-hold', {
        to: SCREENING_RECIPIENTS,
        note: 'Review held for outreach before publishing.',
        review: target,
      }).catch(() => {})
    }
  }, [reviews])

  const value = useMemo(() => {
    const liveReviews = reviews.filter((r) => r.status === 'live')
    const pendingReviews = reviews.filter((r) => r.status === 'pending')
    return { reviews, liveReviews, pendingReviews, submitReview, approveReview, denyReview, holdReview }
  }, [reviews, submitReview, approveReview, denyReview, holdReview])

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  return useContext(ReviewsContext)
}
