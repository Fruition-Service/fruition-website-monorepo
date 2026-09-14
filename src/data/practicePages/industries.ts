import type { PracticePage } from './types'

/**
 * /industries cluster — platform-agnostic sector pages. Copy ported verbatim
 * from the v2.1 mockups (industries.html + financial-services / healthcare /
 * solar-renewables leaves), surname corrected to Jebathilak.
 *
 * The hub's sector cards link to the three leaves plus the existing
 * monday-for-* industry pages, which keep their current URLs.
 */

const HUB = { label: 'Industries', href: '/industries' }

export const INDUSTRIES_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/industries',
    seoTitle: 'Industry Solutions | Fruition: AI & Platform Consulting by Sector, AU · UK · US',
    seoDescription:
      'Fruition delivers AI and platform consulting shaped by sector: the compliance regimes, workflows, and data realities of construction, finance, healthcare, manufacturing, and more, across Australia, the UK, and the US.',
    breadcrumb: [HUB],
    eyebrow: 'Industries Hub',
    heading: 'We speak your industry’s operational language',
    lead:
      'Fruition delivers AI and platform consulting shaped by sector: the compliance regimes, workflows, and data realities of construction, finance, healthcare, manufacturing, and more, across Australia, the UK, and the US.',
    approachEyebrow: 'Why vertical depth matters',
    approachHeading: 'Generic implementations fail specifically.',
    approach: [
      {
        title: 'Compliance is the constraint',
        body: 'APRA in finance, HIPAA in healthcare, safety regimes in construction: the regulatory frame shapes the build, not the other way round.',
      },
      {
        title: 'Workflows carry sector DNA',
        body: 'A construction variation order and a fund compliance review are both ‘approvals’, and identical implementations of them both fail.',
      },
      {
        title: 'Proof per sector',
        body: '900+ implementations means precedent in your vertical, not a promise to learn on your budget.',
      },
    ],
    servicesEyebrow: 'Sectors',
    servicesHeading: 'Where we go deep.',
    services: [
      {
        title: 'Construction & Trades',
        body: 'Job tracking, variations, safety workflows, and field-to-office visibility.',
      },
      {
        title: 'Financial Services',
        body: 'APRA-aligned platforms, client onboarding, and compliance-heavy AI deployments.',
      },
      {
        title: 'Healthcare',
        body: 'HIPAA-configured systems, patient workflow automation, and governed AI.',
      },
      {
        title: 'Manufacturing',
        body: 'Production scheduling, quality workflows, and supply-chain visibility.',
      },
      {
        title: 'Professional Services',
        body: 'Client delivery, resource management, and utilisation intelligence.',
      },
      {
        title: 'Solar & Renewables',
        body: 'Install pipeline CRM, job scheduling, and rebate workflow automation.',
      },
    ],
    childrenEyebrow: 'Industry pages',
    childrenHeading: 'By sector.',
    children: [
      {
        label: 'Construction',
        description: 'Job tracking, variations, and field visibility',
        href: '/monday-for-construction',
      },
      {
        label: 'Financial Services',
        description: 'APRA-aligned platforms and governed AI',
        href: '/industries/financial-services',
      },
      {
        label: 'Healthcare',
        description: 'HIPAA-configured systems and patient workflows',
        href: '/industries/healthcare',
      },
      {
        label: 'Manufacturing',
        description: 'Production, quality, and supply chain',
        href: '/monday-for-manufacturing',
      },
      {
        label: 'Professional Services',
        description: 'Client delivery and utilisation',
        href: '/monday-for-professional-services',
      },
      {
        label: 'Solar & Renewables',
        description: 'Install pipeline and job scheduling',
        href: '/industries/solar-renewables',
      },
      {
        label: 'Government',
        description: 'Secure, compliant public-sector delivery',
        href: '/monday-for-government',
      },
    ],
    faqs: [
      {
        q: 'Does Fruition specialise in specific industries?',
        a: 'Yes: construction, financial services, healthcare, manufacturing, professional services, solar and renewables, and government are established verticals, each with implementation precedent, compliance frameworks, and sector-specific templates from 500+ delivered projects.',
      },
      {
        q: 'How much does industry consulting cost with Fruition?',
        a: 'Fruition industry engagements start at AUD $12,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver industry services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical industry engagement take?',
        a: 'Most industry engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'financial-services': {
    path: '/industries/financial-services',
    seoTitle: 'AI & Platforms for Financial Services | Fruition: APRA-Aligned Implementation',
    seoDescription:
      'Fruition implements platforms and AI for financial services firms across Australia, the UK, and the US: client onboarding, compliance workflows, and AI deployments built to APRA, FCA, and SEC expectations.',
    breadcrumb: [HUB, { label: 'Financial Services', href: '/industries/financial-services' }],
    eyebrow: 'Industries · Financial Services',
    heading: 'Innovation velocity inside a regulatory perimeter',
    lead:
      'Fruition implements platforms and AI for financial services firms across Australia, the UK, and the US: client onboarding, compliance workflows, and AI deployments built to APRA, FCA, and SEC expectations.',
    approachHeading: 'Compliance as architecture.',
    approach: [
      {
        title: 'Regulator-mapped builds',
        body: 'APRA CPS 230/234, FCA, and SEC requirements mapped to system controls before configuration begins.',
      },
      {
        title: 'Auditability everywhere',
        body: 'Approval trails, permission logs, and data lineage designed in, because ‘show me’ is the only compliance test that matters.',
      },
      {
        title: 'AI with guardrails',
        body: 'Governed AI for research, document review, and client comms, with the human-oversight gates regulated advice demands.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Financial services systems.',
    services: [
      {
        title: 'Client onboarding',
        body: 'KYC/AML-integrated onboarding workflows with document collection, verification gates, and SLA tracking.',
      },
      {
        title: 'Compliance operations',
        body: 'Obligation registers, incident workflows, and attestation cycles on governed platforms.',
      },
      {
        title: 'Deal & portfolio management',
        body: 'Pipeline, due-diligence, and portfolio-review workflows for funds and advisory firms.',
      },
      {
        title: 'Research AI',
        body: 'Governed research-synthesis agents grounding briefs in verified sources with citation trails.',
      },
    ],
    faqs: [
      {
        q: 'Can financial services firms use AI under APRA expectations?',
        a: 'Yes, with governance designed in: risk-classified use cases, human oversight on client-affecting outputs, audit logging, and vendor due diligence aligned to CPS 230/234. Fruition builds these controls into the implementation rather than documenting them afterwards.',
      },
      {
        q: 'How much does financial services technology consulting cost with Fruition?',
        a: 'Fruition financial services technology engagements start at AUD $18,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver financial services technology services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical financial services technology engagement take?',
        a: 'Most financial services technology engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  healthcare: {
    path: '/industries/healthcare',
    seoTitle: 'Healthcare Workflow & AI Solutions | Fruition: HIPAA-Configured Implementation',
    seoDescription:
      'Fruition implements HIPAA-configured platforms and governed AI for healthcare organisations across Australia, the UK, and the US: patient workflows, referral management, and back-office automation with compliance built in.',
    breadcrumb: [HUB, { label: 'Healthcare', href: '/industries/healthcare' }],
    eyebrow: 'Industries · Healthcare',
    heading: 'Less admin between clinicians and care',
    lead:
      'Fruition implements HIPAA-configured platforms and governed AI for healthcare organisations across Australia, the UK, and the US: patient workflows, referral management, and back-office automation with compliance built in.',
    approachHeading: 'PHI-aware by default.',
    approach: [
      {
        title: 'Compliance-first configuration',
        body: 'HIPAA BAAs, encryption, audit logging, and permission architecture as the foundation: not the retrofit.',
      },
      {
        title: 'Clinical-adjacent, not clinical',
        body: 'We automate the workflows around care (intake, referrals, scheduling, billing), where the admin burden actually lives.',
      },
      {
        title: 'Governed AI only',
        body: 'Document processing and communication AI with de-identification patterns and human review gates appropriate to PHI.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Healthcare systems.',
    services: [
      {
        title: 'Patient workflow automation',
        body: 'Intake, referral tracking, and appointment coordination workflows with SLA visibility.',
      },
      {
        title: 'Practice operations',
        body: 'Credentialing, compliance tracking, and staff scheduling on HIPAA-configured platforms.',
      },
      {
        title: 'Document intelligence',
        body: 'Referral letter processing and intake-form extraction with PHI-safe handling patterns.',
      },
      {
        title: 'NDIS & aged care workflows',
        body: 'Australian sector-specific builds: participant management, claims workflows, and compliance reporting.',
      },
    ],
    faqs: [
      {
        q: 'Can monday.com be used in healthcare with patient data?',
        a: 'Yes, on the Enterprise plan with a signed BAA, encryption, audit logging, and properly configured permissions. Standard plans aren’t HIPAA-suitable. Fruition delivers these configurations as standard for healthcare clients.',
      },
      {
        q: 'How much does healthcare technology consulting cost with Fruition?',
        a: 'Fruition healthcare technology engagements start at AUD $15,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver healthcare technology services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical healthcare technology engagement take?',
        a: 'Most healthcare technology engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'solar-renewables': {
    path: '/industries/solar-renewables',
    seoTitle: 'Solar CRM & Workflow Systems | Fruition: Install Pipeline, Scheduling & Rebates',
    seoDescription:
      'Fruition implements CRM and workflow systems for solar and renewables companies across Australia, the UK, and the US: install pipelines, crew scheduling, rebate workflows, and the compliance chain in between.',
    breadcrumb: [HUB, { label: 'Solar & Renewables', href: '/industries/solar-renewables' }],
    eyebrow: 'Industries · Solar & Renewables',
    heading: 'From lead to grid connection, one pipeline',
    lead:
      'Fruition implements CRM and workflow systems for solar and renewables companies across Australia, the UK, and the US: install pipelines, crew scheduling, rebate workflows, and the compliance chain in between.',
    approachHeading: 'Built for the install-volume business.',
    approach: [
      {
        title: 'Pipeline mirrors the job',
        body: 'Lead → quote → deposit → approvals → install → grid connection as one governed flow with stage-gate automation.',
      },
      {
        title: 'Rebates as workflow',
        body: 'STC, state rebate, and financing document chains tracked per job, because missed paperwork is missed revenue.',
      },
      {
        title: 'Crew-day optimisation',
        body: 'Scheduling boards balancing install crews, travel, and weather reality: visible to office and field alike.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Solar business systems.',
    services: [
      {
        title: 'Sales & quoting pipeline',
        body: 'Lead management, quote tracking, and follow-up automation tuned to residential and commercial motions.',
      },
      {
        title: 'Install operations',
        body: 'Job scheduling, crew allocation, and photo-verified completion workflows.',
      },
      {
        title: 'Compliance & rebate chains',
        body: 'Approval, certificate, and rebate document workflows with deadline alerting.',
      },
      {
        title: 'Service & maintenance',
        body: 'Post-install service pipelines, warranty tracking, and recurring maintenance scheduling.',
      },
    ],
    faqs: [
      {
        q: 'What’s the best CRM for a solar company?',
        a: 'One that models the full install lifecycle (sales, approvals, scheduling, rebates, and service) in a single system. Fruition builds this on monday.com with solar-specific stage architecture, drawing on established renewables implementations across Australia.',
      },
      {
        q: 'How much does solar business systems consulting cost with Fruition?',
        a: 'Fruition solar business systems engagements start at AUD $10,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver solar business systems services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical solar business systems engagement take?',
        a: 'Most solar business systems engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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
