import { describe, expect, it } from "vitest"
import { SOLUTIONS } from "../data/solutions"
import { findSolution, solutionHref } from "./deepLink"

describe("findSolution", () => {
  it("matches by key", () => {
    expect(findSolution(SOLUTIONS, "dream-crm")?.title).toBe("Dream CRM")
  })

  it("matches by title, ignoring case and punctuation", () => {
    expect(findSolution(SOLUTIONS, "migration services")?.key).toBe("migration")
    expect(findSolution(SOLUTIONS, "Dream CRM")?.key).toBe("dream-crm")
  })

  it("returns null for nothing, or an unknown value", () => {
    expect(findSolution(SOLUTIONS, null)).toBeNull()
    expect(findSolution(SOLUTIONS, "not a solution")).toBeNull()
  })

  it("round-trips every solution through its href", () => {
    for (const s of SOLUTIONS) {
      const value = new URL(solutionHref(s.key), "https://x.test").searchParams.get("solution")
      expect(findSolution(SOLUTIONS, value)?.key).toBe(s.key)
    }
  })
})
