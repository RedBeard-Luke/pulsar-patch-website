import squigleBg from '../../assets/footer_Squigle.svg'

export default function Refunds() {
  return (
    <div className="w-full bg-white flex flex-col" id="refunds-page">

      {/* Hero */}
      <section className="relative w-full bg-pulsar-pink pb-[120px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[140px] pb-[20px]">
          <h1 className="font-futura font-bold text-[54px] text-white uppercase tracking-wide">
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
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <div className="max-w-[900px]">

            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              To start a return, you can contact us at hello@pulsarpatch.com
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              You can always contact us for any return question at hello@pulsarpatch.com
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Damages and issues</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Non-returnable items</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Unfortunately, we cannot accept returns on sale items or gift cards.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Exchanges</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">European Union 14 day cooling off period</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-10">
              Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>

            <h2 className="font-futura font-bold text-[24px] text-pulsar-blue uppercase tracking-wide mb-4">Refunds</h2>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-4">
              We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
            <p className="font-inter text-[15px] leading-[1.8] text-gray-700">
              If more than 15 business days have passed since we've approved your return, please contact us at aaron@pulsarpatch.com
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
