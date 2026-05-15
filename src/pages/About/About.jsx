import { Link } from 'react-router-dom'
import aboutHeroImg from '../../assets/About Us hero IMG.jpg'
import iconCocktail from '../../assets/Cocktail_Icon.svg'
import iconLocation from '../../assets/Location_Icon.svg'
import iconColor from '../../assets/Color_Icon.svg'
import WaveDivider from '../../components/WaveDivider/WaveDivider'
import './About.css'

export default function About() {
  return (
    <div className="w-full bg-white" id="about-page">

      {/* ═══════════════════════════════════════════════════════════
         1. HERO SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-white flex flex-col" id="about-hero">
        {/* Image starts at the very top, behind absolute header */}
        <div className="w-full h-[75vh] lg:h-[80vh] relative overflow-hidden">
          <img 
            src={aboutHeroImg} 
            alt="About Us Hero" 
            className="w-full h-full object-cover object-top block"
          />
        </div>
        <div className="max-w-[1920px] mx-auto w-full px-[140px] pt-[24px] pb-[100px] flex flex-col items-center">
          <h1 className="font-futura font-[900] text-[54px] text-pulsar-blue uppercase tracking-wide text-center leading-[1.1] mb-2">
            HEY, WERE PULSAR.
          </h1>
          <p className="font-futura font-[800] text-[24px] text-pulsar-pink uppercase tracking-wide text-center">
            Let's Catch up
          </p>

          {/* Dashed divider */}
          <div className="w-full max-w-[1400px] border-t-[3px] border-dashed border-pulsar-blue my-[50px]"></div>

          {/* Icons Grid */}
          <div className="flex justify-between items-start w-full max-w-[1400px] gap-12">
            <div className="flex flex-col items-center flex-1 text-center px-4">
              <img src={iconLocation} alt="Location" className="w-[60px] h-[60px] mb-6" />
              <p className="font-futura font-[800] text-[18px] text-pulsar-blue uppercase tracking-wide">
                WE STARTED IN 2023<br />IN PHOENIX, AZ
              </p>
            </div>
            <div className="flex flex-col items-center flex-1 text-center px-4 border-x-2 border-transparent lg:border-pulsar-pink/20">
              <img src={iconColor} alt="Color" className="w-[60px] h-[60px] mb-6" />
              <p className="font-futura font-[800] text-[18px] text-pulsar-blue uppercase tracking-wide">
                OUR FAVORITE COLOR<br />IS BLUE AND <span className="text-pulsar-pink">PINK</span>
              </p>
            </div>
            <div className="flex flex-col items-center flex-1 text-center px-4">
              <img src={iconCocktail} alt="Cocktail" className="w-[60px] h-[60px] mb-6" />
              <p className="font-futura font-[800] text-[18px] text-pulsar-blue uppercase tracking-wide">
                OUR NEW HOBBY IS<br />HOME BARTENDING
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. OUR GOAL
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden flex min-h-[600px]">
        {/* Left: Image Placeholder */}
        <div className="flex-[0_0_50%] bg-[#555555]"></div>

        {/* Right: Content */}
        <div className="flex-[0_0_50%] bg-pulsar-blue p-[140px] pb-[220px]">
          <h2 className="font-futura font-[900] text-[48px] text-white uppercase tracking-wide mb-8">Our Goal</h2>
          <p className="font-inter text-[16px] text-white leading-[1.6] max-w-[600px]">
            Pulsar exists to protect your tomorrow: your clarity, your energy, your hustle. Because three drinks with friends shouldn't hinder your morning, your momentum, or your mood. Good nights should lead to great days.
          </p>
        </div>

        {/* Bottom Wave Mask overlay */}
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
          <WaveDivider topColor="transparent" bottomColor="white" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. OUR FOUNDATION
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px] w-full" id="foundation">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-[900] text-[42px] text-pulsar-blue uppercase tracking-wide mb-16 text-left">OUR FOUNDATION</h2>

          <div className="grid grid-cols-3 gap-[80px]">
            {/* Box 1 */}
            <div className="flex flex-col text-center items-center">
              <div className="w-full aspect-square bg-[#555555] rounded-[30px] mb-8 shadow-md"></div>
              <h3 className="font-futura font-[900] text-[20px] text-pulsar-blue uppercase mb-4 tracking-wide">COMMUNITY IS FIRST</h3>
              <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark max-w-[320px]">
                We build Pulsar with our people, not just for them. From first-time users to longtime fans, everything we create is designed to support real nights, real mornings, and a community that looks out for each other.
              </p>
            </div>
            {/* Box 2 */}
            <div className="flex flex-col text-center items-center">
              <div className="w-full aspect-square bg-[#555555] rounded-[30px] mb-8 shadow-md"></div>
              <h3 className="font-futura font-[900] text-[20px] text-pulsar-blue uppercase mb-4 tracking-wide">BOLDLY STAND OUT</h3>
              <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark max-w-[320px]">
                We don't whisper in a loud room—we show up with confidence. Pulsar challenges outdated wellness norms by being unapologetically visible, design-forward, and willing to say what others won't, while still delivering a product that works.
              </p>
            </div>
            {/* Box 3 */}
            <div className="flex flex-col text-center items-center">
              <div className="w-full aspect-square bg-[#555555] rounded-[30px] mb-8 shadow-md"></div>
              <h3 className="font-futura font-[900] text-[20px] text-pulsar-blue uppercase mb-4 tracking-wide">HUMBLE HUMOR</h3>
              <p className="font-inter text-[14px] leading-[1.6] text-pulsar-dark max-w-[320px]">
                We take recovery seriously, not ourselves. Pulsar uses wit and self-awareness to make wellness approachable—never preachy, never judgmental, always human.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         4. MARQUEE
         ═══════════════════════════════════════════════════════════ */}
      <div className="w-full bg-pulsar-pink py-4 overflow-hidden flex items-center">
        <div className="whitespace-nowrap flex animate-marquee-reverse">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-[900] text-[24px] text-white uppercase tracking-[3px] mx-12">
              pulsar.
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         5. THE PROBLEM
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full flex min-h-[600px]">
        {/* Left: Image Placeholder */}
        <div className="flex-[0_0_50%] bg-[#555555]"></div>

        {/* Right: Content */}
        <div className="flex-[0_0_50%] bg-pulsar-blue p-[140px] flex flex-col justify-center">
          <h2 className="font-futura font-[900] text-[48px] text-white uppercase tracking-wide mb-8">THE PROBLEM</h2>
          <p className="font-inter text-[16px] text-white leading-[1.6] max-w-[600px]">
            Hangovers slow us down. They steal mornings, fog up focus, ruin good intentions, and turn simple plans into cancellations. And these days, it doesn't take five shots. Sometimes even one drink hits harder than it should.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         6. OUR STORY
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full flex min-h-[600px]">
        {/* Left: Content */}
        <div className="flex-[0_0_50%] bg-pulsar-blue p-[140px] flex flex-col justify-center items-start text-left">
          <div className="max-w-[600px]">
            <h2 className="font-futura font-[900] text-[48px] text-white uppercase tracking-wide mb-8">OUR STORY</h2>
            <div className="font-inter text-[16px] text-white leading-[1.6] flex flex-col gap-4">
              <p>
                At 21, I woke up with a hangover so brutal it felt like my body filed a formal complaint.<br />
                After the Advil and questioning all my decisions, one thought stuck:
              </p>
              <p>There has to be a better way.</p>
              <p>
                I searched for something clean and effective, found nothing, and decided to make it myself.<br />
                What started as a personal fix is now a five-person team proving a simple truth:
              </p>
              <p>You don't have to choose: you can have the night and the morning.</p>
            </div>
          </div>
        </div>

        {/* Right: Image Placeholder */}
        <div className="flex-[0_0_50%] bg-[#555555]"></div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         7. BE APART OF THE JOURNEY
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[100px] w-full relative z-10" id="journey">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-[900] text-[42px] text-pulsar-blue uppercase tracking-wide mb-16">BE APART OF THE JOURNEY!</h2>

          <div className="grid grid-cols-3 gap-[80px]">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative w-full aspect-square bg-[#555555] rounded-[30px] overflow-hidden shadow-xl">
                {/* Optional icon overlay in bottom-right */}
                <div className="absolute bottom-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="transparent" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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
