import { describe, expect, it } from "vitest"
import type { VcPageData } from "@/components/vc/types"
import { buildPricingJsonLd } from "./jsonld"

describe("pricing JSON-LD", () => {
  it("keeps each service row's own currency", () => {
    const page = {
      sections: [
        {
          _type: "vcServices",
          tabs: [
            {
              label: "HubSpot",
              rows: [
                { name: "HubSpot implementation", note: "Initial phase, from", href: "/hubspot-consulting", price: "US$3,000" },
                { name: "monday.com and HubSpot integration", note: "Initial phase, from", href: "/hubspot-consulting", price: "A$8,000" },
              ],
            },
          ],
        },
      ],
    } as unknown as VcPageData
    const graph = buildPricingJsonLd(page, {})["@graph"] as Array<Record<string, unknown>>
    const catalog = graph.find((n) => n["@id"]?.toString().endsWith("#services")) as { itemListElement: Array<{ priceSpecification: unknown }> }
    expect(catalog.itemListElement.map((o) => o.priceSpecification)).toEqual([
      { "@type": "PriceSpecification", minPrice: 3000, priceCurrency: "USD" },
      { "@type": "PriceSpecification", minPrice: 8000, priceCurrency: "AUD" },
    ])
  })
})
