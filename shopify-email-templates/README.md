# Pulsar Shopify email templates

Branded versions of Shopify's customer notification emails. Paste each file's
contents into the matching template at Shopify → Settings → Notifications.

## Files
- `customer-account-activation.html` → "Customer account activation" / invite
- `customer-password-reset.html` → "Customer account password reset"

Both action buttons point at our headless pages (`/activate`, `/reset`) so the
links never go to the old Shopify-hosted store. After the domain move, swap
`pulsar-patch-website.vercel.app` for `pulsarpatch.com` in both.

## Header standard (default unless told otherwise)
Email headings (`h2` / the email title) render as **white uppercase copy on a
solid Pulsar-blue (`#44C8E8`) rectangle**, mirroring the blue header blocks on
the site. Keep this style for any new email templates.

## Brand bits
- Background: white (`#ffffff`)
- Primary button: pink pill (`#DE64A5`, fully rounded, white uppercase text)
- Links: Pulsar blue (`#44C8E8`)
- Logo: uses `shop.email_logo_url` (upload the PNG in Shopify) with the shop
  name as fallback
