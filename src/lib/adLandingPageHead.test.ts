import { describe, expect, it } from "vitest"
import { REGION_OG_LOCALE, withLandingPageLayout, withLandingPageTracking } from "./landingPage"
import { adLandingPages } from "./adLandingPages"
import type { LeadRegion } from "./leadNotify"

/**
 * Every Google Ads landing page must ship a complete <head>: the tags a browser
 * tab, a shared link and the Google Ads review all read. The pages bypass
 * src/app/layout.tsx, so none of this comes for free; landingPage.ts adds what
 * it can at serve time and the page document must carry the rest.
 *
 * This exists because pages shipped without a favicon (Google Ads showed no logo
 * next to the ads until 2026-10-19) and, earlier, without GTM or social previews.
 */
const pages = adLandingPages()
const REGIONS: LeadRegion[] = ["APAC", "SEA", "IND", "NA", "UK"]

describe("Google Ads landing pages", () => {
  it("are discovered from their route handlers", () => {
    expect(pages.length).toBeGreaterThanOrEqual(48)
    expect(pages.map((p) => p.page)).toContain("sea/monday-partner-singapore-malaysia")
  })

  it("each report leads under their own adwords-lp- source", () => {
    const sources = pages.map((p) => p.source)
    for (const s of sources) expect(s).toMatch(/^adwords-lp-[a-z0-9-]+$/)
    expect(new Set(sources).size).toBe(sources.length)
  })

  it("map each region to its ISO og:locale (en_GB for the UK, en_US for the US)", () => {
    expect(REGION_OG_LOCALE).toEqual({ APAC: "en_AU", SEA: "en_SG", IND: "en_IN", NA: "en_US", UK: "en_GB" })
  })

  it("emit exactly one og:locale whatever the document already carries", () => {
    const head = (extra: string) =>
      `<html lang="en"><head><title>T</title>${extra}</head><body></body></html>`
    for (const extra of [
      "",
      '\n  <meta property="og:locale" content="en_UK">\n',
      '<meta property="og:image" content="https://example.com/a.png">',
      '<meta property="og:image" content="x"><meta property="og:locale" content="en_AU">',
    ]) {
      const out = withLandingPageTracking(head(extra), { source: "adwords-lp-test", region: "UK" })
      expect(out.match(/property="og:locale"/g)).toHaveLength(1)
      expect(out).toContain('<meta property="og:locale" content="en_GB">')
    }
    const untitled = withLandingPageTracking("<html><head></head><body></body></html>", {
      source: "adwords-lp-test",
      region: "SEA",
    })
    expect(untitled.match(/<meta property="og:locale" content="en_SG">/g)).toHaveLength(1)
  })

  it.each(pages)("$page serves a complete head", async ({ page, source, region }) => {
    expect(REGIONS).toContain(region)
    const { html } = await import(`@/app/${page}/content`)
    const out = withLandingPageTracking(withLandingPageLayout(html, [], region as LeadRegion), {
      source,
      region: region as LeadRegion,
    })
    const head = out.slice(0, out.search(/<\/head>/i))
    const meta = (attr: string, key: string) =>
      head.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, "i"))?.[1]?.trim()

    // Document basics
    expect(out).toMatch(/<html\s+lang="[a-z]{2}(-[A-Z]{2})?"/)
    expect(head).toMatch(/<meta charset="utf-8">/i)
    expect(head).toContain('name="viewport"')
    expect(head.match(/<title>([^<]+)<\/title>/)?.[1]?.trim()).toBeTruthy()
    expect(meta("name", "description")).toBeTruthy()
    // Paid traffic only: never indexed (the response also sends X-Robots-Tag).
    expect(meta("name", "robots")).toMatch(/noindex/)
    // Favicon and touch icon (the logo Google Ads shows next to the ad)
    expect(head).toMatch(/<link rel="icon" href="\/favicon\.ico"/)
    expect(head).toMatch(/<link rel="apple-touch-icon" href="[^"]+"/)
    // Social preview card
    for (const key of ["og:title", "og:description", "og:image", "og:type"]) expect(meta("property", key)).toBeTruthy()
    expect(meta("name", "twitter:card")).toBe("summary_large_image")
    // og:locale for the ad's market, exactly once
    expect(meta("property", "og:locale")).toBe(REGION_OG_LOCALE[region as LeadRegion])
    expect(out.match(/property="og:locale"/g)).toHaveLength(1)
    // Tracking
    expect(head).toContain("'dataLayer','GTM-PF6XWTL6'")
    // One H1, the ad's headline
    expect(out.match(/<h1\b/g)).toHaveLength(1)
  })
})
