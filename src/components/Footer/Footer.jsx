import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoWhite from '../../assets/Logo_White.svg'
import footerSquigle from '../../assets/footer_Squigle.svg'
import { submitLead, isEmail } from '../../lib/forms'

const linkColumns = {
  Explore: [
    { label: 'Shop', path: '/shop' },
    { label: 'About Us', path: '/about' },
    { label: 'The Science', path: '/science' },
    { label: 'Find A Store', path: '/store-locator' },
    { label: 'Subscription', path: '/subscription' },
    { label: 'Affiliate', path: '/affiliate' },
  ],
  Connect: [
    { label: 'Your Account', path: '/account' },
    { label: 'Wholesale', path: '/wholesale' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Our Blog', path: '/blog' },
  ],
  Support: [
    { label: "FAQ's", path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Shipping', path: '/shipping' },
    { label: 'Returns', path: '/refunds' },
    { label: 'Terms of Service', path: '/terms' },
  ],
}

export default function Footer() {
  const { pathname } = useLocation()
  // The footer's top wave should match the colour of the section that sits
  // directly above it, so the curve reads as one continuous zone into the
  // footer's blue with no stray band. Pages end on white by default; these
  // pages close on the lightest blue.
  const lightBlueClosers = ['/about', '/wholesale', '/affiliate']
  const waveColor = lightBlueClosers.includes(pathname) ? '#E8F7FB' : 'white'

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | error | loading | done
  const [error, setError] = useState('')

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!isEmail(email)) {
      setError('Enter a valid email address.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setError('')
    try {
      await submitLead('newsletter', { email })
      setStatus('done')
      setEmail('')
    } catch {
      setError('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  return (
    <footer className="relative -mt-px w-full bg-[#44C8E8] text-white pt-[40px] sm:pt-[70px] lg:pt-[120px] pb-8 overflow-hidden" id="footer">

      {/* White Wave Mask at the top to reveal blue + squiggle below */}
      <div className="absolute top-0 left-0 w-full h-[40px] sm:h-[70px] lg:h-[120px] z-10 leading-none pointer-events-none">
        <svg className="block w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M 0 40 Q 120 120, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 0 L 0 0 Z" fill={waveColor} />
        </svg>
      </div>

      {/* Squigle Background spanning entire footer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-start justify-center">
        <img src={footerSquigle} alt="" className="w-full h-auto opacity-[0.05] min-w-[1920px] object-cover" />
      </div>

      <div className="max-w-[1440px] mx-auto px-10 md:px-20 lg:px-[100px] relative z-10 pt-4">
        
        {/* Top Section: Logo & Links */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-16 lg:gap-0">
          {/* Left: Logo & Socials */}
          <div className="flex flex-col items-center lg:items-start lg:w-1/3">
            <div className="flex flex-col items-center">
              <Link to="/">
                <img src={logoWhite} alt="Pulsar" className="h-[120px] w-auto mb-6" />
              </Link>
              
              <div className="flex gap-5">
                <a href="https://www.instagram.com/pulsarpatch/" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://www.facebook.com/PulsarPatch" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@pulsarpatch" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform" aria-label="TikTok">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.18a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.61z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-10 lg:pl-20">
            {Object.entries(linkColumns).map(([title, links]) => (
              <div key={title} className="flex flex-col items-start">
                <h3 className="font-futura font-bold text-[18px] uppercase tracking-wide text-white mb-6">{title}</h3>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.path} className="font-inter font-[500] text-[14px] text-white hover:text-white/70 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-6 gap-8 lg:gap-0">
          <div className="flex flex-col lg:w-1/2">
            <h3 className="font-futura font-bold text-[18px] uppercase tracking-wide text-white mb-2">KEEP UP WITH PULSAR PATCH</h3>
            <p className="font-inter text-[14px] leading-[1.6] text-white">
              Stay in touch with deals and news from your<br />friends at Pulsar Patch!
            </p>
          </div>
          <div className="lg:w-[45%] w-full">
            {status === 'done' ? (
              <p className="font-inter text-[15px] text-white font-[600] py-2" role="status">You're in. Watch your inbox for the good stuff.</p>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="flex items-center gap-4 sm:gap-6 w-full">
                <label htmlFor="footer-email" className="font-futura font-[900] text-[18px] uppercase tracking-wide text-white shrink-0 hidden sm:block pt-1">EMAIL:</label>
                <div className="flex-1 border-b-[2px] border-white pb-1 flex items-center">
                  <input
                    type="email"
                    id="footer-email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                    aria-invalid={status === 'error'}
                    className="bg-transparent text-white placeholder-white/50 font-inter text-[16px] outline-none w-full px-1"
                  />
                </div>
                <button type="submit" disabled={status === 'loading'} className="bg-white text-[#44C8E8] font-futura font-bold text-[13px] uppercase px-6 sm:px-8 py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap shadow-md disabled:opacity-60">
                  {status === 'loading' ? '...' : 'SIGN UP'}
                </button>
              </form>
            )}
            {status === 'error' && <p className="font-inter text-[13px] text-white/90 mt-2" role="alert">{error}</p>}
          </div>
        </div>

        {/* Solid White Line */}
        <div className="w-full h-[2px] bg-white mb-6"></div>

        {/* Bottom Section: Disclaimer */}
        <div className="font-inter text-[10px] leading-[1.5] text-white/60 mb-6">
          <p className="mb-2">
            <span className="font-[600] text-white/70">Disclaimer:</span> "Hangover Defense Patch" is a product descriptor only and does not imply prevention, treatment, or cure of hangovers or intoxication. Results may vary. Statements have not been evaluated by the FDA.
          </p>
          <p className="mb-2">
            If pregnant, nursing, have a medical condition, or are taking medication, consult a medical professional before use.
          </p>
          <p>
            <span className="font-[600] text-white/70">Warning:</span> For external use only. Do not stick this on broken or irritated skin. If your skin gets mad, remove it. Keep out of reach of kids.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex justify-end text-white font-inter text-[12px] font-[500]">
          <div>
            All Rights Reserved pulsarpatch.com 2026
          </div>
        </div>

      </div>
    </footer>
  )
}
