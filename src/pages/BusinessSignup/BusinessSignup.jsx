import { useState } from 'react'
import { Link } from 'react-router-dom'

const establishmentTypes = [
  'DIVE BAR', 'COCKTAIL BAR', 'BREWERY / TAP HOUSE', 'RESTAURANT',
  'WINERY', 'LIQUOR STORE', 'CORNER STORE', 'RETAIL STORE', 'HOTEL / RESORT', 'OTHER'
]

const customerBaseOptions = [
  'CASUAL', 'UPSCALE', 'WELLNESS FOCUSED', 'NIGHT LIFE DRIVEN', 'OTHER'
]

const heardAboutOptions = [
  'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'TALKED TO A PULSAR TEAM MEMBER', 'WORD OF MOUTH', 'OTHER'
]

export default function BusinessSignup() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    websiteUrl: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    establishmentTypes: [],
    city: '',
    state: '',
    customerBase: [],
    heardAbout: [],
    finalNotes: '',
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
        : [...prev[field], value]
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    window.scrollTo(0, 0)
  }

  if (submitted) {
    return (
      <div className="w-full bg-white flex flex-col" id="business-signup-thanks">
        {/* Hero */}
        <section className="relative w-full h-[50vh] bg-[#555555] overflow-hidden flex items-center">
          <div className="relative z-10 max-w-[1920px] mx-auto px-[140px]">
            <h1 className="font-futura font-bold text-[54px] text-white uppercase tracking-wide leading-[1.1]">
              THANK YOU<br />FOR SUBMITTING<br />YOUR APPLICATION!
            </h1>
          </div>
        </section>

        {/* Message */}
        <section className="bg-white py-[80px]">
          <div className="max-w-[1920px] mx-auto px-[140px]">
            <div className="max-w-[700px]">
              <p className="font-inter text-[16px] leading-[1.8] text-gray-700 mb-6">
                Thank you for submitting your application to join Pulsar Patch's Wholesale family. We will reach out to you once we have received and reviewed it. Watch your email and check your junk mail just in case.
              </p>
              <p className="font-inter text-[16px] leading-[1.8] text-gray-700 mb-10">
                We hope to talk to you soon!
              </p>
              <Link to="/" className="inline-flex items-center bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">
                BACK TO PULSAR HOME
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="w-full bg-white flex flex-col" id="business-signup-page">

      {/* Hero */}
      <section className="relative w-full h-[50vh] bg-[#555555] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="max-w-[700px]">

            <h2 className="font-futura font-bold text-[28px] text-pulsar-dark uppercase tracking-wide mb-4">
              LET'S GET TO KNOW YOUR BUSINESS!
            </h2>
            <p className="font-inter text-[15px] leading-[1.7] text-gray-600 mb-4">
              We're excited you're interested in carrying Pulsar Patch. This short questionnaire helps us understand your business, your customers, and how Pulsar can best support your space.
            </p>
            <p className="font-inter text-[15px] leading-[1.7] text-gray-600 mb-10">
              There are no trick questions, no tests, and no judgment... just the basics so we can make sure we're a good fit for each other. What up!
            </p>

            <form onSubmit={handleSubmit}>

              {/* SECTION 1 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-8">
                SECTION 1- BUSINESS BASICS
              </h3>

              <div className="flex flex-col gap-6 mb-10">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Business name *</label>
                  <input type="text" name="businessName" required value={form.businessName} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                </div>

                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Contact name *</label>
                  <input type="text" name="contactName" required value={form.contactName} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                </div>

                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Email address *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                </div>

                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Phone number *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                </div>

                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Business website or social media <span className="text-pulsar-pink">(Optional)</span></label>
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">Website URL</span>
                      <input type="url" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                    </div>
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">Instagram *</span>
                      <div className="flex items-center gap-2">
                        <div className="w-[36px] h-[36px] bg-pulsar-pink rounded-[8px] flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="white"/></svg>
                        </div>
                        <input type="text" name="instagram" value={form.instagram} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                      </div>
                    </div>
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">Tiktok *</span>
                      <div className="flex items-center gap-2">
                        <div className="w-[36px] h-[36px] bg-pulsar-pink rounded-[8px] flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.18a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.61z"/></svg>
                        </div>
                        <input type="text" name="tiktok" value={form.tiktok} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                      </div>
                    </div>
                    <div>
                      <span className="font-inter text-[12px] text-gray-500 block mb-1">Facebook <span className="text-pulsar-pink">(Optional)</span></span>
                      <div className="flex items-center gap-2">
                        <div className="w-[36px] h-[36px] bg-pulsar-pink rounded-[8px] flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                        </div>
                        <input type="text" name="facebook" value={form.facebook} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[2px] bg-gray-200 mb-10"></div>

              {/* SECTION 2 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-6">
                SECTION 2- YOUR SPACE
              </h3>

              <div className="mb-8">
                <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-1">
                  The type of establishment <span className="text-pulsar-pink">(select all that apply)</span>
                </label>
                <div className="flex flex-col gap-2 mt-3">
                  {establishmentTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.establishmentTypes.includes(type)}
                        onChange={() => toggleCheckbox('establishmentTypes', type)}
                        className="w-4 h-4 accent-pulsar-pink cursor-pointer"
                      />
                      <span className="font-inter font-[600] text-[13px] text-pulsar-dark uppercase">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6 mb-8">
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                </div>
                <div>
                  <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">State</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
                </div>
              </div>

              <div className="mb-10">
                <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-1">
                  How would you describe your customer base? <span className="text-pulsar-pink">(select all that apply)</span>
                </label>
                <div className="flex flex-col gap-2 mt-3">
                  {customerBaseOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.customerBase.includes(opt)}
                        onChange={() => toggleCheckbox('customerBase', opt)}
                        className="w-4 h-4 accent-pulsar-pink cursor-pointer"
                      />
                      <span className="font-inter font-[600] text-[13px] text-pulsar-dark uppercase">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
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
                  {heardAboutOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.heardAbout.includes(opt)}
                        onChange={() => toggleCheckbox('heardAbout', opt)}
                        className="w-4 h-4 accent-pulsar-pink cursor-pointer"
                      />
                      <span className="font-inter font-[600] text-[13px] text-pulsar-dark uppercase">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[2px] bg-gray-200 mb-10"></div>

              {/* SECTION 4 */}
              <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase tracking-wide mb-1">
                SECTION 4- FINAL NOTES <span className="font-inter font-[400] text-[14px] text-gray-400 normal-case tracking-normal">(Optional)</span>
              </h3>

              <div className="mb-10 mt-6">
                <label className="font-inter font-[600] text-[13px] text-pulsar-dark block mb-2">Anything else we should know about your business?</label>
                <input type="text" name="finalNotes" value={form.finalNotes} onChange={handleChange} className="w-full bg-gray-100 rounded-[8px] px-4 py-3 font-inter text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-pulsar-blue/30 transition-all" />
              </div>

              {/* Opt-ins */}
              <div className="flex flex-col gap-4 mb-10">
                <label className="flex items-start gap-3 cursor-pointer bg-pulsar-pink/5 border border-pulsar-pink/20 rounded-[12px] p-5">
                  <input
                    type="checkbox"
                    checked={form.marketingOptIn}
                    onChange={() => setForm({ ...form, marketingOptIn: !form.marketingOptIn })}
                    className="w-5 h-5 accent-pulsar-pink cursor-pointer mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="font-inter font-[700] text-[13px] text-pulsar-pink uppercase block mb-1">RECEIVE MARKETING COMMUNICATION AND UPDATES</span>
                    <span className="font-inter text-[11px] text-gray-500 leading-[1.5] block">
                      Check this box to receive important news and notifications from the Pulsar Patch Team, including program updates, campaign opportunities, product launches, and other resources to help you succeed as a Pulsar affiliate. This can be unsubscribed at any time by emailing hello@pulsarpatch.com. Consent is not a condition of purchase or participation. Messages and data rates may apply. Message frequency varies. Reply HELP for help or STOP to cancel at any time. By submitting, you agree to the Terms of Service and Privacy Policy provided by Pulsar Patch.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer bg-pulsar-pink/5 border border-pulsar-pink/20 rounded-[12px] p-5">
                  <input
                    type="checkbox"
                    checked={form.privacyAgreed}
                    onChange={() => setForm({ ...form, privacyAgreed: !form.privacyAgreed })}
                    className="w-5 h-5 accent-pulsar-pink cursor-pointer mt-0.5 shrink-0"
                    required
                  />
                  <div>
                    <span className="font-inter font-[700] text-[13px] text-pulsar-pink uppercase block">BY SUBMITTING THIS FORM I AGREE TO PULSAR PATCH HANDLING MY PERSONAL INFORMATION IN LINE WITH ITS PRIVACY POLICY AND TERMS OF USE.</span>
                  </div>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-pulsar-pink text-white font-futura font-bold text-[16px] uppercase tracking-widest py-5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark"
              >
                SUBMIT
              </button>

            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
