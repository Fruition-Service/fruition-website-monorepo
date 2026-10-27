import type { PracticePage } from './types'

/**
 * /pricing: the site's commercial page.
 *
 * Every number lives here: what each implementation package costs, how it is
 * billed and which one fits, plus the software licence procurement service
 * (audit, recommendation, procurement, renewal management) that PR #330
 * shipped, kept as its own section. /implementation-packages is the delivery
 * page (phases, scope, timeline, who does what) and links back here for
 * prices. The URL is unchanged so the existing rankings and backlinks hold.
 *
 * Package tiers come from the Studio `implementationPackagesPage.packageTiers`
 * (fallback and editorial framing in src/data/pricing/packages.ts). Licence
 * procurement stays free of prices, discount percentages and savings claims:
 * vendor terms change without notice and every engagement is quoted in
 * writing after a consultation.
 *
 * This copy is the *fallback*. The live page merges the `licensingPage`
 * singleton over it field by field (see src/features/content/licensingPage.ts),
 * so anything edited in the Studio wins and anything left blank falls back to
 * here. public/pricing.md is the markdown twin and must say the same thing.
 */

export const LICENSING_PAGES: Record<string, PracticePage> = {
  pricing: {
    path: '/pricing',
    seoTitle: 'Pricing and Implementation Packages | Fruition',
    seoDescription:
      'monday.com implementation package pricing from a Platinum partner, from $2,500 for training and optimisation, plus software licence procurement: audit, sourcing, negotiation and renewal management.',
    breadcrumb: [{ label: 'Pricing', href: '/pricing' }],
    primaryCtaLabel: 'Book a consultation',
    heroSecondaryLink: { label: 'How delivery works', href: '/implementation-packages' },
    eyebrow: 'Pricing',
    heading: 'What it costs, and how to buy it',
    lead: 'Two commercial decisions live on this page: what a monday.com implementation package costs, and how Fruition buys and renews the software licences underneath it. How a build is actually delivered, who does what and how long it takes, is on Implementation packages.',
    targetQueries: [
      'monday.com implementation packages pricing',
      'monday.com implementation cost',
      'monday consulting packages price',
      'software licence procurement',
      'software licensing consultant for SMB',
      'software renewal management service',
    ],
    packagesSection: {
      eyebrow: 'Implementation packages',
      heading: 'Three ways to buy an implementation',
      subheading:
        'A fixed starting price for training and optimisation, a scoped quote for a full build, and an ongoing engineer if the work never really ends.',
      comparisonHeading: 'Which package fits',
      footnote:
        'Prices are in USD and exclude monday.com licence fees. One package per product. Lock-Step and Managed Services are scoped to your requirements and quoted by the team after a short discovery call. Currency and region figures are indicative conversions, not a quote.',
      deliveryHandoff: {
        text: 'Want to know what happens during a build, who does what and how long it takes?',
        label: 'See how delivery works',
        href: '/implementation-packages',
      },
    },
    approachEyebrow: 'Software licence procurement',
    approachHeading: 'Buying the software underneath it.',
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
    servicesEyebrow: 'What the procurement engagement includes',
    servicesHeading: 'From the first audit to the next renewal.',
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
    childrenEyebrow: 'After the purchase',
    childrenHeading: 'The implementation side of what you buy.',
    children: [
      {
        label: 'Implementation packages',
        description: 'The delivery journey: phases, scope, timeline and who does what.',
        href: '/implementation-packages',
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
        q: 'How much does a monday.com implementation cost?',
        a: 'Training and Optimisation starts from $2,500 for a minimum of 10 hours, at a fixed price agreed before work starts. Lock-Step is a 40-hour build quoted after a scoping call, and Managed Services is an ongoing engagement quoted the same way. monday.com licence fees are separate from all three.',
      },
      {
        q: 'What does the $2,500 starting price include?',
        a: 'Team training sessions, a board and workflow review, clean-up and optimisation of your existing automations, best-practice recommendations and handover documentation. It is designed for teams already on monday.com who want what they own working properly.',
      },
      {
        q: 'Why are Lock-Step and Managed Services quoted rather than priced?',
        a: 'Both depend on how many processes, boards and integrations are in scope, and on how much of the build your team does itself. We scope that on a short call and give you a written quote before any work starts, so there are no hourly surprises.',
      },
      {
        q: 'Are monday.com licences included in a package?',
        a: 'No. Package prices cover Fruition delivery time only. Licences are bought separately, and we can procure, negotiate and manage them for you if you want that handled too.',
      },
      {
        q: 'Which package should we start with?',
        a: 'If monday.com is already in use and the problem is how it is set up, start with Training and Optimisation. If you need a new build across one or two processes, that is Lock-Step. If you want a named engineer improving the system every month, that is Managed Services. If you are unsure, the scoping call is where we tell you plainly which one you need.',
      },
      {
        q: 'Can one package cover more than one product?',
        a: 'No. One package is purchased per product. If you are rolling out monday.com and Atlassian, or two monday.com products, each is scoped and bought separately.',
      },
      {
        q: 'What is software licence procurement?',
        a: 'It is the work of deciding what software your organisation should pay for, buying it on sensible terms, and keeping it right-sized over time. We run that process for you: audit, recommendation, procurement and renewal management.',
      },
      {
        q: 'Which vendors do you cover for licence procurement?',
        a: 'Microsoft, Google, Adobe, Atlassian, monday.com and similar business software vendors. If a tool you rely on is not on that list, ask: the audit covers everything you pay for, and we will tell you plainly if a purchase is better handled elsewhere.',
      },
      {
        q: 'We already have a reseller. Can you still help?',
        a: 'Yes. Many clients keep their existing reseller. We can audit and rightsize what you buy through them, compare their quotes against other options, and manage renewals with them, or recommend a change where it makes sense for you.',
      },
      {
        q: 'Do we have to buy implementation and licence procurement together?',
        a: 'No. Either stands on its own. Procurement is quoted on the number of vendors and the scope of the engagement, in writing after a consultation. Implementation is priced by package on this page.',
      },
    ],
  },
}
