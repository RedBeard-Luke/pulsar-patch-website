# Iterations

Three full end-to-end passes after the initial rebuild, each with a distinct lens.
Every fix traces to an item in `AUDIT.md`.

---

## Pass 1 — Structure & function

Lens: broken flows, dead ends, missing states, conversion-path gaps. Fix anything
that doesn't work the way a user expects.

**Fixed**
- **Build was broken** (missing `@rolldown/binding-darwin-arm64`). Reinstalled so
  `npm run build` works on this machine. *(A0)*
- **Checkout now exists and completes.** New `/checkout` page: editable quantities,
  remove, subtotal, bundle savings, free-shipping progress, empty state, loading +
  confirmation. Wired to a Shopify Storefront handoff (`src/lib/shopify.js`) that
  redirects to Shopify's hosted checkout when env vars are set, and falls back to an
  internal confirmation when they aren't. The old "CHECK OUT" button did nothing. *(A1, A3)*
- **Cart drawer rebuilt** as a real component: increment / decrement / remove /
  quantity, savings line, free-shipping meter, empty state, suggestions, working
  checkout link. Cart now persists in `localStorage`. *(A2, A3)*
- **Add-to-cart feedback everywhere** via a global toast (watches cart state), so
  every add across the site confirms visually. *(C1)*
- **All dead links resolved.** Store Finder / Footer "Find a Store" → new
  `/store-locator`; Affiliate links → new `/affiliate`; Home "recipes" → `/blog`
  (with a `/recipes` redirect kept alive). *(B2)*
- **New Store Locator** (`/store-locator`): searchable by city / ZIP / name, AZ/NV
  filter, grouped results, per-store directions + call, empty state, retailer CTA. *(B9)*
- **404 page + catch-all route** for any unknown URL. *(A5)*
- **Product not-found state** for invalid ids like `/product/99`. *(C9)*
- **Forms actually submit and confirm** through one `submitLead()` helper with
  inline validation, loading, success, and error states:
  Contact, Wholesale application (was a silent dead drop), newsletter, Product +
  Reviews review forms. *(C2, C3, C4, C5, C6)*
- **Contact page** self-linking card replaced with useful destinations (FAQ / Store
  Locator / Wholesale); dead `/store-locator` link now resolves; misleading
  required markers corrected. *(B4, C2)*
- **Wholesale reconnected to the funnel:** removed the fake login gate and dead
  ORDER NOW buttons, added real example pricing + margins, a credibility bar
  (60+ AZ/NV partners), a "how it works" flow, and CTAs into the `/business-signup`
  application. *(B7, C8, F2)*
- **Account dead buttons wired** (save profile, update password, add/remove address,
  pause/resume/cancel subscription) with validation and confirmations. *(C7)*
- **Admin gated** behind sign-in and given links to the previously-missing routes
  (`/account`, `/business-signup`, `/store-locator`, `/affiliate`, `/checkout`). *(B8)*
- **Route-level code splitting** added; main JS bundle dropped from 549 KB to
  ~289 KB, with each page lazy-loaded and a loading spinner. *(A6)*

---

## Pass 2 — Visual & UX craft

Lens: hierarchy, spacing, typography, color, consistency, motion, accessibility.

**Fixed**
- **Mobile is now a first-class layout, site-wide.** Responsive horizontal padding
  replaced every fixed `px-[140px]`; non-responsive `grid-cols-3/4/5` got mobile-first
  breakpoints; hard `flex-[0_0_45/50%]` splits stack on phones; fixed pixel headlines
  became `clamp()`; `whitespace-nowrap` removed from headlines; decorative
  `min-w-[1440px]` backgrounds contained with `overflow-hidden`. *(D1–D6)*
- **Header rebuilt for touch:** hamburger + slide-in mobile menu with accordion nav
  and search, replacing the hover-only desktop dropdowns that were unusable on a
  phone. Body-scroll lock and Escape-to-close on cart + menu. *(B1)*
- **Product page** got a thumb-reachable **sticky add-to-cart bar** on mobile plus a
  quantity stepper. *(D7)*
- **Placeholder art unified:** harsh `#555/#757575` grey blocks became on-brand
  soft light-blue placeholders with subtle labels, so unfinished imagery reads as
  intentional rather than broken. Science hero switched to brand blue so its white
  text stays legible.
- **Copy / QA fixes:** "PEAL & STICK" → "PEEL & STICK", "YOUR ALL SET" → "YOU'RE ALL
  SET", "WERE PULSAR" → "WE'RE PULSAR", "BE APART" → "BE A PART", "LETS" → "LET'S",
  "FAQ'S" → "FAQS"; two em dashes removed from About body copy; garbled seed reviews
  rewritten. *(E1, E2, E6)*
- **Off-brand template copy rewritten** in the brand voice: Shipping (no more
  "fulfillment centers across the globe"), Refunds (dropped EU cooling-off + clothing
  "tags", removed the leaked personal `aaron@` address, emails now `mailto:`). *(E3, E4, E5)*
- **Accessibility baseline added:** visible keyboard `:focus-visible` styles, a
  skip-to-content link, `aria-label`s on icon buttons, `aria-live` on dynamic
  regions (toast, cart qty, result counts), `prefers-reduced-motion` support, and
  `alt=""` on decorative images.

---

## Pass 3 — Depth & differentiation

Lens: sophistication, edge cases, performance, and small premium moments.

**Fixed / added**
- **Two clear audiences on the Home page:** a consumer hero (Shop + Find-a-store) and
  a distinct retailer front door, plus a trust/stat bar and a split "Find us / For
  retailers" band, so each visitor gets a path within seconds without stepping on the
  other. *(F1)*
- **Conversion nudges:** free-shipping progress meters (cart + checkout), bundle
  savings badges and per-pack "-N%" / margin math on Shop and Wholesale, and
  subscribe-and-save cross-links.
- **Real metadata & SEO:** fixed the 404-ing favicon (`.png` → the real `.svg`),
  accurate on-brand description, `theme-color`, Open Graph + Twitter cards, and a
  `<noscript>` fallback.
- **Graceful states throughout:** route-loading spinner, empty carts, empty search,
  not-found product, gated admin, form success screens, and a friendly on-brand 404.
- **Anchor + sticky-header polish:** `scroll-margin-top` so in-page anchors (e.g.
  Product "reviews") aren't hidden under the sticky nav.
- **Repo hygiene:** purged thousands of macOS `._*` / `.DS_Store` junk files that
  were breaking `eslint`, and ignored them going forward. `npm run lint` and
  `npm run build` are both clean. *(A8)*

---

## Deferred (needs owner input or assets)
- Real Shopify credentials + variant GID mapping to switch checkout from the internal
  fallback to live hosted checkout (env vars only, no code change).
- A real backend endpoint for form submissions (`VITE_LEADS_ENDPOINT`).
- Real product / lifestyle photography to replace brand-colored placeholders.
- `hero-bg.jpg` is 3.3 MB and should be re-exported / compressed (needs an image tool);
  flagged as the main remaining performance item.
- Confirm the example wholesale prices and the seeded store-locator addresses.
