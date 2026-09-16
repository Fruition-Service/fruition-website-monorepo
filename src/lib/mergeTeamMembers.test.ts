import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import type { TeamMember } from "@/components/TeamGridSection"
import { REGION_PAGES } from "@/data/regionPages"
import {
  REGION_PAGES_ONLY,
  allowedRegionPages,
  filterTeamForRegionPage,
  mergeTeamMembers,
} from "@/lib/mergeTeamMembers"

function member(name: string, extra: Partial<TeamMember> = {}): TeamMember {
  return { _id: name.toLowerCase().replace(/\s+/g, "-"), name, ...extra }
}

/**
 * Mirrors the live Sanity doc `team-josh`: the founder carries every region
 * because he leads delivery globally, which is exactly why region codes alone
 * cannot keep him to a single page.
 */
const JOSH = member("Josh Jebathilak", {
  role: "Founder & CEO, ex-monday.com",
  regions: ["APAC", "UK", "US", "IN", "SG", "PH"],
})

const REGION_SLUGS = Object.keys(REGION_PAGES)

describe("mergeTeamMembers", () => {
  it("drops names on the Sanity exclude list, case- and accent-insensitively", () => {
    const merged = mergeTeamMembers(
      [member("Ada Lovelace"), member("Renée Descartes")],
      ["ada lovelace", "Renee Descartes"],
    )
    expect(merged).toEqual([])
  })

  it("keeps everyone who is not excluded", () => {
    const merged = mergeTeamMembers([JOSH, member("Ada Lovelace")], [])
    expect(merged.map((m) => m.name)).toEqual(["Josh Jebathilak", "Ada Lovelace"])
  })
})

describe("allowedRegionPages", () => {
  it("returns null for anyone unpinned", () => {
    expect(allowedRegionPages(member("Nikki Glucksman", { regions: ["APAC"] }))).toBeNull()
  })

  it("reads the Sanity property when there is no code-level pin", () => {
    const pinned = member("Ada Lovelace", {
      regionPagesOnly: ["monday-partner-uk"],
    })
    expect(allowedRegionPages(pinned)).toEqual(["monday-partner-uk"])
  })

  it("treats an empty Sanity property as no restriction", () => {
    expect(allowedRegionPages(member("Ada Lovelace", { regionPagesOnly: [] }))).toBeNull()
  })

  // The code-level pin is the backstop. Clearing the field in Studio, reseeding
  // the doc from monday, or restoring a backup must not widen it.
  it("ignores the Sanity property when a code-level pin exists", () => {
    const widened = { ...JOSH, regionPagesOnly: REGION_SLUGS }
    expect(allowedRegionPages(widened)).toEqual(["monday-partner-australia"])
    expect(allowedRegionPages({ ...JOSH, regionPagesOnly: [] })).toEqual([
      "monday-partner-australia",
    ])
  })
})

describe("filterTeamForRegionPage", () => {
  // The regression this file exists for: Josh was pinned to Australia in #160,
  // the six region pages were rebuilt in #215, and the pin went with them.
  // Driving the assertion off REGION_PAGES covers any region page added later
  // without touching this test.
  it("shows Josh on the Australia region page only", () => {
    const shownOn = REGION_SLUGS.filter(
      (slug) => filterTeamForRegionPage([JOSH], slug).length > 0,
    )
    expect(shownOn).toEqual(["monday-partner-australia"])
  })

  // The safety direction that matters: a grid wired up without a slug must
  // under-show, never put a pinned person back on every region page.
  it("fails closed when the page slug is missing", () => {
    expect(filterTeamForRegionPage([JOSH], undefined)).toEqual([])
  })

  it("leaves unrestricted members on every region page, and with no slug", () => {
    const nikki = member("Nikki Glucksman", { regions: ["APAC", "UK"] })
    for (const slug of [...REGION_SLUGS, undefined]) {
      expect(filterTeamForRegionPage([nikki], slug).map((m) => m.name)).toEqual([
        "Nikki Glucksman",
      ])
    }
  })

  it("points every code-level pin at region pages that actually exist", () => {
    for (const slugs of Object.values(REGION_PAGES_ONLY)) {
      expect(slugs.length).toBeGreaterThan(0)
      for (const slug of slugs) expect(REGION_SLUGS).toContain(slug)
    }
  })
})

/**
 * Guards the server/client boundary, not the render.
 *
 * `RegionPageTemplate` is a server component and `TeamGridSection` is a client
 * one, so every member handed across is serialised into the page's flight
 * payload whether or not a card is drawn for them. Filtering only inside the
 * grid left Josh's name, bio and photo in the HTML source of the five other
 * region pages — invisible on screen, fully readable to crawlers and answer
 * engines. The template must filter BEFORE the boundary.
 */
describe("region page flight payload", () => {
  it("filters pinned members before they cross into the client component", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/RegionPageTemplate.tsx"),
      "utf8",
    )
    // Whatever else changes, `members` must be a filtered list, never the raw
    // roster — that's what decides whether a pinned person reaches the HTML.
    const membersProp = source.match(/members=\{([^}]*)\}/)?.[1]
    expect(membersProp).toBeDefined()
    expect(membersProp).toContain("filterTeamForRegionPage")
  })
})
