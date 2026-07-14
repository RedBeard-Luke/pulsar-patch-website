#!/usr/bin/env node
/**
 * Build-time sitemap.xml + robots.txt generator.
 *
 * Runs before `vite build` (see package.json). Writes to public/ so Vite copies
 * both files to the site root. Sources of truth:
 *   - static routes + product slugs: src/lib/seo.js (ROUTE_META, PRODUCT_SLUGS)
 *   - blog posts: parsed from src/pages/Blog/blogData.js, skipping DRAFT posts
 *
 * We parse blogData.js as TEXT (not import) because it imports image assets that
 * Node can't resolve. seo.js is pure JS, so we import it directly.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { SITE_URL, ROUTE_META, NOINDEX_ROUTES, PRODUCT_SLUGS } from '../src/lib/seo.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')

// ── blog slugs (skip drafts) ──
const blogSrc = readFileSync(join(root, 'src/pages/Blog/blogData.js'), 'utf8')
// Match each top-level "  'slug': {" entry and the block that follows it, so we
// can check the block for `date: 'DRAFT'`.
const blogSlugs = []
const entryRe = /^ {2}'([a-z0-9-]+)':\s*\{/gm
let m
const matches = []
while ((m = entryRe.exec(blogSrc))) matches.push({ slug: m[1], start: m.index })
for (let i = 0; i < matches.length; i++) {
  const start = matches[i].start
  const end = i + 1 < matches.length ? matches[i + 1].start : blogSrc.length
  const block = blogSrc.slice(start, end)
  const isDraft = /date:\s*['"]DRAFT['"]/i.test(block)
  if (!isDraft) blogSlugs.push(matches[i].slug)
}

// ── assemble URL list ──
const staticPaths = Object.keys(ROUTE_META).filter((p) => !NOINDEX_ROUTES.has(p))
const productPaths = PRODUCT_SLUGS.map((s) => `/product/${s}`)
const blogPaths = blogSlugs.map((s) => `/blog/${s}`)
const allPaths = [...new Set([...staticPaths, ...productPaths, ...blogPaths])]

const loc = (p) => `${SITE_URL}${p === '/' ? '/' : p}`
const priority = (p) => (p === '/' ? '1.0' : p.startsWith('/blog/') || p.startsWith('/product/') ? '0.7' : '0.8')

const urls = allPaths
  .map(
    (p) =>
      `  <url>\n    <loc>${loc(p)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority(p)}</priority>\n  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

const robots = `# Pulsar Patch\nUser-agent: *\nAllow: /\n\n# No-index utility routes\n${[...NOINDEX_ROUTES]
  .map((p) => `Disallow: ${p}`)
  .join('\n')}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(join(publicDir, 'robots.txt'), robots)

console.log(
  `[sitemap] wrote ${allPaths.length} URLs (${staticPaths.length} static, ${productPaths.length} product, ${blogPaths.length} blog) + robots.txt`,
)
