import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { LANDING_PAGE_USE_CASES } from "./featured"
import { RETIRED_INDUSTRY_SLUGS, retiredUseCaseRedirects } from "./retired"
import { INDUSTRY_PAGES, caseAnchorHref, hubIndustryHref, industryHref, type UseCaseIndex } from "./types"

const index: UseCaseIndex = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/ai-use-cases/index.json"), "utf8"),
)

describe("retired /ai-use-cases/<industry> pages", () => {
  it("covers every catalogue industry exactly once", () => {
    expect([...RETIRED_INDUSTRY_SLUGS].sort()).toEqual(index.industries.map((i) => i.slug).sort())
  })

  it("maps each industry to its landing page, and only cross-industry to the hub", () => {
    const table = Object.fromEntries(retiredUseCaseRedirects.map((r) => [r.source, r.destination]))
    expect(table).toEqual({
      "/ai-use-cases/construction": "/monday-for-construction#ai-use-cases",
      "/ai-use-cases/education-nonprofit": "/industries/education#ai-use-cases",
      "/ai-use-cases/financial-services": "/industries/financial-services#ai-use-cases",
      "/ai-use-cases/government": "/monday-for-government#ai-use-cases",
      "/ai-use-cases/healthcare": "/industries/healthcare#ai-use-cases",
      "/ai-use-cases/logistics": "/industries/transport-logistics#ai-use-cases",
      "/ai-use-cases/manufacturing": "/monday-for-manufacturing#ai-use-cases",
      "/ai-use-cases/professional-services": "/monday-for-professional-services#ai-use-cases",
      "/ai-use-cases/real-estate": "/monday-for-real-estate#ai-use-cases",
      "/ai-use-cases/retail-ecommerce": "/monday-for-retail#ai-use-cases",
      "/ai-use-cases/technology-saas": "/industries/technology-saas#ai-use-cases",
      "/ai-use-cases/cross-industry": "/ai-use-cases",
    })
    for (const r of retiredUseCaseRedirects) expect(r.statusCode).toBe(301)
  })

  it("only sends traffic to pages that show that industry's catalogue", () => {
    for (const [slug, page] of Object.entries(INDUSTRY_PAGES)) {
      const source = (LANDING_PAGE_USE_CASES as Record<string, { industrySlug: string }>)[page]
      expect(source, `${page} has no LANDING_PAGE_USE_CASES entry`).toBeDefined()
      expect(source.industrySlug).toBe(slug)
    }
  })

  it("is wired into next.config redirects", async () => {
    const { default: config } = await import("../../../next.config")
    const redirects = (await config.redirects?.()) ?? []
    for (const r of retiredUseCaseRedirects) {
      const hit = redirects.find((x) => x.source === r.source)
      expect(hit, r.source).toBeDefined()
      expect(hit?.destination).toBe(r.destination)
      expect(hit && "statusCode" in hit ? hit.statusCode : undefined).toBe(301)
    }
  })

  it("is out of the sitemap, with the hub still in", () => {
    const src = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8")
    for (const slug of RETIRED_INDUSTRY_SLUGS) expect(src).not.toContain(`"/ai-use-cases/${slug}"`)
    expect(src).toContain('"/ai-use-cases"')
  })
})

describe("use case links", () => {
  it("sends industries to their page section, or the filtered hub when they have no page", () => {
    expect(industryHref({ slug: "healthcare", key: "healthcare" })).toBe("/industries/healthcare#ai-use-cases")
    expect(industryHref({ slug: "real-estate", key: "realestate" })).toBe("/monday-for-real-estate#ai-use-cases")
    expect(industryHref({ slug: "cross-industry", key: "cross" })).toBe("/ai-use-cases?industry=cross#catalogue")
  })

  it("opens a build in the hub with its industry preselected, never on a retired URL", () => {
    expect(caseAnchorHref("realestate", "uc-e499503a")).toBe("/ai-use-cases?industry=realestate#uc-e499503a")
    expect(hubIndustryHref("tech")).toBe("/ai-use-cases?industry=tech#catalogue")
    for (const i of index.industries) {
      expect(industryHref(i)).not.toMatch(/^\/ai-use-cases\/./)
      expect(caseAnchorHref(i.key, "uc-x")).not.toMatch(/^\/ai-use-cases\/./)
    }
  })
})
