import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart, PRODUCTS as CATALOG } from '../../context/CartContext'
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
  '1': 'single',
  '2': '3pack',
  '3': '6pack',
  '4': 'kickback',
  '5': 'party',
  'single': 'single',
}

export default function Product() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('overview')
  const [activeFaq, setActiveFaq] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', title: '', text: '', stars: 0, didItWork: 10, recommend: 10 })
  const [reviewHoverStar, setReviewHoverStar] = useState(0)
  const cartId = PRODUCT_MAP[id] || 'single'
  const catalogProduct = CATALOG.find(p => p.id === cartId)

  const tabStyles = {
    overview: { left: '0px', width: '65px' },
    nutrition: { left: '97px', width: '110px' },
    faq: { left: '239px', width: '25px' }
  }

  /* ── Per-product descriptions ── */
  const overviews = {
    single: "The Single Patch gives you one powerful dose of overnight hangover defense, perfect for a night out, a wedding weekend, or a test run before you commit to more. Powered by NAC and Glutathione, it supports your body while you sleep so you wake up feeling sharper, clearer, and ready for whatever's next. Stick it before the fun starts, and let tomorrow thank you later.",
    '3pack': "The 3 Patch Bundle is built for the weekender. Three patches for three nights out. Whether it's a long weekend, a mini trip, or just a solid stretch of plans, you'll have one ready every time. Same powerful formula, same easy application, just more of it when you need it.",
    '6pack': "The 6 Patch Combo is for the person who plans ahead. Six patches means you're covered for weeks of weekends without reordering. It's our most popular bundle for a reason: reliable, simple, and always there when the group chat gets active.",
    kickback: "The Kick Back Pack comes with 10 patches, enough to keep you covered for over two months of weekend nights. Perfect for the person who likes to stay ready without thinking about it. Stock your nightstand, your travel bag, or split them with a friend.",
    party: "The Party Pack is the ultimate Pulsar experience: 30 patches for the person who refuses to slow down. Whether you're stocking up for the season, sharing with your crew, or just locking in the best value, this is the pack that keeps on giving. You'll forget what a rough morning feels like.",
  }

  const patchCounts = {
    single: 1,
    '3pack': 3,
    '6pack': 6,
    kickback: 10,
    party: 30,
  }

  const patchCount = patchCounts[cartId] || 1

  const faqs = [
    { q: "What exactly is Pulsar Patch?", a: "A transdermal patch powered by NAC + Glutathione that supports your body while you sleep, so you wake up ready for tomorrow." },
    { q: "How many patches come in this pack?", a: `This pack includes ${patchCount} patch${patchCount > 1 ? 'es' : ''}.` },
    { q: "How do I use it?", a: "Peel the backing and apply to a clean, hairless area of skin before drinking." },
    { q: "When should I put it on?", a: "For best results, apply 30 minutes before consuming alcohol." },
    { q: "How long do I wear it?", a: "Wear the patch for up to 8-12 hours, typically overnight." },
    { q: "Does it work after I've already been drinking?", a: "It is most effective when applied before or during, but can still provide support if applied later." }
  ]

  return (
    <div className="w-full bg-white flex flex-col" id="product-page">

      {/* ═══════════════════════════════════════════════════════════
         1. PRODUCT DETAILS (TOP)
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full pt-[60px] pb-[40px] bg-white">
        <div className="max-w-[1920px] mx-auto px-[140px] flex gap-[80px]">
          
          {/* Left: Gallery */}
          <div className="flex-[0_0_45%] flex gap-4">
            <div className="flex-1 flex flex-col gap-4">
              {/* Main Image */}
              <div className="w-full aspect-[4/5] bg-[#757575] rounded-[24px] overflow-hidden flex items-center justify-center"></div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="w-full aspect-square bg-[#A3A3A3] rounded-[12px] cursor-pointer hover:opacity-80 transition-opacity"></div>
                ))}
              </div>
            </div>
            {/* Side Icons */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="w-[48px] h-[48px] flex items-center justify-center">
                <img src={iconLeaf} alt="Leaf" className="w-full h-full object-contain" />
              </div>
              <div className="w-[48px] h-[48px] flex items-center justify-center">
                <img src={iconPill} alt="Pill" className="w-full h-full object-contain" />
              </div>
              <div className="w-[48px] h-[48px] flex items-center justify-center">
                <img src={iconShield} alt="Shield" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 flex flex-col items-start pt-10">
            {/* Stars & Review count */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#DE64A5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase ml-1">6 REVIEWS</span>
            </div>

            <h1 className="font-futura font-[900] text-[42px] text-pulsar-blue uppercase tracking-wide mb-1 leading-none">
              {catalogProduct ? catalogProduct.name.toUpperCase() : 'SINGLE PATCH'}
            </h1>

            <p className="font-inter font-[700] text-[20px] text-pulsar-pink mb-8">
              ${catalogProduct ? catalogProduct.price.toFixed(2) : '6.00'}
            </p>

            {/* Tabs */}
            <div className="relative flex items-center gap-8 mb-6 border-b border-gray-200 w-full max-w-[500px]">
              <span 
                onClick={() => setActiveTab('overview')}
                className={`font-futura font-[800] text-[11px] uppercase pb-2 tracking-widest cursor-pointer transition-colors z-10 ${activeTab === 'overview' ? 'text-pulsar-pink' : 'text-gray-400 hover:text-gray-600'}`}
              >
                OVERVIEW
              </span>
              <span 
                onClick={() => setActiveTab('nutrition')}
                className={`font-futura font-[800] text-[11px] uppercase pb-2 tracking-widest cursor-pointer transition-colors z-10 ${activeTab === 'nutrition' ? 'text-pulsar-pink' : 'text-gray-400 hover:text-gray-600'}`}
              >
                NUTRITION FACTS
              </span>
              <span 
                onClick={() => setActiveTab('faq')}
                className={`font-futura font-[800] text-[11px] uppercase pb-2 tracking-widest cursor-pointer transition-colors z-10 ${activeTab === 'faq' ? 'text-pulsar-pink' : 'text-gray-400 hover:text-gray-600'}`}
              >
                FAQ
              </span>

              {/* Animated Underline */}
              <div 
                className="absolute bottom-[-1px] h-[3px] bg-pulsar-pink transition-all duration-300 ease-in-out" 
                style={tabStyles[activeTab]}
              ></div>
            </div>

            {/* Tab Content */}
            <div className="w-full max-w-[500px] min-h-[220px] mb-8">
              
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="flex flex-col font-inter text-[14px] leading-[1.6] text-gray-800 animate-fadeIn">
                  <p>{overviews[cartId] || overviews.single}</p>
                </div>
              )}

              {/* NUTRITION FACTS */}
              {activeTab === 'nutrition' && (
                <div className="w-full bg-[#44C8E8] rounded-2xl p-6 flex gap-6 animate-fadeIn shadow-inner">
                  {/* Label */}
                  <div className="bg-white rounded-[10px] p-4 flex-[0_0_220px]">
                    <h4 className="font-futura font-[900] text-black text-[16px] mb-1 leading-none text-center border-b-[6px] border-black pb-1">NUTRITION FACTS</h4>
                    <p className="font-inter text-[10px] flex justify-between pt-1"><span>1 serving per container</span></p>
                    <p className="font-inter text-[12px] font-bold flex justify-between border-b-[4px] border-black pb-1 mb-1"><span>Serving size</span> <span>1 Patch</span></p>
                    <p className="font-inter text-[10px] font-bold flex justify-between"><span>Amount per serving</span></p>
                    <p className="font-inter font-[900] text-[20px] flex justify-between leading-none border-b-[3px] border-black pb-1 mb-1"><span>Calories</span> <span>0</span></p>
                    <p className="font-inter text-[8px] text-right font-bold border-b border-black pb-0.5 mb-1">% Daily Value*</p>
                    <p className="font-inter text-[10px] flex justify-between border-b border-black pb-0.5 mb-1"><span><strong>Total Fat</strong> 0g</span> <span><strong>0%</strong></span></p>
                    <p className="font-inter text-[10px] flex justify-between border-b border-black pb-0.5 mb-1"><span><strong>Sodium</strong> 0mg</span> <span><strong>0%</strong></span></p>
                    <p className="font-inter text-[10px] flex justify-between border-b border-black pb-0.5 mb-1"><span><strong>Total Carbohydrate</strong> 0g</span> <span><strong>0%</strong></span></p>
                    <p className="font-inter text-[10px] flex justify-between border-b-[4px] border-black pb-0.5 mb-1"><span><strong>Protein</strong> 0g</span> <span><strong>0%</strong></span></p>
                    <p className="font-inter text-[8px] leading-[1.3]">
                      * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet.
                    </p>
                  </div>
                  
                  {/* Ingredients */}
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-futura font-[800] text-white text-[14px] mb-2 uppercase border-b border-white/50 pb-2 inline-block w-[80%]">INGREDIENTS</h4>
                    <p className="font-inter font-[500] text-white text-[13px] leading-[1.6]">
                      Glutathione,<br/>
                      N-acetylcysteine,<br/>
                      Water-based<br/>
                      adhesive
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {activeTab === 'faq' && (
                <div className="flex flex-col w-full animate-fadeIn border-t border-gray-400">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-400 py-3 cursor-pointer group" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                      <div className="flex justify-between items-center">
                        <span className="font-inter text-[13px] text-gray-800 font-[500] pr-4">{faq.q}</span>
                        <span className="text-gray-400 font-light text-[22px] leading-none transition-transform duration-300 group-hover:text-pulsar-pink" style={{ transform: activeFaq === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <p className="font-inter text-[12px] text-gray-600 leading-[1.6]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={() => addToCart(cartId)}
                className="bg-pulsar-pink text-white font-futura font-[800] text-[14px] uppercase tracking-widest px-10 py-3 rounded-full shadow-lg transition-transform hover:bg-[#c9548f] hover:-translate-y-1"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. HANGOVER RECOVERY REIMAGINED
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="flex flex-col items-start mb-10">
            <h2 className="font-futura font-[900] text-[36px] text-pulsar-blue uppercase tracking-wide leading-none mb-1">
              HANGOVER
            </h2>
            <div className="bg-pulsar-pink px-3 py-1">
              <h2 className="font-futura font-[900] text-[36px] text-white uppercase tracking-wide leading-none">
                RECOVERY REIMAGINED
              </h2>
            </div>
          </div>
          <div className="font-inter text-[14px] leading-[1.8] text-gray-800 max-w-[800px]">
            <p className="mb-6">
              Pulsar Patch is a clear, discreet wearable designed to support your body while you enjoy your night.
            </p>
            <p className="mb-6">
              Details:<br />
              <span className="text-pulsar-pink">•</span> Size: 1.25" x 1.25"<br />
              <span className="text-pulsar-pink">•</span> Color: Clear patch blends with all skin tones<br />
              <span className="text-pulsar-pink">•</span> Material: Gentle, water-based adhesive<br />
              <span className="text-pulsar-pink">•</span> Ingredients: NAC + Glutathione, nothing extra
            </p>
            <p className="mb-6">
              Stick it on before the night begins, forget it's there, and let it work while you sleep.<br />
              Wake up feeling clearer, steadier, and ready for the day ahead.
            </p>
            <p>
              No gimmicks. No hidden blends. Just a patch built to respect tomorrow, even when tonight gets fun.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. SIMPLE TO USE
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-pulsar-blue flex flex-col pt-[40px] pb-[100px]" id="simple-to-use">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 w-full z-10 pointer-events-none -mt-[1px]">
          <WaveDivider topColor="white" bottomColor="#44C8E8" height="h-[80px]" />
        </div>

        <div className="max-w-[1920px] mx-auto w-full px-[140px] pt-[80px] flex flex-col">
          <h2 className="font-futura font-[900] text-[36px] text-white uppercase tracking-wide mb-16 text-left max-w-[500px] leading-[1.1]">
            IT'S STUPID<br/>SIMPLE TO USE!
          </h2>

          <div className="grid grid-cols-3 gap-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-futura font-[900] text-[48px] text-white mb-6">1</h3>
              <div className="w-[140px] h-[140px] flex items-center justify-center mb-6">
                <img src={iconSimple1} alt="Find a spot" className="w-full h-full object-contain" />
              </div>
              <h4 className="font-futura font-bold text-[18px] text-white uppercase mb-4 tracking-wide">FIND A SPOT</h4>
              <p className="font-inter text-white/90 text-[13px] leading-[1.6] max-w-[200px]">
                Pick a clean area on your inner arm, upper arm, or shoulder.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-futura font-[900] text-[48px] text-white mb-6">2</h3>
              <div className="w-[140px] h-[140px] flex items-center justify-center mb-6">
                <img src={iconSimple2} alt="Peel and stick" className="w-full h-full object-contain" />
              </div>
              <h4 className="font-futura font-bold text-[18px] text-white uppercase mb-4 tracking-wide">PEAL &amp; STICK</h4>
              <p className="font-inter text-white/90 text-[13px] leading-[1.6] max-w-[200px]">
                Remove the backing &amp; firmly press the patch onto your skin.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-futura font-[900] text-[48px] text-white mb-6">3</h3>
              <div className="w-[140px] h-[140px] flex items-center justify-center mb-6">
                <img src={iconSmile} alt="Enjoy" className="w-full h-full object-contain" />
              </div>
              <h4 className="font-futura font-bold text-[18px] text-white uppercase mb-4 tracking-wide">ENJOY</h4>
              <p className="font-inter text-white/90 text-[13px] leading-[1.6] max-w-[200px]">
                Enjoy your night. For best results, keep the patch on for at least 8 hours. (Yes while you sleep!)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         4. MARQUEE
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-[900] text-white text-[20px] uppercase tracking-[3px] mx-10 flex items-center gap-10">
              SHOP NOW <span>→</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         5. CUSTOMER REVIEWS
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-[100px] pb-[160px]" id="reviews">
        <div className="max-w-[1920px] mx-auto px-[140px] flex gap-[120px]">
          
          {/* Left Column: Summary */}
          <div className="flex-[0_0_300px] flex flex-col items-start">
            <h2 className="font-futura font-[900] text-[22px] text-pulsar-blue uppercase tracking-wide mb-8">
              CUSTOMER REVIEWS
            </h2>
            
            {/* Overall Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-[1px]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#DE64A5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase ml-1">6 REVIEWS</span>
            </div>
            
            {/* Rating Bars */}
            <div className="flex flex-col gap-2.5 w-full mb-8">
              {/* 5 Star */}
              <div className="flex items-center gap-3 w-full">
                <span className="font-futura font-[800] text-[10px] text-pulsar-pink w-3">5</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#DE64A5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div className="flex-1 h-[4px] bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[100%] h-full bg-pulsar-pink rounded-full"></div>
                </div>
                <span className="font-futura font-[800] text-[10px] text-gray-500 w-2 text-right">6</span>
              </div>
              {/* 4 to 1 Star */}
              {[4,3,2,1].map(num => (
                <div key={num} className="flex items-center gap-3 w-full opacity-50">
                  <span className="font-futura font-[800] text-[10px] text-pulsar-pink w-3">{num}</span>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#DE64A5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <div className="flex-1 h-[4px] bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[0%] h-full bg-pulsar-pink rounded-full"></div>
                  </div>
                  <span className="font-futura font-[800] text-[10px] text-gray-500 w-2 text-right">0</span>
                </div>
              ))}
            </div>
            
            {/* Write a Review Button */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-pulsar-blue text-white font-futura font-[800] text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-full shadow-sm flex items-center gap-3 transition-transform hover:-translate-y-1 hover:bg-pulsar-blue-dark"
            >
              {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
            </button>
          </div>

          {/* Right Column: Reviews List */}
          <div className="flex-1 flex flex-col pt-2">
            {/* Header */}
            <div className="flex flex-col items-start mb-16">
              <h2 className="font-futura font-[900] text-[42px] text-pulsar-blue uppercase tracking-wide leading-none mb-2">
                WE'RE BIASED.
              </h2>
              <div className="bg-pulsar-pink px-4 py-1 mb-8">
                <h2 className="font-futura font-[900] text-[42px] text-white uppercase tracking-wide leading-none">
                  THEY'RE NOT.
                </h2>
              </div>
            </div>

            {/* Write a Review Form (collapsible) — matches Reviews page */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showReviewForm ? 'max-h-[800px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
              <div className="bg-pulsar-blue rounded-[24px] p-8">
                <form onSubmit={(e) => { e.preventDefault(); setShowReviewForm(false); setReviewForm({ name: '', email: '', title: '', text: '', stars: 0, didItWork: 10, recommend: 10 }) }} className="flex flex-col gap-5">
                  {/* Title + Stars */}
                  <div className="flex items-center gap-8">
                    <h3 className="font-futura font-bold text-[22px] text-white uppercase tracking-wide shrink-0">Pulsar Patch Review:</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s} width="24" height="24" viewBox="0 0 24 24"
                          fill={s <= (reviewHoverStar || reviewForm.stars) ? '#DE64A5' : 'rgba(255,255,255,0.3)'}
                          className="cursor-pointer transition-colors"
                          onMouseEnter={() => setReviewHoverStar(s)}
                          onMouseLeave={() => setReviewHoverStar(0)}
                          onClick={() => setReviewForm({ ...reviewForm, stars: s })}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="flex gap-6">
                    <input type="text" placeholder="Your Name *" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors" />
                    <input type="email" placeholder="Email (optional)" value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors" />
                  </div>

                  {/* Title */}
                  <input type="text" placeholder="Review Title" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors" />

                  {/* Profile Picture */}
                  <input type="text" placeholder="Profile Picture (optional URL)" className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors" />

                  {/* Review text */}
                  <textarea placeholder="Write your review here... *" required rows={4} value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors resize-none"></textarea>

                  {/* Bottom row: photo + sliders + submit */}
                  <div className="flex gap-8 items-end">
                    {/* Add photo */}
                    <div className="flex flex-col gap-2">
                      <span className="font-futura font-bold text-[12px] text-white/70 uppercase tracking-wide">Add Photo or Video</span>
                      <label className="w-[80px] h-[80px] border-2 border-dashed border-white/40 rounded-[12px] flex items-center justify-center cursor-pointer hover:border-white transition-colors">
                        <span className="text-white/50 text-[28px]">+</span>
                        <input type="file" accept="image/*,video/*" className="hidden" />
                      </label>
                    </div>

                    {/* Sliders */}
                    <div className="flex-1 flex gap-8">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex justify-between">
                          <span className="font-futura font-bold text-[12px] text-white/70 uppercase tracking-wide">Did The Patch Work for You?</span>
                          <span className="font-futura font-bold text-[14px] text-white">{reviewForm.didItWork}/10</span>
                        </div>
                        <input type="range" min="1" max="10" value={reviewForm.didItWork} onChange={(e) => setReviewForm({ ...reviewForm, didItWork: Number(e.target.value) })} className="w-full h-[6px] rounded-full appearance-none cursor-pointer accent-pulsar-pink bg-white/20" />
                        <div className="flex justify-between">
                          <span className="font-inter text-[10px] text-white/40">1</span>
                          <span className="font-inter text-[10px] text-white/40">10</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex justify-between">
                          <span className="font-futura font-bold text-[12px] text-white/70 uppercase tracking-wide">Would you recommend Pulsar Patch?</span>
                          <span className="font-futura font-bold text-[14px] text-white">{reviewForm.recommend}/10</span>
                        </div>
                        <input type="range" min="1" max="10" value={reviewForm.recommend} onChange={(e) => setReviewForm({ ...reviewForm, recommend: Number(e.target.value) })} className="w-full h-[6px] rounded-full appearance-none cursor-pointer accent-pulsar-pink bg-white/20" />
                        <div className="flex justify-between">
                          <span className="font-inter text-[10px] text-white/40">1</span>
                          <span className="font-inter text-[10px] text-white/40">10</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-3.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark shrink-0">
                      SUBMIT
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Reviews */}
            <div className="flex flex-col gap-14 w-full">
              {/* Review 1 */}
              <div className="flex gap-12 border-b border-gray-100 pb-14">
                <div className="flex-[0_0_160px] flex flex-col">
                  <span className="font-futura font-[800] text-[13px] text-pulsar-pink uppercase tracking-wide mb-1">GABRIELLA</span>
                  <span className="font-inter font-[600] text-[11px] text-gray-400 uppercase tracking-wide mb-4">4 MONTHS AGO</span>
                  <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase">VERIFIED BUYER</span>
                </div>
                <div className="flex-1 flex flex-col pt-1">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#DE64A5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-futura font-[800] text-[14px] text-pulsar-blue uppercase tracking-wide mb-3">IT REALLY WORKS!</h4>
                  <p className="font-inter font-[500] text-[14px] text-gray-600 leading-[1.6]">
                    I've tried multiple patches and never have seem to really understand the whole hangover cure thing from just a patch, but As soon as I tried pulsar patch, I kid you not, I felt completely normal the next day. I was not expecting that feeling especially with the amount of alcohol I do intake. I have already recommend several friends this product and they all LOVE it.
                  </p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="flex gap-12 border-b border-gray-100 pb-14">
                <div className="flex-[0_0_160px] flex flex-col">
                  <span className="font-futura font-[800] text-[13px] text-pulsar-pink uppercase tracking-wide mb-1">CHRIS M.</span>
                  <span className="font-inter font-[600] text-[11px] text-gray-400 uppercase tracking-wide mb-4">1 YEAR AGO</span>
                  <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase">VERIFIED BUYER</span>
                </div>
                <div className="flex-1 flex flex-col pt-1">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#DE64A5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-futura font-[800] text-[14px] text-pulsar-blue uppercase tracking-wide mb-3">SOMEHOW IT WORKS</h4>
                  <p className="font-inter font-[500] text-[14px] text-gray-600 leading-[1.6]">
                    The patch worked great! Slapped it on right before we started drinking and woke up feeling good the next day with no headache or hangover. I usually wake up with a massive headache and this time I didn't. I had tried some anti hangover drinks before and to start off, they taste nasty, left a nasty taste in my mouth and didn't work. The patch is very unnoticeable and you forget it's even on. I highly recommend you try it.
                  </p>
                </div>
              </div>

              {/* Review 3 */}
              <div className="flex gap-12 border-b border-gray-100 pb-14">
                <div className="flex-[0_0_160px] flex flex-col">
                  <span className="font-futura font-[800] text-[13px] text-pulsar-pink uppercase tracking-wide mb-1">ADAM</span>
                  <span className="font-inter font-[600] text-[11px] text-gray-400 uppercase tracking-wide mb-4">1 YEAR AGO</span>
                  <span className="font-futura font-[800] text-[10px] text-pulsar-blue tracking-widest uppercase">VERIFIED BUYER</span>
                </div>
                <div className="flex-1 flex flex-col pt-1">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#DE64A5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-futura font-[800] text-[14px] text-pulsar-blue uppercase tracking-wide mb-3">LOVE IT</h4>
                  <p className="font-inter font-[500] text-[14px] text-gray-600 leading-[1.6]">
                    Love it! Easy to use and very effective!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Show More — links to reviews page */}
            <div className="w-full flex justify-center mt-10">
              <Link to="/reviews" className="bg-pulsar-pink text-white font-futura font-[800] text-[12px] uppercase tracking-widest px-10 py-3 rounded-full shadow-md transition-transform hover:-translate-y-1 hover:bg-pulsar-pink-dark">
                SHOW MORE
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
