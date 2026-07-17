import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Seo, { JsonLd } from '../../components/Seo/Seo'
import { SITE_URL, SITE_NAME } from '../../lib/seo'
import WaveDivider from '../../components/WaveDivider/WaveDivider'
import iconLeaf from '../../assets/Leaf_icon.svg'
import iconShield from '../../assets/Sheild_Icon.svg'
import iconPill from '../../assets/icon-pill_Blue.svg'
import iconSimple1 from '../../assets/Stupid simple_1.svg'
import iconSimple2 from '../../assets/Stupid simple_2.svg'
import iconSmile from '../../assets/Smile_Icon_3.svg'
import './Product.css'

// Map URL param IDs to cart product IDs
const PRODUCT_MAP = {
  '1': 'single', '2': '3pack', '3': '6pack', '5': 'party',
  single: 'single', '3pack': '3pack', '6pack': '6pack', party: 'party',
}

const overviews = {
  single: "The Single Patch gives you one powerful dose of overnight hangover defense. Perfect for a night out, a wedding weekend, or a test run before you commit to more. Powered by NAC and Glutathione, it supports your body while you sleep so you wake up sharper and ready for what's next.",
  '3pack': "The 3 Patch Bundle is built for the weekender. Three patches for three nights out. A long weekend, a mini trip, or just a solid stretch of plans, you'll have one ready every time. Same formula, same easy application, just more of it.",
  '6pack': "The 6 Patch Combo is for the person who plans ahead. Six patches means you're covered for weeks of weekends without reordering. Our most popular bundle for a reason: reliable, simple, and always there when the group chat gets active.",
  party: "The Party Pack is 30 patches for the person who refuses to slow down. Stock up for the season, share with your crew, or lock in the best value per patch. You'll forget what a rough morning feels like.",
}

const faqsFor = (count) => ([
  { q: 'What exactly is Pulsar Patch?', a: 'A transdermal patch powered by NAC and Glutathione that supports your body while you sleep, so you wake up ready for tomorrow.' },
  { q: 'How many patches come in this pack?', a: `This pack includes ${count} patch${count > 1 ? 'es' : ''}.` },
  { q: 'How do I use it?', a: 'Peel the backing and apply to a clean, hairless area of skin before drinking.' },
  { q: 'When should I put it on?', a: 'For best results, apply 30 minutes before your first drink.' },
  { q: 'How long do I wear it?', a: 'Wear the patch 8 to 12 hours, usually overnight.' },
  { q: "Does it work after I've been drinking?", a: 'It works best applied before or during, but still gives support if you put it on later.' },
])

export default function Product() {
  const { id } = useParams()
  const { addToCart, getProduct } = useCart()
  const [activeTab, setActiveTab] = useState('overview')
  const [activeFaq, setActiveFaq] = useState(null)
  const [qty, setQty] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', title: '', text: '', stars: 0 })
  const [reviewHoverStar, setReviewHoverStar] = useState(0)
  const [reviewError, setReviewError] = useState('')
  const [reviewDone, setReviewDone] = useState(false)

  const cartId = PRODUCT_MAP[id]
  const product = cartId ? getProduct(cartId) : null

  /* ── Product not found ── */
  if (!product) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center px-5 py-24 text-center">
        <div className="max-w-[420px]">
          <h1 className="font-futura font-[900] text-[30px] text-pulsar-blue uppercase mb-3">Patch not found</h1>
          <p className="font-inter text-[16px] text-gray-600 mb-8">That product doesn't exist. Here's everything we've got.</p>
          <Link to="/shop" className="inline-block bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-wide px-8 py-4 rounded-full hover:bg-pulsar-pink-dark transition-colors">Shop all patches</Link>
        </div>
      </div>
    )
  }

  const patchCount = product.patches || 1
  const faqs = faqsFor(patchCount)

  // Canonicalize to the named slug so /product/1 and /product/single don't split.
  const canonicalSlug = cartId
  const productUrl = `${SITE_URL}/product/${canonicalSlug}`
  const productDesc = `${product.name}: a ${patchCount}-patch ${patchCount === 1 ? 'pack' : 'supply'} of Pulsar Patch, the transdermal hangover recovery patch powered by NAC and Glutathione. Peel, stick, and wake up ready.`
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Pulsar Patch — ${product.name}`,
    description: productDesc,
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: productUrl,
    offers: {
      '@type': 'Offer',
      price: (product.price ?? 0).toFixed(2),
      priceCurrency: product.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: productUrl,
    },
  }

  function submitReview(e) {
    e.preventDefault()
    if (!reviewForm.stars) { setReviewError('Please pick a star rating.'); return }
    if (!reviewForm.name.trim()) { setReviewError('Please add your name.'); return }
    if (!reviewForm.text.trim()) { setReviewError('Please write a few words.'); return }
    setReviewError('')
    setReviewDone(true)
    setReviewForm({ name: '', email: '', title: '', text: '', stars: 0 })
    setTimeout(() => { setReviewDone(false); setShowReviewForm(false) }, 2500)
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'nutrition', label: 'Nutrition Facts' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <div className="w-full bg-white flex flex-col pb-24 lg:pb-0" id="product-page">

      <Seo
        title={`Pulsar Patch — ${product.name}`}
        description={productDesc}
        path={`/product/${canonicalSlug}`}
        type="product"
      />
      <JsonLd data={productJsonLd} />

      {/* ═══ 1. PRODUCT DETAILS ═══ */}
      <section className="w-full pt-8 lg:pt-[60px] pb-10 bg-white px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-[80px]">

          {/* Gallery */}
          <div className="w-full lg:flex-[0_0_45%]">
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-4">
                <div className="w-full aspect-[4/5] bg-pulsar-light-blue-bg rounded-[24px] flex items-center justify-center">
                  <span className="font-futura font-[900] text-pulsar-blue/25 text-[18px]">{patchCount}× PATCH</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="w-full aspect-square bg-pulsar-light-blue-bg/60 rounded-[12px] cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-5 pt-2">
                <img src={iconLeaf} alt="Plant-based" className="w-[42px] h-[42px] object-contain" />
                <img src={iconPill} alt="No pills" className="w-[42px] h-[42px] object-contain" />
                <img src={iconShield} alt="Protective" className="w-[42px] h-[42px] object-contain" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:flex-1 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#DE64A5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <a href="#reviews" className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase ml-1 hover:text-pulsar-pink">6 Reviews</a>
            </div>

            <h1 className="font-futura font-[900] text-[clamp(2rem,6vw,2.75rem)] text-pulsar-blue uppercase tracking-wide mb-1 leading-none">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <p className="font-inter font-[700] text-[22px] text-pulsar-pink">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <>
                  <p className="font-inter text-[16px] text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
                  <span className="bg-pulsar-pink/10 text-pulsar-pink font-futura font-[800] text-[11px] uppercase px-2.5 py-1 rounded-full">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-5 border-b border-gray-200 w-full max-w-[500px]">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`font-futura font-[800] text-[11px] uppercase pb-2 -mb-px tracking-widest transition-colors border-b-2 ${activeTab === t.id ? 'text-pulsar-pink border-pulsar-pink' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="w-full max-w-[500px] min-h-[180px] mb-8">
              {activeTab === 'overview' && (
                <p className="font-inter text-[14px] leading-[1.7] text-gray-800 animate-fadeIn">{overviews[cartId]}</p>
              )}
              {activeTab === 'nutrition' && (
                <div className="w-full bg-[#44C8E8] rounded-2xl p-6 sm:p-7 animate-fadeIn">
                  <div className="max-w-[520px]">
                    <p className="font-inter text-white/80 text-[12px] mb-1">Serving size: 1 Patch · 0 Calories</p>
                    <h4 className="font-futura font-[800] text-white text-[14px] mb-3 uppercase border-b border-white/50 pb-2">
                      Active Ingredients <span className="font-[500] normal-case text-white/75 text-[12px]">per patch</span>
                    </h4>
                    <ul className="flex flex-col mb-4">
                      {[
                        ['Vitamin B1', '1.5 mg'],
                        ['Vitamin B3', '2 mg'],
                        ['Vitamin B9', '0.5 mg'],
                        ['Glutathione', '0.019 mg'],
                        ['NAC (N-acetylcysteine)', '0.009 mg'],
                        ['Ginger Extract', '3 mg'],
                      ].map(([name, amt]) => (
                        <li key={name} className="flex items-baseline justify-between gap-3 border-b border-white/20 py-1.5">
                          <span className="font-inter text-white text-[13px]">{name}</span>
                          <span className="font-futura font-bold text-white text-[13px] whitespace-nowrap">{amt}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-inter text-white/85 text-[12px] leading-[1.6]">
                      <strong className="font-[700]">Total actives:</strong> 7.03 mg per patch. Other: water-based acrylic adhesive on a clear polyethylene film.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'faq' && (
                <div className="flex flex-col w-full animate-fadeIn border-t border-gray-300">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-300 py-3 cursor-pointer group" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                      <div className="flex justify-between items-center">
                        <span className="font-inter text-[13px] text-gray-800 font-[500] pr-4">{faq.q}</span>
                        <span className="text-gray-400 text-[22px] leading-none transition-transform duration-300 group-hover:text-pulsar-pink" style={{ transform: activeFaq === index ? 'rotate(45deg)' : 'none' }}>+</span>
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <p className="font-inter text-[12px] text-gray-600 leading-[1.6]">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity + Add to cart (desktop inline) */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-full">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity" className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-pulsar-pink text-[20px]">−</button>
                <span className="w-8 text-center font-inter font-[600] text-[15px]" aria-live="polite">{qty}</span>
                <button onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Increase quantity" className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-pulsar-pink text-[20px]">+</button>
              </div>
              <button
                onClick={() => addToCart(cartId, qty)}
                className="bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest px-10 py-3.5 rounded-full shadow-lg transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
              >
                Add to cart · ${(product.price * qty).toFixed(2)}
              </button>
            </div>

            {/* Party Pack only: buy once vs subscribe & save */}
            {cartId === 'party' && (
              <div className="w-full max-w-[500px] mt-8">
                <p className="font-futura font-[800] text-[12px] text-pulsar-blue uppercase tracking-widest mb-3">Buy once or subscribe</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Option 1 — One-time */}
                  <div className="flex-1 rounded-2xl border-2 border-pulsar-pink bg-pulsar-pink/[0.04] p-4">
                    <span className="font-futura font-[800] text-[10px] text-gray-400 uppercase tracking-widest">Option 1</span>
                    <p className="font-futura font-[900] text-[13px] text-pulsar-dark uppercase tracking-wide mt-1">One-Time Purchase</p>
                    <p className="font-inter font-[700] text-[20px] text-pulsar-pink mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  {/* Option 2 — Subscribe & save */}
                  <div className="flex-1 rounded-2xl border-2 border-pulsar-blue bg-pulsar-light-blue-bg/40 p-4 relative">
                    <span className="absolute top-3 right-3 bg-pulsar-blue text-white font-futura font-[900] text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full">Save 15%</span>
                    <span className="font-futura font-[800] text-[10px] text-gray-400 uppercase tracking-widest">Option 2</span>
                    <p className="font-futura font-[900] text-[13px] text-pulsar-dark uppercase tracking-wide mt-1">Subscribe &amp; Save</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="font-inter font-[700] text-[20px] text-pulsar-blue">${(product.price * 0.85).toFixed(2)}</p>
                      <span className="font-inter text-[12px] text-gray-400 line-through">${product.price.toFixed(2)}</span>
                    </div>
                    <Link to="/subscription" className="inline-block font-futura font-[800] text-[10px] text-pulsar-blue uppercase tracking-widest mt-2 hover:text-pulsar-pink">See plans →</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 2. RECOVERY REIMAGINED ═══ */}
      <section className="bg-white py-12 lg:py-[60px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col items-start mb-8">
            <h2 className="font-futura font-[900] text-[clamp(1.75rem,5vw,2.25rem)] text-pulsar-blue uppercase tracking-wide leading-none mb-1">Hangover</h2>
            <span className="bg-pulsar-pink px-3 py-1 font-futura font-[900] text-[clamp(1.75rem,5vw,2.25rem)] text-white uppercase tracking-wide leading-none inline-block">Recovery reimagined</span>
          </div>
          <div className="font-inter text-[14px] leading-[1.8] text-gray-800 max-w-[800px]">
            <p className="mb-6">Pulsar Patch is a clear, discreet wearable designed to support your body while you enjoy your night.</p>
            <p className="mb-6">
              Details:<br />
              <span className="text-pulsar-pink">•</span> Size: 1.25" x 1.25"<br />
              <span className="text-pulsar-pink">•</span> Color: Clear patch blends with all skin tones<br />
              <span className="text-pulsar-pink">•</span> Material: Gentle, water-based adhesive<br />
              <span className="text-pulsar-pink">•</span> Ingredients: NAC and Glutathione, nothing extra
            </p>
            <p className="mb-6">Stick it on before the night begins, forget it's there, and let it work while you sleep. Wake up feeling clearer, steadier, and ready for the day ahead.</p>
            <p>No gimmicks. No hidden blends. Just a patch built to respect tomorrow, even when tonight gets fun.</p>
          </div>
        </div>
      </section>

      {/* ═══ 3. SIMPLE TO USE ═══ */}
      <section className="relative w-full bg-pulsar-blue flex flex-col pt-[40px] pb-16 lg:pb-[100px]" id="simple-to-use">
        <div className="absolute top-0 left-0 w-full z-10 pointer-events-none -mt-[1px]">
          <WaveDivider topColor="white" bottomColor="#44C8E8" height="h-[60px]" />
        </div>
        <div className="max-w-[1920px] mx-auto w-full px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-16 lg:pt-[80px] flex flex-col">
          <h2 className="font-futura font-[900] text-[clamp(1.75rem,5vw,2.25rem)] text-white uppercase tracking-wide mb-10 lg:mb-16 leading-[1.1]">It's stupid simple to use!</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
            {[
              { n: '1', img: iconSimple1, title: 'FIND A SPOT', body: 'Pick a clean area on your inner arm, upper arm, or shoulder.' },
              { n: '2', img: iconSimple2, title: 'PEEL & STICK', body: 'Remove the backing and firmly press the patch onto your skin.' },
              { n: '3', img: iconSmile, title: 'ENJOY', body: 'Enjoy your night. For best results keep it on at least 8 hours. Yes, while you sleep!' },
            ].map(step => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <h3 className="font-futura font-[900] text-[48px] text-white mb-4">{step.n}</h3>
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-5"><img src={step.img} alt="" className="w-full h-full object-contain" /></div>
                <h4 className="font-futura font-bold text-[18px] text-white uppercase mb-3 tracking-wide">{step.title}</h4>
                <p className="font-inter text-white/90 text-[13px] leading-[1.6] max-w-[220px]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. MARQUEE ═══ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3" aria-hidden="true">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-[900] text-white text-[20px] uppercase tracking-[3px] mx-10 flex items-center gap-10">Shop Now <span>→</span></span>
          ))}
        </div>
      </section>

      {/* ═══ 5. CUSTOMER REVIEWS ═══ */}
      <section className="w-full bg-white py-14 lg:py-[100px] px-5 sm:px-8 lg:px-16 xl:px-[140px]" id="reviews">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-[80px]">

          {/* Summary */}
          <div className="w-full lg:flex-[0_0_280px]">
            <h2 className="font-futura font-[900] text-[20px] text-pulsar-blue uppercase tracking-wide mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-[1px]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#DE64A5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase ml-1">4.9 · 6 Reviews</span>
            </div>
            <div className="flex flex-col gap-2.5 w-full mb-8 max-w-[280px]">
              {[{ n: 5, c: 6 }, { n: 4, c: 0 }, { n: 3, c: 0 }, { n: 2, c: 0 }, { n: 1, c: 0 }].map(row => (
                <div key={row.n} className={`flex items-center gap-3 ${row.c === 0 ? 'opacity-50' : ''}`}>
                  <span className="font-futura font-[800] text-[10px] text-pulsar-pink w-3">{row.n}</span>
                  <div className="flex-1 h-[4px] bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-pulsar-pink rounded-full" style={{ width: row.c ? '100%' : '0%' }} /></div>
                  <span className="font-futura font-[800] text-[10px] text-gray-500 w-2 text-right">{row.c}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowReviewForm(!showReviewForm); setReviewError('') }} className="bg-pulsar-blue text-white font-futura font-[800] text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pulsar-blue-dark">
              {showReviewForm ? 'Cancel' : 'Write a review'}
            </button>
          </div>

          {/* List + form */}
          <div className="w-full lg:flex-1 flex flex-col">
            <div className="flex flex-col items-start mb-10">
              <h2 className="font-futura font-[900] text-[clamp(1.75rem,5vw,2.5rem)] text-pulsar-blue uppercase tracking-wide leading-none mb-2">We're biased.</h2>
              <span className="bg-pulsar-pink px-4 py-1 font-futura font-[900] text-[clamp(1.75rem,5vw,2.5rem)] text-white uppercase tracking-wide leading-none inline-block">They're not.</span>
            </div>

            {/* Review form */}
            <div className={`overflow-hidden transition-all duration-500 ${showReviewForm ? 'max-h-[900px] opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>
              <div className="bg-pulsar-blue rounded-[24px] p-6 sm:p-8">
                {reviewDone ? (
                  <p className="font-futura font-bold text-[18px] text-white uppercase text-center py-6">Thanks! Your review is in.</p>
                ) : (
                  <form onSubmit={submitReview} className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
                      <h3 className="font-futura font-bold text-[18px] text-white uppercase tracking-wide">Your rating:</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button type="button" key={s} onMouseEnter={() => setReviewHoverStar(s)} onMouseLeave={() => setReviewHoverStar(0)} onClick={() => { setReviewForm({ ...reviewForm, stars: s }); setReviewError('') }} aria-label={`${s} stars`}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill={s <= (reviewHoverStar || reviewForm.stars) ? '#DE64A5' : 'rgba(255,255,255,0.3)'} className="cursor-pointer transition-colors"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input type="text" placeholder="Your name *" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white" />
                      <input type="email" placeholder="Email (optional)" value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white" />
                    </div>
                    <input type="text" placeholder="Review title" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white" />
                    <textarea placeholder="Write your review... *" rows={4} value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white resize-none" />
                    {reviewError && <p className="font-inter text-[13px] text-white bg-pulsar-pink/80 rounded-lg px-3 py-2" role="alert">{reviewError}</p>}
                    <button type="submit" className="self-start bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-3.5 rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">Submit review</button>
                  </form>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="flex flex-col gap-10">
              {[
                { name: 'GABRIELLA', date: '4 months ago', title: 'It really works!', text: "I've tried multiple patches and never really understood the whole hangover thing from just a patch. But as soon as I tried Pulsar, I kid you not, I felt completely normal the next day. I've already recommended it to several friends and they all love it." },
                { name: 'CHRIS M.', date: '1 year ago', title: 'Somehow it works', text: "Slapped it on right before we started drinking and woke up feeling good the next day, no headache. I usually wake up with a massive headache and this time I didn't. It's unnoticeable and you forget it's even on. Highly recommend." },
                { name: 'ADAM', date: '1 year ago', title: 'Love it', text: 'Love it! Easy to use and very effective.' },
              ].map((r, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-10 border-b border-gray-100 pb-10">
                  <div className="sm:flex-[0_0_150px] flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                    <span className="font-futura font-[800] text-[13px] text-pulsar-pink uppercase tracking-wide sm:mb-1">{r.name}</span>
                    <span className="font-inter font-[600] text-[11px] text-gray-400 uppercase tracking-wide sm:mb-3">{r.date}</span>
                    <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase hidden sm:block">Verified Buyer</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#DE64A5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      ))}
                    </div>
                    <h4 className="font-futura font-[800] text-[14px] text-pulsar-blue uppercase tracking-wide mb-2">{r.title}</h4>
                    <p className="font-inter font-[500] text-[14px] text-gray-600 leading-[1.6]">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full flex justify-center mt-10">
              <Link to="/reviews" className="bg-pulsar-pink text-white font-futura font-[800] text-[12px] uppercase tracking-widest px-10 py-3 rounded-full shadow-md transition-transform hover:-translate-y-0.5 hover:bg-pulsar-pink-dark">See all reviews</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Sticky mobile add-to-cart ═══ */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 z-[900] flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-full shrink-0">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity" className="w-9 h-10 flex items-center justify-center text-gray-500 text-[18px]">−</button>
          <span className="w-6 text-center font-inter font-[600] text-[14px]">{qty}</span>
          <button onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Increase quantity" className="w-9 h-10 flex items-center justify-center text-gray-500 text-[18px]">+</button>
        </div>
        <button onClick={() => addToCart(cartId, qty)} className="flex-1 bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-wide py-3.5 rounded-full shadow-md active:scale-[0.98] transition-transform">
          Add · ${(product.price * qty).toFixed(2)}
        </button>
      </div>
    </div>
  )
}
