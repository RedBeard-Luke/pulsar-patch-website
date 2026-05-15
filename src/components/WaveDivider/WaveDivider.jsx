/**
 * WaveDivider — Standardized wavy border used across the site.
 *
 * DESIGN RULE (global):
 *   • Wavelength  = 240 SVG-units  (6 full waves across 1440-wide viewBox)
 *   • Amplitude   = 40 SVG-units   (peak-to-trough = 40 units)
 *   • These values match the hero section's wave and must be kept
 *     consistent on every page / section that uses a wave divider.
 *
 * Props
 * ─────────────────────────────────────────────────────────────
 *  topColor     – fill colour above the wave   (default: 'white')
 *  bottomColor  – fill colour below the wave   (default: '#44C8E8')
 *  height       – Tailwind height class         (default: 'h-[120px]')
 *  className    – extra classes on the wrapper
 *  flip         – if true, the wave curves downward instead of up
 */

export default function WaveDivider({
  topColor = 'white',
  bottomColor = '#44C8E8',
  height = 'h-[120px]',
  className = '',
  flip = false,
}) {
  // Standard wave: starts at y=40, peaks at y=80, troughs at y=0
  // viewBox 0 0 1440 120  →  wave sits at vertical centre
  const wavePath = flip
    ? 'M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 0 L 0 0 Z'
    : 'M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 120 L 0 120 Z'

  const topRect = flip
    ? null
    : <rect x="0" y="0" width="1440" height="120" fill={topColor} />

  const bottomRect = flip
    ? <rect x="0" y="80" width="1440" height="40" fill={bottomColor} />
    : null

  return (
    <div className={`w-full leading-none ${height} ${className}`}>
      <svg
        className="block w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {topRect}
        <path d={wavePath} fill={flip ? topColor : bottomColor} />
        {!flip && <rect x="0" y="0" width="1440" height="40" fill={topColor} />}
        {/* Re-draw wave on top so it clips cleanly */}
        <path d={wavePath} fill={flip ? topColor : bottomColor} />
        {bottomRect}
      </svg>
    </div>
  )
}
