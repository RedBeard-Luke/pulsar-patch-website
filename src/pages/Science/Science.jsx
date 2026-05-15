import { Link } from 'react-router-dom'
import iconVitB from '../../assets/icon-vitamin-b.svg'
import iconVitB3 from '../../assets/icon-vitamin-b3.svg'
import iconVitB9 from '../../assets/icon-vitamin-b9.svg'
import iconGlutathione from '../../assets/icon-glutathione.svg'
import iconNac from '../../assets/icon-nac.svg'
import iconGinger from '../../assets/icon-ginger.svg'
import iconArrow from '../../assets/icon-arrow.svg'
import iconSimple1 from '../../assets/Stupid simple_1.svg'
import iconSimple2 from '../../assets/Stupid simple_2.svg'
import iconSmile from '../../assets/Smile_Icon_3.svg'
import squigleBg from '../../assets/Squigle_What is Pulsar.svg'

const ingredients = [
  {
    name: 'VITAMIN B',
    amount: '717.5mcg',
    icon: iconVitB,
    description: 'A vital nutrient that supports energy production, brain function, and helps your body recover after a night out.',
  },
  {
    name: 'VITAMIN B3',
    amount: '1,956.5mcg',
    icon: iconVitB3,
    description: 'Also known as Niacin, B3 supports cellular repair, helps your body process alcohol, and promotes healthy circulation.',
  },
  {
    name: 'VITAMIN B9',
    amount: '239mcg',
    icon: iconVitB9,
    description: 'Folate plays a key role in cell regeneration and helps replenish what alcohol depletes from your system.',
  },
  {
    name: 'GLUTATHIONE',
    amount: '9.5mg',
    icon: iconGlutathione,
    description: 'Your body\'s master antioxidant. It defends your cells from oxidative stress so you can bounce back faster the next morning.',
  },
  {
    name: 'NAC (N-ACETYLCYSTEINE)',
    amount: '4.75mg',
    icon: iconNac,
    description: 'NAC is like a helper for your liver. It gives your body the tools it needs to clean up the mess after a night of fun.',
  },
  {
    name: 'GINGER EXTRACT',
    amount: '1,435mcg',
    icon: iconGinger,
    description: 'A natural stomach soother that eases nausea and supports digestion when your body needs it most.',
  },
]

export default function Science() {
  return (
    <div className="w-full bg-white flex flex-col" id="science-page">

      {/* ═══════════════════════════════════════════════════════════
         1. HERO — Full image with title overlay
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[80vh] bg-[#555555] flex items-center overflow-hidden" id="science-hero">
        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] w-full">
          <h1 className="font-futura font-bold text-[54px] leading-[1.1] uppercase tracking-wide text-white mb-4">
            LETS GET NERDY...<br />THE SCIENCE
          </h1>
          <p className="font-inter text-[18px] leading-[1.6] text-white/80 max-w-[500px]">
            We don't hide behind hype. Here's exactly what's in a Pulsar Patch, how it works, and why it works.
          </p>
        </div>

        {/* White wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. WHAT'S INSIDE — Ingredients
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]" id="ingredients">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="text-center mb-16">
            <div className="bg-pulsar-pink text-white px-4 py-1 inline-block mb-2">
              <h2 className="font-futura font-bold text-[42px] leading-none uppercase tracking-wide">WHAT'S INSIDE</h2>
            </div>
            <div className="bg-pulsar-pink text-white px-4 py-1 inline-block">
              <h2 className="font-futura font-bold text-[42px] leading-none uppercase tracking-wide">THE PATCH?</h2>
            </div>
            <p className="font-inter text-[16px] leading-[1.6] text-pulsar-dark/70 max-w-[600px] mx-auto mt-6">
              Six clinically-backed ingredients delivered transdermally: no pills, no powders, no B.S.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {ingredients.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-[24px] border-2 border-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-pulsar-blue/30">
                <img src={item.icon} alt={item.name} className="w-[60px] h-[60px] object-contain mb-6" />
                <h3 className="font-futura font-bold text-[18px] text-pulsar-blue uppercase tracking-wide mb-1">{item.name}</h3>
                <span className="font-inter font-[600] text-[13px] text-pulsar-pink mb-4">{item.amount}</span>
                <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. MARQUEE
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-bold text-white text-[18px] uppercase tracking-[2px] mx-10 flex items-center gap-4">
              THE SCIENCE <span className="text-[20px]">→</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         4. IT'S STUPID SIMPLE TO USE
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-pulsar-blue flex flex-col pt-[100px] pb-[140px]" id="simple-to-use">
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>

        <div className="max-w-[1920px] mx-auto w-full px-[140px] flex flex-col">
          <h2 className="font-futura font-bold text-[36px] text-white uppercase tracking-wide mb-16 text-left max-w-[500px] leading-[1.1]">
            IT'S STUPID<br/>SIMPLE TO USE!
          </h2>

          <div className="grid grid-cols-3 gap-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-futura font-bold text-[48px] text-white mb-6">1</h3>
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
              <h3 className="font-futura font-bold text-[48px] text-white mb-6">2</h3>
              <div className="w-[140px] h-[140px] flex items-center justify-center mb-6">
                <img src={iconSimple2} alt="Peel and stick" className="w-full h-full object-contain" />
              </div>
              <h4 className="font-futura font-bold text-[18px] text-white uppercase mb-4 tracking-wide">PEEL &amp; STICK</h4>
              <p className="font-inter text-white/90 text-[13px] leading-[1.6] max-w-[200px]">
                Remove the backing &amp; firmly press the patch onto your skin.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-futura font-bold text-[48px] text-white mb-6">3</h3>
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
         5. WHY A PATCH — Two column
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]" id="transdermal">
        <div className="max-w-[1920px] mx-auto px-[140px] flex items-center gap-[80px]">
          {/* Left: Image */}
          <div className="flex-[0_0_45%]">
            <div className="w-full aspect-[4/5] bg-[#555555] rounded-[30px] shadow-2xl"></div>
          </div>

          {/* Right: Content */}
          <div className="flex-1">
            <h2 className="font-futura font-bold text-[42px] leading-[1.1] text-pulsar-pink uppercase tracking-wide mb-6">
              WHY A PATCH?
            </h2>
            <p className="font-futura font-[700] text-[18px] leading-[1.5] text-pulsar-blue mb-6">
              Transdermal delivery bypasses your stomach entirely.
            </p>
            <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark/80 mb-6">
              Unlike pills and powders that lose potency in your digestive system, a transdermal patch delivers ingredients directly through your skin into your bloodstream, steadily, over hours, while you sleep.
            </p>
            <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark/80 mb-8">
              That means higher bioavailability, no upset stomach, and no remembering to chug something before bed. Just peel, stick, and forget about it.
            </p>

            <div className="flex gap-10">
              <h3 className="font-futura font-bold text-[15px] text-pulsar-blue uppercase whitespace-nowrap">NO PILLS</h3>
              <h3 className="font-futura font-bold text-[15px] text-pulsar-blue uppercase whitespace-nowrap">6 INGREDIENTS</h3>
              <h3 className="font-futura font-bold text-[15px] text-pulsar-blue uppercase whitespace-nowrap">3 EASY STEPS</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         6. CTA — Blue with squiggle
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative bg-pulsar-pink py-[80px] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: `url('${squigleBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] flex flex-col items-center gap-8">
          <h2 className="font-futura font-bold text-[48px] leading-none text-white uppercase tracking-wide text-center">
            READY TO TRY IT?
          </h2>
          <Link to="/shop" className="inline-flex items-center gap-3 bg-white text-pulsar-pink font-futura font-bold text-[15px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-dark hover:text-white hover:-translate-y-0.5 group">
            SHOP NOW
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         7. DISCLAIMERS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[60px] border-t border-gray-200">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="max-w-[900px]">
            <p className="font-inter text-[11px] leading-[1.6] text-gray-400 mb-4">
              <span className="font-[600] text-gray-500">Disclaimer:</span> "Hangover Defense Patch" is a product descriptor only and does not imply prevention, treatment, or cure of hangovers or intoxication. Results may vary. Statements have not been evaluated by the FDA.
            </p>
            <p className="font-inter text-[11px] leading-[1.6] text-gray-400 mb-4">
              If pregnant, nursing, have a medical condition, or are taking medication, consult a medical professional before use.
            </p>
            <p className="font-inter text-[11px] leading-[1.6] text-gray-400">
              <span className="font-[600] text-gray-500">Warning:</span> For external use only. Do not stick this on broken or irritated skin. If your skin gets mad, remove it. Keep out of reach of kids.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
