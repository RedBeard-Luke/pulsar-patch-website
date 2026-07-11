import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useReviews } from '../../context/ReviewsContext'
import { buildReviewScreeningEmail, SCREENING_RECIPIENTS } from '../../lib/reviewEmail'

const sitePages = [
  { section: 'MAIN PAGES', links: [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'The Science', path: '/science' },
    { label: 'Shop', path: '/shop' },
    { label: 'Store Locator', path: '/store-locator' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Subscription', path: '/subscription' },
    { label: 'Affiliate', path: '/affiliate' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' },
  ]},
  { section: 'PRODUCTS', links: [
    { label: 'Single Patch', path: '/product/1' },
    { label: '3 Patch Bundle', path: '/product/2' },
    { label: '6 Patch Combo', path: '/product/3' },
    { label: 'Kick Back Pack (10)', path: '/product/4' },
    { label: 'Party Pack (30)', path: '/product/5' },
  ]},
  { section: 'ACCOUNT & COMMERCE', links: [
    { label: 'Your Account', path: '/account' },
    { label: 'Checkout', path: '/checkout' },
    { label: 'Wholesale Portal', path: '/wholesale' },
    { label: 'Wholesale Application', path: '/business-signup' },
  ]},
  { section: 'BLOG POSTS', links: [
    { label: 'What Is Pulsar Patch', path: '/blog/what-is-pulsar-patch' },
    { label: 'How Often Can I Use It', path: '/blog/how-often-use-pulsar' },
    { label: 'Weekend Plans, Monday Energy', path: '/blog/weekend-plans-monday-energy' },
    { label: '1 Bottle Wine vs 1 Patch', path: '/blog/1-bottle-wine-vs-pulsar' },
    { label: 'Why Do Hangovers Happen', path: '/blog/why-do-hangovers-happen' },
    { label: 'Science Behind Pulsar', path: '/blog/science-behind-pulsar' },
    { label: "Hangovers Aren't Inevitable", path: '/blog/hangovers-arent-inevitable' },
    { label: 'Low Calorie Margarita', path: '/blog/low-calorie-margarita' },
    { label: 'Fasted Old Fashion', path: '/blog/fasted-old-fashion' },
    { label: 'Best Low-Regret Cocktails', path: '/blog/best-low-regret-cocktails' },
  ]},
  { section: 'LEGAL / SUPPORT', links: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping Policy', path: '/shipping' },
    { label: 'Refund Policy', path: '/refunds' },
    { label: 'Terms of Service', path: '/terms' },
  ]},
]

export default function Admin() {
  const admin = useAdminAuth()
  const { isLoggedIn } = useAuth()

  /* ── Gate ──
     With Supabase configured, require a signed-in admin (enforced by the DB too).
     Otherwise fall back to the demo sign-in gate. */
  if (admin.configured) {
    if (!admin.ready) {
      return (
        <div className="min-h-[60vh] bg-white flex items-center justify-center" role="status" aria-label="Loading">
          <span className="w-9 h-9 rounded-full border-[3px] border-pulsar-light-blue border-t-pulsar-blue animate-spin" />
        </div>
      )
    }
    if (!admin.isAdmin) return <AdminLogin signIn={admin.signIn} />
  } else if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center px-5 py-24 text-center">
        <div className="max-w-[420px]">
          <h1 className="font-futura font-[900] text-[30px] text-pulsar-blue uppercase mb-3">Admins only</h1>
          <p className="font-inter text-[16px] text-gray-600 mb-8">You need to sign in to see the dashboard.</p>
          <Link to="/account" className="inline-block bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-wide px-8 py-4 rounded-full hover:bg-pulsar-pink-dark transition-colors">Sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-screen" id="admin-page">

      {/* Header */}
      <section className="bg-pulsar-dark pt-14 pb-12 px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-[10px] h-[10px] rounded-full bg-green-400 animate-pulse" />
            <span className="font-inter text-[12px] text-green-400 uppercase tracking-widest">Admin access</span>
            {admin.configured && admin.isAdmin && (
              <span className="ml-auto flex items-center gap-4">
                <span className="font-inter text-[12px] text-white/50 hidden sm:inline">{admin.email}</span>
                <button onClick={admin.signOut} className="font-inter text-[12px] text-white/60 hover:text-white underline transition-colors">Sign out</button>
              </span>
            )}
          </div>
          <h1 className="font-futura font-bold text-[clamp(2rem,6vw,3rem)] text-white uppercase tracking-wide mb-2">Site Dashboard</h1>
          <p className="font-inter text-[16px] text-white/60">Screen incoming reviews and jump to any page on the site.</p>
        </div>
      </section>

      {/* Review Screening */}
      <ReviewScreening />

      {/* Page Grid */}
      <section className="bg-white py-12 lg:py-[60px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sitePages.map((group) => (
              <div key={group.section}>
                <h2 className="font-futura font-bold text-[15px] text-pulsar-blue uppercase tracking-widest mb-5 pb-3 border-b-2 border-pulsar-blue/20">{group.section}</h2>
                <div className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <Link key={link.path} to={link.path} className="font-inter text-[14px] text-gray-700 hover:text-pulsar-pink transition-colors flex items-center gap-2 group">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity text-pulsar-pink"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Preview Section */}
      <section className="bg-pulsar-light-blue-bg py-12 lg:py-[60px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto">
          <h2 className="font-futura font-bold text-[clamp(1.5rem,4vw,1.75rem)] text-pulsar-blue uppercase tracking-wide mb-8">Account previews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal */}
            <div className="bg-white rounded-[24px] p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#DE64A5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" /></svg>
                <h3 className="font-futura font-bold text-[18px] text-pulsar-pink uppercase tracking-wide">Personal account</h3>
              </div>
              <div className="flex flex-col mb-6">
                {[['Account type', 'Personal'], ['Orders', '0'], ['Subscription', 'None']].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="font-inter text-[13px] text-gray-500">{k}</span>
                    <span className="font-inter text-[13px] text-gray-800 font-[600]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/account" className="flex-1 min-w-[120px] bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">View account</Link>
                <Link to="/subscription" className="flex-1 min-w-[120px] bg-pulsar-blue text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">Subscribe</Link>
              </div>
            </div>

            {/* Business */}
            <div className="bg-white rounded-[24px] p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#44C8E8"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" /></svg>
                <h3 className="font-futura font-bold text-[18px] text-pulsar-blue uppercase tracking-wide">Business account</h3>
              </div>
              <div className="flex flex-col mb-6">
                {[['Type', 'Wholesale'], ['Applications', 'Via /business-signup'], ['Status', 'Demo']].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="font-inter text-[13px] text-gray-500">{k}</span>
                    <span className="font-inter text-[13px] text-gray-800 font-[600]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/wholesale" className="flex-1 min-w-[120px] bg-pulsar-blue text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">Wholesale</Link>
                <Link to="/business-signup" className="flex-1 min-w-[120px] bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full text-center transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">Application</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   REVIEW SCREENING
   Every new review lands here as pending and never shows on the site until it
   is approved. Each one emails the team (SCREENING_RECIPIENTS) so a rough
   review can be caught and handled before it publishes.
   ════════════════════════════════════════════════════════════════════════ */

function ReviewScreening() {
  const { pendingReviews, approveReview, denyReview, holdReview } = useReviews()
  const [searchParams, setSearchParams] = useSearchParams()
  const [feedback, setFeedback] = useState('')
  const [previewId, setPreviewId] = useState(null)

  const adminBase = typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://pulsarpatch.com/admin'

  // Apply an action arriving from an email button: /admin?review=ID&action=approve
  useEffect(() => {
    const rawId = searchParams.get('review')
    const action = searchParams.get('action')
    if (!rawId || !action) return

    // IDs are numbers for submitted reviews, strings for seeds. Match either.
    const id = /^\d+$/.test(rawId) ? Number(rawId) : rawId
    let msg = ''
    if (action === 'approve') { approveReview(id); msg = 'Review approved and now live.' }
    else if (action === 'deny') { denyReview(id); msg = 'Review denied. It stays off the site.' }
    else if (action === 'hold') { holdReview(id); msg = 'Review held. Reach out before it goes live.' }
    // Reacting to an email-link URL param is a valid external trigger here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (msg) setFeedback(msg)

    // Clear the params so a refresh does not re-fire the action.
    searchParams.delete('review')
    searchParams.delete('action')
    setSearchParams(searchParams, { replace: true })
  }, [searchParams, setSearchParams, approveReview, denyReview, holdReview])

  function act(fn, id, msg) {
    fn(id)
    setFeedback(msg)
    setPreviewId((p) => (p === id ? null : p))
  }

  return (
    <section id="review-screening" className="bg-white border-b border-gray-100 py-12 lg:py-[60px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <h2 className="font-futura font-bold text-[clamp(1.5rem,4vw,1.75rem)] text-pulsar-blue uppercase tracking-wide">Review Screening</h2>
          <span className={`font-futura font-bold text-[12px] uppercase tracking-widest px-3 py-1.5 rounded-full ${pendingReviews.length ? 'bg-pulsar-pink text-white' : 'bg-gray-100 text-gray-400'}`}>
            {pendingReviews.length} waiting
          </span>
        </div>
        <p className="font-inter text-[14px] text-gray-500 mb-8 max-w-[640px]">
          Every review is held here until you approve it. A screening email also goes to {SCREENING_RECIPIENTS.join(' and ')}, so you can catch a rough one and reach out before it publishes.
        </p>

        {feedback && (
          <div className="flex items-center justify-between gap-4 mb-6 bg-pulsar-light-blue-bg border border-pulsar-blue/30 rounded-[12px] px-5 py-3">
            <p className="font-inter text-[14px] text-pulsar-blue-dark">{feedback}</p>
            <button onClick={() => setFeedback('')} className="font-inter text-[13px] text-pulsar-blue hover:text-pulsar-pink transition-colors underline shrink-0">Dismiss</button>
          </div>
        )}

        {pendingReviews.length === 0 ? (
          <p className="font-inter text-[15px] text-gray-500 py-8">Nothing waiting. You're all caught up.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {pendingReviews.map((r) => {
              const low = Number(r.stars) <= 3
              return (
                <div key={r.id} className={`rounded-[20px] border p-6 lg:p-8 ${low ? 'border-amber-300 bg-amber-50/40' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Review body */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < r.stars ? '#DE64A5' : '#d9d9d9'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                        </div>
                        {r.held ? (
                          <span className="font-futura font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-amber-700">On hold · reaching out</span>
                        ) : (
                          <span className="font-futura font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-gray-200 text-gray-600">Pending</span>
                        )}
                        {low && <span className="font-futura font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-red-100 text-red-600">Low rating</span>}
                      </div>
                      <h3 className="font-futura font-bold text-[16px] text-pulsar-dark uppercase tracking-wide mb-2">{r.title || 'Untitled review'}</h3>
                      <p className="font-inter text-[14px] leading-[1.6] text-gray-700 mb-4">{r.text}</p>

                      {/* Contact + order details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 max-w-[560px]">
                        <Detail k="From" v={r.author} />
                        <Detail k="Submitted" v={r.submittedAt || r.date} />
                        <Detail k="Email" v={r.email ? <a href={`mailto:${r.email}`} className="text-pulsar-blue hover:text-pulsar-pink transition-colors">{r.email}</a> : '—'} />
                        <Detail k="Phone" v={r.phone ? <a href={`tel:${r.phone}`} className="text-pulsar-blue hover:text-pulsar-pink transition-colors">{r.phone}</a> : '—'} />
                        <Detail k="Order #" v={r.orderNumber || '—'} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 lg:w-[160px] shrink-0">
                      <button onClick={() => act(approveReview, r.id, 'Review approved and now live.')} className="flex-1 bg-green-500 text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full transition-all hover:-translate-y-0.5 hover:bg-green-600">Approve</button>
                      <button onClick={() => act(holdReview, r.id, 'Review held. Reach out before it goes live.')} className="flex-1 bg-amber-500 text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full transition-all hover:-translate-y-0.5 hover:bg-amber-600">Wait</button>
                      <button onClick={() => act(denyReview, r.id, 'Review denied. It stays off the site.')} className="flex-1 bg-red-500 text-white font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full transition-all hover:-translate-y-0.5 hover:bg-red-600">Deny</button>
                    </div>
                  </div>

                  {/* Email preview toggle */}
                  <div className="mt-5 pt-5 border-t border-gray-200/70">
                    <button
                      onClick={() => setPreviewId(previewId === r.id ? null : r.id)}
                      className="font-futura font-bold text-[12px] uppercase tracking-wide text-pulsar-blue hover:text-pulsar-pink transition-colors"
                    >
                      {previewId === r.id ? 'Hide screening email' : 'Preview the screening email →'}
                    </button>
                    {previewId === r.id && (
                      <div className="mt-4 rounded-[16px] overflow-hidden border border-gray-200 bg-[#f4f6f8]">
                        <iframe
                          title={`Screening email for ${r.author}`}
                          srcDoc={buildReviewScreeningEmail(r, adminBase)}
                          className="w-full h-[620px] border-0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function Detail({ k, v }) {
  return (
    <div className="flex justify-between gap-4 py-1 border-b border-gray-200/60">
      <span className="font-inter text-[13px] text-gray-500 shrink-0">{k}</span>
      <span className="font-inter font-[600] text-[13px] text-gray-800 text-right break-all">{v}</span>
    </div>
  )
}

/* Real admin sign-in (Supabase). Only allow-listed emails get in. */
function AdminLogin({ signIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handle(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message || 'Sign in failed.')
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-screen items-center justify-center py-16 px-5">
      <div className="max-w-[400px] w-full">
        <h1 className="font-futura font-bold text-[clamp(28px,7vw,36px)] text-pulsar-blue uppercase tracking-wide mb-2 text-center">Admin</h1>
        <p className="font-inter text-[14px] text-gray-500 text-center mb-8">Sign in to screen reviews and manage the site.</p>
        <form onSubmit={handle} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} autoComplete="username" className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
          </div>
          <div>
            <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} autoComplete="current-password" className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
          </div>
          {error && <p className="font-inter text-[13px] text-red-400" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="font-inter text-[12px] text-gray-400 text-center mt-6">Only authorized Pulsar admins can access this area.</p>
      </div>
    </div>
  )
}
