/**
 * Blog SEO helpers — derive per-post <head> meta and JSON-LD from a blogData
 * entry. Kept separate from BlogPost.jsx so it can be reused (e.g. by the Blog
 * index or a future sitemap that wants titles).
 *
 * NOTE ON SCHEMA: we emit BlogPosting for every post — always correct and safe.
 * We intentionally do NOT fabricate Recipe schema (ingredients/steps) from the
 * prose recipes; when the generator starts emitting structured ingredient/step
 * fields, add a Recipe branch here keyed off post.category === 'RECIPES'.
 */
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../../lib/seo'

// "THE ZERO-PROOF SPRITZ" -> "The Zero-Proof Spritz". Our blogData titles are
// stored uppercase for the on-page display; SERPs read better in title case.
function toTitleCase(str) {
  return String(str)
    .toLowerCase()
    .replace(/(^|[\s\-/([])([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase())
}

function clamp(str, max) {
  const s = String(str || '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return s.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, '').trim() + '…'
}

// Turn an imported asset URL (root-relative in prod) into an absolute OG URL.
function absImage(img) {
  if (!img) return DEFAULT_OG_IMAGE
  if (/^https?:\/\//.test(img)) return img
  return `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`
}

export function blogPostMeta(post, id) {
  return {
    title: toTitleCase(post.title),
    description: clamp(post.heroDescription, 155),
    image: absImage(post.heroImg),
    slug: id,
  }
}

export function blogPostJsonLd(post, id) {
  const url = `${SITE_URL}/blog/${id}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: toTitleCase(post.title),
    description: clamp(post.heroDescription, 300),
    image: absImage(post.heroImg),
    articleSection: toTitleCase(post.category || 'Blog'),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    author: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    },
  }
}
