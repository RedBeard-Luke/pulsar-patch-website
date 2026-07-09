/**
 * Builds the "review awaiting screening" email that goes to the Pulsar team the
 * moment a customer submits a review. Every new review is held back from the
 * live site until someone approves it, so this note is the team's chance to
 * catch a rough review early and reach out before it publishes.
 *
 * The same HTML is used two ways:
 *   1. The backend notification endpoint sends it to the screening recipients.
 *   2. The Admin dashboard renders it in a preview so you can see the exact
 *      email (and the Approve / Wait / Deny buttons) without a live send.
 *
 * The three buttons deep-link back to /admin with an action so a click from the
 * inbox lands on the right review in the screening queue.
 */

// Who gets the screening email. The admin address is overridable via env; your
// personal inbox is always copied so nothing slips through.
export const SCREENING_RECIPIENTS = [
  import.meta.env.VITE_ADMIN_EMAIL || 'hello@pulsarpatch.com',
  'lclark0684@gmail.com',
]

const BLUE = '#44C8E8'
const PINK = '#DE64A5'
const DARK = '#1E1E1E'

function stars(n) {
  const full = '★'.repeat(n)
  const empty = '☆'.repeat(Math.max(0, 5 - n))
  return `<span style="color:${PINK};font-size:20px;letter-spacing:2px;">${full}</span><span style="color:#d9d9d9;font-size:20px;letter-spacing:2px;">${empty}</span>`
}

function actionButton(label, color, href) {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:12px 22px;border-radius:999px;margin:0 4px;">${label}</a>`
}

/**
 * @param {object} review  the submitted review (stars, title, text, author, email, phone, orderNumber)
 * @param {string} adminBase  absolute base URL of the admin dashboard, e.g. https://pulsarpatch.com/admin
 */
export function buildReviewScreeningEmail(review, adminBase = 'https://pulsarpatch.com/admin') {
  const id = review.id
  const link = (action) => `${adminBase}?review=${encodeURIComponent(id)}&action=${action}#review-screening`
  const isLow = Number(review.stars) <= 3

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:${DARK};">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:${BLUE};border-radius:16px 16px 0 0;padding:24px 28px;">
      <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;">Pulsar Patch · Review Screening</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;text-transform:uppercase;letter-spacing:1px;">A new review needs a look</h1>
    </div>

    <div style="background:#ffffff;padding:28px;border:1px solid #e6e9ec;border-top:0;">
      ${isLow ? `<div style="background:#fff4e5;border:1px solid #ffd8a8;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
        <strong style="color:#b45309;font-size:13px;">Heads up:</strong>
        <span style="color:#7c5a1e;font-size:13px;">This is a ${review.stars}-star review. Good moment to reach out before it goes live.</span>
      </div>` : ''}

      <div style="margin-bottom:8px;">${stars(Number(review.stars) || 0)}</div>
      <h2 style="margin:0 0 8px;font-size:18px;text-transform:uppercase;letter-spacing:0.5px;">${review.title || 'Untitled review'}</h2>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">${review.text || ''}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:8px;">
        <tr><td style="padding:8px 0;color:#888;width:140px;">From</td><td style="padding:8px 0;font-weight:bold;">${review.author || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#888;border-top:1px solid #eee;">Email</td><td style="padding:8px 0;border-top:1px solid #eee;"><a href="mailto:${review.email || ''}" style="color:${BLUE};">${review.email || '—'}</a></td></tr>
        <tr><td style="padding:8px 0;color:#888;border-top:1px solid #eee;">Phone</td><td style="padding:8px 0;border-top:1px solid #eee;"><a href="tel:${review.phone || ''}" style="color:${BLUE};">${review.phone || '—'}</a></td></tr>
        <tr><td style="padding:8px 0;color:#888;border-top:1px solid #eee;">Order #</td><td style="padding:8px 0;border-top:1px solid #eee;font-weight:bold;">${review.orderNumber || '—'}</td></tr>
      </table>
    </div>

    <div style="background:#ffffff;border:1px solid #e6e9ec;border-top:0;border-radius:0 0 16px 16px;padding:24px 28px;text-align:center;">
      <p style="margin:0 0 16px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Decide what happens next</p>
      <div>
        ${actionButton('Approve', '#22c55e', link('approve'))}
        ${actionButton('Wait', '#f59e0b', link('hold'))}
        ${actionButton('Deny', '#ef4444', link('deny'))}
      </div>
      <p style="margin:18px 0 0;font-size:12px;color:#aaa;line-height:1.5;">
        Approve puts it live. Wait holds it while you reach out to the customer. Deny keeps it off the site.<br/>
        Sent to ${SCREENING_RECIPIENTS.join(' and ')}.
      </p>
    </div>
  </div>
</body>
</html>`
}
