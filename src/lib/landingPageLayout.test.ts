import { readdirSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { withLandingPageLayout } from "./landingPage"
import { extractProof } from "./landingPageProof"

const APP = path.join(__dirname, "..", "app")
const pages = ["au", "uk", "us"].flatMap((region) =>
  readdirSync(path.join(APP, region)).map((slug) => `${region}/${slug}`),
)

const shared = [{ quote: "Shared quote", authorName: "Shared Person", authorRole: "COO", company: "Acme" }]

describe("withLandingPageLayout", () => {
  it.each(pages)("%s: hero, then reviews + logos, booking band last", async (page) => {
    const { html } = await import(`@/app/${page}/content`)
    const out = withLandingPageLayout(html, shared)

    const hero = out.search(/<(section|header) class="hero"/)
    const proof = out.search(/<section class="lpp"/)
    const booking = out.search(/<section class="final" id="book">/)
    const footer = out.search(/<footer\b/)

    expect(hero).toBeGreaterThanOrEqual(0)
    expect(proof).toBeGreaterThan(hero)
    if (booking >= 0) {
      expect(booking).toBeGreaterThan(proof)
      expect(booking).toBeLessThan(footer)
      // Nothing but the booking band between it and the footer.
      expect(out.slice(booking + 1, footer).match(/<section\b/g)).toBeNull()
    }

    // The page's own strip and quotes are folded into the band, not duplicated.
    expect(out).not.toContain('<div class="clients">')
    expect(out).not.toContain('<div class="trust">')
    expect(out).not.toContain('<p class="k">Client proof</p>')

    // Logos only, no links out of the page from the band.
    const band = out.slice(proof, out.indexOf("</section>", proof))
    expect(band.match(/<img [^>]*alt="[^"]+"/g)?.length ?? 0).toBeGreaterThan(0)
    expect(band.match(/<a [^>]*href="([^"]+)"/g)?.every((a) => a.includes('href="#lead"'))).toBe(true)
    expect(band).toContain("Shared quote")
  })

  it("is idempotent", async () => {
    const { html } = await import("@/app/uk/monday-partner/content")
    const once = withLandingPageLayout(html, shared)
    expect(withLandingPageLayout(once, shared)).toBe(once)
  })
})

describe("extractProof", () => {
  it("keeps the page's own quotes first and splits role from company", async () => {
    const { html } = await import("@/app/au/monday-for-engineering-architecture/content")
    const proof = extractProof(html)
    expect(proof.quotes[0]).toMatchObject({ authorName: "Allie Swindlehurst", authorRole: "Operations Manager", company: "Falkbuilt" })
    expect(proof.ratings.map((r) => r.score)).toEqual(["5.0", "5.0", "5.0", "4.0"])
  })

  it("turns text chips into approved logos and tops up missing ones", async () => {
    const { html } = await import("@/app/au/monday-for-construction/content")
    const names = extractProof(html).logos.map((l) => l.alt)
    expect(names).toHaveLength(6)
    expect(names).not.toContain("Acciona")
    expect(names).toContain("Qanstruct")
  })
})
