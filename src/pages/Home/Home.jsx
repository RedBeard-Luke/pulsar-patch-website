import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import heroBg from '../../assets/hero-bg.jpg'
import patchFront from '../../assets/patch-front.svg'
import patchBack from '../../assets/patch-back.svg'
import icon3Ingredient from '../../assets/icon-3-ingredient.svg'
import iconArrow from '../../assets/icon-arrow.svg'
import iconPill from '../../assets/icon-pill.svg'
import iconThree from '../../assets/icon-three.svg'
import swiggleLine from '../../assets/swiggle-line.svg'

/* ── Product data ── */
const products = [
  { id: 1, cartId: 'single', name: 'Hangover Defense Patch', tagline: '1 PATCH', price: '$6.00', originalPrice: null },
  { id: 2, cartId: '3pack',  name: 'Hangover Defense Patch', tagline: '3 PATCH BUNDLE', price: '$15.80', originalPrice: '$18.00' },
  { id: 3, cartId: 'party',  name: 'The Party Pack', tagline: 'THE PARTY PACK', price: '$90.00', originalPrice: '$180.00' },
]

/* ── Review data ── */
const reviews = [
  {
    id: 1, stars: 5,
    text: 'Love it! Easy to use and very effective. I put it on before going out and woke up feeling great the next morning. Would absolutely recommend.',
    author: 'Adam', date: '1 year ago', verified: true,
  },
  {
    id: 2, stars: 5,
    text: "Best hangover prevention I've ever tried. My friends all want to know my secret now. Pulsar Patch is a game changer!",
    author: 'Sarah', date: '8 months ago', verified: true,
  },
  {
    id: 3, stars: 5,
    text: "I was skeptical at first but this actually works! No more wasted mornings after a night out. Highly recommend to anyone.",
    author: 'Mike', date: '6 months ago', verified: true,
  },
]

/* ── Social images placeholder ── */
const socialImages = [
  { id: 1, alt: 'Friends at party', bg: 'bg-gradient-to-br from-[#c9a87c] to-[#8B6914]' },
  { id: 2, alt: 'Pulsar x Hollyrock', bg: 'bg-gradient-to-br from-pulsar-pink to-[#c74d90]' },
  { id: 3, alt: 'Night out', bg: 'bg-gradient-to-br from-pulsar-blue to-[#35b3d1]' },
  { id: 4, alt: 'POV morning after', bg: 'bg-gradient-to-br from-[#2D6A4F] to-[#40916C]' },
  { id: 5, alt: 'Pool party', bg: 'bg-gradient-to-br from-[#DE64A5] to-[#9B2C6E]' },
  { id: 6, alt: 'Concert night', bg: 'bg-gradient-to-br from-[#44C8E8] to-[#1B6B8A]' },
]

/* ── Scattered Patches Config ── */
/* face: 'front' or 'back' determines which SVG is initially shown */
const scatteredPatches = [
  { w: '26%', t: '5%',  l: '12%', r: -15, px: -40, py: -30, z: 10, blur: '',            face: 'back' },
  { w: '20%', t: '10%', l: '55%', r: 12,  px: 60,  py: 40,  z: 5,  blur: 'blur-[2px]',  face: 'front' },
  { w: '38%', t: '30%', l: '28%', r: 4,   px: 120, py: 90,  z: 20, blur: '',             face: 'front' },
  { w: '24%', t: '65%', l: '8%',  r: -25, px: -80, py: 50,  z: 15, blur: '',             face: 'back' },
  { w: '28%', t: '55%', l: '62%', r: 20,  px: 50,  py: -60, z: 12, blur: 'blur-[1px]',   face: 'front' },
  { w: '16%', t: '35%', l: '82%', r: -8,  px: -30, py: -90, z: 2,  blur: 'blur-[3px]',   face: 'back' },
  { w: '22%', t: '80%', l: '45%', r: -6,  px: 30,  py: 110, z: 8,  blur: 'blur-[2px]',   face: 'front' },
]

/* ── FloatingPatch Component ── */
function FloatingPatch({ config, index }) {
  const [hoverOffset, setHoverOffset] = useState({ x: 0, y: 0 })
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dragStart = useRef(null)
  const rotationStart = useRef({ x: 0, y: 0 })

  // Per-patch hover: gentle parallax drift relative to center of patch
  const handlePatchMouseMove = useCallback((e) => {
    if (isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setHoverOffset({ x: x * config.px * 0.15, y: y * config.py * 0.15 })
  }, [isDragging, config.px, config.py])

  const handlePatchMouseLeave = useCallback(() => {
    if (!isDragging) {
      setHoverOffset({ x: 0, y: 0 })
      setIsHovered(false)
    }
  }, [isDragging])

  // Click-drag 3D rotation
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    rotationStart.current = { ...dragRotation }

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setDragRotation({
        y: rotationStart.current.y + dx * 0.8,
        x: rotationStart.current.x - dy * 0.8,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [dragRotation])

  // Which SVGs go on which side depends on the initial face config
  const frontSrc = config.face === 'front' ? patchFront : patchBack
  const backSrc = config.face === 'front' ? patchBack : patchFront

  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        width: config.w,
        top: config.t,
        left: config.l,
        zIndex: isHovered || isDragging ? 50 : config.z,
        perspective: '800px',
      }}
      onMouseMove={handlePatchMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handlePatchMouseLeave}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`relative w-full ${isDragging ? '' : 'transition-transform duration-300'} ease-out`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            translate(${hoverOffset.x}px, ${hoverOffset.y}px)
            rotate(${config.r}deg)
            rotateX(${dragRotation.x}deg)
            rotateY(${dragRotation.y}deg)
            ${isHovered && !isDragging ? 'scale(1.08)' : 'scale(1)'}
          `,
        }}
      >
        {/* Front face — visible by default */}
        <img
          src={frontSrc}
          alt="Pulsar Patch Front"
          className={`w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] ${!isHovered && !isDragging ? config.blur : ''}`}
          style={{
            backfaceVisibility: 'hidden',
          }}
          draggable={false}
        />
        {/* Back face — pre-rotated 180° so it shows when flipped */}
        <img
          src={backSrc}
          alt="Pulsar Patch Back"
          className={`absolute top-0 left-0 w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] ${!isHovered && !isDragging ? config.blur : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          draggable={false}
        />
      </div>
    </div>
  )
}

export default function Home() {
  const { addToCart } = useCart()
  return (
    <div className="w-full bg-white" id="home-page">

      {/* ═══════════════════════════════════════════════════════════
         HERO
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[850px] bg-[#1f1f1f] bg-cover bg-center bg-no-repeat flex items-center justify-end px-5 md:px-10 lg:px-[140px] overflow-hidden" id="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="relative z-10 max-w-[520px] mr-[2%] mb-[80px] flex flex-col items-start">
          <h1 className="font-futura font-[800] text-[54px] leading-[1.25] uppercase mb-6">
            <span className="bg-pulsar-pink-light text-white px-3 py-1 inline-block mb-2 leading-none whitespace-nowrap">YOU'LL THANK</span><br />
            <span className="bg-pulsar-pink-light text-white px-3 py-1 inline-block mb-2 leading-none whitespace-nowrap">YOURSELF LATER.</span>
          </h1>
          <p className="font-futura font-[800] text-[24px] leading-[1.4] text-white mb-8 pl-1">
            Skip the hangover &<br />
            feel ready for the day!
          </p>
          <Link to="/shop" className="inline-flex items-center gap-3 bg-[#d15696] text-white font-futura font-bold text-[15px] uppercase tracking-wide px-9 py-4 rounded-full transition-all duration-300 ml-1 hover:bg-[#bd4a86] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(209,86,150,0.35)] group">
            SHOP NOW <span className="text-xl transition-transform duration-150 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-0">
          <svg className="block w-full h-auto min-h-[120px]" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         DESIGNED WITH TOMORROW IN MIND
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px] relative overflow-hidden" id="tomorrow-section">
        <div className="max-w-[1920px] mx-auto px-[140px] flex items-center gap-[80px]">
          <div className="flex-[0_0_45%] relative z-20">
            <h2 className="font-futura font-[900] text-[48px] leading-[1.1] text-pulsar-pink uppercase mb-6">
              DESIGNED WITH<br />
              TOMORROW IN MIND.
            </h2>
            <p className="font-futura font-[700] text-[18px] leading-[1.5] text-pulsar-blue mb-8">
              We believe taking care of tomorrow shouldn't<br />
              require changing tonight, even when life doesn't<br />
              always behave.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2.5 bg-pulsar-blue text-white font-futura font-bold text-[13px] uppercase tracking-[1.5px] px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-blue-dark hover:-translate-y-0.5 hover:shadow-glow-blue group">
              READ OUR STORY <span className="text-[20px] transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="flex-1 relative z-10 h-[600px]">
            {scatteredPatches.map((patch, i) => (
              <FloatingPatch key={i} config={patch} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         OUR SHOP
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-10 pb-20" id="our-shop-section">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-[900] text-[36px] leading-none text-pulsar-pink uppercase mb-10">OUR SHOP</h2>
          <div className="grid grid-cols-3 gap-10 mb-10">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] group">
                <div className="h-[260px] bg-[#757575] w-full flex items-center justify-center text-white/50 text-sm font-inter">
                  {/* Image Placeholder */}
                </div>
                <div className="bg-pulsar-blue p-6 text-white flex-1 flex flex-col items-start">
                  <p className="font-futura font-[800] text-[18px] leading-[1.2] uppercase mb-1">{product.tagline}</p>
                  <p className="font-futura font-[700] text-[16px] leading-[1.2] mb-4 flex items-center gap-2">
                    {product.price}
                    {product.originalPrice && <span className="line-through opacity-70 text-[14px]">{product.originalPrice}</span>}
                  </p>
                  <button
                    onClick={() => addToCart(product.cartId)}
                    className="inline-block px-6 py-2 mt-auto bg-white text-pulsar-pink font-futura font-bold text-[12px] uppercase rounded-full transition-colors duration-300 hover:bg-pulsar-pink hover:text-white"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/shop" className="inline-flex items-center gap-3 bg-pulsar-blue text-white font-futura font-bold text-[15px] uppercase px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-blue-dark hover:-translate-y-0.5 group">
              VIEW ALL PRODUCTS <span className="text-[20px] transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         MARQUEE
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-bold text-white text-[18px] uppercase tracking-[2px] mx-10">
              SHOP NOW
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         LETS GET NERDY... THE SCIENCE
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" id="science-section">

        {/* Swiggle Lines — spans across both white and blue zones */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <img src={swiggleLine} alt="" className="w-full h-auto opacity-[0.15] min-w-[1440px] -translate-y-10" />
        </div>

        {/* ── WHITE ZONE: Headers ── */}
        <div className="relative bg-white">

          <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[100px] pb-[40px] flex items-start gap-[80px]">
            {/* Left: top of grey box starts here, extends into blue */}
            <div className="flex-[0_0_45%]">
              {/* Spacer so the box aligns with headers */}
            </div>
            {/* Right: Headers only */}
            <div className="flex-1 flex flex-col items-start">
              <div className="bg-pulsar-pink text-white px-4 py-1 mb-2">
                <h2 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">LETS GET NERDY...</h2>
              </div>
              <div className="bg-pulsar-pink text-white px-4 py-1">
                <h2 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">THE SCIENCE!</h2>
              </div>
            </div>
          </div>
        </div>

        {/* ── WAVE DIVIDER: Standardised wave (matches hero) ── */}
        <div className="w-full leading-none h-[120px] -mt-[1px]">
          <svg className="block w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="1440" height="40" fill="white" />
            <path d="M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 120 L 0 120 Z" fill="#44C8E8" />
          </svg>
        </div>

        {/* ── BLUE ZONE: Icons + Content (solid blue, no wave interference) ── */}
        <div className="relative bg-[#44C8E8]">
          <div className="max-w-[1920px] mx-auto px-[140px] pt-[40px] pb-[100px] flex items-stretch gap-[80px]">
            {/* Left Column: Image Placeholder */}
            <div className="flex-[0_0_45%] relative">
              <div className="absolute bottom-0 left-0 w-full aspect-[3/4] bg-[#555555] rounded-[30px] shadow-2xl z-10"></div>
            </div>

            {/* Right Column: Science Content */}
            <div className="flex-1 flex flex-col items-start">
              <div className="flex flex-col gap-10 w-full max-w-[600px]">
                {/* Benefit 1 */}
                <div className="flex gap-6 items-start">
                  <img src={iconPill} alt="Pill Icon" className="w-[48px] h-auto shrink-0 mt-1" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-white uppercase mb-1">NO PILLS, POWDERS, OR B.S.</h3>
                    <p className="font-inter text-white/90 text-[14px] leading-[1.6]">
                      Pulsar uses transdermal delivery, the same tech behind nicotine patches. It bypasses your stomach entirely and delivers ingredients straight into your bloodstream while you sleep.
                    </p>
                  </div>
                </div>
                {/* Benefit 2 */}
                <div className="flex gap-6 items-start">
                  <img src={icon3Ingredient} alt="3 Ingredient Icon" className="w-[48px] h-auto shrink-0 mt-1" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-white uppercase mb-1">SIX PROVEN INGREDIENTS</h3>
                    <p className="font-inter text-white/90 text-[14px] leading-[1.6]">
                      Glutathione, NAC, Vitamin B, B3, B9, and Ginger Extract. Each one chosen to support your body's natural recovery process after drinking. Nothing extra, nothing hidden.
                    </p>
                  </div>
                </div>
                {/* Benefit 3 */}
                <div className="flex gap-6 items-start">
                  <img src={iconThree} alt="Three Icon" className="w-[48px] h-auto shrink-0 mt-1" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-white uppercase mb-1">THREE EASY STEPS</h3>
                    <p className="font-inter text-white/90 text-[14px] leading-[1.6]">
                      Peel, stick, and enjoy your night. Apply the patch 30 minutes before your first drink, wear it for 8 to 12 hours, and wake up feeling like yourself.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/science" className="mt-16 inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[15px] uppercase px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5 shadow-xl">
                EXPLORE THE SCIENCE
                <img src={iconArrow} alt="Arrow" className="w-[20px] h-auto" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
         REVIEWS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20" id="reviews-section">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="flex flex-col items-start mb-16">
            <h2 className="font-futura font-[900] text-[48px] leading-[1.1] text-pulsar-blue uppercase tracking-wide">WE'RE BIASED.</h2>
            <div className="bg-pulsar-pink text-white px-4 py-1 inline-block">
              <h2 className="font-futura font-[900] text-[48px] leading-[1.1] uppercase tracking-wide">THEY'RE NOT.</h2>
            </div>
          </div>
          
          <div className="flex flex-col gap-0 mb-16">
            {reviews.map((review, index) => (
              <div key={review.id} className={`flex py-10 border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}>
                {/* Left Column: Author Info */}
                <div className="flex-[0_0_250px] flex flex-col pr-8">
                  <p className="font-futura font-bold text-[16px] text-pulsar-pink uppercase tracking-widest mb-1">{review.author}</p>
                  <p className="font-inter text-[13px] text-pulsar-blue mb-2">{review.date}</p>
                  {review.verified && (
                    <span className="font-inter font-semibold text-[12px] text-gray-500 tracking-wide uppercase">Verified Buyer</span>
                  )}
                </div>
                
                {/* Right Column: Review Text */}
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.stars)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#44C8E8">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="font-inter font-semibold text-[16px] leading-[1.6] text-gray-800">
                    "{review.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Link to="/reviews" className="inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[15px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5">
              SEE MORE REVIEWS
              <img src={iconArrow} alt="Arrow" className="w-[20px] h-auto" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         COCKTAILS + BENEFITS (IMAGE PLACEHOLDERS)
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full flex h-[500px]" id="cocktails-benefits-section">
        {/* Left Block */}
        <div className="flex-1 bg-[#8e8e8e] relative flex items-center justify-end pr-[150px]">
          <div className="flex flex-col items-start z-10">
            <div className="bg-pulsar-blue text-white px-3 py-1 mb-2">
              <h3 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">BEST COCKTAILS</h3>
            </div>
            <div className="bg-pulsar-blue text-white px-3 py-1 mb-6">
              <h3 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">WITH PULSAR.</h3>
            </div>
            <Link to="/recipes" className="bg-white text-pulsar-blue font-futura font-bold text-[14px] uppercase px-8 py-3 rounded-full hover:-translate-y-0.5 transition-transform shadow-md">
              EXPLORE OUR RECIPES
            </Link>
          </div>
        </div>

        {/* Right Block */}
        <div className="flex-1 bg-[#363636] relative flex items-center justify-start pl-[150px]">
          {/* Vertical Wavy SVG Divider */}
          <svg className="absolute top-0 left-0 h-full w-[150px] -ml-[149px] pointer-events-none" viewBox="0 0 150 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 150 0 L 150 800 L 100 800 Q 150 600, 100 400 T 100 0 Z" fill="#363636" />
          </svg>
          
          <div className="flex flex-col items-start z-10">
            <div className="bg-pulsar-pink text-white px-3 py-1 mb-2">
              <h3 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">THE BENEFITS</h3>
            </div>
            <div className="bg-pulsar-pink text-white px-3 py-1 mb-6">
              <h3 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">OF PULSAR.</h3>
            </div>
            <Link to="/about" className="bg-white text-pulsar-pink font-futura font-bold text-[14px] uppercase px-8 py-3 rounded-full hover:-translate-y-0.5 transition-transform shadow-md">
              MORE ABOUT PULSAR
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         BE APART OF THE JOURNEY
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]" id="journey-section">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-[900] text-[24px] leading-none text-pulsar-blue uppercase tracking-wide mb-8">BE APART OF THE JOURNEY!</h2>
          <div className="grid grid-cols-3 gap-10">
            {[1, 2, 3].map((id) => (
              <div key={id} className="relative w-full aspect-[1/1] bg-[#555555] rounded-[30px] overflow-hidden group cursor-pointer shadow-md">
                <div className="absolute bottom-6 right-6 z-10">
                  {/* Instagram icon SVG */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
