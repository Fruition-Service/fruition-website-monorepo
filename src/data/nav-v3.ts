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
 * 28 Oct 2026 (Edward): HubSpot added under Atlassian, Implementation packages
 * moved under Make, and the Partners "Pricing →" link points at
 * /implementation-packages (the pricing page; /pricing redirects there).
 *
 * 28 Oct 2026 website call: a Services tab (dropdown) goes ahead of Partners.
 * It lives in src/data/nav-services.ts, so the header can merge it ahead of a
 * Sanity navigation document that predates the change.
 *
 * Every href resolves to a page that exists. Consumed by:
 *  - scripts/seed-nav-v3.ts   → writes siteSettings.navigation (and the footer)
 *  - src/app/layout.tsx       → local preview when NAV_V3_PREVIEW=1
 */

import { SERVICES_NAV } from './nav-services'

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
  SERVICES_NAV,
  {
    label: 'Partnerships',
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
            description: 'ChatGPT Enterprise & custom GPTs',
          },
          {
            label: 'Anthropic Claude',
            href: '/partnerships/anthropic-claude-partner',
            icon: 'anthropic',
            description: 'Enterprise Claude & Claude Code',
          },
          {
            label: 'AI consulting',
            href: '/ai-consulting',
            icon: 'bulb',
            description: 'The full AI consulting practice',
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
            description: 'Platinum Partner · Rising Star 2026 · Advanced Delivery Partner',
          },
          {
            label: 'Atlassian',
            href: '/partnerships/certified-atlassian-partner',
            tier: 'Platinum',
            icon: 'atlassian',
            description: 'Platinum Partner · Rising Star 2026',
          },
          {
            label: 'HubSpot',
            href: '/partnerships/certified-hubspot-partner',
            icon: 'hubspot',
            description: 'Certified HubSpot partner',
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
            description: 'Certified n8n partner',
          },
          {
            label: 'Make',
            href: '/partnerships/make-partners',
            icon: 'make',
            description: 'Certified Make partner',
          },
          {
            label: 'Implementation packages',
            href: '/implementation-packages',
            icon: 'package',
            description: 'Fixed-fee packages: 900+ delivered',
          },
        ],
      },
    ],
    footerNote: 'Platform-agnostic: we recommend the stack that fits your process, not the other way round.',
    footerLinks: [
      { label: 'All partners & integrations →', href: '/partnerships' },
      { label: 'Pricing →', href: '/implementation-packages' },
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
            description: 'Project & site delivery',
          },
          {
            label: 'Manufacturing',
            href: '/monday-for-manufacturing',
            icon: 'factory',
            description: 'Production planning & ops',
          },
          {
            label: 'Government',
            href: '/monday-for-government',
            icon: 'flag',
            description: 'Secure public-sector delivery',
          },
          {
            label: 'Professional services',
            href: '/monday-for-professional-services',
            icon: 'briefcase',
            description: 'Client delivery & resourcing',
          },
          {
            label: 'Real estate',
            href: '/monday-for-real-estate',
            icon: 'home',
            description: 'Listings, deals & property ops',
          },
          {
            label: 'Financial services',
            href: '/industries/financial-services',
            icon: 'dollar',
            description: 'APRA/FCA-aligned platforms & AI',
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
            description: 'Browse every prebuilt solution',
          },
          {
            label: 'Project & portfolio management',
            href: '/monday-consulting-solutions/monday-project-management',
            icon: 'layers',
            description: 'Delivery, portfolios & PMO',
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
    // Customers and Blog folded into one Resources menu (28 Oct 2026 website
    // call); layout from Claude Design "Nav Resources.dc.html".
    label: 'Resources',
    layout: 'columns',
    sections: [
      {
        heading: 'Learn',
        items: [
          { label: 'Blog', href: '/consulting-blog', icon: 'document', description: '100+ articles on monday.com, AI & automation' },
          { label: 'AI Use Case Hub', href: '/ai-use-cases', icon: 'sparkle', description: '279 real AI and monday.com builds across 12 industries' },
          { label: 'FAQs', href: '/faqs', icon: 'question', description: 'Direct answers to common questions' },
        ],
      },
      {
        heading: 'Proof',
        items: [
          { label: 'Customer stories', href: '/customer-testimonials', icon: 'users', description: 'Client results in their own words' },
          { label: 'Case studies', href: '/customer-testimonials#case-studies', icon: 'chart', description: '8 verified client implementations, filterable' },
        ],
      },
      {
        heading: 'Why Fruition',
        items: [
          { label: 'Certifications & awards', href: '/certifications-and-awards', icon: 'shield', description: 'Platinum x2, Rising Star 2026 & partner tiers' },
          { label: 'Our team', href: '/fruition-team', icon: 'user', description: 'The consultants behind Fruition' },
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
    footerNote: 'Articles, use cases and client proof in one place.',
    footerLinks: [
      { label: 'All articles →', href: '/consulting-blog' },
      { label: 'AI use cases →', href: '/ai-use-cases' },
    ],
  },
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
