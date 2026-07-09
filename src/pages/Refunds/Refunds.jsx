import squigleBg from '../../assets/footer_Squigle.svg'

export default function Refunds() {
  return (
    <div className="w-full bg-white flex flex-col" id="refunds-page">

      {/* Hero */}
      <section className="relative w-full bg-pulsar-pink pb-[120px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-14 pb-8">
          <h1 className="font-futura font-bold text-[clamp(2.25rem,7vw,3.5rem)] text-white uppercase tracking-wide">
            REFUND POLICY
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
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <div className="max-w-[900px]">

            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Not happy with your patches? No stress. You've got 30 days from the day your order arrives to send back any unopened patches for a full refund.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">How to start a return</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Just email us at <a href="mailto:hello@pulsarpatch.com" className="text-pulsar-blue underline hover:text-pulsar-pink transition-colors">hello@pulsarpatch.com</a> and we'll walk you through it. Please make sure the patches are unopened and in their original packaging so we can process your refund.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Damaged or wrong order?</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              If your order shows up damaged, or you got something you didn't order, that's on us. Email <a href="mailto:hello@pulsarpatch.com" className="text-pulsar-blue underline hover:text-pulsar-pink transition-colors">hello@pulsarpatch.com</a> and we'll make it right, fast.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Refunds</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700">
              Once we get your return and check it over, we'll refund your original payment method. It usually lands within a few business days, though your bank or card company may take a little longer to post it. Questions? Hit us up any time at <a href="mailto:hello@pulsarpatch.com" className="text-pulsar-blue underline hover:text-pulsar-pink transition-colors">hello@pulsarpatch.com</a>.
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
