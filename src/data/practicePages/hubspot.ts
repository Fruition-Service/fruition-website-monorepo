import type { PracticePage } from './types'

/**
 * /hubspot-consulting cluster — copy ported verbatim from the v2.1 mockups
 * (hubspot-consulting.html + implementation / breeze-ai /
 * monday-hubspot-integration / hubspot-to-monday-migration leaves),
 * surname corrected to Jebathilak.
 */

const HUB = { label: 'HubSpot Consulting', href: '/hubspot-consulting' }

export const HUBSPOT_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/hubspot-consulting',
    seoTitle: 'HubSpot Consulting Partner | Fruition: Implementation, Breeze AI & Integration, AU · UK · US',
    seoDescription:
      'Fruition delivers HubSpot consulting across Australia, the UK, and the US (implementation, Breeze AI enablement, and integrations) as a multi-platform firm that recommends HubSpot when it fits and says so when it doesn’t.',
    breadcrumb: [HUB],
    eyebrow: '★ HubSpot Consulting Hub',
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
    childrenEyebrow: 'HubSpot pages',
    childrenHeading: 'Go deeper.',
    children: [
      {
        label: 'Implementation',
        description: 'Marketing, Sales & Service Hub setups done properly',
        href: '/hubspot-consulting/implementation',
      },
      {
        label: 'Breeze AI',
        description: 'HubSpot’s AI layer, configured and governed',
        href: '/hubspot-consulting/breeze-ai',
      },
      {
        label: 'monday ↔ HubSpot Integration',
        description: 'Two platforms, one system',
        href: '/hubspot-consulting/monday-hubspot-integration',
      },
      {
        label: 'HubSpot → monday Migration',
        description: 'Structured CRM migration with history intact',
        href: '/hubspot-consulting/hubspot-to-monday-migration',
      },
    ],
    faqs: [
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
    ],
  },

  implementation: {
    path: '/hubspot-consulting/implementation',
    seoTitle: 'HubSpot Implementation | Fruition: Marketing, Sales & Service Hub Setups',
    seoDescription:
      'Fruition implements HubSpot for teams across Australia, the UK, and the US: portal architecture, lifecycle design, and automation that make the platform earn its licence fee.',
    breadcrumb: [HUB, { label: 'Implementation', href: '/hubspot-consulting/implementation' }],
    eyebrow: 'HubSpot · Implementation',
    heading: 'HubSpot set up right the first time',
    lead: 'Fruition implements HubSpot for teams across Australia, the UK, and the US: portal architecture, lifecycle design, and automation that make the platform earn its licence fee.',
    approachHeading: 'Architecture before automation.',
    approach: [
      {
        title: 'Lifecycle stages that mean something',
        body: 'Deal stages, lifecycle stages, and lead status mapped to your actual funnel: the foundation everything else depends on.',
      },
      {
        title: 'Data hygiene from day one',
        body: 'Property governance, deduplication rules, and required-field discipline before the database becomes a swamp.',
      },
      {
        title: 'Reporting leaders trust',
        body: 'Attribution and pipeline reporting configured so the Monday revenue meeting runs off HubSpot, not a spreadsheet export.',
      },
    ],
    servicesEyebrow: 'What we implement',
    servicesHeading: 'Across all three Hubs.',
    services: [
      {
        title: 'Marketing Hub',
        body: 'Email, forms, landing pages, lead scoring, and campaign attribution: HubSpot’s strongest surface, configured properly.',
      },
      {
        title: 'Sales Hub',
        body: 'Pipelines, sequences, playbooks, and forecast configuration for sales teams.',
      },
      {
        title: 'Service Hub',
        body: 'Ticketing, knowledge base, and feedback loops connected to the customer record.',
      },
      {
        title: 'Integrations',
        body: 'Aircall telephony, Xero, monday.com, and the webhook-level connections packaged apps can’t do.',
      },
    ],
    faqs: [
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
        q: 'Why choose Fruition over a Big-4 consulting firm?',
        a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 900+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms, so recommendations are cross-platform and honest.',
      },
      {
        q: 'Can Fruition deliver this remotely?',
        a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
      },
    ],
  },

  'breeze-ai': {
    path: '/hubspot-consulting/breeze-ai',
    seoTitle: 'HubSpot Breeze AI Consulting | Fruition: Agents, Copilot & AI Governance',
    seoDescription:
      'Fruition enables HubSpot’s Breeze AI for teams across Australia, the UK, and the US: agents, copilot, and intelligence features configured with real AI governance, by a firm that builds AI systems beyond HubSpot too.',
    breadcrumb: [HUB, { label: 'Breeze AI', href: '/hubspot-consulting/breeze-ai' }],
    eyebrow: '★ Bridge Page · HubSpot × AI Consulting',
    heading: 'Breeze AI configured by an actual AI practice',
    lead: 'Fruition enables HubSpot’s Breeze AI for teams across Australia, the UK, and the US: agents, copilot, and intelligence features configured with real AI governance, by a firm that builds AI systems beyond HubSpot too.',
    targetQueries: [
      'HubSpot Breeze AI setup',
      'Breeze agents consultant',
      'HubSpot AI implementation',
      'Breeze intelligence configuration',
    ],
    approachHeading: 'The bridge between two practices.',
    approach: [
      {
        title: 'Native Breeze first',
        body: 'Breeze agents, copilot, and intelligence cover substantial ground. We configure the native layer fully before recommending anything custom.',
      },
      {
        title: 'Governed like real AI',
        body: 'Usage policies, output review gates, and data-handling rules applied to Breeze with the same discipline as our enterprise AI work.',
      },
      {
        title: 'Escalation without handoff',
        body: 'When workloads outgrow Breeze (custom agents, deep RAG, cross-platform orchestration), our AI consulting practice continues the work. Same team.',
      },
    ],
    servicesEyebrow: 'What we configure',
    servicesHeading: 'The Breeze surface.',
    services: [
      {
        title: 'Breeze agents',
        body: 'Content, social, and prospecting agents configured to your brand voice, ICP, and approval workflows.',
      },
      {
        title: 'Breeze copilot',
        body: 'Team enablement on the CRM-embedded assistant, the prompts and patterns that produce real output.',
      },
      {
        title: 'Breeze intelligence',
        body: 'Data enrichment, buyer intent, and form shortening configured with data governance attached.',
      },
      {
        title: 'Beyond Breeze',
        body: 'Custom AI agents, n8n orchestration, and RAG systems connected to HubSpot data via our AI practice.',
      },
    ],
    faqs: [
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
        q: 'Why choose Fruition over a Big-4 consulting firm?',
        a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 900+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms, so recommendations are cross-platform and honest.',
      },
      {
        q: 'Can Fruition deliver this remotely?',
        a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
      },
    ],
  },

  'monday-hubspot-integration': {
    path: '/hubspot-consulting/monday-hubspot-integration',
    seoTitle: 'monday.com HubSpot Integration | Fruition: Two Platforms, One System',
    seoDescription:
      'Fruition builds monday↔HubSpot integrations for teams across Australia, the UK, and the US: certified on both platforms, so the sync architecture respects how each side actually works.',
    breadcrumb: [HUB, { label: 'monday ↔ HubSpot Integration', href: '/hubspot-consulting/monday-hubspot-integration' }],
    eyebrow: '★ Bridge Page · monday.com × HubSpot',
    heading: 'Marketing in HubSpot. Delivery in monday. One system',
    lead: 'Fruition builds monday↔HubSpot integrations for teams across Australia, the UK, and the US: certified on both platforms, so the sync architecture respects how each side actually works.',
    targetQueries: [
      'monday.com HubSpot integration',
      'sync HubSpot with monday',
      'HubSpot to monday automation',
      'connect CRM to project management',
    ],
    approachHeading: 'Dual certification, real architecture.',
    approach: [
      {
        title: 'Clear system-of-record rules',
        body: 'Every field has one owner. Contacts master in HubSpot, delivery status masters in monday: ambiguity is where syncs rot.',
      },
      {
        title: 'Native first, n8n where needed',
        body: 'The native integration where it suffices; n8n or Make middleware where field mapping, transformation, or error handling demand more.',
      },
      {
        title: 'Built for failure modes',
        body: 'Rate limits, deletion handling, and conflict resolution designed in: the difference between an integration and a demo.',
      },
    ],
    servicesEyebrow: 'Integration patterns',
    servicesHeading: 'What we typically connect.',
    services: [
      {
        title: 'Deal → project handoff',
        body: 'Closed-won deals in HubSpot spawn structured monday project boards with brief data pre-populated.',
      },
      {
        title: 'Bi-directional status sync',
        body: 'Delivery milestones from monday flowing back to HubSpot so account teams see project reality in the CRM.',
      },
      {
        title: 'Marketing → operations flow',
        body: 'Campaign requests and content production bridging from HubSpot campaigns into monday marketing boards.',
      },
      {
        title: 'Revenue reporting unification',
        body: 'Pipeline and delivery data combined into dashboards leadership reads in one place.',
      },
    ],
    faqs: [
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
        q: 'Why choose Fruition over a Big-4 consulting firm?',
        a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 900+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms, so recommendations are cross-platform and honest.',
      },
      {
        q: 'Can Fruition deliver this remotely?',
        a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
      },
    ],
  },

  'hubspot-to-monday-migration': {
    path: '/hubspot-consulting/hubspot-to-monday-migration',
    seoTitle: 'HubSpot to monday CRM Migration | Fruition: Structured CRM Migration Playbook',
    seoDescription:
      'Fruition runs structured HubSpot-to-monday CRM migrations across Australia, the UK, and the US, as the partner certified on both platforms, with a playbook built from dozens of CRM moves.',
    breadcrumb: [HUB, { label: 'HubSpot → monday Migration', href: '/hubspot-consulting/hubspot-to-monday-migration' }],
    eyebrow: '★ Bridge Page · HubSpot × monday.com',
    heading: 'Leave HubSpot with your pipeline history intact',
    lead: 'Fruition runs structured HubSpot-to-monday CRM migrations across Australia, the UK, and the US, as the partner certified on both platforms, with a playbook built from dozens of CRM moves.',
    targetQueries: [
      'HubSpot to monday CRM migration',
      'migrate off HubSpot',
      'HubSpot alternative CRM',
      'monday CRM vs HubSpot cost',
    ],
    approachHeading: 'Why teams make this move, and how.',
    approach: [
      {
        title: 'The consolidation driver',
        body: 'Teams running delivery on monday tire of the two-platform tax: double licences, sync overhead, and split reporting. CRM consolidation onto monday removes all three.',
      },
      {
        title: 'The cost driver',
        body: 'HubSpot development and admin costs escalate with sophistication; monday’s flexibility means teams manage their own system after training. Our clients have cut technical administration costs materially on this move.',
      },
      {
        title: 'History preserved',
        body: 'Contacts, companies, deals, activity timelines, and attachments migrate with integrity through a staged, validated process.',
      },
    ],
    servicesEyebrow: 'The playbook',
    servicesHeading: 'How the migration runs.',
    services: [
      {
        title: 'Audit & mapping (wk 1)',
        body: 'Full HubSpot inventory: properties, pipelines, workflows, integrations. Field-by-field mapping to monday CRM architecture.',
      },
      {
        title: 'CRM build (wk 2–3)',
        body: 'monday CRM structure: boards, mirror-column architecture, automation recipes replacing HubSpot workflows.',
      },
      {
        title: 'Staged migration (wk 3–4)',
        body: 'Contacts, companies, deals, and activity history migrated with parallel-run validation.',
      },
      {
        title: 'Training & cutover (wk 4–5)',
        body: 'Sales team training, integration cutover (email, telephony, forms), and HubSpot decommission planning.',
      },
    ],
    faqs: [
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
