import { vercelStegaClean } from "@vercel/stega"
import type { VcPageData } from "@/components/vc/types"

/*
 * Structured data for /licence-procurement: WebPage, the procurement Service
 * (one offer per service card, no prices: every engagement is quoted after a
 * consultation) and the breadcrumb. The FAQPage node comes from the FAQ section
 * itself (VcFaq), as on every Version C page.
 */

const SITE_URL = "https://www.fruitionservices.io"
export const PAGE_PATH = "/licence-procurement"
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`
const clean = (s?: string | null) => vercelStegaClean(s ?? "").trim()

export function buildLicenceJsonLd(page: VcPageData) {
  const ORG_ID = `${SITE_URL}/#organization`
  const SERVICE_ID = `${PAGE_URL}#service`
  const services = (page.sections ?? []).find((s) => s._type === "vcCards" && clean(s.anchor) === "services")
  const offers = (services?._type === "vcCards" ? services.items ?? [] : []).map((it) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: clean(it.title), description: clean(it.body), provider: { "@id": ORG_ID } },
  }))
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: clean(page.seoTitle),
        description: clean(page.seoDescription),
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Fruition Services" },
        about: { "@id": SERVICE_ID },
        publisher: { "@id": ORG_ID },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": SERVICE_ID,
        name: "Software licence procurement",
        serviceType: ["Software licence procurement", "SaaS licence audit", "Software renewal management"],
        url: PAGE_URL,
        provider: { "@id": ORG_ID },
        hasOfferCatalog: { "@type": "OfferCatalog", name: "Licence procurement services", itemListElement: offers },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Licence procurement", item: PAGE_URL },
        ],
      },
    ],
  }
}
