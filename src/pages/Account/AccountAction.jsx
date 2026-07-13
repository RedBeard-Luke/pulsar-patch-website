import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PasswordField from '../../components/PasswordField/PasswordField'

/**
 * Handles the links from Shopify's account-activation and password-reset
 * emails, on OUR site instead of Shopify's hosted pages. The email link carries
 * the original Shopify URL in the `u` query param; we complete the action with
 * the Storefront API and log the customer straight in.
 *
 * mode: 'activate' | 'reset'
 */
export default function AccountAction({ mode = 'activate' }) {
  const { activate, resetPassword, shopifyEnabled } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const actionUrl = params.get('u') || params.get('url') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const copy = mode === 'reset'
    ? { title: 'Reset Your Password', sub: 'Choose a new password for your account.', cta: 'Reset Password', busy: 'Resetting…' }
    : { title: 'Activate Your Account', sub: 'Set a password to finish setting up your account.', cta: 'Activate & Sign In', busy: 'Activating…' }

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) { setError('Passwords need at least 6 characters.'); return }
    if (password !== confirm) { setError("Those two passwords don't match."); return }
    setError('')
    setBusy(true)
    const res = mode === 'reset'
      ? await resetPassword(actionUrl, password)
      : await activate(actionUrl, password)
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    navigate('/account') // logged in — land on the dashboard
  }

  const linkMissing = !actionUrl

  return (
    <div className="w-full bg-white flex flex-col min-h-screen items-center justify-center py-16 px-5">
      <div className="max-w-[420px] w-full">
        <h1 className="font-futura font-bold text-[clamp(28px,7vw,36px)] text-pulsar-blue uppercase tracking-wide mb-2 text-center">
          {copy.title}
        </h1>

        {!shopifyEnabled ? (
          <p className="font-inter text-[14px] text-gray-500 text-center mt-6">
            Accounts aren't connected in this environment. <Link to="/account" className="font-[600] text-pulsar-blue hover:text-pulsar-pink transition-colors">Go to account</Link>
          </p>
        ) : linkMissing ? (
          <>
            <p className="font-inter text-[14px] text-gray-500 text-center mb-8">This link looks incomplete or has already been used. Try the link in your email again, or head to sign in.</p>
            <Link to="/account" className="block text-center w-full bg-pulsar-blue text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
              Go to Sign In
            </Link>
          </>
        ) : (
          <>
            <p className="font-inter text-[14px] text-gray-500 text-center mb-8">{copy.sub}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <PasswordField label="New Password" value={password} onChange={(v) => { setPassword(v); setError('') }} placeholder="At least 6 characters" autoComplete="new-password" />
              <PasswordField label="Confirm Password" value={confirm} onChange={(v) => { setConfirm(v); setError('') }} placeholder="Re-enter your password" autoComplete="new-password" />
              {error && <p className="font-inter text-[12px] text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className="w-full bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                {busy ? copy.busy : copy.cta}
              </button>
            </form>
            <p className="font-inter text-[13px] text-gray-500 text-center mt-6">
              <Link to="/account" className="font-[600] text-pulsar-blue hover:text-pulsar-pink transition-colors">Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
