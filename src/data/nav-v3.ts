/**
 * Navigation v3 (Josh, 21 Oct 2026): five product-agnostic tabs.
 * Partners · Industries · Customers · Blog · Contact, plus the phone and the
 * "Book a time" button. About 60 dropdown links come down to 23; everything
 * else moves to the footer (src/data/footer-v3.ts). No URL changes.
 *
 * Source: fruition-navigation-prototype.html + README-for-edward.txt, shared
 * in the Josh / Edward / Vadim Slack DM. Copy is the prototype's, verbatim,
 * with three deliberate departures:
 *  - Lovable and Base44 (the "App builders" column) are left out until Josh
 *    confirms partner status and the two pages exist.
 *  - The Ron Amaram quote is the testimonial as stored in Sanity, word for word.
 *  - "Implementation calculator" points at /ask-fruit, its real route.
 * The one-line item descriptions were dropped on 26 Oct 2026 (Edward: they
 * added nothing, and Josh had asked for the descriptions to go on 16 Oct).
 *
 * Every href resolves to a page that exists. Consumed by:
 *  - scripts/seed-nav-v3.ts   → writes siteSettings.navigation (and the footer)
 *  - src/app/layout.tsx       → local preview when NAV_V3_PREVIEW=1
 */

export interface NavV3Link {
  label: string
  href: string
  description?: string
  icon?: string
  /** Short partner-tier pill after the label, e.g. "Platinum". */
  tier?: string
}

export interface NavV3Section {
  heading: string
  /** Item columns inside the section; also its share of the dropdown width. */
  columns?: number
  items: NavV3Link[]
}

export interface NavV3Feature {
  kicker: string
  quote: string
  attribution: string
  label: string
  href: string
}

export interface NavV3Item {
  label: string
  href?: string
  layout?: 'stacked' | 'columns'
  sections?: NavV3Section[]
  /** Line on the left of the dropdown's bottom bar. */
  footerNote?: string
  /** Links on the right of the dropdown's bottom bar. */
  footerLinks?: { label: string; href: string }[]
  /** Quote card shown as the dropdown's last column. */
  feature?: NavV3Feature
}

export const NAV_V3: NavV3Item[] = [
  {
    label: 'Partners',
    layout: 'columns',
    sections: [
      {
        heading: 'AI platforms',
        items: [
          {
            label: 'OpenAI',
            href: '/partnerships/openai-chatgpt-partner',
            tier: 'Select',
            icon: 'openai',
          },
          {
            label: 'Anthropic Claude',
            href: '/partnerships/anthropic-claude-partner',
            icon: 'anthropic',
          },
          {
            label: 'AI consulting',
            href: '/ai-consulting',
            icon: 'bulb',
          },
        ],
      },
      {
        heading: 'Work platforms',
        items: [
          {
            label: 'monday.com',
            href: '/partnerships/monday-consulting-partner',
            tier: 'Platinum',
            icon: 'monday',
          },
          {
            label: 'Atlassian',
            href: '/partnerships/certified-atlassian-partner',
            tier: 'Platinum',
            icon: 'atlassian',
          },
          {
            label: 'Implementation packages',
            href: '/implementation-packages',
            icon: 'package',
          },
        ],
      },
      {
        heading: 'Automation',
        items: [
          {
            label: 'n8n',
            href: '/partnerships/n8n-integration-partner',
            icon: 'n8n',
          },
          {
            label: 'Make',
            href: '/partnerships/make-partners',
            icon: 'make',
          },
        ],
      },
    ],
    footerNote: 'Platform-agnostic: we recommend the stack that fits your process, not the other way round.',
    footerLinks: [
      { label: 'All partners & integrations →', href: '/partnerships' },
      { label: 'Licence procurement →', href: '/pricing' },
    ],
  },
  {
    label: 'Industries',
    layout: 'columns',
    sections: [
      {
        heading: 'Industries we specialise in',
        columns: 2,
        items: [
          {
            label: 'Construction',
            href: '/monday-for-construction',
            icon: 'building',
          },
          {
            label: 'Manufacturing',
            href: '/monday-for-manufacturing',
            icon: 'factory',
          },
          {
            label: 'Government',
            href: '/monday-for-government',
            icon: 'flag',
          },
          {
            label: 'Professional services',
            href: '/monday-for-professional-services',
            icon: 'briefcase',
          },
          {
            label: 'Real estate',
            href: '/monday-for-real-estate',
            icon: 'home',
          },
          {
            label: 'Financial services',
            href: '/industries/financial-services',
            icon: 'dollar',
          },
        ],
      },
      {
        heading: 'Use case hub',
        items: [
          {
            label: 'AI use case hub',
            href: '/ai-use-cases',
            icon: 'list',
          },
          {
            label: 'Project & portfolio management',
            href: '/monday-consulting-solutions/monday-project-management',
            icon: 'layers',
          },
        ],
      },
    ],
    footerNote: 'Also: retail, healthcare, solar & renewables.',
    footerLinks: [
      { label: 'All industries →', href: '/industries' },
      { label: 'Browse use cases →', href: '/ai-use-cases' },
    ],
  },
  {
    label: 'Customers',
    layout: 'columns',
    sections: [
      {
        heading: 'Proof',
        items: [
          {
            label: 'Customer stories',
            href: '/customer-testimonials',
            icon: 'users',
          },
          {
            label: 'Case studies',
            href: '/customer-testimonials#case-studies',
            icon: 'chart',
          },
        ],
      },
      {
        heading: 'Why Fruition',
        items: [
          {
            label: 'Certifications & awards',
            href: '/certifications-and-awards',
            icon: 'shield',
          },
          {
            label: 'Our team',
            href: '/fruition-team',
            icon: 'user',
          },
        ],
      },
    ],
    feature: {
      kicker: 'Customer story',
      quote:
        "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects.",
      attribution: 'Ron Amaram · General Manager, Risk 2 Solutions',
      label: 'Read customer stories →',
      href: '/customer-testimonials',
    },
  },
  { label: 'Blog', href: '/consulting-blog' },
  { label: 'Contact', href: '/contact-us' },
]

/** Every href the menu links to, for the seed script's live-URL check. */
export function navV3Hrefs(): string[] {
  return [
    ...new Set(
      NAV_V3.flatMap((item) => [
        ...(item.href ? [item.href] : []),
        ...(item.sections ?? []).flatMap((s) => s.items.map((l) => l.href)),
        ...(item.footerLinks ?? []).map((l) => l.href),
        ...(item.feature ? [item.feature.href] : []),
      ]),
    ),
  ]
}
