/**
 * Seo — per-route <head> tags, using React 19's native metadata hoisting.
 *
 * In React 19, <title>, <meta>, and <link> tags rendered anywhere in the tree
 * are automatically hoisted into <head>, and removed when the component
 * unmounts. So we get SPA-friendly per-route meta with ZERO dependencies
 * (no react-helmet-async). A route swap unmounts the old <Seo> and mounts the
 * new one, replacing the tags cleanly.
 *
 * NOTE: index.html no longer hardcodes <title>/<meta description>/OG tags — this
 * component is the single source of truth so there are never duplicate tags.
 */
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  canonicalUrl,
} from '../../lib/seo'

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
}) {
  const canonical = path != null ? canonicalUrl(path) : undefined
  // Keep the tab/title readable; only append the brand if it isn't already there.
  const fullTitle =
    title && !title.includes(SITE_NAME) && type !== 'website'
      ? `${title} — ${SITE_NAME}`
      : title

  return (
    <>
      {fullTitle && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,follow" />}

      {/* Open Graph (Facebook, LinkedIn, iMessage, Slack) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      {fullTitle && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      {fullTitle && <meta name="twitter:title" content={fullTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </>
  )
}

/**
 * JsonLd — renders a <script type="application/ld+json"> block. Google reads
 * JSON-LD anywhere in the document, so inline placement is fine. Pass a plain
 * object (or array of objects) matching schema.org.
 */
export function JsonLd({ data }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
