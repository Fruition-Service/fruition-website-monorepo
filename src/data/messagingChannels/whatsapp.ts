import type { ChannelPage } from './types'

/**
 * /integrations/whatsapp
 *
 * Platform facts verified against Meta's WhatsApp Business Platform
 * documentation on 2026-09-25. Two of them have a publication deadline:
 * service messages and in-window utility templates become billable on
 * 1 October 2026, so the pricing rows are written in the future tense and
 * need re-reading if this page is still saying "will" after that date.
 *
 * Reach figures are Meta's own disclosures and Ofcom's. There is deliberately
 * no India, Brazil or Indonesia number here: no Meta-owned or regulator source
 * publishes one, and the figures that circulate for those markets trace back
 * to SEO blogs.
 */
export const WHATSAPP: ChannelPage = {
  path: '/integrations/whatsapp',
  sanitySlug: 'integrations-whatsapp',
  channel: 'WhatsApp',

  seoTitle:
    'WhatsApp CRM & ERP Integration | Fruition: WhatsApp Business Platform into monday.com, HubSpot & Salesforce',
  seoDescription:
    'Fruition connects the WhatsApp Business Platform to monday.com, HubSpot, Salesforce, Zoho and your ERP, so enquiries become tracked records with an owner and an SLA. Australia, the UK, the US and APAC.',

  heroEyebrow: 'Integrations · WhatsApp',
  heroHeading: 'Your customers already message you. ',
  heroHeadingAccent: 'Make it reach the CRM.',
  heroSubheading:
    'We connect the WhatsApp Business Platform to monday.com, HubSpot, Salesforce and your ERP, so an enquiry becomes a tracked record with an owner, a stage and an SLA — instead of a thread on one salesperson’s phone.',
  primaryCtaLabel: 'Book a WhatsApp integration call',
  secondaryCtaLabel: 'Common questions',

  intro:
    'WhatsApp is not a CRM. It has no pipeline, no reporting and no handover, and every conversation that stays inside it is revenue your system of record cannot see.\n\nThe work is the plumbing between the two, and the platform rules that constrain it: a 24-hour messaging window, template categories that are priced and policed differently, and consent you have to be able to evidence to a regulator rather than to Meta.',

  logoCloudHeadingPart1: 'Clients who have used our ',
  logoCloudHeadingAccent: 'messaging integration services',

  reachEyebrow: 'Where it matters',
  reachHeading: 'For most of the world, WhatsApp',
  reachHeadingAccent: 'is the channel.',
  reachLead:
    'Every figure below comes from Meta’s own disclosures or a national regulator. We leave out the country numbers that circulate on comparison blogs, because none of them trace back to a source that publishes them.',
  reach: [
    {
      flag: '🌍',
      market: 'Global',
      stat: '2bn daily actives',
      body: 'Over 3 billion monthly. More online adults name WhatsApp their single favourite platform than any other app.',
    },
    {
      flag: '🇬🇧',
      market: 'United Kingdom',
      stat: '90% of online adults',
      body: 'Ofcom puts daily use at 76%, up from 67%. Your UK customers are not waiting on email.',
    },
    {
      flag: '🇺🇸',
      market: 'United States',
      stat: '100m users',
      body: 'Large, and a special case: Meta does not deliver marketing templates to US numbers at all.',
    },
    {
      flag: '🇹🇭',
      market: 'Southeast Asia',
      stat: 'Top-10 revenue markets',
      body: 'Thailand and Vietnam rank top-10 for Meta business messaging despite sitting in the 30s by GDP, because commerce runs through chat.',
    },
  ],

  flowEyebrow: 'The pipe',
  flowHeading: 'From a message to a record with an owner',
  flowSubheading:
    'Meta’s Cloud API posts every inbound message to a webhook. What happens in the moment after that is the integration.',
  flowSteps: [
    { glyph: '💬', label: 'WhatsApp', sublabel: 'Cloud API webhook' },
    { glyph: '⚙️', label: 'Routing layer', sublabel: 'Identity match · dedupe · consent' },
    { glyph: '📊', label: 'monday.com / HubSpot', sublabel: 'Single source of truth', tone: 'hub' },
    { glyph: '🏭', label: 'ERP & billing', sublabel: 'Orders · delivery · invoices' },
  ],
  flowFootnote:
    'Outbound runs the same path in reverse, with template approval and the messaging window enforced before send.',

  matrixEyebrow: 'Your stack',
  matrixHeading: 'What your CRM does on its own,',
  matrixHeadingAccent: 'and what we build.',
  matrixLead:
    'Nobody sells you an honest version of this table. Three of these five shipped or withdrew something in the last twelve months.',
  matrix: [
    {
      platform: 'HubSpot',
      support: 'native',
      outOfTheBox:
        'A first-party WhatsApp channel in the Conversations inbox, connected direct to Meta. Needs Marketing Hub or Service Hub Professional.',
      weBuild:
        'Broadcast, which HubSpot has no native tool for, and headroom past the 1,000 template messages a month shared across every connected WhatsApp account.',
    },
    {
      platform: 'Salesforce',
      support: 'native',
      outOfTheBox:
        'The enhanced Messaging channel connects straight to Meta. The legacy one routes through Twilio and needs the Digital Engagement add-on.',
      weBuild:
        'Migration off the legacy Twilio channel, the lead and opportunity flows the service product does not cover, and consent as a field you can audit.',
    },
    {
      platform: 'Zoho CRM',
      support: 'native',
      outOfTheBox:
        'Supported on the trial and every paid edition against your own WhatsApp account — the most permissive gate of the five.',
      weBuild:
        'Everything outside Zoho. The moment WhatsApp has to reach an ERP, a warehouse or a finance system, the native channel stops.',
    },
    {
      platform: 'Microsoft Dynamics 365',
      support: 'deprecated',
      outOfTheBox:
        'Microsoft deprecated the Azure Communication Services WhatsApp channel on 23 September 2026, with removal set for 30 September 2028. New deployments go through Twilio.',
      weBuild:
        'The migration to the supported path before removal, plus the Power Platform flows that connect it to the rest of the estate.',
    },
    {
      platform: 'monday.com',
      support: 'none',
      outOfTheBox:
        'No first-party WhatsApp integration and no native channel in monday CRM. Third-party marketplace apps only, each with its own provider relationship and per-seat pricing.',
      weBuild:
        'A Cloud API webhook into monday’s GraphQL: message becomes an item, thread becomes an update, status drives the automation. No per-seat ceiling on the rollout.',
    },
    {
      platform: 'Your ERP',
      support: 'none',
      outOfTheBox: 'Nothing. ERPs do not ship messaging channels.',
      weBuild:
        'Order, dispatch and invoice events as approved utility templates, throttled, and logged against the record that triggered them.',
    },
  ],
  matrixNote:
    'Verified against each vendor’s own documentation in September 2026. We re-check this table each quarter and date it, because a stale answer here costs you a licence you did not need — or a migration you did not see coming.',

  specEyebrow: 'Platform rules',
  specHeading: 'The constraints that decide',
  specHeadingAccent: 'what you can actually build.',
  specLead:
    'This is why WhatsApp is engineering work rather than a connector toggle. Every row below changes the design of the system.',
  spec: [
    {
      label: 'Messaging window',
      value: '24 hours from the customer’s last message or call',
      implication:
        'It resets on every inbound message. Outside it you may send only a pre-approved template, so your routing has to know how much window is left.',
    },
    {
      label: 'Pricing',
      value: 'From 1 October 2026, service messages and in-window utility templates become billable',
      implication:
        'Both have been free since November 2024. Any quote built on the old model understates what the channel costs to run.',
    },
    {
      label: 'Template categories',
      value: 'Marketing, utility and authentication, priced and policed differently',
      implication:
        'Since April 2025 a utility template Meta judges to be marketing is approved as marketing rather than rejected, so you are billed at the higher rate with no error to catch.',
    },
    {
      label: 'Messaging limits',
      value: '250 → 2,000 → 10,000 → 100,000 → unlimited unique recipients per rolling 24 hours',
      implication:
        'Shared across your whole business portfolio, not per number. Multi-brand groups hit the ceiling far earlier than they expect.',
    },
    {
      label: 'Access model',
      value: 'Cloud API direct, or through a Solution Partner',
      implication:
        'Direct means Meta bills you and the operational burden is yours. A Solution Partner holds the credit line and invoices you. We model both against your real volume.',
    },
    {
      label: 'Data residency',
      value: 'Pin data at rest to one country, or store nothing at rest at all',
      implication:
        'Local storage covers Australia, India, Singapore, Japan, the UK and Germany among others. This is the answer to the residency objection most teams do not know exists.',
    },
    {
      label: 'Opt-in',
      value: 'Required, and yours to evidence',
      implication:
        'Meta relaxed the prescribed method, not the requirement. Your own regulator — GDPR, PDPA, India’s DPDP — sits on top, and it is usually the stricter one.',
    },
    {
      label: 'On-Premises API',
      value: 'Expired 23 October 2025',
      implication:
        'If anything in your estate still points at it, those messages are not being delivered. Cloud API is the only remaining path.',
    },
  ],
  specFootnote:
    'Verified against Meta’s WhatsApp Business Platform documentation in September 2026. Meta may change rates on 1 January, 1 April, 1 July or 1 October with one to six months’ notice depending on the change, so we date this panel and re-check it quarterly.',

  capabilitiesEyebrow: 'What we build',
  capabilitiesHeading: 'Six pieces,',
  capabilitiesHeadingAccent: 'every one of them yours to keep.',
  capabilitiesSubheading:
    'Documented, owned by a named maintainer, and handed over with the architecture written down.',
  capabilities: [
    {
      emoji: '🔌',
      title: 'Channel setup',
      description:
        'Business verification, display-name approval and the number strategy — one number per market, or one per team.',
    },
    {
      emoji: '🧭',
      title: 'Identity resolution',
      description:
        'Matching a phone number to the right existing contact, so one customer does not become three records by Friday.',
    },
    {
      emoji: '🧾',
      title: 'Template governance',
      description:
        'Templates written, categorised correctly and submitted for approval, with a rejection path that does not block the release.',
    },
    {
      emoji: '🔀',
      title: 'Routing & SLAs',
      description:
        'Assignment by language, region, product or deal value, with escalation before the messaging window closes.',
    },
    {
      emoji: '🛡️',
      title: 'Consent & retention',
      description:
        'Opt-in captured and stored as a field you can audit, with retention rules that satisfy your regulator, not just Meta.',
    },
    {
      emoji: '📈',
      title: 'Cost reporting',
      description:
        'Per-message spend attributed to the campaign, team or deal that caused it, read from the pricing object on every delivery receipt.',
    },
  ],

  industryHeading: 'What this looks like in your industry',
  industries: [
    {
      label: 'Real estate',
      title: 'Enquiry to inspection without a spreadsheet in the middle',
      description:
        'A buyer messages about a listing. The listing reference is parsed out of the message, the enquiry lands on the agent who owns that property, and the inspection booking writes straight back to the CRM — while the buyer stays in the app they started in.',
      benefits: [
        { text: 'Listing reference parsed from the first inbound message' },
        { text: 'Routed to the agent who owns the property, not a shared queue' },
        { text: 'Inspection reminders as approved utility templates' },
        { text: 'Full thread on the contact record for whoever picks it up next' },
      ],
    },
    {
      label: 'Healthcare',
      title: 'Bookings and reminders, without putting clinical detail in the thread',
      description:
        'Appointment confirmations, reminders and check-in links as utility templates, with the conversation itself deliberately kept thin. Clinical content stays in the clinical system, because chat transcripts piped into a CRM turn into sensitive-data problems under PDPA and DPDP.',
      benefits: [
        { text: 'Confirmations, reminders and rescheduling as approved templates' },
        { text: 'Self-service check-in links that write back to the practice system' },
        { text: 'Transcript filtering, so clinical detail never lands in the CRM' },
        { text: 'Escalation to a human within the messaging window, as Meta requires' },
      ],
    },
    {
      label: 'Logistics',
      title: 'Address confirmation before the driver is already outside',
      description:
        'The ERP fires a delivery-window template the day before. The customer confirms or corrects the address by quick reply, and the reply carries the ID of the template that prompted it — which is how the correction gets back to the right consignment automatically.',
      benefits: [
        { text: 'Delivery-window and dispatch templates fired from ERP status changes' },
        { text: 'Quick-reply address corrections correlated back to the consignment' },
        { text: 'Failed-delivery retries scheduled instead of phoned' },
        { text: 'Proof-of-delivery images received and filed against the order' },
      ],
    },
    {
      label: 'Retail & ecommerce',
      title: 'Order status that does not generate a support ticket',
      description:
        'Confirmation, dispatch and delivery updates sent as utility templates off the order record, with the reply landing in the same inbox your team already works from. Click-to-WhatsApp ads open a free 72-hour window, which is the economic reason they outperform.',
      benefits: [
        { text: 'Order lifecycle templates driven from the commerce platform' },
        { text: 'Click-to-WhatsApp ad traffic captured into the CRM with its campaign' },
        { text: 'Cart-recovery flows that respect the window and the opt-in state' },
        { text: 'Returns and exchanges handled in-thread with an audit trail' },
      ],
    },
    {
      label: 'Financial services',
      title: 'Servicing on the channel customers use, inside the rules you answer to',
      description:
        'Authentication and servicing notifications as templates, with residency pinned and consent evidenced. Note the hard limit: Meta prohibits several financial verticals outright, including payday loans and debt collection, whatever licences you hold.',
      benefits: [
        { text: 'Data residency pinned to a single country at rest' },
        { text: 'Consent captured with wording version and timestamp' },
        { text: 'Authentication templates with one-tap or copy-code buttons' },
        { text: 'An honest read on whether your vertical is permitted at all' },
      ],
    },
    {
      label: 'Education',
      title: 'Enrolment follow-up that does not go to a dead inbox',
      description:
        'Prospective students answer on WhatsApp when they will not answer email. Enquiry, document chase and enrolment reminders run as templates against the student record, with the whole thread visible to whoever handles the application next.',
      benefits: [
        { text: 'Enquiry capture straight into the student or applicant record' },
        { text: 'Document-chase reminders as scheduled utility templates' },
        { text: 'Routing by campus, programme or language' },
        { text: 'Term-date and payment reminders off the student system' },
      ],
    },
  ],

  comparisonHeading: 'Why WhatsApp projects stall',
  comparisonSubheading:
    'Four failure modes we are usually called in to undo, and what we do instead.',
  comparisonTabs: [
    {
      label: 'What goes wrong',
      items: [
        {
          number: '01',
          title: 'It lives on someone’s personal phone',
          description:
            'When they leave, the pipeline leaves with them. There is no reporting, no handover, and no record that a conversation ever happened.',
        },
        {
          number: '02',
          title: 'Templates written the night before launch',
          description:
            'Submitted late, miscategorised as marketing, and suddenly the launch date belongs to Meta’s review queue rather than yours.',
        },
        {
          number: '03',
          title: 'Consent captured nowhere in particular',
          description:
            'A checkbox on a form that never reached the CRM. The first regulator question is “show me”, and there is nothing to show.',
        },
        {
          number: '04',
          title: 'Per-seat app licences that cap the rollout',
          description:
            'The marketplace app works for the pilot team, then the price to extend it to everyone else exceeds the cost of building it properly.',
        },
      ],
    },
    {
      label: 'How we build it',
      items: [
        {
          number: '01',
          title: 'One business number, owned by the business',
          description:
            'Registered to your portfolio, connected to the CRM, and reportable. People leave; the pipeline stays.',
        },
        {
          number: '02',
          title: 'Templates designed with the categories in mind',
          description:
            'Written, categorised and submitted early, with the approval state monitored by webhook so a rejection is a task rather than a surprise.',
        },
        {
          number: '03',
          title: 'Consent as a first-class field',
          description:
            'Captured at the point of opt-in with wording version and timestamp, honoured on and off WhatsApp, and exportable when someone asks.',
        },
        {
          number: '04',
          title: 'An integration you own outright',
          description:
            'Built against the Cloud API into your own system of record, with no per-seat licence between you and a full rollout.',
        },
      ],
    },
  ],

  phasesHeading: 'How the engagement',
  phasesHeadingAccent: 'actually runs',
  phasesSubheading:
    'Fixed phases, defined outcomes, published fees. You always know what is being delivered, by when, and at what cost.',
  phases: [
    {
      number: '01',
      title: 'Channel & consent audit',
      description:
        'Where conversations happen today, who owns them, what consent you can actually prove, and which access tier your volume justifies.',
    },
    {
      number: '02',
      title: 'Data model & routing design',
      description:
        'How a message becomes a record, which object it attaches to, who it routes to, and what happens when nobody answers in time.',
    },
    {
      number: '03',
      title: 'Build, with error handling first',
      description:
        'Rate limits, retries, dead-letter queues and alerting designed in, because integrations that fail silently corrupt trust in every connected system.',
    },
    {
      number: '04',
      title: 'Handover you can maintain',
      description:
        'Architecture documentation, a named maintenance path, and your team trained on the parts they will change. No mystery middleware.',
    },
  ],

  calendlyHeading: 'Talk to a consultant who has shipped this',
  calendlySubheading:
    'Thirty minutes. We will tell you whether WhatsApp is the right channel for your market before we quote you anything.',

  faqs: [
    {
      q: 'Do we need a Solution Partner, or can we use the Cloud API directly?',
      a: 'Either works, and the difference is mostly about who invoices you. As a Tech Provider the platform bills you directly through Meta and charges separately for its software; a Solution Partner holds the credit line and invoices you for messaging itself. Direct is cheaper per message and puts number provisioning, template submission and support on your team. We model both against your real volume and tell you which one your traffic justifies.',
    },
    {
      q: 'Can this write into monday.com, given there is no official WhatsApp app?',
      a: 'Yes, and that is most of what we do here. monday.com has no first-party WhatsApp integration and no native channel in monday CRM — the marketplace apps are all third-party, each with its own messaging provider behind it and its own per-seat price. We build straight against Meta’s Cloud API into monday’s GraphQL API instead: an inbound message creates or updates an item, the thread lands as updates on that item, and the status column drives your existing automations. Nothing is per-seat, so the rollout is not capped by licence cost.',
    },
    {
      q: 'What changes on 1 October 2026, when Meta starts charging for service messages?',
      a: 'Two things that used to be free stop being free. Service messages — your team’s free-form replies inside the open 24-hour window — become billable at each market’s utility rate, with no volume discount. Utility templates sent inside that same open window also become billable, where previously they were not. Meta’s own worked example shows one interaction going from one charge to five across 2026. If you already run WhatsApp, this is a real change to your running cost and worth modelling now; if you are scoping a build, the volume assumptions belong in the design rather than in the first invoice.',
    },
    {
      q: 'How do you handle opt-in under GDPR, PDPA and India’s DPDP Act?',
      a: 'Meta requires opt-in but leaves the method to you, which means your own regulator sets the real standard and it is usually stricter. We capture consent at the point it is given with the wording version and a timestamp, store it as a queryable field on the contact rather than a note, honour opt-outs made anywhere including outside WhatsApp, and set retention rules to the shorter of your obligation and Meta’s 30-day Cloud API retention. Where residency is the issue, WhatsApp can pin data at rest to a single country — Australia, India, Singapore, Japan, the UK and Germany among others — or store nothing at rest at all.',
    },
    {
      q: 'How long does a WhatsApp integration take to deliver?',
      a: 'Most engagements run four to twelve weeks from kickoff depending on scope. The variable is rarely the code: business verification, display-name approval and template review are Meta’s timelines rather than ours, and a client who arrives with consent already evidenced moves considerably faster than one who does not. We work in fixed phases with defined outcomes, so you always know what is being delivered and by when.',
    },
    {
      q: 'Which regions does Fruition deliver this in?',
      a: 'We deliver from Sydney (headquarters, serving APAC including Singapore, India and the Philippines), London (UK and Europe) and New York (US and Canada). Engagements are remote as standard, with optional on-site workshops in each region.',
    },
  ],

  closing: {
    heading: 'Get WhatsApp out of the group chat',
    headingAccent: 'and into the system.',
    lead: 'Book a 30-minute discovery call. We will give you a frank read on scope, fit and cost.',
  },
}
