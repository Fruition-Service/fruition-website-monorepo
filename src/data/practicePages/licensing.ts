import type { PracticePage } from './types'

/**
 * /pricing — licence procurement.
 *
 * The route used to publish indicative consulting fees ("Published prices.
 * Zero surprises."). It now sells the thing buyers actually arrive looking
 * for: buying monday.com, Atlassian and HubSpot licences through a certified
 * partner. The URL is unchanged so the existing rankings and backlinks hold;
 * the engagement-fee content survives as the "How much does a Fruition
 * implementation cost?" FAQ, which is what the old page ranked for.
 *
 * This copy is the *fallback*. The live page merges the `licensingPage`
 * singleton over it field by field (see src/features/content/licensingPage.ts),
 * so anything edited in the Studio wins and anything left blank falls back to
 * here.
 *
 * Vendor facts quoted below, all from vendor documentation (Sept 2026):
 * - monday.com: four products; bucket seats (min 3, then multiples of 5);
 *   yearly billing 18% under monthly; bundled products share one billing
 *   cycle; Enterprise requires every bundled product on Enterprise with a
 *   12-month minimum term; seat tiers below the active user count are greyed
 *   out at checkout.
 * - Atlassian: partner pricing is reserved for certified partners and
 *   corporate resellers; Social Impact / Academic / Open Source discounts are
 *   published; dual licensing extends Data Center up to 1 year at a 100%
 *   discount, and step-up credits refund unused Data Center time.
 * - HubSpot: Solutions Partners can waive HubSpot's onboarding fee, which
 *   HubSpot's own partner page values at up to USD $6,000 per client.
 */

export const LICENSING_PAGES: Record<string, PracticePage> = {
  pricing: {
    path: '/pricing',
    seoTitle: 'Software Licensing | monday.com, Atlassian & HubSpot Licences | Fruition',
    seoDescription:
      'Buy monday.com, Atlassian and HubSpot licences through a certified partner. Right-sized plans, seat audits before every renewal, and the vendor incentives you qualify for, in AUD, GBP or USD.',
    breadcrumb: [{ label: 'Licensing', href: '/pricing' }],
    eyebrow: 'Licensing',
    heading: 'Buy your licences from the team that runs them',
    lead: 'Fruition is a certified partner for monday.com, Atlassian and HubSpot. We quote, buy and renew your licences for you: the right products, the right plan, a seat count matched to real usage, and every vendor incentive you qualify for, billed in AUD, GBP or USD.',
    targetQueries: [
      'buy monday.com licences through a partner',
      'monday.com seat pricing tiers',
      'Atlassian partner licensing Australia',
      'HubSpot onboarding fee waived partner',
      'software licence procurement consultancy',
    ],
    approachEyebrow: 'How procurement works',
    approachHeading: 'Three rules we never break.',
    approach: [
      {
        title: 'Vendor pricing, no procurement fee',
        body: 'Licences are quoted at the vendor’s own pricing. Partner compensation comes from the vendor, so nothing is added to your invoice for buying through us.',
      },
      {
        title: 'Right-sized before you sign',
        body: 'monday.com sells seats in buckets: a minimum of 3, then multiples of 5. A team of six pays for ten unless someone checks. We size products, plans and seats against how your teams actually work before anything is quoted.',
      },
      {
        title: 'One renewal calendar',
        body: 'One quote, one purchase order, one invoice across every vendor, with renewal dates aligned and a seat audit before each one so you stop paying for dormant users.',
      },
    ],
    servicesEyebrow: 'What we procure',
    servicesHeading: 'Licences, renewals and the paperwork.',
    services: [
      {
        title: 'monday.com licences',
        body: 'All four products (work platform, CRM, dev and service) from Basic through Enterprise. Bundled products can sit on different plans but share one billing cycle, yearly billing lands 18% under monthly, and Enterprise carries a 12-month minimum term with every bundled product on Enterprise. We quote the mix and hold the renewal date.',
      },
      {
        title: 'Atlassian licences',
        body: 'Jira, Confluence, Jira Service Management, Bitbucket and Guard, across Cloud and Data Center. Atlassian reserves partner pricing for certified partners rather than unaffiliated resellers, so the quote comes through that channel and tier changes are handled at renewal instead of mid-term.',
      },
      {
        title: 'HubSpot licences',
        body: 'Hub and seat mix across Marketing, Sales, Service and Content. Buying through a Solutions Partner lets HubSpot’s mandatory onboarding fee be waived, which HubSpot values at up to USD $6,000 per client, with onboarding delivered by the consultants who know your build.',
      },
      {
        title: 'Seat audits and renewal reviews',
        body: 'Before every renewal we pull actual usage: dormant members, guests billed as members, duplicate products, and plans a tier above the features in use. monday.com greys out any seat tier below your active user count, so the clean-up has to happen before the quote, not after it.',
      },
      {
        title: 'Eligibility and migration incentives',
        body: 'Nonprofit, academic and open source rates, plus Atlassian’s migration incentives: dual licensing keeps Data Center running alongside Cloud for up to a year at a 100% discount, and step-up credits cover unused Data Center time. Eligibility is the vendor’s decision; we prepare and lodge the application.',
      },
      {
        title: 'Procurement paperwork',
        body: 'Security questionnaires, DPAs, vendor onboarding forms, tax documentation and multi-entity billing across our Australian, UK and US entities. One supplier record instead of three, and one team answering for all of it.',
      },
    ],
    childrenEyebrow: 'Where the licences land',
    childrenHeading: 'The practices that implement them.',
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
        description: 'Our flagship four-week diagnostic and board-ready AI roadmap.',
        href: '/ai-capability-assessment',
      },
    ],
    // Authoritative for this route: see `preferPageFaqs` on PracticePage.
    preferPageFaqs: true,
    faqs: [
      {
        q: 'Does buying licences through Fruition cost more than buying direct?',
        a: 'No. Licences are quoted at the vendor’s own pricing, and partner compensation comes from the vendor rather than a margin added to your invoice. What changes is what you end up buying: the right products, the right plan tier, and a seat count matched to real usage.',
      },
      {
        q: 'Which vendors can Fruition transact for us?',
        a: 'monday.com, where Fruition is a Platinum Partner, plus Atlassian and HubSpot. We advise on the AI and automation platforms we implement as well, and we will say so plainly when buying direct from the vendor is the better option for you.',
      },
      {
        q: 'How does monday.com licensing actually price?',
        a: 'Per product and per seat bucket. There are four products (work platform, CRM, dev and service), each priced on its own plan ladder. Seats are sold in buckets starting at 3 and then rising in multiples of 5, so a team of six is billed for ten. Yearly billing is 18% cheaper than monthly. Products can be bundled on different plans but must share one billing cycle, and Enterprise requires every bundled product to sit on Enterprise with a minimum 12-month term.',
      },
      {
        q: 'Can we reduce our seat count at renewal?',
        a: 'Yes, but the order matters. monday.com greys out any seat tier below your current active user count, so dormant users have to be deactivated before a smaller plan can be selected. Our renewal review does that first and quotes second, which is the opposite of what happens when a renewal auto-processes.',
      },
      {
        q: 'What discounts is our organisation likely to qualify for?',
        a: 'Annual rather than monthly billing is the dependable one: 18% on monday.com, and lower effective rates on Atlassian Cloud. Beyond that, Atlassian publishes discounted Social Impact (nonprofit), Academic and Open Source licensing, and pays incentives for moving off Data Center, including dual licensing that keeps Data Center running alongside Cloud for up to a year at a 100% discount. Eligibility is verified by the vendor, not by us; we prepare and lodge the application.',
      },
      {
        q: 'Does HubSpot still charge an onboarding fee?',
        a: 'HubSpot requires onboarding on Professional and Enterprise purchases, but a certified Solutions Partner can have that fee waived and deliver the onboarding instead. HubSpot values the waiver at up to USD $6,000 per client. You still pay for the implementation work; you are not paying for it twice.',
      },
      {
        q: 'Do we have to buy implementation services to buy licences through you?',
        a: 'No. Licensing and implementation are quoted separately and you can take licences on their own, including as the partner of record for a platform someone else built. Most clients do both because the team quoting the plan is the team that knows what the build needs.',
      },
      {
        q: 'How much does a Fruition implementation cost?',
        a: 'Implementation is fixed fee per phase with a named deliverable. monday.com implementations start around AUD $8,000 for a focused single-team build and run past $150,000 for enterprise multi-department deployments. The AI Capability Assessment is a fixed AUD $24,500 / GBP £14,500 / USD $18,500 for a four-week diagnostic and board-ready roadmap. Atlassian and HubSpot implementations and migrations start at AUD $12,000, training from AUD $2,500 per workshop, and managed services from AUD $3,000 a month. Every figure is confirmed in a written quote after a scoping call.',
      },
      {
        q: 'Which currencies and entities can you invoice in?',
        a: 'AUD, GBP and USD, from our Australian, UK and US entities. Multi-entity groups can be billed centrally or per region, and renewals can be co-terminated so one date covers every vendor.',
      },
    ],
  },
}
