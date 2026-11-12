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
]

export const PAGE_SPECIFIC_KEY_PREFIX = 'pagespecific-'
