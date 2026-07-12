import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import CurvedFeature from '../../components/CurvedFeature/CurvedFeature'
import PatchPlayground from '../../components/PatchPlayground/PatchPlayground'
import DiscountPopup from '../../components/DiscountPopup/DiscountPopup'
import heroBg from '../../assets/hero-bg.jpg'
import icon3Ingredient from '../../assets/icon-3-ingredient.svg'
import iconArrow from '../../assets/icon-arrow.svg'
import iconPill from '../../assets/icon-pill.svg'
import iconThree from '../../assets/icon-three.svg'
import swiggleLine from '../../assets/swiggle-line.svg'

/* ── Product data ── */
const products = [
  { id: 1, cartId: 'single', tagline: '1 PATCH', price: '$6.00', originalPrice: null },
  { id: 2, cartId: '3pack',  tagline: '3 PATCH BUNDLE', price: '$15.80', originalPrice: '$18.00' },
  { id: 5, cartId: 'party',  tagline: 'THE PARTY PACK', price: '$90.00', originalPrice: '$180.00' },
]

/* ── Review data ── */
const reviews = [
  { id: 1, stars: 5, text: 'Love it! Easy to use and very effective. I put it on before going out and woke up feeling great the next morning. Would absolutely recommend.', author: 'Adam', date: '1 year ago', verified: true },
  { id: 2, stars: 5, text: "Best hangover prevention I've ever tried. My friends all want to know my secret now. Pulsar Patch is a game changer!", author: 'Sarah', date: '8 months ago', verified: true },
  { id: 3, stars: 5, text: "I was skeptical at first but this actually works. No more wasted mornings after a night out. Highly recommend to anyone.", author: 'Mike', date: '6 months ago', verified: true },
]

function Stars({ n = 5, size = 16, color = '#44C8E8' }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[...Array(n)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      ))}
    </div>
  )
}

export default function Home() {
  const { addToCart } = useCart()
  // The patch playground treats this text block as a solid obstacle
  const patchTextRef = useRef(null)

  return (
    <div className="w-full bg-white" id="home-page">

      {/* First-visit 15%-off email capture */}
      <DiscountPopup />

      {/* ═══ HERO ═══ */}
      <section
        className="relative w-full min-h-[600px] lg:min-h-[820px] bg-[#1f1f1f] bg-cover bg-center flex items-end lg:items-center lg:justify-end px-5 sm:px-10 lg:px-[100px] pt-28 lg:pt-0 pb-24 lg:pb-[80px] overflow-hidden"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 55%), url(${heroBg})` }}
      >
        <div className="relative z-10 w-full max-w-[520px] lg:mr-[2%]">
          <h1 className="font-futura font-[800] text-[clamp(2.25rem,9vw,3.5rem)] leading-[1.15] uppercase mb-5">
            <span className="bg-pulsar-pink-light text-white px-3 py-1 inline leading-tight box-decoration-clone">You'll thank yourself later.</span>
          </h1>
          <p className="font-futura font-[800] text-[clamp(1.1rem,4vw,1.5rem)] leading-[1.35] text-white mb-7">
            Skip the hangover and feel ready for the day.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/shop" className="inline-flex items-center gap-3 bg-[#d15696] text-white font-futura font-bold text-[15px] uppercase tracking-wide px-8 py-4 rounded-full transition-all duration-300 hover:bg-[#bd4a86] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(209,86,150,0.35)] group">
              Shop Now <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
            <Link to="/store-locator" className="inline-flex items-center gap-2 text-white font-futura font-bold text-[14px] uppercase tracking-wide hover:text-pulsar-pink-light transition-colors">
              Find a store near you →
            </Link>
          </div>
          <Link to="/wholesale" className="inline-block mt-5 font-inter text-[13px] text-white/70 hover:text-white underline underline-offset-4 transition-colors">
            Own a bar or shop? Stock Pulsar
          </Link>
        </div>
        <div className="absolute -bottom-px left-0 w-full leading-none z-0 pointer-events-none">
          <svg className="block w-full h-auto min-h-[80px]" viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 120 L 0 120 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ═══ DESIGNED WITH TOMORROW IN MIND ═══ */}
      {/* Top padding tuned so just the headline crosses the fold; tight bottom
          so Our Shop follows closely */}
      <section className="relative bg-white pt-6 pb-10 lg:pt-[88px] lg:pb-10 overflow-hidden">
        {/* Physics layer spans the whole section, screen edge to screen edge.
            The text block is passed in as a solid obstacle, so patches bounce
            off the copy instead of ever crossing it. */}
        <div className="absolute inset-0">
          <PatchPlayground obstacleRef={patchTextRef} />
        </div>
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-[80px]">
          <div ref={patchTextRef} className="lg:flex-[0_0_45%] relative z-20 text-center lg:text-left">
            <h2 className="font-futura font-[900] text-[clamp(2rem,6vw,3rem)] leading-[1.1] text-pulsar-pink uppercase mb-5">Designed with tomorrow in mind.</h2>
            <p className="font-futura font-[700] text-[clamp(1rem,2.5vw,1.15rem)] leading-[1.5] text-pulsar-blue mb-7 max-w-[440px] mx-auto lg:mx-0">
              Taking care of tomorrow shouldn't mean changing tonight. Even when life doesn't behave.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2.5 bg-pulsar-blue text-white font-futura font-bold text-[13px] uppercase tracking-[1.5px] px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-blue-dark hover:-translate-y-0.5 hover:shadow-glow-blue group">
              Read our story <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          {/* Spacer keeps the section tall enough for the patches to roam */}
          <div className="w-full lg:flex-1 h-[320px] sm:h-[400px] lg:h-[440px]" aria-hidden="true" />
        </div>
      </section>

      {/* ═══ OUR SHOP ═══ */}
      <section className="bg-white pt-6 pb-16 lg:pb-20">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <h2 className="font-futura font-[900] text-[clamp(1.6rem,5vw,2.25rem)] text-pulsar-pink uppercase mb-8">Our Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 mb-10">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]">
                <Link to={`/product/${product.id}`} className="h-[220px] lg:h-[260px] bg-pulsar-light-blue-bg w-full flex items-center justify-center" aria-label={`View ${product.tagline}`}>
                  <span className="font-futura font-[900] text-pulsar-blue/30 text-[18px]">PULSAR</span>
                </Link>
                <div className="bg-pulsar-blue p-6 text-white flex-1 flex flex-col items-start">
                  <p className="font-futura font-[800] text-[18px] leading-[1.2] uppercase mb-1">{product.tagline}</p>
                  <p className="font-futura font-[700] text-[16px] mb-4 flex items-center gap-2">
                    {product.price}
                    {product.originalPrice && <span className="line-through opacity-70 text-[14px]">{product.originalPrice}</span>}
                  </p>
                  <button onClick={() => addToCart(product.cartId)} className="inline-block px-6 py-2.5 mt-auto bg-white text-pulsar-pink font-futura font-bold text-[12px] uppercase rounded-full transition-colors duration-300 hover:bg-pulsar-pink hover:text-white">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/shop" className="inline-flex items-center gap-3 bg-pulsar-blue text-white font-futura font-bold text-[15px] uppercase px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-blue-dark hover:-translate-y-0.5 group">
              View all products <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3" aria-hidden="true">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-bold text-white text-[18px] uppercase tracking-[2px] mx-10">Shop Now</span>
          ))}
        </div>
      </section>

      {/* ═══ THE SCIENCE ═══ */}
      <CurvedFeature
        topBgClass="bg-white"
        bottomBgClass="bg-[#44C8E8]"
        waveFill="#44C8E8"
        pattern={swiggleLine}
        patternClass="opacity-[0.12]"
        title={
          <div className="flex flex-col items-start lg:items-end gap-2">
            <span className="bg-pulsar-pink text-white px-3 py-1 font-futura font-[900] text-[clamp(1.6rem,5vw,2.5rem)] leading-tight uppercase tracking-wide inline-block">Let's get nerdy...</span>
            <span className="bg-pulsar-pink text-white px-3 py-1 font-futura font-[900] text-[clamp(1.6rem,5vw,2.5rem)] leading-tight uppercase tracking-wide inline-block">The Science!</span>
          </div>
        }
        imageLabel="THE PATCH"
        itemTitleClass="text-white"
        bodyClass="text-white/90"
        items={[
          { icon: iconPill, title: 'No pills, powders, or B.S.', body: 'Pulsar uses transdermal delivery, the same tech behind nicotine patches. It bypasses your stomach and delivers ingredients straight into your bloodstream while you sleep.' },
          { icon: icon3Ingredient, title: 'Six proven ingredients', body: "Glutathione, NAC, Vitamin B, B3, B9, and Ginger Extract. Each one supports your body's natural recovery after drinking. Nothing extra, nothing hidden." },
          { icon: iconThree, title: 'Three easy steps', body: 'Peel, stick, and enjoy your night. Apply 30 minutes before your first drink, wear it 8 to 12 hours, and wake up feeling like yourself.' },
        ]}
        cta={{ label: 'Explore the science', to: '/science' }}
        ctaClass="bg-pulsar-pink hover:bg-pulsar-pink-dark"
      />

      {/* ═══ REVIEWS ═══ */}
      <section className="bg-white py-16 lg:py-20 px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col items-start mb-10 lg:mb-16">
            <h2 className="font-futura font-[900] text-[clamp(2rem,6vw,3rem)] leading-[1.1] text-pulsar-blue uppercase tracking-wide">We're biased.</h2>
            <span className="bg-pulsar-pink text-white px-4 py-1 font-futura font-[900] text-[clamp(2rem,6vw,3rem)] leading-[1.1] uppercase tracking-wide inline-block">They're not.</span>
          </div>
          <div className="flex flex-col mb-12 lg:mb-16">
            {reviews.map((review, index) => (
              <div key={review.id} className={`flex flex-col sm:flex-row py-8 border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}>
                <div className="sm:flex-[0_0_220px] flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-0 pr-8 mb-3 sm:mb-0">
                  <p className="font-futura font-bold text-[15px] text-pulsar-pink uppercase tracking-widest sm:mb-1">{review.author}</p>
                  <p className="font-inter text-[13px] text-pulsar-blue sm:mb-2">{review.date}</p>
                  {review.verified && <span className="font-inter font-semibold text-[11px] text-gray-400 tracking-wide uppercase hidden sm:block">Verified Buyer</span>}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="mb-3"><Stars n={review.stars} /></div>
                  <p className="font-inter font-semibold text-[15px] leading-[1.6] text-gray-800">"{review.text}"</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/reviews" className="inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[15px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5">
              See more reviews <img src={iconArrow} alt="" className="w-[20px] h-auto" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FIND US (consumer) + FOR RETAILERS (business) ═══ */}
      <section className="w-full flex flex-col md:flex-row">
        <div className="flex-1 bg-pulsar-blue text-white p-10 lg:p-16 flex flex-col items-start justify-center">
          <p className="font-futura font-[800] text-[12px] uppercase tracking-[3px] text-white/80 mb-3">Grab one tonight</p>
          <h3 className="font-futura font-[900] text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.05] uppercase mb-5">In 60+ stores across AZ &amp; NV</h3>
          <p className="font-inter text-[15px] text-white/90 max-w-[380px] mb-6">Find the bars, markets, and shops near you that stock Pulsar.</p>
          <Link to="/store-locator" className="bg-white text-pulsar-blue font-futura font-bold text-[14px] uppercase px-8 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform shadow-md">Find a store</Link>
        </div>
        <div className="flex-1 bg-pulsar-pink text-white p-10 lg:p-16 flex flex-col items-start justify-center">
          <p className="font-futura font-[800] text-[12px] uppercase tracking-[3px] text-white/80 mb-3">For retailers</p>
          <h3 className="font-futura font-[900] text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.05] uppercase mb-5">Sell Pulsar in your store</h3>
          <p className="font-inter text-[15px] text-white/90 max-w-[380px] mb-6">Real margins, low minimums, no contracts. Your customers are already asking for it.</p>
          <Link to="/wholesale" className="bg-white text-pulsar-pink font-futura font-bold text-[14px] uppercase px-8 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform shadow-md">See wholesale</Link>
        </div>
      </section>

      {/* ═══ JOURNEY / SOCIAL ═══ */}
      <section className="bg-white py-16 lg:py-[100px] px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-futura font-[900] text-[clamp(1.25rem,4vw,1.5rem)] text-pulsar-blue uppercase tracking-wide">Be a part of the journey!</h2>
            <a href="https://www.instagram.com/pulsarpatch/" target="_blank" rel="noopener noreferrer" className="font-futura font-bold text-[13px] text-pulsar-pink uppercase tracking-wide hover:text-pulsar-pink-dark">@pulsarpatch →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
            {[1, 2, 3].map((id) => (
              <a key={id} href="https://www.instagram.com/pulsarpatch/" target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-pulsar-light-blue-bg rounded-[24px] overflow-hidden group shadow-sm last:hidden md:last:block">
                <div className="absolute inset-0 flex items-center justify-center text-pulsar-blue/30 font-futura font-[900]">PULSAR</div>
                <div className="absolute bottom-4 right-4 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#44C8E8"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
