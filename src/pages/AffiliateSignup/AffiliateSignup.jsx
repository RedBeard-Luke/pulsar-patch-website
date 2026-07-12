import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitLead, isEmail, isPhone, required } from '../../lib/forms'

const audienceSizes = [
  'JUST FRIENDS & FAMILY', 'UNDER 1,000', '1,000 - 10,000',
  '10,000 - 50,000', '50,000 - 250,000', '250,000+',
]

const promoteOnOptions = [
  'INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'YOUTUBE',
  'IN PERSON / WORD OF MOUTH', 'BLOG / WEBSITE', 'OTHER',
]

const heardAboutOptions = [
  'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'TALKED TO A PULSAR TEAM MEMBER', 'WORD OF MOUTH', 'OTHER',
]

const inputClass = 'w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all'

export default function AffiliateSignup() {
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    website: '',
    audienceSize: '',
    promoteOn: [],
    heardAbout: [],
    whyAffiliate: '',
    marketingOptIn: false,
    privacyAgreed: false,
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function toggleCheckbox(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!required(form.fullName)) { setError('Please add your name.'); return }
    if (!isEmail(form.email)) { setError('Enter a valid email address.'); return }
    if (!isPhone(form.phone)) { setError('Enter a valid phone number.'); return }
    if (!form.privacyAgreed) { setError('Please agree to the privacy terms to submit.'); return }
    setError('')
    setStatus('loading')
    try {
      await submitLead('affiliate-application', form)
      setSubmitted(true)
      window.scrollTo(0, 0)
    } catch {
      setStatus('error')
      setError('Something went wrong. Email hello@pulsarpatch.com and we will get you set up.')
    }
  }

  if (submitted) {
    return (
      <div className="w-full bg-white flex flex-col" id="affiliate-signup-thanks">
        <section className="relative w-full bg-pulsar-pink overflow-hidden flex items-center pt-16 pb-24 px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="relative z-10 max-w-[1920px] mx-auto w-full">
            <h1 className="font-futura font-[900] text-[clamp(2.25rem,7vw,3.5rem)] text-white uppercase tracking-wide leading-[1.1]">
              You're on<br />the list!
            </h1>
          </div>
        </section>
        <section className="bg-white py-16 lg:py-[80px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[1920px] mx-auto">
            <div className="max-w-[700px]">
              <p className="font-inter text-[16px] leading-[1.8] text-gray-700 mb-6">
                Thanks for applying to the Pulsar affiliate program. We review every application and reach out within a couple of days with your unique code and everything you need to start earning. Keep an eye on your inbox, and check spam just in case.
              </p>
              <p className="font-inter text-[16px] leading-[1.8] text-gray-700 mb-10">Talk soon.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/" className="inline-flex items-center bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-4 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                  Back to home
                </Link>
                <Link to="/affiliate" className="inline-flex items-center border-2 border-pulsar-blue text-pulsar-blue font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue/5">
                  Affiliate details
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="w-full bg-white flex flex-col" id="affiliate-signup-page">

      {/* Hero */}
      <section className="relative w-full bg-pulsar-pink overflow-hidden pt-14 pb-[120px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="relative z-10 max-w-[1920px] mx-auto">
          <Link to="/affiliate" className="font-inter text-[13px] text-white/80 hover:text-white transition-colors">← Back to affiliates</Link>
          <h1 className="font-futura font-[900] text-[clamp(2rem,7vw,3.25rem)] text-white uppercase tracking-wide leading-[1.05] mt-3">Become a Pulsar<br />affiliate</h1>
        </div>
        <div className="absolute -bottom-px left-0 w-full leading-none z-10 pointer-events-none">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" /></svg>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[700px]">

            <h2 className="font-futura font-bold text-[28px] text-pulsar-dark uppercase tracking-wide mb-4">
              LET'S GET YOU EARNING!
            </h2>
            <p className="font-inter text-[15px] leading-[1.7] text-gray-600 mb-4">
              You already tell your friends about Pulsar. This quick application helps us get you set up with your own referral code so you can start earning on every order you send our way.
            </p>
            <p className="font-inter text-[15px] leading-[1.7] text-gray-600 mb-10">
              No follower minimum, no catch. Just tell us a little about you and how you'd spread the word.
            </p>

            <form onSubmit={handleSubmit}>

              {/* SECTION 1 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-8">
                SECTION 1- ABOUT YOU
              </h3>

              <div className="flex flex-col gap-6 mb-10">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Full name *</label>
                  <input type="text" name="fullName" required value={form.fullName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Email address *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Phone number *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">City <span className="text-pulsar-pink">(Optional)</span></label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="flex-1">
                    <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">State <span className="text-pulsar-pink">(Optional)</span></label>
                    <input type="text" name="state" value={form.state} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="w-full h-[2px] bg-gray-200 mb-10"></div>

              {/* SECTION 2 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-6">
                SECTION 2- YOUR REACH
              </h3>

              <div className="flex flex-col gap-6 mb-8">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Handles &amp; links <span className="text-pulsar-pink">(share whatever you've got)</span></label>
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">Instagram</span>
                      <input type="text" name="instagram" value={form.instagram} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">TikTok</span>
                      <input type="text" name="tiktok" value={form.tiktok} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">YouTube</span>
                      <input type="text" name="youtube" value={form.youtube} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">Website / other</span>
                      <input type="text" name="website" value={form.website} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Roughly how big is your audience?</label>
                  <select name="audienceSize" value={form.audienceSize} onChange={handleChange} className={inputClass}>
                    <option value="">Select one</option>
                    {audienceSizes.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-1">
                    Where would you share your code? <span className="text-pulsar-pink">(select all that apply)</span>
                  </label>
                  <div className="flex flex-col gap-2 mt-3">
                    {promoteOnOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.promoteOn.includes(opt)} onChange={() => toggleCheckbox('promoteOn', opt)} className="w-4 h-4 accent-pulsar-pink cursor-pointer" />
                        <span className="font-inter font-[600] text-[13px] text-pulsar-dark uppercase">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full h-[2px] bg-gray-200 mb-10"></div>

              {/* SECTION 3 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-6">
                SECTION 3- HOW DID YOU HEAR ABOUT US
              </h3>

              <div className="mb-10">
                <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-1">
                  How you heard of us <span className="text-pulsar-pink">(select all that apply)</span>
                </label>
                <div className="flex flex-col gap-2 mt-3">
                  {heardAboutOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.heardAbout.includes(opt)} onChange={() => toggleCheckbox('heardAbout', opt)} className="w-4 h-4 accent-pulsar-pink cursor-pointer" />
                      <span className="font-inter font-[600] text-[13px] text-pulsar-dark uppercase">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="w-full h-[2px] bg-gray-200 mb-10"></div>

              {/* SECTION 4 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-1">
                SECTION 4- FINAL NOTES <span className="font-inter font-[400] text-[14px] text-gray-400 normal-case tracking-normal">(Optional)</span>
              </h3>
              <div className="mb-10 mt-6">
                <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Why do you want to be a Pulsar affiliate?</label>
                <input type="text" name="whyAffiliate" value={form.whyAffiliate} onChange={handleChange} className={inputClass} />
              </div>

              {/* Opt-ins */}
              <div className="flex flex-col gap-4 mb-10">
                <label className="flex items-start gap-3 cursor-pointer bg-pulsar-pink/5 border border-pulsar-pink/20 rounded-[12px] p-5">
                  <input type="checkbox" checked={form.marketingOptIn} onChange={() => setForm({ ...form, marketingOptIn: !form.marketingOptIn })} className="w-5 h-5 accent-pulsar-pink cursor-pointer mt-0.5 shrink-0" />
                  <div>
                    <span className="font-inter font-[700] text-[13px] text-pulsar-pink uppercase block mb-1">RECEIVE MARKETING COMMUNICATION AND UPDATES</span>
                    <span className="font-inter text-[11px] text-gray-500 leading-[1.5] block">
                      Check this box to receive news and notifications from the Pulsar Patch team, including program updates, campaign opportunities, and resources to help you succeed as a Pulsar affiliate. Unsubscribe any time by emailing hello@pulsarpatch.com. Consent is not a condition of participation. Message and data rates may apply. Reply STOP to cancel at any time. By submitting, you agree to the Terms of Service and Privacy Policy provided by Pulsar Patch.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer bg-pulsar-pink/5 border border-pulsar-pink/20 rounded-[12px] p-5">
                  <input type="checkbox" checked={form.privacyAgreed} onChange={() => setForm({ ...form, privacyAgreed: !form.privacyAgreed })} className="w-5 h-5 accent-pulsar-pink cursor-pointer mt-0.5 shrink-0" required />
                  <div>
                    <span className="font-inter font-[700] text-[13px] text-pulsar-pink uppercase block">BY SUBMITTING THIS FORM I AGREE TO PULSAR PATCH HANDLING MY PERSONAL INFORMATION IN LINE WITH ITS PRIVACY POLICY AND TERMS OF USE.</span>
                  </div>
                </label>
              </div>

              {/* Submit */}
              {error && <p className="text-red-500 text-[14px] font-inter mb-4" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-pulsar-pink text-white font-futura font-bold text-[16px] uppercase tracking-widest py-5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === 'loading' ? 'Submitting…' : 'Submit application'}
              </button>

            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
