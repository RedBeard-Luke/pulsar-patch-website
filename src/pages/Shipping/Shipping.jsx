import { Link } from 'react-router-dom'
import squigleBg from '../../assets/footer_Squigle.svg'

export default function Shipping() {
  return (
    <div className="w-full bg-white flex flex-col" id="shipping-page">

      {/* Hero */}
      <section className="relative w-full bg-pulsar-pink pb-[120px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-14 pb-8">
          <h1 className="font-futura font-bold text-[clamp(2.25rem,7vw,3.5rem)] text-white uppercase tracking-wide">
            SHIPPING POLICY
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[900px]">

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Where does my order ship from?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Everything ships from right here in the US. Pulsar Patch is made in America, and your order goes out from our warehouse.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">When will my order ship?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              We move fast. Orders ship within 1–2 business days of being placed. Once it's on its way, standard delivery usually lands in about 3–7 business days.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">How much is shipping?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Shipping is free on every order over $35. That's it. No fine print.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Will I get a tracking number?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Yep. We email you a tracking number the moment your order ships, so you can follow it right to your door. Got a question about your tracking? Just <Link to="/contact" className="text-pulsar-blue underline hover:text-pulsar-pink transition-colors">reach out</Link> and we'll help.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Something went wrong with my delivery?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700">
              It happens. If your package is lost, late, or shows up looking rough, <Link to="/contact" className="text-pulsar-blue underline hover:text-pulsar-pink transition-colors">contact us</Link> and we'll make it right.
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
