/**
 * Shopify customer accounts via the Storefront API (classic customer accounts).
 *
 * This uses the SAME public Storefront token as products/checkout. Customers
 * authenticate with email + password, which returns a customerAccessToken that
 * authorizes reads/writes scoped to just that customer. Nothing secret lives
 * here — the token belongs to the signed-in customer, not the store.
 *
 * If Shopify isn't configured, isConfigured() is false and the app falls back
 * to its built-in demo account (so local dev without env vars still works).
 */

import { isConfigured, storefrontQuery } from './shopify'

export { isConfigured }

/* ── GraphQL ─────────────────────────────────────────────────────────────── */

// Fields we read for a customer, shaped to fill the dashboard.
const CUSTOMER_FIELDS = `
  id
  firstName
  lastName
  email
  phone
  tags
  defaultAddress { id }
  addresses(first: 20) {
    nodes {
      id
      firstName
      lastName
      company
      address1
      address2
      city
      province
      provinceCode
      zip
      country
      phone
    }
  }
  orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
    nodes {
      id
      orderNumber
      processedAt
      financialStatus
      fulfillmentStatus
      currentTotalPrice { amount currencyCode }
      lineItems(first: 10) { nodes { title quantity } }
    }
  }
`

const LOGIN = `
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`

const CREATE = `
  mutation create($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id }
      customerUserErrors { code field message }
    }
  }
`

const RECOVER = `
  mutation recover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { code field message }
    }
  }
`

const RENEW = `
  mutation renew($token: String!) {
    customerAccessTokenRenew(customerAccessToken: $token) {
      customerAccessToken { accessToken expiresAt }
      userErrors { field message }
    }
  }
`

const LOGOUT = `
  mutation logout($token: String!) {
    customerAccessTokenDelete(customerAccessToken: $token) {
      deletedAccessToken
      userErrors { field message }
    }
  }
`

const GET_CUSTOMER = `
  query getCustomer($token: String!) {
    customer(customerAccessToken: $token) { ${CUSTOMER_FIELDS} }
  }
`

const UPDATE_CUSTOMER = `
  mutation updateCustomer($token: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $token, customer: $customer) {
      customer { ${CUSTOMER_FIELDS} }
      customerUserErrors { code field message }
    }
  }
`

// Changing the password rotates the access token, so we ask for the new one.
const UPDATE_PASSWORD = `
  mutation updatePassword($token: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $token, customer: $customer) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`

const ADDRESS_CREATE = `
  mutation addrCreate($token: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $token, address: $address) {
      customerAddress { id }
      customerUserErrors { code field message }
    }
  }
`

const ADDRESS_DELETE = `
  mutation addrDelete($token: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $token, id: $id) {
      deletedCustomerAddressId
      customerUserErrors { code field message }
    }
  }
`

const ADDRESS_DEFAULT = `
  mutation addrDefault($token: String!, $id: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $id) {
      customer { id }
      customerUserErrors { code field message }
    }
  }
`

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function firstError(errs) {
  if (errs && errs.length) return errs[0].message
  return null
}

function formatMoney(money) {
  if (!money) return ''
  const n = Number(money.amount || 0)
  return `$${n.toFixed(2)}`
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

function titleCase(s) {
  return String(s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

// Turn a Shopify order into the shape the dashboard's OrderTable expects.
function mapOrder(o) {
  const lines = o.lineItems?.nodes || []
  const items = lines.length
    ? lines.map(l => (l.quantity > 1 ? `${l.title} x${l.quantity}` : l.title)).join(', ')
    : '—'
  const status = titleCase(o.fulfillmentStatus === 'FULFILLED' ? 'Delivered' : (o.fulfillmentStatus || o.financialStatus || 'Processing'))
  return {
    id: `#${o.orderNumber}`,
    date: formatDate(o.processedAt),
    items,
    status,
    total: formatMoney(o.currentTotalPrice),
  }
}

// Turn a Shopify address into the dashboard's address shape.
function mapAddress(a, defaultId) {
  const street = [a.address1, a.address2].filter(Boolean).join(', ')
  return {
    id: a.id,
    label: a.company || 'Address',
    street,
    city: a.city || '',
    state: a.provinceCode || a.province || '',
    zip: a.zip || '',
    isDefault: a.id === defaultId,
  }
}

// Stable referral code derived from the customer, so it's the same every load
// (until a real referral system exists to issue codes).
function refCode(seed) {
  const s = String(seed || '')
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return 'PULSAR' + h.toString(36).toUpperCase().slice(0, 5).padStart(5, '0')
}

// Map a full Shopify customer to our `user` object (personal dashboard shape).
export function mapCustomer(c) {
  if (!c) return null
  const defaultId = c.defaultAddress?.id || null
  // NOTE: real logins land in the PERSONAL dashboard. The business/wholesale
  // dashboard needs invoices/locations/rep data the Storefront API can't
  // provide, so B2B accounts are a separate future build.
  return {
    accountType: 'personal',
    shopifyId: c.id,
    name: [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Pulsar User',
    firstName: c.firstName || '',
    lastName: c.lastName || '',
    email: c.email || '',
    phone: c.phone || '',
    avatar: null,
    addresses: (c.addresses?.nodes || []).map(a => mapAddress(a, defaultId)),
    orders: (c.orders?.nodes || []).map(mapOrder),
    // Subscriptions live in a separate app; Storefront can't read them here.
    subscription: null,
    referralCode: refCode(c.email || c.id),
    smsOptIn: true,
    emailOptIn: true,
  }
}

/* ── Public API ──────────────────────────────────────────────────────────── */

// Sign in. Returns { token, expiresAt } on success, or throws Error(message).
export async function signIn(email, password) {
  const data = await storefrontQuery(LOGIN, { input: { email, password } })
  const res = data?.customerAccessTokenCreate
  const err = firstError(res?.customerUserErrors)
  if (err) throw new Error(err)
  const t = res?.customerAccessToken
  if (!t?.accessToken) throw new Error('Wrong email or password.')
  return { token: t.accessToken, expiresAt: t.expiresAt }
}

// Create an account, then sign in so the customer lands logged in.
export async function signUp({ email, password, firstName, lastName, phone }) {
  const input = { email, password }
  if (firstName) input.firstName = firstName
  if (lastName) input.lastName = lastName
  if (phone) input.phone = phone
  const data = await storefrontQuery(CREATE, { input })
  const err = firstError(data?.customerCreate?.customerUserErrors)
  if (err) throw new Error(err)
  return signIn(email, password)
}

// Send a password-reset email.
export async function recover(email) {
  const data = await storefrontQuery(RECOVER, { email })
  const err = firstError(data?.customerRecover?.customerUserErrors)
  if (err) throw new Error(err)
  return true
}

// Fetch the signed-in customer, mapped to our user shape. Returns null if the
// token is invalid/expired (so callers treat it as logged out).
export async function fetchCustomer(token) {
  const data = await storefrontQuery(GET_CUSTOMER, { token })
  return mapCustomer(data?.customer)
}

// Renew a token nearing expiry. Returns { token, expiresAt } or null.
export async function renew(token) {
  try {
    const data = await storefrontQuery(RENEW, { token })
    const t = data?.customerAccessTokenRenew?.customerAccessToken
    return t?.accessToken ? { token: t.accessToken, expiresAt: t.expiresAt } : null
  } catch {
    return null
  }
}

// Invalidate the token server-side. Best-effort; never throws.
export async function signOut(token) {
  try { await storefrontQuery(LOGOUT, { token }) } catch { /* ignore */ }
}

// Change the password. Returns a fresh { token, expiresAt } (the old one is
// invalidated) so the caller can keep the session alive.
export async function changePassword(token, newPassword) {
  const data = await storefrontQuery(UPDATE_PASSWORD, { token, customer: { password: newPassword } })
  const err = firstError(data?.customerUpdate?.customerUserErrors)
  if (err) throw new Error(err)
  const t = data?.customerUpdate?.customerAccessToken
  return t?.accessToken ? { token: t.accessToken, expiresAt: t.expiresAt } : null
}

// Update profile fields. Returns the refreshed mapped customer.
export async function updateProfile(token, { firstName, lastName, phone, email }) {
  const customer = {}
  if (firstName !== undefined) customer.firstName = firstName
  if (lastName !== undefined) customer.lastName = lastName
  if (phone !== undefined) customer.phone = phone || null
  if (email !== undefined) customer.email = email
  const data = await storefrontQuery(UPDATE_CUSTOMER, { token, customer })
  const err = firstError(data?.customerUpdate?.customerUserErrors)
  if (err) throw new Error(err)
  return mapCustomer(data?.customerUpdate?.customer)
}

// Add an address, optionally make it default, and return the refreshed customer.
export async function addAddress(token, addr, makeDefault) {
  const address = {
    address1: addr.street || '',
    city: addr.city || '',
    province: addr.state || '',
    zip: addr.zip || '',
    company: addr.label && addr.label !== 'Address' ? addr.label : undefined,
    country: addr.country || 'United States',
  }
  const data = await storefrontQuery(ADDRESS_CREATE, { token, address })
  const err = firstError(data?.customerAddressCreate?.customerUserErrors)
  if (err) throw new Error(err)
  const newId = data?.customerAddressCreate?.customerAddress?.id
  if (makeDefault && newId) {
    await storefrontQuery(ADDRESS_DEFAULT, { token, id: newId })
  }
  return fetchCustomer(token)
}

// Delete an address, return the refreshed customer.
export async function removeAddress(token, id) {
  const data = await storefrontQuery(ADDRESS_DELETE, { token, id })
  const err = firstError(data?.customerAddressDelete?.customerUserErrors)
  if (err) throw new Error(err)
  return fetchCustomer(token)
}
