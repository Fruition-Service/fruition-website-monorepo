import type { ChannelPage } from './types'

/**
 * /integrations/viber
 *
 * Verified against Rakuten Viber's developer documentation, its published EUR
 * rate cards, its partner directory and each CRM vendor's own docs on
 * 2026-09-25.
 *
 * Two deliberate omissions. There is no Viber user count anywhere on this
 * page: Rakuten publishes none, Viber's own site says only "hundreds of
 * millions", and every specific figure in circulation is stale, an estimate or
 * fabricated. And there are no healthcare, real-estate, education or logistics
 * case studies, because none are documented — Viber's own terms disclaim any
 * warranty for health data.
 */
export const VIBER: ChannelPage = {
  path: '/integrations/viber',
  sanitySlug: 'integrations-viber',
  channel: 'Viber',

  seoTitle:
    'Viber Business Messages Integration | Fruition: Viber into monday.com, HubSpot & Your CRM',
  seoDescription:
    'Fruition connects Viber Business Messages and Viber chatbots to monday.com, HubSpot, Salesforce and your ERP across the Philippines, Ukraine, Greece and the Balkans. Consent, templates and rate design included.',

  heroEyebrow: 'Integrations · Viber',
  heroHeading: 'Viber has no CRM app. ',
  heroHeadingAccent: 'We build the one you need.',
  heroSubheading:
    'Rakuten Viber publishes no integration for monday.com, HubSpot, Salesforce, Zoho or Dynamics — the channel has simply never been productised. That is the whole problem, and the whole opportunity: we build the path so Viber behaves like a first-class channel in the system you already run.',
  primaryCtaLabel: 'Book a Viber integration call',
  secondaryCtaLabel: 'Common questions',

  intro:
    'In the Philippines, Greece, Bulgaria, Serbia and Ukraine, Viber is where customers actually are. It is also the least served channel in enterprise software: no first-party CRM app anywhere, no Make app, no Zapier app, no n8n node.\n\nThere are good technical reasons for that, and they are the reason this work is worth doing properly rather than improvising it.',

  logoCloudHeadingPart1: 'Clients who have used our ',
  logoCloudHeadingAccent: 'messaging integration services',

  reachEyebrow: 'Where it matters',
  reachHeading: 'A small number of markets',
  reachHeadingAccent: 'where Viber leads outright.',
  reachLead:
    'Rakuten does not publish Viber user numbers, and its own site now says only “hundreds of millions” monthly. So this section names markets and ranks rather than quoting headcounts we cannot source.',
  reach: [
    {
      flag: '🇵🇭',
      market: 'Philippines',
      stat: 'Top-5 market worldwide',
      body: 'Viber’s own CEO places it among the top five of 190 countries, with monthly actives up 21% year on year. Retail and financial services dominate business use.',
    },
    {
      flag: '🇬🇷',
      market: 'Greece',
      stat: '#1 messaging app',
      body: 'One of four markets where independent analysis ranks Viber first, alongside Bulgaria, Serbia and Belarus.',
    },
    {
      flag: '🇺🇦',
      market: 'Ukraine',
      stat: 'Mass-market channel',
      body: 'PrivatBank, Auchan and the Podorozhnyk pharmacy chain all run documented Viber programmes, the last with over a million chatbot subscribers in its first year.',
    },
    {
      flag: '🇷🇸',
      market: 'Balkans',
      stat: '#1 in Serbia & Bulgaria',
      body: 'A1 Serbia runs Viber inside Salesforce Marketing Cloud at renewal touchpoints, reporting 72% open rates on delivered messages.',
    },
  ],

  flowEyebrow: 'The pipe',
  flowHeading: 'Aggregator in the middle, by design',
  flowSubheading:
    'Viber has no direct API for brands. You reach it through one of its approved partners, and which one you pick determines your rates, your templates and your inbound options.',
  flowSteps: [
    { glyph: '💜', label: 'Viber', sublabel: 'Business Messages · chatbot' },
    { glyph: '🔌', label: 'Approved partner', sublabel: 'Service ID · templates · fallback' },
    { glyph: '📊', label: 'monday.com / HubSpot', sublabel: 'Contact, consent and thread', tone: 'hub' },
    { glyph: '🏭', label: 'ERP & billing', sublabel: 'Orders · reminders · receipts' },
  ],
  flowFootnote:
    'Chatbot sessions are the cheap path: once a subscriber messages you, a 24-hour session opens in which messages are unlimited and unbilled.',

  matrixEyebrow: 'Your stack',
  matrixHeading: 'Rakuten Viber publishes no CRM app',
  matrixHeadingAccent: 'for any platform on this list.',
  matrixLead:
    'Every Viber listing on every one of these marketplaces is published by a messaging aggregator or a regional agency. That is not a criticism of Viber — it is the shape of the problem you are buying help with.',
  matrix: [
    {
      platform: 'HubSpot',
      support: 'partial',
      outOfTheBox:
        'No native Viber channel, but Infobip’s HubSpot-certified app delivers two-way Viber in the inbox, native workflow actions, inbound triggers and timeline events.',
      weBuild:
        'Not the connection — that exists. Opt-in capture, consent-state modelling, template governance, and the Service ID and legal-entity design that decides your rate.',
    },
    {
      platform: 'Salesforce',
      support: 'partial',
      outOfTheBox:
        'Sinch’s omnichannel connector on AppExchange carries Viber into Marketing Cloud, one-way and two-way.',
      weBuild:
        'Journey design, fallback policy and the consent model. A1 Serbia runs exactly this shape at renewal touchpoints.',
    },
    {
      platform: 'Microsoft Dynamics 365',
      support: 'partial',
      outOfTheBox:
        'Infobip’s app for Customer Insights carries Viber rich templates with SMS failover.',
      weBuild:
        'The failover policy, and cost attribution across two channels billed on different models.',
    },
    {
      platform: 'Zoho',
      support: 'partial',
      outOfTheBox:
        'Mitto and Wepster extensions on the Zoho marketplace. Zoho Desk reaches Viber only through MessageBird, not natively.',
      weBuild:
        'Everything past the send: inbound handling, opt-out state, and reporting that survives the aggregator layer.',
    },
    {
      platform: 'monday.com',
      support: 'none',
      outOfTheBox:
        'Nothing at all. A sweep of monday.com’s marketplace found no Viber listing of any kind, against 34 hits for WhatsApp and 11 for Telegram.',
      weBuild:
        'An approved aggregator plus purpose-built glue into monday’s API. There is no product to buy here, which is precisely why this page exists.',
    },
  ],
  matrixNote:
    'Verified against each marketplace and Viber’s partner directory in September 2026. Marketplace search is client-side on several of these sites, so treat the aggregator lists as indicative rather than exhaustive.',

  specEyebrow: 'Platform rules',
  specHeading: 'Facts that decide',
  specHeadingAccent: 'whether Viber is viable for you at all.',
  specLead:
    'We would rather tell you this before you commit than after. On two of these rows the honest answer is sometimes “not this channel”.',
  spec: [
    {
      label: 'Domestic vs international',
      value: 'A legal-entity test, not a routing test',
      implication:
        'Domestic rates apply only when your entity is headquartered in the recipient’s country. In the Philippines that is the difference between roughly €0.0026 and €0.0750 per message — decided by where you are incorporated, not by how you send.',
    },
    {
      label: 'Encryption',
      value: 'Business messaging is not end-to-end encrypted',
      implication:
        'Viber’s own help centre lists chats with bots among the communications that are not end-to-end encrypted. Several aggregators claim otherwise. If you are regulated, design around the documented position.',
    },
    {
      label: 'Regulated sectors',
      value: 'Viber warrants nothing for health data',
      implication:
        'Its business terms disclaim any representation that the service meets the needs of entities handling personal health information or data on children. For clinical use cases we will usually point you elsewhere.',
    },
    {
      label: 'Access',
      value: 'Approved partner only, and Viber approves the sender',
      implication:
        'Onboarding needs a warranty letter, a service qualification form, a non-promotional example message and six logo sizes. Viber issues a Service ID in two to three days. There is no self-serve path.',
    },
    {
      label: 'Chatbot sessions',
      value: '24-hour sessions are unlimited and unbilled',
      implication:
        'Once a subscriber messages you, everything inside the session is free. A conversational design costs a flat monthly bot fee and very little else — which is the cheapest structure of the three channels we cover.',
    },
    {
      label: 'Opt-in',
      value: 'Platform-enforced for bots, contractual for Business Messages',
      implication:
        'A bot cannot message anyone who has not subscribed. For Business Messages Viber publishes no consent definition at all, so the standard is set by your aggregator and your regulator.',
    },
    {
      label: 'Templates',
      value: 'Moderated by Viber, and immutable once submitted',
      implication:
        'A rejected template must be resubmitted under a new name. Template design is a release-planning problem, not a copywriting one.',
    },
    {
      label: 'Data protection role',
      value: 'Viber is an independent controller, not your processor',
      implication:
        'Its terms apply controller-to-controller standard contractual clauses. The processor agreement you actually sign is your aggregator’s, and its sub-processor list is the one to read.',
    },
  ],
  specFootnote:
    'Rates and rules from Rakuten Viber’s published documentation and EUR rate cards, retrieved September 2026. The rate cards carry no version date, so we re-retrieve them before quoting.',

  capabilitiesEyebrow: 'What we build',
  capabilitiesHeading: 'The work that is not',
  capabilitiesHeadingAccent: 'buying a connector.',
  capabilitiesSubheading:
    'Documented, owned by a named maintainer, and handed over with the architecture written down.',
  capabilities: [
    {
      emoji: '🧮',
      title: 'Rate & entity design',
      description:
        'Modelling domestic against international rates for your markets, and telling you plainly when a local entity pays for itself several times over.',
    },
    {
      emoji: '🤝',
      title: 'Partner selection',
      description:
        'Choosing among Viber’s approved partners on the things that matter: inbound support, CRM app quality, monthly minimums and which markets they actually price well.',
    },
    {
      emoji: '📨',
      title: 'Template governance',
      description:
        'Templates written and submitted correctly the first time, because Viber’s are immutable and a rejection means starting again under a new name.',
    },
    {
      emoji: '🛡️',
      title: 'Consent modelling',
      description:
        'The part Viber does not define. Consent state stored as an auditable field, with opt-out honoured across channels rather than per aggregator.',
    },
    {
      emoji: '🔁',
      title: 'Fallback policy',
      description:
        'When SMS should take over, what it costs when it does, and how both channels attribute back to one customer record.',
    },
    {
      emoji: '🧩',
      title: 'CRM integration',
      description:
        'Inbound threading, identity resolution and reporting into monday.com, HubSpot or Salesforce — built to survive a change of aggregator.',
    },
  ],

  industryHeading: 'What this looks like in your industry',
  industries: [
    {
      label: 'Financial services',
      title: 'Servicing messages at a fraction of SMS',
      description:
        'Metrobank in the Philippines runs Viber marketing journeys through Salesforce Marketing Cloud and reports 30–50% cost savings against the same messages by SMS. PrivatBank in Ukraine reports a 10% lift in banking service usage.',
      benefits: [
        { text: 'Journey integration into Marketing Cloud or your CRM of record' },
        { text: 'Transactional templates approved and version-controlled' },
        { text: 'SMS fallback with cost attribution across both channels' },
        { text: 'Consent state auditable per customer, not per campaign' },
      ],
    },
    {
      label: 'Retail & ecommerce',
      title: 'Channel-exclusive offers you can actually measure',
      description:
        'Primer Group ran a Viber blast with a redeem code valid only for Viber recipients, and published 53% redemption. The mechanic works because attribution is unambiguous — which only holds if the code, the send and the CRM record are joined up.',
      benefits: [
        { text: 'Channel-exclusive codes issued and reconciled against the CRM' },
        { text: 'Cart-recovery flows that respect session and opt-out state' },
        { text: 'Order and delivery updates as approved templates' },
        { text: 'Reporting that survives a change of aggregator' },
      ],
    },
    {
      label: 'Telecom & utilities',
      title: 'Renewal journeys where the channel earns its place',
      description:
        'A1 Serbia deployed Viber inside Salesforce Marketing Cloud at specific renewal touchpoints alongside SMS, push and email, and published 68% delivery with 72% open rates on delivered messages and a 20% Viber share of each journey.',
      benefits: [
        { text: 'Touchpoint-level channel selection rather than blanket sends' },
        { text: 'Delivery and open telemetry written back to the customer record' },
        { text: 'Fallback ordering tuned per journey stage' },
        { text: 'Cost per delivered message tracked against the journey outcome' },
      ],
    },
    {
      label: 'Hospitality & travel',
      title: 'Operational notifications, not just promotions',
      description:
        'Cebu Pacific runs Viber as the primary channel with SMS failover, carrying both seat sales and operational notices such as delays and gate changes, and reports a 75% NPS increase year on year.',
      benefits: [
        { text: 'Operational alerts fired from the operations system, not marketing' },
        { text: 'Primary-plus-fallback routing with a defined validity window' },
        { text: 'Ancillary offers triggered from booking behaviour' },
        { text: 'One thread per passenger, visible to service teams' },
      ],
    },
  ],

  comparisonHeading: 'Why Viber projects stall',
  comparisonSubheading:
    'Four things that catch teams out, and how we handle them instead.',
  comparisonTabs: [
    {
      label: 'What goes wrong',
      items: [
        {
          number: '01',
          title: 'The automation platform turns out to have nothing',
          description:
            'Make has no Viber app. Zapier states outright that Viber has not built an integration. n8n has no built-in node. A plan that assumed any of them has to start over.',
        },
        {
          number: '02',
          title: 'International rates arrive with the first invoice',
          description:
            'Without a locally registered entity you pay the international rate. In the Philippines that is roughly twenty-nine times the domestic one.',
        },
        {
          number: '03',
          title: 'Encryption was assumed, not checked',
          description:
            'Several aggregators describe Viber business messaging as end-to-end encrypted. Viber’s own help centre says chats with bots are not. Regulated programmes get built on a false premise.',
        },
        {
          number: '04',
          title: 'Consent was left to the aggregator',
          description:
            'Viber publishes no consent definition for Business Messages, so teams inherit whatever their provider does. Then they change provider and the state does not come with them.',
        },
      ],
    },
    {
      label: 'How we build it',
      items: [
        {
          number: '01',
          title: 'A path we have verified works this quarter',
          description:
            'Built on an approved partner’s API with the inbound story confirmed, rather than on a connector that a directory page claims exists.',
        },
        {
          number: '02',
          title: 'Rate modelling before commitment',
          description:
            'Domestic against international, monthly minimums per market, and a straight answer on whether a local entity pays for itself.',
        },
        {
          number: '03',
          title: 'Compliance read from the primary source',
          description:
            'Viber’s own terms and help centre, not the aggregator’s marketing page. Where the channel is wrong for your sector we say so.',
        },
        {
          number: '04',
          title: 'Consent owned by you, in your CRM',
          description:
            'Stored as an auditable field on your own records, so changing aggregator is a migration rather than a reset.',
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
      title: 'Market, entity & rate assessment',
      description:
        'Which markets you send to, where you are incorporated, what that means for your rate, and whether Viber beats SMS on your actual volume.',
    },
    {
      number: '02',
      title: 'Partner selection & onboarding',
      description:
        'Choosing an approved partner on inbound capability and market pricing, then running the Service ID application — warranty letter, qualification form, logos and all.',
    },
    {
      number: '03',
      title: 'Build, with consent modelled first',
      description:
        'Opt-in capture, consent state on your own records, template submission, inbound threading and fallback policy. Then the integration itself.',
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
    'Thirty minutes. We will tell you whether Viber is the right channel for your markets before we quote you anything.',

  faqs: [
    {
      q: 'Can Viber connect to monday.com?',
      a: 'Not with anything you can buy. A sweep of monday.com’s marketplace found no Viber listing of any kind — no app, no channel, nothing — against 34 listings mentioning WhatsApp. Viber on monday.com genuinely requires an approved messaging partner plus purpose-built integration work into monday’s API. As a monday.com Platinum Partner this is the combination we get asked about most, and it is the reason this page exists.',
    },
    {
      q: 'Does HubSpot need custom middleware for Viber?',
      a: 'No, and we would rather correct that than sell against it. HubSpot has no native Viber channel, but Infobip publishes a HubSpot-certified app that delivers two-way Viber in the inbox, native workflow actions on contacts, companies and deals, inbound-message triggers and timeline events. The connection is a solved problem. Where an engagement earns its fee is opt-in capture, consent-state modelling, template governance, and the Service ID and legal-entity design that determines what each message costs you.',
    },
    {
      q: 'Why is there no Viber app on Make, Zapier or n8n?',
      a: 'Two structural reasons. Viber Business Messages has no API token: authentication is an IP allowlist against a numeric Service ID arranged during partner onboarding, which a multi-tenant connector cannot provision per customer the way an OAuth or API-key integration can. And the chatbot API has been contract-gated and metered since February 2024, so there is no free tier for a connector’s users to self-serve into. Make has only one partner’s send-only modules; Zapier states plainly that Viber has not built an integration; n8n has no built-in node. Inbound Viber through Zapier is possible via Infobip’s app, which is a genuinely useful and little-known route.',
    },
    {
      q: 'How much does Viber messaging cost?',
      a: 'Rakuten Viber publishes EUR rate cards, which is more than most people expect. Rates are per delivered message and vary by market and by whether the message is transactional or promotional, with a monthly minimum of €115 or €175 depending on the country. Chatbots carry a flat monthly fee per bot, and messages inside a 24-hour session are unbilled. The single biggest cost lever is not volume: domestic rates apply only when your entity is headquartered in the recipient’s country, and in the Philippines the gap between domestic and international is roughly twenty-nine times. We model that before you commit.',
    },
    {
      q: 'Is Viber business messaging end-to-end encrypted?',
      a: 'No. Viber’s own help centre lists chats with bots among the communications that are not end-to-end encrypted, alongside communities, channels and group calls. Some aggregators state the opposite on their marketing pages. If you are in a regulated sector, design around the documented position — and note that Viber’s business terms also disclaim any representation that the service meets the needs of entities handling personal health information.',
    },
    {
      q: 'Do we need documented opt-in for Viber in the Philippines?',
      a: 'It is more nuanced than the usual answer. The National Privacy Commission’s guidance permits direct marketing to be based on legitimate interest rather than consent where the processing is limited to personal information, subject to a documented assessment and a clear privacy notice. Where you do rely on consent, the standard is strict: it cannot be assumed, cannot be bundled, must be evidenced, and must be as easy to withdraw as to give. Viber separately obliges you to provide an opt-out mechanism. We will help you pick a basis and document it, but this is a point to confirm with your own counsel.',
    },
  ],

  closing: {
    heading: 'The channel nobody has productised.',
    headingAccent: 'We build it properly.',
    lead: 'Book a 30-minute discovery call. We will give you a frank read on scope, fit and cost.',
  },
}
