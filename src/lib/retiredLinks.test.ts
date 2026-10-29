import { describe, expect, it } from "vitest"
import {
  RETIRED_HUB_DESTINATION,
  RETIRED_SOLUTION_SLUGS,
  dropRetiredHubNavLinks,
  retiredLinkHref,
  rewriteRetiredLinks,
} from "./retiredLinks"

describe("retiredLinkHref", () => {
  it("rewrites the relative hub URL", () => {
    expect(retiredLinkHref("/monday-consulting-solutions")).toBe(RETIRED_HUB_DESTINATION)
    expect(RETIRED_HUB_DESTINATION).toBe("/monday-implementation-consultants")
  })

  it("rewrites trailing slash, query and hash variants", () => {
    expect(retiredLinkHref("/monday-consulting-solutions/")).toBe(RETIRED_HUB_DESTINATION)
    expect(retiredLinkHref("/monday-consulting-solutions?utm_source=nav")).toBe(RETIRED_HUB_DESTINATION)
    expect(retiredLinkHref("/monday-consulting-solutions#services")).toBe(RETIRED_HUB_DESTINATION)
    expect(retiredLinkHref("/monday-consulting-solutions/?a=1#b")).toBe(RETIRED_HUB_DESTINATION)
    expect(retiredLinkHref("  /monday-consulting-solutions  ")).toBe(RETIRED_HUB_DESTINATION)
  })

  it("rewrites absolute URLs on the site's own host, www or not, any case", () => {
    expect(retiredLinkHref("https://www.fruitionservices.io/monday-consulting-solutions")).toBe(RETIRED_HUB_DESTINATION)
    expect(retiredLinkHref("https://fruitionservices.io/monday-consulting-solutions/")).toBe(RETIRED_HUB_DESTINATION)
    expect(retiredLinkHref("http://WWW.FruitionServices.io/monday-consulting-solutions")).toBe(RETIRED_HUB_DESTINATION)
  })

  it("leaves every subpath untouched", () => {
    for (const url of [
      "/monday-consulting-solutions/catalog",
      "/monday-consulting-solutions/monday-for-hr",
      "/monday-consulting-solutions/monday-service-1",
      "https://www.fruitionservices.io/monday-consulting-solutions/catalog",
    ]) {
      expect(retiredLinkHref(url)).toBe(url)
    }
  })

  it("leaves other hosts, lookalike paths and prose alone", () => {
    for (const url of [
      "https://example.com/monday-consulting-solutions",
      "/monday-consulting-solutions-old",
      "See /monday-consulting-solutions for more",
    ]) {
      expect(retiredLinkHref(url)).toBe(url)
    }
  })
})

describe("rewriteRetiredLinks", () => {
  it("passes non-string values through untouched", () => {
    expect(rewriteRetiredLinks(42)).toBe(42)
    expect(rewriteRetiredLinks(true)).toBe(true)
    expect(rewriteRetiredLinks(null)).toBe(null)
    expect(rewriteRetiredLinks(undefined)).toBe(undefined)
    const date = new Date("2026-10-29T00:00:00Z")
    expect(rewriteRetiredLinks(date)).toBe(date)
  })

  it("rewrites nested objects and arrays of links", () => {
    const payload = {
      hero: { ctaHref: "/monday-consulting-solutions", ctaText: "Our monday.com services" },
      nav: [
        { label: "monday.com solutions", href: "https://www.fruitionservices.io/monday-consulting-solutions" },
        { label: "Catalog", href: "/monday-consulting-solutions/catalog" },
      ],
      order: 3,
    }
    expect(rewriteRetiredLinks(payload)).toEqual({
      hero: { ctaHref: RETIRED_HUB_DESTINATION, ctaText: "Our monday.com services" },
      nav: [
        { label: "monday.com solutions", href: RETIRED_HUB_DESTINATION },
        { label: "Catalog", href: "/monday-consulting-solutions/catalog" },
      ],
      order: 3,
    })
  })
})

describe("dropRetiredHubNavLinks", () => {
  it("drops a nav item stored with the hub href and keeps the canonical one", () => {
    const nav = [
      { label: "monday.com solutions", href: "/monday-consulting-solutions" },
      { label: "monday.com solutions", href: "/monday-implementation-consultants" },
      { label: "Contact", href: "/contact-us" },
    ]
    expect(dropRetiredHubNavLinks(nav)).toEqual([
      { label: "monday.com solutions", href: "/monday-implementation-consultants" },
      { label: "Contact", href: "/contact-us" },
    ])
    expect(nav).toHaveLength(3)
  })

  it("matches the hub the same way retiredLinkHref does", () => {
    const nav = [
      "https://www.fruitionservices.io/monday-consulting-solutions/",
      "http://FruitionServices.io/monday-consulting-solutions?utm_source=nav",
      "/monday-consulting-solutions#top",
    ].map((href) => ({ label: "Hub", href }))
    expect(dropRetiredHubNavLinks(nav)).toEqual([])
  })

  it("filters nested groups at every depth and keeps siblings and empty groups", () => {
    const nav = [
      {
        label: "Partners",
        sections: [
          {
            heading: "Work platforms",
            items: [
              { label: "monday.com solutions", href: "/monday-consulting-solutions", icon: "monday" },
              { label: "Implementation consultants", href: "/monday-implementation-consultants" },
            ],
          },
          { heading: "Legacy", items: [{ label: "Hub", href: "/monday-consulting-solutions/" }] },
        ],
        columns: [{ children: [{ subItems: [{ label: "Hub", href: "/monday-consulting-solutions" }, { label: "HR", href: "/monday-consulting-solutions/monday-for-hr" }] }] }],
        footerLinks: [
          { label: "Hub", href: "https://www.fruitionservices.io/monday-consulting-solutions" },
          { label: "Catalog", href: "/monday-consulting-solutions/catalog" },
        ],
      },
      { label: "Contact", href: "/contact-us", order: 2 },
    ]
    expect(dropRetiredHubNavLinks(nav)).toEqual([
      {
        label: "Partners",
        sections: [
          {
            heading: "Work platforms",
            items: [{ label: "Implementation consultants", href: "/monday-implementation-consultants" }],
          },
          { heading: "Legacy", items: [] },
        ],
        columns: [{ children: [{ subItems: [{ label: "HR", href: "/monday-consulting-solutions/monday-for-hr" }] }] }],
        footerLinks: [{ label: "Catalog", href: "/monday-consulting-solutions/catalog" }],
      },
      { label: "Contact", href: "/contact-us", order: 2 },
    ])
  })

  it("keeps hub subpaths and passes non-object entries through", () => {
    const nav = [
      { label: "HR", href: "/monday-consulting-solutions/monday-for-hr" },
      { label: "Catalog", href: "/monday-consulting-solutions/catalog" },
      "/monday-consulting-solutions",
      null,
      7,
    ]
    expect(dropRetiredHubNavLinks(nav)).toEqual(nav)
  })

  it("leaves hub URLs outside the nav to rewriteRetiredLinks, which rewrites rather than drops", () => {
    const body = { body: [{ _type: "link", href: "/monday-consulting-solutions", text: "our services" }] }
    expect(rewriteRetiredLinks(body)).toEqual({
      body: [{ _type: "link", href: RETIRED_HUB_DESTINATION, text: "our services" }],
    })
    expect(rewriteRetiredLinks("/monday-consulting-solutions")).toBe(RETIRED_HUB_DESTINATION)
  })
})

describe("RETIRED_SOLUTION_SLUGS", () => {
  it("lists the six suffix-numbered duplicates and none of the real pages", () => {
    expect([...RETIRED_SOLUTION_SLUGS].sort()).toEqual([
      "monday-for-finance-4",
      "monday-for-hr-2",
      "monday-product-management-5",
      "monday-project-management-0",
      "monday-service-1",
      "solar-crm-solution-6",
    ])
    for (const real of [
      "catalog",
      "monday-for-finance",
      "monday-for-hr",
      "monday-service",
      "monday-product-management",
      "monday-project-management",
      "solar-crm-solution",
      "monday-for-cabinetry-renovation",
    ]) {
      expect(RETIRED_SOLUTION_SLUGS.has(real)).toBe(false)
    }
  })
})
