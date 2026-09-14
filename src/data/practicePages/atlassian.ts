import type { PracticePage } from './types'

/**
 * /atlassian-consulting cluster — copy ported verbatim from the v2.1 mockups
 * (atlassian-consulting.html + jira / confluence / jira-service-management /
 * jira-to-monday-migration leaves), surname corrected to Jebathilak.
 */

const HUB = { label: 'Atlassian Consulting', href: '/atlassian-consulting' }

export const ATLASSIAN_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/atlassian-consulting',
    seoTitle: 'Atlassian Consulting Partner | Fruition: Jira, Confluence & JSM, AU · UK · US',
    seoDescription:
      'Fruition delivers Atlassian consulting across Australia, the UK, and the US: Jira, Confluence, and JSM implementation and optimisation, plus honest advice on when Atlassian is and isn’t your answer.',
    breadcrumb: [HUB],
    eyebrow: '★ Atlassian Consulting Hub',
    heading: 'Atlassian expertise from a firm that sees both sides',
    lead: 'Fruition delivers Atlassian consulting across Australia, the UK, and the US: Jira, Confluence, and JSM implementation and optimisation, plus honest advice on when Atlassian is and isn’t your answer.',
    targetQueries: [
      'Atlassian consultant Sydney',
      'Jira consultant',
      'Jira partner UK',
      'Confluence implementation',
      'Jira Service Management consulting',
    ],
    approachHeading: 'Cross-platform honesty as a feature.',
    approach: [
      {
        title: 'Optimise what you have',
        body: 'Most Jira pain is configuration debt, not platform failure. We untangle workflow sprawl, permission chaos, and plugin bloat before recommending anything drastic.',
      },
      {
        title: 'Integrate, don’t isolate',
        body: 'Jira connected to monday.com, Slack, and your delivery stack, because dev tools that don’t talk to business tools create the visibility gap leadership complains about.',
      },
      {
        title: 'Migrate when it’s right',
        body: 'As both an Atlassian and monday.com Platinum partner, we’re the rare firm that migrates in either direction and tells you honestly which fits.',
      },
    ],
    servicesHeading: 'The Atlassian service line.',
    services: [
      {
        title: 'Jira implementation & optimisation',
        body: 'Project configuration, workflow design, permission schemes, and the cleanup engagements that rescue sprawling instances.',
      },
      {
        title: 'Confluence knowledge systems',
        body: 'Space architecture, template systems, and governance that make Confluence a knowledge base instead of a document graveyard.',
      },
      {
        title: 'Jira Service Management',
        body: 'ITSM builds: service desks, SLAs, asset management, and customer portals.',
      },
      {
        title: 'Jira → monday migration',
        body: 'Structured cross-platform migration when teams need business-wide visibility Jira can’t give them.',
      },
    ],
    childrenEyebrow: 'Atlassian pages',
    childrenHeading: 'Go deeper.',
    children: [
      {
        label: 'Jira Consulting',
        description: 'Implementation, optimisation, and workflow rescue',
        href: '/atlassian-consulting/jira',
      },
      {
        label: 'Confluence',
        description: 'Knowledge architecture and governance',
        href: '/atlassian-consulting/confluence',
      },
      {
        label: 'Jira Service Management',
        description: 'ITSM, service desks, and SLA automation',
        href: '/atlassian-consulting/jira-service-management',
      },
      {
        label: 'Jira → monday Migration',
        description: 'The structured cross-platform migration playbook',
        href: '/atlassian-consulting/jira-to-monday-migration',
      },
    ],
    faqs: [
      {
        q: 'What does an Atlassian consultant do?',
        a: 'An Atlassian consultant implements, optimises, and integrates Jira, Confluence, and Jira Service Management, covering workflow design, permission architecture, plugin strategy, and cross-tool integration. Fruition delivers these services across Australia, the UK, and the US.',
      },
      {
        q: 'Can Fruition help with a messy Jira instance?',
        a: 'Yes: Jira rescue engagements are a core service: workflow consolidation, permission scheme cleanup, plugin audit, and board restructure. Most instances accumulate years of configuration debt that a structured 3–4 week cleanup resolves.',
      },
      {
        q: 'Should we use Jira or monday.com?',
        a: 'Jira wins for deep software delivery with heavy ecosystem needs; monday.com wins for cross-functional visibility and business-team adoption. Many organisations run both, integrated. Fruition partners with both vendors and advises per team, see our Jira-to-monday migration page for when switching makes sense.',
      },
      {
        q: 'How much does Atlassian consulting cost with Fruition?',
        a: 'Fruition Atlassian engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Atlassian services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Atlassian engagement take?',
        a: 'Most Atlassian engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  jira: {
    path: '/atlassian-consulting/jira',
    seoTitle: 'Jira Consultant | Fruition: Implementation, Optimisation & Workflow Rescue',
    seoDescription:
      'Fruition delivers Jira consulting across Australia, the UK, and the US: implementations that start clean, rescues that untangle years of configuration debt, and integrations that end the visibility gap.',
    breadcrumb: [HUB, { label: 'Jira', href: '/atlassian-consulting/jira' }],
    eyebrow: 'Atlassian · Jira',
    heading: 'Jira that developers tolerate and leaders can read',
    lead: 'Fruition delivers Jira consulting across Australia, the UK, and the US: implementations that start clean, rescues that untangle years of configuration debt, and integrations that end the visibility gap.',
    approachHeading: 'Configuration discipline.',
    approach: [
      {
        title: 'Workflow minimalism',
        body: 'Every status, transition, and required field must earn its place. Most Jira misery is workflow maximalism nobody remembers approving.',
      },
      {
        title: 'Permission sanity',
        body: 'Scheme consolidation and role-based access that admins can actually reason about, and auditors can actually audit.',
      },
      {
        title: 'Business-tool bridges',
        body: 'Jira↔monday.com and Jira↔Slack integrations that give non-technical stakeholders visibility without Jira licences or training.',
      },
    ],
    servicesHeading: 'Jira engagements we run.',
    services: [
      {
        title: 'New implementations',
        body: 'Greenfield Jira setups with disciplined project templates, workflow standards, and governance from day one.',
      },
      {
        title: 'Instance rescue',
        body: 'The 3–4 week cleanup: workflow consolidation, permission untangling, plugin audit, and board restructure.',
      },
      {
        title: 'Advanced workflows',
        body: 'Automation rules, cross-project dependencies, and release management for scaled delivery organisations.',
      },
      {
        title: 'Integration builds',
        body: 'GitHub, Bitbucket, monday.com, Slack, and CI/CD pipeline connections.',
      },
    ],
    faqs: [
      {
        q: 'How much does Jira consulting cost?',
        a: 'Fruition Jira engagements start at AUD $12,000 for a structured optimisation or focused implementation; instance rescues and scaled implementations are quoted after a configuration audit, typically AUD $15,000–$60,000.',
      },
      {
        q: 'Our Jira is a mess, rebuild or restructure?',
        a: 'Usually restructure. A configuration audit (week one of any rescue) determines whether consolidation is viable; full rebuilds are reserved for instances where migration cost is lower than cleanup cost, rarer than frustrated admins expect.',
      },
      {
        q: 'Which regions does Fruition deliver Jira services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Jira engagement take?',
        a: 'Most Jira engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  confluence: {
    path: '/atlassian-consulting/confluence',
    seoTitle: 'Confluence Consulting | Fruition: Knowledge Architecture That Stays Findable',
    seoDescription:
      'Fruition delivers Confluence consulting across Australia, the UK, and the US: space architecture, governance, and content structure that keeps knowledge findable at year three, not just week three.',
    breadcrumb: [HUB, { label: 'Confluence', href: '/atlassian-consulting/confluence' }],
    eyebrow: 'Atlassian · Confluence',
    heading: 'Confluence as a knowledge base, not a document graveyard',
    lead: 'Fruition delivers Confluence consulting across Australia, the UK, and the US: space architecture, governance, and content structure that keeps knowledge findable at year three, not just week three.',
    approachHeading: 'Architecture beats enthusiasm.',
    approach: [
      {
        title: 'Space strategy first',
        body: 'Deliberate space taxonomy, ownership models, and lifecycle rules: the difference between a knowledge base and 4,000 orphaned pages.',
      },
      {
        title: 'Templates as governance',
        body: 'Structured templates for the content types that matter, making the right format the easy format.',
      },
      {
        title: 'AI-ready knowledge',
        body: 'Content structured for retrieval, which pays off doubly when you point RAG systems at it later. Our AI practice does exactly that.',
      },
    ],
    servicesHeading: 'Confluence engagements.',
    services: [
      {
        title: 'Knowledge architecture',
        body: 'Space design, page hierarchies, labels, and navigation for organisations from 50 to 5,000 users.',
      },
      {
        title: 'Content migration',
        body: 'Structured moves from SharePoint, Notion, Google Drive, or legacy wikis with cleanup en route.',
      },
      {
        title: 'Governance programs',
        body: 'Ownership models, review cadences, archival rules, and the analytics to enforce them.',
      },
      {
        title: 'Jira integration',
        body: 'Requirements, documentation, and decision records linked into delivery workflows.',
      },
    ],
    faqs: [
      {
        q: 'Why does our Confluence become unusable over time?',
        a: 'Unmanaged growth: no space strategy, no ownership, no archival rules. Content accretes until search returns five conflicting versions of everything. A governance retrofit (taxonomy, ownership, lifecycle), reverses it in 4–6 weeks.',
      },
      {
        q: 'How much does Confluence consulting cost with Fruition?',
        a: 'Fruition Confluence engagements start at AUD $10,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Confluence services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Confluence engagement take?',
        a: 'Most Confluence engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'jira-service-management': {
    path: '/atlassian-consulting/jira-service-management',
    seoTitle: 'Jira Service Management Consulting | Fruition: ITSM, Service Desks & SLAs',
    seoDescription:
      'Fruition implements Jira Service Management for IT and support teams across Australia, the UK, and the US: service desks, SLA automation, asset management, and portals users actually use.',
    breadcrumb: [HUB, { label: 'Jira Service Management', href: '/atlassian-consulting/jira-service-management' }],
    eyebrow: 'Atlassian · JSM',
    heading: 'ITSM that resolves tickets instead of routing them in circles',
    lead: 'Fruition implements Jira Service Management for IT and support teams across Australia, the UK, and the US: service desks, SLA automation, asset management, and portals users actually use.',
    approachHeading: 'Service design before tool config.',
    approach: [
      {
        title: 'Request-type discipline',
        body: 'A curated request catalogue with smart forms, not 90 request types nobody can choose between.',
      },
      {
        title: 'SLAs that mean something',
        body: 'Escalation rules and breach alerts tied to commitments your team can actually keep.',
      },
      {
        title: 'Dev-connected incidents',
        body: 'Incidents linked to Jira Software issues so support and engineering work one thread, not two ticket systems.',
      },
    ],
    servicesHeading: 'JSM engagements.',
    services: [
      {
        title: 'Service desk implementation',
        body: 'Request catalogues, queues, automation, and portal design for IT and internal service teams.',
      },
      {
        title: 'SLA & escalation design',
        body: 'Priority matrices, escalation chains, and the reporting that keeps commitments visible.',
      },
      {
        title: 'Asset & configuration management',
        body: 'Insight-based asset tracking connected to incident and change workflows.',
      },
      {
        title: 'Alternative honesty',
        body: 'When JSM is overkill or underpowered, we’ll say so: monday Service and other options compared straight.',
      },
    ],
    faqs: [
      {
        q: 'Jira Service Management vs monday Service, which should we choose?',
        a: 'JSM wins for IT teams deep in the Atlassian ecosystem with dev-connected incident workflows; monday Service wins for business-wide service teams already on monday.com. Fruition implements both and advises per situation, a genuine rarity among partners.',
      },
      {
        q: 'How much does Jira Service Management consulting cost with Fruition?',
        a: 'Fruition Jira Service Management engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Jira Service Management services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Jira Service Management engagement take?',
        a: 'Most Jira Service Management engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'jira-to-monday-migration': {
    path: '/atlassian-consulting/jira-to-monday-migration',
    seoTitle: 'Jira to monday.com Migration | Fruition: The Structured Migration Playbook',
    seoDescription:
      'Fruition runs structured Jira-to-monday.com migrations across Australia, the UK, and the US, as the rare partner certified on both platforms, with the Givergy case study to prove the playbook.',
    breadcrumb: [HUB, { label: 'Jira → monday Migration', href: '/atlassian-consulting/jira-to-monday-migration' }],
    eyebrow: '★ Bridge Page · Atlassian × monday.com',
    heading: 'Leave Jira without leaving your history behind',
    lead: 'Fruition runs structured Jira-to-monday.com migrations across Australia, the UK, and the US, as the rare partner certified on both platforms, with the Givergy case study to prove the playbook.',
    targetQueries: [
      'Jira to monday.com migration',
      'migrate Jira to monday',
      'Jira alternative for business teams',
      'leave Jira',
      'Jira export to monday',
    ],
    approachHeading: 'The dual-certification advantage.',
    approach: [
      {
        title: 'Certified both sides',
        body: 'Atlassian consulting practice plus monday.com Platinum status means we map Jira concepts to monday architecture correctly: epics, sprints, components, and custom fields all land somewhere sensible.',
      },
      {
        title: 'History preserved',
        body: 'Issues, comments, attachments, and status history migrate with integrity, because losing three years of context is how migrations get reversed.',
      },
      {
        title: 'Workflow rebuild, not replication',
        body: 'Migration is the moment to fix process debt. We rebuild automation on monday-native patterns rather than replicating Jira’s workarounds.',
      },
    ],
    servicesEyebrow: 'The playbook',
    servicesHeading: 'How the migration runs.',
    services: [
      {
        title: 'Audit & mapping (wk 1–2)',
        body: 'Full Jira inventory: projects, workflows, custom fields, plugins, integrations. Mapping document to monday architecture with gap analysis.',
      },
      {
        title: 'Structure build (wk 2–4)',
        body: 'monday workspace, board, and automation architecture built and validated with pilot team data.',
      },
      {
        title: 'Migration & validation (wk 4–6)',
        body: 'Staged data migration with parallel-run validation. GitHub integration cutover for dev teams, the Givergy pattern.',
      },
      {
        title: 'Training & cutover (wk 6–8)',
        body: 'Role-based training, hypercare support, and Jira decommission planning.',
      },
    ],
    faqs: [
      {
        q: 'Why do teams migrate from Jira to monday.com?',
        a: 'The recurring drivers: cross-functional visibility (business teams can’t or won’t use Jira), admin overhead, licence cost at scale, and configuration debt. Teams keeping deep dev-tool dependencies sometimes keep Jira for engineering and integrate: Fruition advises which pattern fits before any migration starts.',
      },
      {
        q: 'Can Jira history and attachments migrate to monday.com?',
        a: 'Yes: issues, comments, attachments, and status history migrate through Fruition’s staged process. Some Jira-specific constructs (complex workflow conditions, certain plugin data) are rebuilt rather than copied; the audit phase documents exactly what maps where.',
      },
      {
        q: 'How long does a Jira to monday migration take?',
        a: 'Typically 6–8 weeks for a multi-team migration: two weeks audit and mapping, two weeks structure build, two weeks staged migration and validation, and one to two weeks training and cutover. Single-team moves run faster.',
      },
      {
        q: 'What did the Givergy migration achieve?',
        a: 'Givergy moved from Jira and BitBucket silos to monday Dev with GitHub integration: automated branch tracking, unified multi-repository visibility, and role-based dashboards giving developers, QA, and management customised views of one source of truth.',
      },
      {
        q: 'How much does Jira to monday migration consulting cost with Fruition?',
        a: 'Fruition Jira to monday migration engagements start at AUD $15,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Jira to monday migration services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
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
