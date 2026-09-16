import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
import { REGION_PAGES } from "@/data/regionPages"
import type { RegionSlug } from "@/components/region/types"

/** Matches the live `team-josh` doc: every region, so `regions` can't gate him. */
const JOSH: TeamMember = {
  _id: "team-josh",
  name: "Josh Jebathilak",
  role: "Founder & CEO, ex-monday.com",
  regions: ["APAC", "UK", "US", "IN", "SG", "PH"],
  photoUrl: "https://example.test/josh.png",
  bio: "Founder and CEO of Fruition Services.",
}

/** An ordinary APAC consultant, so the grid is never empty on APAC pages. */
const NIKKI: TeamMember = {
  _id: "team-nikki",
  name: "Nikki Glucksman",
  role: "Principal Consultant",
  regions: ["APAC", "UK", "US", "IN", "SG", "PH"],
  photoUrl: "https://example.test/nikki.png",
  bio: "Principal consultant.",
}

function render(slug: RegionSlug) {
  return renderToStaticMarkup(
    <TeamGridSection
      heading="Meet the team"
      members={[JOSH, NIKKI]}
      region={REGION_PAGES[slug].teamRegion}
      regionPageSlug={slug}
      deliveryRosterOnly
    />,
  )
}

/**
 * A regional grid with no page slug. The Props type makes this a compile error
 * — that is the first line of defence — so the cast is what a caller outside
 * the type system (a JS consumer, a bad `any`) would produce. It exists to pin
 * down the runtime behaviour in that case: hide, never over-show.
 */
function renderWithNoSlug() {
  const Untyped = TeamGridSection as unknown as (p: Record<string, unknown>) => React.ReactElement
  return renderToStaticMarkup(
    <Untyped
      heading="Meet the team"
      members={[JOSH, NIKKI]}
      region="APAC"
      deliveryRosterOnly
    />,
  )
}

/**
 * End-to-end cover for the pin, at the component every regional team grid goes
 * through. The call-site version of this rule was lost twice (#160 -> #215);
 * asserting here means a future page can't reintroduce the bug by rendering the
 * grid itself.
 */
describe("TeamGridSection region-page pins", () => {
  const slugs = Object.keys(REGION_PAGES) as RegionSlug[]

  it.each(slugs)("renders Josh on %s only if it is Australia", (slug) => {
    const html = render(slug)
    expect(html).toContain("Nikki Glucksman")
    expect(html.includes("Josh Jebathilak")).toBe(slug === "monday-partner-australia")
  })

  it("drops him when the grid names no region page (fails closed)", () => {
    const html = renderWithNoSlug()
    expect(html).toContain("Nikki Glucksman")
    expect(html).not.toContain("Josh Jebathilak")
  })

  it("leaves non-regional grids alone", () => {
    const html = renderToStaticMarkup(
      <TeamGridSection heading="Everyone" members={[JOSH, NIKKI]} />,
    )
    expect(html).toContain("Josh Jebathilak")
  })
})
