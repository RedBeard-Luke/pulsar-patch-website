# Pulsar go-live + SEO/analytics plan

Status as of 2026-07-13. **Domain switch + analytics are PARKED** until the site is
truly ready to go live ("more things to figure out first"). **Track A (blog SEO
plumbing) is buildable now** — it doesn't depend on the domain. Order: build Track A →
(when ready) do the domain switch → build Track B → build traffic alignment.

Stack note (important): this site is **Vite + React (SPA)** with a **custom Shopify
Storefront API cart** (`createCheckout` in `src/lib/shopify.js` returns a Shopify-hosted
checkout URL). It is **NOT Next.js and NOT Hydrogen** — adapt any Next/Hydrogen guidance
accordingly. The `@shopify/hydrogen-react` analytics helper is framework-agnostic and
works here without adopting Hydrogen.

---

## 1. DOMAIN SWITCH (parked — do near go-live)

Current state (from Shopify → Settings → Domains):
- Domain is **registered + DNS-managed at Cloudflare** (not through Shopify).
- **Primary:** `www.pulsarpatch.com`. The bare `pulsarpatch.com` and both
  `*.myshopify.com` addresses redirect to it.
- `pulsarpatch.myshopify.com` = the store's **permanent** address; Storefront API +
  checkout run on it. **NEVER touch it.**
- No registrar transfer needed — just repoint DNS in Cloudflare.

### Part A — point the storefront to Vercel
1. Confirm the new site works on its `.vercel.app` URL first (the DNS change is the
   public go-live moment). Do it at low traffic; allow propagation time.
2. Vercel → project → **Settings → Domains → Add** `pulsarpatch.com` + `www` and set
   **www as Primary** (matches current; avoids SEO churn). Vercel shows the exact records
   (roughly: root **A** → `76.76.21.21`, `www` **CNAME** → `cname.vercel-dns.com`). Use
   what the dashboard shows, not these examples.
3. Cloudflare → **pulsarpatch.com → DNS → Records**. The current records point at Shopify
   (root **A** → `23.227.38.65`, `www` **CNAME** → `shops.myshopify.com`). **Edit those
   two** to the Vercel values.
4. **CRITICAL Cloudflare gotcha:** set both changed records to **"DNS only" (grey cloud),
   NOT proxied (orange cloud).** Orange cloud in front of Vercel causes SSL redirect loops
   + double caching. Grey cloud lets Vercel handle SSL. (If ever proxied, SSL/TLS mode must
   be **Full (strict)**.)
5. Back in Vercel → Domains, wait for **"Valid Configuration"** + auto SSL. Test
   `https://pulsarpatch.com` and `https://www.pulsarpatch.com`.
- Checkout keeps working during/after via `myshopify.com` until Part B.

### Part B — checkout subdomain (for cross-domain analytics)
- Add a Cloudflare **CNAME** `checkout` → the Shopify checkout target, and set
  `checkout.pulsarpatch.com` as the checkout domain in Shopify. Exact steps vary by Shopify
  plan (Basic/Shopify/Advanced/Plus) — get the plan first, then do click-by-click.
- Why: checkout lives on Shopify's domain; without a subdomain of the root, GA4
  cross-domain tracking can't work.

---

## 2. TRACK A — blog SEO plumbing

Makes the generator's SEO fields actually reach Google. Status: the three light pieces
are **BUILT (2026-07-14)**; prerendering is the **one remaining** piece.

### ✅ Built (2026-07-14)
Implemented with **React 19's native document-metadata hoisting** — no `react-helmet-async`
dependency (React 19 hoists `<title>`/`<meta>`/`<link>` rendered anywhere into `<head>` and
removes them on unmount, so we get per-route tags with zero deps and no peer-dep risk).
- **Per-route `<head>`** — title, meta description, canonical, Open Graph, Twitter:
  - `src/lib/seo.js` — single source of truth: `SITE_URL` (`https://www.pulsarpatch.com`),
    `ROUTE_META` (static-page titles/descriptions), `NOINDEX_ROUTES`, `PRODUCT_SLUGS`.
  - `src/components/Seo/Seo.jsx` — the `<Seo>` component + `<JsonLd>` helper.
  - `src/components/Seo/RouteSeo.jsx` — drives static routes from `ROUTE_META`, mounted once
    in `App.jsx` inside `<Router>`. Skips self-managed dynamic routes to avoid duplicate tags.
  - `index.html` — static `<title>`/`<meta description>`/OG removed on purpose (React 19
    would leave a duplicate the browser resolves to the FIRST/static one, defeating per-route
    titles). React is the sole owner now.
- **JSON-LD structured data**:
  - Site-wide `Organization` + `WebSite` (in `RouteSeo`).
  - Per blog post `BlogPosting` (`src/pages/Blog/blogSeo.js`, rendered in `BlogPost.jsx`).
    Recipe schema is intentionally NOT faked from prose recipes — add a `Recipe` branch in
    `blogSeo.js` when the generator emits structured ingredient/step fields.
  - Per product `Product` + `Offer` (in `Product.jsx`); product URLs canonicalized to the
    named slug so `/product/1` and `/product/single` don't split.
- **`sitemap.xml` + `robots.txt`** — `scripts/generate-sitemap.mjs`, wired as `prebuild` in
  `package.json` (runs before every `vite build`; also `npm run sitemap`). Parses blog slugs
  from `blogData.js` and **skips DRAFT posts** (so `zero-proof-spritz` stays out until
  published). Currently emits 30 URLs (15 static + 5 product + 10 blog).

### ⏳ Remaining — Prerender / SSG (the heavy piece)
So crawlers/social scrapers that DON'T run JS get real HTML instead of an empty SPA shell.
Today: Google's live renderer executes our JS and sees the correct per-route head, but
no-JS scrapers (Facebook/LinkedIn/Slack/iMessage link previews, and faster/guaranteed
indexing) do not. **Recommended approach: `vite-react-ssg`** (built for Vite + React Router;
prerenders each route to static HTML at build; deploys fine on Vercel). It touches the app
entry (`main.jsx`) and the router shape, so it's a focused separate step, not lumped with the
light three. Alternatives considered: a Vite prerender plugin, or Vercel build-output
prerendering. **The payoff on all of Track A is banked until go-live** (real crawling starts
once the domain points here), but the pipeline is now complete and every staged post already
carries proper meta + schema.

---

## 3. TRACK B — analytics tracking layer (parked — after domain + checkout subdomain)

Feeds the future traffic skill. Do all three or the data looks plausible but is quietly
incomplete:
1. **GA4** with **cross-domain tracking** configured (storefront on Vercel domain +
   checkout on `checkout.pulsarpatch.com`).
2. **Shopify events** via `sendShopifyAnalytics` from `@shopify/hydrogen-react` (works in
   this Vite app): fire **page view** on route change, **product view** on PDP load,
   **add to cart** on the cart mutation. Read/set the `_shopify_y` / `_shopify_s` cookies
   and attach them to every call.
3. **Carry the same identity into the Storefront cart mutations** (the `createCheckout` /
   cart calls in `src/lib/shopify.js`) so add-to-carts reconcile with the orders Shopify
   eventually records.

---

## 4. TRAFFIC ALIGNMENT SKILL (last — needs live traffic)

Once live + tracking: a skill that reads **Search Console + GA4 (+ Shopify analytics)** to
see which posts/keywords actually drive traffic and conversions, and feeds that back into
the ranking-research skill and the generator's topic/keyword selection. **Start free**
(Search Console + GA4 + Shopify); add a paid keyword tool (Ahrefs/SEMrush) only later.
