/**
 * Registry of page-specific Version C sections.
 *
 * Pages in one group (partner, industry, msol, ...) share a section template: the same section
 * types in the same order, so a template change can be applied to the whole group. A section
 * listed here is the exception. It lives on one page only and must survive any re-templating of
 * that page's group.
 *
 * The same fact is recorded in three places, so it cannot be missed:
 *   1. here (code, reviewed in PRs, checked by vcPageSpecificSections.test.ts);
 *   2. on the section in Sanity: `pageSpecific: true` and a `pageSpecificNote`;
 *   3. in the section's `_key`, which always starts with "pagespecific-".
 *
 * `npx tsx scripts/vc/check-page-specific.ts` compares this list with the live dataset and exits 1
 * on any difference. Rules and history: docs/version-c.md, "Page-specific sections".
 */

export interface VcPageSpecificSection {
  /** vcPage `path`, e.g. "/hubspot-consulting". */
  path: string
  /** Sanity array `_key` of the section; always starts with "pagespecific-". */
  key: string
  /** Section `_type`. */
  type: string
  /** The section heading as published, for humans scanning this file. */
  heading: string
  /** Why it exists and where its copy came from. */
  reason: string
  /** ISO date it was added. */
  added: string
  /** The script or PR that added it. */
  source: string
}

const OGLABS_PORT = 'scripts/sanity-migrate/port-oglabs-hubspot-clickup.ts'
const OGLABS_REASON = (page: string) =>
  `Ported from oglabs.io/services/${page} (OG Labs, Nov 2026). Covers ground the partner template has no slot for.`

const ATLASSIAN_SCRIPT = 'scripts/vc/atlassian-deep-dives.ts'
const ATLASSIAN_REASON =
  'Service deep dive carrying the copy of a leaf page merged into the hub in PR #415, dropped by the Version C rollout (#435) and restored at Vadim\'s (SEO) request. The old leaf URL 301s to this anchor.'

export const VC_PAGE_SPECIFIC_SECTIONS: VcPageSpecificSection[] = [
  {
    path: '/hubspot-consulting',
    key: 'pagespecific-hubspot-migration',
    type: 'vcCards',
    heading: 'Move to HubSpot *without losing your history.*',
    reason: OGLABS_REASON('hubspot'),
    added: '2026-11-12',
    source: OGLABS_PORT,
  },
  {
    path: '/hubspot-consulting',
    key: 'pagespecific-hubspot-portal-rescue',
    type: 'vcCards',
    heading: 'Already on HubSpot and *it feels messy?*',
    reason: OGLABS_REASON('hubspot'),
    added: '2026-11-12',
    source: OGLABS_PORT,
  },
  {
    path: '/hubspot-consulting',
    key: 'pagespecific-hubspot-revops-integrations',
    type: 'vcCards',
    heading: 'HubSpot connected to *the rest of your stack.*',
    reason: OGLABS_REASON('hubspot') + ' Integration cards also draw on /services/advanced-integrations.',
    added: '2026-11-12',
    source: OGLABS_PORT,
  },
  {
    path: '/hubspot-consulting',
    key: 'pagespecific-hubspot-process',
    type: 'vcSteps',
    heading: 'How a HubSpot build *runs.*',
    reason: OGLABS_REASON('hubspot'),
    added: '2026-11-12',
    source: OGLABS_PORT,
  },
  {
    path: '/hubspot-consulting',
    key: 'pagespecific-hubspot-solution-finder',
    type: 'vcSolutionFinder',
    heading: 'Find the HubSpot build *for your industry.*',
    reason:
      'Chat-style solution finder under the hero: the oglabs.io home page finder, HubSpot builds only (26, verbatim). Edward asked for it on 13 Nov 2026. The partner template has no such section.',
    added: '2026-11-13',
    source: 'scripts/vc/hubspot-solution-finder.ts',
  },
  {
    path: '/partnerships/certified-clickup-partner',
    key: 'pagespecific-clickup-beyond-setup',
    type: 'vcCards',
    heading: 'Keep ClickUp *earning its place.*',
    reason: OGLABS_REASON('clickup'),
    added: '2026-11-12',
    source: OGLABS_PORT,
  },
  {
    path: '/partnerships/certified-clickup-partner',
    key: 'pagespecific-clickup-hubspot',
    type: 'vcCards',
    heading: 'Sales in HubSpot. *Delivery in ClickUp.*',
    reason: OGLABS_REASON('clickup') + ' Also drawn from /services/advanced-integrations (HubSpot to ClickUp).',
    added: '2026-11-12',
    source: OGLABS_PORT,
  },
  {
    path: '/atlassian-consulting',
    key: 'pagespecific-atlassian-jira',
    type: 'vcDeepDive',
    heading: 'Jira that developers tolerate *and leaders can read*',
    reason: ATLASSIAN_REASON,
    added: '2026-11-12',
    source: ATLASSIAN_SCRIPT,
  },
  {
    path: '/atlassian-consulting',
    key: 'pagespecific-atlassian-confluence',
    type: 'vcDeepDive',
    heading: 'Confluence as a knowledge base, *not a document graveyard*',
    reason: ATLASSIAN_REASON,
    added: '2026-11-12',
    source: ATLASSIAN_SCRIPT,
  },
  {
    path: '/atlassian-consulting',
    key: 'pagespecific-atlassian-jsm',
    type: 'vcDeepDive',
    heading: 'ITSM that resolves tickets *instead of routing them in circles*',
    reason: ATLASSIAN_REASON,
    added: '2026-11-12',
    source: ATLASSIAN_SCRIPT,
  },
  {
    path: '/atlassian-consulting',
    key: 'pagespecific-atlassian-migration',
    type: 'vcDeepDive',
    heading: 'Leave Jira *without leaving your history behind*',
    reason: ATLASSIAN_REASON,
    added: '2026-11-12',
    source: ATLASSIAN_SCRIPT,
  },
]

export const PAGE_SPECIFIC_KEY_PREFIX = 'pagespecific-'
