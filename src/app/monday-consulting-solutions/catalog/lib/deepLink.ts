import type { Solution } from "../data/solutions"

/** Query parameter that opens one solution's details: `?solution=dream-crm`. */
export const SOLUTION_PARAM = "solution"

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

/**
 * The solution a `?solution=` value points at. Matches the key first, then
 * the title, because Ask Fruit conversations saved before the deep link
 * existed only know a solution by the name it was cited under.
 */
export function findSolution(solutions: Solution[], value: string | null): Solution | null {
  if (!value) return null
  const byKey = solutions.find((s) => s.key === value)
  if (byKey) return byKey
  const wanted = normalise(value)
  return wanted ? (solutions.find((s) => normalise(s.title) === wanted) ?? null) : null
}

/** Catalog URL that opens `key`'s details. */
export function solutionHref(key: string): string {
  return `/monday-consulting-solutions/catalog?${SOLUTION_PARAM}=${encodeURIComponent(key)}`
}
