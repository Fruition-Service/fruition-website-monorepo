import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import type { TeamMember } from "@/components/TeamGridSection"
import { REGION_PAGES } from "@/data/regionPages"
import {
  REGION_PAGES_ONLY,
  REGION_PAGE_LEADS,
  ROSTER_LEADS,
  allowedRegionPages,
  filterTeamForTab,
  rosterOrder,
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
    const merged = mergeTeamMembers(
      [{ ...JOSH, photoUrl: "/j.jpg" }, member("Ada Lovelace", { role: "Consultant", photoUrl: "/a.jpg" })],
      [],
    )
    expect(merged.map((m) => m.name)).toEqual(["Josh Jebathilak", "Ada Lovelace"])
  })

  it("drops half-filled onboarding records with no role or no photo", () => {
    const merged = mergeTeamMembers(
      [
        member("New item", { role: "Consultant", photoUrl: "/n.jpg" }),
        member("Louis Romero (copy)", { role: "Consultant", photoUrl: "/l.jpg" }),
        member("No Role", { photoUrl: "/r.jpg" }),
        member("No Photo", { role: "Consultant" }),
        member("Complete", { role: "Consultant", photoUrl: "/c.jpg" }),
      ],
      [],
    )
    expect(merged.map((m) => m.name)).toEqual(["Complete"])
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

describe("/fruition-team tab placement (Josh, 3 Nov 2026)", () => {
  // Mirrors the live team-chloe doc, which the SG/PH migration tagged SG.
  const CHLOE = member("Chloe Jebathilak", { role: "Director of Operations", regions: ["APAC", "SG"] })
  const TABS = ["APAC", "UK", "US", "SG", "IN", "PH"]

  it("keeps Josh and Chloe in the Australia (APAC) tab only, whatever Sanity tags them", () => {
    const everywhere = ["APAC", "UK", "US", "IN", "SG", "PH"]
    for (const person of [JOSH, { ...CHLOE, regions: everywhere }]) {
      for (const tab of TABS) {
        const shown = filterTeamForTab([person], tab).length === 1
        expect(shown, `${person.name} in ${tab}`).toBe(tab === "APAC")
      }
    }
  })

  it("keeps Chloe off every region page but Australia", () => {
    for (const slug of REGION_SLUGS) {
      const shown = filterTeamForRegionPage([CHLOE], slug).length === 1
      expect(shown, slug).toBe(slug === "monday-partner-australia")
    }
  })

  it("hides Benjie from every tab", () => {
    const benjie = member("Benjie Belotindos", { regions: ["APAC", "PH"] })
    for (const tab of TABS) expect(filterTeamForTab([benjie], tab), tab).toEqual([])
  })

  it("still filters everyone else on their own regions", () => {
    const kevin = member("Kevin Zhao", { regions: ["UK"] })
    expect(filterTeamForTab([kevin], "UK")).toEqual([kevin])
    expect(filterTeamForTab([kevin], "APAC")).toEqual([])
  })

  const byRole = (a: TeamMember, b: TeamMember) => a.name.localeCompare(b.name)

  it("orders the named leads first in each roster", () => {
    const sort = (code: string, names: string[]) =>
      names.map((n) => member(n)).sort(rosterOrder(code, byRole)).map((m) => m.name)
    expect(sort("APAC", ["Chloe Jebathilak", "Suzzane Castro", "Alex Twigger", "Josh Jebathilak"]).slice(0, 2))
      .toEqual(["Josh Jebathilak", "Suzzane Castro"])
    expect(sort("UK", ["Alex Bordei", "Bruna Alves", "Kevin Zhao"]).slice(0, 2)).toEqual(["Kevin Zhao", "Bruna Alves"])
    expect(sort("US", ["Clarice Borges", "Valeria Marin", "Zach Weller"]).slice(0, 2)).toEqual(["Zach Weller", "Valeria Marin"])
    expect(sort("SG", ["Edward Zhang", "Branson McMahon"])).toEqual(["Branson McMahon", "Edward Zhang"])
  })

  it("never adds a lead who is not already in the roster", () => {
    const out = [member("Alex Bordei")].sort(rosterOrder("UK", byRole))
    expect(out.map((m) => m.name)).toEqual(["Alex Bordei"])
  })

  it("gives Singapore and the Philippines no Australian lead order", () => {
    expect(REGION_PAGE_LEADS["monday-partner-singapore"]).toBeUndefined()
    expect(REGION_PAGE_LEADS["monday-partner-philippines"]).toBeUndefined()
    expect(Object.values(REGION_PAGE_LEADS).every((code) => code && code in ROSTER_LEADS)).toBe(true)
  })
})
