import squigleBg from '../../assets/footer_Squigle.svg'

export default function Shipping() {
  return (
    <div className="w-full bg-white flex flex-col" id="shipping-page">

      {/* Hero */}
      <section className="relative w-full bg-pulsar-pink pb-[120px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[140px] pb-[20px]">
          <h1 className="font-futura font-bold text-[54px] text-white uppercase tracking-wide">
            SHIPPING POLICY
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="max-w-[900px]">

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">I just placed an order. When will it ship?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Please allow 3–7 business days of processing and production time for your order to ship out.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">How long is the shipping time?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              Our orders will be shipped depending on the fulfillment center the product is from.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              Average transit times to United States: 3 – 10 business days.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              There are circumstances that are out of control (natural disasters, holidays, weather, etc.) that may cause shipping postponements. While most packages will arrive on time, there may be circumstances and delays that our carriers may experience. For this reason, we do not guarantee the exact delivery time; the delivery issue is the responsibility of the shipping company.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Will I receive a tracking number?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              We provide tracking for every order. Tracking will be available once your product is shipped. Each individual product may be shipped from different fulfillment centers across the globe as our product research team spends the time to source quality yet affordable products.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              When you receive your tracking number, if you need help tracking your order, you can go to our order tracking page.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Can I cancel my order?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700">
              You are able to cancel your order with no penalty! You must cancel your order 12 hours after creating it for the cancellation to be applied. If the item has already shipped, please contact us via our Contact Us page. All you need to do is send us an email with the subject line "cancel".
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
