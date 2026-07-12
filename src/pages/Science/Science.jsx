import { Link } from 'react-router-dom'
// Problem cards sit on the light-blue background, so blue icons
import pbDrop from '../../assets/icons/drops-blue.svg'
import pbCocktail from '../../assets/icons/cocktail-blue.svg'
import pbShield from '../../assets/icons/sheild-blue.svg'
import pbVitB from '../../assets/icons/vitamin-b-blue.svg'
// Ingredient cards sit on white, so pink icons (every ingredient ships a pink variant)
import igVitB from '../../assets/icons/vitamin-b-pink.svg'
import igVitB3 from '../../assets/icons/vitamin-b3-pink.svg'
import igVitB9 from '../../assets/icons/vitamin-b9-pink.svg'
import igGlutathione from '../../assets/icons/glutathione-pink.svg'
import igNac from '../../assets/icons/nac-pink.svg'
import igGinger from '../../assets/icons/ginger-pink.svg'
import squigleBg from '../../assets/Squigle_What is Pulsar.svg'

/* What a big night actually does to your body — the problem, four ways. */
const problems = [
  {
    icon: pbDrop,
    name: 'DEHYDRATION',
    text: 'Alcohol makes you lose more water than you take in. That is where the headache, dry mouth, and next-morning grogginess come from.',
  },
  {
    icon: pbCocktail,
    name: 'A TOXIC BYPRODUCT',
    text: 'Your body breaks alcohol down into acetaldehyde, a compound that hits harder than the drink itself until your liver clears it out.',
  },
  {
    icon: pbShield,
    name: 'OXIDATIVE STRESS',
    text: 'Processing a big night floods your cells with stress. Your natural defenses get outnumbered, and you feel it the next day.',
  },
  {
    icon: pbVitB,
    name: 'DRAINED NUTRIENTS',
    text: 'Alcohol burns through the B vitamins and nutrients your body runs on, leaving you foggy, wiped out, and low on energy.',
  },
]

/* How transdermal delivery works, made simple. */
const stages = [
  { n: '01', title: 'PEEL & STICK', text: 'Put a patch on a clean patch of skin before you go out, or right before bed.' },
  { n: '02', title: 'ABSORBS THROUGH SKIN', text: 'The ingredients pass through your skin instead of your gut, so nothing gets lost to digestion.' },
  { n: '03', title: 'STRAIGHT TO YOUR BLOOD', text: 'They enter your bloodstream directly, which means more of what you put on actually gets used.' },
  { n: '04', title: 'STEADY FOR 8+ HOURS', text: 'Instead of one big dose, it releases slowly while you sleep, right when your body does its recovery work.' },
]

const ingredients = [
  { name: 'VITAMIN B', amount: '717.5mcg', icon: igVitB, description: 'A vital nutrient that supports energy production, brain function, and helps your body recover after a night out.' },
  { name: 'VITAMIN B3', amount: '1,956.5mcg', icon: igVitB3, description: 'Also known as Niacin, B3 supports cellular repair, helps your body process alcohol, and promotes healthy circulation.' },
  { name: 'VITAMIN B9', amount: '239mcg', icon: igVitB9, description: 'Folate plays a key role in cell regeneration and helps replenish what alcohol depletes from your system.' },
  { name: 'GLUTATHIONE', amount: '9.5mg', icon: igGlutathione, description: "Your body's master antioxidant. It defends your cells from oxidative stress so you can bounce back faster the next morning." },
  { name: 'NAC (N-ACETYLCYSTEINE)', amount: '4.75mg', icon: igNac, description: 'NAC is like a helper for your liver. It gives your body the tools it needs to clean up the mess after a night of fun.' },
  { name: 'GINGER EXTRACT', amount: '1,435mcg', icon: igGinger, description: 'A natural stomach soother that eases nausea and supports digestion when your body needs it most.' },
]

/* Comparison rows: how the patch stacks up. y = yes, n = no, p = partial */
const compareRows = [
  { label: 'Bypasses your stomach', patch: 'y', pills: 'n', drinks: 'n' },
  { label: 'Works while you sleep', patch: 'y', pills: 'p', drinks: 'n' },
  { label: 'No water or chugging needed', patch: 'y', pills: 'n', drinks: 'n' },
  { label: 'Steady release over 8+ hours', patch: 'y', pills: 'n', drinks: 'n' },
  { label: "Won't upset your stomach", patch: 'y', pills: 'p', drinks: 'p' },
  { label: 'Nothing to remember mid-night', patch: 'y', pills: 'n', drinks: 'n' },
]

function Mark({ v }) {
  if (v === 'y') {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-pulsar-blue">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </span>
    )
  }
  if (v === 'p') {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14" /></svg>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </span>
  )
}

const heroLinks = [
  { label: 'The problem', href: '#problem' },
  { label: 'How it works', href: '#how-it-works' },
  { label: "What's inside", href: '#whats-inside' },
]

export default function Science() {
  return (
    <div className="w-full bg-white flex flex-col" id="science-page">

      {/* ═══ 1. HERO ═══ */}
      <section className="relative w-full min-h-[70vh] bg-pulsar-blue flex items-center overflow-hidden" id="science-hero">
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] w-full pt-20 pb-32">
          <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-white/70">The Science</span>
          <h1 className="font-futura font-bold text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] uppercase tracking-wide text-white mt-3 mb-5">
            LET'S GET NERDY.
          </h1>
          <p className="font-inter text-[18px] leading-[1.6] text-white/80 max-w-[560px] mb-8">
            We don't hide behind hype. Here's exactly what a hangover does to your body, what's in a Pulsar Patch, and why it actually works.
          </p>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {heroLinks.map((l) => (
              <a key={l.href} href={l.href} className="font-futura font-bold text-[13px] uppercase tracking-wide text-white border-b-2 border-white/40 pb-1 hover:border-pulsar-pink hover:text-pulsar-pink-light transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-px left-0 w-full leading-none z-10">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══ 2. THE PROBLEM ═══ */}
      <section className="bg-white py-[90px] lg:py-[110px]" id="problem">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[720px] mb-14">
            <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-pulsar-pink">The Problem</span>
            <h2 className="font-futura font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] text-pulsar-blue uppercase tracking-wide mt-3 mb-5">
              A hangover isn't just a headache
            </h2>
            <p className="font-inter text-[16px] leading-[1.6] text-pulsar-dark/70">
              It's your body dealing with the aftermath on four fronts at once. Here's what's actually going on under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="flex flex-col p-7 rounded-[24px] bg-pulsar-light-blue-bg h-full">
                <img src={p.icon} alt="" className="w-[52px] h-[52px] object-contain mb-5" />
                <h3 className="font-futura font-bold text-[16px] text-pulsar-blue uppercase tracking-wide mb-2">{p.name}</h3>
                <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark/70">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. HOW IT WORKS — transdermal stages ═══ */}
      <section className="relative bg-pulsar-blue pt-[90px] lg:pt-[110px] pb-[150px]" id="how-it-works">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[760px] mb-16">
            <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-white/60">How It Works</span>
            <h2 className="font-futura font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] text-white uppercase tracking-wide mt-3 mb-5">
              Why a patch, not a pill
            </h2>
            <p className="font-inter text-[16px] leading-[1.6] text-white/85">
              Pills and powders have to survive your stomach first, and a rough night is the worst time to keep something down. A transdermal patch skips all of that and delivers steadily, straight through your skin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {stages.map((s) => (
              <div key={s.n} className="flex flex-col">
                <span className="font-futura font-bold text-[44px] text-white/30 leading-none mb-4">{s.n}</span>
                <div className="w-full h-[2px] bg-white/20 mb-5" />
                <h3 className="font-futura font-bold text-[16px] text-white uppercase tracking-wide mb-2">{s.title}</h3>
                <p className="font-inter text-[14px] leading-[1.6] text-white/80">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-px left-0 w-full leading-none z-10">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══ 4. WHAT'S INSIDE ═══ */}
      <section className="bg-white py-[90px] lg:py-[110px]" id="whats-inside">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="text-center mb-14">
            <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-pulsar-pink">What's Inside</span>
            <h2 className="font-futura font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] text-pulsar-blue uppercase tracking-wide mt-3 mb-5">
              Six ingredients, doing real work
            </h2>
            <p className="font-inter text-[16px] leading-[1.6] text-pulsar-dark/70 max-w-[600px] mx-auto">
              No mystery blend, no filler. Every ingredient is here for a reason, and we list exactly how much of each you get.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ingredients.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-[24px] border-2 border-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-pulsar-blue/30">
                <img src={item.icon} alt="" className="w-[60px] h-[60px] object-contain mb-6" />
                <h3 className="font-futura font-bold text-[17px] text-pulsar-blue uppercase tracking-wide mb-1">{item.name}</h3>
                <span className="font-inter font-[600] text-[13px] text-pulsar-pink mb-4">{item.amount}</span>
                <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. COMPARISON ═══ */}
      <section className="bg-pulsar-light-blue-bg py-[90px] lg:py-[110px]" id="compare">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[720px] mb-12">
            <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-pulsar-pink">The Difference</span>
            <h2 className="font-futura font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] text-pulsar-blue uppercase tracking-wide mt-3 mb-5">
              Patch vs. the usual suspects
            </h2>
            <p className="font-inter text-[16px] leading-[1.6] text-pulsar-dark/70">
              Recovery pills and drink mixes can help, but they fight your stomach and fade fast. Here's how the patch compares.
            </p>
          </div>

          {/* Scrolls sideways on small screens so nothing gets crushed */}
          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] border-collapse bg-white rounded-[20px] overflow-hidden shadow-sm">
              <thead>
                <tr>
                  <th className="text-left font-futura font-bold text-[12px] uppercase tracking-widest text-gray-400 p-5 w-[40%]">What matters</th>
                  <th className="p-4 bg-pulsar-blue">
                    <span className="font-futura font-bold text-[13px] uppercase tracking-wide text-white">Pulsar Patch</span>
                  </th>
                  <th className="p-4 font-futura font-bold text-[13px] uppercase tracking-wide text-gray-500">Pills & Capsules</th>
                  <th className="p-4 font-futura font-bold text-[13px] uppercase tracking-wide text-gray-500">Powder Drinks</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="font-inter text-[14px] text-pulsar-dark p-5">{row.label}</td>
                    <td className="text-center p-4 bg-pulsar-blue/5"><div className="flex justify-center"><Mark v={row.patch} /></div></td>
                    <td className="text-center p-4"><div className="flex justify-center"><Mark v={row.pills} /></div></td>
                    <td className="text-center p-4"><div className="flex justify-center"><Mark v={row.drinks} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-inter text-[12px] text-gray-400 mt-4">Full circle = yes. Dash = sometimes or partly. Empty = no.</p>
        </div>
      </section>

      {/* ═══ 6. MARQUEE ═══ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-bold text-white text-[18px] uppercase tracking-[2px] mx-10 flex items-center gap-4">
              THE SCIENCE <span className="text-[20px]">→</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══ 7. THE HONEST BIT ═══ */}
      <section className="bg-white py-[90px] lg:py-[110px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[820px]">
            <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-pulsar-pink">Straight Talk</span>
            <h2 className="font-futura font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] text-pulsar-blue uppercase tracking-wide mt-3 mb-6">
              No white coats, no wild claims
            </h2>
            <p className="font-inter text-[16px] leading-[1.7] text-pulsar-dark/80 mb-5">
              We're not going to invent a study or put a stock-photo doctor on a banner. Pulsar is built on well-understood ingredients and a delivery method that has been around for decades.
            </p>
            <p className="font-inter text-[16px] leading-[1.7] text-pulsar-dark/80">
              We tell you exactly what's in it, how much, and what each part is for. Then we let it speak for itself. That's the whole pitch.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 8. CTA ═══ */}
      <section className="relative bg-pulsar-pink py-[80px] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: `url('${squigleBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] flex flex-col items-center gap-8">
          <h2 className="font-futura font-bold text-[clamp(1.75rem,5vw,3rem)] leading-none text-white uppercase tracking-wide text-center">
            READY TO TRY IT?
          </h2>
          <Link to="/shop" className="inline-flex items-center gap-3 bg-white text-pulsar-pink font-futura font-bold text-[15px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-dark hover:text-white hover:-translate-y-0.5 group">
            SHOP NOW
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>

      {/* ═══ 9. DISCLAIMERS ═══ */}
      <section className="bg-white py-[60px] border-t border-gray-200">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
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
