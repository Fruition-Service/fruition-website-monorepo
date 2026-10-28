import type { PracticePage } from './types'

/**
 * /licence-procurement: software licence procurement.
 *
 * The route used to publish indicative consulting fees, then sold monday.com,
 * Atlassian and HubSpot licences through a partner. It now describes the
 * procurement service itself: audit what a team already pays for, recommend
 * what to buy, source and negotiate it, then manage the renewals. The URL is
 * unchanged so the existing rankings and backlinks hold.
 *
 * Deliberately free of prices, discount percentages, savings claims, seat
 * arithmetic and partner tiers: vendor terms change without notice and every
 * engagement is quoted in writing after a consultation.
 *
 * This copy is the *fallback*. The live page merges the `licensingPage`
 * singleton over it field by field (see src/features/content/licensingPage.ts),
 * so anything edited in the Studio wins and anything left blank falls back to
 * here. public/licence-procurement.md is the markdown twin and must say the same thing.
 */

export const LICENSING_PAGES: Record<string, PracticePage> = {
  pricing: {
    path: '/licence-procurement',
    seoTitle: 'Software Licence Procurement for SMB and Mid-Market Teams | Fruition',
    seoDescription:
      'Software licence procurement for SMB and mid-market teams: we audit what you pay for, recommend the right plans, source and negotiate Microsoft, Google, Adobe, Atlassian and monday.com licences, and manage every renewal.',
    breadcrumb: [{ label: 'Licence procurement', href: '/licence-procurement' }],
    primaryCtaLabel: 'Book a consultation',
    eyebrow: 'Software licence procurement',
    heading: 'Buy and renew software without overpaying for it',
    lead: 'For SMB and mid-market teams buying or renewing software from Microsoft, Google, Adobe, Atlassian, monday.com and similar vendors. We audit what you already pay for, source and negotiate what you need, and manage every renewal after that, so licensing becomes a managed process instead of a scramble before each invoice.',
    targetQueries: [
      'software licence procurement',
      'software licensing consultant for SMB',
      'Microsoft 365 and Google Workspace licence renewal help',
      'software renewal management service',
      'SaaS licence audit and rightsizing',
    ],
    approachEyebrow: 'How procurement works',
    approachHeading: 'Four steps, in this order.',
    approach: [
      {
        title: 'Audit',
        body: 'We map every subscription you hold: vendor, plan, seat count, billing cycle, renewal date and who owns it. Then we compare it against real usage to find dormant seats, duplicate tools and plans above the features in use. You get a written licence register you keep.',
      },
      {
        title: 'Recommendation',
        body: 'From the audit we recommend what to keep, consolidate, downgrade, upgrade or retire, and how to buy each item: direct, through a reseller or through a partner channel. You get a plain-language plan to approve before anything is bought.',
      },
      {
        title: 'Procurement',
        body: 'We request quotes, compare the options, negotiate terms on your behalf and handle the vendor paperwork through to the order. You approve every purchase and the licences stay in your organisation’s name.',
      },
      {
        title: 'Renewal management',
        body: 'Every renewal goes on one calendar with notice periods tracked. Ahead of each date we re-check usage, renegotiate where it makes sense, and confirm the order with you, so nothing auto-renews unreviewed.',
      },
    ],
    servicesEyebrow: 'What the engagement includes',
    servicesHeading: 'Procurement, from the first audit to the next renewal.',
    services: [
      {
        title: 'Licence audit and rightsizing',
        body: 'An inventory of every paid tool, matched against who actually uses it. We flag inactive users, guests billed as full members, overlapping products and plans that do more than you need, and show what each change would mean before you make it.',
      },
      {
        title: 'Vendor and reseller sourcing',
        body: 'For each product we work out the sensible ways to buy it and gather comparable quotes. Where buying direct from the vendor is the better option, we say so.',
      },
      {
        title: 'Renewal calendar and negotiation',
        body: 'One calendar for every contract, with renewal dates, notice periods and owners. We start each renewal early enough to review usage and negotiate terms instead of accepting the default.',
      },
      {
        title: 'Compliance and true-up support',
        body: 'We help you reconcile what is deployed against what is licensed, prepare for vendor compliance reviews and true-ups, and fix gaps through the proper channel rather than at audit time.',
      },
      {
        title: 'Onboarding and provisioning handover',
        body: 'Once licences are bought we hand over cleanly: admin access confirmed, seats assigned to the right people, and a record of what was bought, when it renews and who owns it.',
      },
    ],
    childrenEyebrow: 'After procurement',
    childrenHeading: 'The implementation side of what you buy.',
    children: [
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
      {
        label: 'AI Capability Assessment',
        description: 'Our flagship diagnostic and board-ready AI roadmap.',
        href: '/ai-capability-assessment',
      },
    ],
    // Authoritative for this route: see `preferPageFaqs` on PracticePage.
    preferPageFaqs: true,
    faqs: [
      {
        q: 'What is software licence procurement?',
        a: 'It is the work of deciding what software your organisation should pay for, buying it on sensible terms, and keeping it right-sized over time. We run that process for you: audit, recommendation, procurement and renewal management.',
      },
      {
        q: 'Who is this service for?',
        a: 'SMB and mid-market teams that buy or renew software from several vendors and do not have a dedicated procurement or software asset management function. It suits operations, finance and IT leads who own the invoices but not the time to review each one.',
      },
      {
        q: 'Which vendors do you cover?',
        a: 'Microsoft, Google, Adobe, Atlassian, monday.com and similar business software vendors. If a tool you rely on is not on that list, ask: the audit covers everything you pay for, and we will tell you plainly if a purchase is better handled elsewhere.',
      },
      {
        q: 'What does an engagement include?',
        a: 'A licence audit and rightsizing review, sourcing across vendors and resellers, negotiation, compliance and true-up support, a renewal calendar, and a clean onboarding and provisioning handover once licences are bought. The scope is agreed with you before work starts.',
      },
      {
        q: 'We already have a reseller. Can you still help?',
        a: 'Yes. Many clients keep their existing reseller. We can audit and rightsize what you buy through them, compare their quotes against other options, and manage renewals with them, or recommend a change where it makes sense for you.',
      },
      {
        q: 'How are your fees agreed?',
        a: 'Fees depend on the number of vendors and the scope of the engagement, and are agreed in writing after a consultation, before any work starts.',
      },
      {
        q: 'We have a renewal or true-up coming up soon. Is it too late?',
        a: 'Usually not. Book a consultation and tell us the date. We will look at what can still be reviewed or negotiated before it, and set up the calendar so the next one is handled well ahead of time.',
      },
      {
        q: 'Do we also need implementation services?',
        a: 'No. Procurement stands on its own. If a tool also needs to be set up, migrated or rolled out, our implementation and training teams can help, and that work is quoted separately.',
      },
      {
        q: 'Can you handle security questionnaires and vendor paperwork?',
        a: 'Yes. We help complete security questionnaires, data processing agreements, vendor onboarding forms and tax documentation, and keep a record of what was signed and when, so the next renewal starts from the same file.',
      },
    ],
  },
}
