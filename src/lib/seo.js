/**
 * SEO config — single source of truth for titles, meta descriptions, and the
 * canonical base URL. Consumed by:
 *   - src/components/Seo/Seo.jsx (renders per-route <head> tags)
 *   - scripts/generate-sitemap.mjs (build-time sitemap + robots.txt)
 *
 * This file is PURE JS (no React, no image imports) so the Node build script
 * can import it directly. Don't add browser-only imports here.
 */

// The site's canonical home. Keep this as the PRIMARY domain (www), matching
// Shopify's current primary + the go-live plan. Canonicals point here even
// before the DNS switch, so Google indexes the final address, not vercel.app.
export const SITE_URL = 'https://www.pulsarpatch.com'
export const SITE_NAME = 'Pulsar Patch'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/pulsar-logo.svg`

// Site-wide default. Used for any route without a specific entry below.
export const DEFAULT_META = {
  title: 'Pulsar Patch — Hangover Recovery Patch',
  description:
    'Pulsar Patch is a transdermal hangover recovery patch powered by NAC and Glutathione. Peel, stick, and wake up ready. Shop online or find us in 60+ stores across AZ & NV.',
}

// Per-route meta for the STATIC pages. Dynamic routes (/blog/:id, /product/:id)
// render their own <Seo> from live data and are intentionally NOT listed here.
export const ROUTE_META = {
  '/': DEFAULT_META,
  '/about': {
    title: 'About Pulsar Patch — Why We Built It',
    description:
      'The story behind Pulsar Patch: a transdermal hangover recovery patch made for people who like a good night out and a better morning after.',
  },
  '/science': {
    title: 'The Science — How Pulsar Patch Works',
    description:
      'How Pulsar Patch delivers NAC and Glutathione through the skin, and why a transdermal patch skips the gut and first-pass metabolism.',
  },
  '/shop': {
    title: 'Shop Pulsar Patch — Hangover Recovery Patches',
    description:
      'Buy Pulsar Patch online. Single patches, bundles, and the Party Pack. Transdermal hangover recovery powered by NAC and Glutathione.',
  },
  '/reviews': {
    title: 'Pulsar Patch Reviews — Real Customer Results',
    description:
      'See what people are saying about Pulsar Patch. Real reviews from real mornings after.',
  },
  '/subscription': {
    title: 'Pulsar Patch Subscription — Save on Every Delivery',
    description:
      'Subscribe to the Pulsar Patch Party Pack and save. Choose a 30, 60, or 90-day delivery frequency and never run out.',
  },
  '/contact': {
    title: 'Contact Pulsar Patch',
    description:
      'Questions about Pulsar Patch, wholesale, or an order? Get in touch with the Pulsar team.',
  },
  '/blog': {
    title: 'The Pulsar Blog — Recipes, Science & Better Mornings',
    description:
      'Low-regret cocktails, zero-proof recipes, and the science of hangovers. The Pulsar Patch blog for people who like a good night and a better morning.',
  },
  '/wholesale': {
    title: 'Wholesale — Stock Pulsar Patch in Your Store',
    description:
      'Become a Pulsar Patch wholesale partner. Strong margins on a fast-moving hangover recovery patch. Get approved to see pricing.',
  },
  '/store-locator': {
    title: 'Find Pulsar Patch Near You — Store Locator',
    description:
      'Find Pulsar Patch in 60+ stores across Arizona and Nevada. Use the store locator to find a retailer near you.',
  },
  '/faq': {
    title: 'Pulsar Patch FAQ — Your Questions Answered',
    description:
      'How the patch works, how to use it, shipping, subscriptions, and more. Everything you need to know about Pulsar Patch.',
  },
  '/shipping': {
    title: 'Shipping & Delivery — Pulsar Patch',
    description: 'Shipping options, delivery times, and order info for Pulsar Patch.',
  },
  '/refunds': {
    title: 'Refund Policy — Pulsar Patch',
    description: 'Our refund and return policy for Pulsar Patch orders.',
  },
  '/terms': {
    title: 'Terms of Service — Pulsar Patch',
    description: 'The terms of service for using the Pulsar Patch website and buying our products.',
  },
  '/affiliate': {
    title: 'Pulsar Patch Affiliate Program',
    description:
      'Join the Pulsar Patch affiliate program and earn by sharing the patch that saves mornings.',
  },
}

// Canonical product slugs (named, not the numeric aliases). Used by the sitemap.
export const PRODUCT_SLUGS = ['single', '3pack', '6pack', 'kickback', 'party']

// Routes that should NOT be indexed (account/checkout/admin/auth flows). These
// get a robots noindex tag and are excluded from the sitemap.
export const NOINDEX_ROUTES = new Set([
  '/account',
  '/checkout',
  '/admin',
  '/activate',
  '/reset',
  '/business-signup',
  '/affiliate-signup',
])

// A route is "self-managed" when its own page component renders <Seo> from
// dynamic data — RouteSeo must stay out of the way to avoid duplicate tags.
export function isSelfManagedRoute(pathname) {
  return (
    (pathname.startsWith('/blog/') && pathname !== '/blog') ||
    pathname.startsWith('/product/')
  )
}

// Build an absolute canonical URL from a path.
export function canonicalUrl(pathname) {
  if (!pathname || pathname === '/') return `${SITE_URL}/`
  return `${SITE_URL}${pathname.replace(/\/+$/, '')}`
}
