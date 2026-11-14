/**
 * Unit tests for the breadcrumb page-shell registry.
 *
 * The second block is a drift guard: the shells only keep the breadcrumb trail
 * aligned while they still match the containers the shared templates render, so
 * the tests read those templates and fail if a container width or gutter moves
 * without the registry moving with it.
 */
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { PAGE_SHELLS, pageShell, pageShellKey } from "@/lib/pageShell"

function source(path: string) {
  return readFileSync(`${process.cwd()}/${path}`, "utf8")
}

describe("pageShellKey", () => {
  it("falls back to the practice-page shell for unregistered routes", () => {
    expect(pageShellKey("/ai-consulting")).toBe("standard")
    expect(pageShellKey("/ai-consulting/agent-development")).toBe("standard")
    expect(pageShellKey("/some-page-that-does-not-exist")).toBe("standard")
  })

  it("resolves route families by prefix", () => {
    expect(pageShellKey("/monday-partner-australia")).toBe("wide")
    expect(pageShellKey("/monday-for-retail")).toBe("banner")
    expect(pageShellKey("/industries/healthcare")).toBe("banner")
    expect(pageShellKey("/author/josh-jebathilak")).toBe("blog")
    expect(pageShellKey("/consulting-blog/categories/ai")).toBe("blog")
  })

  it("prefers an exact route over its family prefix", () => {
    // /industries is a practice page; the industry pages under it are banners.
    expect(pageShellKey("/industries")).toBe("standard")
    expect(pageShellKey("/monday-for-construction")).toBe("banner")
    // …and /monday-training is not part of the /monday-for- banner family.
    expect(pageShellKey("/monday-training")).toBe("wide")
  })

  it("splits /partnerships between its two templates", () => {
    expect(pageShellKey("/partnerships/anthropic-claude-partner")).toBe("aiPartner")
    expect(pageShellKey("/partnerships/monday-consulting-partner")).toBe("banner")
    // Sanity-driven pages have no route of their own and open with HeroBanner,
    // so an unlisted partnership slug must land on the banner shell.
    expect(pageShellKey("/partnerships/certified-hubspot-partner")).toBe("banner")
    expect(pageShellKey("/partnerships/some-future-sanity-page")).toBe("banner")
  })

  it("follows the solution index's own grid, not the region shell", () => {
    expect(pageShellKey("/monday-consulting-solutions")).toBe("solutionsIndex")
  })

  it("ignores a trailing slash", () => {
    expect(pageShellKey("/monday-partner-uk/")).toBe("wide")
    expect(pageShell("/data-privacy/")).toBe(PAGE_SHELLS.prose)
  })
})

describe("shells still match the templates they mirror", () => {
  it("practice pages", () => {
    expect(source("src/components/PracticePageTemplate.tsx")).toContain(
      "max-w-[1148px] mx-auto px-4",
    )
    expect(PAGE_SHELLS.standard).toBe("max-w-[1148px] px-4")
  })

  it("region pages", () => {
    expect(source("src/components/region/RegionHero.tsx")).toContain(
      "max-w-[1200px] px-4",
    )
    expect(PAGE_SHELLS.wide).toBe("max-w-[1200px] px-4")
  })

  it("banner heroes", () => {
    expect(source("src/components/sections/HeroBanner.tsx")).toContain(
      "px-4 md:px-16 lg:px-24 max-w-[1588px]",
    )
    expect(PAGE_SHELLS.banner).toBe("max-w-[1588px] px-4 md:px-16 lg:px-24")
  })

  it("Sanity-driven partnership pages", () => {
    expect(source("src/components/UniversalPageTemplate.tsx")).toContain(
      "mx-auto px-4 max-w-[1042px]",
    )
    expect(PAGE_SHELLS.universal).toBe("max-w-[1042px] px-4")
  })

  it("AI partner pages", () => {
    const ai = source("src/components/AiPartnerTemplate.tsx")
    expect(ai).toContain(".ap-wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }")
    expect(ai).toContain(".ap-wrap { padding: 0 20px; }")
    // px-5 under md (20px), px-8 above it (32px).
    expect(PAGE_SHELLS.aiPartner).toBe("max-w-[1240px] px-5 md:px-8")
  })
})
