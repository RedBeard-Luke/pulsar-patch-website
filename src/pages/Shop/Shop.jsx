import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import CurvedFeature from '../../components/CurvedFeature/CurvedFeature'
import iconDrop from '../../assets/Drop_Icon.svg'
import iconMuscle from '../../assets/Muscle_Icon.svg'
import iconLeaf from '../../assets/Leaf_icon Pink.svg'
import iconShield from '../../assets/Sheild_Icon Pink.svg'
import squigleBg from '../../assets/Squigle_What is Pulsar.svg'
import './Shop.css'

const products = [
  { id: 1, cartId: 'single',   name: 'SINGLE PATCH',    patches: 1,  price: 6.00,  originalPrice: null,  badge: null },
  { id: 2, cartId: '3pack',    name: '3 PATCH BUNDLE',  patches: 3,  price: 15.80, originalPrice: 18.00, badge: null },
  { id: 3, cartId: '6pack',    name: '6 PATCH COMBO',   patches: 6,  price: 25.20, originalPrice: 36.00, badge: 'Most popular' },
  { id: 4, cartId: 'kickback', name: 'KICK BACK PACK',  patches: 10, price: 35.33, originalPrice: 60.00, badge: null },
  { id: 5, cartId: 'party',    name: 'PARTY PACK',      patches: 30, price: 90.00, originalPrice: 180.00, badge: 'Best value' },
]

const perks = [
  { icon: iconDrop, title: 'NO GIMMICKS, JUST SCIENCE', body: "Pulsar doesn't hide behind secrets or hype. It's a smarter, science-backed way to tackle an age-old problem." },
  { icon: iconMuscle, title: 'YOUR NEW RECOVERY CREW', body: 'After a night out your body kicks into recovery mode. Pulsar supports that natural process so you wake up clearer.' },
  { icon: iconLeaf, title: 'NAC', body: 'NAC is like a helper for your liver. It gives your body the tools to clean up the mess after a night of fun.' },
  { icon: iconShield, title: 'GLUTATHIONE', body: "Glutathione is your body's tiny shield, defending your cells from stress so you bounce back faster." },
]

export default function Shop() {
  const { addToCart } = useCart()

  return (
    <div className="w-full bg-white flex flex-col" id="shop-page">

      {/* ═══ SHOP ALL GRID ═══ */}
      <section className="w-full pt-10 lg:pt-[60px] pb-16 lg:pb-[80px] bg-white px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <h1 className="font-futura font-[900] text-[clamp(2rem,7vw,3rem)] text-pulsar-blue uppercase tracking-wide mb-2 text-center">Shop All</h1>
          <p className="font-inter text-[15px] text-gray-500 mb-10 text-center max-w-[460px]">Buy more, save more. Every pack is the same formula, just stocked up for more nights.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-8 w-full">
            {products.map((product) => {
              const save = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
              return (
                <div key={product.id} className="flex flex-col text-center group">
                  <Link to={`/product/${product.id}`} className="w-full flex flex-col items-center">
                    <div className="relative w-full aspect-square bg-pulsar-light-blue-bg rounded-[20px] mb-4 shadow-sm overflow-hidden flex items-center justify-center transition-transform group-hover:-translate-y-1">
                      <span className="font-futura font-[900] text-pulsar-blue/25 text-[15px]">{product.patches}×</span>
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-pulsar-pink text-white font-futura font-[800] text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full">{product.badge}</span>
                      )}
                      {save > 0 && (
                        <span className="absolute top-2 right-2 bg-pulsar-blue text-white font-futura font-[800] text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full">-{save}%</span>
                      )}
                    </div>
                    <h3 className="font-futura font-[800] text-[14px] text-pulsar-blue uppercase mb-1 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <p className="font-inter font-[600] text-[14px] text-gray-800">${product.price.toFixed(2)}</p>
                      {product.originalPrice && <p className="font-inter text-[12px] text-gray-400 line-through decoration-pulsar-pink">${product.originalPrice.toFixed(2)}</p>}
                    </div>
                  </Link>
                  <button
                    onClick={() => addToCart(product.cartId)}
                    className="mt-auto bg-pulsar-pink text-white font-futura font-[800] text-[12px] uppercase tracking-wide px-6 py-2.5 rounded-full shadow-sm transition-all hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
                  >
                    Add to cart
                  </button>
                </div>
              )
            })}
          </div>

          <Link to="/subscription" className="mt-10 font-futura font-bold text-[13px] uppercase tracking-wide text-pulsar-blue hover:text-pulsar-pink transition-colors">
            Or subscribe and save →
          </Link>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="w-full bg-pulsar-pink overflow-hidden py-3" aria-hidden="true">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-futura font-[900] text-white text-[20px] uppercase tracking-[3px] mx-10 flex items-center gap-10">Shop Now <span>→</span></span>
          ))}
        </div>
      </section>

      {/* ═══ WHAT IS PULSAR ═══ */}
      <CurvedFeature
        id="what-is-pulsar"
        topBgClass="bg-pulsar-blue"
        bottomBgClass="bg-white"
        waveFill="#FFFFFF"
        pattern={squigleBg}
        patternClass="opacity-[0.15]"
        title={
          <h2 className="font-futura font-[900] text-[clamp(2rem,6vw,3rem)] text-white uppercase tracking-wide leading-none lg:text-right">
            What is Pulsar?
          </h2>
        }
        imageLabel="THE PATCH"
        imageBgClass="bg-gray-200"
        itemTitleClass="text-pulsar-blue"
        bodyClass="text-gray-600"
        items={perks}
      />
    </div>
  )
}
