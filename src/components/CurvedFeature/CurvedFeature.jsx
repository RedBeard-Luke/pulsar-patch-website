import { Link } from 'react-router-dom'

/**
 * CurvedFeature — shared "curved border" section used on Home (The Science)
 * and Subscription (Why Subscribe).
 *
 * Layout (matches the hero's curved border):
 *   ┌ TOP zone (topBg) — section TITLE, right-aligned ┐
 *   │  ~~~~~~~~~ curved wave (the curved border) ~~~~~ │
 *   └ BOTTOM zone (bottomBg) — icon copy, right-aligned┘
 *   A VERTICAL image on the LEFT rises up through the wave, overlapping the
 *   curved border. A faint line pattern spans the whole section behind it all.
 *
 * The wave lives INSIDE the top zone and is a single fill (bottomBg): the
 * top-zone colour shows through the scallop troughs, so there's never a seam
 * or a stray background colour cutting across the curve.
 */
export default function CurvedFeature({
  id,
  topBgClass = 'bg-white',
  bottomBgClass = 'bg-[#44C8E8]',
  waveFill = '#44C8E8',           // wave colour = the bottom zone colour
  pattern,                        // faint line pattern spanning the whole section
  patternClass = 'opacity-[0.12]',
  patternSize = '950px',          // tile size — smaller value = finer/smaller lines
  title,                          // JSX rendered right-aligned in the top zone
  items = [],                     // [{ icon, title, body }]
  itemTitleClass = 'text-white',
  bodyClass = 'text-white/90',
  image,                          // optional real image src
  imageLabel = '',
  imageBgClass = 'bg-gray-300',
  cta,                            // optional { label, to }
  ctaClass = 'bg-pulsar-pink hover:bg-pulsar-pink-dark',
}) {
  return (
    <section id={id} className="relative w-full overflow-hidden">

      {/* Line pattern spanning the whole section (above the flat zone colours,
          below the content and image) */}
      {pattern && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-[1] pointer-events-none ${patternClass}`}
          style={{ backgroundImage: `url(${pattern})`, backgroundRepeat: 'repeat', backgroundSize: `${patternSize} auto`, backgroundPosition: 'center top' }}
        />
      )}

      {/* ── TOP zone: title on the right, wave at the bottom ── */}
      <div className={`relative ${topBgClass} px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-14 lg:pt-[64px]`}>
        <div className="relative z-10 max-w-[1400px] mx-auto flex justify-start lg:justify-end pb-6 lg:pb-8">
          <div className="w-full lg:w-[52%]">{title}</div>
        </div>
        {/* room for the wave below the title */}
        <div className="h-[56px] lg:h-[104px]" />
        {/* Curved wave — single fill; the top-zone colour shows in the troughs */}
        <div className="absolute -bottom-px left-0 w-full leading-none pointer-events-none">
          <svg className="block w-full h-[60px] lg:h-[112px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 120 L 0 120 Z" fill={waveFill} />
          </svg>
        </div>
      </div>

      {/* ── BOTTOM zone: image on the left (overlapping up), copy on the right ── */}
      <div className={`relative ${bottomBgClass} px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-2 pb-14 lg:pb-[80px]`}>
        <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-[70px]">

          {/* Vertical image — rises up through the curve */}
          <div className="w-full lg:w-[40%] shrink-0">
            <div className={`relative z-20 w-full aspect-[3/4] rounded-[24px] shadow-2xl overflow-hidden ${imageBgClass} mt-2 lg:mt-0 lg:-mt-[240px] flex items-center justify-center`}>
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-futura font-[900] text-black/20 text-[18px]">{imageLabel}</span>
              )}
            </div>
          </div>

          {/* Copy */}
          <div className="w-full lg:flex-1 flex flex-col gap-8 lg:pt-8">
            {items.map((it, i) => (
              <div key={i} className="flex gap-5 items-start">
                <img src={it.icon} alt="" className="w-[54px] h-[54px] object-contain shrink-0 mt-0.5" />
                <div>
                  <h3 className={`font-futura font-bold text-[20px] uppercase mb-1.5 ${itemTitleClass}`}>{it.title}</h3>
                  <p className={`font-inter text-[16px] leading-[1.6] ${bodyClass}`}>{it.body}</p>
                </div>
              </div>
            ))}
            {cta && (
              <Link to={cta.to} className={`self-start mt-3 inline-flex items-center gap-3 text-white font-futura font-bold text-[15px] uppercase tracking-wide px-8 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 ${ctaClass} group`}>
                {cta.label} <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
