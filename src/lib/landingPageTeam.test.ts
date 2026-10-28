import { describe, expect, it } from "vitest"
import { withLandingPageLayout } from "./landingPage"
import { adLandingPages } from "./adLandingPages"
import { hasTeamSection, landingTeam, renderTeamSection } from "./landingPageTeam"
import type { LeadRegion } from "./leadNotify"

const routes = adLandingPages()

/**
 * Pages that already carried a hand-written team section, where one tile is a
 * real person whose headshot is not in this repo (Natalia Mishenina) and one is
 * a squad rather than a person. Their copy stays verbatim; the missing headshot
 * is a content request, not something to fake here.
 */
const AWAITING_PHOTO = new Set([
  "au/ai-business-consulting-services",
  "au/monday-consulting-services",
])

/** The team markup, from its opening container to the end of that section. */
function teamBlock(html: string): string {
  const start = html.search(/<section class="lp-team"|<div class="team"|<div class="tm"/)
  if (start < 0) return ""
  const close = html.indexOf("</section>", start)
  return html.slice(start, close < 0 ? undefined : close)
}

describe("landing team band", () => {
  it("covers the whole Google Ads estate", () => {
    expect(routes.length).toBeGreaterThanOrEqual(48)
  })

  it.each(routes.map((r) => [r.page, r.region] as const))(
    "%s shows a team photo block",
    async (page, region) => {
      const { html } = await import(`@/app/${page}/content`)
      const out = withLandingPageLayout(html, [], region as LeadRegion)

      expect(hasTeamSection(out)).toBe(true)

      // One band, not a stack of them. The consulting template repeats class="tm" per card.
      const bands = (out.match(/class="(?:team|lp-team)"/g) ?? []).length
      const tmCards = (out.match(/class="tm"/g) ?? []).length
      expect(Math.max(bands, tmCards > 0 ? 1 : 0)).toBe(1)

      const block = teamBlock(out)
      expect(block).not.toBe("")
      const photos = block.match(/<img [^>]*alt="[^"]+"/g) ?? []
      if (AWAITING_PHOTO.has(page as string)) {
        expect(photos.length).toBeGreaterThanOrEqual(1)
      } else {
        expect(photos.length).toBeGreaterThanOrEqual(3)
      }
    },
  )

  it("sizes and describes every photo it injects", async () => {
    let injected = 0
    for (const route of routes) {
      const { html } = await import(`@/app/${route.page}/content`)
      const out = withLandingPageLayout(html, [], route.region as LeadRegion)
      if (!out.includes('class="lp-team"')) continue
      injected += 1

      const imgs = teamBlock(out).match(/<img [^>]*>/g) ?? []
      expect(imgs).toHaveLength(3)
      for (const img of imgs) {
        expect(img).toContain('loading="lazy"')
        expect(img).toMatch(/\salt="[^"]{3,}"/)
        // Explicit sizing: the band must not shift the page as photos load.
        expect(img).toMatch(/\swidth="88"/)
        expect(img).toMatch(/\sheight="88"/)
      }
    }
    // The 12 AU pages that shipped without a consultants section.
    expect(injected).toBe(12)
  })

  it("only injects the band where the page has none", async () => {
    for (const route of routes) {
      const { html } = await import(`@/app/${route.page}/content`)
      const own = /\bclass="(?:team|tm)\b/.test(html)
      const out = withLandingPageLayout(html, [], route.region as LeadRegion)
      expect(out.includes('class="lp-team"')).toBe(!own)
    }
  })

  it("injects the region's own roster", async () => {
    for (const route of routes) {
      const { html } = await import(`@/app/${route.page}/content`)
      const out = withLandingPageLayout(html, [], route.region as LeadRegion)
      if (!out.includes('class="lp-team"')) continue
      for (const member of landingTeam(route.region as LeadRegion)) {
        expect(out).toContain(member.name)
        expect(out).toContain(member.photo)
      }
    }
  })

  it("puts the band under the proof band, before the booking band", async () => {
    const { html } = await import("@/app/au/monday-ai-integration/content")
    const out = withLandingPageLayout(html, [], "APAC")
    const proof = out.search(/<section class="lpp"/)
    const team = out.search(/<section class="lp-team"/)
    const booking = out.search(/<section class="final" id="book">/)
    expect(proof).toBeGreaterThanOrEqual(0)
    expect(team).toBeGreaterThan(proof)
    expect(booking).toBeGreaterThan(team)
  })

  it("is idempotent, so a re-render never doubles the band", async () => {
    const { html } = await import("@/app/au/monday-ai-integration/content")
    const once = withLandingPageLayout(html, [], "APAC")
    expect(withLandingPageLayout(once, [], "APAC")).toBe(once)
  })

  it("stays off when no region is given", async () => {
    const { html } = await import("@/app/au/monday-ai-integration/content")
    expect(withLandingPageLayout(html).includes('class="lp-team"')).toBe(false)
  })

  it("uses only photos already published on the site's Sanity CDN", () => {
    const regions: LeadRegion[] = ["APAC", "UK", "NA", "SEA", "IND"]
    for (const region of regions) {
      const team = landingTeam(region)
      expect(team).toHaveLength(3)
      expect(new Set(team.map((m) => m.name)).size).toBe(3)
      for (const member of team) {
        expect(member.photo).toMatch(
          /^https:\/\/cdn\.sanity\.io\/images\/bt6nb58h\/production\/[a-f0-9]+-\d+x\d+\.(jpg|png)\?/,
        )
        expect(member.name.length).toBeGreaterThan(3)
        expect(member.role.length).toBeGreaterThan(3)
      }
    }
  })

  it("renders three cards with alt text that names the person and the role", () => {
    const html = renderTeamSection("APAC")
    expect(html.match(/<article class="lp-team-card">/g)).toHaveLength(3)
    expect(html).toContain('alt="Josh Jebathilak, Founder and Managing Director at Fruition"')
    expect(html).toContain('id="team"')
  })
})
