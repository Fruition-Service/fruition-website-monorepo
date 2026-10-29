/**
 * Services dropdown (Edward, 28 Oct 2026 website call): the menu gains a
 * Services tab ahead of Partners, listing the service pages that already
 * exist. No new pages and no URL changes: every href below resolves to a page
 * in `src/app`, and `nav-v3.test.ts` fails if one ever stops doing so.
 *
 * Copy follows the nav-v3 rules: plain labels, no per-item descriptions, no
 * partner-tier pills here (the platform tiers stay on the Partners tab).
 *
 * Consumed by:
 *  - src/data/nav-v3.ts   → first item of NAV_V3 (seed script + local preview)
 *  - src/components/Navbar.tsx → merged ahead of the Sanity navigation, so the
 *    tab also appears when the CMS document predates this change
 */

export interface ServicesNavLink {
  label: string
  href: string
  icon?: string
}

export interface ServicesNavSection {
  heading: string
  /** Item columns inside the section; also its share of the dropdown width. */
  columns?: number
  items: ServicesNavLink[]
}

export interface ServicesNavItem {
  label: string
  layout?: 'stacked' | 'columns'
  sections?: ServicesNavSection[]
  footerNote?: string
  footerLinks?: { label: string; href: string }[]
}

export const SERVICES_NAV: ServicesNavItem = {
  label: 'Services',
  layout: 'columns',
  sections: [
    {
      heading: 'AI consulting',
      columns: 2,
      items: [
        { label: 'AI capability assessment', href: '/ai-capability-assessment', icon: 'sparkle' },
        { label: 'AI consulting', href: '/ai-consulting', icon: 'bulb' },
        { label: 'Agent development', href: '/ai-consulting/agent-development', icon: 'zap' },
        { label: 'RAG & knowledge systems', href: '/ai-consulting/rag-knowledge-systems', icon: 'layers' },
        {
          label: 'Governance & compliance',
          href: '/ai-consulting/governance-and-compliance',
          icon: 'shield',
        },
        { label: 'AI readiness blueprint', href: '/ai-readiness-blueprint', icon: 'document' },
      ],
    },
    {
      heading: 'Work platforms',
      items: [
        { label: 'monday CRM consulting', href: '/monday-crm-consulting', icon: 'chart' },
        {
          label: 'Implementation consultants',
          href: '/monday-implementation-consultants',
          icon: 'wrench',
        },
        { label: 'monday training', href: '/training', icon: 'graduation' },
        { label: 'Atlassian consulting', href: '/atlassian-consulting', icon: 'atlassian' },
        { label: 'HubSpot consulting', href: '/hubspot-consulting', icon: 'hubspot' },
      ],
    },
    {
      heading: 'Commercial',
      items: [
        { label: 'Implementation packages', href: '/implementation-packages', icon: 'package' },
        { label: 'Licence procurement', href: '/licence-procurement', icon: 'dollar' },
        { label: 'Integrations', href: '/integrations', icon: 'link' },
      ],
    },
  ],
  footerNote: 'Platform-agnostic delivery across AI, monday.com, Atlassian and HubSpot.',
  footerLinks: [
    { label: 'AI consulting →', href: '/ai-consulting' },
    { label: 'Pricing →', href: '/implementation-packages' },
  ],
}

/** Every href the Services dropdown links to. */
export function servicesNavHrefs(): string[] {
  return [
    ...new Set([
      ...(SERVICES_NAV.sections ?? []).flatMap((s) => s.items.map((l) => l.href)),
      ...(SERVICES_NAV.footerLinks ?? []).map((l) => l.href),
    ]),
  ]
}

/**
 * The nav the header renders: the Services tab ahead of the Sanity-managed
 * items, unless the CMS already ships one (then the CMS wins, so Studio edits
 * are never shadowed).
 */
export function withServicesNav<T extends { label?: string }>(items: T[]): T[] {
  const hasServices = items.some((item) => (item.label ?? '').trim().toLowerCase() === 'services')
  if (hasServices) return items
  // SERVICES_NAV matches every consumer's nav-item shape structurally (see
  // NavV3Item and Navbar's NavItem); the cast keeps both call sites cast-free.
  return [SERVICES_NAV as unknown as T, ...items]
}
