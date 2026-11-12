/**
 * Six new Version C industry pages (12 Nov 2026), built on the approved
 * healthcare layout: transport & logistics, hospitality/tourism/events,
 * technology & SaaS, energy & utilities, media & entertainment, legal.
 *
 *   npx tsx scripts/vc/add-industries-2026-11.ts           # dry run: prints what it would write
 *   npx tsx scripts/vc/add-industries-2026-11.ts --apply   # uploads assets, writes FAQs + pages
 *   npx tsx scripts/vc/add-industries-2026-11.ts --apply --menu   # also adds the six menu items (after deploy)
 *
 * Idempotent: documents use fixed ids and createOrReplace, uploads are
 * deduplicated by Sanity on content hash. Proof is only ever real: logos are
 * clients on the logo board, case studies and quotes are the shared vcCase /
 * vcQuote documents, use cases come from public/data/ai-use-cases by id. A page
 * with no fitting proof leaves the section out (legal has no logo wall, case
 * studies or use-case catalogue).
 */
import * as fs from 'fs'
import * as path from 'path'
import { randomBytes } from 'crypto'
import { writeClient } from '../sanity-migrate/lib'

const APPLY = process.argv.includes('--apply')
const ROOT = path.resolve(__dirname, '..', '..')
const ASSETS = path.join(__dirname, 'assets', 'industries-2026-11')

const k = () => randomBytes(6).toString('hex')
const img = (ref: string, alt?: string) => ({ _type: 'image', ...(alt ? { alt } : {}), asset: { _type: 'reference', _ref: ref } })
const ref = (id: string) => ({ _key: k(), _type: 'reference', _ref: id })
const head = (badge: string, heading: string, lead: string) => ({ _type: 'vcHead', badge, heading, lead })
const cta = (label: string, href: string, style: string, arrow: boolean) => ({ _type: 'vcCta', label, href, style, arrow })

// Logos already in Sanity (from the existing logo walls and case studies).
const L: Record<string, string> = {
  'Transport for NSW': 'image-1373d31c6133c361727f261eb887b642fea2f596-200x216-png',
  'Avanti West Coast': 'image-d1bbc0b2c6c58c2813cbb17cc6ac270abd4cc7da-420x190-png',
  Scania: 'image-97d795788769cfde2aa91456cd6a504a22835dc2-300x81-png',
  'Craters & Freighters': 'image-95c4ea835ea11aec0c6b996a58e2ffcb8c089f60-420x98-png',
  'Joloda Hydraroll': 'image-768852ba77ab593f0c2001377126a1b512ffcc2d-390x160-png',
  'Star Aviation': 'image-2bd52e6caf76531100ba4572788f6fb4b3a0a471-400x138-png',
  'Tourism Australia': 'image-638cb18a6a11fa52bdd179d72e7cece0cc2c3ef8-352x143-png',
  'Tourism NT': 'image-cb5de1aa82b86f22541c7028689450bcde7b5aa2-444x168-png',
  Ticketek: 'image-72b0695db4c0ae672e433e517597539412c8cb70-300x124-png',
  'Retail Food Group': 'image-d61cd010ed02f71515eb4c6f81f3a3d7eee55add-400x195-png',
  'At-Sunrice GlobalChef Academy': 'image-33bd0f40a497c2f6bc4d86d559bf5dd90d57dca2-400x242-png',
  NRL: 'image-a14b2b3bb2211c8cd83892f3b83a3e365b127257-200x255-png',
  Telstra: 'image-03e39019b1fc471111dbb3a588f4d1bfd2c430c5-400x110-png',
  Carsales: 'image-7175249d9f6f1cf1d64916a003d9fb5899e903e4-300x109-png',
  Ledgy: 'image-08b31ad5b0ea141d8fc8597b98481a8e44f0f91c-400x93-png',
  FibreconX: 'image-02a4bc03205f930e48a950a7e0d15d6bde07808d-256x39-png',
  'Propel ICT': 'image-b3eb151099888ea624d8d87c513138784c30e09c-900x212-png',
  Focaldata: 'image-26434dd41f656d3be00bca6d1fb3909784241990-400x66-png',
  Givergy: 'image-4e5dfb4cc6b0e9f78a582aefb5e308a03e8f25ed-420x147-png',
  EnergyCo: 'image-f32833ecf0233362b454f7f6e9c0ce17330c36d1-400x110-png',
  'Elemental Energy': 'image-13330d63107a58d4f6e998c11f987a7dea676472-400x101-png',
  'Uprise Electric Company': 'image-82260c246bfb67e5da2c857dc0b7147db3d5e009-400x105-png',
  'Anelec Electrical Group': 'image-7b41e8a87e59e3c216f85950fc2a63d97c651321-256x71-png',
  'Meko Electrical Services': 'image-639d70219e85807f464ea254f04024aa6a782a3c-524x498-png',
  'High Voltage Distribution Contracting': 'image-79fd8ce19259142c0e0df9dc996771aed44629f9-900x374-png',
  'Elmya EPC': 'image-41e0480e36fa2760552ff8294fb3de4faa7a204a-891x290-png',
  SBS: 'image-d8262047983fc2d62f68556e59dfd20274bb543f-300x205-png',
  'DailyMail.com Australia': 'image-9b98830376f1a1f101933b251bd499edd3d0f463-899x185-png',
  'WTFN Entertainment': 'image-65b306665ba500e1275b7a7de5f468006633cb47-400x271-png',
  'White Door Studios': 'image-86f1bc8b7f42386706bdd9e9c0c57ea4e2935b63-150x150-png',
  Ogilvy: 'image-9d0e2d2b8231b2fc504ee69644d12b59ec35387e-700x272-png',
  Substrakt: 'image-d8b5c4aa8ca9354ca49a5a5b20e4f0b4358f9a31-93x144-png',
  'Double Tap Agency': 'image-dbd2aea9ec19a5bc33cb0a2367a22c20be0c22e0-900x96-png',
  'Nectar Creative Communications': 'image-cbd62052d12f05504e58e05d58615532bb8dade9-170x35-png',
  'Envision Agency': 'image-6f86a05af905ef730effdd1875ccc2af9a16cf26-900x188-png',
}
// Logos new to Sanity, from the monday logo board (5025525962), trimmed.
const NEW_LOGOS: Record<string, string> = {
  'Go-Ahead': 'logo-go-ahead.png',
  Freightquip: 'logo-freightquip.png',
  Mandata: 'logo-mandata.png',
  Construsoft: 'logo-construsoft.png',
  EVT: 'logo-evt.png',
  'Travel Beyond Group': 'logo-travel-beyond-group.png',
  // Only white versions existed (case-study cards); recoloured to ink for the light wall.
  'Holyhead Towing': 'logo-holyhead-towing.png',
  'Pneuma Group': 'logo-pneuma-group.png',
  'Kinetic Solutions': 'logo-kinetic-solutions.png',
  'SHS Power': 'logo-shs-power.png',
  'Everlight Solar': 'logo-everlight-solar.png',
  'Pritchard Group': 'logo-pritchard-group.png',
  'Admedia': 'logo-admedia.png',
}

// Real screenshots already used on other Version C pages.
const SHOTS = {
  delivery: { ref: 'image-44b015de6adc011fc52c9859acecc01275eeb636-1068x664-png', alt: 'Delivery board' },
  roadmap: { ref: 'image-f0f0f3f14e87e84c18fdd555644c4af2b8590ec1-1068x664-png', alt: 'Roadmap with AI agents' },
  installs: { ref: 'image-b206c34fc1f63df6fa5a98eb447326efbefa0815-1400x746-jpg', alt: 'Installation dashboard' },
  portfolio: { ref: 'image-ee6e3dd2efccf68415ceed4626579c1a93cfb22a-673x339-avif', alt: 'Job portfolio board' },
  calendar: { ref: 'image-a76b970eeb3fdd457cc07741d37b311e4469f2d1-400x277-jpg', alt: 'Content calendar' },
  requests: { ref: 'image-c97fff8eac24b69b51346ec1385dc58262c930d2-400x273-jpg', alt: 'Creative requests' },
  time: { ref: 'image-734928aa65506c0d341099e291721eb0298f928c-1865x1060-png', alt: 'Time tracking by client' },
  pipeline: { ref: 'image-945f67177b965f9557345718309c2a275d1e3d8f-1878x1233-avif', alt: 'Pipeline with AI health' },
}

const AI_GOVERNANCE_FAQS = [0, 1, 2, 3, 4, 5].map((i) => `faqItem-migrated-ai-consulting-governance-and-compliance-${i}`)
const MONDAY_CRM_FAQS = ['faq-bc75e24da0921cc2', 'faq-690f3e2e75d2b4a8', 'faq-3ad70450cd10002a', 'faq-4af9d6731b0ff6c2', 'faq-5e76927a5e886666', 'faq-e78d65a23417f4ac']

type Step = [title: string, body: string]
type Shot = { shot: keyof typeof SHOTS; title: string; body: string }
type Spec = {
  slug: string
  path: string
  name: string // FAQ category + tab label
  seoTitle: string
  seoDescription: string
  hero: { badge: string; heading: string; lead: string; art: string }
  logos?: { heading: string; lead: string; names: string[] }
  approach: { heading: string; lead: string; steps: Step[] }
  cases?: { heading: string; lead: string; ids: string[] }
  audit: { heading: string; text: string; cta: string }
  build: { heading: string; lead: string; items: Step[] }
  proofLead: string
  quotes: string[]
  products?: { heading: string; lead: string; items: Shot[] }
  useCases?: { heading: string; ids: string[] }
  booking: { calTitle: string; heading: string; lead: string }
  faqs: Step[]
  closing: { heading: string; lead: string; cta: string }
}

const PAGES: Spec[] = [
  {
    slug: 'transport-logistics',
    path: '/industries/transport-logistics',
    name: 'Transport & logistics',
    seoTitle: 'Transport & Logistics Workflow & AI Solutions | Fruition: Dispatch, Fleet & Freight',
    seoDescription:
      'Fruition builds dispatch, fleet, freight and depot workflows on monday.com with governed AI for transport and logistics operators across Australia, the UK and the US.',
    hero: {
      badge: 'Transport & logistics',
      heading: 'Every job, vehicle and delivery *on one board.*',
      lead: 'Dispatch, fleet, freight and depot workflows for operators across Australia, the UK and the US, with automation and governed AI where the manual handoffs live.',
      art: 'hero-transport.webp',
    },
    logos: {
      heading: 'Transport and logistics operators *that work with Fruition.*',
      lead: 'Rail, bus, freight, fleet and aviation teams running operations we built.',
      names: ['Transport for NSW', 'Go-Ahead', 'Avanti West Coast', 'Scania', 'Craters & Freighters', 'Freightquip', 'Joloda Hydraroll', 'Holyhead Towing', 'Star Aviation', 'Mandata'],
    },
    approach: {
      heading: 'Built around *the dispatch board.*',
      lead: 'We start where the day is planned and work outwards to customers, crews and finance.',
      steps: [
        ['Map the job lifecycle', 'From booking or order to proof of delivery and invoice, we map every status change before we build a board.'],
        ['Connect the systems you keep', 'TMS, telematics, accounting and customer portals feed one operational view instead of five spreadsheets.'],
        ['Automate the handoffs', 'Allocation, exceptions, customer updates and compliance reminders run on rules, so dispatchers manage by exception.'],
      ],
    },
    cases: { heading: 'Transport & logistics *case studies.*', lead: 'Two client builds and what they changed.', ids: ['vcCase-craters-and-freighters', 'vcCase-holyhead-towing'] },
    audit: { heading: 'Find the hours *lost between depots.*', text: 'A free 30-minute review of your dispatch, fleet and customer update workflows.', cta: 'Review my operations' },
    build: {
      heading: 'Transport & logistics *systems.*',
      lead: 'Four builds around the work that moves freight and people.',
      items: [
        ['Dispatch and job tracking', 'Bookings, allocation and job status in one place, with proof of delivery and exceptions flagged as they happen.'],
        ['Fleet and asset maintenance', 'Service schedules, defects, registrations and inspections tracked per vehicle, with reminders before anything lapses.'],
        ['Customer and quote pipeline', 'Enquiries, quotes and contracts in a CRM that hands won work straight to operations.'],
        ['Compliance and safety', 'Driver records, incident reports, audits and chain-of-responsibility evidence kept in one auditable system.'],
      ],
    },
    proofLead: 'Operations leaders on what changed after we mapped the process first.',
    quotes: ['vcQuote-jason-doan-holt-cat', 'vcQuote-anthony-rowson', 'vcQuote-lorenzo-tejada-orrell-clsq', 'vcQuote-ron-amaram-risk-2-solutions', 'vcQuote-allie-swindlehurst-falkbuilt', 'vcQuote-brandon-lee-horridge-bl-air-conditioning'],
    useCases: { heading: 'Transport & logistics *use cases.*', ids: ['uc-007d042e', 'uc-7e499b5e', 'uc-083b4d2b', 'uc-2b0b8e67', 'uc-a0741f6f', 'uc-00be0861'] },
    booking: { calTitle: 'Transport & logistics consultation', heading: 'Book a transport & logistics *consultation.*', lead: "We'll map your dispatch, fleet and customer workflows live on the call." },
    faqs: [
      ['Can monday.com run dispatch for a transport or logistics business?', 'Yes. We build dispatch boards with job allocation, status tracking, proof of delivery and exception alerts. For complex routing, monday.com sits alongside your TMS or routing tool and gives operations, customer service and finance one shared view of every job.'],
      ['Does it integrate with our TMS, telematics or accounting system?', 'Usually, yes. We connect TMS platforms, telematics feeds, Xero, MYOB, NetSuite and customer portals through native integrations, Make or n8n, so job data moves without rekeying.'],
      ['Can we track fleet maintenance and compliance?', 'Yes. Each vehicle or asset gets a record with service intervals, defects, registrations and inspections, plus automated reminders and an audit trail for chain-of-responsibility and safety reviews.'],
      ['Where does AI help in transport and logistics?', 'Reading delivery dockets and booking emails, drafting customer updates, summarising incidents and flagging late jobs early. Every AI step has a human review gate and runs inside the governance rules we set with you.'],
      ['How long does a transport or logistics implementation take?', 'A focused dispatch or fleet build typically goes live in four to eight weeks. Larger programmes that connect several depots and systems run in phases, each one usable on its own.'],
    ],
    closing: { heading: 'Fewer calls asking *where the job is.*', lead: "Book a 30-minute call. We'll map your dispatch, fleet and customer workflows and what can be automated.", cta: 'Book a transport consultation' },
  },
  {
    slug: 'hospitality-tourism-events',
    path: '/industries/hospitality-tourism-events',
    name: 'Hospitality, tourism & events',
    seoTitle: 'Hospitality, Tourism & Events Workflow & AI Solutions | Fruition',
    seoDescription:
      'Fruition builds event delivery, campaign, venue and multi-site operations workflows on monday.com with governed AI for hospitality, tourism and events teams across Australia, the UK and the US.',
    hero: {
      badge: 'Hospitality, tourism & events',
      heading: 'Run every venue, campaign and event *from one plan.*',
      lead: 'Event delivery, tourism campaigns, venue operations and multi-site hospitality workflows, with automation and governed AI built in from the first board.',
      art: 'hero-hospitality.webp',
    },
    logos: {
      heading: 'Hospitality, tourism and events teams *that work with Fruition.*',
      lead: 'Tourism bodies, ticketing, venue, travel and hospitality groups running workflows we built.',
      names: ['Tourism Australia', 'Tourism NT', 'Ticketek', 'EVT', 'Travel Beyond Group', 'Retail Food Group', 'At-Sunrice GlobalChef Academy', 'Pneuma Group', 'Givergy', 'NRL'],
    },
    approach: {
      heading: 'Planned around *the guest and the date.*',
      lead: 'Events and seasons have fixed deadlines, so we build backwards from them.',
      steps: [
        ['Map the run sheet', 'From enquiry or campaign brief to the day itself and the wrap-up, we map every task, owner and dependency.'],
        ['One view across sites and teams', 'Venues, kitchens, marketing and suppliers work from the same plan instead of separate inboxes.'],
        ['Automate the repeatable', 'Approvals, supplier reminders, guest communications and post-event reporting run on rules every time.'],
      ],
    },
    cases: { heading: 'Hospitality, tourism & events *case studies.*', lead: 'Two client builds and what they changed.', ids: ['vcCase-tourism-nt', 'vcCase-at-sunrice-globalchef-academy'] },
    audit: { heading: 'Take the scramble *out of every event.*', text: 'A free 30-minute review of your event, campaign and venue workflows.', cta: 'Review my workflows' },
    build: {
      heading: 'Hospitality, tourism & events *systems.*',
      lead: 'Four builds around the work behind every guest experience.',
      items: [
        ['Event and project delivery', 'Run sheets, supplier bookings, budgets and approvals for every event, from enquiry to wrap-up report.'],
        ['Campaign and partner management', 'Tourism and destination campaigns with briefs, budgets, partner approvals and results in one place.'],
        ['Multi-site operations', 'Openings, maintenance, audits and staff requests across venues, with each site manager seeing their own queue.'],
        ['Bookings and guest CRM', 'Enquiries, quotes, group bookings and follow-ups in a CRM connected to your booking or ticketing system.'],
      ],
    },
    proofLead: 'Tourism, events and operations leaders on what changed after we mapped the process first.',
    quotes: ['vcQuote-emily-hill-tourism-northern-territory', 'vcQuote-kerrie-e', 'vcQuote-mairhead-mckinley-givergy', 'vcQuote-jade-wood-popology', 'vcQuote-lorenzo-tejada-orrell-clsq', 'vcQuote-teddy-mangion'],
    useCases: { heading: 'Hospitality, tourism & events *use cases.*', ids: ['uc-25485fd3', 'uc-addd445b', 'uc-37bf01c7', 'uc-455c5221', 'uc-369479da', 'uc-a1df8a9c'] },
    booking: { calTitle: 'Hospitality, tourism & events consultation', heading: 'Book a hospitality & events *consultation.*', lead: "We'll map your event, campaign and venue workflows live on the call." },
    faqs: [
      ['Can monday.com manage event delivery end to end?', 'Yes. We build event boards with run sheets, supplier and venue bookings, budgets, approvals and post-event reporting, and save the whole structure as a template so the next event starts already organised.'],
      ['Does it work for tourism and destination marketing teams?', 'Yes. Tourism bodies use monday.com for campaign briefs, partner approvals, budget tracking and reporting. We have built these workflows for state and national tourism organisations.'],
      ['Can we manage several venues or sites in one system?', 'Yes. Each venue gets its own view of openings, maintenance, audits and requests, while head office sees the whole portfolio, with permissions so each team only sees what it needs.'],
      ['Does it connect to our booking, ticketing or POS systems?', 'In most cases. We connect booking engines, ticketing platforms, POS and accounting systems through native integrations, Make or n8n, so bookings and sales data flow into operations and reporting.'],
      ['Where does AI help in hospitality and events?', 'Drafting guest and supplier emails, summarising feedback and reviews, turning briefs into task lists and producing event reports. Each AI step runs with human review and inside agreed governance rules.'],
    ],
    closing: { heading: 'Every event *runs like the last good one.*', lead: "Book a 30-minute call. We'll map your event, campaign and venue workflows and what can be automated.", cta: 'Book a hospitality consultation' },
  },
  {
    slug: 'technology-saas',
    path: '/industries/technology-saas',
    name: 'Technology & SaaS',
    seoTitle: 'Technology & SaaS Workflow & AI Solutions | Fruition: Delivery, CRM & Support',
    seoDescription:
      'Fruition builds product delivery, sales pipeline, onboarding and support workflows on monday.com with governed AI for software, SaaS and technology companies across Australia, the UK and the US.',
    hero: {
      badge: 'Technology & SaaS',
      heading: 'From first demo to shipped release, *one connected system.*',
      lead: 'Product delivery, sales pipeline, customer onboarding and support workflows for software and technology companies, connected to the tools engineering already uses.',
      art: 'hero-technology.webp',
    },
    logos: {
      heading: 'Technology companies *that work with Fruition.*',
      lead: 'Software, platform, telecoms and data businesses running workflows we built.',
      names: ['Telstra', 'Carsales', 'Ledgy', 'Kinetic Solutions', 'Construsoft', 'Givergy', 'Mandata', 'FibreconX', 'Propel ICT', 'Focaldata'],
    },
    approach: {
      heading: 'Revenue and delivery *on the same page.*',
      lead: 'Sales, onboarding, product and support share one record of every customer.',
      steps: [
        ['Map the customer lifecycle', 'From lead and trial to onboarding, renewal and support, we map each handoff before we build anything.'],
        ['Connect the dev stack', 'GitHub, Jira, HubSpot and billing tools feed monday.com, so product and customer teams see the same status.'],
        ['Automate the handoffs', 'Closed deals open onboarding projects, tickets reach the right squad and renewals surface before they lapse.'],
      ],
    },
    cases: { heading: 'Technology & SaaS *case studies.*', lead: 'Two client builds and what they changed.', ids: ['vcCase-givergy', 'vcCase-kinetic-solutions'] },
    audit: { heading: 'Close the gap *between sales and delivery.*', text: 'A free 30-minute review of your pipeline, onboarding and support workflows.', cta: 'Review my workflows' },
    build: {
      heading: 'Technology & SaaS *systems.*',
      lead: 'Four builds around how software companies sell, ship and support.',
      items: [
        ['Product and release delivery', 'Roadmaps, sprints and releases on monday dev, connected to GitHub so product and delivery share one view.'],
        ['Sales pipeline and CRM', 'Leads, trials, deals and renewals in monday CRM or HubSpot, with forecasting the whole leadership team trusts.'],
        ['Customer onboarding', 'Implementation projects that open automatically when a deal closes, with milestones customers can see.'],
        ['Support and service desk', 'Tickets, SLAs and escalations routed to the right team, with a knowledge base and AI-drafted replies.'],
      ],
    },
    proofLead: 'Founders, delivery and operations leads on what changed after we mapped the process first.',
    quotes: ['vcQuote-mairhead-mckinley-givergy', 'vcQuote-louis-stenmark-windfall-bio', 'vcQuote-lorenzo-tejada-orrell-clsq', 'vcQuote-ron-amaram-risk-2-solutions', 'vcQuote-teddy-mangion', 'vcQuote-tedd-long-mcag-inc'],
    products: {
      heading: 'Delivery and roadmap, *organised.*',
      lead: 'Two of the views product and delivery teams use.',
      items: [
        { shot: 'delivery', title: 'Delivery board', body: 'Work moved from ready to done, with priority and effort on every card.' },
        { shot: 'roadmap', title: 'Roadmap with AI agents', body: 'A Gantt roadmap with AI agents handling research, scheduling and prioritisation alongside the team.' },
      ],
    },
    useCases: { heading: 'Technology & SaaS *use cases.*', ids: ['uc-91dfec98', 'uc-708a0607', 'uc-1d2dca2f', 'uc-0b49a5e8', 'uc-e886c4fd', 'uc-8ae1c44f'] },
    booking: { calTitle: 'Technology & SaaS consultation', heading: 'Book a technology & SaaS *consultation.*', lead: "We'll map your pipeline, onboarding and delivery workflows live on the call." },
    faqs: [
      ['Is monday.com a good fit for software and SaaS companies?', 'Yes. monday dev covers roadmaps, sprints and releases, monday CRM covers pipeline and renewals, and monday service covers support, all on one platform. Many technology companies use it to connect teams that otherwise work in separate tools.'],
      ['Can monday.com replace or work alongside Jira?', 'Both. Some teams move engineering onto monday dev; others keep Jira and sync it with monday.com, so product, customer success and leadership see delivery status without logging into Jira.'],
      ['Does it integrate with GitHub, HubSpot and our billing tools?', 'Yes. We connect GitHub, Jira, HubSpot, Stripe, Xero and similar tools through native integrations, Make or n8n, so deals, tickets and releases stay in sync.'],
      ['How do you handle customer onboarding for SaaS?', 'A closed deal creates an onboarding project from a template, with milestones, owners and a customer-facing view. Delays surface early, and the account hands to customer success with its full history.'],
      ['Where does AI help technology companies?', 'Drafting support replies from your knowledge base, summarising customer calls, triaging tickets and turning feature requests into structured backlog items. Every step runs with human review and governance controls.'],
    ],
    closing: { heading: 'Ship faster *without losing the customer.*', lead: "Book a 30-minute call. We'll map your pipeline, onboarding and delivery workflows and what can be automated.", cta: 'Book a technology consultation' },
  },
  {
    slug: 'energy-utilities',
    path: '/industries/energy-utilities',
    name: 'Energy & utilities',
    seoTitle: 'Energy & Utilities Workflow & AI Solutions | Fruition: Field Work, Projects & Compliance',
    seoDescription:
      'Fruition builds field service, project delivery, asset and compliance workflows on monday.com with governed AI for energy, utilities and electrical contractors across Australia, the UK and the US.',
    hero: {
      badge: 'Energy & utilities',
      heading: 'Field work, projects and compliance *in one system.*',
      lead: 'Workflows for energy companies, utilities and electrical contractors: field jobs, network and infrastructure projects, asset maintenance and the compliance evidence behind them.',
      art: 'hero-energy.webp',
    },
    logos: {
      heading: 'Energy and utilities teams *that work with Fruition.*',
      lead: 'Energy agencies, energy services firms and electrical contractors running workflows we built.',
      names: ['EnergyCo', 'SHS Power', 'Everlight Solar', 'Elemental Energy', 'Elmya EPC', 'Uprise Electric Company', 'Anelec Electrical Group', 'Meko Electrical Services', 'High Voltage Distribution Contracting', 'Pritchard Group'],
    },
    approach: {
      heading: 'Safety and compliance *built in, not bolted on.*',
      lead: 'Regulated work needs evidence at every step, so we design for the audit first.',
      steps: [
        ['Map the job and the evidence', 'From request or tender to commissioning and sign-off, we map each step and the records it must leave behind.'],
        ['Office and field on one record', 'Crews update jobs on mobile, so the office sees progress, photos and test results without chasing paperwork.'],
        ['Automate the reminders', 'Certifications, inspections, permits and maintenance intervals trigger tasks before they fall due.'],
      ],
    },
    cases: { heading: 'Energy & utilities *case studies.*', lead: 'Two client builds and what they changed.', ids: ['vcCase-shs-power', 'vcCase-pritchard-group'] },
    audit: { heading: 'Get crews out of *the paperwork.*', text: 'A free 30-minute review of your field, project and compliance workflows.', cta: 'Review my workflows' },
    build: {
      heading: 'Energy & utilities *systems.*',
      lead: 'Four builds around regulated field and project work.',
      items: [
        ['Field service and job management', 'Jobs scheduled, dispatched and completed on mobile, with photos, test results and sign-off captured on site.'],
        ['Project and programme delivery', 'Network, infrastructure and installation projects with schedules, budgets, variations and stage gates.'],
        ['Asset and maintenance tracking', 'Every asset with its service history, inspection dates and defects, and reminders before anything falls due.'],
        ['Compliance and safety records', 'Licences, permits, SWMS, incidents and audits kept in one place, ready for clients and regulators.'],
      ],
    },
    proofLead: 'Operations and project leaders on what changed after we mapped the process first.',
    quotes: ['vcQuote-luke-reddin-clean-power-australia', 'vcQuote-brandon-lee-horridge-bl-air-conditioning', 'vcQuote-allie-swindlehurst-falkbuilt', 'vcQuote-jason-doan-holt-cat', 'vcQuote-ron-amaram-risk-2-solutions', 'vcQuote-lorenzo-tejada-orrell-clsq'],
    products: {
      heading: 'Jobs and crews, *organised.*',
      lead: 'Two of the views operations teams and crews use.',
      items: [
        { shot: 'installs', title: 'Jobs dashboard', body: 'Jobs scheduled, in progress and complete, with the numbers the office and crews both work from.' },
        { shot: 'portfolio', title: 'Job portfolio', body: 'Every installation and maintenance job with its stage, crew and dates.' },
      ],
    },
    useCases: { heading: 'Energy & utilities *use cases.*', ids: ['uc-40455c6e', 'uc-9aa72b78', 'uc-8ba6a510', 'uc-0458ce90', 'uc-cb677f2c', 'uc-5db8dcfa'] },
    booking: { calTitle: 'Energy & utilities consultation', heading: 'Book an energy & utilities *consultation.*', lead: "We'll map your field, project and compliance workflows live on the call." },
    faqs: [
      ['Can monday.com manage field work for energy and electrical contractors?', 'Yes. Crews receive and update jobs on the monday.com mobile app, capturing photos, test results and sign-off on site, while the office sees progress in real time and invoices from completed jobs.'],
      ['Can it hold our compliance and safety records?', 'Yes. We build registers for licences, permits, SWMS, inspections, incidents and audits, with automated reminders before anything expires and an audit trail for clients and regulators.'],
      ['How does this differ from your solar and renewables work?', 'Our solar page covers residential and commercial solar pipelines, from sale to grid sign-off. This page covers the wider sector: energy services, utilities, network and infrastructure projects, and electrical contractors.'],
      ['Does it integrate with our job management, ERP or accounting system?', 'Usually, yes. We connect ERPs, accounting systems such as Xero, MYOB and NetSuite, and field tools through native integrations, Make or n8n, so job and cost data is entered once.'],
      ['Where does AI help in energy and utilities?', 'Reading job sheets and test certificates, drafting client reports, summarising incidents and flagging overdue inspections. Each AI step has human review and runs inside the governance rules we agree with you.'],
    ],
    closing: { heading: 'Every job *signed off and on record.*', lead: "Book a 30-minute call. We'll map your field, project and compliance workflows and what can be automated.", cta: 'Book an energy consultation' },
  },
  {
    slug: 'media-entertainment',
    path: '/industries/media-entertainment',
    name: 'Media & entertainment',
    seoTitle: 'Media & Entertainment Workflow & AI Solutions | Fruition: Production, Content & Clients',
    seoDescription:
      'Fruition builds production, content pipeline, rights and client delivery workflows on monday.com with governed AI for broadcasters, publishers, studios and agencies across Australia, the UK and the US.',
    hero: {
      badge: 'Media & entertainment',
      heading: 'Every production and deadline *in one pipeline.*',
      lead: 'Production, content, editorial and client delivery workflows for broadcasters, publishers, studios and agencies, with automation and governed AI where the deadlines bite.',
      art: 'hero-media.webp',
    },
    logos: {
      heading: 'Media and entertainment teams *that work with Fruition.*',
      lead: 'Broadcasters, publishers, studios and agencies running workflows we built.',
      names: ['SBS', 'DailyMail.com Australia', 'WTFN Entertainment', 'White Door Studios', 'Ogilvy', 'Admedia', 'Substrakt', 'Double Tap Agency', 'Nectar Creative Communications', 'Envision Agency'],
    },
    approach: {
      heading: 'Built around *the deadline.*',
      lead: 'Media runs on dates that do not move, so the system has to show what is at risk early.',
      steps: [
        ['Map the production pipeline', 'From pitch or brief to delivery and publication, we map each stage, approval and asset before we build.'],
        ['One source for every asset', 'Briefs, scripts, edits, approvals and final files sit against the job, not scattered across inboxes and drives.'],
        ['Automate approvals and updates', 'Review rounds, client sign-off, scheduling and status updates run on rules, so producers manage by exception.'],
      ],
    },
    cases: { heading: 'Media & entertainment *case studies.*', lead: 'Two client builds and what they changed.', ids: ['vcCase-admedia', 'vcCase-popology'] },
    audit: { heading: 'Stop losing hours *to review rounds.*', text: 'A free 30-minute review of your production, content and approval workflows.', cta: 'Review my workflows' },
    build: {
      heading: 'Media & entertainment *systems.*',
      lead: 'Four builds around how content gets made and delivered.',
      items: [
        ['Production management', 'Shoots, edits and deliverables scheduled across crews and suppliers, with budgets and milestones per production.'],
        ['Editorial and content pipeline', 'Story and content calendars from pitch to publication, with owners, deadlines and channel scheduling.'],
        ['Review and approvals', 'Versioned review rounds with client and legal sign-off captured against each asset.'],
        ['Client and commercial pipeline', 'Pitches, proposals, contracts and billing in one CRM, connected to the productions they create.'],
      ],
    },
    proofLead: 'Creative, production and marketing leaders on what changed after we mapped the process first.',
    quotes: ['vcQuote-jade-wood-popology', 'vcQuote-emily-hill-tourism-northern-territory', 'vcQuote-mairhead-mckinley-givergy', 'vcQuote-kerrie-e', 'vcQuote-teddy-mangion', 'vcQuote-jemma-ryan'],
    products: {
      heading: 'Content and requests, *organised.*',
      lead: 'Two of the views content and production teams use.',
      items: [
        { shot: 'calendar', title: 'Content calendar', body: 'Posts, articles and campaigns planned on one calendar, with owners and status.' },
        { shot: 'requests', title: 'Production requests', body: 'Briefs submitted through a form and tracked to delivery, so requests stop arriving by email.' },
      ],
    },
    useCases: { heading: 'Media & entertainment *use cases.*', ids: ['uc-98fe4634', 'uc-0330a1a3', 'uc-d84d0144', 'uc-95c20fce', 'uc-4f658e2d', 'uc-3cc9fe7a'] },
    booking: { calTitle: 'Media & entertainment consultation', heading: 'Book a media & entertainment *consultation.*', lead: "We'll map your production, content and approval workflows live on the call." },
    faqs: [
      ['Can monday.com manage video and content production?', 'Yes. We build production boards covering pre-production, shoots, edits and delivery, with crew and supplier scheduling, budgets and milestones, saved as templates for each production type.'],
      ['How do review and approval rounds work?', 'Each asset carries its versions and review rounds, with client, legal or editorial sign-off captured on the item. Automations chase overdue reviews and move work on once it is approved.'],
      ['Can it handle an editorial or publishing calendar?', 'Yes. Broadcasters and publishers use monday.com for story pipelines and content calendars, from pitch to publication, with channel scheduling and owners for each piece.'],
      ['Does it integrate with Frame.io, Adobe or our DAM?', 'In most cases. We connect review tools, Adobe Creative Cloud, cloud storage and DAM platforms through native integrations, Make or n8n, so files and approvals stay linked to the job.'],
      ['Where does AI help media and entertainment teams?', 'Turning briefs into production plans, summarising feedback rounds, drafting copy variations and tagging assets. Every AI step has human review and follows the governance rules we agree with you.'],
    ],
    closing: { heading: 'Hit every deadline *without the chase.*', lead: "Book a 30-minute call. We'll map your production, content and approval workflows and what can be automated.", cta: 'Book a media consultation' },
  },
  {
    slug: 'legal',
    path: '/industries/legal',
    name: 'Legal',
    seoTitle: 'Legal Workflow & AI Solutions | Fruition: Matters, Intake & Practice Operations',
    seoDescription:
      'Fruition builds matter management, client intake, deadline and practice operations workflows on monday.com with governed AI for law firms and in-house legal teams across Australia, the UK and the US.',
    hero: {
      badge: 'Legal',
      heading: 'Matters, deadlines and clients *under control.*',
      lead: 'Matter tracking, client intake, deadline management and practice operations for law firms and in-house legal teams, with governed AI that keeps privileged work private.',
      art: 'hero-legal.webp',
    },
    approach: {
      heading: 'Confidential *by design.*',
      lead: 'Legal work carries privilege and deadlines, so permissions and reminders come first.',
      steps: [
        ['Map the matter lifecycle', 'From enquiry and conflict check to engagement, work in progress and close, we map each step and who may see it.'],
        ['Permissions before features', 'Matter-level access, audit logging and data residency are set up before a single board goes live.'],
        ['Automate the deadlines', 'Court dates, limitation periods and client follow-ups create tasks and reminders automatically, with escalation.'],
      ],
    },
    audit: { heading: 'Win back hours *from practice admin.*', text: 'A free 30-minute review of your intake, matter and deadline workflows.', cta: 'Review my workflows' },
    build: {
      heading: 'Legal *systems.*',
      lead: 'Four builds around the work that surrounds legal advice.',
      items: [
        ['Matter management', 'Every matter with its parties, stage, tasks, documents and key dates, and a dashboard of what needs attention.'],
        ['Client intake and conflicts', 'Web enquiries, conflict checks and engagement letters handled as one flow, so new matters open cleanly.'],
        ['Deadlines and court dates', 'Key dates captured once and turned into reminders and escalations, so nothing is missed.'],
        ['In-house legal requests', 'A front door for contract reviews and legal requests from the business, with SLAs and reporting.'],
      ],
    },
    proofLead: 'Leaders in services firms on what changed after we mapped the process first.',
    quotes: ['vcQuote-ron-amaram-risk-2-solutions', 'vcQuote-lorenzo-tejada-orrell-clsq', 'vcQuote-tedd-long-mcag-inc', 'vcQuote-teddy-mangion', 'vcQuote-jemma-ryan', 'vcQuote-anthony-d-agostino-true-steel-frames'],
    products: {
      heading: 'Time and pipeline, *organised.*',
      lead: 'Two of the views services firms use.',
      items: [
        { shot: 'time', title: 'Time by client', body: 'Hours logged against each client and piece of work, broken down by person and task type.' },
        { shot: 'pipeline', title: 'Pipeline with AI health', body: 'New work by stage and owner, with an AI read on what is at risk and why.' },
      ],
    },
    booking: { calTitle: 'Legal consultation', heading: 'Book a legal *consultation.*', lead: "We'll map your intake, matter and deadline workflows live on the call." },
    faqs: [
      ['Can monday.com be used for legal matter management?', 'Yes, for the operational side of a matter: parties, stages, tasks, key dates, documents and reporting. Firms that rely on a dedicated practice management system usually keep it for trust accounting and use monday.com around it.'],
      ['Is monday.com secure enough for confidential legal work?', 'On the Enterprise plan it offers SSO, granular permissions, audit logs, data residency options and encryption. We configure matter-level access so people only see the matters they work on.'],
      ['Can it manage court dates and limitation deadlines?', 'Yes. Key dates are captured once on the matter and drive automated reminders and escalations to the responsible lawyer and supervisor, so deadlines do not live in one person’s diary.'],
      ['Does it work for in-house legal teams?', 'Yes. In-house teams use a request form as a front door for contract reviews and advice, with triage, SLAs and reporting on demand from each part of the business.'],
      ['How is AI used safely in legal workflows?', 'Only with governance in place: approved models, no training on your data, human review of every output and clear rules for privileged material. Typical uses are intake triage, document summaries and first drafts of routine correspondence.'],
    ],
    closing: { heading: 'Less admin *around the advice.*', lead: "Book a 30-minute call. We'll map your intake, matter and deadline workflows and what can be automated.", cta: 'Book a legal consultation' },
  },
]

// ---------------------------------------------------------------------------

type UseCase = { id: string; title: string; summary: string; teams: string[] }
function loadUseCases(): Map<string, { uc: UseCase; slug: string }> {
  const dir = path.join(ROOT, 'public/data/ai-use-cases')
  const out = new Map<string, { uc: UseCase; slug: string }>()
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f === 'index.json') continue
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    for (const uc of d.useCases ?? []) out.set(uc.id, { uc, slug: d.slug })
  }
  return out
}

async function upload(file: string): Promise<string> {
  if (!APPLY) return `image-DRYRUN-${file}`
  const buf = fs.readFileSync(path.join(ASSETS, file))
  const doc = await writeClient.assets.upload('image', buf, { filename: file })
  return doc._id
}

const block = (text: string) => [
  { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _key: k(), _type: 'span', marks: [], text }] },
]

async function main() {
  const useCases = loadUseCases()
  const logoRefs: Record<string, string> = { ...L }
  for (const [name, file] of Object.entries(NEW_LOGOS)) logoRefs[name] = await upload(file)

  const docs: Record<string, unknown>[] = []
  for (const p of PAGES) {
    const faqIds = p.faqs.map((_, i) => `faqItem-vc-${p.slug}-${i}`)
    p.faqs.forEach(([q, a], i) =>
      docs.push({ _id: faqIds[i], _type: 'faqItem', question: q, answer: block(a), category: p.name, order: i, pages: [p.path.slice(1)] }),
    )

    const sections: Record<string, unknown>[] = []
    sections.push({
      _key: k(), _type: 'vcHero', badge: p.hero.badge, heading: p.hero.heading, lead: p.hero.lead,
      art: img(await upload(p.hero.art)),
      ctas: [{ _key: k(), ...cta('Book a discovery call', '#book', 'primary', true) }, { _key: k(), ...cta('Common questions', '#faq', 'outline', false) }],
    })
    if (p.logos) {
      for (const n of p.logos.names) if (!logoRefs[n]) throw new Error(`${p.slug}: no logo for ${n}`)
      sections.push({
        _key: k(), _type: 'vcLogos', tone: 'alt', head: head('Clients', p.logos.heading, p.logos.lead),
        logos: p.logos.names.map((n) => ({ _key: k(), _type: 'vcLogo', alt: n, image: img(logoRefs[n]) })),
      })
    }
    sections.push({
      _key: k(), _type: 'vcSteps', layout: 'steps', tone: p.logos ? 'plain' : 'alt', head: head('Our approach', p.approach.heading, p.approach.lead),
      items: p.approach.steps.map(([title, body], i) => ({ _key: k(), _type: 'vcStep', n: String(i + 1).padStart(2, '0'), title, body })),
    })
    if (p.cases)
      sections.push({ _key: k(), _type: 'vcCases', tone: 'alt', head: head('Case studies', p.cases.heading, p.cases.lead), cases: p.cases.ids.map(ref) })
    sections.push({ _key: k(), _type: 'vcAudit', tone: 'plain', heading: p.audit.heading, text: p.audit.text, cta: cta(p.audit.cta, '#book', 'primary', true) })
    sections.push({
      _key: k(), _type: 'vcCards', layout: 'cards2', tone: 'plain', head: head('What we build', p.build.heading, p.build.lead),
      items: p.build.items.map(([title, body], i) => ({ _key: k(), _type: 'vcItem', label: String(i + 1).padStart(2, '0'), title, body })),
    })
    sections.push({
      _key: k(), _type: 'vcProof', layout: 'sticky', tone: 'alt', badge: 'Client proof', heading: 'What our customers *say about us.*', lead: p.proofLead,
      ctas: [{ _key: k(), ...cta('Start your transformation', '#book', 'primary', true) }], quotes: p.quotes.map(ref),
    })
    if (p.products)
      sections.push({
        _key: k(), _type: 'vcProducts', tone: 'plain', head: head('In the product', p.products.heading, p.products.lead),
        items: p.products.items.map((it) => ({ _key: k(), _type: 'vcItem', title: it.title, body: it.body, image: img(SHOTS[it.shot].ref, SHOTS[it.shot].alt) })),
      })
    if (p.useCases)
      sections.push({
        _key: k(), _type: 'vcCards', layout: 'uc', tone: 'alt', anchor: 'use-cases',
        head: head('Use case catalogue', p.useCases.heading, 'Every use case comes from a real Fruition client engagement, with the client’s name withheld.'),
        items: p.useCases.ids.map((id) => {
          const hit = useCases.get(id)
          if (!hit) throw new Error(`${p.slug}: unknown use case ${id}`)
          return { _key: k(), _type: 'vcItem', title: hit.uc.title, body: hit.uc.summary, tags: hit.uc.teams.slice(0, 3), href: `/ai-use-cases/${hit.slug}#${id}`, linkLabel: 'See the build' }
        }),
      })
    sections.push({ _key: k(), _type: 'vcBooking', badge: 'Book a time', calTitle: p.booking.calTitle, heading: p.booking.heading, lead: p.booking.lead })
    sections.push({
      _key: k(), _type: 'vcFaq', tone: 'alt', badge: 'FAQ', heading: 'Frequently asked questions.',
      tabs: [
        { _key: k(), _type: 'vcFaqTab', label: p.name, items: faqIds.map(ref) },
        { _key: k(), _type: 'vcFaqTab', label: 'AI governance', items: AI_GOVERNANCE_FAQS.map(ref) },
        { _key: k(), _type: 'vcFaqTab', label: 'monday CRM', items: MONDAY_CRM_FAQS.map(ref) },
      ],
    })
    sections.push({
      _key: k(), _type: 'vcClosing', badge: 'Next step', heading: p.closing.heading, lead: p.closing.lead,
      ctas: [{ _key: k(), ...cta(p.closing.cta, '#book', 'inverse', true) }],
    })

    docs.push({ _id: `vcPage-industries-${p.slug}`, _type: 'vcPage', group: 'industry', path: p.path, title: p.seoTitle, seoTitle: p.seoTitle, seoDescription: p.seoDescription, sections })
  }

  // Every reference must resolve before anything is written.
  const refIds = new Set<string>()
  JSON.stringify(docs, (key, v) => (key === '_ref' && typeof v === 'string' && !v.startsWith('image-') ? (refIds.add(v), v) : v))
  const own = new Set(docs.map((d) => d._id as string))
  const external = [...refIds].filter((id) => !own.has(id))
  const found = await writeClient.fetch<string[]>(`*[_id in $ids]._id`, { ids: external })
  const missing = external.filter((id) => !found.includes(id))
  if (missing.length) throw new Error(`missing referenced documents: ${missing.join(', ')}`)

  for (const d of docs) {
    const s = (d.sections as { _type: string }[] | undefined)?.map((x) => x._type).join(' ')
    console.log(`${d._id}${s ? `  [${s}]` : ''}`)
  }
  if (!APPLY) {
    console.log(`\nDry run: ${docs.length} documents. Re-run with --apply to write.`)
  } else {
    const tx = writeClient.transaction()
    for (const d of docs) tx.createOrReplace(d as { _id: string; _type: string })
    await tx.commit()
    console.log(`\nWrote ${docs.length} documents.`)
  }
  await addToMenu()
}

// The six menu items, appended to the live Industries > Industries column
// (siteSettings.navigation). Patches only that list, so editor changes made
// since the nav seed survive; items already present (same href) are skipped.
const MENU_ITEMS = [
  { label: 'Transport & logistics', href: '/industries/transport-logistics', description: 'Dispatch, fleet and freight operations', icon: 'transport-and-logistics' },
  { label: 'Hospitality & events', href: '/industries/hospitality-tourism-events', description: 'Venues, tourism campaigns and events', icon: 'hospitality-and-events' },
  { label: 'Technology & SaaS', href: '/industries/technology-saas', description: 'Pipeline, onboarding and delivery', icon: 'technology-and-saas' },
  { label: 'Energy & utilities', href: '/industries/energy-utilities', description: 'Field work, projects and compliance', icon: 'energy-and-utilities' },
  { label: 'Media & entertainment', href: '/industries/media-entertainment', description: 'Productions, content and approvals', icon: 'media-and-entertainment' },
  { label: 'Legal', href: '/industries/legal', description: 'Matters, intake and deadlines', icon: 'legal' },
]

type NavLink = { _key: string; href?: string }
type NavSection = { _key: string; heading?: string; items?: NavLink[] }
type NavItem = { _key: string; label?: string; sections?: NavSection[] }

async function addToMenu() {
  const settings = await writeClient.fetch<{ _id: string; navigation: NavItem[] } | null>(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{ _id, navigation }`)
  if (!settings) throw new Error('no siteSettings document')
  const tab = settings.navigation.find((n) => n.label === 'Industries')
  const section = tab?.sections?.find((s) => s.heading === 'Industries')
  if (!tab || !section) throw new Error('Industries > Industries menu column not found')
  const have = new Set((section.items ?? []).map((i) => i.href))
  const todo = MENU_ITEMS.filter((m) => !have.has(m.href))
  console.log(`\nMenu: ${section.items?.length ?? 0} industries live, ${todo.length} to add${todo.length ? `: ${todo.map((m) => m.label).join(', ')}` : ''}`)
  // Separate flag: run it only once the routes are deployed, so the menu never links to a 404.
  if (!todo.length || !APPLY || !process.argv.includes('--menu')) return

  const backupDir = path.join(__dirname, '..', 'nav-backups')
  const backup = path.join(backupDir, `nav-industries-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(backup, JSON.stringify(settings.navigation, null, 2))
  console.log(`Backed up navigation to ${path.relative(ROOT, backup)}`)

  const items = []
  for (const m of todo) {
    const buf = fs.readFileSync(path.join(__dirname, '..', 'nav-icons', `${m.icon}.svg`))
    const asset = await writeClient.assets.upload('image', buf, { filename: `${m.icon}.svg`, contentType: 'image/svg+xml' })
    items.push({ _key: `${m.icon}-${k()}`, _type: 'navLink', label: m.label, href: m.href, description: m.description, logo: img(asset._id) })
  }
  await writeClient
    .patch(settings._id)
    .insert('after', `navigation[_key=="${tab._key}"].sections[_key=="${section._key}"].items[-1]`, items)
    .commit()
  console.log(`Added ${items.length} menu items.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
