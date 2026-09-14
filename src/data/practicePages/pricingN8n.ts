import type { PracticePage } from './types'

/**
 * /pricing — copy ported from the approved v2.1 mockups (pricing.html).
 * (The /ai-consulting/n8n page was pruned July 2026 — 301 →
 * /partnerships/n8n-integration-partner.)
 *
 * Notes on the port:
 * - The immutable `services` card type carries no href, so the cross-links the
 *   mockups imply are surfaced through the `children` (linked) section instead,
 *   pointing only at real routes.
 * - The mockups credited "Josh Roszler"; the leader bio is a shared constant
 *   (PRACTICE_LEADER, already corrected to Jebathilak) and is not re-stated here.
 * - Pricing FAQ #3 read "How much does consulting consulting cost" in the mockup
 *   — a doubled-word artifact, de-duplicated to "consulting" here.
 */

export const PRICING_N8N_PAGES: Record<string, PracticePage> = {
  pricing: {
    path: '/pricing',
    seoTitle: 'Pricing | Fruition Services: Fixed-Fee Consulting Packages, AU · UK · US',
    seoDescription:
      'Every Fruition engagement is a fixed-fee phase with a defined outcome. Here’s how pricing works across all four practices in Australia, the UK, and the US.',
    breadcrumb: [{ label: 'Pricing', href: '/pricing' }],
    eyebrow: 'Pricing',
    heading: 'Published prices. Zero surprises',
    lead: 'Every Fruition engagement is a fixed-fee phase with a defined outcome. Here’s how pricing works across all four practices in Australia, the UK, and the US.',
    targetQueries: [
      'monday.com implementation cost',
      'AI capability assessment price',
      'fixed fee AI consulting',
      'HubSpot implementation cost Australia',
    ],
    approachEyebrow: 'How pricing works',
    approachHeading: 'Three rules we never break.',
    approach: [
      {
        title: 'Fixed fee per phase',
        body: 'Every phase has a published price agreed before work starts. If we mis-scope it, that’s our cost, not yours.',
      },
      {
        title: 'Defined outcomes',
        body: 'Each phase ends with a named deliverable: a roadmap, a live system, a trained team. You always know what you’re buying.',
      },
      {
        title: 'Regional pricing',
        body: 'AUD for Australia, GBP for the UK, USD for the US: priced for each market, same deliverables everywhere.',
      },
    ],
    servicesEyebrow: 'Indicative engagement pricing',
    servicesHeading: 'Starting points.',
    services: [
      {
        title: 'AI Capability Assessment',
        body: 'Fixed fee: AUD $24,500 / GBP £14,500 / USD $18,500. Four weeks, board-ready roadmap. Our flagship diagnostic.',
      },
      {
        title: 'monday.com implementation',
        body: 'Structured implementations from AUD $8,000 for focused single-team builds to $150,000+ for enterprise multi-department deployments.',
      },
      {
        title: 'AI implementation phases',
        body: 'Agent and automation builds typically AUD $35,000–$150,000 per phase depending on integration depth and platform.',
      },
      {
        title: 'Atlassian & HubSpot',
        body: 'Implementations and migrations from AUD $12,000; cross-platform migrations (Jira→monday, HubSpot→monday) scoped after a systems audit.',
      },
      {
        title: 'Training & enablement',
        body: 'Team training from AUD $2,500 per workshop; structured enablement programs scoped per team size.',
      },
      {
        title: 'Managed services',
        body: 'Ongoing optimisation and support retainers from AUD $3,000/month with defined SLAs.',
      },
    ],
    childrenEyebrow: 'Explore the practices',
    childrenHeading: 'Where these prices apply.',
    children: [
      {
        label: 'AI Capability Assessment',
        description: 'Our flagship four-week diagnostic and board-ready AI roadmap.',
        href: '/ai-capability-assessment',
      },
      {
        label: 'monday.com implementation',
        description: 'Single-team builds through enterprise multi-department deployments.',
        href: '/monday-implementation-consultants',
      },
      {
        label: 'Atlassian consulting',
        description: 'Jira, Confluence, and JSM implementation and migration.',
        href: '/atlassian-consulting',
      },
      {
        label: 'HubSpot consulting',
        description: 'CRM implementation and cross-platform migration.',
        href: '/hubspot-consulting',
      },
      {
        label: 'Training & enablement',
        description: 'Team workshops and structured enablement programs.',
        href: '/monday-training',
      },
    ],
    faqs: [
      {
        q: 'Does Fruition charge hourly rates?',
        a: 'No. Fruition works on fixed-fee phases with defined outcomes. Hourly billing rewards slowness; fixed fees reward outcomes. Managed service retainers are the only recurring pricing, and they carry defined SLAs.',
      },
      {
        q: 'What if the project scope changes mid-phase?',
        a: 'Scope changes are re-quoted as a new fixed price before any additional work begins. Nothing is billed that wasn’t agreed in writing.',
      },
      {
        q: 'How much does consulting cost with Fruition?',
        a: 'Fruition consulting engagements start at AUD $15,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver consulting services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical consulting engagement take?',
        a: 'Most consulting engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
      },
      {
        q: 'Why choose Fruition over a Big-4 consulting firm?',
        a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 900+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms, so recommendations are cross-platform and honest.',
      },
      {
        q: 'Can Fruition deliver this remotely?',
        a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
      },
    ],
  },
}
