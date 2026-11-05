import type { PracticeFaq, PracticePage } from './types'

/**
 * /hubspot-consulting: one page for the whole HubSpot practice.
 *
 * The hub copy was ported from the v2.1 mockups (surname corrected to
 * Jebathilak). In November 2026 (monday 2900266080) the four leaf pages it
 * linked to were folded into it: their copy lives on as the in-page sections
 * in ./hubspotDeepDives.ts, their routes 301 to those anchors (next.config.ts),
 * and the 37 questions across the five pages collapsed into the 29 below.
 */

const HUB = { label: 'HubSpot Consulting', href: '/hubspot-consulting' }

/**
 * The consolidated FAQ, in render order: the hub's questions, then each
 * retired page's in turn, first appearance winning (the two questions every
 * page repeated word for word appear once). The live list comes from the
 * central `faqItem` documents tagged with the five HubSpot page keys, merged
 * in the same order; this is the fallback when Sanity has none.
 */
export const HUBSPOT_FAQS: PracticeFaq[] = [
  {
    q: 'What does a HubSpot consulting partner do?',
    a: 'A HubSpot partner implements and optimises HubSpot’s Marketing, Sales, and Service Hubs, covering portal setup, lifecycle architecture, automation, reporting, and integration with your wider stack. Fruition delivers these services across Australia, the UK, and the US.',
  },
  {
    q: 'Is HubSpot or monday CRM better for our sales team?',
    a: 'HubSpot wins when marketing automation is the centre of gravity; monday CRM wins for teams wanting sales, projects, and operations on one flexible platform, typically at lower admin cost. Fruition implements both and publishes honest comparisons, the answer depends on where your operational weight sits.',
  },
  {
    q: 'Can Fruition connect HubSpot to monday.com?',
    a: 'Yes: the monday↔HubSpot integration is one of our signature builds: leads captured and nurtured in HubSpot flowing into monday for delivery, with status and revenue data syncing back. See the dedicated integration page for architecture details.',
  },
  {
    q: 'How much does HubSpot consulting cost with Fruition?',
    a: 'Fruition HubSpot engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
  },
  {
    q: 'Which regions does Fruition deliver HubSpot services in?',
    a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
  },
  {
    q: 'How long does a typical HubSpot engagement take?',
    a: 'Most HubSpot engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
  },
  {
    q: 'Why choose Fruition over a Big-4 consulting firm?',
    a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 900+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms, so recommendations are cross-platform and honest.',
  },
  {
    q: 'Can Fruition deliver this remotely?',
    a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
  },
  {
    q: 'How long does a HubSpot implementation take?',
    a: 'A focused single-Hub implementation runs 3–5 weeks; multi-Hub deployments with migrations and integrations run 6–12 weeks. Fruition fixes scope and price per phase before work begins.',
  },
  {
    q: 'We already have HubSpot but it’s a mess, can you fix it?',
    a: 'Yes: portal rescue engagements (property cleanup, lifecycle rebuild, automation audit, deduplication) are as common as fresh implementations. A portal audit in week one scopes the fix.',
  },
  {
    q: 'How much does HubSpot implementation consulting cost with Fruition?',
    a: 'Fruition HubSpot implementation engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
  },
  {
    q: 'Which regions does Fruition deliver HubSpot implementation services in?',
    a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
  },
  {
    q: 'How long does a typical HubSpot implementation engagement take?',
    a: 'Most HubSpot implementation engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
  },
  {
    q: 'What is HubSpot Breeze AI?',
    a: 'Breeze is HubSpot’s AI layer: Breeze agents (autonomous content, social, and prospecting workers), Breeze copilot (a CRM-embedded assistant), and Breeze intelligence (data enrichment and buyer-intent signals). It’s included across HubSpot tiers with usage-based components.',
  },
  {
    q: 'Is Breeze AI enough, or do we need custom AI?',
    a: 'Breeze covers HubSpot-native workflows well. You’ll need custom work when use cases span platforms, require deep retrieval over non-HubSpot content, or need agent behaviour Breeze doesn’t expose. Fruition configures Breeze first and escalates to custom builds only when the workload demands it.',
  },
  {
    q: 'How much does HubSpot Breeze AI consulting cost with Fruition?',
    a: 'Fruition HubSpot Breeze AI engagements start at AUD $8,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
  },
  {
    q: 'Which regions does Fruition deliver HubSpot Breeze AI services in?',
    a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
  },
  {
    q: 'How long does a typical HubSpot Breeze AI engagement take?',
    a: 'Most HubSpot Breeze AI engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
  },
  {
    q: 'Does monday.com integrate natively with HubSpot?',
    a: 'Yes, a native integration exists and covers common contact/deal syncing. Complex field mapping, transformation logic, and robust error handling typically require middleware (n8n or Make), which Fruition architects and manages.',
  },
  {
    q: 'Which should be our system of record: HubSpot or monday?',
    a: 'Typically HubSpot masters contacts and marketing data while monday masters delivery and operations. The precise split depends on your team structure: Fruition documents system-of-record rules per field as the first integration deliverable.',
  },
  {
    q: 'How much does monday-HubSpot integration consulting cost with Fruition?',
    a: 'Fruition monday-HubSpot integration engagements start at AUD $8,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
  },
  {
    q: 'Which regions does Fruition deliver monday-HubSpot integration services in?',
    a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
  },
  {
    q: 'How long does a typical monday-HubSpot integration engagement take?',
    a: 'Most monday-HubSpot integration engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
  },
  {
    q: 'Why do teams migrate from HubSpot to monday CRM?',
    a: 'The recurring drivers: consolidating CRM and delivery onto one platform, reducing technical administration cost (HubSpot development becomes expensive as sophistication grows), and gaining project-management capability HubSpot lacks. Teams centred on marketing automation often rightly stay: Fruition assesses fit honestly before any migration.',
  },
  {
    q: 'What migrates from HubSpot to monday CRM?',
    a: 'Contacts, companies, deals with full pipeline history, notes, activity timelines, and attachments. HubSpot workflows are rebuilt as monday automations rather than copied: usually an upgrade, since the rebuild removes years of workflow debt.',
  },
  {
    q: 'How long does a HubSpot to monday migration take?',
    a: 'Typically 4–5 weeks: one week audit and mapping, two weeks CRM build, one week staged migration with validation, and one week training and cutover.',
  },
  {
    q: 'How much does HubSpot to monday migration consulting cost with Fruition?',
    a: 'Fruition HubSpot to monday migration engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
  },
  {
    q: 'Which regions does Fruition deliver HubSpot to monday migration services in?',
    a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
  },
  {
    q: 'How long does a typical HubSpot to monday migration engagement take?',
    a: 'Most HubSpot to monday migration engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
  },
]

export const HUBSPOT_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/hubspot-consulting',
    seoTitle: 'HubSpot Consulting Partner | Fruition: Implementation, Breeze AI & Integration, AU · UK · US',
    seoDescription:
      'Fruition delivers HubSpot consulting across Australia, the UK, and the US (implementation, Breeze AI enablement, and integrations) as a multi-platform firm that recommends HubSpot when it fits and says so when it doesn’t.',
    breadcrumb: [HUB],
    heading: 'HubSpot advice from a partner with nothing to defend',
    lead: 'Fruition delivers HubSpot consulting across Australia, the UK, and the US (implementation, Breeze AI enablement, and integrations) as a multi-platform firm that recommends HubSpot when it fits and says so when it doesn’t.',
    targetQueries: [
      'HubSpot consultant Australia',
      'HubSpot implementation partner',
      'HubSpot agency UK',
      'HubSpot Breeze AI setup',
      'HubSpot monday integration',
    ],
    approachHeading: 'Marketing-strong, integration-native.',
    approach: [
      {
        title: 'HubSpot where it’s strongest',
        body: 'HubSpot’s Marketing Hub is genuinely excellent. We implement it properly, and integrate it with the CRM and project platforms where your operations actually run.',
      },
      {
        title: 'Breeze AI, governed',
        body: 'HubSpot’s AI layer configured with the same governance discipline as our broader AI practice, because ungoverned AI in your CRM is a compliance incident waiting.',
      },
      {
        title: 'Two-way migration honesty',
        body: 'We migrate teams onto HubSpot and off it. That dual practice keeps our fit assessments honest in a way single-vendor agencies can’t match.',
      },
    ],
    servicesHeading: 'The HubSpot service line.',
    // Each card jumps to its in-page section (HUBSPOT_SERVICE_ANCHORS).
    services: [
      {
        title: 'HubSpot implementation',
        body: 'Marketing, Sales, and Service Hub setups with lifecycle architecture, lead scoring, and reporting built right the first time.',
      },
      {
        title: 'Breeze AI enablement',
        body: 'HubSpot’s AI agents, copilot, and intelligence features configured and governed for your team.',
      },
      {
        title: 'monday ↔ HubSpot integration',
        body: 'The two platforms working as one system: marketing in HubSpot, delivery in monday, data flowing both ways.',
      },
      {
        title: 'HubSpot → monday migration',
        body: 'Structured CRM migration when teams consolidate onto monday, with full history preservation.',
      },
    ],
    faqs: HUBSPOT_FAQS,
  },
}
