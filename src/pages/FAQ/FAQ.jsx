import { useState } from 'react'
import { Link } from 'react-router-dom'
import squigleBg from '../../assets/footer_Squigle.svg'

const faqs = [
  {
    q: "What exactly is Pulsar Patch?",
    a: "Think of it as your wingman that actually shows up the next morning. Pulsar Patch is a transdermal patch that delivers six active ingredients (Vitamin B, B3, B9, Glutathione, NAC, and Ginger Extract) straight into your bloodstream over 8 to 12 hours while you sleep. No pills, no powders, no blending anything at 2am."
  },
  {
    q: "How do I use it?",
    a: "It's stupid simple. Peel the backing, stick it on clean, dry skin (inner arm, upper arm, or shoulder), press for 10 seconds, and you're done. If you can put on a Band-Aid, you can use Pulsar."
  },
  {
    q: "When should I put it on?",
    a: "About 30 minutes before your first drink. Think of it as part of your getting-ready routine. Outfit, check. Keys, check. Patch, check."
  },
  {
    q: "How long do I wear it?",
    a: "8 to 12 hours. Slap it on before you head out, forget about it while you're having fun, and peel it off the next morning. It does its thing while you do yours."
  },
  {
    q: "Does it work after I've already been drinking?",
    a: "Better late than never, right? It's most effective when applied before or during drinking, but it can still help if you put it on later. That said, the earlier you apply it, the more time your body has to put those ingredients to work."
  },
  {
    q: "Is Pulsar a hangover cure?",
    a: "If it was, we'd be writing this from a yacht. Pulsar is designed to support your body's natural recovery process with six clinically-backed ingredients. It's not magic, it's just really good preparation. (\"Hangover Defense Patch\" is a product descriptor only and does not imply prevention, treatment, or cure of hangovers or intoxication. Results may vary. Statements have not been evaluated by the FDA.)"
  },
  {
    q: "What's inside the patch?",
    a: "No mystery blends here. Six ingredients, all listed: Vitamin B (717.5mcg), Vitamin B3 (1,956.5mcg), Vitamin B9 (239mcg), Glutathione (9.5mg), NAC/N-Acetylcysteine (4.75mg), and Ginger Extract (1,435mcg). That's it. We're not hiding anything because we don't need to."
  },
  {
    q: "Where should I stick it?",
    a: "Somewhere your friends won't try to peel it off as a joke. But seriously: inner arm, upper arm, or shoulder work best. Clean, dry, hairless skin. Avoid spots with lotion or sunscreen. Going out two nights in a row? Just rotate the spot."
  },
  {
    q: "Can I shower with it on?",
    a: "Absolutely. The patch is water resistant, so shower away. It's not going anywhere. We built it to survive your morning routine, not just your night out."
  },
  {
    q: "Can I wear more than one?",
    a: "We get it, you're ambitious. But one patch is all you need. Each one is formulated to deliver the right dose over the full wear period. More patches doesn't mean more results, it just means wasted patches."
  },
  {
    q: "Can I use Pulsar without drinking?",
    a: "You could, but it would be like bringing an umbrella to a sunny day. The ingredients are specifically chosen to support recovery after drinking. On a chill night in, save your patches for when they'll actually do something."
  },
  {
    q: "How often can I use it?",
    a: "As often as you go out. One patch per night, and most of our customers use them one to three times a week. Friday and Saturday plans? Fresh patch each night, different spot on the skin. Simple."
  },
  {
    q: "Do I need to take it off before bed?",
    a: "Please don't. Bedtime is when Pulsar does its best work. The patch delivers ingredients steadily through the night while your body recovers. Just leave it on, get some sleep, and peel it off when your alarm goes off."
  },
  {
    q: "What makes Pulsar different?",
    a: "Most hangover products want you to swallow something while your stomach is already having a rough night. We skipped that entirely. Pulsar uses transdermal delivery to go straight through your skin into your bloodstream. No digestion required. Better absorption, zero stomach issues, and you only think about it once. Stick it and forget it."
  },
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <div className="w-full bg-white flex flex-col" id="faq-page">

      {/* Hero */}
      <section className="relative w-full bg-pulsar-pink pb-[120px] overflow-hidden">
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-14 pb-8">
          <h1 className="font-futura font-bold text-[clamp(2rem,7vw,54px)] text-white uppercase tracking-wide">
            FAQS
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
          <div className="w-full">
            <div className="flex flex-col border-t border-pulsar-blue/30">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-pulsar-blue/30 cursor-pointer group"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <div className="flex justify-between items-center py-6">
                    <span className="font-inter font-[600] text-[16px] text-pulsar-dark pr-8">{faq.q}</span>
                    <span
                      className="text-pulsar-blue text-[24px] leading-none transition-transform duration-300 shrink-0"
                      style={{ transform: activeIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="font-inter text-[14px] leading-[1.8] text-gray-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing CTA */}
          <div className="mt-16 bg-pulsar-light-blue-bg rounded-[24px] px-6 sm:px-10 py-12 text-center">
            <h2 className="font-futura font-bold text-[clamp(1.5rem,4vw,32px)] text-pulsar-blue uppercase tracking-wide mb-3">
              STILL HAVE QUESTIONS?
            </h2>
            <p className="font-inter text-[15px] leading-[1.7] text-gray-600 max-w-[520px] mx-auto mb-8">
              Grab a pack and see for yourself, or reach out and we'll sort you out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-[1px] px-8 py-3 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
              >
                Shop patches
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-pulsar-blue border-2 border-pulsar-blue font-futura font-bold text-[13px] uppercase tracking-[1px] px-8 py-3 rounded-full transition-all duration-300 hover:bg-pulsar-blue hover:text-white hover:-translate-y-0.5"
              >
                Still stuck? Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
