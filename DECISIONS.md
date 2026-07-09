# Decisions log

Calls I made autonomously, with the reasoning. Items marked **[sanity-check]** are
worth a second look from the team.

- **Kept Vite/React, did not migrate to Next.js.** The brief names Next.js but the
  repo is Vite + React + react-router. Migrating would be a large, risky rewrite
  with no user-facing benefit. The real constraints (React front end, Shopify
  headless, Vercel, GitHub, secrets in env) are all satisfiable on Vite. **[sanity-check]**
- **Checkout = Shopify hosted checkout handoff.** There is no Shopify store wired
  in. I built `src/lib/shopify.js`: a Storefront API client (public token, safe for
  the client bundle) that creates a cart and redirects to Shopify's hosted,
  PCI-compliant `checkoutUrl`. It reads `VITE_SHOPIFY_*` env vars. When those are
  absent (current state) the app falls back to an internal `/checkout` review +
  confirmation page so the flow is never a dead end. **[sanity-check: add the env
  vars + variant GID mapping in Vercel to go live]**
- **Auth stays a client-side mock**, now clearly labelled as a demo. Real accounts
  need a backend (Shopify customer accounts or similar). **[sanity-check]**
- **Forms (Contact, Wholesale inquiry, BusinessSignup, newsletter) validate and
  confirm client-side but need a real endpoint** (Formspree, a Vercel serverless
  function, or Shopify) to actually deliver. Wired to a single `submitLead()`
  helper so there's one place to point at a backend. **[sanity-check]**
- **Cart + user persist in `localStorage`.** No PII beyond what the user typed for
  the mock account; cleared on sign-out.
- **Header model simplified:** solid blue sticky header on every page, transparent
  over the hero only on Home (solidifies on scroll). The old code special-cased
  background/text color per-route in a fragile list; the new model is consistent and
  much harder to break when routes change.
- **Wholesale no longer hides pricing behind a fake login.** The old page gated
  pricing behind a hardcoded `admin` password and had ORDER NOW buttons that did
  nothing once "logged in." Pricing is now open and every CTA routes to the real
  `/business-signup` application. **[sanity-check: the tier prices ($3.00 / $2.75 /
  $2.50 per patch) and ~55% margin are examples — replace with real numbers.]**
- **Store-locator data is seeded placeholder addresses** across AZ & NV. Swap for the
  real 60+ accounts (or feed from a CMS / Shopify metafield) before launch.
  **[sanity-check]**
- **Admin (`/admin`) is gated behind sign-in** (mock auth) instead of being fully
  public. Not real security — it just stops a public URL from presenting as an admin
  panel. **[sanity-check: needs real auth if it ever holds real data.]**
- **Reviews now go through screening before they publish.** Every submitted review
  lands in a `pending` queue (`ReviewsContext`) and never shows on `/reviews` until
  it's approved in the Admin dashboard (Approve / Wait / Deny). "Wait" holds it out
  of public view and flags it so the team can reach out before it goes live. The
  Reviews form now also collects phone + order number so a rough review can be
  traced to a real customer. **The screening email to `hello@pulsarpatch.com` +
  `lclark0684@gmail.com` needs a backend to actually send** — `notifyReviewScreening()`
  posts the prebuilt HTML + recipients to `VITE_LEADS_ENDPOINT`; wire that endpoint to
  a mail provider (Resend/SendGrid) in a Vercel serverless function, key server-side.
  The exact HTML is previewable per-review in Admin. Admin action links in the email
  deep-link to `/admin?review=ID&action=approve|hold|deny`. The queue + a proactive
  bad review are seeded in `localStorage` for the demo. **[sanity-check: set the admin
  email via `VITE_ADMIN_EMAIL`, wire the mail endpoint, and swap localStorage for real
  storage/Shopify before launch.]**
- **Deleted the tracked macOS `._*` / `.DS_Store` junk** (thousands of files that were
  breaking eslint) and gitignored them. This is why the diff touches many asset files.
- **Kept the floating-patch hero interaction** (desktop drag/tilt) but made its
  container responsive; it degrades to a static cluster on touch.
- **Did not re-encode `hero-bg.jpg` (3.3 MB)** — that needs an image tool. It's the
  top remaining performance item. **[sanity-check]**
