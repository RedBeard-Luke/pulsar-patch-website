import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import subHeroBg from '../../assets/subscription-hero.jpg'
import cheersIcon from '../../assets/Cheers_icon.svg'
import calendarIcon from '../../assets/Calender_icon.svg'
import dollarIcon from '../../assets/$.svg'
import squigleBg from '../../assets/footer_Squigle.svg'

const tiers = [
  {
    id: 'sub-weekend',
    name: 'THE WEEKEND WARRIOR',
    subtitle: 'FOR ONE SOLID NIGHT EACH WEEK!',
    patches: 4,
    price: '$21.00',
    recommended: false,
  },
  {
    id: 'sub-social',
    name: 'THE SOCIAL CALENDAR',
    subtitle: 'ONE FOR EACH WEEKEND DAY',
    patches: 8,
    price: '$36.00',
    recommended: true,
  },
  {
    id: 'sub-jugular',
    name: 'THE JUGULAR',
    subtitle: 'FOR THOSE WHO GRAB LIFE BY IT.',
    patches: 20,
    price: '$70.00',
    recommended: false,
  },
]

const benefits = [
  {
    icon: cheersIcon,
    title: 'LIMIT YOUR HANGOVERS',
    text: 'A monthly supply keeps you ready for every night out, so tomorrow never hits harder than it has to.',
  },
  {
    icon: calendarIcon,
    title: "YOUR ALL SET",
    text: 'No more last-minute orders, your patches arrive like clockwork, ready whenever the fun starts.',
  },
  {
    icon: dollarIcon,
    title: 'SAVE MONEY',
    text: 'Subscribers get our best price every month, so feeling great costs less than recovering the old way.',
  },
]

export default function Subscription() {
  const { addToCart } = useCart()
  return (
    <div className="w-full bg-white flex flex-col" id="subscription-page">

      {/* ═══════════════════════════════════════════════════════════
         1. HERO — Dark grey with wave
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[68vh] bg-[#555555] bg-cover bg-center bg-no-repeat flex items-center overflow-hidden" style={{ backgroundImage: `url(${subHeroBg})` }}>
        <div className="max-w-[1920px] mx-auto px-[140px] w-full flex justify-end">
          <div className="flex flex-col items-start">
            <div className="bg-pulsar-blue text-white px-4 py-1 mb-2">
              <h1 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">SUBSCRIBE TO PLANNING</h1>
            </div>
            <div className="bg-pulsar-blue text-white px-4 py-1 mb-2">
              <h1 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">AHEAD (YOUR HEAD WILL</h1>
            </div>
            <div className="bg-pulsar-blue text-white px-4 py-1">
              <h1 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide">THANK YOU).</h1>
            </div>
          </div>
        </div>

        {/* White wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-auto min-h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. SUBSCRIPTION TIERS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-[900] text-[36px] text-pulsar-blue uppercase tracking-wide mb-16">
            SUBSCRIPTION TIERS
          </h2>

          <div className="grid grid-cols-3 gap-10 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`flex flex-col items-center text-center p-8 rounded-[24px] border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${
                  tier.recommended
                    ? 'border-pulsar-blue shadow-glow-blue scale-105 hover:scale-110'
                    : 'border-gray-200'
                }`}
              >
                {tier.recommended && (
                  <span className="font-futura font-[900] text-[14px] text-pulsar-blue uppercase tracking-widest mb-4">
                    RECOMMENDED TIER
                  </span>
                )}

                {/* Image placeholder */}
                <div className="w-full aspect-[4/3] bg-[#757575] rounded-[16px] mb-6 shadow-md"></div>

                <h3 className="font-futura font-[900] text-[18px] text-pulsar-dark uppercase tracking-wide mb-1">
                  {tier.name}
                </h3>
                <p className="font-inter text-[12px] text-gray-500 uppercase tracking-wide mb-4">
                  {tier.subtitle}
                </p>

                <p className="font-futura font-[800] text-[16px] text-pulsar-blue uppercase tracking-wide mb-1">
                  {tier.patches} PATCHES
                </p>
                <p className="font-inter font-[600] text-[14px] text-gray-800 mb-6">
                  {tier.price}
                </p>

                <button
                  onClick={() => addToCart(tier.id)}
                  className="bg-pulsar-pink text-white font-futura font-[800] text-[12px] uppercase tracking-wide px-10 py-2.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark"
                >
                  SELECT PLAN
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. YOU'LL ALWAYS BE READY FOR TOMORROW
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]">
        <div className="max-w-[1920px] mx-auto px-[140px] flex items-center gap-[80px]">
          {/* Left: Text */}
          <div className="flex-[0_0_45%]">
            <h2 className="font-futura font-[900] text-[42px] leading-none uppercase tracking-wide text-pulsar-blue mb-2 whitespace-nowrap">
              YOU'LL ALWAYS BE
            </h2>
            <div className="bg-pulsar-pink text-white px-4 py-2 inline-block mb-8">
              <h2 className="font-futura font-[900] text-[36px] leading-none uppercase tracking-wide whitespace-nowrap">READY FOR TOMORROW</h2>
            </div>
            <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark max-w-[500px]">
              One less thing to remember before a night out. We'll remember to restock so you don't have to!
            </p>
          </div>

          {/* Right: Image placeholder */}
          <div className="flex-1">
            <div className="w-full aspect-[4/3] bg-[#555555] rounded-[30px] shadow-2xl"></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         4. MARQUEE — Subscribe
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-pulsar-blue overflow-hidden py-3">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-[900] text-white text-[18px] uppercase tracking-[2px] mx-10 flex items-center gap-4">
              SUBSCRIBE <span className="text-[20px]">→</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         5. WHY SHOULD YOU SUBSCRIBE? — Pink top → wave → white bottom
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" id="why-subscribe">

        {/* Squiggle Lines — spans across both pink and white zones */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <img src={squigleBg} alt="" className="w-full h-auto opacity-[0.08] min-w-[1440px] -translate-y-10" />
        </div>

        {/* ── PINK ZONE: Header ── */}
        <div className="relative bg-pulsar-pink pb-[100px]">
          <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[100px] pb-[40px] flex items-start gap-[80px]">
            {/* Left: spacer for image that extends into white zone */}
            <div className="flex-[0_0_45%]"></div>
            {/* Right: Header */}
            <div className="flex-1 flex flex-col items-start">
              <h2 className="font-futura font-[900] text-[48px] text-white uppercase tracking-wide leading-[1.1]">
                WHY SHOULD<br />YOU SUBSCRIBE?
              </h2>
            </div>
          </div>
          {/* Wave built into the pink zone so there's no gap */}
          <div className="absolute bottom-0 left-0 w-full leading-none z-0">
            <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 120 L 0 120 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* ── WHITE ZONE: Icons + Content ── */}
        <div className="relative bg-white">
          <div className="max-w-[1920px] mx-auto px-[140px] pt-[40px] pb-[100px] flex items-stretch gap-[80px]">
            {/* Left Column: Image Placeholder */}
            <div className="flex-[0_0_45%] relative">
              <div className="absolute bottom-0 left-0 w-full aspect-[4/5] bg-[#555555] rounded-[30px] shadow-2xl z-10"></div>
            </div>

            {/* Right Column: Benefits */}
            <div className="flex-1 flex flex-col items-start">
              <div className="flex flex-col gap-10 w-full max-w-[600px]">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <img src={benefit.icon} alt="" className="w-[60px] h-auto shrink-0 mt-1" />
                    <div>
                      <h3 className="font-futura font-bold text-[22px] text-pulsar-blue uppercase mb-2">{benefit.title}</h3>
                      <p className="font-inter text-pulsar-dark/80 text-[16px] leading-[1.6]">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
