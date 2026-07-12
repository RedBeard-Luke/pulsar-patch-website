/**
 * WaveDivider — Standardized wavy border used across the site.
 *
 * DESIGN RULE (global):
 *   • Wavelength  = 480 SVG-units  (3 full waves across 1440-wide viewBox)
 *   • Amplitude   = 80 SVG-units   (peak-to-trough = 80 units)
 *   • These values match the hero + footer waves and must be kept
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
  // Same wave geometry as the hero + footer: 80-unit peak-to-trough swing so
  // every curved border across the site reads as the identical wave.
  //   • not flipped → bottomColor rises up into topColor (section-below reveal)
  //   • flipped     → topColor dips down into bottomColor (section-above reveal)
  const wavePath = flip
    ? 'M0 40 Q 120 120, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40 L 1440 0 L 0 0 Z'
    : 'M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z'

  return (
    <div className={`w-full leading-none ${height} ${className}`}>
      <svg
        className="block w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Solid background is the "from" color; the wave paints the "to" color. */}
        <rect x="0" y="0" width="1440" height="120" fill={flip ? bottomColor : topColor} />
        <path d={wavePath} fill={flip ? topColor : bottomColor} />
      </svg>
    </div>
  )
}
