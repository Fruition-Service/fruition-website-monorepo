/**
 * Sanity migration: AI partner pages (aiPartnerPage docs).
 *
 *   /partnerships/anthropic-claude-partner
 *   /partnerships/openai-chatgpt-partner
 *   /partnerships/openclaw-partner
 *
 * Copy is transcribed from the hand-designed HTML mockups, mapped onto the
 * aiPartnerPage schema. Re-running overwrites (createOrReplace by fixed _id).
 */
import { writeClient, withKeys } from './lib'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'

const bullets = (arr: string[]) =>
  withKeys(arr.map((text) => ({ _type: 'aiBullet', text })))

// ─────────────────────────────────────────────────────────────────────────
// 1. Anthropic Claude
// ─────────────────────────────────────────────────────────────────────────
const anthropic = {
  _id: 'aiPartnerPage-anthropic-claude-partner',
  _type: 'aiPartnerPage',
  title: 'Anthropic Claude Expert Consulting Partner',
  slug: { _type: 'slug', current: 'anthropic-claude-partner' },
  seoTitle: 'Anthropic Claude Expert Consulting Partner — APAC, UK & US | Fruition',
  seoDescription:
    'Fruition is an Anthropic Claude expert consulting partner delivering enterprise Claude deployments, Claude Code rollouts, agentic workflows and Constitutional AI integrations across Australia, Singapore, the UK and the US.',

  brandName: 'Anthropic Claude',
  partnerTag: 'Anthropic Partner',
  accentColor: '#CC785C',
  accentColorDeep: '#A75740',
  accentColorSoft: 'rgba(204,120,92,0.10)',
  serifAccent: true,

  heroEyebrow: 'Anthropic Claude · Expert Consulting Partner',
  heroHeading: 'The Claude implementation partner for serious enterprise AI.',
  heroHeadingAccent: 'enterprise AI.',
  heroLead:
    'Fruition is an Anthropic Claude expert consulting partner. We design, build and operate production deployments of Claude — the Claude API, Claude Code and agentic systems on Model Context Protocol — for enterprises across Australia, Singapore, the United Kingdom and the United States.',
  primaryCtaLabel: 'Book a discovery call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'See enterprise case studies',
  secondaryCtaUrl: '#work',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Regions Served',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'Sydney HQ' },
    { _type: 'heroRegion', label: 'Singapore', value: 'APAC delivery' },
    { _type: 'heroRegion', label: 'India', value: 'Engineering pod' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'London' },
    { _type: 'heroRegion', label: 'United States', value: 'New York' },
  ]),

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '3', unit: 'yr', label: 'Building production Claude systems since the Claude 2 era.' },
    { _type: 'aiStat', value: '40', unit: '+', label: 'Enterprise AI engagements across APAC, UK and US.' },
    { _type: 'aiStat', value: '5', unit: '', label: 'Delivery hubs: Sydney, London, NYC, Manila, New Delhi.' },
    { _type: 'aiStat', value: '200', unit: 'k', label: 'Tokens of context routinely operated in agentic workflows.' },
  ]),

  capEyebrow: 'What we deliver',
  capHeading: 'From the first prompt to a system running your business.',
  capHeadingAccent: 'first prompt',
  capLead:
    "Four practice areas, deeply integrated. We don't sell tokens — we deliver outcomes built on Anthropic Claude as the reasoning core.",
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Enterprise Claude Deployments',
      title: 'Production Claude on Anthropic, AWS Bedrock or Google Vertex.',
      body: 'Architecture, security review, data residency planning and live rollout of Claude across knowledge work, customer operations and core systems.',
      bullets: bullets([
        'Anthropic Claude on AWS Bedrock for regulated workloads',
        'Zero-retention and HIPAA-aligned configurations',
        'SSO, audit logging and prompt governance',
      ]),
    },
    {
      _type: 'capability', num: '02 — Claude Code Enablement',
      title: 'Get your engineering team shipping with Claude Code in 30 days.',
      body: 'Pilot programs, tailored CLAUDE.md and SKILL.md authoring, MCP server design for internal tooling, and measurement of velocity and quality gains.',
      bullets: bullets([
        'Repository onboarding and codebase profiling',
        'Custom skills for your stack and conventions',
        '30/60/90-day productivity benchmarking',
      ]),
    },
    {
      _type: 'capability', num: '03 — Agentic AI Systems',
      title: 'Multi-step agents that read, decide and act on your tools.',
      body: 'Workflow-grade agents built on Claude, Model Context Protocol and orchestration layers like n8n. Used in sales, marketing, operations and engineering.',
      bullets: bullets([
        'MCP server architecture and integration',
        'Long-running agents with checkpointing',
        'Tool-use grounding and safety rails',
      ]),
    },
    {
      _type: 'capability', num: '04 — Strategy, Governance & Enablement',
      title: 'AI strategy, responsible use policy, training that actually lands.',
      body: 'Board-level AI roadmaps, Constitutional AI-informed responsible use frameworks and team enablement programs designed for adoption, not slideware.',
      bullets: bullets([
        '12-month AI transformation roadmap',
        'Responsible AI use policy aligned to ISO 42001',
        'Role-specific enablement and prompt libraries',
      ]),
    },
  ]),

  compareEyebrow: 'Why Anthropic Claude',
  compareHeading: 'For high-stakes work, the model matters.',
  compareHeadingAccent: 'matters.',
  compareLead:
    'Claude is built around Constitutional AI principles, with industry-leading long-context performance and the most reliable tool-use behaviour in production today. For regulated, brand-sensitive and high-complexity work, it is the model we choose.',
  compareColLabel: 'Capability',
  compareColA: 'Anthropic Claude',
  compareColB: 'Generalist LLMs',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Safety posture', colA: 'Constitutional AI; transparent model card; refusal calibration tuned for enterprise', colB: 'Varies by provider; less transparent on training principles' },
    { _type: 'compareRow', label: 'Long-context reasoning', colA: 'Reliable retrieval across 200k+ tokens with strong needle-in-haystack performance', colB: 'Performance degrades meaningfully past 32k–64k tokens' },
    { _type: 'compareRow', label: 'Tool use & agentic workflows', colA: 'Best-in-class for multi-tool chains, MCP-native, low hallucination on tool calls', colB: 'Capable but more prone to incorrect tool invocations under complexity' },
    { _type: 'compareRow', label: 'Coding (Claude Code)', colA: 'Top SWE-bench performance; agentic terminal workflows; codebase-wide reasoning', colB: 'Strong at snippets; weaker at multi-file refactors and long agentic runs' },
    { _type: 'compareRow', label: 'Enterprise deployment paths', colA: 'Anthropic, AWS Bedrock, Google Vertex AI — full data residency options', colB: 'Typically single-vendor; fewer residency choices' },
  ]),

  processEyebrow: 'How we engage',
  processHeading: 'A four-stage method. No AI theatre.',
  processHeadingAccent: 'No',
  processLead:
    'Every engagement runs through the same disciplined sequence. Fixed price per phase. Clear deliverables. Production from day one.',
  process: withKeys([
    { _type: 'processStep', tag: '01', title: 'Discovery & opportunity mapping', body: 'Two-week diagnostic: workflow audit, data inventory, model selection, deployment target (Anthropic API / Bedrock / Vertex), and a prioritised opportunity backlog with ROI ranges.', duration: '2 weeks · Fixed price' },
    { _type: 'processStep', tag: '02', title: 'Pilot build', body: 'One end-to-end Claude system, in production with real users. Full prompt library, evaluation harness, observability and rollback plan. We do not stop at demos.', duration: '4–6 weeks · Outcome-priced' },
    { _type: 'processStep', tag: '03', title: 'Scale', body: 'Roll out to adjacent workflows. Tighten governance. Train internal champions. Build out the agentic stack — MCP servers, orchestration, integration to monday.com, Salesforce, HubSpot, Atlassian, custom systems.', duration: '3–6 months · Phased' },
    { _type: 'processStep', tag: '04', title: 'Operate', body: 'Ongoing managed service: model upgrades, prompt regression testing, cost optimisation, new use-case sprints. You keep moving as Claude itself evolves.', duration: 'Retainer · Monthly' },
  ]),

  casesEyebrow: 'Selected work',
  casesHeading: 'Production systems. Real numbers.',
  casesHeadingAccent: 'Real',
  cases: withKeys([
    { _type: 'caseCard', industry: 'Professional Services', title: 'Autonomous marketing agent built on Claude API', body: 'End-to-end agent covering AEO, SEO, SEM, content and social. Claude as reasoning core, MCP servers for CMS and analytics, n8n for orchestration.', metric: '72%', metricLabel: 'Reduction in time-to-publish for ranked content.' },
    { _type: 'caseCard', industry: 'Retail / Consumer', title: 'Knowledge agent across product lifecycle', body: 'Long-context Claude agent ingesting product specs, supplier contracts and category rules to advise merchandising and operations teams.', metric: '8x', metricLabel: 'Faster answer turnaround vs. prior knowledge base.' },
    { _type: 'caseCard', industry: 'Construction / Property', title: 'PPM intelligence layer on Claude + monday.com', body: 'Claude reads project documents, surfaces risk, drafts status updates. MCP integration to monday.com Enterprise across 15+ programmes.', metric: '4.2hrs', metricLabel: 'Saved per PM, per week, on reporting alone.' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Local presence. Global delivery.',
  geoHeadingAccent: 'Global',
  geoLead:
    'We deliver Anthropic Claude implementations from three primary hubs and three engineering pods, covering APAC, the UK and the US under a single delivery framework.',
  geo: withKeys([
    { _type: 'geoCard', region: 'Asia Pacific', city: 'Sydney · Singapore · India', body: 'Headquartered in Sydney with delivery pods in Manila, Bangkok and New Delhi. Local data residency guidance for Australian Privacy Principles, Singapore PDPA and India DPDP.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'United Kingdom', city: 'London', body: 'UK operations covering financial services, professional services and the public sector. UK GDPR and ICO guidance built into every engagement. Claude deployment via UK-region cloud where required.', addr: 'London, United Kingdom\nUK Ltd entity' },
    { _type: 'geoCard', region: 'United States', city: 'New York · Remote-first', body: 'US delivery across financial services, healthcare-adjacent workflows and enterprise SaaS. Claude on AWS Bedrock for HIPAA-aligned environments and FedRAMP-aware architectures.', addr: 'New York, NY\nUS Inc entity' },
  ]),

  operatorEyebrow: "Who you'll work with",
  operatorHeading: 'Built by operators, not evangelists.',
  operatorHeadingAccent: 'not',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition Services',
  operatorBody: [
    "Six years building enterprise SaaS at monday.com followed by three years scaling Fruition from a one-person consultancy to a multi-entity firm operating across Australia, the UK and the US. Fruition was named monday.com's Rising Star Partner of the Year at the 2026 Prague Partner Summit and is one of a small number of monday.com Platinum partners globally.",
    "Josh leads Fruition's Anthropic Claude practice personally, with hands-on architecture for autonomous agent systems including Marketa — Fruition's own production marketing agent running on Claude.",
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: 'shipping_now', accent: true },
  ]),
  operatorCreds: [
    'monday.com Platinum Partner',
    'Rising Star Award 2026',
    'Anthropic Claude Practice Lead',
    '3 entities · AU / UK / US',
  ],

  faqEyebrow: 'Frequently asked questions',
  faqHeading: 'The questions we hear from every serious buyer.',
  faqHeadingAccent: 'every',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is an Anthropic Claude expert consulting partner?', answer: "An Anthropic Claude expert consulting partner is a vetted services firm that designs, implements and operates production deployments of Anthropic's Claude models — including the Claude API, Claude Code and agentic systems built on Model Context Protocol — for enterprise clients. Fruition is one of a small group of such firms operating across APAC, the UK and the US." },
    { _type: 'aiFaq', question: 'Do you support Claude deployments in Australia and APAC?', answer: 'Yes. Fruition is headquartered in Sydney and delivers Claude implementations across Australia, New Zealand, Singapore and India with local data residency guidance and compliance review aligned to the Australian Privacy Principles, Singapore PDPA and India DPDP.' },
    { _type: 'aiFaq', question: 'Can you implement Claude Code across an engineering team?', answer: 'Yes. We run Claude Code pilots, write tailored CLAUDE.md and SKILL.md files for your codebase, configure MCP servers for your internal tooling, and measure developer productivity gains over a 30–60 day rollout. We typically benchmark before-and-after on time-to-merge, defect rates and review cycles.' },
    { _type: 'aiFaq', question: 'What industries do you focus on?', answer: 'Professional services, financial services, retail and FMCG, hospitality, sport, government and not-for-profit. Prior client engagements include Sekisui House, JB Hi-Fi NZ, News Corp Australia, CSIRO, Bureau Veritas and Patties Food Group.' },
    { _type: 'aiFaq', question: 'How much does a Claude enterprise deployment cost?', answer: 'Discovery engagements are fixed price from AUD $15,000. Pilots typically run AUD $25,000–$65,000. Full agentic system builds range from AUD $80,000 upward depending on integration surface and ongoing model usage. We scope fixed-price phases rather than open-ended time-and-materials.' },
    { _type: 'aiFaq', question: 'How is Claude different from ChatGPT for enterprise use?', answer: 'Claude is built around Constitutional AI principles, has industry-leading long-context performance, excels at tool use and structured outputs, and offers a transparent safety posture — making it the model of choice for regulated, brand-sensitive and high-complexity enterprise workflows. ChatGPT remains a strong product; the right choice depends on use case, integrations and procurement realities, and we advise objectively on both.' },
    { _type: 'aiFaq', question: 'Do you write the prompts and skills for our team?', answer: 'Yes — and we teach your team to write them. Our deliverables include production prompt libraries, evaluation harnesses, SKILL.md files and prompt engineering playbooks tailored to your domain and tone of voice.' },
    { _type: 'aiFaq', question: 'Are you a reseller of Anthropic Claude?', answer: 'No. We are an implementation and consulting partner. We can advise on commercial procurement of Claude through Anthropic, AWS Bedrock or Google Vertex AI, but our value is delivery and enablement — not reselling tokens.' },
    { _type: 'aiFaq', question: 'Where is your team based?', answer: 'Sydney (headquarters), London and New York, with delivery support from Manila, New Delhi and Bangkok. Our model is local accountability with global delivery economics.' },
    { _type: 'aiFaq', question: 'Can Claude be deployed in regulated industries?', answer: 'Yes. Claude is available with enterprise controls via Anthropic directly, AWS Bedrock and Google Vertex AI — supporting data residency, zero-retention configurations and HIPAA-ready deployments. We help select and configure the right deployment path for your regulatory posture.' },
  ]),

  ctaHeading: 'Ready to actually ship something with Claude?',
  ctaHeadingAccent: 'actually',
  ctaBody:
    "Book a 30-minute discovery call with Fruition's Claude practice lead. We'll map the highest-leverage opportunity in your business and quote a fixed-price discovery engagement.",
  ctaLabel: 'Book a discovery call →',
  ctaUrl: CALENDLY,
}

// ─────────────────────────────────────────────────────────────────────────
// 2. OpenAI ChatGPT
// ─────────────────────────────────────────────────────────────────────────
const openai = {
  _id: 'aiPartnerPage-openai-chatgpt-partner',
  _type: 'aiPartnerPage',
  title: 'OpenAI ChatGPT Expert Consulting Partner',
  slug: { _type: 'slug', current: 'openai-chatgpt-partner' },
  seoTitle: 'OpenAI ChatGPT Expert Consulting Partner — APAC, UK & US | Fruition',
  seoDescription:
    'Fruition is an OpenAI ChatGPT expert consulting partner delivering ChatGPT Enterprise rollouts, custom GPTs, Assistants API integrations and fine-tuned model deployments across Australia, Singapore, the UK and the US.',

  brandName: 'OpenAI ChatGPT',
  partnerTag: 'OpenAI Services Partner',
  accentColor: '#10A37F',
  accentColorDeep: '#0E8A6B',
  accentColorSoft: '#ECFDF5',
  serifAccent: false,

  heroEyebrow: 'OpenAI ChatGPT · Expert Consulting Partner',
  heroHeading: 'Ship ChatGPT across your enterprise. Properly.',
  heroHeadingAccent: 'Properly.',
  heroLead:
    'Fruition is an OpenAI ChatGPT expert consulting partner. We design, deploy and operate ChatGPT Enterprise, custom GPTs, the OpenAI Assistants and Responses APIs, and fine-tuned models — for enterprises across Australia, Singapore, the United Kingdom and the United States.',
  primaryCtaLabel: 'Talk to a consultant →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'View custom GPT examples',
  secondaryCtaUrl: '#showcase',
  heroSidePanelType: 'code',
  heroSidePanelTitle: '// fruition.openai.config.ts',
  heroCodeLines: [
    '// production deployment, ChatGPT Enterprise + API',
    'import { OpenAI } from "openai";',
    '',
    'const client = new OpenAI({',
    '  apiKey: env.OPENAI_KEY,',
    '  project: "fruition-prod-apac",',
    '  organization: "org-fruition-enterprise"',
    '});',
    '',
    '// 5 regions · 3 entities · zero retention',
    '// shipped: true',
  ],

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '5', unit: '+', label: 'Years building on the OpenAI API since the GPT-3 era.' },
    { _type: 'aiStat', value: '40', unit: '+', label: 'Enterprise ChatGPT and OpenAI engagements delivered.' },
    { _type: 'aiStat', value: '3', unit: '', label: 'Legal entities: Australia, United Kingdom, United States.' },
    { _type: 'aiStat', value: '12', unit: 'wk', label: 'Typical time from kickoff to ChatGPT Enterprise GA across an org.' },
  ]),

  capEyebrow: '// what we deliver',
  capHeading: 'The full OpenAI surface, implemented not advertised.',
  capHeadingAccent: 'implemented',
  capLead:
    'Four practice areas across ChatGPT Enterprise, the OpenAI API, custom GPTs and fine-tuning. Production from the first week.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 / chatgpt_enterprise',
      title: 'ChatGPT Enterprise & Team rollout',
      body: 'End-to-end deployment of ChatGPT Enterprise: identity, governance, training, change management, success measurement. From procurement decision to org-wide adoption.',
      bullets: bullets([
        'SSO / SCIM provisioning and identity setup',
        'Workspace structure and admin policy design',
        'Role-based enablement and prompt libraries',
        'Usage analytics and ROI reporting',
      ]),
    },
    {
      _type: 'capability', num: '02 / custom_gpts',
      title: 'Custom GPTs & Assistants API',
      body: 'Purpose-built GPTs with private knowledge, secure actions calling internal APIs, and analytics. Plus production Assistants API integrations for embedded AI.',
      bullets: bullets([
        'Knowledge ingestion and retrieval design',
        'Secure Actions to Salesforce, monday.com, Snowflake',
        'OpenAI Assistants & Responses API systems',
        'Evaluation harnesses and prompt versioning',
      ]),
    },
    {
      _type: 'capability', num: '03 / fine_tuning',
      title: 'Fine-tuning & model lifecycle',
      body: 'When the prompt is not enough. Data curation, fine-tuning runs, evaluation against base models, and ongoing lifecycle management as new OpenAI models ship.',
      bullets: bullets([
        'Dataset design and instruction curation',
        'Fine-tuning on GPT-4o, GPT-4.1, o-series models',
        'Eval design vs. prompted baselines',
        'Model versioning and rollback strategy',
      ]),
    },
    {
      _type: 'capability', num: '04 / strategy_governance',
      title: 'AI strategy & governance',
      body: 'Board-level AI roadmaps, responsible AI use policy, vendor and model-mix strategy, and the operating model that lets your AI investment compound rather than fragment.',
      bullets: bullets([
        '12-month enterprise AI roadmap',
        'Responsible AI use policy (ISO 42001-aligned)',
        'Multi-model strategy (OpenAI, Anthropic, open)',
        'Centre of excellence design',
      ]),
    },
  ]),

  showcaseEyebrow: "// custom gpts we've built",
  showcaseHeading: 'From an idea to a ranked GPT in 2–6 weeks.',
  showcaseHeadingAccent: 'ranked GPT',
  showcaseLead:
    "Representative custom GPTs we've designed and deployed for clients across APAC, the UK and the US.",
  showcaseCards: withKeys([
    { _type: 'showcaseCard', icon: 'SF', name: 'Sales Forecast Analyst', role: 'By Fruition · for an ASX-listed FMCG client', body: 'Reads pipeline data, surfaces deal risk and drafts weekly forecast commentary for the CRO. Secure Actions into Salesforce.', meta: withKeys([{ _type: 'showcaseMeta', value: '120+', label: 'Weekly users' }]) },
    { _type: 'showcaseCard', icon: 'CX', name: 'Customer Insight Copilot', role: 'By Fruition · for a UK retail group', body: 'Synthesises store feedback, reviews and survey data into themed insights. Connects to internal data warehouse via secure Actions.', meta: withKeys([{ _type: 'showcaseMeta', value: '800+', label: 'Reports / month' }]) },
    { _type: 'showcaseCard', icon: 'PM', name: 'Programme Status Drafter', role: 'By Fruition · for a property developer', body: 'Pulls project data from monday.com Enterprise, drafts executive status, flags risk. Eliminates 4+ hours per PM, per week.', meta: withKeys([{ _type: 'showcaseMeta', value: '4.2 hrs/wk', label: 'Time saved / PM' }]) },
  ]),

  processEyebrow: '// engagement model',
  processHeading: 'Four phases. Fixed price per phase.',
  processHeadingAccent: 'Fixed',
  processLead:
    'A disciplined sequence from discovery to managed operations. No open-ended time-and-materials.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / discovery', title: 'Diagnose & scope', body: 'Workflow audit, data review, model and procurement strategy, prioritised opportunity backlog with ROI estimates.', duration: '2 weeks · fixed' },
    { _type: 'processStep', tag: '02 / pilot', title: 'Pilot in production', body: 'One ChatGPT Enterprise rollout or one custom GPT / Assistants API build, deployed with real users.', duration: '4–6 weeks · fixed' },
    { _type: 'processStep', tag: '03 / scale', title: 'Scale across the org', body: 'Adjacent workflows, deeper integrations, governance hardening, internal champion training.', duration: '3–6 months · phased' },
    { _type: 'processStep', tag: '04 / operate', title: 'Managed operations', body: 'Model upgrades, regression testing, cost optimisation, new use-case sprints, monthly business reviews.', duration: 'retainer · monthly' },
  ]),

  casesEyebrow: '// selected work',
  casesHeading: 'Production OpenAI systems. Real outcomes.',
  casesHeadingAccent: 'Real',
  cases: withKeys([
    { _type: 'caseCard', industry: 'FMCG / Consumer', title: 'Category management custom GPT', body: 'GPT that reads category performance data, summarises range health and drafts buyer talking points ahead of supplier reviews. Used weekly across 8 categories.', metric: '3.5hrs', metricLabel: 'Saved per buyer, per category, per week.' },
    { _type: 'caseCard', industry: 'Professional Services', title: 'Assistants API document workflow', body: 'OpenAI Assistants API system reading client correspondence, extracting issues, drafting first-pass responses for lawyer review.', metric: '68%', metricLabel: 'First-pass drafts approved without substantive edit.' },
    { _type: 'caseCard', industry: 'Sport & Apparel', title: 'ChatGPT Enterprise rollout', body: 'End-to-end deployment of ChatGPT Enterprise across a 220-person organisation, including governance, training and a 60-day adoption sprint.', metric: '82%', metricLabel: 'Weekly active users by day 60 post-launch.' },
  ]),

  compareEyebrow: '// when to use what',
  compareHeading: 'ChatGPT, the API, or both? We pick with you.',
  compareHeadingAccent: 'We pick',
  compareLead:
    'Honest guidance on where ChatGPT Enterprise wins, where the OpenAI API wins, and where we recommend running them side by side.',
  compareColLabel: 'Decision',
  compareColA: 'ChatGPT Enterprise / Team',
  compareColB: 'OpenAI API (Assistants / Responses)',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Best for', colA: 'Every-employee productivity assistant', colB: 'Embedded AI in products and workflows' },
    { _type: 'compareRow', label: 'Time to value', colA: 'Days — provision and train', colB: 'Weeks — design and build' },
    { _type: 'compareRow', label: 'Integration depth', colA: 'Connectors and custom GPTs with Actions', colB: 'Full control via API, MCP and tools' },
    { _type: 'compareRow', label: 'Cost model', colA: 'Per-seat licence', colB: 'Token-based, scales with usage' },
    { _type: 'compareRow', label: 'Governance', colA: 'Workspace policy, SCIM, audit logs', colB: 'Programmatic — your stack, your rules' },
  ]),

  geoEyebrow: '// geographic coverage',
  geoHeading: 'Three entities. Five delivery hubs.',
  geoHeadingAccent: 'Five',
  geoLead:
    'Local accountability across APAC, the UK and the US. One delivery framework, three legal entities, full data residency awareness.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN', city: 'Asia Pacific', body: 'Sydney HQ with delivery pods in Manila, New Delhi and Bangkok. OpenAI deployments aligned to Australian Privacy Principles, Singapore PDPA and India DPDP.', addr: '12/64 York Street, Sydney NSW 2000 · ABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB', city: 'United Kingdom', body: 'London-based UK operations covering financial services, professional services and public sector. UK GDPR and ICO guidance built into every rollout.', addr: 'London, United Kingdom · UK Ltd entity' },
    { _type: 'geoCard', region: 'US', city: 'United States', body: 'New York–based US team. Deployments across financial services, enterprise SaaS and healthcare-adjacent workflows. HIPAA-aware and FedRAMP-aware architectures.', addr: 'New York, NY · US Inc entity' },
  ]),

  operatorEyebrow: "// who you'll work with",
  operatorHeading: 'Operators with scars, not slidedecks.',
  operatorHeadingAccent: 'scars',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'MD, Fruition',
  operatorBody: [
    "Josh founded Fruition three years ago after six years at monday.com. The firm has been building production OpenAI systems since the GPT-3 era and was named monday.com's Rising Star Partner of the Year at the 2026 Prague Partner Summit.",
    "Fruition's senior team has deployed ChatGPT Enterprise rollouts, custom GPTs and Assistants API systems for ASX-listed corporates, UK retail groups and US enterprise SaaS clients. Every senior consultant ships code; nobody on the team has only ever consulted on AI.",
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'location', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'since', v: 'GPT-3 era' },
    { _type: 'operatorRow', k: 'status', v: 'shipping', accent: true },
  ]),
  operatorCreds: [
    'monday.com Platinum Partner',
    'Rising Star Award 2026',
    'OpenAI services partner',
    'Sydney · London · New York',
    '3 legal entities',
  ],

  faqEyebrow: '// frequently asked',
  faqHeading: 'What every serious buyer asks.',
  faqHeadingAccent: 'serious buyer',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is an OpenAI ChatGPT expert consulting partner?', answer: 'An OpenAI ChatGPT expert consulting partner is an external firm that helps enterprises deploy ChatGPT Enterprise, build custom GPTs, integrate the OpenAI Assistants and Responses APIs, and fine-tune models on private data — covering strategy, build, change management and operations.' },
    { _type: 'aiFaq', question: 'Do you roll out ChatGPT Enterprise in Australia and APAC?', answer: 'Yes. Fruition is headquartered in Sydney and delivers ChatGPT Enterprise and ChatGPT Team rollouts across Australia, New Zealand, Singapore and India, including identity provider configuration, SCIM provisioning, governance and adoption programs.' },
    { _type: 'aiFaq', question: 'Can you build custom GPTs for our business?', answer: 'Yes. We design, build and maintain custom GPTs with private knowledge bases, secure Actions calling internal APIs, role-scoped access and usage analytics. Typical build is two to six weeks per GPT depending on integration depth.' },
    { _type: 'aiFaq', question: 'Do you integrate the OpenAI Assistants and Responses APIs?', answer: 'Yes. We build production systems on the OpenAI Assistants API, the Responses API and function calling, including retrieval, code interpreter, file search and custom tool integrations to systems like Salesforce, monday.com, Snowflake and HubSpot.' },
    { _type: 'aiFaq', question: 'Should we use ChatGPT or the OpenAI API?', answer: 'Most enterprises run both. ChatGPT Enterprise is the every-employee productivity surface; the OpenAI API is for embedded AI in products and workflows. We help draw the line and govern both deployments.' },
    { _type: 'aiFaq', question: 'What does a ChatGPT Enterprise rollout cost?', answer: "Fruition's services for a typical 100–500 seat ChatGPT Enterprise rollout range from AUD $35,000 to $120,000 over 6–12 weeks, separate from OpenAI licensing. Custom GPT and Assistants API builds are scoped fixed-price per use case." },
    { _type: 'aiFaq', question: 'Can you fine-tune OpenAI models on our data?', answer: 'Yes. We run fine-tuning programs on GPT-4o, GPT-4.1 and selected o-series models, including data curation, evaluation harnesses and ongoing model lifecycle management.' },
    { _type: 'aiFaq', question: 'How do you handle data privacy?', answer: 'ChatGPT Enterprise and the OpenAI API offer zero-data-retention configurations and SOC 2 compliance. We design deployments aligned to Australian Privacy Principles, UK GDPR and applicable US frameworks (HIPAA, FedRAMP-aware) where required.' },
    { _type: 'aiFaq', question: 'Are you an OpenAI reseller?', answer: 'No. We are a services partner. We advise on procurement of ChatGPT Enterprise, Team and API credits — but our deliverables are implementation, integration and enablement, not licence resale.' },
    { _type: 'aiFaq', question: 'Where is your team based?', answer: 'Sydney (headquarters), London and New York, with engineering delivery from Manila, New Delhi and Bangkok.' },
  ]),

  ctaEyebrow: '// next_step()',
  ctaHeading: 'Ready to ship something real on OpenAI?',
  ctaHeadingAccent: 'real',
  ctaBody:
    "Book a 30-minute discovery call. We'll map your highest-leverage opportunity, propose the right OpenAI surface, and quote a fixed-price discovery engagement.",
  ctaLabel: 'Book a discovery call →',
  ctaUrl: CALENDLY,
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Openclaw
// ─────────────────────────────────────────────────────────────────────────
const openclaw = {
  _id: 'aiPartnerPage-openclaw-partner',
  _type: 'aiPartnerPage',
  title: 'Openclaw Expert Consulting Partner',
  slug: { _type: 'slug', current: 'openclaw-partner' },
  seoTitle: 'Openclaw Expert Consulting Partner — Autonomous AI Agents | APAC, UK & US | Fruition',
  seoDescription:
    'Fruition is an Openclaw expert consulting partner delivering autonomous AI agent deployments, multi-agent orchestration, agentic workflow design and tool-using AI systems across Australia, Singapore, the UK and the US.',

  brandName: 'Openclaw',
  partnerTag: 'Expert Consulting Partner',
  accentColor: '#ff5c5c',
  accentColorDeep: '#d93b3b',
  accentColorSoft: 'rgba(255,92,92,0.12)',
  serifAccent: false,

  heroEyebrow: '5 production agents running · uptime 99.97%',
  heroHeading: 'Agents that act. Not just chat.',
  heroHeadingAccent: 'act.',
  heroHeadingStrike: 'chat.',
  heroLead:
    'Fruition is an Openclaw expert consulting partner. We design, build and operate autonomous AI agents — systems that perceive, plan, take action, and finish work — for enterprises across Australia, Singapore, the United Kingdom and the United States.',
  primaryCtaLabel: 'Book a discovery call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'view live agents →',
  secondaryCtaUrl: '#showcase',
  heroSidePanelType: 'log',
  heroSidePanelTitle: 'AGENT_RUN.LOG',
  heroLogLines: withKeys([
    { _type: 'logLine', ts: '14:22:01', tag: '[INFO]', tagKind: 'info', msg: 'marketa-agent received task: publish AEO article on autonomous agents' },
    { _type: 'logLine', ts: '14:22:03', tag: '[ACT ]', tagKind: 'act', msg: '→ mcp.semrush.keyword_research()' },
    { _type: 'logLine', ts: '14:22:09', tag: '[INFO]', tagKind: 'info', msg: 'retrieved 47 ranking opportunities, scoring intent' },
    { _type: 'logLine', ts: '14:22:12', tag: '[ACT ]', tagKind: 'act', msg: '→ mcp.sanity.draft_article(slug, brief)' },
    { _type: 'logLine', ts: '14:22:14', tag: '[GATE]', tagKind: 'warn', msg: 'awaiting human review · marketing.review_queue' },
    { _type: 'logLine', ts: '14:24:51', tag: '[INFO]', tagKind: 'info', msg: 'approved by josh@fruition · resuming' },
    { _type: 'logLine', ts: '14:24:53', tag: '[ACT ]', tagKind: 'act', msg: '→ mcp.ayrshare.schedule_post(channels[4])' },
    { _type: 'logLine', ts: '14:24:55', tag: '[DONE]', tagKind: 'done', msg: 'task complete · 174s · 6 tool calls' },
  ]),

  stripType: 'marquee',
  marqueeItems: [
    'AUTONOMOUS AGENTS',
    'MULTI-AGENT ORCHESTRATION',
    'MCP-NATIVE',
    'TOOL USE AT SCALE',
    'PRODUCTION-GRADE',
    'APAC · UK · US',
  ],

  capEyebrow: 'capabilities/',
  capHeading: 'Build agents that finish work.',
  capHeadingAccent: 'finish',
  capLead:
    'Four practice areas. Every one focused on agents that operate in production — not demos, not pilots that never ship, not slides about the future.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 / agent_design',
      title: 'Single-agent design & deployment',
      body: 'Production agents built for one job done well. Tool integration, scoped credentials, observability, action gates and human-in-the-loop where the stakes demand it.',
      bullets: bullets([
        'Agent specification and capability mapping',
        'Tool/API integration via MCP and native SDKs',
        'Action gating and risk-tiered confirmation',
        'Observability, eval harness, regression tests',
      ]),
    },
    {
      _type: 'capability', num: '02 / multi_agent',
      title: 'Multi-agent orchestration',
      body: "Specialist agents collaborating on complex workflows. Routers, sub-agents, shared memory, and orchestration patterns that don't collapse under real load.",
      bullets: bullets([
        'Orchestrator and specialist agent design',
        'Shared state and memory architecture',
        'Cost and latency budgets per role',
        'Failure modes and circuit breakers',
      ]),
    },
    {
      _type: 'capability', num: '03 / mcp_engineering',
      title: 'MCP server engineering',
      body: 'Custom Model Context Protocol servers exposing your internal tools, data and actions to agents. Authentication, audit, sandboxing — the unglamorous work that makes agents safe.',
      bullets: bullets([
        'Custom MCP servers for internal systems',
        'Integration with monday.com, GitHub, Slack, Drive',
        'Auth, scoping, audit logging',
        'Sandboxed code-execution surfaces',
      ]),
    },
    {
      _type: 'capability', num: '04 / managed_ops',
      title: 'Managed agent operations',
      body: 'Agents are software that drifts. We run a managed service covering model upgrades, prompt regression, drift detection and continuous eval — so agents stay performant as the world changes around them.',
      bullets: bullets([
        '24/7 observability and on-call',
        'Model version management and migration',
        'Continuous evaluation pipelines',
        'Quarterly capability expansion',
      ]),
    },
  ]),

  showcaseEyebrow: 'agents/in_production',
  showcaseHeading: 'Live agents. Doing the work.',
  showcaseHeadingAccent: 'Doing',
  showcaseLead:
    'Representative autonomous agents we have designed, built and currently operate. Each runs unattended, with human approval gates only where the action is irreversible.',
  showcaseCards: withKeys([
    { _type: 'showcaseCard', icon: 'MK', name: 'Marketa', role: '// autonomous marketing operator', body: 'Owns AEO, SEO, SEM, content and social for Fruition. Plans, drafts, schedules, measures and iterates. Six tool integrations.', meta: withKeys([{ _type: 'showcaseMeta', value: '~180', label: 'actions/day' }, { _type: 'showcaseMeta', value: '6', label: 'tools' }, { _type: 'showcaseMeta', value: '1', label: 'operator' }]) },
    { _type: 'showcaseCard', icon: 'RV', name: 'RevOps Outbound', role: '// pipeline generation agent', body: 'Researches accounts, scores fit, drafts sequenced outbound, books into a calendar workflow. Integrates Clay, Instantly and monday CRM.', meta: withKeys([{ _type: 'showcaseMeta', value: '~2.4k', label: 'accounts/wk' }, { _type: 'showcaseMeta', value: '4', label: 'tools' }, { _type: 'showcaseMeta', value: '5%', label: 'reply rate' }]) },
    { _type: 'showcaseCard', icon: 'PM', name: 'Programme Sentinel', role: '// project intelligence agent', body: 'Reads project boards, surfaces risk, drafts status, escalates blockers. Built on Claude reasoning + MCP integration with monday.com Enterprise.', meta: withKeys([{ _type: 'showcaseMeta', value: '15', label: 'programmes' }, { _type: 'showcaseMeta', value: '4.2h', label: 'saved/PM/wk' }, { _type: 'showcaseMeta', value: '99%', label: 'uptime' }]) },
  ]),

  processEyebrow: 'engagement_model/',
  processHeading: 'Four phases. Fixed price.',
  processHeadingAccent: 'Fixed',
  processLead:
    'A disciplined sequence from problem discovery to managed operations. Every phase has a fixed-price scope and a clear exit criteria.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / discovery', title: 'Diagnose', body: 'Map the workflow. Identify the task an agent should own. Decide model mix, tool surface and risk tier.', duration: '2 weeks · fixed price' },
    { _type: 'processStep', tag: '02 / build', title: 'Build to production', body: 'Agent in the wild within six weeks. Real users. Real actions. Full observability and rollback path on day one.', duration: '4–8 weeks · fixed price' },
    { _type: 'processStep', tag: '03 / expand', title: 'Scale the swarm', body: 'Adjacent agents, multi-agent orchestration, deeper tool integration. Governance hardens, capability compounds.', duration: '3–6 months · phased' },
    { _type: 'processStep', tag: '04 / operate', title: 'Managed ops', body: '24/7 monitoring, model upgrades, regression testing, continuous evaluation, monthly capability sprints.', duration: 'retainer · monthly' },
  ]),

  casesEyebrow: 'case_studies/',
  casesHeading: 'Production agents. Real numbers.',
  casesHeadingAccent: 'Real',
  cases: withKeys([
    { _type: 'caseCard', industry: 'PROFESSIONAL SERVICES', title: 'Autonomous marketing operator', body: 'End-to-end agent owning AEO, SEO, SEM, content and social. Six tool integrations, single human reviewer, weekly publishing cadence held without intervention.', metric: '72%', metricLabel: 'REDUCTION_IN_TIME_TO_PUBLISH' },
    { _type: 'caseCard', industry: 'B2B SALES', title: 'RevOps pipeline agent', body: 'Account research, fit scoring, outbound sequencing and meeting booking. Replaced 60% of SDR hours with augmented capability.', metric: '3.1x', metricLabel: 'QUALIFIED_MEETINGS_PER_DOLLAR' },
    { _type: 'caseCard', industry: 'PROPERTY / CONSTRUCTION', title: 'Programme intelligence agent', body: '15 concurrent programmes monitored. Risk surfacing, status drafting, blocker escalation. Operates on monday.com via MCP.', metric: '4.2hrs', metricLabel: 'SAVED_PER_PM_PER_WEEK' },
  ]),

  compareEyebrow: 'agents_vs_chat/',
  compareHeading: 'Agents are not chatbots.',
  compareHeadingAccent: 'not',
  compareLead:
    'The two get conflated constantly. They are different software with different economics, different risk profiles and different value propositions.',
  compareColLabel: 'Dimension',
  compareColA: 'Autonomous Agent',
  compareColB: 'Chatbot / Copilot',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Primary output', colA: 'Completed actions in your systems', colB: 'Generated text in response to prompts' },
    { _type: 'compareRow', label: 'Trigger', colA: 'Scheduled, event-driven or goal-based', colB: 'User-initiated, per-message' },
    { _type: 'compareRow', label: 'Tool use', colA: 'Many tools, many steps, with planning', colB: 'Few tools, single-step retrieval typically' },
    { _type: 'compareRow', label: 'Failure mode', colA: 'Wrong action — must be designed against', colB: 'Wrong answer — user catches it' },
    { _type: 'compareRow', label: 'Value model', colA: 'Replaces hours of work per run', colB: 'Augments knowledge worker per session' },
  ]),

  geoEyebrow: 'regions/',
  geoHeading: 'Local accountability. Global delivery.',
  geoHeadingAccent: 'Global',
  geoLead:
    'Three legal entities, five delivery hubs, full coverage across APAC, the United Kingdom and the United States — under a single delivery framework.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN — ASIA PACIFIC', city: 'Sydney HQ', body: 'Headquartered in Sydney with engineering pods in Manila, New Delhi and Bangkok. Agent deployments aligned to Australian Privacy Principles, Singapore PDPA and India DPDP.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB — UNITED KINGDOM', city: 'London', body: 'UK operations covering financial services, professional services and the public sector. UK GDPR and ICO-aligned agent governance baked into every engagement.', addr: 'London, United Kingdom\nUK Ltd entity' },
    { _type: 'geoCard', region: 'US — UNITED STATES', city: 'New York', body: 'US delivery across financial services, enterprise SaaS and healthcare-adjacent workflows. HIPAA-aware and FedRAMP-aware agent architectures where required.', addr: 'New York, NY\nUS Inc entity' },
  ]),

  operatorEyebrow: 'operator/',
  operatorHeading: 'Built by people who ship.',
  operatorHeadingAccent: 'ship',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'MD · Fruition',
  operatorBody: [
    "Josh founded Fruition three years ago after six years at monday.com. Fruition was named monday.com's Rising Star Partner of the Year at the 2026 Prague Partner Summit and is one of a small number of monday.com Platinum partners globally.",
    'Fruition runs its own production agents — Marketa for marketing, RevOps Outbound for pipeline, Programme Sentinel for delivery. The team eats its own dog food. Every senior consultant writes code and operates an agent. Nobody is exclusively a slide-deck consultant.',
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'awards', v: 'Rising Star 2026', accent: true },
    { _type: 'operatorRow', k: 'status', v: 'shipping_now', accent: true },
  ]),
  operatorCreds: [
    'MONDAY.COM PLATINUM',
    'RISING STAR 2026',
    'OPENCLAW EXPERT PARTNER',
    '5 LIVE AGENTS',
    'SYD · LDN · NYC',
  ],

  faqEyebrow: 'faq/',
  faqHeading: 'What every serious buyer asks.',
  faqHeadingAccent: 'serious',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is an Openclaw expert consulting partner?', answer: 'An Openclaw expert consulting partner is a specialist firm that designs, builds and operates autonomous AI agent systems — including multi-agent orchestration, tool-using agents and long-running agentic workflows — for enterprises in production environments. Fruition is one of a small group of such firms operating across APAC, the UK and the US.' },
    { _type: 'aiFaq', question: 'What is an autonomous AI agent?', answer: 'An autonomous AI agent is a software system that uses an LLM to perceive a task, plan a sequence of steps, call tools or APIs, observe the results, and iterate until the task is complete — without per-step human direction. Agents differ from chatbots in that they take actions, not just generate text.' },
    { _type: 'aiFaq', question: 'Do you deploy agents in regulated industries?', answer: 'Yes. Our agent deployments include audit logging, action-level approval gates, sandboxed execution and rollback paths. We design agents for regulated sectors including financial services and healthcare-adjacent workflows, with regulator-aware governance baked into the architecture.' },
    { _type: 'aiFaq', question: 'Which model providers do you work with?', answer: 'We are model-agnostic. We work with Anthropic Claude, OpenAI GPT-4 and GPT-5 series, Google Gemini, and open-weight models including Llama and Qwen — selecting the best fit per agent role. Most production agents we build use multiple models across different tasks.' },
    { _type: 'aiFaq', question: 'How is agentic AI different from ChatGPT?', answer: 'A chatbot like ChatGPT generates a response to a single prompt. An agent decides what to do across many steps, uses tools (APIs, databases, browsers, code execution), and completes multi-stage tasks. Agentic AI is what makes AI take action in your systems rather than just answer questions about them.' },
    { _type: 'aiFaq', question: 'What does an autonomous agent build cost?', answer: 'A first agent in production typically ranges from AUD $45,000 to $120,000 depending on integration surface and risk profile. Multi-agent systems start at AUD $150,000. Discovery engagements are fixed-price from AUD $15,000 and produce a costed implementation plan.' },
    { _type: 'aiFaq', question: 'Do you build on Model Context Protocol?', answer: 'Yes. MCP is a primary integration layer for our agents — we build custom MCP servers exposing internal tools and data, and integrate published MCP servers for systems including monday.com, GitHub, Slack and Google Workspace.' },
    { _type: 'aiFaq', question: 'Can agents take destructive actions safely?', answer: 'Yes — when architected correctly. We design action gating, two-step confirmation for irreversible operations, scoped credentials, sandboxed execution and full audit trails. Risk-tiered actions get human-in-the-loop approval; low-risk actions run unattended.' },
    { _type: 'aiFaq', question: 'Where is your team based?', answer: 'Sydney (headquarters), London and New York, with engineering delivery from Manila, New Delhi and Bangkok.' },
    { _type: 'aiFaq', question: 'Do you operate agents after launch?', answer: 'Yes. We run a managed operations service covering observability, drift detection, prompt regression testing, model upgrades and continuous evaluation — keeping agents performant as models and your business evolve.' },
  ]),

  ctaEyebrow: 'next_step/',
  ctaHeading: 'Ready for an agent that actually finishes work?',
  ctaHeadingAccent: 'actually',
  ctaBody:
    "Book a 30-minute discovery call. We'll map the highest-leverage workflow in your business, identify which agent to build first, and quote a fixed-price discovery engagement.",
  ctaLabel: 'Book a discovery call →',
  ctaUrl: CALENDLY,
}

async function main() {
  // Each doc has a different section shape (regions / code / log panels), so
  // the array is a union — cast for createOrReplace's document stub type.
  const docs = [anthropic, openai, openclaw]
  for (const doc of docs) {
    console.log('Writing', doc._id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await writeClient.createOrReplace(doc as any)
    console.log('✓', doc.slug.current)
  }
  console.log('Done — 3 AI partner pages.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
