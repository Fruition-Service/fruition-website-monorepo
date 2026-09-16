import { describe, expect, it } from "vitest"
import type { TeamMember } from "@/components/TeamGridSection"
import { REGION_PAGES } from "@/data/regionPages"
import {
  REGION_PAGE_ONLY,
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

describe("filterTeamForRegionPage", () => {
  // The regression this file exists for: Josh was restricted to the Australia
  // page in #160, the six region pages were rebuilt in #215, and the rule went
  // with them. Driving the assertion off REGION_PAGES covers any region page
  // added later without touching this test.
  it("shows Josh on the Australia region page only", () => {
    const shownOn = REGION_SLUGS.filter(
      (slug) => filterTeamForRegionPage([JOSH], slug).length > 0,
    )
    expect(shownOn).toEqual(["monday-partner-australia"])
  })

  it("leaves unrestricted members on every region page", () => {
    const nikki = member("Nikki Glucksman", { regions: ["APAC", "UK"] })
    for (const slug of REGION_SLUGS) {
      expect(filterTeamForRegionPage([nikki], slug).map((m) => m.name)).toEqual([
        "Nikki Glucksman",
      ])
    }
  })

  it("points every restriction at a region page that actually exists", () => {
    for (const slug of Object.values(REGION_PAGE_ONLY)) {
      expect(REGION_SLUGS).toContain(slug)
    }
  })
})
