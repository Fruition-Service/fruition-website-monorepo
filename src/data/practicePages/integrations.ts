import type { PracticePage } from './types'

/**
 * /integrations cluster — copy ported verbatim from the v2.1 mockups
 * (integrations.html + aircall / twilio / make / zapier leaves), surname
 * corrected to Jebathilak.
 *
 * n8n deliberately has no /integrations leaf: the mockup's n8n card points to
 * the AI practice, and the live credential page is
 * /partnerships/n8n-integration-partner — the hub card links there.
 */

const HUB = { label: 'Integrations', href: '/integrations' }

export const INTEGRATIONS_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/integrations',
    seoTitle: 'Platform Integrations | Fruition: Aircall, Twilio, Make, n8n, Zapier Consulting',
    seoDescription:
      'Fruition builds and maintains the integrations that make your stack behave like one system: telephony, automation middleware, and the API-level work packaged connectors can’t do. Australia, the UK, and the US.',
    breadcrumb: [HUB],
    eyebrow: 'Integrations Hub',
    heading: 'The connective tissue between your platforms',
    lead: 'Fruition builds and maintains the integrations that make your stack behave like one system: telephony, automation middleware, and the API-level work packaged connectors can’t do. Australia, the UK, and the US.',
    approachHeading: 'Integrations as products, not favours.',
    approach: [
      {
        title: 'Error handling first',
        body: 'Rate limits, retries, dead-letter queues, and alerting designed in, because integrations that fail silently corrupt trust in every connected system.',
      },
      {
        title: 'Documented and owned',
        body: 'Every integration ships with architecture documentation and a named maintenance path. No mystery middleware.',
      },
      {
        title: 'Platform-native where possible',
        body: 'Native connectors where they suffice, middleware only where mapping and logic demand it, minimising the moving parts you pay to maintain.',
      },
    ],
    servicesEyebrow: 'The toolkit',
    servicesHeading: 'Tools we integrate daily.',
    services: [
      {
        title: 'Aircall',
        body: 'Cloud telephony wired into monday.com and HubSpot: call logging, ticket creation, and rep performance dashboards.',
      },
      {
        title: 'Twilio',
        body: 'Programmable SMS and voice for notification workflows, customer comms, and AI voice experiments.',
      },
      {
        title: 'Make',
        body: 'Visual automation for teams that need more than Zapier and less than code.',
      },
      {
        title: 'n8n',
        body: 'Our preferred platform for AI-driven and self-hosted automation, covered in depth in the AI practice.',
      },
      {
        title: 'Zapier',
        body: 'Quick-connect automation where speed beats sophistication, plus migrations off it when you outgrow it.',
      },
      {
        title: 'WhatsApp, LINE and Viber',
        body: 'The messaging apps your customers already use, wired into the CRM, ERP or lead workflow that runs the business.',
      },
    ],
    childrenEyebrow: 'Integration pages',
    childrenHeading: 'By tool.',
    children: [
      {
        label: 'Aircall',
        description: 'Telephony connected to your CRM and service desk',
        href: '/partnerships/aircall-partner',
      },
      {
        label: 'Twilio',
        description: 'SMS, voice, and programmable comms workflows',
        href: '/integrations/twilio',
      },
      {
        label: 'Make',
        description: 'Visual automation scenarios, built properly',
        href: '/partnerships/make-partners',
      },
      {
        label: 'n8n',
        description: 'Agentic automation, covered in the AI practice',
        href: '/partnerships/n8n-integration-partner',
      },
      {
        label: 'Zapier',
        description: 'Fast connections and structured migrations off them',
        href: '/integrations/zapier',
      },
      {
        label: 'WhatsApp',
        description: 'WhatsApp Business Platform into your CRM and ERP',
        href: '/integrations/whatsapp',
      },
      {
        label: 'LINE',
        description: 'LINE Official Accounts into your CRM and ERP',
        href: '/integrations/line',
      },
      {
        label: 'Viber',
        description: 'Viber Business Messages into your CRM and ERP',
        href: '/integrations/viber',
      },
    ],
    faqs: [
      {
        q: 'Which automation tool should we use: Zapier, Make, or n8n?',
        a: 'Zapier for speed and simplicity at low volume; Make for visual complexity at mid-scale; n8n for AI-driven workflows, high volume, and self-hosting requirements. Fruition implements all three and migrates between them as teams grow.',
      },
      {
        q: 'How much does integration consulting cost with Fruition?',
        a: 'Fruition integration engagements start at AUD $6,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver integration services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical integration engagement take?',
        a: 'Most integration engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  aircall: {
    path: '/integrations/aircall',
    seoTitle: 'Aircall Integration Consulting | Fruition: Telephony in Your CRM & Service Desk',
    seoDescription:
      'Fruition integrates Aircall with monday.com, HubSpot, and your service workflows across Australia, the UK, and the US, so calls create records, tickets, and follow-ups automatically.',
    breadcrumb: [HUB, { label: 'Aircall', href: '/partnerships/aircall-partner' }],
    eyebrow: 'Integrations · Aircall',
    heading: 'Every call, logged where the work happens',
    lead: 'Fruition integrates Aircall with monday.com, HubSpot, and your service workflows across Australia, the UK, and the US, so calls create records, tickets, and follow-ups automatically.',
    approachHeading: 'Telephony as workflow, not hardware.',
    approach: [
      {
        title: 'CRM-native call records',
        body: 'Calls, recordings, and outcomes logged against the right contact and deal automatically: no post-call admin.',
      },
      {
        title: 'Routing that reflects reality',
        body: 'IVR and team routing mapped to how your teams actually split work, with overflow and after-hours logic.',
      },
      {
        title: 'Performance visibility',
        body: 'Call volume, answer rates, and outcome dashboards inside monday or HubSpot where managers already look.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Aircall patterns.',
    services: [
      {
        title: 'Aircall + monday.com',
        body: 'Call events creating and updating items: sales activity logging, service ticket creation, and callback workflows.',
      },
      {
        title: 'Aircall + HubSpot',
        body: 'Native integration configured properly: contact matching, call outcomes on the timeline, and sequence triggers.',
      },
      {
        title: 'Service desk workflows',
        body: 'Inbound support calls spawning tickets with caller context attached before the agent answers.',
      },
      {
        title: 'AI-adjacent extensions',
        body: 'Transcription and call-summary pipelines feeding your CRM, connected to our AI practice for teams going further.',
      },
    ],
    faqs: [
      {
        q: 'Does Aircall integrate with monday.com?',
        a: 'Yes, through native app options and deeper middleware builds. Fruition typically implements call logging, ticket creation, and activity tracking flows, with n8n middleware where routing logic or field mapping exceeds native capability.',
      },
      {
        q: 'How much does Aircall integration consulting cost with Fruition?',
        a: 'Fruition Aircall integration engagements start at AUD $4,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Aircall integration services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Aircall integration engagement take?',
        a: 'Most Aircall integration engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  twilio: {
    path: '/integrations/twilio',
    seoTitle: 'Twilio Consulting | Fruition: SMS, Voice & Programmable Comms Workflows',
    seoDescription:
      'Fruition builds Twilio-powered SMS and voice workflows for teams across Australia, the UK, and the US: appointment reminders, status notifications, and customer comms triggered by your actual systems.',
    breadcrumb: [HUB, { label: 'Twilio', href: '/integrations/twilio' }],
    eyebrow: 'Integrations · Twilio',
    heading: 'Programmable comms wired into your workflows',
    lead: 'Fruition builds Twilio-powered SMS and voice workflows for teams across Australia, the UK, and the US: appointment reminders, status notifications, and customer comms triggered by your actual systems.',
    approachHeading: 'Compliance-aware comms engineering.',
    approach: [
      {
        title: 'Event-driven messaging',
        body: 'SMS and voice triggered by real workflow events (status changes, bookings, escalations), not batch blasts.',
      },
      {
        title: 'Regulatory discipline',
        body: 'Opt-in management, sender ID registration, and regional compliance (Australian Spam Act, TCPA, UK PECR) built into every flow.',
      },
      {
        title: 'Two-way by default',
        body: 'Replies routed back into monday, HubSpot, or your service desk, because one-way SMS is a missed conversation.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Twilio patterns.',
    services: [
      {
        title: 'Notification workflows',
        body: 'Appointment reminders, job status updates, and delivery notifications triggered from monday.com boards.',
      },
      {
        title: 'Two-way SMS service',
        body: 'Customer replies creating tickets and conversations in your service platform with full thread history.',
      },
      {
        title: 'Voice automation',
        body: 'IVR flows, callback systems, and voice notification chains for operational alerts.',
      },
      {
        title: 'AI voice foundations',
        body: 'The Twilio infrastructure layer for teams exploring AI voice agents, bridged to our AI practice.',
      },
    ],
    faqs: [
      {
        q: 'What can Twilio automate for our business?',
        a: 'Any communication triggered by a system event: appointment reminders, job status SMS, escalation calls, two-way customer messaging, and voice workflows. Fruition wires these to monday.com, HubSpot, and your operational platforms with compliance handling included.',
      },
      {
        q: 'How much does Twilio consulting cost with Fruition?',
        a: 'Fruition Twilio engagements start at AUD $5,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Twilio services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Twilio engagement take?',
        a: 'Most Twilio engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  make: {
    path: '/integrations/make',
    seoTitle: 'Make (Integromat) Consulting | Fruition: Visual Automation Built Properly',
    seoDescription:
      'Fruition designs and builds Make automation for teams across Australia, the UK, and the US: multi-step scenarios with the error handling, documentation, and governance DIY builds skip.',
    breadcrumb: [HUB, { label: 'Make', href: '/partnerships/make-partners' }],
    eyebrow: 'Integrations · Make',
    heading: 'Make scenarios that survive contact with production',
    lead: 'Fruition designs and builds Make automation for teams across Australia, the UK, and the US: multi-step scenarios with the error handling, documentation, and governance DIY builds skip.',
    approachHeading: 'Scenarios as maintainable systems.',
    approach: [
      {
        title: 'Architecture before modules',
        body: 'Data flow mapped and system-of-record rules set before any scenario is built, sprawl prevention starts at design.',
      },
      {
        title: 'Error paths on everything',
        body: 'Every scenario ships with error routes, retry logic, and alerting. Silent failures are the automation killer.',
      },
      {
        title: 'Operations documentation',
        body: 'Scenario maps and runbooks so your team can maintain what we build, or we do, under managed service.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Make patterns.',
    services: [
      {
        title: 'Platform sync scenarios',
        body: 'monday ↔ Xero ↔ HubSpot flows with transformation logic and deduplication.',
      },
      {
        title: 'Document workflows',
        body: 'Quote, invoice, and contract generation triggered from board events.',
      },
      {
        title: 'Scenario rescue & audit',
        body: 'Consolidating years of accumulated scenarios into a governed, documented architecture.',
      },
      {
        title: 'Make → n8n migration',
        body: 'Structured moves when AI workloads or self-hosting needs outgrow Make.',
      },
    ],
    faqs: [
      {
        q: 'Make or Zapier, which is better?',
        a: 'Make offers stronger visual logic, cheaper high-volume operations, and better data transformation; Zapier offers speed and the broadest app catalogue. For AI-heavy or self-hosted needs, n8n beats both. Fruition implements all three and advises per workload.',
      },
      {
        q: 'How much does Make automation consulting cost with Fruition?',
        a: 'Fruition Make automation engagements start at AUD $4,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Make automation services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Make automation engagement take?',
        a: 'Most Make automation engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  zapier: {
    path: '/integrations/zapier',
    seoTitle: 'Zapier Consulting | Fruition: Fast Connections & Structured Graduations',
    seoDescription:
      'Fruition builds Zapier automation for teams across Australia, the UK, and the US, and runs the structured graduations to Make or n8n when volume, cost, or complexity says it’s time.',
    breadcrumb: [HUB, { label: 'Zapier', href: '/integrations/zapier' }],
    eyebrow: 'Integrations · Zapier',
    heading: 'Zapier for speed. A plan for when you outgrow it',
    lead: 'Fruition builds Zapier automation for teams across Australia, the UK, and the US, and runs the structured graduations to Make or n8n when volume, cost, or complexity says it’s time.',
    approachHeading: 'Right tool, right stage.',
    approach: [
      {
        title: 'Fast where fast wins',
        body: 'Zapier’s catalogue and speed make it right for early-stage automation and long-tail app connections. We build there without apology.',
      },
      {
        title: 'Cost-watch built in',
        body: 'Task-volume monitoring and consolidation reviews before the invoice becomes the reason you call us.',
      },
      {
        title: 'Graduation path ready',
        body: 'When Zaps multiply past governance, we migrate the estate to Make or n8n with a documented, tested cutover.',
      },
    ],
    servicesEyebrow: 'What we do',
    servicesHeading: 'Zapier engagements.',
    services: [
      {
        title: 'Zap architecture',
        body: 'Governed multi-step Zaps with naming standards, error notifications, and an ownership register.',
      },
      {
        title: 'Estate audits',
        body: 'The 60-Zap cleanup: deduplication, consolidation, and the kill-list for automations nobody remembers.',
      },
      {
        title: 'Platform graduation',
        body: 'Structured Zapier → Make or Zapier → n8n migrations with parallel-run validation.',
      },
    ],
    faqs: [
      {
        q: 'When should we move off Zapier?',
        a: 'The usual triggers: task costs exceeding ~AUD $500/month, multi-step logic hitting Zapier’s ceiling, AI workflow requirements, or governance sprawl past ~40 active Zaps. Fruition audits the estate and migrates only what earns its place.',
      },
      {
        q: 'How much does Zapier consulting cost with Fruition?',
        a: 'Fruition Zapier engagements start at AUD $3,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver Zapier services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical Zapier engagement take?',
        a: 'Most Zapier engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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
