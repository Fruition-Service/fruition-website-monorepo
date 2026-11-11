import { vercelStegaClean } from "@vercel/stega"
import type { VcPageData } from "@/components/vc/types"
import { DATE_MODIFIED, PACKAGES, PAGE_URL, SITE_URL } from "./content"

/*
 * Structured data for /implementation-packages: the same @graph the page has
 * always published (WebPage, Service with its package offers, the services
 * OfferCatalog, BreadcrumbList, Person), built from the Sanity page document so
 * the prices in the markup and in the JSON-LD cannot drift apart. The FAQPage
 * node comes from the FAQ section itself (VcFaq), as on every Version C page.
 */

const clean = (s?: string) => vercelStegaClean(s ?? "").trim()
/** "$2,500", "US$2,500" or "A$18,000" -> 2500 / 18000. */
const amount = (s?: string) => Number(clean(s).replace(/[^0-9.]/g, "")) || 0

export function buildPricingJsonLd(page: VcPageData, seo: { title?: string; description?: string }) {
  const ORG_ID = `${SITE_URL}/#organization`
  const SERVICE_ID = `${PAGE_URL}#service`
  const COUNTRIES = ["Australia", "New Zealand", "Singapore", "India", "United Arab Emirates", "United Kingdom", "United States", "Canada"]
  const sections = page.sections ?? []
  const packages = sections.find((s) => s._type === "vcPriceCards" && clean(s.anchor) === "packages")
  const services = sections.find((s) => s._type === "vcServices")

  const offers = (packages?._type === "vcPriceCards" ? packages.items ?? [] : []).map((it) => {
    const name = clean(it.title)
    const known = PACKAGES.find((p) => p.name.toLowerCase() === name.toLowerCase())
    const monthly = /month/i.test(clean(it.unit))
    return {
      "@type": "Offer",
      name,
      description: known?.offerDescription ?? clean(it.best),
      url: `${PAGE_URL}#packages`,
      priceSpecification: monthly
        ? { "@type": "UnitPriceSpecification", price: amount(it.price), priceCurrency: "USD", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } }
        : { "@type": "PriceSpecification", minPrice: amount(it.price), priceCurrency: "USD" },
      itemOffered: { "@type": "Service", name: known?.offerServiceName ?? name },
    }
  })

  const serviceOffers = (services?._type === "vcServices" ? services.tabs ?? [] : [])
    .filter((t) => !/monday/i.test(clean(t.label)))
    .flatMap((t) =>
      (t.rows ?? []).map((r) => ({
        "@type": "Offer",
        name: `${clean(r.name)}: initial phase`,
        url: `${SITE_URL}${clean(r.href)}`,
        priceSpecification: { "@type": "PriceSpecification", minPrice: amount(r.price), priceCurrency: "AUD" },
        itemOffered: { "@type": "Service", name: clean(r.name), provider: { "@id": ORG_ID } },
      })),
    )

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: clean(seo.title),
        description: clean(seo.description),
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Fruition Services" },
        about: { "@id": SERVICE_ID },
        publisher: { "@id": ORG_ID },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        dateModified: DATE_MODIFIED,
      },
      {
        "@type": "Service",
        "@id": SERVICE_ID,
        name: "monday.com implementation packages",
        serviceType: [
          "monday.com implementation",
          "monday.com implementation packages",
          "monday.com implementation services",
          "monday.com implementation consultant",
          "monday.com implementation partner",
          "monday.com setup",
          "monday.com onboarding",
          "monday.com professional services",
        ],
        url: PAGE_URL,
        provider: { "@id": ORG_ID },
        areaServed: COUNTRIES.map((name) => ({ "@type": "Country", name })),
        hasOfferCatalog: { "@type": "OfferCatalog", name: "monday.com implementation packages", itemListElement: offers },
      },
      { "@type": "OfferCatalog", "@id": `${PAGE_URL}#services`, name: "Fruition services: starting prices", url: `${PAGE_URL}#services`, itemListElement: serviceOffers },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "monday.com consulting", item: `${SITE_URL}/partnerships/monday-consulting-partner` },
          { "@type": "ListItem", position: 3, name: "Pricing", item: PAGE_URL },
        ],
      },
      { "@type": "Person", "@id": `${SITE_URL}/#josh-jebathilak`, name: "Josh Jebathilak", jobTitle: "Founder & Managing Director", worksFor: { "@id": ORG_ID } },
    ],
  }
}
