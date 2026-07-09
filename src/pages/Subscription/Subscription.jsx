import { useCart } from '../../context/CartContext'
import CurvedFeature from '../../components/CurvedFeature/CurvedFeature'
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
    title: "YOU'RE ALL SET",
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
      <section className="relative w-full min-h-[68vh] bg-pulsar-light-blue-bg bg-cover bg-center bg-no-repeat flex items-center overflow-hidden" style={{ backgroundImage: `url(${subHeroBg})` }}>
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] w-full flex justify-start lg:justify-end">
          <div className="flex flex-col items-start">
            <div className="bg-pulsar-blue text-white px-4 py-1 mb-2">
              <h1 className="font-futura font-[900] text-[clamp(1.75rem,6vw,42px)] leading-[1.05] uppercase tracking-wide">SUBSCRIBE TO PLANNING</h1>
            </div>
            <div className="bg-pulsar-blue text-white px-4 py-1 mb-2">
              <h1 className="font-futura font-[900] text-[clamp(1.75rem,6vw,42px)] leading-[1.05] uppercase tracking-wide">AHEAD (YOUR HEAD WILL</h1>
            </div>
            <div className="bg-pulsar-blue text-white px-4 py-1">
              <h1 className="font-futura font-[900] text-[clamp(1.75rem,6vw,42px)] leading-[1.05] uppercase tracking-wide">THANK YOU).</h1>
            </div>
          </div>
        </div>

        {/* White wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. SUBSCRIPTION TIERS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <h2 className="font-futura font-[900] text-[36px] text-pulsar-blue uppercase tracking-wide mb-16">
            SUBSCRIPTION TIERS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
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
                <div className="w-full aspect-[4/3] bg-pulsar-light-blue-bg rounded-[16px] mb-6 shadow-md"></div>

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
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] flex flex-col lg:flex-row items-center gap-10 lg:gap-[80px]">
          {/* Left: Text */}
          <div className="w-full lg:flex-[0_0_45%]">
            <h2 className="font-futura font-[900] text-[clamp(2rem,5vw,42px)] leading-[1.05] uppercase tracking-wide text-pulsar-blue mb-2">
              YOU'LL ALWAYS BE
            </h2>
            <div className="bg-pulsar-pink text-white px-4 py-2 inline-block mb-8">
              <h2 className="font-futura font-[900] text-[clamp(1.75rem,4.5vw,36px)] leading-[1.05] uppercase tracking-wide">READY FOR TOMORROW</h2>
            </div>
            <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark max-w-[500px]">
              One less thing to remember before a night out. We'll remember to restock so you don't have to!
            </p>
          </div>

          {/* Right: Image placeholder */}
          <div className="w-full lg:flex-1">
            <div className="w-full aspect-[4/3] bg-pulsar-light-blue-bg rounded-[30px] shadow-2xl"></div>
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

      {/* ═══ 5. WHY SHOULD YOU SUBSCRIBE? ═══ */}
      <CurvedFeature
        id="why-subscribe"
        topBgClass="bg-pulsar-pink"
        bottomBgClass="bg-white"
        waveFill="#FFFFFF"
        pattern={squigleBg}
        patternClass="opacity-[0.08]"
        title={
          <h2 className="font-futura font-[900] text-[clamp(2rem,6vw,3rem)] text-white uppercase tracking-wide leading-[1.1] lg:text-right">
            Why should<br />you subscribe?
          </h2>
        }
        imageLabel="PULSAR"
        imageBgClass="bg-gray-200"
        itemTitleClass="text-pulsar-blue"
        bodyClass="text-gray-600"
        items={benefits.map((b) => ({ icon: b.icon, title: b.title, body: b.text }))}
      />

    </div>
  )
}
