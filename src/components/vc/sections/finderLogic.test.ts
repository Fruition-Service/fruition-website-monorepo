import { describe, expect, it } from "vitest"
import { ALL, GENERAL, buildsFor, industryCounts, resultsIntro } from "./finderLogic"

const builds = [
  { name: "A", industry: "Retail" },
  { name: "B", industry: GENERAL },
  { name: "C", industry: "Construction" },
  { name: "D", industry: "Retail" },
  { name: "E", industry: "" },
]

describe("finder logic", () => {
  it("counts industries alphabetically with Other / general last", () => {
    expect(industryCounts(builds)).toEqual([["Construction", 1], ["Retail", 2], [GENERAL, 1]])
  })

  it("filters by industry and returns everything for ALL", () => {
    expect(buildsFor(builds, "Retail").map((b) => b.name)).toEqual(["A", "D"])
    expect(buildsFor(builds, ALL)).toHaveLength(5)
    expect(buildsFor(builds, null)).toEqual([])
  })

  it("writes the bot's results line", () => {
    expect(resultsIntro(5, "Construction", "HubSpot")).toBe("Here are 5 HubSpot builds for Construction. Tap one to see the full build.")
    expect(resultsIntro(26, ALL, "HubSpot")).toBe("Here are all 26 HubSpot builds. Tap one to see the full build.")
    expect(resultsIntro(1, GENERAL, "HubSpot")).toBe("Here is 1 HubSpot build that works across industries. Tap one to see the full build.")
    expect(resultsIntro(0, "Retail", "HubSpot")).toMatch(/^Nothing catalogued/)
  })
})

describe("finder detail helpers", () => {
  it("splits hubs on top-level commas only", async () => {
    const { splitHubs } = await import("./finderLogic")
    expect(splitHubs("Service Hub Professional, Sales Hub")).toEqual(["Service Hub Professional", "Sales Hub"])
    expect(splitHubs("Sales Hub Professional (Marketing Hub optional, for nurture)")).toEqual(["Sales Hub Professional (Marketing Hub optional, for nurture)"])
    expect(splitHubs(undefined)).toEqual([])
  })
  it("splits a phase into title and line", async () => {
    const { splitPhase } = await import("./finderLogic")
    expect(splitPhase("Pipeline foundation: stages, intake")).toEqual({ title: "Pipeline foundation", line: "Stages, intake" })
    expect(splitPhase("Go live")).toEqual({ title: "Go live", line: "" })
  })
})
