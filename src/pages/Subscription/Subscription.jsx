import { useState } from 'react'
import { useCart, formatPrice } from '../../context/CartContext'
import CurvedFeature from '../../components/CurvedFeature/CurvedFeature'
import subHeroBg from '../../assets/subscription-hero.jpg'
import cheersIcon from '../../assets/Cheers_icon.svg'
import calendarIcon from '../../assets/Calender_icon.svg'
import dollarIcon from '../../assets/$.svg'
import squigleBg from '../../assets/footer_Squigle.svg'

// One product: the 30-patch Party Pack. Buy it once for the regular price, or
// subscribe and save a flat 15% on every shipment. The only choice on the
// subscription is how often it ships. Every 2 months is emphasized as the most
// popular cadence — repeat 30-pack buyers commonly reorder around that timeframe.
const PARTY_BASE = 90
const SUB_DISCOUNT = 0.15

const frequencies = [
  { id: 'monthly', label: 'Every month', badge: null, recommended: false },
  { id: 'bimonthly', label: 'Every 2 months', badge: 'Most Popular', recommended: true },
  { id: 'quarterly', label: 'Every 3 months', badge: null, recommended: false },
]

const subPerks = ['15% savings', 'Free shipping', 'Skip, pause, or cancel anytime']

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
  const { getProduct, addToCart } = useCart()
  const partyBase = getProduct('party')?.price ?? PARTY_BASE
  const subPrice = partyBase * (1 - SUB_DISCOUNT)
  const [frequency, setFrequency] = useState('bimonthly')
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
         2. BUY ONCE OR SUBSCRIBE & SAVE
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-16">
          <h2 className="font-futura font-[900] text-[36px] text-pulsar-blue uppercase tracking-wide mb-4">
            ONE PACK, YOUR SCHEDULE
          </h2>

          {/* How it works */}
          <div className="max-w-[720px] mb-14">
            <p className="font-inter text-[15px] leading-[1.7] text-pulsar-dark mb-3">
              It's one pack, our 30-patch Party Pack. Buy it once for {formatPrice(partyBase)}, or subscribe and save 15% on every shipment with free shipping. You pick how often it shows up, and you can skip, pause, or cancel anytime.
            </p>
            <p className="font-futura font-[800] text-[13px] text-pulsar-blue uppercase tracking-wide mt-4">
              Subscriptions are launching soon. Pick your plan then.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* ── OPTION 1: ONE-TIME ── */}
            <div className="flex flex-col p-8 rounded-[24px] border-2 border-gray-200">
              <span className="font-futura font-[900] text-[12px] text-gray-400 uppercase tracking-widest mb-2">Option 1</span>
              <h3 className="font-futura font-[900] text-[22px] text-pulsar-dark uppercase tracking-wide mb-5">One-Time Purchase</h3>
              <div className="w-full aspect-[16/9] bg-pulsar-light-blue-bg rounded-[16px] mb-6 shadow-sm"></div>
              <p className="font-futura font-[800] text-[15px] text-pulsar-blue uppercase tracking-wide mb-1">30 Patches</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-futura font-[900] text-[34px] text-pulsar-dark">{formatPrice(partyBase)}</span>
                <span className="font-inter text-[13px] text-gray-500">one time</span>
              </div>
              <p className="font-inter text-[13px] leading-[1.6] text-gray-600 mb-6">
                One 30-patch Party Pack, no commitment. Order whenever you need a refill.
              </p>
              <button
                onClick={() => addToCart('party')}
                className="mt-auto bg-pulsar-pink text-white font-futura font-[800] text-[13px] uppercase tracking-widest px-10 py-3 rounded-full shadow-md transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
              >
                Add to cart
              </button>
            </div>

            {/* ── OPTION 2: SUBSCRIBE & SAVE (emphasized) ── */}
            <div className="relative flex flex-col p-8 rounded-[24px] border-2 border-pulsar-blue shadow-glow-blue">
              <span className="absolute -top-3 left-8 bg-pulsar-pink text-white font-futura font-[900] text-[11px] uppercase tracking-widest px-3 py-1 rounded-full">Save 15%</span>
              <span className="font-futura font-[900] text-[12px] text-pulsar-blue uppercase tracking-widest mb-2">Option 2</span>
              <h3 className="font-futura font-[900] text-[22px] text-pulsar-dark uppercase tracking-wide mb-5">Subscribe &amp; Save</h3>
              <div className="w-full aspect-[16/9] bg-pulsar-light-blue-bg rounded-[16px] mb-6 shadow-md"></div>
              <p className="font-futura font-[800] text-[15px] text-pulsar-blue uppercase tracking-wide mb-1">30 Patches / shipment</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-inter text-[15px] text-gray-400 line-through">{formatPrice(partyBase)}</span>
                <span className="font-futura font-[900] text-[34px] text-pulsar-blue">{formatPrice(subPrice)}</span>
              </div>
              <p className="font-inter text-[12px] text-gray-500 mb-5">per shipment</p>

              {/* Perks */}
              <ul className="flex flex-col gap-2 mb-7">
                {subPerks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-pulsar-blue text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="font-inter text-[13px] text-pulsar-dark">{perk}</span>
                  </li>
                ))}
              </ul>

              {/* Delivery frequency */}
              <p className="font-futura font-[800] text-[12px] text-pulsar-dark uppercase tracking-widest mb-3">Delivery frequency</p>
              <div className="flex flex-col gap-3 mb-7">
                {frequencies.map((f) => {
                  const selected = frequency === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFrequency(f.id)}
                      className={`flex items-center justify-between gap-3 w-full text-left rounded-full border-2 px-5 py-3 transition-all ${
                        selected ? 'border-pulsar-blue bg-pulsar-light-blue-bg/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-pulsar-blue' : 'border-gray-300'}`}>
                          {selected && <span className="w-2 h-2 rounded-full bg-pulsar-blue" />}
                        </span>
                        <span className="font-futura font-[800] text-[13px] text-pulsar-dark uppercase tracking-wide">{f.label}</span>
                      </span>
                      {f.badge && (
                        <span className="shrink-0 bg-pulsar-pink text-white font-futura font-[900] text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full">{f.badge}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                disabled
                className="mt-auto bg-gray-200 text-gray-500 font-futura font-[800] text-[13px] uppercase tracking-widest px-10 py-3 rounded-full shadow-inner cursor-not-allowed"
              >
                COMING SOON
              </button>
            </div>
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
