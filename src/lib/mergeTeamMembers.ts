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
const TEMPORARILY_HIDDEN_NAMES: string[] = []

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
  return sanityMembers.filter((m) => !excluded.has(normName(m.name)) && isPublishable(m))
}

/**
 * The monday onboarding webhook creates a `team-monday-*` doc the moment an
 * item is added to the people board, usually with only a name. Those half-filled
 * records ("New item", "(copy)" duplicates, people with no role or photo) used to
 * render as blank cards. A member shows once they have a role and a photo.
 */
function isPublishable(m: TeamMember): boolean {
  const name = m.name?.trim() ?? ""
  if (!name || /^new item$/i.test(name) || /\(copy\)/i.test(name)) return false
  const hasPhoto = Boolean(m.photo?.asset?._ref || m.photoUrl)
  return Boolean(m.role?.trim()) && hasPhoto
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
  // Josh, 3 Nov 2026: Chloe is Australia only. Her doc is tagged APAC + SG,
  // and the Singapore and Philippines pages both read APAC, so `regions`
  // alone put her on all three.
  "Chloe Jebathilak": ["monday-partner-australia"],
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

/* ------------------------------------------------------------------ */
/*  /fruition-team region tabs                                         */
/* ------------------------------------------------------------------ */

/**
 * Which /fruition-team tabs a person may appear in, overriding their Sanity
 * `regions`. Same idea as REGION_PAGES_ONLY, for the other surface.
 *
 * Why it is separate and hardcoded: REGION_PAGES_ONLY only ever guarded the
 * /monday-partner-* pages, so every past fix left the team page alone. Its tabs
 * read raw `regions`, and several writers keep widening those: the SG/PH
 * migration tagged Josh and Chloe SG (and Josh PH), Josh's doc carries every
 * code on purpose, and `scripts/sync-roster-to-sanity.mjs`, the portal edit
 * form and the monday re-seeds all rewrite the array. Nothing in Sanity can
 * widen what is listed here.
 *
 * Tab codes are the page's `teamRegions[].code` values (APAC is the Australia
 * tab).
 */
export const TEAM_TABS_ONLY: Record<string, string[]> = {
  "Josh Jebathilak": ["APAC"],
  "Chloe Jebathilak": ["APAC"],
  // An empty list hides the person from every tab. Josh, 3 Nov 2026.
  "Benjie Belotindos": [],
}

/**
 * Who leads each roster, in order, ahead of the role-based sort. Applies to the
 * /fruition-team tab with that code and to the region page whose team reads
 * that code. Someone listed here only moves up if they are already in the
 * roster; this never adds anyone.
 *
 * Josh, 3 Nov 2026: Suzzane next to Josh for Australia, Kevin then Bruna for
 * the UK, Zach then Valeria for the US.
 */
export const ROSTER_LEADS: Record<string, string[]> = {
  APAC: ["Josh Jebathilak", "Suzzane Castro"],
  UK: ["Kevin Zhao", "Bruna Alves"],
  US: ["Zach Weller", "Valeria Marin"],
}

/**
 * The ROSTER_LEADS list each region page uses. Keyed by page, not by the
 * page's `teamRegion`, because Singapore and the Philippines read APAC too and
 * should not take Australia's lead order.
 */
export const REGION_PAGE_LEADS: Partial<Record<RegionSlug, string>> = {
  "monday-partner-australia": "APAC",
  "monday-partner-uk": "UK",
  "monday-partner-us": "US",
}

const TEAM_TABS_ONLY_BY_NORM_NAME = new Map(
  Object.entries(TEAM_TABS_ONLY).map(([name, tabs]) => [normName(name), tabs]),
)

/** Members who belong in the /fruition-team tab `code`. */
export function filterTeamForTab<T extends Pick<TeamMember, "name" | "regions">>(
  members: T[],
  code: string,
): T[] {
  return members.filter((m) => {
    const pinned = TEAM_TABS_ONLY_BY_NORM_NAME.get(normName(m.name))
    if (pinned) return pinned.includes(code)
    return Array.isArray(m.regions) && m.regions.includes(code)
  })
}

/**
 * Sort comparator: the roster's leads first in their listed order, Edward last,
 * everyone else by `fallback` (role seniority, then name).
 */
export function rosterOrder<T extends Pick<TeamMember, "name" | "role">>(
  code: string | undefined,
  fallback: (a: T, b: T) => number,
): (a: T, b: T) => number {
  const leads = (code && ROSTER_LEADS[code]) || []
  const rank = (m: T) => {
    const i = leads.findIndex((n) => normName(n) === normName(m.name))
    if (i >= 0) return i - leads.length - 1
    return normName(m.name) === "edward zhang" ? 1 : 0
  }
  return (a, b) => rank(a) - rank(b) || fallback(a, b)
}
