import { useState } from 'react'
import { Link } from 'react-router-dom'
import squigleBg from '../../assets/footer_Squigle.svg'
import iconArrow from '../../assets/icon-arrow.svg'

const bulkTiers = [
  {
    id: 'bulk-50',
    name: '50 PATCHES',
    patches: 50,
    pricePerPatch: '$XX.XX',
    total: '$XX.XX',
    description: 'Perfect for testing the waters. Stock a small display and see how your customers respond.',
  },
  {
    id: 'bulk-100',
    name: '100 PATCHES',
    patches: 100,
    pricePerPatch: '$XX.XX',
    total: '$XX.XX',
    description: 'Our most popular wholesale tier. Enough inventory to keep your shelves stocked for weeks.',
    recommended: true,
  },
  {
    id: 'bulk-150',
    name: '150 PATCHES',
    patches: 150,
    pricePerPatch: '$XX.XX',
    total: '$XX.XX',
    description: 'Best value per patch. For high-traffic locations that move product fast.',
  },
]

const businessFaqs = [
  {
    q: "What's the minimum order for wholesale?",
    a: "Our smallest wholesale tier starts at 50 patches. This is a great way to test how Pulsar performs with your customers before committing to a larger order."
  },
  {
    q: "What types of businesses carry Pulsar?",
    a: "We normally serve bars, liquor stores, smoke shops, and corner stores, but we're open to having Pulsar anywhere it sells! If you think your customers would love it, we'd love to talk."
  },
  {
    q: "How does reordering work?",
    a: "Once you've placed your first order, you can reorder directly from your business dashboard. Hit the reorder button and we'll ship the same order again. No paperwork, no back and forth."
  },
  {
    q: "Do you offer custom displays or marketing materials?",
    a: "Yes. For orders of 100+ patches, we can provide counter displays and promotional materials to help move product. Reach out to us at hello@pulsarpatch.com to discuss what works for your space."
  },
  {
    q: "What are the payment terms?",
    a: "All wholesale orders are paid upfront. We accept all major credit cards and bank transfers. For recurring orders, we can set up a monthly billing cycle that works for your business."
  },
  {
    q: "How fast do wholesale orders ship?",
    a: "Wholesale orders are processed within 3 to 5 business days and shipped via priority. Most domestic orders arrive within 5 to 10 business days of placement."
  },
  {
    q: "Can I return unsold inventory?",
    a: "We stand behind our product. If patches are unopened and in original packaging, we'll work with you on returns within 30 days of delivery. Contact us at hello@pulsarpatch.com to start the process."
  },
  {
    q: "Is there a contract or commitment?",
    a: "No contracts, no commitments. Order what you need, when you need it. Most of our business partners reorder on their own because the product moves."
  },
]

export default function Wholesale() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [lastOrder] = useState(null)
  const [isBusinessLoggedIn, setIsBusinessLoggedIn] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  function handleBusinessLogin(e) {
    e.preventDefault()
    if (loginPassword === 'admin') {
      setIsBusinessLoggedIn(true)
      setShowLoginPrompt(false)
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  function handleOrderClick() {
    if (!isBusinessLoggedIn) {
      setShowLoginPrompt(true)
    }
  }

  return (
    <div className="w-full bg-white flex flex-col" id="wholesale-page">

      {/* Login Prompt Overlay */}
      {showLoginPrompt && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={() => setShowLoginPrompt(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2001] bg-white rounded-[24px] shadow-2xl p-10 w-[420px]">
            <h3 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-2">BUSINESS LOGIN</h3>
            <p className="font-inter text-[13px] text-gray-500 mb-6">Sign in with your business account to view pricing and place orders.</p>
            <form onSubmit={handleBusinessLogin} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="BUSINESS PASSWORD"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(false) }}
                className={`w-full font-futura font-[800] text-[15px] text-gray-800 uppercase tracking-wide outline-none placeholder-gray-400 border-b-2 pb-2 transition-colors ${loginError ? 'border-red-400' : 'border-[#D4F1F9] focus:border-pulsar-pink'}`}
              />
              {loginError && <p className="font-inter text-[12px] text-red-400">Incorrect password. Try again.</p>}
              <button type="submit" className="w-full bg-pulsar-blue text-white font-futura font-bold text-[14px] uppercase tracking-widest py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
                SIGN IN
              </button>
              <button type="button" onClick={() => setShowLoginPrompt(false)} className="font-inter text-[13px] text-gray-400 hover:text-gray-600 transition-colors text-center">
                Cancel
              </button>
            </form>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════
         1. HERO
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-pulsar-blue pb-[120px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[140px] pb-[20px]">
          <h1 className="font-futura font-bold text-[54px] text-white uppercase tracking-wide mb-4">
            WHOLESALE
          </h1>
          <p className="font-inter text-[18px] leading-[1.6] text-white/80 max-w-[600px]">
            Stock Pulsar Patch at your business. Your customers are already looking for it.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. REORDER SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[60px] border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-bold text-[28px] text-pulsar-blue uppercase tracking-wide mb-6">
            REORDER
          </h2>
          {lastOrder ? (
            <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8 flex items-center justify-between">
              <div>
                <p className="font-futura font-bold text-[18px] text-pulsar-dark uppercase tracking-wide mb-1">YOUR LAST ORDER</p>
                <p className="font-inter text-[14px] text-gray-600">100 Patches, placed on April 15, 2026</p>
              </div>
              <button onClick={handleOrderClick} className="bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-3.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                REORDER
              </button>
            </div>
          ) : (
            <div className="bg-pulsar-light-blue-bg rounded-[20px] p-8 flex items-center justify-between">
              <div>
                <p className="font-futura font-bold text-[18px] text-pulsar-dark uppercase tracking-wide mb-1">NO ORDERS YET</p>
                <p className="font-inter text-[14px] text-gray-600">Place your first wholesale order below and it'll show up here for easy reordering.</p>
              </div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#44C8E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. BULK PRICING TIERS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-bold text-[28px] text-pulsar-blue uppercase tracking-wide mb-4">
            WHOLESALE TIERS
          </h2>
          <p className="font-inter text-[15px] text-gray-600 mb-12 max-w-[600px]">
            {isBusinessLoggedIn
              ? "Simple, transparent pricing. The more you order, the more you save per patch. No hidden fees, no surprises."
              : "Sign in with your business account to view wholesale pricing. Select a tier below to get started."}
          </p>

          <div className="grid grid-cols-3 gap-10">
            {bulkTiers.map((tier) => (
              <div
                key={tier.id}
                className={`flex flex-col items-center text-center p-10 rounded-[24px] border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${
                  tier.recommended
                    ? 'border-pulsar-blue shadow-glow-blue scale-105 hover:scale-110'
                    : 'border-gray-200'
                }`}
              >
                {tier.recommended && (
                  <span className="font-futura font-bold text-[12px] text-pulsar-blue uppercase tracking-widest mb-4">
                    MOST POPULAR
                  </span>
                )}

                <h3 className="font-futura font-bold text-[24px] text-pulsar-dark uppercase tracking-wide mb-2">
                  {tier.name}
                </h3>

                <p className="font-inter text-[13px] text-gray-500 mb-6 max-w-[250px]">
                  {tier.description}
                </p>

                {isBusinessLoggedIn && (
                  <div className="w-full border-t border-gray-200 pt-6 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-inter text-[13px] text-gray-500">Price per patch</span>
                      <span className="font-futura font-bold text-[15px] text-pulsar-blue">{tier.pricePerPatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-inter text-[13px] text-gray-500">Order total</span>
                      <span className="font-futura font-bold text-[18px] text-pulsar-pink">{tier.total}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleOrderClick}
                  className="w-full bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-widest py-3.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark"
                >
                  ORDER NOW
                </button>
              </div>
            ))}
          </div>

          <p className="font-inter text-[12px] text-gray-400 text-center mt-8">
            Need a custom quantity or have a special request? Reach out to us at hello@pulsarpatch.com
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         4. CONTACT / BUSINESS INQUIRY
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative bg-pulsar-pink py-[80px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] flex items-center gap-[80px]">
          <div className="flex-1">
            <h2 className="font-futura font-bold text-[42px] text-white uppercase tracking-wide leading-[1.1] mb-4">
              HAVE A BUSINESS INQUIRY?
            </h2>
            <p className="font-inter text-[16px] leading-[1.6] text-white/80 mb-8 max-w-[500px]">
              Any business is welcome. Whether you're a neighborhood spot, a national chain, or something in between, we'd love to talk about getting Pulsar in front of your customers.
            </p>
            <div className="flex gap-4">
              <a href="mailto:hello@pulsarpatch.com?subject=Wholesale Inquiry" className="inline-flex items-center gap-3 bg-white text-pulsar-pink font-futura font-bold text-[14px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                EMAIL US
                <img src={iconArrow} alt="Arrow" className="w-[18px] h-auto" />
              </a>
              <Link to="/contact" className="inline-flex items-center gap-3 bg-transparent border-2 border-white text-white font-futura font-bold text-[14px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                CONTACT FORM
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 bg-white/10 rounded-[24px] p-10 backdrop-blur-sm">
            <h3 className="font-futura font-bold text-[18px] text-white uppercase tracking-wide mb-6">QUICK CONTACT</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span className="font-inter text-[14px] text-white">hello@pulsarpatch.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
                <span className="font-inter text-[14px] text-white">Any business is welcome</span>
              </div>
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span className="font-inter text-[14px] text-white">Response within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         5. BUSINESS FAQ (last section)
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-pulsar-light-blue-bg py-[80px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-bold text-[28px] text-pulsar-blue uppercase tracking-wide mb-10">
            BUSINESS FAQ'S
          </h2>

          <div className="w-full">
            <div className="flex flex-col border-t border-pulsar-blue/30">
              {businessFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-pulsar-blue/30 cursor-pointer"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center py-6">
                    <span className="font-inter font-[600] text-[16px] text-pulsar-dark pr-8">{faq.q}</span>
                    <span
                      className="text-pulsar-blue text-[24px] leading-none transition-transform duration-300 shrink-0"
                      style={{ transform: activeFaq === index ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-[400px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="font-inter text-[14px] leading-[1.8] text-gray-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
