/**
 * Shopify Storefront API — headless checkout handoff.
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
 *   VITE_SHOPIFY_VARIANTS         (optional) JSON mapping our catalog ids to
 *                                 Shopify variant GIDs, e.g.
 *                                 {"single":"gid://shopify/ProductVariant/123", ...}
 *
 * If these are not set, isConfigured() is false and the app falls back to the
 * internal /checkout review + confirmation flow (no dead end either way).
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2024-10'

let VARIANT_MAP = {}
try {
  VARIANT_MAP = import.meta.env.VITE_SHOPIFY_VARIANTS
    ? JSON.parse(import.meta.env.VITE_SHOPIFY_VARIANTS)
    : {}
} catch {
  VARIANT_MAP = {}
}

export function isConfigured() {
  return Boolean(DOMAIN && TOKEN)
}

/**
 * Accept either a full variant GID or just the numeric id from a product URL
 * (e.g. the "44823905921" in .../variants/44823905921) and always return the
 * full GID Shopify's API expects. Lets the variant map hold plain numbers.
 */
function toVariantGid(idOrGid) {
  if (!idOrGid) return null
  const s = String(idOrGid).trim()
  if (s.startsWith('gid://')) return s
  if (/^\d+$/.test(s)) return `gid://shopify/ProductVariant/${s}`
  return s
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
 * configured or a line item has no mapped variant.
 */
export async function createCheckout(items) {
  if (!isConfigured()) throw new Error('Shopify is not configured')
  const lines = items.map(i => {
    const variantId = toVariantGid(VARIANT_MAP[i.productId])
    if (!variantId) throw new Error(`No Shopify variant mapped for "${i.productId}"`)
    return { merchandiseId: variantId, quantity: i.qty }
  })
  const data = await storefront(CART_CREATE, { lines })
  const url = data?.cartCreate?.cart?.checkoutUrl
  if (!url) throw new Error(data?.cartCreate?.userErrors?.[0]?.message || 'Could not start checkout')
  return url
}

const PRICES_QUERY = `
  query prices($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        price { amount currencyCode }
        compareAtPrice { amount }
      }
    }
  }
`

/**
 * Read the LIVE price of every mapped variant straight from Shopify, so the
 * numbers shown on the site always match what checkout charges. Returns a map
 * keyed by our catalog id:
 *   { single: { price: 6, originalPrice: null, currency: 'USD' }, ... }
 *
 * Never throws — if Shopify isn't configured, nothing is mapped, or the request
 * fails, it returns {} and the app quietly keeps its built-in placeholder prices.
 */
export async function fetchLivePrices() {
  try {
    if (!isConfigured()) return {}
    const entries = Object.entries(VARIANT_MAP)
      .map(([cartId, v]) => [cartId, toVariantGid(v)])
      .filter(([, gid]) => Boolean(gid))
    if (!entries.length) return {}

    const gidToCartId = {}
    entries.forEach(([cartId, gid]) => { gidToCartId[gid] = cartId })

    const data = await storefront(PRICES_QUERY, { ids: entries.map(([, gid]) => gid) })
    const out = {}
    for (const node of data?.nodes || []) {
      if (!node || !node.id) continue
      const cartId = gidToCartId[node.id]
      if (!cartId) continue
      const price = Number(node.price?.amount)
      if (!Number.isFinite(price)) continue
      const compareAt = node.compareAtPrice ? Number(node.compareAtPrice.amount) : null
      out[cartId] = {
        price,
        // Only treat compareAtPrice as a "was" price when it's actually higher.
        originalPrice: Number.isFinite(compareAt) && compareAt > price ? compareAt : null,
        currency: node.price?.currencyCode || 'USD',
      }
    }
    return out
  } catch {
    return {}
  }
}
