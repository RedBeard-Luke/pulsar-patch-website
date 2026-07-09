import { useState } from 'react'
import { Link } from 'react-router-dom'
import squigleBg from '../../assets/footer_Squigle.svg'

/* Example wholesale pricing. Suggested retail is $6.00/patch. Confirm live numbers before launch. */
const bulkTiers = [
  { id: 'bulk-50',  name: '50 PATCHES',  patches: 50,  perPatch: 3.00, get total() { return this.perPatch * this.patches }, description: 'Test the waters. Stock a small display and see how your customers respond.' },
  { id: 'bulk-100', name: '100 PATCHES', patches: 100, perPatch: 2.75, get total() { return this.perPatch * this.patches }, description: 'Our most popular tier. Enough to keep your shelf stocked for weeks.', recommended: true },
  { id: 'bulk-150', name: '150 PATCHES', patches: 150, perPatch: 2.50, get total() { return this.perPatch * this.patches }, description: 'Best value per patch. For high-traffic spots that move product fast.' },
]

const steps = [
  { n: '1', title: 'Apply', body: 'Fill out the short wholesale form. Takes about two minutes.' },
  { n: '2', title: 'Get approved', body: 'We reply within 24 hours with pricing and next steps.' },
  { n: '3', title: 'Stock up', body: 'Place your first order. Reorder anytime, no contract.' },
]

const businessFaqs = [
  { q: "What's the minimum order for wholesale?", a: 'Our smallest tier is 50 patches. A great way to test how Pulsar performs before committing to more.' },
  { q: 'What types of businesses carry Pulsar?', a: "Mostly bars, liquor stores, smoke shops, and corner stores, but we're open to anywhere it sells. If your customers would love it, we want to talk." },
  { q: 'How does reordering work?', a: "Once you're set up, reorder in a click. We ship the same order again. No paperwork, no back and forth." },
  { q: 'Do you offer displays or marketing materials?', a: 'Yes. For orders of 100+ patches we provide counter displays and promo materials to help move product.' },
  { q: 'What are the payment terms?', a: 'Wholesale orders are paid upfront. We take major cards and bank transfers, and can set up monthly billing for recurring orders.' },
  { q: 'How fast do wholesale orders ship?', a: 'Processed within 3 to 5 business days and shipped priority. Most orders arrive within 5 to 10 business days.' },
  { q: 'Can I return unsold inventory?', a: "We stand behind our product. Unopened patches in original packaging can be returned within 30 days. Email us to start." },
  { q: 'Is there a contract or commitment?', a: 'No contracts. Order what you need, when you need it. Most partners reorder on their own because the product moves.' },
]

export default function Wholesale() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <div className="w-full bg-white flex flex-col" id="wholesale-page">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full bg-pulsar-blue pb-[100px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-14 pb-6">
          <p className="font-futura font-[800] text-[12px] uppercase tracking-[3px] text-white/80 mb-3">Wholesale</p>
          <h1 className="font-futura font-[900] text-[clamp(2.25rem,8vw,3.75rem)] text-white uppercase tracking-wide mb-4 leading-[1.05]">Sell Pulsar in your store</h1>
          <p className="font-inter text-[clamp(1rem,3vw,1.15rem)] leading-[1.6] text-white/85 max-w-[600px] mb-8">
            Your customers are already asking for it. Real margins, low minimums, no contracts.
          </p>
          <Link to="/business-signup" className="inline-flex items-center gap-3 bg-white text-pulsar-blue font-futura font-[800] text-[14px] uppercase tracking-wide px-8 py-4 rounded-full hover:-translate-y-0.5 transition-transform shadow-md">
            Apply to carry Pulsar →
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10 pointer-events-none">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ═══ CREDIBILITY BAR ═══ */}
      <section className="bg-white border-b border-gray-100 px-5 sm:px-8 lg:px-16 xl:px-[140px] py-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { big: '60+', small: 'Retail partners in AZ & NV' },
            { big: '~55%', small: 'Typical retail margin' },
            { big: '50', small: 'Patch minimum to start' },
            { big: '24 hrs', small: 'Application turnaround' },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-futura font-[900] text-[clamp(1.4rem,5vw,2rem)] text-pulsar-pink leading-none">{s.big}</p>
              <p className="font-inter text-[12px] text-gray-500 mt-2">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-white px-5 sm:px-8 lg:px-16 xl:px-[140px] py-14 lg:py-[70px]">
        <div className="max-w-[1920px] mx-auto">
          <h2 className="font-futura font-[900] text-[clamp(1.5rem,5vw,1.75rem)] text-pulsar-blue uppercase tracking-wide mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(s => (
              <div key={s.n} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-full bg-pulsar-blue text-white font-futura font-[900] text-[18px] flex items-center justify-center shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-futura font-[900] text-[17px] text-pulsar-blue uppercase mb-1">{s.title}</h3>
                  <p className="font-inter text-[14px] text-gray-600 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING TIERS ═══ */}
      <section className="bg-white px-5 sm:px-8 lg:px-16 xl:px-[140px] py-8 lg:pb-[80px]">
        <div className="max-w-[1920px] mx-auto">
          <h2 className="font-futura font-[900] text-[clamp(1.5rem,5vw,1.75rem)] text-pulsar-blue uppercase tracking-wide mb-3">Wholesale tiers</h2>
          <p className="font-inter text-[15px] text-gray-600 mb-10 max-w-[620px]">
            Simple, transparent pricing. The more you order, the more you make per patch. Suggested retail is $6.00 each.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {bulkTiers.map((tier) => {
              const margin = Math.round((1 - tier.perPatch / 6) * 100)
              return (
                <div key={tier.id} className={`flex flex-col text-center p-8 rounded-[24px] border-2 transition-all duration-300 ${tier.recommended ? 'border-pulsar-blue shadow-glow-blue md:-translate-y-2' : 'border-gray-200 hover:border-pulsar-blue/40'}`}>
                  <span className={`font-futura font-bold text-[11px] uppercase tracking-widest mb-3 ${tier.recommended ? 'text-pulsar-blue' : 'text-transparent'}`}>Most popular</span>
                  <h3 className="font-futura font-[900] text-[22px] text-pulsar-dark uppercase tracking-wide mb-1">{tier.name}</h3>
                  <p className="font-inter text-[13px] text-gray-500 mb-6 min-h-[54px]">{tier.description}</p>
                  <div className="w-full border-t border-gray-100 pt-5 mb-6 text-left">
                    <div className="flex justify-between mb-2"><span className="font-inter text-[13px] text-gray-500">Cost per patch</span><span className="font-futura font-bold text-[15px] text-pulsar-blue">${tier.perPatch.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-2"><span className="font-inter text-[13px] text-gray-500">Order total</span><span className="font-futura font-bold text-[16px] text-pulsar-pink">${tier.total.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="font-inter text-[13px] text-gray-500">Your margin</span><span className="font-futura font-bold text-[15px] text-pulsar-dark">~{margin}%</span></div>
                  </div>
                  <Link to="/business-signup" className="mt-auto w-full bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-widest py-3.5 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                    Get started
                  </Link>
                </div>
              )
            })}
          </div>
          <p className="font-inter text-[12px] text-gray-400 text-center mt-8">
            Need a custom quantity? Email <a href="mailto:hello@pulsarpatch.com?subject=Wholesale%20Inquiry" className="text-pulsar-blue underline underline-offset-2 hover:text-pulsar-pink">hello@pulsarpatch.com</a>.
          </p>
        </div>
      </section>

      {/* ═══ INQUIRY ═══ */}
      <section className="relative bg-pulsar-pink px-5 sm:px-8 lg:px-16 xl:px-[140px] py-14 lg:py-[80px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-[80px]">
          <div className="flex-1">
            <h2 className="font-futura font-[900] text-[clamp(1.75rem,6vw,2.75rem)] text-white uppercase tracking-wide leading-[1.1] mb-4">Ready to stock Pulsar?</h2>
            <p className="font-inter text-[16px] leading-[1.6] text-white/85 mb-8 max-w-[500px]">
              Neighborhood spot or national chain, we'd love to talk. Apply online and we'll be in touch within a day.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/business-signup" className="inline-flex items-center gap-3 bg-white text-pulsar-pink font-futura font-bold text-[14px] uppercase tracking-[1px] px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Apply now →
              </Link>
              <a href="mailto:hello@pulsarpatch.com?subject=Wholesale%20Inquiry" className="inline-flex items-center gap-3 border-2 border-white text-white font-futura font-bold text-[14px] uppercase tracking-[1px] px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:bg-white/10">
                Email us
              </a>
            </div>
          </div>
          <div className="w-full lg:w-auto lg:flex-shrink-0 bg-white/10 rounded-[24px] p-8 backdrop-blur-sm">
            <h3 className="font-futura font-bold text-[16px] text-white uppercase tracking-wide mb-5">The basics</h3>
            <div className="flex flex-col gap-4">
              {[
                ['📍', 'Serving AZ & NV, shipping nationwide'],
                ['📦', '50 patch minimum, no contract'],
                ['⏱️', 'Reply within 24 hours'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-[18px]" aria-hidden="true">{icon}</span>
                  <span className="font-inter text-[14px] text-white">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BUSINESS FAQ ═══ */}
      <section className="bg-pulsar-light-blue-bg px-5 sm:px-8 lg:px-16 xl:px-[140px] py-14 lg:py-[80px]">
        <div className="max-w-[1920px] mx-auto">
          <h2 className="font-futura font-[900] text-[clamp(1.5rem,5vw,1.75rem)] text-pulsar-blue uppercase tracking-wide mb-8">Business FAQs</h2>
          <div className="flex flex-col border-t border-pulsar-blue/30">
            {businessFaqs.map((faq, index) => (
              <div key={index} className="border-b border-pulsar-blue/30 cursor-pointer" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <div className="flex justify-between items-center py-5">
                  <span className="font-inter font-[600] text-[15px] text-pulsar-dark pr-6">{faq.q}</span>
                  <span className="text-pulsar-blue text-[24px] leading-none transition-transform duration-300 shrink-0" style={{ transform: activeFaq === index ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-[400px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
                  <p className="font-inter text-[14px] leading-[1.8] text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
