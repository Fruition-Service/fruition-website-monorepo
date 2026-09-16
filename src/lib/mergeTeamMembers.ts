import type { TeamMember } from "@/components/TeamGridSection"
import type { RegionSlug } from "@/components/region/types"

function normName(s?: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
}

/**
 * TEMPORARY code-level hide, on top of the Sanity exclude list below.
 *
 * These names are filtered out of every public team grid regardless of
 * what siteSettings says. Kept in code (rather than Studio) so the hide
 * can be reverted by deleting this array in a single commit — remove the
 * entry once the person should show on the site again.
 */
const TEMPORARILY_HIDDEN_NAMES = ["Edward Zehua Zhang"]

/**
 * Filter Sanity team members against the optional site-level exclude
 * list (former teammates whose docs still exist in Sanity but should
 * not render publicly). The exclude list comes from siteSettings —
 * see `excludedTeamMemberNames` — so editors control it via Studio.
 */
export function mergeTeamMembers(
  sanityMembers: TeamMember[],
  excludedNames: string[] = [],
): TeamMember[] {
  const excluded = new Set(
    [...excludedNames, ...TEMPORARILY_HIDDEN_NAMES].map(normName),
  )
  return sanityMembers.filter((m) => !excluded.has(normName(m.name)))
}

/* ------------------------------------------------------------------ */
/*  Region-page visibility                                             */
/* ------------------------------------------------------------------ */

/**
 * Which region pages a person may appear on.
 *
 * This is a PROPERTY of the team member, not a per-page exception. It is read
 * from their Sanity `regionPagesOnly` field, with the code-level map below as a
 * backstop that Studio cannot override.
 *
 * It exists because `regions` cannot express it. Australia, Singapore and the
 * Philippines all read the same "APAC" code, so narrowing someone's regions to
 * keep them off Singapore takes them off Australia too.
 *
 * Semantics:
 *   undefined / empty  -> no restriction; the `regions` codes decide, as before
 *   ["slug", ...]      -> this person appears on those region pages and nowhere
 *                         else, whatever their `regions` say
 *
 * Josh is the standing case: his doc carries every region (APAC, UK, US, IN,
 * SG, PH) because he leads delivery globally and belongs on /fruition-team,
 * but the /monday-partner-* pages introduce the local team, so he is Australia
 * only.
 *
 * The history is why this is hardcoded as well as stored. #160 excluded him by
 * name inside three individual page.tsx files; #215 rebuilt those pages and the
 * rule vanished silently, putting him back on all six. #222 moved it onto the
 * shared render path. This keeps a copy in code so that clearing the Sanity
 * field, reseeding the doc from monday, or restoring a backup cannot put him
 * back either.
 */
export const REGION_PAGES_ONLY: Record<string, RegionSlug[]> = {
  "Josh Jebathilak": ["monday-partner-australia"],
}

const REGION_PAGES_ONLY_BY_NORM_NAME = new Map(
  Object.entries(REGION_PAGES_ONLY).map(([name, slugs]) => [normName(name), slugs]),
)

/**
 * The region pages this member is allowed on, or `null` when unrestricted.
 *
 * The code map wins over the Sanity field: a restriction here cannot be
 * loosened or widened from Studio, only added to by editors for other people.
 */
export function allowedRegionPages(member: TeamMember): readonly string[] | null {
  const hardcoded = REGION_PAGES_ONLY_BY_NORM_NAME.get(normName(member.name))
  if (hardcoded) return hardcoded
  const fromSanity = member.regionPagesOnly
  if (Array.isArray(fromSanity) && fromSanity.length > 0) return fromSanity
  return null
}

/**
 * Drop anyone restricted to a region page other than the one rendering.
 *
 * FAILS CLOSED. `pageSlug` is the region page's own slug, e.g.
 * "monday-partner-singapore"; pass `undefined` and every restricted member is
 * dropped. That direction is deliberate — a grid wired up without a slug hides
 * a restricted person rather than exposing them, so the accident that keeps
 * happening (a page rebuild losing the wiring) can only ever under-show.
 *
 * Members with no restriction pass through untouched.
 */
export function filterTeamForRegionPage(
  members: TeamMember[],
  pageSlug: string | undefined,
): TeamMember[] {
  return members.filter((m) => {
    const allowed = allowedRegionPages(m)
    if (allowed === null) return true
    return pageSlug !== undefined && allowed.includes(pageSlug)
  })
}
