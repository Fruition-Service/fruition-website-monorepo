import type { RegionContent } from "./types"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"

/** The site-wide contact address, same one the footer and /contact-us publish. */
const CONTACT_EMAIL = "contact@fruitionservices.io"

/**
 * Every region office sells the same catalogue, so these two lists are shared
 * rather than restated per region.
 */
const SERVICE_TYPES = [
  "monday.com Consulting",
  "monday.com Implementation",
  "monday CRM Consulting",
  "monday.com Automation",
  "monday.com Integrations",
  "monday.com Data Migration",
  "monday.com Training",
  "monday AI Enablement",
]

const KNOWS_ABOUT = [
  "monday.com",
  "monday.com implementation",
  "monday.com consulting",
  "monday CRM",
  "workflow automation",
  "monday.com integrations",
  "data migration",
  "monday.com training",
  "monday AI",
]

/**
 * Per-region `ProfessionalService` (a LocalBusiness subtype) JSON-LD.
 *
 * Each region page describes one real office — the address and phone number
 * published in Sanity `siteSettings.offices` — hung off the site-wide
 * Organization node emitted by the root layout via `parentOrganization`.
 *
 * Deliberately carries no `aggregateRating`. Google requires review markup to
 * reflect ratings actually collected and shown on the page; the region pages
 * display none, and Fruition's real published counts are single digits. Adding
 * an invented score risks a structured-data manual action.
 */
export default function RegionLocalBusinessSchema({
  content,
}: {
  content: RegionContent
}) {
  const { localBusiness: lb, slug } = content
  const url = `${SITE_URL}/${slug}`

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#localbusiness`,
    name: lb.name,
    url,
    description: lb.description,
    parentOrganization: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Fruition Services",
      url: `${SITE_URL}/`,
    },
    telephone: lb.telephone,
    email: CONTACT_EMAIL,
    address: { "@type": "PostalAddress", ...lb.address },
    areaServed: [
      ...lb.areaServedCities.map((name) => ({ "@type": "City", name })),
      ...lb.areaServedCountries.map((name) => ({ "@type": "Country", name })),
    ],
    serviceType: SERVICE_TYPES,
    knowsAbout: KNOWS_ABOUT,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
