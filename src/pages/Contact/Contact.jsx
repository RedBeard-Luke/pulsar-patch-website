import { useState } from 'react'
import { Link } from 'react-router-dom'
import squigleBg from '../../assets/Squigle_What is Pulsar.svg'

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    orderNumber: '',
    message: '',
  })
  const [file, setFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const mailtoBody = `Name: ${form.firstName} ${form.lastName}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AOrder Number: ${form.orderNumber}%0A%0AMessage:%0A${form.message}`
    window.location.href = `mailto:Hello@pulsarpatch.com?subject=Contact Form Submission&body=${mailtoBody}`
    setSubmitted(true)
  }

  return (
    <div className="w-full bg-white flex flex-col" id="contact-page">

      {/* ═══════════════════════════════════════════════════════════
         1. HERO — Blue with squiggle pattern
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-pulsar-blue pb-[140px] overflow-hidden">
        {/* Squiggle background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: `url('${squigleBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[140px] pb-[40px]">
          <h1 className="font-futura font-[900] text-[42px] text-white uppercase tracking-wide mb-12">
            HOW CAN WE HELP?
          </h1>

          {/* Action Buttons */}
          <div className="flex gap-6">
            <Link to="/faq" className="flex-1 bg-pulsar-pink text-white rounded-[20px] py-5 px-8 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark group">
              <div>
                <span className="font-futura font-[900] text-[22px] uppercase tracking-wide block">FAQs</span>
                <span className="font-inter text-[10px] text-white/80 uppercase tracking-wide">VIEW ALL MOST ASKED QUESTIONS</span>
              </div>
              <span className="text-[24px] transition-transform duration-150 group-hover:translate-x-1">&rarr;</span>
            </Link>

            <Link to="/contact" className="flex-1 bg-pulsar-pink text-white rounded-[20px] py-5 px-8 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark group">
              <div>
                <span className="font-futura font-[900] text-[22px] uppercase tracking-wide block">ASK US ANYTHING</span>
                <span className="font-inter text-[10px] text-white/80 uppercase tracking-wide">WE'RE HERE IF YOU NEED SUPPORT</span>
              </div>
              <span className="text-[24px] transition-transform duration-150 group-hover:translate-x-1">&rarr;</span>
            </Link>

            <Link to="/store-locator" className="flex-1 bg-pulsar-pink text-white rounded-[20px] py-5 px-8 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark group">
              <div>
                <span className="font-futura font-[900] text-[22px] uppercase tracking-wide block">STORE LOCATOR</span>
                <span className="font-inter text-[10px] text-white/80 uppercase tracking-wide">FIND WHERE YOU CAN BUY PULSAR PATCH</span>
              </div>
              <span className="text-[24px] transition-transform duration-150 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* White wave at bottom — inside blue section to avoid gap */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. CONTACT FORM
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]">
        <div className="max-w-[1920px] mx-auto px-[140px] flex items-start gap-[60px]">
          {/* Left: Title */}
          <div className="flex-shrink-0 pt-2">
            <h2 className="font-futura font-[900] text-[36px] text-pulsar-blue uppercase tracking-wide">
              CONTACT US
            </h2>
          </div>

          {/* Right: Form */}
          <div className="flex-1">
          {submitted ? (
            <div className="text-center py-20">
              <h3 className="font-futura font-[900] text-[28px] text-pulsar-blue uppercase mb-4">THANK YOU!</h3>
              <p className="font-inter text-[16px] text-gray-600">Your message is being prepared. Complete sending it in your email client.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-[900px]">
              {/* Name row */}
              <div className="flex gap-8 mb-6">
                <div className="flex-1">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">
                    Name <span className="text-pulsar-pink">*</span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Email + Phone row */}
              <div className="flex gap-8 mb-6">
                <div className="flex-1">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">
                    Email <span className="text-pulsar-pink">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@youremail.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}
                  />
                </div>
                <div className="flex-1">
                  <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">
                    Phone <span className="text-pulsar-pink">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(xxx) xxx-xxxx"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}
                  />
                </div>
              </div>

              {/* Order Number */}
              <div className="mb-6">
                <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">
                  Order Number
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  placeholder="#XXXXXX"
                  value={form.orderNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}
                />
              </div>

              {/* Message — dashed blue border */}
              <div className="mb-6 border-t-2 border-dashed border-pulsar-blue/30 pt-6">
                <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">
                  Message <span className="text-pulsar-pink">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border-2 border-pulsar-blue/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:border-pulsar-blue transition-colors resize-none" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <label className="font-futura font-[700] text-[13px] text-pulsar-dark uppercase tracking-wide mb-2 block">
                  Image Upload
                </label>
                <div className="border border-gray-300 rounded-[8px] px-4 py-6 flex items-center justify-center min-h-[120px]" style={{ backgroundColor: 'rgba(68, 200, 232, 0.05)' }}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="font-inter text-[14px] text-gray-600"
                  />
                </div>
                <p className="font-inter text-[12px] text-gray-400 mt-2">(Please only provide: JPG, PDF & PNG)</p>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-pulsar-pink text-white font-futura font-[800] text-[15px] uppercase tracking-widest px-12 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark"
                >
                  SUBMIT
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
