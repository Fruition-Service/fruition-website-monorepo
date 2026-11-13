import type { PracticeFaq, PracticePage } from './types'

/**
 * /atlassian-consulting: one page for the whole Atlassian practice.
 *
 * The hub copy was ported from the v2.1 mockups (surname corrected to
 * Jebathilak). In November 2026 (monday 2899845035) the four leaf pages it
 * linked to were folded into it: their copy lives on as the deep dives in
 * ./atlassianDeepDives.ts, their routes 301 here (next.config.ts), and the 34
 * questions across the five pages collapsed into the 15 below.
 */

const HUB = { label: 'Atlassian Consulting', href: '/atlassian-consulting' }

/**
 * The consolidated FAQ, in render order: Jira, Confluence, JSM, migration,
 * engagement model, pricing, regions. The live list comes from the central
 * `faqItem` documents tagged `atlassian-consulting` (same words, same order);
 * this is the fallback when Sanity has none.
 */
export const ATLASSIAN_FAQS: PracticeFaq[] = [
  {
    q: 'What does an Atlassian consultant do?',
    a: 'An Atlassian consultant implements, optimises, and integrates Jira, Confluence, and Jira Service Management, covering workflow design, permission architecture, plugin strategy, and cross-tool integration. Fruition delivers these services across Australia, the UK, and the US.',
  },
  {
    q: 'Can Fruition help with a messy Jira instance?',
    a: 'Yes: Jira rescue engagements are a core service: workflow consolidation, permission scheme cleanup, plugin audit, and board restructure. Most instances accumulate years of configuration debt that a structured 3–4 week cleanup resolves.',
  },
  {
    q: 'Should we use Jira or monday.com?',
    a: 'Jira wins for deep software delivery with heavy ecosystem needs; monday.com wins for cross-functional visibility and business-team adoption. Many organisations run both, integrated. Fruition partners with both vendors and advises per team; the Jira to monday migration section covers when switching makes sense.',
  },
  {
    q: 'Our Jira is a mess, rebuild or restructure?',
    a: 'Usually restructure. A configuration audit (week one of any rescue) determines whether consolidation is viable; full rebuilds are reserved for instances where migration cost is lower than cleanup cost, rarer than frustrated admins expect.',
  },
  {
    q: 'Why does our Confluence become unusable over time?',
    a: 'Unmanaged growth: no space strategy, no ownership, no archival rules. Content accretes until search returns five conflicting versions of everything. A governance retrofit (taxonomy, ownership, lifecycle), reverses it in 4–6 weeks.',
  },
  {
    q: 'Jira Service Management vs monday Service, which should we choose?',
    a: 'JSM wins for IT teams deep in the Atlassian ecosystem with dev-connected incident workflows; monday Service wins for business-wide service teams already on monday.com. Fruition implements both and advises per situation, a genuine rarity among partners.',
  },
  {
    q: 'Why do teams migrate from Jira to monday.com?',
    a: 'The recurring drivers: cross-functional visibility (business teams can’t or won’t use Jira), admin overhead, licence cost at scale, and configuration debt. Teams keeping deep dev-tool dependencies sometimes keep Jira for engineering and integrate: Fruition advises which pattern fits before any migration starts.',
  },
  {
    q: 'Can Jira history and attachments migrate to monday.com?',
    a: 'Yes: issues, comments, attachments, and status history migrate through Fruition’s staged process. Some Jira-specific constructs (complex workflow conditions, certain plugin data) are rebuilt rather than copied; the audit phase documents exactly what maps where.',
  },
  {
    q: 'How long does a Jira to monday migration take?',
    a: 'Typically 6–8 weeks for a multi-team migration: two weeks audit and mapping, two weeks structure build, two weeks staged migration and validation, and one to two weeks training and cutover. Single-team moves run faster.',
  },
  {
    q: 'What did the Givergy migration achieve?',
    a: 'Givergy moved from Jira and BitBucket silos to monday Dev with GitHub integration: automated branch tracking, unified multi-repository visibility, and role-based dashboards giving developers, QA, and management customised views of one source of truth.',
  },
  {
    q: 'How long does a typical Atlassian engagement take?',
    a: 'Most Atlassian engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
  },
  {
    q: 'Why choose Fruition over a Big-4 consulting firm?',
    a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 900+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms, so recommendations are cross-platform and honest.',
  },
  {
    q: 'How much does Atlassian consulting cost with Fruition?',
    a: 'Engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase: Confluence from AUD $10,000, Jira and Jira Service Management from AUD $12,000, Jira to monday migration from AUD $15,000. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
  },
  {
    q: 'Which regions does Fruition deliver Atlassian services in?',
    a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
  },
  {
    q: 'Can Fruition deliver this remotely?',
    a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
  },
]

export const ATLASSIAN_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/atlassian-consulting',
    seoTitle: 'Atlassian Consulting Partner | Fruition: Jira, Confluence & JSM, AU · UK · US',
    seoDescription:
      'Fruition delivers Atlassian consulting across Australia, the UK, and the US: Jira, Confluence, and JSM implementation and optimisation, plus honest advice on when Atlassian is and isn’t your answer.',
    breadcrumb: [HUB],
    heading: 'Atlassian expertise from a firm that sees both sides',
    lead: 'Fruition delivers Atlassian consulting across Australia, the UK, and the US: Jira, Confluence, and JSM implementation and optimisation, plus honest advice on when Atlassian is and isn’t your answer.',
    targetQueries: [
      'Atlassian consultant Sydney',
      'Jira consultant',
      'Jira partner UK',
      'Confluence implementation',
      'Jira Service Management consulting',
    ],
    approachHeading: 'Cross-platform honesty as a feature.',
    approach: [
      {
        title: 'Optimise what you have',
        body: 'Most Jira pain is configuration debt, not platform failure. We untangle workflow sprawl, permission chaos, and plugin bloat before recommending anything drastic.',
      },
      {
        title: 'Integrate, don’t isolate',
        body: 'Jira connected to monday.com, Slack, and your delivery stack, because dev tools that don’t talk to business tools create the visibility gap leadership complains about.',
      },
      {
        title: 'Migrate when it’s right',
        body: 'As both an Atlassian and monday.com Platinum partner, we’re the rare firm that migrates in either direction and tells you honestly which fits.',
      },
    ],
    servicesHeading: 'The Atlassian service line.',
    services: [
      {
        title: 'Jira implementation & optimisation',
        body: 'Project configuration, workflow design, permission schemes, and the cleanup engagements that rescue sprawling instances.',
      },
      {
        title: 'Confluence knowledge systems',
        body: 'Space architecture, template systems, and governance that make Confluence a knowledge base instead of a document graveyard.',
      },
      {
        title: 'Jira Service Management',
        body: 'ITSM builds: service desks, SLAs, asset management, and customer portals.',
      },
      {
        title: 'Jira → monday migration',
        body: 'Structured cross-platform migration when teams need business-wide visibility Jira can’t give them.',
      },
    ],
    childrenEyebrow: 'Atlassian pages',
    childrenHeading: 'Go deeper.',
    children: [
      {
        label: 'Atlassian Certified Partner',
        description: 'Certification status and what it means for delivery',
        href: '/atlassian-consulting#partner',
      },
      {
        label: 'Implementation packages',
        description: 'Fixed price Atlassian packages',
        href: '/implementation-packages',
      },
    ],
    faqs: ATLASSIAN_FAQS,
  },
}
