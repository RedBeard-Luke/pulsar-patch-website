/**
 * RouteSeo — drives per-route <head> for the STATIC pages from the ROUTE_META
 * map. Dynamic pages (/blog/:id, /product/:id) render their own <Seo>, so this
 * stays out of their way to avoid duplicate tags.
 *
 * Mounted once, inside the Router (needs useLocation). Also emits the site-wide
 * Organization + WebSite JSON-LD, which is valid on every page.
 */
import { useLocation } from 'react-router-dom'
import Seo, { JsonLd } from './Seo'
import {
  ROUTE_META,
  DEFAULT_META,
  NOINDEX_ROUTES,
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  isSelfManagedRoute,
} from '../../lib/seo'

const SITE_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: DEFAULT_OG_IMAGE,
    description:
      'Transdermal hangover recovery patch powered by NAC and Glutathione.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
]

export default function RouteSeo() {
  const { pathname } = useLocation()

  // Dynamic pages own their head tags — don't double up.
  const selfManaged = isSelfManagedRoute(pathname)

  const meta = ROUTE_META[pathname] || DEFAULT_META
  const noindex = NOINDEX_ROUTES.has(pathname)

  return (
    <>
      {!selfManaged && (
        <Seo
          title={meta.title}
          description={meta.description}
          path={pathname}
          noindex={noindex}
        />
      )}
      <JsonLd data={SITE_JSONLD} />
    </>
  )
}
