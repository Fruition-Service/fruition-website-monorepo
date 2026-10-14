import type { CaseStudy } from "@/components/sections/types"

const slideKey = (t: CaseStudy) =>
  `${(t.clientName || "").trim().toLowerCase()}|${(t.quote || "").trim().slice(0, 80).toLowerCase()}`

/**
 * The same quote exists as several caseStudy docs (the per-page migration
 * copied them), and only some copies carry the profile photo. Keep one slide
 * per quote, the copy with a photo when there is one, and start on the page's
 * featured testimonial rather than whichever doc Sanity returned first.
 */
export function orderSlides(list: CaseStudy[], featured?: CaseStudy): CaseStudy[] {
  const byKey = new Map<string, CaseStudy>()
  for (const t of list) {
    const key = slideKey(t)
    const seen = byKey.get(key)
    if (!seen || (!seen.profilePhoto?.asset?._ref && t.profilePhoto?.asset?._ref)) byKey.set(key, t)
  }
  const unique = [...byKey.values()]
  if (!featured?.quote) return unique
  const i = unique.findIndex((t) => slideKey(t) === slideKey(featured))
  return i > 0 ? [unique[i], ...unique.slice(0, i), ...unique.slice(i + 1)] : unique
}
