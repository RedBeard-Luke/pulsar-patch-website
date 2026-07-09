# Pulsar Patch — Site Audit

Snapshot of the site exactly as inherited, before any changes. Every fix in this
project traces back to an item here. Status is updated as items are resolved.

**Stack reality check:** the brief describes Next.js, but the repo is **Vite +
React 19 + react-router-dom 7 + Tailwind 3**. I kept the real stack (rewriting to
Next.js would be a risky, non-additive change with no benefit here). "Shopify
Storefront API → Vercel → GitHub" is preserved as the intended integration and
wired as a handoff point (see A1).

---

## A. Architecture / commerce

- **A0. Build was broken.** `npm run build` failed — the `@rolldown/binding-darwin-arm64`
  native binding was missing (known npm optional-deps bug). Fixed by reinstalling. ✅
- **A1. No real Shopify integration / no checkout.** Cart is in-memory only; the
  "CHECK OUT" button did nothing. Prices hardcoded in `CartContext`. There is no
  store to connect to.
- **A2. Cart did not persist** across reloads (pure `useState`).
- **A3. Cart drawer was under-powered.** Could only decrement (no increment, no
  quantity, no remove button); no savings/subtotal clarity.
- **A4. Auth is a client-side mock** (password literally `admin`, hint shown
  on screen). Fine as a demo but must be labelled and never presented as secure.
- **A5. No 404 / catch-all route.** Unknown URLs render a blank page under the
  header/footer.
- **A6. No code-splitting.** Single 549 KB JS bundle; every page eager-loaded.
- **A7. Giant unoptimized images.** `hero-bg.jpg` is 3.3 MB. No lazy-loading.
- **A8. Repo hygiene.** `package.json` name is `vite-temp`; hundreds of macOS
  `._*` AppleDouble junk files tracked in the tree.

## B. Navigation & dead ends

- **B1. Header is desktop-only.** Fixed `px-20`, no hamburger, no mobile menu.
  All nav is **hover-only** (`onMouseEnter`) — unusable on touch devices. This is
  the single worst mobile problem.
- **B2. Dead nav links:** Header "Store Finder" → `/`, "Affiliate" → `/`
  (both go nowhere useful). Footer links to `/store-locator` and `/affiliate`
  which are **not routes** (blank page). Home links to `/recipes` (not a route).
- **B3. Header search results** show a grey placeholder box for every result and
  link products to `/product/1..5`.
- **B4. Contact** links to `/store-locator` (dead) and has a card that links to
  `/contact` (itself). Shipping references a nonexistent order-tracking page as
  plain text.
- **B5. Broken blog post:** `Blog.jsx` lists `1-bottle-wine-vs-pulsar` but there
  is no entry in `blogData.js` → routes to a dead-end redirect loop.
- **B6. Blog "Read by category" pills** look interactive but are inert `<span>`s.
- **B7. Wholesale ↔ BusinessSignup are disconnected** — no link between them.
- **B8. Admin** dashboard claims "every page" but omits `/account` and
  `/business-signup`; also has **no auth gate** (public).
- **B9. No store locator page at all**, despite 60+ AZ/NV retail locations being a
  core brand asset and a linked destination.

## C. Missing states (loading / empty / error / success / validation)

- **C1. Add-to-cart gives no feedback** anywhere (Home, Shop, Product,
  Subscription) — actions feel inert.
- **C2. Contact form** hands off to `mailto:` and shows a "THANK YOU" success
  screen immediately, even if nothing was sent (false positive). File upload is
  silently discarded. `lastName`/`phone` labelled required (`*`) but inputs are not.
- **C3. BusinessSignup form discards everything** — `handleSubmit` sets
  `submitted=true` and sends nothing. Long application → dead drop. Instagram/TikTok
  labelled required but not enforced; checkbox groups unvalidated.
- **C4. Product review form is a no-op** (closes + resets, saves nothing; stars
  can be 0). Hardcoded "6 REVIEWS" and static rating bars.
- **C5. Reviews page form** silently `return`s on invalid input (no message);
  slider values + photo captured then discarded; resets sliders to `''`; no
  "no reviews match filter" empty state.
- **C6. Newsletter signup** (Footer) input + button do nothing, no validation.
- **C7. Account page dead buttons:** Save Changes, Change/Pause/Cancel plan,
  Edit/Add address, Update Password — all no-ops. Password fields unvalidated.
- **C8. Wholesale** ORDER NOW / REORDER do nothing when "logged in"; prices are
  `$XX.XX` placeholders; hardcoded `lastOrder=null` makes the populated branch
  dead code.
- **C9. Product** `/product/99` (invalid id) silently renders Single Patch instead
  of a not-found state.

## D. Mobile (site-wide — treat as a first-class rebuild)

- **D1. `px-[140px]` on every section** with no responsive prefix. On a 375px
  phone that eats 280px, leaving ~95px of content. Everywhere.
- **D2. Non-responsive grids:** `grid-cols-3` / `grid-cols-5` / `grid-cols-4` with
  no `sm:`/`md:` — stay N-across on phones (Home, Shop, Product, Subscription,
  Science, About, Admin, Wholesale).
- **D3. Fixed pixel type:** `text-[54px]`/`[48px]`/`[42px]` headlines with no
  scaling — overflow/wrap badly. Several use `whitespace-nowrap` → guaranteed
  horizontal overflow.
- **D4. Hard `flex` splits:** `flex-[0_0_45%]` / `flex-[0_0_50%]` / fixed
  `flex-[0_0_Npx]` columns that never stack (Home, About, Science, Product,
  Reviews, Contact, Wholesale, Account).
- **D5. `min-w-[1440px]` / `min-w-[1920px]` background images** force horizontal
  scroll context.
- **D6. Blog carousel** hardcodes 3 cards per row at all widths; arrow buttons sit
  at `left-[-50px]` off-screen on mobile.
- **D7. No sticky/​thumb-reachable buy action** on Product (key conversion moment).

## E. Copy / brand voice / QA

- **E1. Typos in headlines:** "PEAL & STICK" (Product), "YOUR ALL SET"
  (Subscription), "HEY, WERE PULSAR" (About), "BE APART OF THE JOURNEY" (About),
  "LETS GET NERDY" (Science), "FAQ'S"/"BUSINESS FAQ'S" (FAQ, Wholesale).
- **E2. Em dashes in body copy** (About lines ~102, 110) — violates the no-em-dash
  rule.
- **E3. Off-brand template copy:** Shipping reads as global-dropshipping
  boilerplate ("fulfillment centers across the globe", "with tags") that
  contradicts a US-made AZ/NV brand; Refunds has EU cooling-off + "with tags";
  both clash with the voice.
- **E4. Contact leak / inconsistency:** Refunds exposes a personal `aaron@`
  address alongside `hello@`. Emails are plain text, not `mailto:`.
- **E5. "Pulsar affiliate" mislabel** in BusinessSignup SMS-consent block (this is
  wholesale, not the affiliate program); block is legalistic and off-voice.
- **E6. Garbled seed reviews** on Reviews page ("COSCO M.", "hangover-rule thing",
  missing "AGO").

## F. Two-audience clarity (consumer vs wholesale)

- **F1. Home has no explicit fork** for the two audiences. A wholesale buyer lands
  in consumer content and has to hunt; the consumer never sees the retail story.
- **F2. Wholesale path lacks credibility fast:** no retail-footprint proof (the
  60+ AZ/NV locations are never shown), no real pricing/margins, partnership story
  buried in an FAQ, and the inquiry form goes nowhere.

---

## Resolution log
Tracked in `ITERATIONS.md`. Items are checked off there per pass. Anything
consciously deferred (e.g. real Shopify credentials, real backend for form
submissions, real product photography) is called out in the handback with a reason.
