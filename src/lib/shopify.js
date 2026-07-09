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
    const variantId = VARIANT_MAP[i.productId]
    if (!variantId) throw new Error(`No Shopify variant mapped for "${i.productId}"`)
    return { merchandiseId: variantId, quantity: i.qty }
  })
  const data = await storefront(CART_CREATE, { lines })
  const url = data?.cartCreate?.cart?.checkoutUrl
  if (!url) throw new Error(data?.cartCreate?.userErrors?.[0]?.message || 'Could not start checkout')
  return url
}
