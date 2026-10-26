const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'

export interface CollectionItem {
  name: string
  /** Site-relative path, e.g. "/partnerships/make-partners". */
  href: string
}

/**
 * CollectionPage + ItemList JSON-LD for a hub page (/partnerships,
 * /industries). The BreadcrumbList comes from the site-wide Breadcrumbs bar,
 * so it is not repeated here.
 */
export function collectionPageJsonLd({
  path,
  name,
  description,
  items,
}: {
  path: string
  name: string
  description: string
  items: CollectionItem[]
}) {
  const url = `${SITE_URL}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    url,
    name,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${SITE_URL}${item.href}`,
      })),
    },
  }
}

/** Serialise JSON-LD for a <script> tag; escapes "<" so no string can close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
