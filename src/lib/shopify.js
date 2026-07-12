/**
 * Shopify Storefront API — headless checkout handoff + live prices.
 *
 * WHY THIS IS CLIENT-SIDE AND SAFE:
 *   The Storefront API token is a PUBLIC token, designed to ship in the
 *   browser bundle (it can only read products and build carts). This is the
 *   opposite of the Admin API token, which is a secret and must NEVER touch
 *   the client. Do not put an Admin token here.
 *
 * CONFIG (set in Vercel → Project → Environment Variables, prefixed VITE_ so
 * Vite exposes them to the client build):
 *   VITE_SHOPIFY_DOMAIN            e.g. pulsarpatch.myshopify.com
 *   VITE_SHOPIFY_STOREFRONT_TOKEN  the Storefront API public access token
 *
 *   Then map each of our catalog ids to a Shopify product. Two ways, pick one
 *   per product (you can mix):
 *
 *   VITE_SHOPIFY_PRODUCTS  JSON mapping our ids to Shopify PRODUCT ids — the
 *                          number in a product's admin URL
 *                          (.../products/8123456789). Best for single-variant
 *                          products; we auto-find their one variant.
 *                            {"single":"8123456789","6pack":"8123456790", ...}
 *
 *   VITE_SHOPIFY_VARIANTS  JSON mapping our ids to specific VARIANT ids — the
 *                          number in .../variants/44823905921. Use when a
 *                          product has multiple variants and you need one.
 *                            {"single":"44823905921", ...}
 *
 * If none of this is set, isConfigured() is false and the app falls back to the
 * internal /checkout review + confirmation flow, and to the placeholder prices
 * in the catalog (no dead end either way).
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2024-10'

function parseMap(raw) {
  try { return raw ? JSON.parse(raw) : {} } catch { return {} }
}

// Explicit variant references (use when a product has multiple variants).
const VARIANT_MAP = parseMap(import.meta.env.VITE_SHOPIFY_VARIANTS)
// Product references (the common case for us — single-variant products). We
// resolve each product's one variant automatically.
const PRODUCT_MAP = parseMap(import.meta.env.VITE_SHOPIFY_PRODUCTS)

export function isConfigured() {
  return Boolean(DOMAIN && TOKEN)
}

/**
 * Turn a mapping value into the full GID Shopify expects. Accepts a full GID,
 * or just the numeric id copied from an admin URL. `kind` is 'Product' or
 * 'ProductVariant'. Returns null for anything we can't turn into a GID.
 */
function toGid(kind, value) {
  if (!value) return null
  const s = String(value).trim()
  if (s.startsWith('gid://')) return s
  if (/^\d+$/.test(s)) return `gid://shopify/${kind}/${s}`
  return null
}

// Build the list of things to look up: { cartId, gid }. Explicit variant
// mappings win over product mappings for the same id.
function catalogRefs() {
  const refs = []
  for (const [cartId, v] of Object.entries(VARIANT_MAP)) {
    const gid = toGid('ProductVariant', v)
    if (gid) refs.push({ cartId, gid })
  }
  for (const [cartId, v] of Object.entries(PRODUCT_MAP)) {
    if (VARIANT_MAP[cartId]) continue
    const gid = toGid('Product', v)
    if (gid) refs.push({ cartId, gid })
  }
  return refs
}

async function storefront(query, variables) {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Shopify responded ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

// One query handles both cases: a node can be a ProductVariant (use it as-is)
// or a Product (use its first variant). nodes() accepts a mix of GID types.
const CATALOG_QUERY = `
  query catalog($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      id
      ... on ProductVariant {
        price { amount currencyCode }
        compareAtPrice { amount }
      }
      ... on Product {
        variants(first: 1) {
          nodes {
            id
            price { amount currencyCode }
            compareAtPrice { amount }
          }
        }
      }
    }
  }
`

// Cache the resolved catalog so checkout can reuse the variant ids the price
// fetch already looked up (avoids a second round-trip).
let catalogCache = null

async function loadCatalog() {
  const refs = catalogRefs()
  if (!isConfigured() || !refs.length) return {}

  const gidToCartId = {}
  refs.forEach(r => { gidToCartId[r.gid] = r.cartId })

  const data = await storefront(CATALOG_QUERY, { ids: refs.map(r => r.gid) })
  const out = {}
  for (const node of data?.nodes || []) {
    if (!node || !node.id) continue
    const cartId = gidToCartId[node.id]
    if (!cartId) continue

    // Pull the variant (directly, or the product's first one) + its pricing.
    let variantId, priceObj, compareObj
    if (node.__typename === 'ProductVariant') {
      variantId = node.id
      priceObj = node.price
      compareObj = node.compareAtPrice
    } else if (node.__typename === 'Product') {
      const v = node.variants?.nodes?.[0]
      if (!v) continue
      variantId = v.id
      priceObj = v.price
      compareObj = v.compareAtPrice
    } else {
      continue
    }

    const price = Number(priceObj?.amount)
    if (!Number.isFinite(price)) continue
    const compareAt = compareObj ? Number(compareObj.amount) : null
    out[cartId] = {
      variantId,
      price,
      // Only treat compareAtPrice as a "was" price when it's actually higher.
      originalPrice: Number.isFinite(compareAt) && compareAt > price ? compareAt : null,
      currency: priceObj?.currencyCode || 'USD',
    }
  }
  return out
}

/**
 * Read LIVE prices from Shopify so the numbers on the site always match what
 * checkout charges. Returns a map keyed by our catalog id:
 *   { single: { variantId, price: 6, originalPrice: null, currency: 'USD' }, ... }
 *
 * Never throws — if Shopify isn't configured, nothing is mapped, or the request
 * fails, it returns {} and the app quietly keeps its placeholder prices.
 */
export async function fetchLivePrices() {
  try {
    const cat = await loadCatalog()
    catalogCache = cat
    return cat
  } catch {
    return {}
  }
}

const CART_CREATE = `
  mutation cartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`

/**
 * Build a Shopify cart from our in-memory cart and return the hosted,
 * PCI-compliant checkout URL to redirect to. Throws if Shopify is not
 * configured or a line item has no resolvable variant.
 */
export async function createCheckout(items) {
  if (!isConfigured()) throw new Error('Shopify is not configured')

  // Make sure we know each product's variant id (reuse the price-fetch cache).
  if (!catalogCache) {
    try { catalogCache = await loadCatalog() } catch { catalogCache = {} }
  }

  const lines = items.map(i => {
    // Prefer the resolved variant; fall back to an explicit variant mapping.
    const variantId = catalogCache?.[i.productId]?.variantId || toGid('ProductVariant', VARIANT_MAP[i.productId])
    if (!variantId) throw new Error(`No Shopify variant mapped for "${i.productId}"`)
    return { merchandiseId: variantId, quantity: i.qty }
  })
  const data = await storefront(CART_CREATE, { lines })
  const url = data?.cartCreate?.cart?.checkoutUrl
  if (!url) throw new Error(data?.cartCreate?.userErrors?.[0]?.message || 'Could not start checkout')
  return url
}
