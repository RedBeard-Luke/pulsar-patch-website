import { useState } from 'react'
import { Link } from 'react-router-dom'
import squigleBg from '../../assets/Squigle_What is Pulsar.svg'
import { submitLead, isEmail, isPhone, required } from '../../lib/forms'

const CARDS = [
  { title: 'FAQs', sub: 'Answers to the most asked questions', to: '/faq' },
  { title: 'Store Locator', sub: 'Find where to buy Pulsar near you', to: '/store-locator' },
  { title: 'Wholesale', sub: 'Want to stock Pulsar in your store?', to: '/wholesale' },
]

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', orderNumber: '', message: '' })
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | done | error

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  function validate() {
    const next = {}
    if (!required(form.firstName)) next.firstName = 'Please add your first name.'
    if (!isEmail(form.email)) next.email = 'Enter a valid email.'
    if (form.phone && !isPhone(form.phone)) next.phone = 'Enter a valid phone number.'
    if (!required(form.message)) next.message = 'Let us know how we can help.'
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return
    setStatus('loading')
    try {
      await submitLead('contact', { ...form, attachment: file?.name || null, to: ['hello@pulsarpatch.com', 'lclark0684@gmail.com'] })
      setStatus('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('error')
    }
  }

  const inputBase = 'w-full border border-gray-300 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors bg-pulsar-light-blue-bg'

  return (
    <div className="w-full bg-white flex flex-col" id="contact-page">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full bg-pulsar-blue pb-[120px] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: `url('${squigleBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-14 pb-10">
          <h1 className="font-futura font-[900] text-[clamp(2rem,7vw,3rem)] text-white uppercase tracking-wide mb-8">How can we help?</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CARDS.map(card => (
              <Link key={card.title} to={card.to} className="bg-pulsar-pink text-white rounded-[20px] py-5 px-7 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark group">
                <div>
                  <span className="font-futura font-[900] text-[20px] uppercase tracking-wide block">{card.title}</span>
                  <span className="font-inter text-[11px] text-white/80">{card.sub}</span>
                </div>
                <span className="text-[24px] transition-transform duration-150 group-hover:translate-x-1 shrink-0 ml-3">→</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10 pointer-events-none">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <section className="bg-white py-16 lg:py-[100px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-[60px]">
          <div className="lg:flex-shrink-0 lg:pt-2">
            <h2 className="font-futura font-[900] text-[clamp(1.75rem,5vw,2.25rem)] text-pulsar-blue uppercase tracking-wide">Contact Us</h2>
            <p className="font-inter text-[14px] text-gray-500 mt-2 max-w-[260px]">We reply within a day. Real humans, no bots.</p>
          </div>

          <div className="w-full lg:flex-1 max-w-[900px]">
            {status === 'done' ? (
              <div className="text-center py-16 border-2 border-dashed border-pulsar-light-blue rounded-3xl" role="status">
                <div className="w-14 h-14 rounded-full bg-pulsar-blue/10 flex items-center justify-center mx-auto mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#44C8E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3 className="font-futura font-[900] text-[26px] text-pulsar-blue uppercase mb-2">Got it, thanks!</h3>
                <p className="font-inter text-[15px] text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">Name <span className="text-pulsar-pink">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} aria-invalid={!!errors.firstName} className={`${inputBase} ${errors.firstName ? 'border-red-400' : ''}`} />
                      {errors.firstName && <p className="text-red-500 text-[12px] font-inter mt-1">{errors.firstName}</p>}
                    </div>
                    <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className={`${inputBase} flex-1`} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-5">
                  <div className="flex-1">
                    <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">Email <span className="text-pulsar-pink">*</span></label>
                    <input type="email" name="email" placeholder="you@email.com" value={form.email} onChange={handleChange} aria-invalid={!!errors.email} className={`${inputBase} ${errors.email ? 'border-red-400' : ''}`} />
                    {errors.email && <p className="text-red-500 text-[12px] font-inter mt-1">{errors.email}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">Phone</label>
                    <input type="tel" name="phone" placeholder="(555) 555-5555" value={form.phone} onChange={handleChange} aria-invalid={!!errors.phone} className={`${inputBase} ${errors.phone ? 'border-red-400' : ''}`} />
                    {errors.phone && <p className="text-red-500 text-[12px] font-inter mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">Order number</label>
                  <input type="text" name="orderNumber" placeholder="#123456" value={form.orderNumber} onChange={handleChange} className={inputBase} />
                </div>

                <div className="mb-5 border-t-2 border-dashed border-pulsar-blue/30 pt-6">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">Message <span className="text-pulsar-pink">*</span></label>
                  <textarea name="message" rows={6} value={form.message} onChange={handleChange} aria-invalid={!!errors.message} className={`${inputBase} resize-none ${errors.message ? 'border-red-400' : ''}`} />
                  {errors.message && <p className="text-red-500 text-[12px] font-inter mt-1">{errors.message}</p>}
                </div>

                <div className="mb-6">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">Attach a photo</label>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setFile(e.target.files[0])} className="font-inter text-[13px] text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pulsar-light-blue file:text-pulsar-blue file:font-futura file:font-bold file:text-[12px] file:uppercase" />
                  {file && <p className="font-inter text-[12px] text-gray-500 mt-1">Attached: {file.name}</p>}
                </div>

                {status === 'error' && <p className="text-red-500 text-[14px] font-inter mb-4" role="alert">Something went wrong. Email us at hello@pulsarpatch.com and we'll sort it out.</p>}

                <div className="flex justify-end">
                  <button type="submit" disabled={status === 'loading'} className="bg-pulsar-pink text-white font-futura font-[800] text-[15px] uppercase tracking-widest px-12 py-4 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark disabled:opacity-60 disabled:hover:translate-y-0">
                    {status === 'loading' ? 'Sending…' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
