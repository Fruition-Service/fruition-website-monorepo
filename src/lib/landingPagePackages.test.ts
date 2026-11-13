import { describe, expect, it } from "vitest"
import { withLandingPageLayout } from "./landingPage"
import { html as au } from "@/app/au/monday-partner/content"
import { html as uk } from "@/app/uk/monday-partner/content"
import { html as us } from "@/app/us/monday-partner/content"

describe("Implementation packages on the monday-partner ad pages", () => {
  for (const [region, page] of [
    ["au", au],
    ["uk", uk],
    ["us", us],
  ] as const) {
    it(`${region}: sits straight after Client proof, with the three tiers`, () => {
      const out = withLandingPageLayout(page)
      const proof = out.indexOf('id="reviews"')
      const pkgs = out.search(/<section[^>]*id="packages"/)
      const deliver = out.indexOf('<p class="k">What we deliver</p>')
      expect(proof).toBeGreaterThan(0)
      expect(pkgs).toBeGreaterThan(proof)
      expect(deliver).toBeGreaterThan(pkgs)
      // Nothing between the Client proof band and the packages.
      expect(out.slice(proof, pkgs).match(/<section\b/g) ?? []).toHaveLength(0)

      const section = out.slice(pkgs, out.indexOf("</section>", pkgs))
      expect(section).toContain('<h2 class="sec">Implementation packages</h2>')
      for (const tier of ["Training &amp; Optimisation", "Lock-Step", "Deployed Engineer"]) {
        expect(section).toContain(tier)
      }
      // Orphaned page: the section only links to the page's own form.
      expect([...section.matchAll(/href="([^"]+)"/g)].map((m) => m[1])).toEqual(["#lead", "#lead", "#lead"])
    })
  }
})
