import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { LANDING_PAGE_USE_CASES, pickFeaturedUseCases } from "./featured"
import type { IndustryUseCases, UseCase, UseCaseIndex } from "./types"

function uc(overrides: Partial<UseCase>): UseCase {
  return {
    id: "uc-x",
    industry: "construction",
    departments: [],
    solutionTypes: [],
    ai: false,
    own: false,
    kicker: "Construction",
    title: "Builder",
    summary: "",
    teams: [],
    challenge: "",
    boards: [],
    automations: [],
    integrations: [],
    ...overrides,
  }
}

describe("pickFeaturedUseCases", () => {
  it("leads with client builds, then AI, then evidence, keeping curated order on ties", () => {
    const list = [
      uc({ id: "plain-1" }),
      uc({ id: "own-ai", own: true, ai: true, metric: "27 replies" }),
      uc({ id: "outcome", outcome: "Faster quotes" }),
      uc({ id: "ai", ai: true }),
      uc({ id: "plain-2" }),
    ]
    expect(pickFeaturedUseCases(list, { industrySlug: "construction", label: "Construction" }, 4).map((u) => u.id)).toEqual([
      "ai",
      "outcome",
      "plain-1",
      "plain-2",
    ])
  })

  it("ranks preferred matches first, and can restrict to them", () => {
    const list = [
      uc({ id: "builder", ai: true }),
      uc({ id: "solar", title: "Residential solar installer" }),
      uc({ id: "energy", summary: "Energy projects tracked in spreadsheets" }),
    ]
    const solar = { industrySlug: "construction", label: "Solar", prefer: /\b(solar|energy)/i }
    expect(pickFeaturedUseCases(list, solar).map((u) => u.id)).toEqual(["solar", "energy", "builder"])
    expect(pickFeaturedUseCases(list, { ...solar, onlyPreferred: true }).map((u) => u.id)).toEqual([
      "solar",
      "energy",
    ])
  })
})

/** Guards the imported catalogue against the landing-page map drifting from it. */
describe("imported catalogue", () => {
  const dir = join(process.cwd(), "public/data/ai-use-cases")
  const read = <T,>(name: string) => JSON.parse(readFileSync(join(dir, name), "utf8")) as T

  it("has a data file for every industry in the index", () => {
    const index = read<UseCaseIndex>("index.json")
    expect(index.industries).toHaveLength(12)
    for (const industry of index.industries) {
      expect(existsSync(join(dir, `${industry.slug}.json`))).toBe(true)
    }
    expect(index.industries.reduce((n, i) => n + i.count, 0)).toBe(index.total)
  })

  it("gives every mapped landing page at least three use cases", () => {
    for (const [path, source] of Object.entries(LANDING_PAGE_USE_CASES)) {
      const page = read<IndustryUseCases>(`${source.industrySlug}.json`)
      const picked = pickFeaturedUseCases(page.useCases, source)
      expect(picked.length, path).toBeGreaterThanOrEqual(3)
      expect(new Set(picked.map((u) => u.id)).size, path).toBe(picked.length)
    }
  })
})
