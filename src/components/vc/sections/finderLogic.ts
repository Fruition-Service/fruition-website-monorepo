/**
 * Pure helpers for the solution finder (vcSolutionFinder). Kept apart from the
 * component so the grouping and bot copy are unit-tested.
 */
import type { VcFinderBuild } from "../types"

export const ALL = "__all__"
export const GENERAL = "Other / general"

/** Industries present in the builds, with counts, alphabetical, "Other / general" last. */
export function industryCounts(builds: VcFinderBuild[], clean: (s: string) => string = (s) => s): [string, number][] {
  const counts = new Map<string, number>()
  for (const b of builds) {
    const ind = clean(b.industry ?? "").trim()
    if (!ind) continue
    counts.set(ind, (counts.get(ind) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) =>
    a[0] === GENERAL ? 1 : b[0] === GENERAL ? -1 : a[0].localeCompare(b[0]),
  )
}

/** Builds for one industry, or all of them for ALL. */
export function buildsFor(builds: VcFinderBuild[], industry: string | null, clean: (s: string) => string = (s) => s): VcFinderBuild[] {
  if (!industry) return []
  if (industry === ALL) return builds
  return builds.filter((b) => clean(b.industry ?? "").trim() === industry)
}

/** The bot's line above the results, e.g. "Here are 5 HubSpot builds for Construction. Tap one to see the full build." */
export function resultsIntro(n: number, industry: string, platform: string): string {
  if (n === 0) return "Nothing catalogued there yet. Try another industry."
  const are = n === 1 ? "is" : "are"
  const builds = n === 1 ? "build" : "builds"
  const p = platform ? `${platform} ` : ""
  const tail = "Tap one to see the full build."
  if (industry === ALL) return `Here ${are} all ${n} ${p}${builds}. ${tail}`
  if (industry === GENERAL) return `Here ${are} ${n} ${p}${builds} that ${n === 1 ? "works" : "work"} across industries. ${tail}`
  return `Here ${are} ${n} ${p}${builds} for ${industry}. ${tail}`
}

/** "Sales Hub Professional, Service Hub" -> one badge per comma-separated part (brackets kept whole). */
export function splitHubs(hubs?: string): string[] {
  if (!hubs) return []
  const out: string[] = []
  let depth = 0
  let cur = ""
  for (const ch of hubs) {
    if (ch === "(") depth++
    if (ch === ")") depth = Math.max(0, depth - 1)
    if (ch === "," && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue }
    cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

/** "Pipeline foundation: stages, intake" -> { title: "Pipeline foundation", line: "stages, intake" }. */
export function splitPhase(p: string): { title: string; line: string } {
  const i = p.indexOf(": ")
  if (i < 0) return { title: p, line: "" }
  const line = p.slice(i + 2)
  return { title: p.slice(0, i), line: line.charAt(0).toUpperCase() + line.slice(1) }
}
