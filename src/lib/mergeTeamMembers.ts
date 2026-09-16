import type { TeamMember } from "@/components/TeamGridSection"

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

/**
 * People who belong on exactly ONE region page, even though their Sanity
 * `regions` legitimately cover more.
 *
 * Josh's teamMember doc carries every region (APAC, UK, US, IN, SG, PH)
 * because he leads delivery globally and belongs on /fruition-team — but the
 * /monday-partner-* pages are meant to introduce the local team, so he shows
 * on Australia only. Region codes can't express that on their own: Australia,
 * Singapore and the Philippines all read the same "APAC" code, so narrowing
 * his regions in Studio would take him off Australia too.
 *
 * This rule lives here and is applied inside `RegionPageTemplate` — the one
 * component all six region pages render through. An earlier version of it was
 * written into three individual page.tsx files (#160) and was silently lost
 * when those pages were rebuilt (#215), putting Josh back on all six. Keeping
 * it on the shared path is what stops that recurring, and
 * `mergeTeamMembers.test.ts` fails the CI test job if the rule goes missing.
 *
 * Map: team member name -> the single region page slug they may appear on.
 */
export const REGION_PAGE_ONLY: Record<string, string> = {
  "Josh Jebathilak": "monday-partner-australia",
}

const REGION_PAGE_ONLY_BY_NORM_NAME = new Map(
  Object.entries(REGION_PAGE_ONLY).map(([name, slug]) => [normName(name), slug]),
)

/**
 * Drop anyone restricted to a region page other than the one rendering.
 *
 * `pageSlug` is the region page's own slug, e.g. "monday-partner-singapore".
 * Members with no restriction pass through untouched.
 */
export function filterTeamForRegionPage(
  members: TeamMember[],
  pageSlug: string,
): TeamMember[] {
  return members.filter((m) => {
    const onlyOn = REGION_PAGE_ONLY_BY_NORM_NAME.get(normName(m.name))
    return onlyOn === undefined || onlyOn === pageSlug
  })
}
