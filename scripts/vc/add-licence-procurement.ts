/**
 * /licence-procurement as a Version C page (13 Nov 2026).
 *
 * The page was missed by the November rollout and still rendered the old
 * PracticePageTemplate. It sits in the Pricing menu beside /implementation-packages
 * and /training, so it joins the "core" group and reuses the approved pricing
 * layout (src/styles/vc/pages/pricing.css, slug "pricing"): the same hero art
 * frame, audit band, numbered steps, cards, client proof, booking, FAQ and closing band.
 *
 *   npx tsx scripts/vc/add-licence-procurement.ts           # dry run: prints the documents
 *   npx tsx scripts/vc/add-licence-procurement.ts --apply   # writes the FAQ items and the page
 *
 * Copy is the live page's copy, word for word: the `licensingPage` Studio document
 * (heading, lead, steps, services, two headings) merged over the shipped fallback in
 * src/data/practicePages/licensing.ts (SEO, eyebrows, children, FAQs), with stray
 * spaces and line breaks from the Studio paste removed ("W e", "Y ou", "monday .com").
 * Still no prices, savings claims or partner tiers, as before. Idempotent: fixed ids,
 * createOrReplace. The `licensingPage` singleton no longer drives the route.
 */
import { createHash } from 'crypto'
import { writeClient } from '../sanity-migrate/lib'

const APPLY = process.argv.includes('--apply')
const PATH = '/licence-procurement'
const PAGE_ID = 'vcPage-licence-procurement'

/** Stable keys, so a re-run does not churn every array item. */
const k = (seed: string) => createHash('md5').update(`licence-procurement:${seed}`).digest('hex').slice(0, 12)
const img = (ref: string, alt?: string) => ({ _type: 'image', ...(alt ? { alt } : {}), asset: { _type: 'reference', _ref: ref } })
const head = (badge: string, heading: string, lead?: string) => ({ _type: 'vcHead', badge, heading, ...(lead ? { lead } : {}) })
const cta = (seed: string, label: string, href: string, style: string, arrow: boolean) => ({ _key: k(seed), _type: 'vcCta', label, href, style, arrow })

/* -------------------------------------------------------------- hero art */

// Same drawing language as the /implementation-packages hero ("PRICING AT A GLANCE"):
// a licence register, the deliverable of step 1. Vendors from the page copy; no prices.
const VENDORS = ['Microsoft 365', 'Google Workspace', 'Adobe', 'Atlassian', 'monday.com']
const STATUS = ['REVIEW', 'RIGHTSIZE', 'RENEW', 'CONSOLIDATE', 'RENEW']
const rows = VENDORS.map((v, i) => {
  const y = 102 + i * 50
  return (
    `<rect class="box" x="40" y="${y}" width="480" height="40" rx="12"></rect>` +
    `<text class="t" x="58" y="${y + 25}">${v}</text>` +
    `<text class="ma" x="502" y="${y + 24}" text-anchor="end">${STATUS[i]}</text>`
  )
}).join('')
const FRAME_SVG =
  `<svg viewBox="0 0 560 420" role="img" aria-label="A licence register: each vendor with its next action" xmlns="http://www.w3.org/2000/svg">` +
  `<text class="ma" x="40" y="34">LICENCE REGISTER</text>` +
  `<rect class="box" x="40" y="52" width="480" height="40" rx="12"></rect>` +
  `<text class="m" x="58" y="76">VENDOR</text><text class="m" x="502" y="76" text-anchor="end">NEXT STEP</text>` +
  rows +
  `<rect class="soft" x="40" y="368" width="230" height="28" rx="14"></rect>` +
  `<text class="ma" x="155" y="386" text-anchor="middle">ONE CALENDAR, EVERY RENEWAL</text>` +
  `</svg>`

/* ------------------------------------------------------------------ FAQs */

const FAQS: [string, string][] = [
  ['What is software licence procurement?', 'It is the work of deciding what software your organisation should pay for, buying it on sensible terms, and keeping it right-sized over time. We run that process for you: audit, recommendation, procurement and renewal management.'],
  ['Who is this service for?', 'SMB and mid-market teams that buy or renew software from several vendors and do not have a dedicated procurement or software asset management function. It suits operations, finance and IT leads who own the invoices but not the time to review each one.'],
  ['Which vendors do you cover?', 'Microsoft, Google, Adobe, Atlassian, monday.com and similar business software vendors. If a tool you rely on is not on that list, ask: the audit covers everything you pay for, and we will tell you plainly if a purchase is better handled elsewhere.'],
  ['What does an engagement include?', 'A licence audit and rightsizing review, sourcing across vendors and resellers, negotiation, compliance and true-up support, a renewal calendar, and a clean onboarding and provisioning handover once licences are bought. The scope is agreed with you before work starts.'],
  ['We already have a reseller. Can you still help?', 'Yes. Many clients keep their existing reseller. We can audit and rightsize what you buy through them, compare their quotes against other options, and manage renewals with them, or recommend a change where it makes sense for you.'],
  ['How are your fees agreed?', 'Fees depend on the number of vendors and the scope of the engagement, and are agreed in writing after a consultation, before any work starts.'],
  ['We have a renewal or true-up coming up soon. Is it too late?', 'Usually not. Book a consultation and tell us the date. We will look at what can still be reviewed or negotiated before it, and set up the calendar so the next one is handled well ahead of time.'],
  ['Do we also need implementation services?', 'No. Procurement stands on its own. If a tool also needs to be set up, migrated or rolled out, our implementation and training teams can help, and that work is quoted separately.'],
  ['Can you handle security questionnaires and vendor paperwork?', 'Yes. We help complete security questionnaires, data processing agreements, vendor onboarding forms and tax documentation, and keep a record of what was signed and when, so the next renewal starts from the same file.'],
]

// Dot-free ids (dotted ids are private in Sanity). Off the /faqs hub like every faqItem-vc-*.
const faqId = (i: number) => `faqItem-vc-licence-${String(i + 1).padStart(2, '0')}`
const faqDocs = FAQS.map(([q, a], i) => ({
  _id: faqId(i),
  _type: 'faqItem',
  question: q,
  answer: [{ _key: k(`faq-a-${i}`), _type: 'block', style: 'normal', markDefs: [], children: [{ _key: k(`faq-s-${i}`), _type: 'span', marks: [], text: a }] }],
  category: 'Licence procurement',
  pages: ['licence-procurement'],
  order: i + 1,
}))

/* ------------------------------------------------------------------ page */

const page = {
  _id: PAGE_ID,
  _type: 'vcPage',
  path: PATH,
  group: 'core',
  seoTitle: 'Software Licence Procurement for SMB and Mid-Market Teams | Fruition',
  seoDescription:
    'Software licence procurement for SMB and mid-market teams: we audit what you pay for, recommend the right plans, source and negotiate Microsoft, Google, Adobe, Atlassian and monday.com licences, and manage every renewal.',
  sections: [
    {
      _key: k('hero'),
      _type: 'vcHero',
      badge: 'Licence procurement · Microsoft · Google · Adobe · Atlassian · monday.com',
      heading: 'Buy and renew software *without overpaying*',
      lead: 'We audit your software spend from Microsoft, Google, Adobe, Atlassian, monday.com and more, negotiate better terms and manage every renewal, so licensing stops being a last-minute scramble.',
      ctas: [cta('hero-book', 'Book a consultation', '#book', 'primary', true), cta('hero-how', 'How it works', '#how', 'outline', false)],
      creds: [
        { _key: k('cred-monday'), _type: 'vcLogo', alt: 'monday.com Platinum Partner', image: img('image-f8884b26b1df478c718a6625ee989370c5afcfa2-400x136-png') },
        { _key: k('cred-atlassian'), _type: 'vcLogo', alt: 'Atlassian Platinum Partner', image: img('image-fc3830199e4aa9bcec3f153085e0a47ce00621d2-291x97-png') },
      ],
      frameClass: 'art-frame',
      frameSvg: FRAME_SVG,
    },
    {
      _key: k('audit'),
      _type: 'vcAudit',
      tone: 'plain',
      heading: 'Renewal or true-up *coming up soon?*',
      text: 'Usually not too late. Tell us the date and we will look at what can still be reviewed or negotiated.',
      cta: { _type: 'vcCta', label: 'Book a consultation', href: '#book', style: 'primary', arrow: true },
    },
    {
      _key: k('steps'),
      _type: 'vcSteps',
      tone: 'alt',
      anchor: 'how',
      head: head('How procurement works', 'How it works: four steps, *from audit to renewal*'),
      layout: 'steps s4',
      titleClass: 'title',
      items: [
        ['Audit', 'We list every subscription you pay for and compare it with actual usage to find unused seats, duplicate tools and plans with more than you need. You keep the full licence register.'],
        ['Recommendation', 'We recommend what to keep, combine, change or cancel, and the best way to buy each one. You approve the plan before anything is bought.'],
        ['Procurement', 'We gather quotes, negotiate terms and handle the paperwork. You approve every purchase, and licences stay in your name.'],
        ['Renewal management', 'Every renewal is tracked on one calendar. Before each date we check usage, renegotiate where it helps and confirm with you, so nothing renews without a review.'],
      ].map(([title, body], i) => ({ _key: k(`step-${i}`), _type: 'vcStep', n: String(i + 1).padStart(2, '0'), title, body, bullets: [] })),
    },
    {
      _key: k('services'),
      _type: 'vcCards',
      tone: 'plain',
      anchor: 'services',
      head: head('What the engagement includes', 'Procurement, from the first audit *to the next renewal.*'),
      layout: 'cards3',
      items: [
        ['Licence audit and rightsizing', 'We match every paid tool against who actually uses it, flag unused or overpriced seats, and show the impact of each change before you make it.'],
        ['Vendor and reseller sourcing', "We find the best way to buy each product and compare quotes. If buying direct is better, we'll tell you."],
        ['Renewal calendar and negotiation', "One calendar for every contract, with dates, notice periods and owners. We start early so there's time to review and negotiate."],
        ['Compliance and true-up support', "We check what's in use against what's licensed, help you prepare for vendor reviews, and fix gaps before an audit finds them."],
        ['Onboarding and provisioning handover', 'After purchase, we confirm admin access, assign seats to the right people and record what was bought, when it renews and who owns it.'],
      ].map(([title, body], i) => ({ _key: k(`svc-${i}`), _type: 'vcItem', title, body })),
    },
    {
      _key: k('proof'),
      _type: 'vcProof',
      tone: 'alt',
      layout: 'sticky',
      badge: 'Client proof',
      heading: 'What clients say about *working with Fruition*',
      lead: 'Operations and IT leaders on what changed once the work was mapped first.',
      ctas: [cta('proof-book', 'Book a consultation', '#book', 'primary', true)],
      // The shared vcQuote documents the pricing page uses: real, named clients.
      quotes: [
        'vcQuote-jade-wood-popology-e2fb27',
        'vcQuote-luke-reddin-clean-power-australia-c110e8',
        'vcQuote-emily-hill-tourism-northern-territory-8e8ed1',
        'vcQuote-lorenzo-tejada-orrell-clsq-962392',
      ].map((id) => ({ _key: k(`q-${id}`), _type: 'reference', _ref: id })),
    },
    {
      _key: k('after'),
      _type: 'vcCards',
      tone: 'plain',
      anchor: 'after-procurement',
      head: head('After procurement', 'Get the most out of *your new software*'),
      layout: 'cards3',
      items: [
        ['monday.com implementation', 'Single-team builds through enterprise multi-department deployments.', '/monday-implementation-consultants'],
        ['Atlassian consulting', 'Jira, Confluence, and JSM implementation and migration.', '/atlassian-consulting'],
        ['HubSpot consulting', 'CRM implementation and cross-platform migration.', '/hubspot-consulting'],
        ['Training & enablement', 'Team workshops and structured enablement programs.', '/training'],
        ['AI Capability Assessment', 'Our flagship diagnostic and board-ready AI roadmap.', '/ai-capability-assessment'],
      ].map(([title, body, href], i) => ({ _key: k(`after-${i}`), _type: 'vcItem', title, body, href, linkLabel: 'Learn more' })),
    },
    {
      _key: k('booking'),
      _type: 'vcBooking',
      badge: 'Book a time',
      heading: 'Book a licence procurement *consultation.*',
      lead: 'Tell us what you pay for and when it renews. Fees are agreed in writing after a consultation, before any work starts.',
    },
    {
      _key: k('faq'),
      _type: 'vcFaq',
      tone: 'plain',
      badge: 'FAQ',
      heading: 'Questions about licence procurement',
      tabs: [
        {
          _key: k('faq-tab'),
          _type: 'vcFaqTab',
          label: 'Licence procurement',
          items: faqDocs.map((d, i) => ({ _key: k(`faq-ref-${i}`), _type: 'reference', _ref: d._id })),
        },
      ],
    },
    {
      _key: k('closing'),
      _type: 'vcClosing',
      badge: 'Licence procurement',
      heading: 'Make licensing *a managed process*',
      lead: 'Audit, sourcing, negotiation and every renewal after that, handled by one team.',
      ctas: [cta('close-book', 'Book a consultation', '#book', 'inverse', true), cta('close-call', 'Call +61 483 955 931', 'tel:+61483955931', 'ghost', false)],
    },
  ],
}

async function main() {
  const docs = [...faqDocs, page]
  if (!APPLY) {
    console.log(JSON.stringify(docs, null, 2))
    console.log(`\nDry run: ${faqDocs.length} FAQ items + ${PAGE_ID}. Add --apply to write.`)
    return
  }
  const quoteIds = (page.sections.find((s) => s._type === 'vcProof') as { quotes: { _ref: string }[] }).quotes.map((q) => q._ref)
  const found = await writeClient.fetch<string[]>(`*[_id in $ids]._id`, { ids: quoteIds })
  const missing = quoteIds.filter((id) => !found.includes(id))
  if (missing.length) throw new Error(`Missing vcQuote documents: ${missing.join(', ')}`)
  const tx = writeClient.transaction()
  for (const d of docs) tx.createOrReplace(d as { _id: string; _type: string })
  await tx.commit()
  console.log(`Wrote ${faqDocs.length} FAQ items and ${PAGE_ID}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
