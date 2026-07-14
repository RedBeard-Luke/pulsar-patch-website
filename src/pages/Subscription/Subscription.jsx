import { useCart, formatPrice } from '../../context/CartContext'
import CurvedFeature from '../../components/CurvedFeature/CurvedFeature'
import subHeroBg from '../../assets/subscription-hero.jpg'
import cheersIcon from '../../assets/Cheers_icon.svg'
import calendarIcon from '../../assets/Calender_icon.svg'
import dollarIcon from '../../assets/$.svg'
import squigleBg from '../../assets/footer_Squigle.svg'

// One product now: the 30-patch Party Pack. The only choice is how often it
// ships. More frequent delivery = bigger discount off the regular $90 price.
const PARTY_BASE = 90

const tiers = [
  {
    id: 'sub-30',
    cadence: 'EVERY 30 DAYS',
    subtitle: 'FOR THE REGULARS WHO GO OUT MOST WEEKENDS.',
    discount: 0.15,
    recommended: true,
  },
  {
    id: 'sub-60',
    cadence: 'EVERY 60 DAYS',
    subtitle: 'A STEADY STASH FOR THE EVERY-OTHER-WEEKEND CROWD.',
    discount: 0.10,
    recommended: false,
  },
  {
    id: 'sub-90',
    cadence: 'EVERY 90 DAYS',
    subtitle: 'STOCK UP AND COAST. FOR THE OCCASIONAL BIG NIGHT.',
    discount: 0.05,
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
  const { getProduct } = useCart()
  const partyBase = getProduct('party')?.price ?? PARTY_BASE
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
        <div className="absolute -bottom-px left-0 w-full leading-none z-10">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. SUBSCRIPTION TIERS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <h2 className="font-futura font-[900] text-[36px] text-pulsar-blue uppercase tracking-wide mb-4">
            ONE PACK, YOUR SCHEDULE
          </h2>

          {/* How it works */}
          <div className="max-w-[720px] mb-14">
            <p className="font-inter text-[15px] leading-[1.7] text-pulsar-dark mb-3">
              It's one pack, our 30-patch Party Pack, and the only thing you pick is how often it shows up. The more often it ships, the more you save off the regular {formatPrice(partyBase)} price.
            </p>
            <p className="font-inter text-[15px] leading-[1.7] text-gray-600">
              Every 30 days saves you 15%, every 60 days saves 10%, and every 90 days saves 5%. Same 30 patches each delivery, no lock-in. Skip, change your schedule, or cancel whenever you want.
            </p>
            <p className="font-futura font-[800] text-[13px] text-pulsar-blue uppercase tracking-wide mt-4">
              Subscriptions are launching soon. Pick your plan then.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {tiers.map((tier) => {
              const price = partyBase * (1 - tier.discount)
              return (
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
                    BEST VALUE
                  </span>
                )}

                {/* Image placeholder */}
                <div className="w-full aspect-[4/3] bg-pulsar-light-blue-bg rounded-[16px] mb-6 shadow-md"></div>

                {/* Discount badge */}
                <span className="inline-block bg-pulsar-pink text-white font-futura font-[900] text-[13px] uppercase tracking-wide px-4 py-1 rounded-full mb-4">
                  SAVE {tier.discount * 100}%
                </span>

                <h3 className="font-futura font-[900] text-[20px] text-pulsar-dark uppercase tracking-wide mb-1">
                  {tier.cadence}
                </h3>
                <p className="font-inter text-[12px] text-gray-500 uppercase tracking-wide mb-4">
                  {tier.subtitle}
                </p>

                <p className="font-futura font-[800] text-[16px] text-pulsar-blue uppercase tracking-wide mb-2">
                  30 PATCHES / DELIVERY
                </p>

                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="font-inter text-[14px] text-gray-400 line-through">{formatPrice(partyBase)}</span>
                  <span className="font-futura font-[900] text-[26px] text-pulsar-dark">{formatPrice(price)}</span>
                </div>
                <p className="font-inter text-[12px] text-gray-500 mb-6">per delivery</p>

                <button
                  disabled
                  className="bg-gray-200 text-gray-500 font-futura font-[800] text-[12px] uppercase tracking-wide px-10 py-2.5 rounded-full shadow-inner cursor-not-allowed"
                >
                  COMING SOON
                </button>
              </div>
              )
            })}
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
