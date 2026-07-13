import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isEmail } from '../../lib/forms'

/* ── Demo profiles ───────────────────────────────────────────────────────
   No real backend is wired in yet (see DECISIONS.md). These two profiles let
   you preview the personal and business dashboards end to end. Swap for real
   Shopify customer / wholesale data when the backend lands. */

const personalDemo = {
  accountType: 'personal',
  name: 'Luke Clark',
  email: 'hello@pulsarpatch.com',
  phone: '(555) 123-4567',
  avatar: null,
  addresses: [
    { id: 1, label: 'Home', street: '123 Main St', city: 'Los Angeles', state: 'CA', zip: '90001', isDefault: true },
  ],
  orders: [
    { id: '#PUL-2847', date: 'May 2, 2026', items: '6 Patch Combo', status: 'Delivered', total: '$25.20' },
    { id: '#PUL-2631', date: 'Apr 18, 2026', items: 'Single Patch x2', status: 'Delivered', total: '$12.00' },
    { id: '#PUL-2405', date: 'Mar 29, 2026', items: 'Party Pack', status: 'Delivered', total: '$90.00' },
  ],
  subscription: { plan: 'The Social Calendar', patches: 8, price: '$36.00', nextCharge: 'June 1, 2026', status: 'Active' },
  smsOptIn: true,
  emailOptIn: true,
}

const businessDemo = {
  accountType: 'business',
  name: 'Sarah Chen',
  company: 'Neon Nights Bar',
  email: 'orders@neonnights.com',
  phone: '(602) 555-0148',
  rep: { name: 'Jordan Ellis', email: 'jordan@pulsarpatch.com' },
  wholesaleOrders: [
    { id: '#WHL-1042', date: 'Jun 12, 2026', items: 'Party Pack x20', status: 'Shipped', total: '$1,800.00' },
    { id: '#WHL-0987', date: 'May 3, 2026', items: 'Party Pack x15', status: 'Delivered', total: '$1,350.00' },
    { id: '#WHL-0921', date: 'Apr 1, 2026', items: 'Kick Back Pack x30', status: 'Delivered', total: '$1,059.90' },
  ],
  invoices: [
    { id: 'INV-2048', date: 'Jun 12, 2026', due: 'Jul 12, 2026', amount: '$1,800.00', status: 'Due' },
    { id: 'INV-1991', date: 'May 3, 2026', due: 'Jun 3, 2026', amount: '$1,350.00', status: 'Paid' },
    { id: 'INV-1902', date: 'Apr 1, 2026', due: 'May 1, 2026', amount: '$1,059.90', status: 'Paid' },
  ],
  locations: [
    { id: 1, name: 'Neon Nights — Scottsdale', address: '4200 N Scottsdale Rd, Scottsdale, AZ 85251' },
    { id: 2, name: 'Neon Nights — Tempe', address: '515 S Mill Ave, Tempe, AZ 85281' },
  ],
}

export default function Account() {
  const { user, logout, isLoggedIn, authLoading } = useAuth()

  /* ═══ Verifying a saved Shopify session ═══ */
  if (authLoading) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center" aria-label="Loading" role="status">
        <span className="w-9 h-9 rounded-full border-[3px] border-pulsar-light-blue border-t-pulsar-blue animate-spin" />
      </div>
    )
  }

  /* ═══ Logged-out: auth flow ═══ */
  if (!isLoggedIn) {
    return <AuthGate />
  }

  /* ═══ Logged-in ═══ */
  return user.accountType === 'business'
    ? <BusinessDashboard user={user} logout={logout} />
    : <PersonalDashboard user={user} logout={logout} />
}

/* ════════════════════════════════════════════════════════════════════════
   AUTH GATE — sign in / create account / forgot password / reset sent
   ════════════════════════════════════════════════════════════════════════ */

const DEMO_PASSWORD = 'admin'

function AuthGate() {
  const { signIn, signUp, recover, login, shopifyEnabled } = useAuth()
  const [view, setView] = useState('signin') // signin | signup | forgot | sent
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [signupType, setSignupType] = useState('personal') // personal | business
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function reset() { setError(''); setPassword(''); setConfirm('') }
  function go(next) { reset(); setView(next) }

  function splitName(full) {
    const parts = full.trim().split(/\s+/)
    return { firstName: parts.shift() || '', lastName: parts.join(' ') }
  }

  async function handleSignIn(e) {
    e.preventDefault()
    if (!isEmail(email)) { setError('Enter a valid email address.'); return }
    if (!password) { setError('Enter your password.'); return }
    if (!shopifyEnabled) {
      // Demo mode (no Shopify): any email + the demo password lands in personal.
      if (password !== DEMO_PASSWORD) { setError('Wrong password. This demo uses "admin".'); return }
      login({ ...personalDemo, email }); return
    }
    setBusy(true)
    const res = await signIn(email, password)
    setBusy(false)
    if (!res.ok) setError(res.error)
  }

  async function handleSignUp(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Tell us your name.'); return }
    if (signupType === 'business' && !company.trim()) { setError('Add your business name.'); return }
    if (!isEmail(email)) { setError('Enter a valid email address.'); return }
    if (password.length < 6) { setError('Passwords need at least 6 characters.'); return }
    if (password !== confirm) { setError("Those two passwords don't match."); return }
    if (!shopifyEnabled) {
      if (signupType === 'business') {
        login({ accountType: 'business', name, company, email, rep: businessDemo.rep, wholesaleOrders: [], invoices: [], locations: [] })
      } else {
        login({ accountType: 'personal', name, email })
      }
      return
    }
    // Real Shopify signup. Tags (personal/business) are managed store-side; a
    // new account is a standard customer until you tag it wholesale in Shopify.
    setBusy(true)
    const { firstName, lastName } = splitName(name)
    const res = await signUp({ email, password, firstName, lastName })
    setBusy(false)
    if (!res.ok) setError(res.error)
  }

  async function handleForgot(e) {
    e.preventDefault()
    if (!isEmail(email)) { setError('Enter a valid email address.'); return }
    if (shopifyEnabled) {
      setBusy(true)
      const res = await recover(email)
      setBusy(false)
      if (!res.ok) { setError(res.error); return }
    }
    setError('')
    setView('sent')
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-screen items-center justify-center py-16 px-5">
      <div className="max-w-[420px] w-full">
        <h1 className="font-futura font-bold text-[clamp(28px,7vw,36px)] text-pulsar-blue uppercase tracking-wide mb-2 text-center">
          {view === 'signup' ? 'Create Account' : view === 'forgot' || view === 'sent' ? 'Reset Password' : 'My Account'}
        </h1>

        {/* ── SIGN IN ── */}
        {view === 'signin' && (
          <>
            <p className="font-inter text-[14px] text-gray-500 text-center mb-8">Sign in to manage your orders, subscription, and more.</p>
            <form onSubmit={handleSignIn} className="flex flex-col gap-4" noValidate>
              <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setError('') }} placeholder="you@email.com" autoComplete="email" />
              <PasswordField label="Password" value={password} onChange={(v) => { setPassword(v); setError('') }} placeholder="••••••••" autoComplete="current-password" />
              <button type="button" onClick={() => go('forgot')} className="self-end -mt-1 font-inter text-[12px] text-gray-400 hover:text-pulsar-pink transition-colors">
                Forgot your password?
              </button>
              {error && <p className="font-inter text-[12px] text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className="w-full bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                {busy ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <p className="font-inter text-[13px] text-gray-500 text-center mt-6">
              New here?{' '}
              <button onClick={() => go('signup')} className="font-[600] text-pulsar-blue hover:text-pulsar-pink transition-colors">Create an account</button>
            </p>
          </>
        )}

        {/* ── SIGN UP ── */}
        {view === 'signup' && (
          <>
            <p className="font-inter text-[14px] text-gray-500 text-center mb-8">Join Pulsar. Pick the account that fits you.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['personal', 'business'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setSignupType(t); setError('') }}
                  className={`font-futura font-bold text-[12px] uppercase tracking-widest py-3 rounded-full border-2 transition-all ${
                    signupType === t ? 'border-pulsar-blue bg-pulsar-blue text-white' : 'border-gray-200 text-gray-400 hover:border-pulsar-blue/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <form onSubmit={handleSignUp} className="flex flex-col gap-4" noValidate>
              <Field label={signupType === 'business' ? 'Contact Name' : 'Full Name'} type="text" value={name} onChange={(v) => { setName(v); setError('') }} placeholder="Your name" autoComplete="name" />
              {signupType === 'business' && (
                <Field label="Business Name" type="text" value={company} onChange={(v) => { setCompany(v); setError('') }} placeholder="Your bar or shop" autoComplete="organization" />
              )}
              <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setError('') }} placeholder="you@email.com" autoComplete="email" />
              <PasswordField label="Password" value={password} onChange={(v) => { setPassword(v); setError('') }} placeholder="At least 6 characters" autoComplete="new-password" />
              <PasswordField label="Confirm Password" value={confirm} onChange={(v) => { setConfirm(v); setError('') }} placeholder="Re-enter your password" autoComplete="new-password" />
              {error && <p className="font-inter text-[12px] text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className="w-full bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                {busy ? 'Creating…' : 'Create Account'}
              </button>
            </form>
            {signupType === 'business' && (
              <p className="font-inter text-[12px] text-gray-400 text-center mt-4">
                Want wholesale pricing?{' '}
                <Link to="/business-signup" className="font-[600] text-pulsar-blue hover:text-pulsar-pink transition-colors">Apply here</Link>
              </p>
            )}
            <p className="font-inter text-[13px] text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <button onClick={() => go('signin')} className="font-[600] text-pulsar-blue hover:text-pulsar-pink transition-colors">Sign in</button>
            </p>
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {view === 'forgot' && (
          <>
            <p className="font-inter text-[14px] text-gray-500 text-center mb-8">Enter your email and we'll send a link to reset your password.</p>
            <form onSubmit={handleForgot} className="flex flex-col gap-4" noValidate>
              <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setError('') }} placeholder="you@email.com" autoComplete="email" />
              {error && <p className="font-inter text-[12px] text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className="w-full bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                {busy ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
            <p className="font-inter text-[13px] text-gray-500 text-center mt-6">
              <button onClick={() => go('signin')} className="font-[600] text-pulsar-blue hover:text-pulsar-pink transition-colors">Back to sign in</button>
            </p>
          </>
        )}

        {/* ── RESET SENT ── */}
        {view === 'sent' && (
          <>
            <div className="w-[64px] h-[64px] rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <p className="font-inter text-[15px] text-gray-600 text-center mb-2">Check your inbox.</p>
            <p className="font-inter text-[14px] text-gray-500 text-center mb-8">If an account exists for <span className="font-[600] text-gray-700">{email}</span>, a reset link is on its way.</p>
            <button onClick={() => go('signin')} className="w-full bg-pulsar-blue text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
              Back to Sign In
            </button>
          </>
        )}

        {/* ── Demo previews (only when Shopify is not connected) ── */}
        {!shopifyEnabled && (
          <div className="mt-10 pt-6 border-t border-dashed border-gray-200">
            <p className="font-futura font-bold text-[11px] uppercase tracking-widest text-gray-400 text-center mb-4">Preview (demo)</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => login(personalDemo)} className="font-futura font-bold text-[12px] uppercase tracking-wide text-pulsar-blue border-2 border-pulsar-blue/30 rounded-full py-3 transition-all hover:bg-pulsar-blue hover:text-white">
                Personal
              </button>
              <button onClick={() => login(businessDemo)} className="font-futura font-bold text-[12px] uppercase tracking-wide text-pulsar-pink border-2 border-pulsar-pink/30 rounded-full py-3 transition-all hover:bg-pulsar-pink hover:text-white">
                Business
              </button>
            </div>
            <p className="font-inter text-[11px] text-gray-400 text-center mt-3">Or sign in with any email and password <span className="font-[600]">admin</span>.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* Small labelled input used across the auth views */
function Field({ label, type, value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30"
      />
    </div>
  )
}

/* Password input with a show/hide eye toggle */
function PasswordField({ label, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-gray-100 rounded-[8px] px-4 py-3 pr-12 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-pulsar-blue transition-colors"
        >
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>
    </div>
  )
}

/* Shared shell: header + horizontal tabs + content */
function DashboardShell({ title, subtitle, badge, onLogout, tabs, activeTab, setActiveTab, children }) {
  return (
    <div className="w-full bg-white flex flex-col min-h-screen" id="account-page">
      <section className="bg-pulsar-blue pt-14 pb-10">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] flex items-center gap-6">
          <div className="w-[80px] h-[80px] rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border-3 border-white/40">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>
          </div>
          <div>
            {badge && <span className="font-futura font-bold text-[10px] uppercase tracking-widest text-white/70 bg-white/15 px-3 py-1 rounded-full inline-block mb-2">{badge}</span>}
            <h1 className="font-futura font-bold text-[clamp(24px,6vw,32px)] text-white uppercase tracking-wide leading-tight">{title}</h1>
            <p className="font-inter text-[14px] text-white/60">{subtitle}</p>
          </div>
          <button onClick={onLogout} className="ml-auto font-inter text-[13px] text-white/50 hover:text-white transition-colors underline self-start">
            Sign Out
          </button>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-futura font-bold text-[12px] uppercase tracking-widest py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-pulsar-pink text-pulsar-pink' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[60px] flex-1">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          {children}
        </div>
      </section>
    </div>
  )
}

/* Reusable table for orders / wholesale orders */
function OrderTable({ orders, emptyCta }) {
  if (!orders || orders.length === 0) return emptyCta
  return (
    <div className="flex flex-col">
      <div className="hidden sm:flex py-3 border-b-2 border-gray-200">
        <span className="flex-[0_0_150px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Order</span>
        <span className="flex-[0_0_150px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Date</span>
        <span className="flex-1 font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Items</span>
        <span className="flex-[0_0_120px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Status</span>
        <span className="flex-[0_0_100px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest text-right">Total</span>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="flex flex-col gap-1 sm:flex-row sm:gap-0 sm:items-center py-4 border-b border-gray-100">
          <span className="sm:flex-[0_0_150px] font-inter font-[600] text-[14px] text-pulsar-blue">{order.id}</span>
          <span className="sm:flex-[0_0_150px] font-inter text-[14px] text-gray-600">{order.date}</span>
          <span className="sm:flex-1 font-inter text-[14px] text-gray-800">{order.items}</span>
          <span className={`sm:flex-[0_0_120px] font-inter font-[600] text-[13px] ${order.status === 'Shipped' ? 'text-pulsar-blue' : 'text-green-500'}`}>{order.status}</span>
          <span className="sm:flex-[0_0_100px] font-inter font-[600] text-[14px] text-gray-800 sm:text-right">{order.total}</span>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   BUSINESS DASHBOARD
   ════════════════════════════════════════════════════════════════════════ */

function BusinessDashboard({ user, logout }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Wholesale Orders' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'reorder', label: 'Reorder' },
    { id: 'locations', label: 'Locations' },
    { id: 'password', label: 'Password' },
    { id: 'settings', label: 'Settings' },
  ]
  const [activeTab, setActiveTab] = useState('overview')
  const current = tabs.some((t) => t.id === activeTab) ? activeTab : 'overview'

  const openInvoices = (user.invoices || []).filter((i) => i.status === 'Due')

  return (
    <DashboardShell
      title={user.company || user.name}
      subtitle={user.email}
      badge="Business account"
      onLogout={logout}
      tabs={tabs}
      activeTab={current}
      setActiveTab={setActiveTab}
    >
      {/* OVERVIEW */}
      {current === 'overview' && (
        <div>
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <StatCard label="Open invoices" value={openInvoices.length} note={openInvoices.length ? 'Action needed' : 'All settled'} />
            <StatCard label="Orders placed" value={(user.wholesaleOrders || []).length} note="All time" />
            <StatCard label="Locations" value={(user.locations || []).length} note="Stocking Pulsar" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8">
              <h3 className="font-futura font-bold text-[16px] text-pulsar-dark uppercase tracking-wide mb-4">Business Details</h3>
              <dl className="flex flex-col gap-3">
                <Row k="Business" v={user.company || '—'} />
                <Row k="Contact" v={user.name} />
                <Row k="Email" v={user.email} />
                <Row k="Phone" v={user.phone || '—'} />
              </dl>
            </div>
            {user.rep && (
              <div className="bg-gray-50 rounded-[20px] p-8">
                <h3 className="font-futura font-bold text-[16px] text-pulsar-dark uppercase tracking-wide mb-4">Your Account Rep</h3>
                <p className="font-inter font-[600] text-[16px] text-gray-800">{user.rep.name}</p>
                <a href={`mailto:${user.rep.email}`} className="font-inter text-[14px] text-pulsar-blue hover:text-pulsar-pink transition-colors">{user.rep.email}</a>
                <p className="font-inter text-[13px] text-gray-500 mt-4">Questions about pricing, stock, or delivery? Reach out any time.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WHOLESALE ORDERS */}
      {current === 'orders' && (
        <div>
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Wholesale Orders</h2>
          <OrderTable
            orders={user.wholesaleOrders}
            emptyCta={<p className="font-inter text-[14px] text-gray-500">No wholesale orders yet. <Link to="/wholesale" className="text-pulsar-pink hover:underline">Place your first order</Link></p>}
          />
        </div>
      )}

      {/* INVOICES */}
      {current === 'invoices' && (
        <div>
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Invoices</h2>
          {user.invoices && user.invoices.length > 0 ? (
            <div className="flex flex-col">
              <div className="hidden sm:flex py-3 border-b-2 border-gray-200">
                <span className="flex-[0_0_140px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Invoice</span>
                <span className="flex-[0_0_140px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Issued</span>
                <span className="flex-1 font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Due</span>
                <span className="flex-[0_0_120px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest">Status</span>
                <span className="flex-[0_0_120px] font-futura font-bold text-[11px] text-gray-400 uppercase tracking-widest text-right">Amount</span>
              </div>
              {user.invoices.map((inv) => (
                <div key={inv.id} className="flex flex-col gap-1 sm:flex-row sm:gap-0 sm:items-center py-4 border-b border-gray-100">
                  <span className="sm:flex-[0_0_140px] font-inter font-[600] text-[14px] text-pulsar-blue">{inv.id}</span>
                  <span className="sm:flex-[0_0_140px] font-inter text-[14px] text-gray-600">{inv.date}</span>
                  <span className="sm:flex-1 font-inter text-[14px] text-gray-800">{inv.due}</span>
                  <span className="sm:flex-[0_0_120px]">
                    <span className={`font-futura font-bold text-[11px] uppercase tracking-widest px-3 py-1 rounded-full ${inv.status === 'Paid' ? 'text-green-500 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>{inv.status}</span>
                  </span>
                  <span className="sm:flex-[0_0_120px] font-inter font-[600] text-[14px] text-gray-800 sm:text-right">{inv.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-inter text-[14px] text-gray-500">No invoices yet.</p>
          )}
        </div>
      )}

      {/* REORDER */}
      {current === 'reorder' && (
        <div className="max-w-[700px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-2">Reorder</h2>
          <p className="font-inter text-[15px] text-gray-600 mb-8">Running low? Reorder your usual in a couple of taps.</p>
          {user.wholesaleOrders && user.wholesaleOrders.length > 0 ? (
            <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8 flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <div className="flex-1">
                <span className="font-futura font-bold text-[11px] uppercase tracking-widest text-gray-500 block mb-1">Last order</span>
                <p className="font-futura font-bold text-[18px] text-pulsar-dark uppercase tracking-wide">{user.wholesaleOrders[0].items}</p>
                <p className="font-inter text-[14px] text-gray-600">{user.wholesaleOrders[0].total} · {user.wholesaleOrders[0].date}</p>
              </div>
              <Link to="/wholesale" className="bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark text-center">
                Reorder
              </Link>
            </div>
          ) : (
            <p className="font-inter text-[14px] text-gray-500 mb-6">No past orders to reorder from yet.</p>
          )}
          <Link to="/wholesale" className="inline-block font-futura font-bold text-[13px] uppercase tracking-wide text-pulsar-blue hover:text-pulsar-pink transition-colors">
            Browse wholesale packs →
          </Link>
        </div>
      )}

      {/* LOCATIONS */}
      {current === 'locations' && (
        <div className="max-w-[700px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Locations</h2>
          {user.locations && user.locations.length > 0 ? (
            <div className="flex flex-col gap-4 mb-6">
              {user.locations.map((loc) => (
                <div key={loc.id} className="bg-gray-50 rounded-[16px] p-6">
                  <p className="font-futura font-bold text-[15px] text-pulsar-dark uppercase tracking-wide mb-1">{loc.name}</p>
                  <p className="font-inter text-[14px] text-gray-600">{loc.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-inter text-[14px] text-gray-500 mb-6">No locations on file yet.</p>
          )}
          <a href="mailto:hello@pulsarpatch.com?subject=Add%20a%20location" className="inline-block font-futura font-bold text-[13px] uppercase tracking-wide text-pulsar-blue hover:text-pulsar-pink transition-colors">
            Add a location →
          </a>
        </div>
      )}

      {/* PASSWORD */}
      {current === 'password' && <PasswordPanel />}

      {/* SETTINGS */}
      {current === 'settings' && <SettingsPanel user={user} logout={logout} />}
    </DashboardShell>
  )
}

function StatCard({ label, value, note }) {
  return (
    <div className="bg-gray-50 rounded-[20px] p-6">
      <span className="font-inter text-[13px] text-gray-500 block mb-1">{label}</span>
      <span className="font-futura font-bold text-[40px] text-pulsar-blue leading-none">{value}</span>
      <span className="font-inter text-[12px] text-gray-400 block mt-2">{note}</span>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-inter text-[13px] text-gray-500">{k}</dt>
      <dd className="font-inter font-[600] text-[14px] text-gray-800 text-right">{v}</dd>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   PERSONAL DASHBOARD
   ════════════════════════════════════════════════════════════════════════ */

function PersonalDashboard({ user, logout }) {
  const { updateUser, saveProfile, addAddress, removeAddress } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)
  async function handleSaveProfile() {
    setProfileBusy(true)
    setProfileError('')
    const parts = (user.name || '').trim().split(/\s+/)
    const firstName = parts.shift() || ''
    const lastName = parts.join(' ')
    const res = await saveProfile({ firstName, lastName, phone: user.phone, email: user.email })
    setProfileBusy(false)
    if (res.ok) {
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } else {
      setProfileError(res.error)
    }
  }

  const emptyAddr = { label: '', street: '', city: '', state: '', zip: '' }
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState(emptyAddr)
  const [addrError, setAddrError] = useState('')
  const [addrBusy, setAddrBusy] = useState(false)
  async function handleAddAddress() {
    if (!addrForm.label || !addrForm.street || !addrForm.city || !addrForm.state || !addrForm.zip) {
      setAddrError('Fill in all fields to save this address.')
      return
    }
    setAddrBusy(true)
    const res = await addAddress(addrForm, (user.addresses || []).length === 0)
    setAddrBusy(false)
    if (!res.ok) { setAddrError(res.error); return }
    setAddrForm(emptyAddr)
    setAddrError('')
    setShowAddrForm(false)
  }
  function handleRemoveAddress(id) {
    removeAddress(id)
  }

  const [subMsg, setSubMsg] = useState('')
  function handleSubStatus(status, msg) {
    updateUser({ subscription: { ...user.subscription, status } })
    setSubMsg(msg)
    setTimeout(() => setSubMsg(''), 2500)
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'referral', label: 'Refer a Friend' },
    { id: 'password', label: 'Password' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <DashboardShell
      title={user.name}
      subtitle={user.email}
      badge="Personal account"
      onLogout={logout}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-[600px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Profile</h2>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-[100px] h-[100px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>
              )}
            </div>
            <div>
              <label className="bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-full cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark inline-block">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) updateUser({ avatar: URL.createObjectURL(file) })
                }} />
              </label>
              {user.avatar && (
                <button onClick={() => updateUser({ avatar: null })} className="ml-3 font-inter text-[12px] text-gray-400 hover:text-red-400 transition-colors underline">Remove</button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Full Name</label>
              <input type="text" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
            </div>
            <div>
              <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Email</label>
              <input type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
            </div>
            <div>
              <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Phone</label>
              <input type="tel" value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button onClick={handleSaveProfile} disabled={profileBusy} className="self-start bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                {profileBusy ? 'Saving…' : 'Save Changes'}
              </button>
              {profileSaved && <span className="font-inter font-[600] text-[14px] text-green-500">Saved!</span>}
              {profileError && <span className="font-inter font-[600] text-[14px] text-red-400">{profileError}</span>}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Order History</h2>
          <OrderTable
            orders={user.orders}
            emptyCta={<p className="font-inter text-[14px] text-gray-500">No orders yet. <Link to="/shop" className="text-pulsar-pink hover:underline">Start shopping</Link></p>}
          />
        </div>
      )}

      {/* SUBSCRIPTION */}
      {activeTab === 'subscription' && (
        <div className="max-w-[600px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Subscription</h2>
          {user.subscription ? (
            <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-futura font-bold text-[20px] text-pulsar-dark uppercase tracking-wide">{user.subscription.plan}</h3>
                  <p className="font-inter text-[14px] text-gray-600 mt-1">{user.subscription.patches} patches/month</p>
                </div>
                <span className={`font-futura font-bold text-[12px] uppercase tracking-widest px-4 py-1.5 rounded-full ${user.subscription.status === 'Active' ? 'text-green-500 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>{user.subscription.status}</span>
              </div>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-inter text-[13px] text-gray-500">Monthly price</span>
                  <span className="font-inter font-[600] text-[14px] text-gray-800">{user.subscription.price}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-inter text-[13px] text-gray-500">Next charge</span>
                  <span className="font-inter font-[600] text-[14px] text-gray-800">{user.subscription.nextCharge}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/subscription" className="bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                  Change Plan
                </Link>
                {user.subscription.status === 'Paused' ? (
                  <button onClick={() => handleSubStatus('Active', 'Subscription resumed.')} className="bg-transparent border-2 border-gray-300 text-gray-500 font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:border-pulsar-blue hover:text-pulsar-blue">
                    Resume
                  </button>
                ) : (
                  <button onClick={() => handleSubStatus('Paused', 'Subscription paused.')} className="bg-transparent border-2 border-gray-300 text-gray-500 font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:border-red-300 hover:text-red-400">
                    Pause
                  </button>
                )}
                <button onClick={() => handleSubStatus('Cancelled', 'Subscription cancelled.')} className="font-inter text-[12px] text-gray-400 hover:text-red-400 transition-colors underline sm:ml-auto">
                  Cancel
                </button>
              </div>
              {subMsg && <p className="font-inter font-[600] text-[13px] text-green-500 mt-4">{subMsg}</p>}
            </div>
          ) : (
            <div>
              <p className="font-inter text-[14px] text-gray-500 mb-4">You don't have an active subscription.</p>
              <Link to="/subscription" className="bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark inline-block">
                View Plans
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="max-w-[600px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Saved Addresses</h2>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="flex flex-col gap-4">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="bg-gray-50 rounded-[16px] p-6 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide">{addr.label}</span>
                      {addr.isDefault && <span className="font-inter text-[10px] text-pulsar-blue bg-pulsar-blue/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>}
                    </div>
                    <p className="font-inter text-[14px] text-gray-600">{addr.street}</p>
                    <p className="font-inter text-[14px] text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                  <button onClick={() => handleRemoveAddress(addr.id)} className="font-inter text-[12px] text-gray-400 hover:text-red-400 transition-colors underline shrink-0">Remove</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-inter text-[14px] text-gray-500">No saved addresses yet.</p>
          )}

          {showAddrForm ? (
            <div className="mt-6 bg-gray-50 rounded-[16px] p-6 flex flex-col gap-4">
              <div>
                <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Label (e.g. Home, Work)</label>
                <input type="text" value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className="w-full bg-white rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
              </div>
              <div>
                <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Street</label>
                <input type="text" value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} className="w-full bg-white rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">City</label>
                  <input type="text" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="w-full bg-white rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">State</label>
                  <input type="text" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="w-full bg-white rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">ZIP</label>
                  <input type="text" value={addrForm.zip} onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })} className="w-full bg-white rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
                </div>
              </div>
              {addrError && <p className="font-inter text-[13px] text-red-400">{addrError}</p>}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleAddAddress} disabled={addrBusy} className="bg-pulsar-pink text-white font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                  {addrBusy ? 'Saving…' : 'Save Address'}
                </button>
                <button onClick={() => { setShowAddrForm(false); setAddrForm(emptyAddr); setAddrError('') }} className="border-2 border-gray-300 text-gray-500 font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:border-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddrForm(true)} className="mt-6 bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
              Add New Address
            </button>
          )}
        </div>
      )}

      {/* PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="max-w-[600px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Notification Preferences</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <span className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide block">SMS Notifications</span>
                <span className="font-inter text-[13px] text-gray-500">Deals, updates, and hangover tips via text</span>
              </div>
              <button onClick={() => updateUser({ smsOptIn: !user.smsOptIn })} className={`w-[50px] h-[28px] rounded-full transition-colors relative ${user.smsOptIn ? 'bg-pulsar-pink' : 'bg-gray-300'}`}>
                <div className={`w-[22px] h-[22px] bg-white rounded-full absolute top-[3px] transition-all ${user.smsOptIn ? 'left-[25px]' : 'left-[3px]'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <span className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide block">Email Notifications</span>
                <span className="font-inter text-[13px] text-gray-500">Order updates, promotions, and new products</span>
              </div>
              <button onClick={() => updateUser({ emailOptIn: !user.emailOptIn })} className={`w-[50px] h-[28px] rounded-full transition-colors relative ${user.emailOptIn ? 'bg-pulsar-pink' : 'bg-gray-300'}`}>
                <div className={`w-[22px] h-[22px] bg-white rounded-full absolute top-[3px] transition-all ${user.emailOptIn ? 'left-[25px]' : 'left-[3px]'}`}></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFER A FRIEND */}
      {activeTab === 'referral' && (
        <div className="max-w-[600px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Refer a Friend</h2>
          <p className="font-inter text-[15px] text-gray-600 mb-8">Share your code with friends. When they make their first purchase, you both get rewarded.</p>
          <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8 text-center">
            <span className="font-inter text-[13px] text-gray-500 block mb-2">Your Referral Code</span>
            <span className="font-futura font-bold text-[clamp(26px,7vw,36px)] text-pulsar-blue tracking-[4px] break-all">{user.referralCode}</span>
            <button onClick={() => navigator.clipboard.writeText(user.referralCode)} className="mt-4 bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark block mx-auto">
              Copy Code
            </button>
          </div>
        </div>
      )}

      {/* PASSWORD */}
      {activeTab === 'password' && <PasswordPanel />}

      {/* SETTINGS */}
      {activeTab === 'settings' && <SettingsPanel user={user} logout={logout} />}
    </DashboardShell>
  )
}

/* Shared settings panel (personal + business) — account info + sign out */
function SettingsPanel({ user, logout }) {
  return (
    <div className="max-w-[600px]">
      <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Settings</h2>

      <div className="bg-gray-50 rounded-[16px] p-6 mb-6">
        <h3 className="font-futura font-bold text-[13px] text-gray-500 uppercase tracking-widest mb-4">Account</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between gap-4">
            <span className="font-inter text-[13px] text-gray-500">Account type</span>
            <span className="font-inter font-[600] text-[14px] text-gray-800 capitalize">{user.accountType}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-inter text-[13px] text-gray-500">Signed in as</span>
            <span className="font-inter font-[600] text-[14px] text-gray-800 text-right break-all">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide mb-1">Sign Out</h3>
          <p className="font-inter text-[13px] text-gray-500">You'll need your email and password to get back in.</p>
        </div>
        <button
          onClick={logout}
          className="shrink-0 bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

/* Shared password-change panel (personal + business) */
function PasswordPanel() {
  const { changePassword } = useAuth()
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwBusy, setPwBusy] = useState(false)
  async function handleUpdatePassword() {
    setPwSuccess(false)
    if (!pw.current) { setPwError('Enter your current password.'); return }
    if (pw.next.length < 6) { setPwError('Your new password needs at least 6 characters.'); return }
    if (pw.next !== pw.confirm) { setPwError("Those two passwords don't match."); return }
    setPwError('')
    setPwBusy(true)
    const res = await changePassword(pw.next)
    setPwBusy(false)
    if (!res.ok) { setPwError(res.error); return }
    setPw({ current: '', next: '', confirm: '' })
    setPwSuccess(true)
    setTimeout(() => setPwSuccess(false), 2500)
  }
  return (
    <div className="max-w-[600px]">
      <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-8">Change Password</h2>
      <div className="flex flex-col gap-5">
        <div>
          <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Current Password</label>
          <input type="password" value={pw.current} onChange={(e) => { setPw({ ...pw, current: e.target.value }); setPwError('') }} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
        </div>
        <div>
          <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">New Password</label>
          <input type="password" value={pw.next} onChange={(e) => { setPw({ ...pw, next: e.target.value }); setPwError('') }} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
        </div>
        <div>
          <label className="font-inter font-[600] text-[13px] text-gray-500 block mb-2">Confirm New Password</label>
          <input type="password" value={pw.confirm} onChange={(e) => { setPw({ ...pw, confirm: e.target.value }); setPwError('') }} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30" />
        </div>
        {pwError && <p className="font-inter text-[13px] text-red-400">{pwError}</p>}
        <div className="flex items-center gap-4 mt-4">
          <button onClick={handleUpdatePassword} disabled={pwBusy} className="self-start bg-pulsar-pink text-white font-futura font-bold text-[12px] uppercase tracking-widest px-8 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
            {pwBusy ? 'Updating…' : 'Update Password'}
          </button>
          {pwSuccess && <span className="font-inter font-[600] text-[14px] text-green-500">Password updated</span>}
        </div>
      </div>
    </div>
  )
}
