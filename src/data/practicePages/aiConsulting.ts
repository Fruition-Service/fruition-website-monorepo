import type { PracticePage } from './types'

/**
 * /ai-consulting cluster — copy ported verbatim from the v2.1 mockups
 * (ai-consulting.html + agent-development / governance-and-compliance /
 * rag-knowledge-systems / marketing-automation / sales-outbound /
 * customer-service / operations-back-office leaves), surname corrected
 * to Jebathilak.
 *
 * Capability Assessment, Strategy & Roadmap, n8n, and the AI platform
 * partner leaves from the mockups are NOT ported here — they already live
 * at /ai-capability-assessment, /ai-strategy-and-execution, and
 * /partnerships/*; the hub's cards link to those real routes.
 */

const HUB = { label: 'AI Consulting', href: '/ai-consulting' }

export const AI_CONSULTING_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/ai-consulting',
    seoTitle: 'AI Consulting Firm | Fruition Services: Strategy, Agents & Implementation, AU · UK · US',
    seoDescription:
      'Fruition is an AI consulting and implementation firm serving Australia, the UK, and the US. We assess, build, and govern AI systems on the platforms your teams already run, with fixed fees and practitioner-led delivery.',
    breadcrumb: [HUB],
    eyebrow: '★ AI Consulting Hub',
    heading: 'AI consulting that starts from how your business actually works',
    lead: 'Fruition is an AI consulting and implementation firm serving Australia, the UK, and the US. We assess, build, and govern AI systems on the platforms your teams already run, with fixed fees and practitioner-led delivery.',
    targetQueries: [
      'AI consulting firm',
      'AI consultant Sydney',
      'AI implementation partner UK',
      'enterprise AI consulting US',
      'AI readiness assessment',
      'AI agent development',
    ],
    approachHeading: 'Assess. Build. Govern.',
    approach: [
      {
        title: 'Assess before you spend',
        body: 'The 4-week AI Capability Assessment scores your readiness across eight dimensions and delivers a costed roadmap, before you commit implementation budget.',
      },
      {
        title: 'Build on your platforms',
        body: 'We implement AI inside the tools your teams already use (monday.com, Microsoft 365, Google Workspace, HubSpot), not in a parallel system nobody opens.',
      },
      {
        title: 'Govern from day one',
        body: 'Every AI system ships with governance: usage policies, evaluation pipelines, audit trails, and the compliance overlays your industry requires.',
      },
    ],
    servicesHeading: 'The full AI service line.',
    services: [
      {
        title: 'AI Capability Assessment',
        body: 'Our flagship 4-week diagnostic. Fixed fee, eight readiness dimensions, ranked opportunity register, board-ready roadmap.',
      },
      {
        title: 'Strategy & Roadmap',
        body: 'AI strategy grounded in your operations, with costed phases and vendor-honest platform recommendations.',
      },
      {
        title: 'Agent Development',
        body: 'Production AI agents (customer service, research, operations) built on Claude, Copilot Studio, Vertex AI, Bedrock, or n8n.',
      },
      {
        title: 'RAG & Knowledge Systems',
        body: 'Grounded retrieval systems that make your documents, tickets, and CRM history answerable, with citations.',
      },
      {
        title: 'Governance & Compliance',
        body: 'AI usage policies, risk frameworks, evaluation pipelines, and regulatory overlays (EU AI Act, APRA, HIPAA).',
      },
      {
        title: 'AI-Ready Data Foundations',
        body: 'The unglamorous prerequisite: permissions audits, data hygiene, and structure fixes that determine whether your AI works.',
      },
    ],
    childrenEyebrow: 'AI platform partners',
    childrenHeading: 'We implement on every major platform.',
    children: [
      {
        label: 'AI Capability Assessment',
        description: '4-week diagnostic · fixed fee · board-ready roadmap',
        href: '/ai-capability-assessment',
      },
      {
        label: 'Anthropic Claude',
        description: 'Claude implementation, agents, and enterprise deployment',
        href: '/partnerships/anthropic-claude-partner',
      },
      {
        label: 'OpenAI ChatGPT',
        description: 'ChatGPT Enterprise and OpenAI API implementation',
        href: '/partnerships/openai-chatgpt-partner',
      },
      {
        label: 'Microsoft Copilot',
        description: 'M365 Copilot rollout and Copilot Studio agents',
        href: '/partnerships/microsoft-copilot-partner',
      },
      {
        label: 'Google Gemini · Vertex AI',
        description: 'Gemini for Workspace and production Vertex AI',
        href: '/partnerships/google-gemini-vertex-ai-partner',
      },
      {
        label: 'Google Cloud',
        description: 'GCP landing zones, BigQuery, and cloud AI infrastructure',
        href: '/partnerships/google-cloud-partner',
      },
      {
        label: 'AWS · Bedrock',
        description: 'Bedrock agents, SageMaker, and AWS AI workloads',
        href: '/partnerships/aws-partner',
      },
      {
        label: 'n8n',
        description: 'Agentic workflow automation and AI orchestration',
        href: '/partnerships/n8n-integration-partner',
      },
    ],
    faqs: [
      {
        q: 'What does an AI consulting firm do?',
        a: 'An AI consulting firm helps organisations identify where AI creates value, then designs, builds, and governs the systems that capture it. Fruition’s AI services span capability assessment, strategy, agent development, RAG systems, governance, and platform implementation across Anthropic, OpenAI, Microsoft, Google, and AWS.',
      },
      {
        q: 'How do I choose an AI consulting firm?',
        a: 'Look for practitioner-led delivery, sector-specific compliance experience, platform-agnostic recommendations, published pricing, and post-launch support for model drift and evaluation. Fruition publishes fixed fees and holds partnerships across competing AI vendors so recommendations stay honest.',
      },
      {
        q: 'Which AI platforms does Fruition implement?',
        a: 'Anthropic Claude, OpenAI ChatGPT, Microsoft Copilot and Copilot Studio, Google Gemini and Vertex AI, Google Cloud, AWS Bedrock and SageMaker, and n8n for agentic workflow automation. Recommendations are made per workload, not per vendor.',
      },
      {
        q: 'What is the difference between AI strategy and AI implementation?',
        a: 'Strategy defines where AI creates value and in what order; implementation builds the systems. Fruition does both, and the same team delivers both, which is why our roadmaps are implementable rather than theoretical.',
      },
      {
        q: 'Should we start with an AI pilot or an assessment?',
        a: 'Usually an assessment. Pilots chosen without a readiness view tend to fail on data quality or governance gaps that an assessment would have caught in week one. The 4-week Capability Assessment costs a fraction of a failed pilot.',
      },
      {
        q: 'How much does AI consulting cost with Fruition?',
        a: 'Fruition AI engagements start at AUD $24,500 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI engagement take?',
        a: 'Most AI engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'agent-development': {
    path: '/ai-consulting/agent-development',
    seoTitle: 'AI Agent Development | Fruition: Production Agents on Claude, Copilot, Vertex, Bedrock',
    seoDescription:
      'Fruition designs and builds production AI agents across Australia, the UK, and the US (customer service, research, operations, and outbound) with evaluation pipelines from day one.',
    breadcrumb: [HUB, { label: 'Agent Development', href: '/ai-consulting/agent-development' }],
    eyebrow: 'AI Consulting · Agents',
    heading: 'Agents that handle real volume, not demo traffic',
    lead: 'Fruition designs and builds production AI agents across Australia, the UK, and the US (customer service, research, operations, and outbound) with evaluation pipelines from day one.',
    targetQueries: [
      'AI agent development company',
      'build enterprise AI agent',
      'agentic AI implementation',
      'AI agent consulting Australia',
    ],
    approachHeading: 'Production-grade from the first commit.',
    approach: [
      {
        title: 'Workload-matched platform',
        body: 'Claude for reasoning-heavy agents, Copilot Studio for M365-native workflows, Vertex for multimodal, Bedrock for model choice, n8n for orchestration. The workload picks the platform.',
      },
      {
        title: 'Evaluation before launch',
        body: 'Every agent ships with an evaluation harness: accuracy baselines, regression suites, and drift monitoring. Not optional.',
      },
      {
        title: 'Human handoff designed in',
        body: 'Escalation paths, confidence thresholds, and audit trails so the agent knows what it shouldn’t handle.',
      },
    ],
    servicesEyebrow: 'Agent types',
    servicesHeading: 'What we build.',
    services: [
      {
        title: 'Customer service agents',
        body: 'Grounded in your knowledge base and ticket history, with escalation logic and CSAT tracking. Typical first-contact resolution: 60–75%.',
      },
      {
        title: 'Research & analysis agents',
        body: 'Agents that synthesise documents, market data, and CRM history into structured briefs: the pattern behind our financial services deployments.',
      },
      {
        title: 'Operations agents',
        body: 'Back-office automation: document processing, data entry elimination, cross-system reconciliation, approval routing.',
      },
      {
        title: 'Outbound & marketing agents',
        body: 'Lead research, personalisation, and sequencing agents connected to your CRM and email infrastructure.',
      },
    ],
    faqs: [
      {
        q: 'How much does it cost to build an AI agent?',
        a: 'Production agent builds with Fruition typically run AUD $35,000–$150,000 per phase depending on integration depth, grounding sources, and volume requirements. A scoping call produces a fixed quote.',
      },
      {
        q: 'Which platform is best for building AI agents?',
        a: 'It depends on the workload: Claude excels at reasoning-heavy agents, Copilot Studio at Microsoft 365-native workflows, Vertex AI Agent Builder at multimodal and Google-stack work, Bedrock at model flexibility inside AWS, and n8n at orchestrating multi-step automation. Fruition recommends per use case.',
      },
      {
        q: 'How long does an AI agent take to build?',
        a: 'A production agent typically takes 6–14 weeks from scoping to live traffic: 2–3 weeks scoping and data audit, 4–8 weeks build with evaluation harness, 2–3 weeks controlled pilot.',
      },
      {
        q: 'What happens after the agent launches?',
        a: 'Fruition provides post-launch monitoring covering drift, regression, and cost optimisation: either as a handover package for your team or an ongoing managed service.',
      },
      {
        q: 'How much does AI agent consulting cost with Fruition?',
        a: 'Fruition AI agent engagements start at AUD $35,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI agent services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI agent engagement take?',
        a: 'Most AI agent engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'governance-and-compliance': {
    path: '/ai-consulting/governance-and-compliance',
    seoTitle: 'AI Governance & Compliance Consulting | Fruition: EU AI Act, APRA, HIPAA Ready',
    seoDescription:
      'Fruition builds AI governance frameworks for organisations across Australia, the UK, and the US: usage policy, risk classification, evaluation pipelines, and the regulatory overlays your industry demands.',
    breadcrumb: [HUB, { label: 'Governance & Compliance', href: '/ai-consulting/governance-and-compliance' }],
    eyebrow: 'AI Consulting · Governance',
    heading: 'AI you can defend to a regulator, a board, and an auditor',
    lead: 'Fruition builds AI governance frameworks for organisations across Australia, the UK, and the US: usage policy, risk classification, evaluation pipelines, and the regulatory overlays your industry demands.',
    targetQueries: [
      'AI governance framework',
      'EU AI Act compliance consulting',
      'AI policy development',
      'AI risk assessment',
    ],
    approachHeading: 'Governance as architecture, not paperwork.',
    approach: [
      {
        title: 'Risk-classified use cases',
        body: 'Every AI use case is classified by risk tier, which determines the controls, human oversight, and documentation it requires. EU AI Act logic applied globally.',
      },
      {
        title: 'Controls that run automatically',
        body: 'Audit logging, evaluation gates, and usage monitoring built into the systems: not into a policy PDF nobody reads.',
      },
      {
        title: 'Regulator-specific overlays',
        body: 'APRA CPS 230/234 for Australian financial services, UK GDPR and FCA for Britain, HIPAA and SOC 2 for US healthcare and SaaS.',
      },
    ],
    servicesEyebrow: 'Deliverables',
    servicesHeading: 'The governance stack.',
    services: [
      {
        title: 'AI usage policy',
        body: 'Organisation-wide policy covering approved tools, data handling, disclosure requirements, and prohibited uses: written for humans.',
      },
      {
        title: 'Risk framework & register',
        body: 'Use-case risk classification, mitigation controls, and a living register your compliance team can maintain.',
      },
      {
        title: 'Evaluation pipelines',
        body: 'Automated accuracy, bias, and drift monitoring for production AI systems, with alert thresholds and review cadences.',
      },
      {
        title: 'Regulatory mapping',
        body: 'Documented mapping between your AI systems and applicable regulation: EU AI Act, APRA, HIPAA, UK GDPR, CCPA.',
      },
    ],
    faqs: [
      {
        q: 'Does the EU AI Act apply to Australian or US companies?',
        a: 'Yes, if you serve EU users or deploy AI systems in the EU market. The Act’s risk-tier logic is also becoming the de facto global template, so Fruition applies its classification approach even for clients with no EU exposure.',
      },
      {
        q: 'What does an AI governance framework include?',
        a: 'A usage policy, a risk classification framework, a use-case register, evaluation and monitoring pipelines, incident response procedures, and regulatory mapping. Fruition delivers all six as an integrated package rather than isolated documents.',
      },
      {
        q: 'When should governance be built, before or after implementation?',
        a: 'Before, or at minimum alongside. Retrofitting governance onto live AI systems costs 3–5× more than building it in, and interim ungoverned use creates the exact audit exposure the framework exists to prevent.',
      },
      {
        q: 'How much does AI governance consulting cost with Fruition?',
        a: 'Fruition AI governance engagements start at AUD $18,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI governance services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI governance engagement take?',
        a: 'Most AI governance engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'rag-knowledge-systems': {
    path: '/ai-consulting/rag-knowledge-systems',
    seoTitle: 'RAG & Enterprise Knowledge Systems | Fruition: Grounded AI Search & Retrieval',
    seoDescription:
      'Fruition designs and builds retrieval-augmented generation systems across Australia, the UK, and the US: grounded answers over your documents, tickets, wikis, and CRM, with citations your auditors can follow.',
    breadcrumb: [HUB, { label: 'RAG & Knowledge Systems', href: '/ai-consulting/rag-knowledge-systems' }],
    eyebrow: 'AI Consulting · RAG',
    heading: 'Make everything your company knows answerable',
    lead: 'Fruition designs and builds retrieval-augmented generation systems across Australia, the UK, and the US: grounded answers over your documents, tickets, wikis, and CRM, with citations your auditors can follow.',
    targetQueries: [
      'RAG implementation partner',
      'enterprise knowledge base AI',
      'AI document search',
      'vector search consulting',
    ],
    approachHeading: 'Retrieval quality decides everything.',
    approach: [
      {
        title: 'Corpus before model',
        body: 'Bad chunks beat good models every time. We audit, clean, and structure your content before a single embedding is generated.',
      },
      {
        title: 'Citations as a feature',
        body: 'Every answer traces to source documents. In regulated industries this isn’t nice-to-have, it’s the requirement.',
      },
      {
        title: 'Evaluation-driven tuning',
        body: 'Golden question sets, retrieval precision metrics, and answer-quality scoring drive tuning: not vibes.',
      },
    ],
    servicesEyebrow: 'System types',
    servicesHeading: 'What we build.',
    services: [
      {
        title: 'Internal knowledge assistants',
        body: 'Grounded search over policies, wikis, and documentation: the ‘ask the company’ interface.',
      },
      {
        title: 'Customer-facing knowledge',
        body: 'Support deflection systems grounded in help content and resolved tickets, with confidence-gated responses.',
      },
      {
        title: 'Document intelligence pipelines',
        body: 'Contract analysis, compliance review, and structured extraction over large document sets.',
      },
      {
        title: 'Stack options',
        body: 'Supabase pgvector, Vertex AI Search, Bedrock Knowledge Bases, or Azure AI Search: matched to your existing cloud posture.',
      },
    ],
    faqs: [
      {
        q: 'What is RAG (retrieval-augmented generation)?',
        a: 'RAG is an architecture where an AI model retrieves relevant content from your own knowledge sources before answering, grounding responses in your actual documents rather than the model’s training data, with citations back to source.',
      },
      {
        q: 'Why do RAG projects fail?',
        a: 'Most failures trace to corpus quality: poorly chunked documents, stale content, missing permissions mapping, and no evaluation framework. Fruition front-loads the corpus audit precisely because retrieval quality decides answer quality.',
      },
      {
        q: 'Which vector database should we use?',
        a: 'It depends on your stack: Supabase pgvector for Postgres-native teams, Vertex AI Search on Google Cloud, Bedrock Knowledge Bases on AWS, Azure AI Search in Microsoft environments. Fruition implements all four and recommends per infrastructure.',
      },
      {
        q: 'How much does RAG consulting cost with Fruition?',
        a: 'Fruition RAG engagements start at AUD $35,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver RAG services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical RAG engagement take?',
        a: 'Most RAG engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'marketing-automation': {
    path: '/ai-consulting/marketing-automation',
    seoTitle: 'AI Marketing Automation Consulting | Fruition: Content, Campaigns & MarTech AI',
    seoDescription:
      'Fruition builds AI marketing automation for teams across Australia, the UK, and the US: content operations, campaign intelligence, and lead workflows connected to the CRM and platforms you already run.',
    breadcrumb: [HUB, { label: 'Marketing Automation', href: '/ai-consulting/marketing-automation' }],
    eyebrow: 'AI Consulting · Marketing',
    heading: 'Marketing output that scales without headcount',
    lead: 'Fruition builds AI marketing automation for teams across Australia, the UK, and the US: content operations, campaign intelligence, and lead workflows connected to the CRM and platforms you already run.',
    targetQueries: [
      'AI marketing automation agency',
      'AI content operations',
      'AI lead scoring',
      'marketing AI implementation',
    ],
    approachHeading: 'Systems, not stunts.',
    approach: [
      {
        title: 'Brand-safe content operations',
        body: 'AI content pipelines with editorial gates, tone controls, and human review where it matters: volume without the slop.',
      },
      {
        title: 'CRM-connected intelligence',
        body: 'Lead scoring, intent signals, and campaign attribution wired into HubSpot or monday CRM: where your team already works.',
      },
      {
        title: 'Measured against pipeline',
        body: 'Every automation is measured on pipeline contribution, not activity metrics. If it doesn’t move revenue, we kill it.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'The marketing AI stack.',
    services: [
      {
        title: 'Content operations',
        body: 'Research, drafting, and repurposing pipelines with brand-voice tuning and editorial workflow integration.',
      },
      {
        title: 'Lead intelligence',
        body: 'AI lead scoring, enrichment, and routing that gets the right lead to the right rep in minutes.',
      },
      {
        title: 'Campaign automation',
        body: 'Multi-channel campaign orchestration with AI-generated variants and performance-driven optimisation.',
      },
      {
        title: 'SEO & AEO systems',
        body: 'Content optimised for both search rankings and AI answer-engine citations, the discipline this very page demonstrates.',
      },
    ],
    faqs: [
      {
        q: 'How is AI used in marketing automation?',
        a: 'The highest-value applications are content operations (research, drafting, repurposing at scale), lead intelligence (scoring, enrichment, routing), campaign orchestration with AI-generated variants, and answer-engine optimisation. Fruition implements all four connected to your existing MarTech stack.',
      },
      {
        q: 'Will AI-generated content hurt our SEO?',
        a: 'Unedited volume content will. AI content with editorial gates, original data, expert attribution, and genuine utility performs well: Google’s guidance targets low-quality content regardless of how it’s produced. Fruition builds the editorial controls into the pipeline.',
      },
      {
        q: 'How much does AI marketing automation consulting cost with Fruition?',
        a: 'Fruition AI marketing automation engagements start at AUD $18,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI marketing automation services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI marketing automation engagement take?',
        a: 'Most AI marketing automation engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'sales-outbound': {
    path: '/ai-consulting/sales-outbound',
    seoTitle: 'AI Sales & Outbound Automation | Fruition: Lead Engines & Sales AI, AU · UK · US',
    seoDescription:
      'Fruition designs and builds AI outbound and sales systems for teams across Australia, the UK, and the US: lead sourcing, enrichment, genuine personalisation, and sequencing wired into your CRM.',
    breadcrumb: [HUB, { label: 'Sales & Outbound', href: '/ai-consulting/sales-outbound' }],
    eyebrow: 'AI Consulting · Sales & Outbound',
    heading: 'An outbound engine that researches before it writes',
    lead: 'Fruition designs and builds AI outbound and sales systems for teams across Australia, the UK, and the US: lead sourcing, enrichment, genuine personalisation, and sequencing wired into your CRM.',
    targetQueries: [
      'AI outbound lead engine',
      'AI SDR implementation',
      'AI sales automation agency',
      'outbound automation consulting',
    ],
    approachHeading: 'Relevance beats volume.',
    approach: [
      {
        title: 'Research-driven personalisation',
        body: 'Agents that actually research each prospect (recent news, tech stack, hiring signals) before a single line is written.',
      },
      {
        title: 'Deliverability as engineering',
        body: 'Domain warmup, sending infrastructure, and volume governance treated as the engineering problem it is.',
      },
      {
        title: 'CRM-native from day one',
        body: 'Every touch, reply, and signal lands in HubSpot or monday CRM with attribution: no parallel spreadsheet universe.',
      },
    ],
    servicesEyebrow: 'System components',
    servicesHeading: 'What the engine includes.',
    services: [
      {
        title: 'Lead sourcing & enrichment',
        body: 'ICP-matched sourcing with multi-source enrichment and AI qualification before anything enters sequence.',
      },
      {
        title: 'Personalisation engine',
        body: 'Per-prospect research synthesis feeding genuinely specific first lines, not [FIRST_NAME] merge fields.',
      },
      {
        title: 'Sequencing & reply handling',
        body: 'Multi-channel sequences with AI reply classification routing interested responses to humans instantly.',
      },
      {
        title: 'Pipeline analytics',
        body: 'Full-funnel measurement from send to closed-won, built into your CRM reporting.',
      },
    ],
    faqs: [
      {
        q: 'Do AI outbound systems actually work?',
        a: 'Volume-first AI outbound is dying under inbox filters and buyer fatigue. Research-driven systems that generate genuinely specific relevance perform 3–8× volume approaches on reply rate. The architecture (research depth, deliverability engineering, reply handling), decides the outcome.',
      },
      {
        q: 'Can this integrate with our existing CRM?',
        a: 'Yes. Fruition builds outbound engines natively integrated with HubSpot and monday CRM (both platforms we implement as certified partners) plus Salesforce and Pipedrive via API.',
      },
      {
        q: 'How much does AI outbound consulting cost with Fruition?',
        a: 'Fruition AI outbound engagements start at AUD $18,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI outbound services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI outbound engagement take?',
        a: 'Most AI outbound engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'customer-service': {
    path: '/ai-consulting/customer-service',
    seoTitle: 'AI Customer Service Consulting | Fruition: Support Agents & Deflection Systems',
    seoDescription:
      'Fruition builds AI customer service systems for organisations across Australia, the UK, and the US: grounded support agents, ticket intelligence, and deflection that protects CSAT instead of gaming it.',
    breadcrumb: [HUB, { label: 'Customer Service', href: '/ai-consulting/customer-service' }],
    eyebrow: 'AI Consulting · Customer Service',
    heading: 'Support that resolves before it queues',
    lead: 'Fruition builds AI customer service systems for organisations across Australia, the UK, and the US: grounded support agents, ticket intelligence, and deflection that protects CSAT instead of gaming it.',
    targetQueries: [
      'AI customer support implementation',
      'support ticket deflection',
      'AI helpdesk agent',
      'monday Service AI',
    ],
    approachHeading: 'Deflection without the rage-clicks.',
    approach: [
      {
        title: 'Grounded in resolved tickets',
        body: 'Agents trained on your actual resolutions and help content, not generic model knowledge that invents policies you don’t have.',
      },
      {
        title: 'Confidence-gated responses',
        body: 'Below-threshold answers route to humans automatically. The agent knows what it doesn’t know.',
      },
      {
        title: 'Platform-embedded',
        body: 'Built into monday Service, HubSpot Service Hub, or your existing helpdesk: agents work where your team works.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'The support AI stack.',
    services: [
      {
        title: 'Customer-facing agents',
        body: 'Grounded self-service resolution with citation-backed answers and clean human escalation. Typical deflection: 40–65%.',
      },
      {
        title: 'Agent-assist copilots',
        body: 'Draft responses, ticket summarisation, and knowledge surfacing inside the agent workspace, cutting handle time 25–40%.',
      },
      {
        title: 'Ticket intelligence',
        body: 'Auto-classification, sentiment routing, priority scoring, and trend detection across the queue.',
      },
      {
        title: 'Voice integration',
        body: 'Aircall and Twilio-connected voice workflows with transcription, summarisation, and CRM logging.',
      },
    ],
    faqs: [
      {
        q: 'How much of our support volume can AI actually handle?',
        a: 'Well-implemented grounded agents typically deflect 40–65% of tier-1 volume within three months, with agent-assist tooling cutting handle time on the remainder by 25–40%. The ceiling depends on your knowledge content quality, which the implementation audit addresses first.',
      },
      {
        q: 'Will AI support hurt our customer satisfaction?',
        a: 'Badly-gated AI does. Confidence-thresholded agents that escalate cleanly typically maintain or improve CSAT, because response time drops to seconds for the queries AI handles well and humans get more time for the complex ones.',
      },
      {
        q: 'How much does AI customer service consulting cost with Fruition?',
        a: 'Fruition AI customer service engagements start at AUD $18,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI customer service services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI customer service engagement take?',
        a: 'Most AI customer service engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'operations-back-office': {
    path: '/ai-consulting/operations-back-office',
    seoTitle: 'AI Operations Automation | Fruition: Back-Office AI for Finance, HR & Ops Teams',
    seoDescription:
      'Fruition automates operational workflows for organisations across Australia, the UK, and the US: document processing, reconciliation, approvals, and the cross-system glue-work that eats your team’s week.',
    breadcrumb: [HUB, { label: 'Operations & Back-Office', href: '/ai-consulting/operations-back-office' }],
    eyebrow: 'AI Consulting · Operations',
    heading: 'The back office, minus the re-keying',
    lead: 'Fruition automates operational workflows for organisations across Australia, the UK, and the US: document processing, reconciliation, approvals, and the cross-system glue-work that eats your team’s week.',
    targetQueries: [
      'AI back office automation',
      'AI document processing',
      'finance process automation',
      'AI operations consulting',
    ],
    approachHeading: 'Fix the process, then automate it.',
    approach: [
      {
        title: 'Process before automation',
        body: 'Digitising a mess doesn’t fix it, it scales it. We restructure the workflow before we automate it, every time.',
      },
      {
        title: 'Human-in-the-loop by design',
        body: 'Approval gates, exception queues, and audit trails where money or compliance is involved. Automation with accountability.',
      },
      {
        title: 'Platform-connected',
        body: 'Built across monday.com, Xero, your ERP, and your document stores, automating between systems, not inside another silo.',
      },
    ],
    servicesEyebrow: 'What we automate',
    servicesHeading: 'The operations catalogue.',
    services: [
      {
        title: 'Document intelligence',
        body: 'Invoice extraction, contract review, compliance document processing: structured data out of unstructured inputs.',
      },
      {
        title: 'Financial workflows',
        body: 'AP/AR automation, reconciliation, expense processing, and reporting pipelines connected to Xero, MYOB, or your ERP.',
      },
      {
        title: 'HR & people operations',
        body: 'Onboarding orchestration, document collection, policy Q&A agents, and leave workflow automation.',
      },
      {
        title: 'Cross-system reconciliation',
        body: 'The automated glue between CRM, finance, and project systems that eliminates the Friday re-keying ritual.',
      },
    ],
    faqs: [
      {
        q: 'Which back-office processes should we automate first?',
        a: 'Start where volume, rule-clarity, and pain intersect: invoice processing, data re-keying between systems, and document-heavy intake workflows typically pay back fastest. Fruition’s scoping identifies your specific sequence with ROI estimates per process.',
      },
      {
        q: 'How do you handle errors in automated financial processes?',
        a: 'Confidence thresholds route uncertain items to human exception queues, every action is logged for audit, and approval gates sit wherever money moves. Automation rate typically reaches 80–90% with the remainder deliberately human.',
      },
      {
        q: 'How much does AI operations consulting cost with Fruition?',
        a: 'Fruition AI operations engagements start at AUD $18,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver AI operations services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical AI operations engagement take?',
        a: 'Most AI operations engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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
