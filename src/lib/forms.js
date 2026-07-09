/**
 * Single entry point for every form on the site (contact, wholesale inquiry,
 * business application, newsletter, reviews). Point this at a real endpoint to
 * go live — a Vercel serverless function, Formspree, Shopify, Klaviyo, etc.
 * Keep any private API keys in Vercel env vars on the server side of that
 * endpoint; never inline a secret here.
 *
 * Set VITE_LEADS_ENDPOINT to enable real delivery. Until then this simulates a
 * network round-trip so the UI exercises real loading / success / error states.
 */
const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT

export async function submitLead(type, data) {
  if (ENDPOINT) {
    // Body is JSON, but we send it as text/plain so the request stays a CORS
    // "simple request" with no preflight. Google Apps Script (and Google Sheets)
    // web apps don't answer the OPTIONS preflight, so an application/json header
    // would fail them; a serverless function can still JSON.parse the text.
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, data, submittedAt: new Date().toISOString() }),
    })
    if (!res.ok) throw new Error(`Submission failed (${res.status})`)
    return res.json().catch(() => ({ ok: true }))
  }

  // No endpoint configured — simulate a realistic round-trip.
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, simulated: true }), 700)
  })
}

/**
 * Fires the "review awaiting screening" notification to the Pulsar team so a new
 * review can be approved, held, or denied before it ever appears on the site.
 * The backend behind VITE_LEADS_ENDPOINT is responsible for the actual email
 * send to SCREENING_RECIPIENTS (use a serverless function + a mail provider like
 * Resend/SendGrid; keep that API key server-side, never in this bundle).
 *
 * We pass the prebuilt HTML and the recipient list so the endpoint can send as
 * is. Failures are non-fatal for the reviewer: the review is still saved to the
 * screening queue, so the team can act on it in the dashboard regardless.
 */
export async function notifyReviewScreening(review, { html, recipients, adminBase } = {}) {
  return submitLead('review-screening', {
    to: recipients,
    subject: `Review screening: ${review.stars}★ from ${review.author || 'a customer'}`,
    review,
    adminBase,
    html,
  })
}

/* ── Shared validators ── */
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())
export const isPhone = (v) => {
  const digits = String(v).replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}
export const required = (v) => String(v ?? '').trim().length > 0
