import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import WaveDivider from '../../components/WaveDivider/WaveDivider'
import iconDrop from '../../assets/Drop_Icon.svg'
import iconMuscle from '../../assets/Muscle_Icon.svg'
import iconLeaf from '../../assets/Leaf_icon Pink.svg'
import iconShield from '../../assets/Sheild_Icon Pink.svg'
import squigleBg from '../../assets/Squigle_What is Pulsar.svg'
import './Shop.css'

const products = [
  { id: 1, cartId: 'single',   name: 'SINGLE PATCH',    price: '$6.00',   originalPrice: null },
  { id: 2, cartId: '3pack',    name: '3 PATCH BUNDLE',  price: '$15.80',  originalPrice: '$18.00' },
  { id: 3, cartId: '6pack',    name: '6 PATCH COMBO',   price: '$25.20',  originalPrice: '$36.00' },
  { id: 4, cartId: 'kickback', name: 'KICK BACK PACK',  price: '$35.33',  originalPrice: '$60.00' },
  { id: 5, cartId: 'party',    name: 'PARTY PACK',      price: '$90.00',  originalPrice: '$180.00' },
]

export default function Shop() {
  const { addToCart } = useCart()
  return (
    <div className="w-full bg-white flex flex-col" id="shop-page">

      {/* ═══════════════════════════════════════════════════════════
         1. SHOP ALL HEADER & GRID
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full pt-[60px] pb-[80px] bg-white">
        <div className="max-w-[1920px] mx-auto px-[140px] flex flex-col items-center">
          <h1 className="font-futura font-[900] text-[48px] text-pulsar-blue uppercase tracking-wide mb-16">
            SHOP ALL
          </h1>

          {/* Product Grid (5 items) */}
          <div className="grid grid-cols-5 gap-8 w-full max-w-[1400px]">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col items-center text-center group transition-transform hover:-translate-y-2">
                <Link to={`/product/${product.id}`} className="w-full flex flex-col items-center">
                  {/* Square Image Placeholder */}
                  <div className="w-full aspect-square bg-[#757575] rounded-[24px] mb-6 shadow-md overflow-hidden">
                    {/* Img will go here */}
                  </div>

                  {/* Info */}
                  <h3 className="font-futura font-[800] text-[16px] text-pulsar-blue uppercase mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <p className="font-inter font-[600] text-[14px] text-gray-800">
                      {product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="font-inter font-[400] text-[12px] text-gray-400 line-through decoration-pulsar-pink">
                        {product.originalPrice}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.cartId)}
                  className="bg-pulsar-pink text-white font-futura font-[800] text-[12px] uppercase tracking-wide px-10 py-2.5 rounded-full shadow-lg transition-transform hover:bg-[#c9548f] hover:-translate-y-0.5"
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. MARQUEE
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-[900] text-white text-[20px] uppercase tracking-[3px] mx-10 flex items-center gap-10">
              SHOP NOW <span>→</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. WHAT IS PULSAR
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-white" id="what-is-pulsar">
        
        {/* ── BLUE ZONE: Headers + Background Pattern ── */}
        <div className="relative bg-[#44C8E8] pt-[80px] pb-[40px]">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 z-0 opacity-15" 
            style={{ 
              backgroundImage: `url('${squigleBg}')`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>

          <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] flex items-end gap-[80px]">
            {/* Left Spacer for overlapping image */}
            <div className="flex-[0_0_45%] h-[120px]">
              {/* This empty space allows the image from below to push up into the blue area */}
            </div>
            
            {/* Right: Title */}
            <div className="flex-1 flex flex-col items-start justify-end pb-4">
              <h2 className="font-futura font-[900] text-[48px] text-white uppercase tracking-wide leading-none">
                WHAT IS PULSAR?
              </h2>
            </div>
          </div>
        </div>

        {/* ── WHITE ZONE: Icons & Image Overlap ── */}
        <div className="relative bg-white z-20">
          <div className="max-w-[1920px] mx-auto px-[140px] pb-[160px] flex items-stretch gap-[80px]">
            
            {/* Left Column: Overlapping Image Placeholder */}
            <div className="flex-[0_0_45%] relative">
              <div className="absolute -top-[160px] left-0 w-full aspect-[4/5] bg-[#757575] rounded-[30px] shadow-2xl z-10"></div>
            </div>
            
            {/* Right Column: Icon List */}
            <div className="flex-1 flex flex-col items-start pt-[60px]">
              <div className="flex flex-col gap-10 w-full max-w-[500px]">
                {/* Item 1 */}
                <div className="flex gap-6 items-start">
                  <img src={iconDrop} alt="Icon" className="w-[60px] h-[60px] shrink-0 mt-1 object-contain" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-[#44C8E8] uppercase mb-1">NO GIMMICKS, JUST SCIENCE</h3>
                    <p className="font-inter text-gray-700 text-[14px] leading-[1.6]">
                      Pulsar doesn't hide behind secrets or hype. It's simply a smarter, science-backed way to tackle an age-old problem.
                    </p>
                  </div>
                </div>
                
                {/* Item 2 */}
                <div className="flex gap-6 items-start">
                  <img src={iconMuscle} alt="Icon" className="w-[60px] h-[60px] shrink-0 mt-1 object-contain" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-[#44C8E8] uppercase mb-1">YOUR NEW RECOVERY CREW</h3>
                    <p className="font-inter text-gray-700 text-[14px] leading-[1.6]">
                      After a night out, your body kicks into recovery mode, and Pulsar supports that natural process so you can wake up feeling clearer and more refreshed.
                    </p>
                  </div>
                </div>
                
                {/* Item 3 */}
                <div className="flex gap-6 items-start">
                  <img src={iconLeaf} alt="Icon" className="w-[60px] h-[60px] shrink-0 mt-1 object-contain" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-[#44C8E8] uppercase mb-1">NAC</h3>
                    <p className="font-inter text-gray-700 text-[14px] leading-[1.6]">
                      NAC is like a helper for your liver. It gives your body the tools it needs to clean up the mess after a night of fun.
                    </p>
                  </div>
                </div>
                
                {/* Item 4 */}
                <div className="flex gap-6 items-start">
                  <img src={iconShield} alt="Icon" className="w-[60px] h-[60px] shrink-0 mt-1 object-contain" />
                  <div>
                    <h3 className="font-futura font-bold text-[18px] text-[#44C8E8] uppercase mb-1">GLUTETHIOMINE</h3>
                    <p className="font-inter text-gray-700 text-[14px] leading-[1.6]">
                      Glutathione works like your body's tiny shield, defending your cells from stress so you can bounce back faster the next morning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
