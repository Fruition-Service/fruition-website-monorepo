import type { ChannelPage } from './types'

/**
 * /integrations/line
 *
 * Verified against LINE's developer documentation, LY Corporation's corporate
 * disclosures and each CRM vendor's own docs on 2026-09-25.
 *
 * Two things this page deliberately does NOT say, because both are wrong:
 * "LINE has no CRM integration" (it is native in Salesforce, Dynamics 365 and
 * Zoho SalesIQ) and anything about Indonesia (LY Corp no longer reports it as
 * a LINE market, and the ~90m figure in circulation has no current source).
 */
export const LINE: ChannelPage = {
  path: '/integrations/line',
  sanitySlug: 'integrations-line',
  channel: 'LINE',

  seoTitle:
    'LINE CRM Integration | Fruition: LINE Official Account into monday.com, HubSpot & Salesforce',
  seoDescription:
    'Fruition connects LINE Official Accounts to monday.com, HubSpot and your CRM or ERP across Japan, Taiwan and Thailand. LINE Messaging API integration, LIFF lead capture and PDPA-aligned consent.',

  heroEyebrow: 'Integrations · LINE',
  heroHeading: 'In Japan, Taiwan and Thailand, ',
  heroHeadingAccent: 'LINE is the customer relationship.',
  heroSubheading:
    'We connect LINE Official Accounts to monday.com, HubSpot and your ERP, so a friend-add becomes a contact record with consent attached — and the conversation stops ending at the Official Account Manager.',
  primaryCtaLabel: 'Book a LINE integration call',
  secondaryCtaLabel: 'Common questions',

  intro:
    'LINE gives you a display name, an icon, a status message and a language. It will not give you a phone number, an email address or a way to re-read a message you failed to store. Everything a CRM needs, you have to capture yourself.\n\nThat is the whole engineering problem, and it is why LINE projects that start as "just connect the chat tool" end up rebuilt. We design the persistence and consent layer first, because LINE keeps no logs for you and will not hand the data back.',

  logoCloudHeadingPart1: 'Clients who have used our ',
  logoCloudHeadingAccent: 'messaging integration services',

  reachEyebrow: 'Where it matters',
  reachHeading: 'Three markets where LINE',
  reachHeadingAccent: 'is not one channel among several.',
  reachLead:
    'Figures are LY Corporation’s own, as at 31 March 2026. LINE counts accounts that launched the app at least once in the month, so read these as account-launch metrics rather than deduplicated people.',
  reach: [
    {
      flag: '🇯🇵',
      market: 'Japan',
      stat: '100m monthly actives',
      body: '81.3% of the population. LINE is the default messaging layer for consumers and, increasingly, for service delivery.',
    },
    {
      flag: '🇹🇼',
      market: 'Taiwan',
      stat: '22m monthly actives',
      body: '94.5% of the population — the highest penetration of any LINE market.',
    },
    {
      flag: '🇹🇭',
      market: 'Thailand',
      stat: '54m monthly actives',
      body: '81.8% of the population. LINE Thailand reported 12 billion Official Account conversations across 2025.',
    },
    {
      flag: '🌏',
      market: 'Elsewhere',
      stat: '193m globally',
      body: 'LY Corporation frames LINE’s overseas business as Taiwan and Thailand. It no longer reports Indonesia as a core market.',
    },
  ],

  flowEyebrow: 'The pipe',
  flowHeading: 'From a friend-add to a contact record with consent',
  flowSubheading:
    'A friend-add gives you an opaque user ID and nothing else. The integration is everything that turns that ID into a customer you can actually contact.',
  flowSteps: [
    { glyph: '📱', label: 'LINE OA', sublabel: 'follow webhook · userId' },
    { glyph: '📝', label: 'LIFF form', sublabel: 'Phone, email, explicit consent' },
    { glyph: '📊', label: 'monday.com / HubSpot', sublabel: 'Contact keyed on userId', tone: 'hub' },
    { glyph: '🔁', label: 'Push & rich menu', sublabel: 'Follow-up · booking · order status' },
  ],
  flowFootnote:
    'The reply to a follow event is free and does not consume your message quota — which makes a conversational design structurally cheaper than a broadcast one.',

  matrixEyebrow: 'Your stack',
  matrixHeading: 'Three of these support LINE natively.',
  matrixHeadingAccent: 'Two do not.',
  matrixLead:
    'If a vendor tells you LINE needs custom work everywhere, they have not checked. The gap is real, but it is specific — and it is exactly where most of our clients sit.',
  matrix: [
    {
      platform: 'Salesforce',
      support: 'native',
      outOfTheBox:
        'LINE is a first-class Messaging channel in Service Cloud, and Salesforce appears directly in LINE’s own technology-partner directory.',
      weBuild:
        'Work around the documented gaps: agents can receive but not send audio, documents do not pass in either direction, and LINE’s unsend is not honoured in transcripts.',
    },
    {
      platform: 'Microsoft Dynamics 365',
      support: 'native',
      outOfTheBox:
        'A standard out-of-the-box social channel, built by Microsoft rather than co-built with LINE.',
      weBuild:
        'Identity resolution against existing contacts, and everything past the channel itself — consent state, routing, and the rest of the estate.',
    },
    {
      platform: 'Zoho SalesIQ',
      support: 'native',
      outOfTheBox: 'LINE sits alongside WhatsApp, Telegram and WeChat in SalesIQ.',
      weBuild:
        'Cross-suite flows the moment LINE has to reach anything outside Zoho, and the LIFF capture step SalesIQ does not provide.',
    },
    {
      platform: 'HubSpot',
      support: 'none',
      outOfTheBox:
        'No LINE channel. HubSpot’s own documentation routes you to the Custom Channels API, which needs Sales Hub or Service Hub Professional plus HubSpot Credits.',
      weBuild:
        'The custom channel itself — webhook, signature validation, identity mapping and inbox threading — so LINE behaves like a first-party channel to your team.',
    },
    {
      platform: 'monday.com',
      support: 'none',
      outOfTheBox:
        'Nothing. No app, no channel, no listing. monday.com does not appear in LINE’s partner directory, and LINE does not appear in monday’s marketplace.',
      weBuild:
        'The whole path: Messaging API webhook into monday’s GraphQL, plus the persistence layer LINE forces on you because it will not re-serve an inbound message.',
    },
  ],
  matrixNote:
    'Verified against each vendor’s documentation and LINE’s technology-partner directory in September 2026. Third-party middleware exists in this space — SleekFlow, Omnichat, Crescendo Lab and others — and we will tell you when buying one beats building.',

  specEyebrow: 'Platform rules',
  specHeading: 'LINE’s constraints are stricter',
  specHeadingAccent: 'than most teams assume.',
  specLead:
    'Several of these cannot be retrofitted. Getting them wrong at the start means rebuilding, not patching.',
  spec: [
    {
      label: 'Channels per account',
      value: 'Normally one Messaging API channel per Official Account',
      implication:
        'A client already running a vendor chat tool on their OA cannot simply add a second integration. The module-channel escape hatch is gated behind a corporate application.',
    },
    {
      label: 'User IDs',
      value: 'Provider-scoped, not channel-scoped',
      implication:
        'Under one provider, LINE Login and the Messaging API return the same ID, so no linking step is needed. Across providers they differ, and the choice cannot be changed later. Consolidate on day one.',
    },
    {
      label: 'Inbound messages',
      value: 'Delivered once, by webhook, and never re-servable',
      implication:
        'There is no API to fetch an inbound message again. Miss the webhook and the content is gone permanently, which makes durable persistence a requirement rather than a nicety.',
    },
    {
      label: 'Logs',
      value: 'LINE keeps none on your behalf',
      implication:
        'In LINE’s words, you are responsible for saving logs. Any audit or dispute you expect to win later depends on storage you built yourself.',
    },
    {
      label: 'Reply tokens',
      value: 'Single-use, valid one minute',
      implication:
        'Free and quota-exempt, which makes them worth engineering for. But a slow downstream call costs you the free reply and pushes you onto a billed push message.',
    },
    {
      label: 'Contact data',
      value: 'Display name, icon, status and language. Nothing else',
      implication:
        'Phone and email come from a LIFF form, a conversation, or a separate LINE application for the email scope. PC-only users cannot consent to profile access at all, so your schema has to tolerate a nameless contact.',
    },
    {
      label: 'Data retention',
      value: 'Friend and group information must not be stored beyond 24 hours',
      implication:
        'LINE’s User Data Policy also treats your CRM vendor, iPaaS and any LLM API as contractors, with obligations that must be flowed down to them.',
    },
    {
      label: 'Opt-out',
      value: 'Blocking you is the only signal',
      implication:
        'A friend-add is a channel, not consent. A disengaged user generates no event at all, so engagement state has to be inferred rather than read.',
    },
  ],
  specFootnote:
    'Verified against LINE’s Messaging API documentation, development guidelines and User Data Policy in September 2026. LINE declines to publish a retention period for media content, so we do not quote one.',

  capabilitiesEyebrow: 'What we build',
  capabilitiesHeading: 'The layer LINE',
  capabilitiesHeadingAccent: 'deliberately leaves to you.',
  capabilitiesSubheading:
    'Documented, owned by a named maintainer, and handed over with the architecture written down.',
  capabilities: [
    {
      emoji: '🏗️',
      title: 'Provider & channel architecture',
      description:
        'The decision that cannot be undone: which provider owns which channels, so your user IDs stay consistent as you add LINE Login, LIFF and a second Official Account.',
    },
    {
      emoji: '📝',
      title: 'LIFF lead capture',
      description:
        'The form that turns an anonymous user ID into a contactable person, with explicit consent captured in the same step.',
    },
    {
      emoji: '🗄️',
      title: 'Message persistence',
      description:
        'Durable storage of inbound events and media, because LINE serves each one exactly once and keeps no logs on your behalf.',
    },
    {
      emoji: '🔗',
      title: 'Account linking',
      description:
        'LINE’s security-hardened flow for binding a LINE identity to an existing customer record, rather than the home-grown version LINE warns against.',
    },
    {
      emoji: '🍱',
      title: 'Rich menus & segmentation',
      description:
        'Per-user rich menus driven from CRM state, plus the audience work the API cannot reach and that has to be designed around.',
    },
    {
      emoji: '💴',
      title: 'Quota design',
      description:
        'Costing the plan against your real send pattern. Replies and 1:1 chat are quota-exempt in Japan, so conversational designs cost less than broadcast ones.',
    },
  ],

  industryHeading: 'What this looks like in your industry',
  industries: [
    {
      label: 'Retail & commerce',
      title: 'The Official Account as the storefront, not the leaflet',
      description:
        'Friend-add from a QR code in store, a rich menu that exposes ordering and order status, and every interaction keyed to a CRM record. Central Chat & Shop in Thailand runs this pattern at over a thousand customer conversations a day.',
      benefits: [
        { text: 'In-store QR capture straight into the CRM with consent' },
        { text: 'Rich menu wired to ordering, pickup and order status' },
        { text: 'Loyalty state read from the CRM and reflected per user' },
        { text: 'Narrowcast segments built from CRM data, not guesswork' },
      ],
    },
    {
      label: 'Financial services',
      title: 'Transaction alerts that arrive, at a fraction of SMS',
      description:
        'In Thailand, LINE Official Notifications reach customers by phone number even where they have not added the Official Account. Yuanta published a 91.04% delivery rate against SMS at up to 80% lower cost.',
      benefits: [
        { text: 'Transactional alerts fired from the core system' },
        { text: 'Official Notifications assessed against your verification status' },
        { text: 'Consent and wording version stored per customer' },
        { text: 'Sensitive content filtered before anything reaches the CRM' },
      ],
    },
    {
      label: 'Hospitality & F&B',
      title: 'One CRM behind several brands on one app',
      description:
        'Multi-brand groups end up with an Official Account per brand and no shared view of the customer. Food Passion consolidated five brands into a single CRM on LINE. The architecture decision that makes that possible is the provider layout, and it has to be right first time.',
      benefits: [
        { text: 'Provider architecture that keeps user IDs consistent across brands' },
        { text: 'Bookings and waitlists written back to the venue system' },
        { text: 'Membership binding across brands without breaking LINE’s linking rules' },
        { text: 'Campaign reporting that attributes to a brand, not just an account' },
      ],
    },
    {
      label: 'Professional services',
      title: 'Enquiry to engagement without leaving the app',
      description:
        'Clients in Japan, Taiwan and Thailand will answer on LINE and ignore email. Enquiry capture, document chase and scheduling run against the matter or engagement record, with the whole thread visible to whoever picks it up.',
      benefits: [
        { text: 'Enquiry capture into the CRM with source and consent attached' },
        { text: 'Scheduling wired to the consultant who owns the relationship' },
        { text: 'Document chase as scheduled push messages' },
        { text: 'Thread history retained where your regulator can see it' },
      ],
    },
  ],

  comparisonHeading: 'Why LINE projects get rebuilt',
  comparisonSubheading:
    'Four decisions that are cheap at the start and expensive to reverse.',
  comparisonTabs: [
    {
      label: 'What goes wrong',
      items: [
        {
          number: '01',
          title: 'The provider was chosen by whoever set it up',
          description:
            'Channels cannot move between providers, and user IDs differ per provider. Get this wrong and consolidating later means re-identifying every contact.',
        },
        {
          number: '02',
          title: 'The Official Account is already occupied',
          description:
            'A vendor chat tool holds the one Messaging API channel. The integration you scoped cannot be installed alongside it.',
        },
        {
          number: '03',
          title: 'Nobody stored the inbound messages',
          description:
            'LINE serves each webhook once and keeps no logs. The conversation history you assumed you could export was never retained.',
        },
        {
          number: '04',
          title: 'The automation platform turned out not to support it',
          description:
            'n8n’s LINE node is deprecated and non-functional since LINE Notify closed. Zapier has no LINE app at all. Plans built on either have to start again.',
        },
      ],
    },
    {
      label: 'How we build it',
      items: [
        {
          number: '01',
          title: 'Provider architecture designed before anything is created',
          description:
            'One provider across Messaging API, LINE Login and LIFF, so the same user is the same ID everywhere and no linking step is needed.',
        },
        {
          number: '02',
          title: 'Channel occupancy checked during scoping',
          description:
            'We establish what already holds the OA before quoting, and cost the module-channel path properly if you need it.',
        },
        {
          number: '03',
          title: 'Persistence designed in from the first webhook',
          description:
            'Durable storage of every inbound event and media reference, because the platform gives you exactly one chance at each.',
        },
        {
          number: '04',
          title: 'A path that does not depend on a dead connector',
          description:
            'Built against the Messaging API directly, or on middleware we have verified currently works — not on a node that stopped functioning in 2025.',
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
      title: 'Account & provider audit',
      description:
        'What Official Accounts exist, which provider owns them, what already occupies the Messaging API channel, and whether your verification status supports what you want to send.',
    },
    {
      number: '02',
      title: 'Identity & consent design',
      description:
        'How a user ID becomes a contact, where the LIFF capture sits, what consent wording you use, and how that satisfies PDPA or APPI as well as LINE’s own data policy.',
    },
    {
      number: '03',
      title: 'Build, with persistence first',
      description:
        'Signature validation, durable event storage, retries and alerting — before any of the features, because LINE will not give you a second chance at an inbound message.',
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
    'Thirty minutes. We will tell you what your Official Account can and cannot support before we quote you anything.',

  faqs: [
    {
      q: 'Can LINE connect to monday.com?',
      a: 'Not with anything you can buy. monday.com has no LINE app in its marketplace and does not appear in LINE’s technology-partner directory, so there is no product to install. We build the path directly: a LINE Messaging API webhook with signature validation, a durable store for inbound events, identity resolution, and writes into monday’s GraphQL API so a conversation becomes an item with updates and a status your existing automations already react to.',
    },
    {
      q: 'Does HubSpot support LINE?',
      a: 'Not natively. HubSpot’s own documentation lists the channels you can connect directly — team email, chat, Facebook Messenger, forms, WhatsApp and calling — and routes everything else, LINE included, to the Custom Channels API, which requires Sales Hub or Service Hub Professional plus HubSpot Credits. That API is a genuine path rather than a dead end, and building on it is most of what a LINE-plus-HubSpot engagement involves. Worth knowing for comparison: Salesforce, Dynamics 365 and Zoho SalesIQ do support LINE natively.',
    },
    {
      q: 'Why can we not just use Zapier or n8n for this?',
      a: 'Zapier has no LINE integration at all. n8n’s LINE node is formally deprecated and non-functional — it was built on LINE Notify, which LINE terminated on 31 March 2025, and no Messaging API replacement shipped. Make.com is the real option: it has a genuine LINE app with a webhook trigger and fourteen actions. Its gap is specific but awkward, because there is no module to fetch a 1:1 user profile, only group and room members, so resolving an inbound user ID into a name already needs a raw API call. For most CRM work we build against the Messaging API directly.',
    },
    {
      q: 'How do we get a customer’s phone number or email from LINE?',
      a: 'LINE will not give them to you. The Messaging API returns a display name, icon, status message and language, and nothing more. Contact details come from the customer: a LIFF form rendered inside LINE against an already-known user ID is the standard pattern, and it lets you capture explicit consent in the same step. The LINE Login email scope is an alternative but requires a separate application to LINE documenting your collection practices. PC-only users cannot consent to profile access at all, so your data model has to tolerate a contact with an ID and no name.',
    },
    {
      q: 'Is a friend-add the same as marketing consent?',
      a: 'No, and treating it as one is the most common compliance mistake we see. Nothing in LINE’s terms makes a friend-add a lawful basis for marketing. Under Thailand’s PDPA consent must be explicit, separated from other content, and as easy to withdraw as to give. LINE also imposes its own rules on top: user information obtained through LINE belongs to LY Corporation, friend and group information must not be stored beyond 24 hours, and your CRM vendor and any AI service you use count as contractors with obligations flowed down to them.',
    },
    {
      q: 'How long does a LINE integration take to deliver?',
      a: 'Most engagements run four to twelve weeks from kickoff depending on scope. The variables are usually account verification, which LINE only accepts applications for in Japan, Taiwan and Thailand, and whether the Official Account already has something occupying its Messaging API channel. We establish both during scoping rather than discovering them mid-build.',
    },
  ],

  closing: {
    heading: 'Make LINE part of the system,',
    headingAccent: 'not a separate inbox.',
    lead: 'Book a 30-minute discovery call. We will give you a frank read on scope, fit and cost.',
  },
}
