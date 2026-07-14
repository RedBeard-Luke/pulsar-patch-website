#!/usr/bin/env node
// Deterministic scorer for the Pulsar blog eval suite.
//
// TWO rubrics:
//  - CONTENT (13): scores the 6 mechanical ones objectively (c3,c4,c5,c6,c8,c9)
//    + c13 health flag; flags the 6 judgment ones (c1,c2,c7,c10,c11,c12) as needs_llm.
//  - SEO (17): ALL deterministic (s1..s18, minus the deferred s4). Requires the
//    expanded frontmatter (seoTitle, metaDescription, slug, targetKeyword, heroAlt,
//    schemaType) + an "## FAQ" section + a <=60-word intro lede.
//
// Usage: node blog-eval/evaluate.mjs <path-to-post.md>
import { readFileSync } from 'node:fs'

const path = process.argv[2]
if (!path) { console.error('usage: evaluate.mjs <post.md>'); process.exit(1) }
const raw = readFileSync(path, 'utf8')

// ── parse frontmatter ──
const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
const front = fmMatch ? fmMatch[1] : ''
const bodyAll = fmMatch ? fmMatch[2] : raw
const fm = {}
for (const line of front.split('\n')) {
  const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
  if (m) fm[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}
const category = (fm.category || '').toLowerCase()
const keyword = (fm.targetKeyword || '').trim()
const kw = keyword.toLowerCase()
const kwOk = kw.length > 0

// ── regions ──
const srcIdx = bodyAll.search(/^##\s+sources\b/im)
const faqIdx = bodyAll.search(/^##\s+faq\b/im)
const firstH = bodyAll.search(/^##\s+/m)
const bodyNoSources = srcIdx >= 0 ? bodyAll.slice(0, srcIdx) : bodyAll
const lede = (firstH >= 0 ? bodyAll.slice(0, firstH) : bodyAll).trim()
const endMain = [srcIdx, faqIdx].filter(i => i >= 0).sort((a, b) => a - b)[0] ?? bodyAll.length
const contentBody = bodyAll.slice(firstH >= 0 ? firstH : 0, endMain)
const faqBlock = faqIdx >= 0 ? bodyAll.slice(faqIdx, srcIdx > faqIdx ? srcIdx : bodyAll.length) : ''
const sourcesBlock = srcIdx >= 0 ? bodyAll.slice(srcIdx) : ''

// ── helpers ──
const stripMd = s => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/^#{1,6}\s+/gm, '').replace(/[*_>`#-]/g, ' ')
const wordsIn = s => stripMd(s).split(/\s+/).filter(Boolean)
const bodyWords = wordsIn(bodyNoSources).length
const ledeWords = wordsIn(lede).length
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// links
const linkRe = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g
const bodyLinks = [...bodyNoSources.matchAll(linkRe)].map(m => m[2])
const isInternal = u => u.startsWith('/') || /pulsarpatch\.com/i.test(u)
const internalLinks = [...new Set(bodyLinks.filter(isInternal))]
const externalCites = [...new Set(bodyLinks.filter(u => /^https?:/i.test(u) && !isInternal(u)))]
const sourceUrls = [...new Set([...sourcesBlock.matchAll(/(https?:\/\/[^)\s]+)/g)].map(m => m[1]))]

// headings
const headings = [...bodyNoSources.matchAll(/^(#{1,6})\s+(.*)$/gm)]
const h1Count = headings.filter(h => h[1].length === 1).length
const subheads = headings.filter(h => h[1].length === 2 && !/^sources\b/i.test(h[2]))
let orderOk = true, prev = 1
for (const h of headings) { const lvl = h[1].length; if (lvl > prev + 1) { orderOk = false; break } prev = lvl }

// paragraphs (lede + content, excluding headings, lists, FAQ Q markers)
const paragraphs = (lede + '\n\n' + contentBody).split(/\n\s*\n/).map(p => p.trim())
  .filter(p => p && !/^#{1,6}\s/.test(p) && !/^[-*]\s/.test(p) && !/^\*\*?q\s*[:.]/i.test(p))
const maxSentences = paragraphs.length ? Math.max(...paragraphs.map(p => (p.match(/[.!?]+(\s|$)/g) || []).length)) : 0

const faqPairs = (faqBlock.match(/^\s*(?:\*\*)?q\s*[:.]/gim) || []).length
const kwCount = kwOk ? (bodyNoSources.toLowerCase().match(new RegExp(escapeRe(kw), 'g')) || []).length : 0
const first100 = wordsIn(bodyNoSources).slice(0, 100).join(' ').toLowerCase()
const seoTitle = fm.seoTitle || ''
const metaDesc = fm.metaDescription || ''
const slug = fm.slug || ''

// ── CONTENT criteria (1 = pass) ──
const content = {
  c3_subheads: subheads.length >= 3 ? 1 : 0,
  c4_length: bodyWords >= 500 ? 1 : 0,
  c5_category: ['science', 'lifestyle', 'recipes'].includes(category) ? 1 : 0,
  c6_brand: /\bpulsar\b/i.test(bodyNoSources) ? 1 : 0,
  c8_sources_section: externalCites.length > 0 && externalCites.every(u => sourceUrls.includes(u)) ? 1 : 0,
  c9_no_orphans: sourceUrls.length > 0 && sourceUrls.every(u => externalCites.includes(u)) ? 1 : 0,
  c13_health_safe: /\b(cure[ds]?|treat(?:s|ed|ment)?|prevent(?:s|ed|ion)?)\b/i.test(bodyNoSources) ? 0 : 1,
}

// ── SEO criteria (1 = pass) — all deterministic ──
const seo = {
  s1_kw_in_title: kwOk && seoTitle.toLowerCase().includes(kw) ? 1 : 0,
  s2_kw_early: kwOk && first100.includes(kw) ? 1 : 0,
  s3_kw_in_subhead: kwOk && subheads.some(h => h[2].toLowerCase().includes(kw)) ? 1 : 0,
  s5_kw_cap: kwOk && kwCount >= 1 && kwCount <= Math.max(1, Math.ceil(bodyWords / 100)) ? 1 : 0,
  s6_title_len: seoTitle.length >= 50 && seoTitle.length <= 60 ? 1 : 0,
  s7_meta_desc: metaDesc.length >= 140 && metaDesc.length <= 160 && kwOk && metaDesc.toLowerCase().includes(kw) ? 1 : 0,
  s8_slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 60 && kwOk && kw.split(/\s+/).every(w => slug.includes(w)) ? 1 : 0,
  s9_single_h1: h1Count === 0 ? 1 : 0,
  s10_heading_order: orderOk ? 1 : 0,
  s11_para_len: paragraphs.length > 0 && maxSentences <= 4 ? 1 : 0,
  s12_depth: bodyWords >= 800 ? 1 : 0,
  s13_internal_links: internalLinks.length >= 2 ? 1 : 0,
  s14_external_link: externalCites.length >= 1 ? 1 : 0,
  s15_faq: faqPairs >= 3 ? 1 : 0,
  s16_lede: ledeWords > 0 && ledeWords <= 60 ? 1 : 0,
  s17_schema: ['article', 'recipe', 'faq'].includes((fm.schemaType || '').toLowerCase()) ? 1 : 0,
  s18_alt_text: (fm.heroAlt || '').trim().length > 0 ? 1 : 0,
}

console.log(JSON.stringify({
  file: path,
  category, keyword,
  wordCount: bodyWords, ledeWords, subheadCount: subheads.length,
  internalLinks, externalCites, sourceUrls, faqPairs, keywordCount: kwCount, maxSentencesPerParagraph: maxSentences,
  deterministic: content,
  needs_llm: { c1_grammar: null, c2_voice: null, c7_attribution: null, c10_link_integrity: null, c11_body_coherence: null, c12_section_coherence: null },
  seo,
  scores: {
    contentDeterministic: Object.values(content).reduce((a, b) => a + b, 0),
    seoTotal: Object.values(seo).reduce((a, b) => a + b, 0),
    seoMax: Object.keys(seo).length,
  },
}, null, 2))
