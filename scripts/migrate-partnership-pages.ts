import { writeClient } from './sanity-client'

const CALENDLY_DEFAULT = 'https://calendly.com/global-calendar-fruitionservices'

const imageCache = new Map<string, any>()

async function uploadImageFromUrl(url: string, filename: string) {
  if (imageCache.has(url)) return imageCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || undefined
  const asset = await writeClient.assets.upload('image', buffer, {
    filename,
    contentType,
  })
  const ref = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
  imageCache.set(url, ref)
  console.log(`  uploaded ${filename}`)
  return ref
}

type Bullet = { emoji?: string; text: string }
type CapabilityCard = { emoji: string; title: string; description: string; bullets?: Bullet[] }
type ServiceCard = { emoji?: string; title: string; description?: string; bullets?: Bullet[] }
type FeatureItem = { number: string; title: string; description?: string }
type ComparisonItem = { number: string; title: string; description?: string; bullets?: Bullet[] }
type ComparisonTab = { label: string; items: ComparisonItem[] }
type SectionTheme = 'light' | 'dark'
type FaqPair = { question: string; answer: string }
type FaqTab = { label: string; items: FaqPair[] }
type Stat = { value: string; label: string }
type Benefit = { emoji: string; text: string }
type IndustryTab = { label: string; title: string; description: string; benefits: Benefit[] }
type SolutionCard = {
  eyebrow?: string
  heading: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
  imageUrl?: string
}

interface PartnerPage {
  slug: string
  title: string
  partnerName: string
  partnerLogoUrl?: string
  heroImageUrl?: string
  heroHeading: string
  heroSubheading: string
  primaryCtaLabel: string
  primaryCtaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  seoTitle: string
  seoDescription: string
  capabilitiesHeading?: string
  capabilitiesHeadingAccent?: string
  capabilitiesSubheading?: string
  capabilitiesTheme?: SectionTheme
  capabilitiesColumns?: 2 | 3
  capabilitiesCards?: CapabilityCard[]
  servicesHeading?: string
  servicesHeadingAccent?: string
  servicesSubheading?: string
  servicesTheme?: SectionTheme
  servicesCards?: ServiceCard[]
  featureListHeading?: string
  featureListHeadingAccent?: string
  featureListSubheading?: string
  featureListTheme?: SectionTheme
  featureListColumns?: 2 | 3
  featureListItems?: FeatureItem[]
  comparisonHeading?: string
  comparisonSubheading?: string
  comparisonTabs?: ComparisonTab[]
  comparisonTheme?: SectionTheme
  industryHeading?: string
  industryTabs?: IndustryTab[]
  solutionCards?: SolutionCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  faqTabs?: FaqTab[]
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinSubheading?: string
  joinStats?: Stat[]
  joinFootnote?: string
}

// Each page-specific section follows. _key generation is deterministic so
// re-runs of the script don't churn the document.

const pages: PartnerPage[] = [
  // ──────────────────────────────────────────────────────────────────
  // n8n Integration Partner
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'n8n-integration-partner',
    title: 'Certified n8n Partner',
    partnerName: 'n8n',
    partnerLogoUrl: 'https://static.wixstatic.com/media/00f73d_b18bb092636a4ebe9c765cd50bd37a4a~mv2.png',
    heroImageUrl: 'https://static.wixstatic.com/media/00f73d_99e040874922423aa790bf91efcfcf70~mv2.png',
    heroHeading: 'n8n Certified Partner',
    heroSubheading:
      "Transform Your Business with AI-Powered n8n Workflow Automation. Implement cutting-edge AI agents and automate enterprise workflows with Fruition's certified n8n partner solutions for monday.com.",
    primaryCtaLabel: '🚀 Book a Meeting',
    primaryCtaUrl: CALENDLY_DEFAULT,
    secondaryCtaLabel: '📑 See Our Process',
    secondaryCtaUrl: '#our-process',
    seoTitle: 'Certified n8n Partner | AI Workflow Automation | Fruition',
    seoDescription:
      'Fruition is a certified n8n integration partner delivering AI-powered workflow automation, custom agents and enterprise integrations across monday.com.',
    capabilitiesHeading: 'Why Choose ',
    capabilitiesHeadingAccent: 'n8n for Workflow Automation',
    capabilitiesSubheading:
      'Transform your business with AI-powered workflow automation, custom agents and enterprise integrations delivered by certified n8n consultants.',
    capabilitiesTheme: 'light',
    capabilitiesCards: [
      { emoji: '🎯', title: 'Trigger Event', description: 'Detect any business event across 500+ apps and kick off automated workflows in milliseconds.' },
      { emoji: '🔄', title: 'Process Data', description: 'Transform, enrich and route data through visual nodes with branching, merging and iteration.' },
      { emoji: '📊', title: 'Update Systems', description: 'Push data into your CRM, ERP, helpdesk, and any internal system through native or custom API integrations.' },
      { emoji: '✅', title: 'Complete Action', description: 'Close the loop with notifications, reports and follow-up automations — all observable in one place.' },
    ],
    servicesHeading: 'Our Comprehensive ',
    servicesHeadingAccent: 'n8n Services',
    servicesSubheading:
      'End-to-end implementation, from strategic discovery to ongoing optimisation, delivered by certified n8n consultants.',
    servicesTheme: 'dark',
    servicesCards: [
      {
        emoji: '🗺️',
        title: 'Process Discovery & Strategic Planning',
        description:
          'Map existing processes against industry benchmarks, define automation goals, analyse operational bottlenecks, and identify high-ROI automation opportunities that remove scaling barriers.',
        bullets: [
          { text: 'Comprehensive process audit' },
          { text: 'Automation opportunity assessment' },
          { text: 'ROI projections and timelines' },
          { text: 'Custom integration planning' },
        ],
      },
      {
        emoji: '🔌',
        title: 'Enterprise Connector Setup',
        description:
          "Create and validate secure credentials and endpoints to seamlessly link your existing systems with n8n's automation platform.",
        bullets: [
          { text: 'Legacy system connections' },
          { text: 'Cloud application APIs' },
          { text: 'Database integrations' },
          { text: 'Custom endpoint development' },
        ],
      },
      {
        emoji: '🎨',
        title: 'Workflow Design & Testing',
        description:
          'Develop sophisticated workflows with automated testing and validation. We balance automation sophistication with user adoption to ensure maximum business value.',
        bullets: [
          { text: 'User-centered design methodology' },
          { text: 'Comprehensive testing protocols' },
          { text: 'Performance optimisation' },
          { text: 'Error handling and recovery' },
        ],
      },
      {
        emoji: '🕙',
        title: 'Production Deployment & Monitoring',
        description:
          'Deploy enterprise-ready automations with comprehensive dashboards, intelligent alerts, and insightful performance metrics.',
        bullets: [
          { text: 'Real-time performance dashboards' },
          { text: 'Proactive alert systems' },
          { text: 'Detailed analytics and reporting' },
          { text: 'Cost tracking and optimisation' },
        ],
      },
      {
        emoji: '👥',
        title: 'Team Training & Knowledge Transfer',
        description:
          'Transfer complete technical knowledge, deliver comprehensive documentation, and conduct hands-on team workshops that turn potential resistance into enthusiastic adoption.',
      },
      {
        emoji: '📈',
        title: 'Continuous Improvement',
        description:
          'Refine workflows based on KPIs, implement performance enhancements, and add new automation use cases as your business evolves.',
      },
    ],
    comparisonHeading: 'Challenges & Solutions',
    comparisonSubheading:
      'How n8n addresses the operational pressures that slow down growing businesses.',
    comparisonTabs: [
      {
        label: 'Challenges & Solutions',
        items: [
          {
            number: '01',
            title: 'Productivity & Efficiency',
            description:
              'Without automation, organisations face slower processing times and increased errors compared to AI-powered competitors. Connect intelligent AI agents to n8n workflows to automate grunt work and free your team for strategic work.',
          },
          {
            number: '02',
            title: 'Costly Operations',
            description:
              'n8n workflow automation drastically reduces labor costs and operational inefficiencies. Automate complex processes like invoice processing, financial forecasting, and data analysis while reducing manual intervention.',
          },
          {
            number: '03',
            title: 'Data Accuracy & Decision Making',
            description:
              "Ensure greater accuracy in your business workflows with n8n's enterprise automation platform. Advanced automations enable efficient data gathering and analysis, minimising risks of manual data processing.",
          },
          {
            number: '04',
            title: 'Adaptability & Scalability',
            description:
              'n8n automation systems scale effortlessly to handle growing workloads without significant resource increases — adapting to changing business conditions and automating business logic without limitations.',
          },
        ],
      },
    ],
    solutionCards: [
      {
        eyebrow: 'AI Agents',
        heading: 'Multi-Step AI Agents with Custom Tools',
        body:
          'Create sophisticated agentic systems on a single screen. Integrate any LLM into your workflows as easily as drag-and-drop, enabling complex decision-making and autonomous task execution.',
        ctaLabel: '🚀 Book a Meeting',
        ctaUrl: CALENDLY_DEFAULT,
        imageUrl: 'https://static.wixstatic.com/media/00f73d_2cb1d57b2cd840ddb44dd0268db00530~mv2.png',
      },
      {
        eyebrow: 'Self-Hosting',
        heading: 'Complete Self-Hosting Control',
        body:
          'Protect sensitive business data by deploying n8n on-premises. Maintain full control over your data, enhance security protocols, and ensure compliance with industry regulations.',
      },
      {
        eyebrow: 'Speed',
        heading: 'Agentic Systems in Minutes, Not Days',
        body:
          "n8n's pre-built nodes and templates make building real-world business solutions faster than you'd think. With a visual editor and the option to code, you won't have to compromise on flexibility.",
        imageUrl: 'https://static.wixstatic.com/media/00f73d_76646db862f643029c9f5d8df9a198f9~mv2.png',
      },
      {
        eyebrow: 'Integrations',
        heading: 'Unlimited Integration Flexibility',
        body:
          "Connect to a vast array of data sources, tools, LLMs, vector stores, MCP servers, and even other agents. It's the maximum flexibility in AI architecture you've been looking for.",
        imageUrl: 'https://static.wixstatic.com/media/00f73d_ad0a61f49b614c35897922c0c8798e9a~mv2.png',
      },
    ],
    calendlyHeading: 'Schedule a 30-min consultation with one of our certified n8n consultants',
    calendlySubheading:
      'Book a free call to map automation opportunities, scope an AI agent build, or plan an n8n rollout for your team.',
    faqTabs: [
      {
        label: 'n8n FAQs',
        items: [
          {
            question: 'What does n8n stand for?',
            answer:
              "The name 'n8n' stands for 'Nodemation,' reflecting its node-based approach to workflow creation. n8n is frequently used by individuals and organisations to optimise and automate repetitive tasks, data transfers, and processes across different platforms.",
          },
          {
            question: 'What is an n8n AI agent?',
            answer:
              "n8n AI Agent is a feature that allows users to integrate Large Language Models (LLMs) into their workflows with minimal coding. It acts as a 'brain' for your automation, enabling intelligent applications that understand user input, maintain conversation context, and perform actions using tools like APIs or databases.",
          },
          {
            question: 'What is the difference between Relevance AI and n8n?',
            answer:
              'Relevance AI uses a low-code platform built for data labeling and agent workflows, while n8n gives you more control through a flexible, node-based builder.',
          },
          {
            question: 'How powerful is n8n?',
            answer:
              'n8n gives you more freedom to implement multi-step AI agents and integrate apps than any other tool. Rated 4.9/5 stars on G2.',
          },
          {
            question: 'What can n8n be used for?',
            answer:
              "n8n is an open-source workflow automation tool that lets you build automated processes without writing a ton of code. It's like a digital assistant that glues your apps together — handling data syncing, alerts, and multi-step business processes automatically.",
          },
        ],
      },
    ],
    joinHeadingPart1: 'Proven ',
    joinHeadingAccent: 'n8n automation',
    joinHeadingPart2: ' results',
    joinSubheading: 'Real numbers from organisations that scaled with n8n + Fruition.',
    joinStats: [
      { value: '200k+', label: 'users trust n8n to handle AI automations worldwide' },
      { value: '1,000+', label: 'integration opportunities to enhance your operations' },
      { value: '85%', label: 'average time savings on manual tasks and workflows' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // ClickUp
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'certified-clickup-partner',
    title: 'Certified ClickUp Implementation Partner',
    partnerName: 'ClickUp',
    partnerLogoUrl: 'https://static.wixstatic.com/media/00f73d_c79d2811fd8146a69bbacc0d0e8d4c9e~mv2.png',
    heroImageUrl: 'https://static.wixstatic.com/media/00f73d_d8b0cc267dd040e49d29427f32f6c142~mv2.png',
    heroHeading: 'Certified ClickUp Implementation Partner',
    heroSubheading:
      "Transform your productivity with Fruition's certified ClickUp implementation services. Expert workspace setup, migration, automation, and training across Australia, US & UK. Get more done, faster.",
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY_DEFAULT,
    seoTitle: 'Certified ClickUp Partner | Implementation, Migration & Training | Fruition',
    seoDescription:
      'Fruition is a certified ClickUp Solutions Partner delivering workspace setup, migration, automation and training across Australia, the US and UK.',
    capabilitiesHeading: "Transform Your Business with ClickUp's ",
    capabilitiesHeadingAccent: 'Everything App for Work',
    capabilitiesSubheading:
      "ClickUp replaces multiple tools with one unified platform, eliminating the app-switching that fragments work, steals time, and kills productivity.\n\nAs your certified ClickUp implementation partner, we help organisations across Australia, US and UK unlock ClickUp's full potential through expert configuration, seamless migration, and comprehensive training.",
    capabilitiesTheme: 'dark',
    capabilitiesColumns: 2,
    capabilitiesCards: [
      { emoji: '🌐', title: 'Unified Work Management', description: 'Replace 10+ tools with one unified platform. ClickUp consolidates project management, document collaboration, chat, goals, whiteboards and more into a single workspace that eliminates context-switching and information silos.' },
      { emoji: '⚙️', title: 'Unmatched Flexibility', description: 'Configure ClickUp to work exactly how your team wants to work. With 15+ views, 1000+ integrations, and unlimited customisation options, ClickUp adapts to your processes — not the other way around.' },
      { emoji: '🧠', title: 'AI-Powered Productivity', description: 'Leverage ClickUp Brain, the AI that works across your entire workspace. Automate repetitive tasks, generate content, search across all your work, and get instant answers from your connected knowledge base.' },
      { emoji: '🔒', title: 'Enterprise-Grade Security', description: 'Trust your data to a platform with SOC 2 Type II certification, SSO capabilities, advanced permissions, and 24/7 support. ClickUp scales securely from small teams to enterprise organisations.' },
    ],
    featureListHeading: 'The ',
    featureListHeadingAccent: 'Everything App for Work',
    featureListTheme: 'dark',
    featureListColumns: 2,
    featureListItems: [
      { number: '01', title: 'Project & Task Management', description: 'Organise work with unlimited hierarchies, custom statuses, dependencies, priorities, and 15+ view types including List, Board, Gantt, Calendar, Timeline, and more.' },
      { number: '02', title: 'ClickUp Docs & Wikis', description: 'Create collaborative documents with nested pages, rich formatting, embeds, and real-time editing. Build searchable knowledge bases with automatic organisation.' },
      { number: '03', title: 'Goals & OKRs', description: 'Set, track, and achieve organisational objectives with measurable targets, progress tracking, and automated updates from connected tasks.' },
      { number: '04', title: 'Dashboards & Reporting', description: 'Build custom dashboards with 50+ widget types to visualize work, track KPIs, monitor team performance, and make data-driven decisions.' },
      { number: '05', title: 'Whiteboards & Mind Maps', description: 'Brainstorm, plan, and strategise with infinite canvas collaboration tools that convert ideas directly into actionable tasks.' },
      { number: '06', title: 'Chat & Video Clips', description: 'Keep team communication in context with threaded chat, @mentions, and async video messaging — all connected to your work.' },
      { number: '07', title: 'Time Tracking & Timesheets', description: 'Track time across tasks, generate timesheets, analyse team capacity, and integrate with payroll systems for accurate billing.' },
      { number: '08', title: 'Automations', description: 'Eliminate repetitive work with 100+ automation triggers, actions, and conditions. Create custom automations without code.' },
      { number: '09', title: 'Forms & Intake', description: 'Collect information systematically with custom forms that can automatically create tasks pre-filled with intake data.' },
      { number: '10', title: 'ClickUp Brain (AI)', description: 'Your AI assistant that works across every app. Search everything, generate content, automate updates, and get instant answers.' },
      { number: '11', title: 'Mobile & Desktop Apps', description: 'Access your work anywhere with native iOS, Android, Mac, Windows, and Linux apps with offline capabilities.' },
      { number: '12', title: 'Email Management', description: 'Send and receive emails directly in ClickUp, convert emails to tasks, and keep correspondence connected to projects.' },
    ],
    comparisonHeading: 'Comprehensive ClickUp Services',
    comparisonSubheading:
      'Our certified consultants handle everything from discovery to optimisation so your ClickUp rollout delivers value from day one.',
    comparisonTabs: [
      {
        label: 'Our Services',
        items: [
          {
            number: '01',
            title: '🔍 Discovery & Strategic Planning',
            bullets: [
              { emoji: '🧭', text: 'Comprehensive tool audit and process mapping' },
              { emoji: '🏛️', text: 'Workspace architecture design' },
              { emoji: '⚙️', text: 'Custom workflow configuration planning' },
              { emoji: '🔌', text: 'Integration requirements analysis' },
              { emoji: '📈', text: 'ROI projections and implementation timeline' },
              { emoji: '🤝', text: 'Change management strategy development' },
            ],
          },
          {
            number: '02',
            title: '📦 Migration & Data Transfer',
            bullets: [
              { emoji: '🚚', text: 'Multi-platform data migration (tasks, projects, files, comments)' },
              { emoji: '🗂️', text: 'Custom field mapping and preservation' },
              { emoji: '🗄️', text: 'Historical data retention and archive' },
              { emoji: '🔗', text: 'Integration migration planning' },
              { emoji: '🧪', text: 'Testing and validation protocols' },
              { emoji: '↩️', text: 'Rollback procedures and contingency planning' },
            ],
          },
          {
            number: '03',
            title: '🏛️ Workspace Configuration & Setup',
            bullets: [
              { emoji: '📂', text: 'Workspace hierarchy design (Spaces, Folders, Lists)' },
              { emoji: '✅', text: 'Custom statuses and workflow creation' },
              { emoji: '🧩', text: 'Custom fields and properties setup' },
              { emoji: '📊', text: 'View configuration (Board, List, Gantt, Calendar, Timeline)' },
              { emoji: '📈', text: 'Dashboard creation and reporting setup' },
              { emoji: '🔐', text: 'Permission structure and access controls' },
            ],
          },
          {
            number: '04',
            title: '🔌 Integration & Automation',
            bullets: [
              { emoji: '🔗', text: 'Native integration setup (1000+ apps)' },
              { emoji: '🛠️', text: 'API integration development, Zapier/Make automation' },
              { emoji: '⚡', text: 'ClickUp automation configuration' },
              { emoji: '📧', text: 'Email integration and routing' },
              { emoji: '⏱️', text: 'Time tracking integration' },
              { emoji: '📁', text: 'File storage connections (Drive, Dropbox, OneDrive)' },
            ],
          },
          {
            number: '05',
            title: '💼 Training & Adoption',
            bullets: [
              { emoji: '🎯', text: 'Executive and leadership training' },
              { emoji: '🏅', text: 'Admin and power user certification' },
              { emoji: '👥', text: 'End-user onboarding sessions' },
              { emoji: '🏢', text: 'Department-specific use case training' },
              { emoji: '📚', text: 'Custom documentation and guides' },
              { emoji: '🛟', text: 'Ongoing support and office hours' },
            ],
          },
          {
            number: '06',
            title: '🧠 ClickUp Brain & AI Implementation',
            bullets: [
              { emoji: '🔎', text: 'AI search configuration across workspace' },
              { emoji: '✍️', text: 'AI writing and content generation setup' },
              { emoji: '📰', text: 'Automated standups and reports' },
              { emoji: '📚', text: 'Knowledge base AI integration' },
              { emoji: '🧩', text: 'Custom AI prompts and templates' },
              { emoji: '🎓', text: 'Team AI adoption training' },
            ],
          },
          {
            number: '07',
            title: '🏥 Optimisation & Continuous Improvement',
            bullets: [
              { emoji: '🩺', text: 'Workspace health audits' },
              { emoji: '📊', text: 'Performance analytics and reporting' },
              { emoji: '⚡', text: 'Workflow optimisation recommendations' },
              { emoji: '🆕', text: 'New feature implementation' },
              { emoji: '🤖', text: 'Automation enhancement' },
              { emoji: '📋', text: 'Template refinement' },
            ],
          },
        ],
      },
      {
        label: 'Why Choose Fruition',
        items: [
          {
            number: '01',
            title: '🏆 Deep Platform Expertise',
            bullets: [
              { emoji: '🎓', text: 'Certified ClickUp consultants' },
              { emoji: '📐', text: 'Proven implementation methodology' },
              { emoji: '🏭', text: 'Industry-specific best practices' },
              { emoji: '🔁', text: 'Cross-platform migration experience' },
            ],
          },
          {
            number: '02',
            title: '🚀 Accelerated Time-to-Value',
            bullets: [
              { emoji: '⚡', text: 'Rapid onboarding' },
              { emoji: '📊', text: 'Phased rollout strategies' },
              { emoji: '🎯', text: 'Quick win identification' },
              { emoji: '🛡️', text: 'Risk mitigation planning' },
            ],
          },
          {
            number: '03',
            title: '🔧 Tailored Solutions, Not Templates',
            bullets: [
              { emoji: '🛠️', text: 'Custom workflow engineering' },
              { emoji: '🏭', text: 'Industry-specific configurations' },
              { emoji: '👥', text: 'Role-based training programs' },
              { emoji: '📈', text: 'Scalable architecture design' },
            ],
          },
          {
            number: '04',
            title: '🌐 Global Service Delivery',
            bullets: [
              { emoji: '🕐', text: 'Multi-timezone support coverage' },
              { emoji: '⚖️', text: 'Local compliance expertise' },
              { emoji: '🗺️', text: 'Regional best practices' },
              { emoji: '🌍', text: 'Localised training delivery' },
            ],
          },
        ],
      },
    ],
    industryHeading: 'ClickUp Implementation by Team Type',
    industryTabs: [
      {
        label: 'Marketing',
        title: 'Marketing Teams',
        description:
          'Plan campaigns, manage content calendars, track deliverables, and collaborate on creative assets in one visual workspace.',
        benefits: [
          { emoji: '📅', text: 'Campaign planning and calendars' },
          { emoji: '🎨', text: 'Asset collaboration and approval' },
          { emoji: '📱', text: 'Social media integration' },
          { emoji: '📝', text: 'Content management workflows' },
          { emoji: '📊', text: 'Marketing dashboards and analytics' },
          { emoji: '📧', text: 'Email marketing automation' },
        ],
      },
      {
        label: 'Product & Eng',
        title: 'Product & Engineering Teams',
        description:
          'Build better products faster with agile workflows, sprint planning, roadmaps, and seamless development tool integration.',
        benefits: [
          { emoji: '🏃', text: 'Sprint planning and backlogs' },
          { emoji: '🗺️', text: 'Product roadmaps and timelines' },
          { emoji: '👨‍💻', text: 'Code review workflows' },
          { emoji: '🐛', text: 'Bug tracking and issue management' },
          { emoji: '🔄', text: 'Git integration and 2-way sync' },
          { emoji: '🚀', text: 'Release management' },
        ],
      },
      {
        label: 'Operations',
        title: 'Operations & PMO Teams',
        description:
          'Streamline operations, manage resources, track portfolios, and ensure projects deliver on time and on budget.',
        benefits: [
          { emoji: '💼', text: 'Portfolio management' },
          { emoji: '💰', text: 'Budget tracking and reporting' },
          { emoji: '⚠️', text: 'Risk and issue management' },
          { emoji: '👥', text: 'Resource capacity planning' },
          { emoji: '🔗', text: 'Cross-functional workflows' },
          { emoji: '📈', text: 'Executive dashboards' },
        ],
      },
      {
        label: 'Sales & CRM',
        title: 'Sales & CRM Teams',
        description:
          'Manage your sales pipeline, track deals, automate follow-ups, and integrate with your CRM for complete visibility.',
        benefits: [
          { emoji: '🔄', text: 'Pipeline management' },
          { emoji: '📝', text: 'Activity logging and follow-ups' },
          { emoji: '📄', text: 'Proposal management' },
          { emoji: '🎯', text: 'Deal tracking and forecasting' },
          { emoji: '🔌', text: 'CRM integration (HubSpot, monday)' },
          { emoji: '📊', text: 'Sales analytics' },
        ],
      },
      {
        label: 'Agencies',
        title: 'Creative Agencies',
        description:
          'Deliver client projects efficiently with time tracking, client portals, approval workflows, and profitability tracking.',
        benefits: [
          { emoji: '🏢', text: 'Client workspaces and portals' },
          { emoji: '⚡', text: 'Creative workflow automation' },
          { emoji: '📊', text: 'Resource allocation' },
          { emoji: '⏱️', text: 'Time tracking and profitability' },
          { emoji: '✅', text: 'Proofing and approval processes' },
          { emoji: '📋', text: 'Retainer tracking' },
        ],
      },
      {
        label: 'HR & Ops',
        title: 'HR & Operations',
        description:
          'Centralise employee onboarding, track hiring pipelines, manage facilities, and streamline internal operations.',
        benefits: [
          { emoji: '🎯', text: 'Recruiting and onboarding' },
          { emoji: '📁', text: 'Document management' },
          { emoji: '🏢', text: 'Facility management' },
          { emoji: '👤', text: 'Employee directories' },
          { emoji: '🎫', text: 'Request intake and ticketing' },
          { emoji: '✅', text: 'Compliance tracking' },
        ],
      },
    ],
    calendlyHeading: 'Schedule a 30-min consultation with our certified ClickUp consultants',
    calendlySubheading:
      'Book a free call to scope your ClickUp rollout — workspace design, migration, automations or AI adoption.',
    faqTabs: [
      {
        label: 'ClickUp FAQs',
        items: [
          {
            question: 'How long does a typical ClickUp implementation take?',
            answer:
              'Implementation timelines vary based on organisation size and complexity. Small teams (10-50 users) typically complete implementation in 3-6 weeks. Mid-size organisations (50-200 users) usually require 6-10 weeks. Enterprise implementations (200+ users) generally take 10-16 weeks with phased rollouts.',
          },
          {
            question: 'What training options are available?',
            answer:
              'We provide comprehensive training programs including live virtual sessions, recorded modules, custom documentation, hands-on workshops, admin certification courses, and ongoing office hours. Training is tailored to executives, admins, power users, and end users.',
          },
          {
            question: 'Can ClickUp replace all our current tools?',
            answer:
              "Many organisations successfully consolidate 5-15 tools into ClickUp, replacing project management, docs, goals, time tracking, chat, and more. During discovery, we'll assess which tools ClickUp can replace and which integrations to maintain based on your specific requirements.",
          },
          {
            question: 'Do you offer post-implementation support?',
            answer:
              "Absolutely. We provide ongoing optimisation services, feature adoption assistance, workspace audits, automation development, and dedicated support channels. We're invested in your long-term success with ClickUp.",
          },
          {
            question: 'Is ClickUp secure enough for enterprise use?',
            answer:
              'Yes. ClickUp maintains SOC 2 Type II certification, GDPR compliance, and offers enterprise security features including SSO, 2FA, advanced permissions, audit logs, data residency options, and 99.99% uptime SLA.',
          },
          {
            question: 'How do you ensure successful adoption?',
            answer:
              'Our change management approach includes executive alignment, champion programs, phased rollouts, targeted training, quick wins identification, adoption tracking, and ongoing engagement. We focus on building momentum and celebrating successes to drive sustainable adoption.',
          },
        ],
      },
    ],
    joinHeadingPart1: 'Real ',
    joinHeadingAccent: 'ClickUp results',
    joinHeadingPart2: ' from real teams',
    joinSubheading: 'The numbers behind a ClickUp implementation done right.',
    joinStats: [
      { value: '1 day', label: 'per week saved on average after switching to ClickUp' },
      { value: '1,000+', label: 'integrations connect ClickUp with your entire tech stack' },
      { value: '4.6/5', label: 'average ClickUp rating from 180,000+ organisations' },
      { value: '89%', label: 'productivity gains reported within the first 90 days' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // Guidde
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'certified-guidde-partner',
    title: 'Certified Guidde Partner',
    partnerName: 'Guidde',
    partnerLogoUrl: 'https://static.wixstatic.com/media/00f73d_53fc30254ee4457fa4ea06c28db9ccb8~mv2.webp',
    heroImageUrl: 'https://static.wixstatic.com/media/00f73d_8450ac02d80a469386abfaa126e5985c~mv2.jpg',
    heroHeading: 'Guidde Partner',
    heroSubheading:
      'Transform your business with AI-powered video documentation. Fruition partners with Guidde to bring you the future of business training and documentation — create professional video guides 11x faster with cutting-edge AI.',
    primaryCtaLabel: '🚀 Get Started Today',
    primaryCtaUrl: CALENDLY_DEFAULT,
    seoTitle: 'Certified Guidde Partner | AI Video Documentation | Fruition',
    seoDescription:
      'First and only official Guidde partner in the UK. Fruition implements AI-powered video documentation so teams create training guides 11x faster.',
    capabilitiesHeading: 'Why Choose ',
    capabilitiesHeadingAccent: 'guidde for Your Business?',
    capabilitiesSubheading:
      'Revolutionary AI technology that transforms how businesses create, share, and scale their training content.',
    capabilitiesTheme: 'light',
    capabilitiesColumns: 3,
    capabilitiesCards: [
      { emoji: '⚡', title: '11x Faster Creation', description: "Create professional video documentation in minutes, not hours. guidde's AI automatically generates step-by-step guides from your screen recordings." },
      { emoji: '🎯', title: 'Zero Design Skills Required', description: 'Anyone in your team can create stunning video guides without technical or design expertise. Simply capture, and let AI do the rest.' },
      { emoji: '🌍', title: '100+ Languages & Voices', description: 'Reach global audiences with AI-generated voiceovers in over 100 languages, making your content accessible worldwide.' },
      { emoji: '📊', title: 'Advanced Analytics', description: 'Track viewer engagement, identify knowledge gaps, and optimise your content with powerful analytics and insights.' },
      { emoji: '🎨', title: 'Custom Branding', description: 'Maintain brand consistency with custom logos, colours, and styling across all your video documentation.' },
      { emoji: '🚀', title: 'Seamless Integration', description: 'Integrate with your existing tools and platforms. Share via links or embed directly into your knowledge base or LMS.' },
    ],
    comparisonHeading: 'Key Guidde Features',
    comparisonSubheading:
      'Everything you need to scale internal training, customer onboarding and product documentation.',
    comparisonTabs: [
      {
        label: 'Platform Capabilities',
        items: [
          {
            number: '01',
            title: '🎙️ Professional AI Voiceovers',
            description: 'Generate natural, multilingual voiceovers in 100+ languages — no recording studio required.',
          },
          {
            number: '02',
            title: '🎬 Drag-and-Drop Video Editor',
            description: 'Trim, rearrange and annotate AI-generated videos in a familiar timeline editor.',
          },
          {
            number: '03',
            title: '🪄 Magic Capture with Browser Extension',
            description: 'Record any process in your browser and Guidde turns it into a polished walkthrough automatically.',
          },
          {
            number: '04',
            title: '🤖 AI-Generated Step Descriptions',
            description: "Guidde watches your recording and writes the narration, captions and step text for you.",
          },
          {
            number: '05',
            title: '📊 Advanced Analytics Dashboard',
            description: 'Understand exactly where viewers drop off, what they re-watch and which guides drive value.',
          },
          {
            number: '06',
            title: '🔒 Enterprise Security & Compliance',
            description: 'SSO, granular permissions and enterprise-grade controls so your content stays protected.',
          },
        ],
      },
    ],
    calendlyHeading: 'Schedule your personalised Guidde demo',
    calendlySubheading: 'Book a demo with our implementation consultants to discover how Guidde can be customised for your business.',
    faqTabs: [
      {
        label: 'Guidde FAQs',
        items: [
          {
            question: 'What is Guidde?',
            answer:
              "Guidde is an AI-powered video documentation platform. It captures any process in your browser and automatically turns it into a polished how-to video — complete with narration, step descriptions and branded styling.",
          },
          {
            question: 'How much faster is Guidde compared to traditional video creation?',
            answer:
              'Most teams report 11x faster creation: a how-to that used to take an hour to script, record and edit can be published in minutes.',
          },
          {
            question: 'Where can I publish or share Guidde videos?',
            answer:
              'You can share via public or private links, embed videos in your knowledge base, LMS, intranet or product, and download as MP4 or GIF.',
          },
          {
            question: 'Is Guidde secure for enterprise use?',
            answer:
              'Yes. Guidde supports SSO, granular permissions and enterprise security controls so internal documentation stays protected.',
          },
        ],
      },
    ],
    joinHeadingPart1: 'Why teams choose ',
    joinHeadingAccent: 'Guidde + Fruition',
    joinHeadingPart2: '',
    joinSubheading: 'First and only official Guidde partner in the UK.',
    joinStats: [
      { value: '11x', label: 'faster video documentation creation' },
      { value: '100+', label: 'languages and voices supported' },
      { value: '🇬🇧', label: 'first official Guidde partner in the UK' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // HubSpot
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'certified-hubspot-partner',
    title: 'Certified HubSpot Solutions Partner',
    partnerName: 'HubSpot',
    partnerLogoUrl: 'https://static.wixstatic.com/media/00f73d_ee4b92720d5f43c3a0f92464889abb04~mv2.png',
    heroImageUrl: 'https://static.wixstatic.com/media/00f73d_e9ae9de6b2c34642b82520d25d5c1617~mv2.png',
    heroHeading: 'Transform Your Business with Expert HubSpot Implementation & Integration Solutions',
    heroSubheading:
      'Certified HubSpot Solutions Partner delivering enterprise CRM, marketing automation, and sales enablement services across Australia, US & the UK.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY_DEFAULT,
    seoTitle: 'Certified HubSpot Solutions Partner | CRM, Marketing & RevOps | Fruition',
    seoDescription:
      'Fruition is a certified HubSpot Solutions Partner delivering CRM implementation, marketing automation, RevOps and integrations across AU, US and UK.',
    capabilitiesHeading: 'Why Choose ',
    capabilitiesHeadingAccent: 'HubSpot for Your Business?',
    capabilitiesTheme: 'dark',
    capabilitiesColumns: 3,
    capabilitiesCards: [
      {
        emoji: '🚀',
        title: 'Streamline Revenue Operations',
        description: '',
        bullets: [
          { text: 'Align marketing and sales teams' },
          { text: 'Automate lead qualification and routing' },
          { text: 'Eliminate data silos across departments' },
          { text: 'Accelerate deal velocity with unified data' },
        ],
      },
      {
        emoji: '🤝',
        title: 'Improve Customer Experience',
        description: '',
        bullets: [
          { text: 'Centralise customer interactions' },
          { text: 'Personalise communications at scale' },
          { text: 'Omnichannel customer journey' },
          { text: 'Deliver consistent omnichannel experiences' },
        ],
      },
      {
        emoji: '📈',
        title: 'Drive Measurable Growth',
        description: '',
        bullets: [
          { text: 'Increase marketing qualified leads' },
          { text: 'Improve sales conversion rates' },
          { text: 'Reduce customer acquisition costs' },
          { text: 'Scale operations efficiently' },
        ],
      },
    ],
    featureListHeading: 'Transform Your Revenue Operations with ',
    featureListHeadingAccent: 'HubSpot',
    featureListSubheading: 'Our certified team will guide you through:',
    featureListTheme: 'light',
    featureListColumns: 3,
    featureListItems: [
      { number: '01', title: 'CRM Strategy Development', description: 'Align sales, marketing, and service operations on a unified platform.' },
      { number: '02', title: 'Platform Implementation', description: 'Configure HubSpot hubs tailored to your business processes.' },
      { number: '03', title: 'Data Migration & Integration', description: 'Seamlessly transfer legacy data and connect critical business systems.' },
      { number: '04', title: 'Team Training & Adoption', description: 'Comprehensive enablement programs for sustained platform success.' },
      { number: '05', title: 'Optimisation & Support', description: 'Continuous improvements to maximise ROI and platform performance.' },
    ],
    servicesHeading: 'Comprehensive ',
    servicesHeadingAccent: 'HubSpot Implementation Services',
    servicesSubheading:
      'End-to-end HubSpot delivery — strategy, configuration, migration, training and ongoing optimisation by HubSpot Academy certified consultants.',
    servicesTheme: 'dark',
    servicesCards: [
      {
        emoji: '🗺️',
        title: 'CRM Strategy Development',
        description: 'Align sales, marketing, and service operations on a unified platform with a clear roadmap.',
        bullets: [
          { text: 'Business process mapping and optimisation' },
          { text: 'Multi-hub implementation roadmaps' },
          { text: 'ROI modeling and KPI framework development' },
        ],
      },
      {
        emoji: '⚙️',
        title: 'Platform Implementation',
        description: 'Configure HubSpot hubs tailored to your business processes and team structure.',
        bullets: [
          { text: 'Advanced CRM configuration across all hubs' },
          { text: 'Custom workflow automation design' },
          { text: 'CMS Hub website development and optimisation' },
        ],
      },
      {
        emoji: '🔌',
        title: 'Data Migration & Integration',
        description: 'Seamlessly transfer legacy data and connect critical business systems.',
        bullets: [
          { text: 'Migration from Salesforce, Pipedrive, custom DBs' },
          { text: 'API integration development for proprietary systems' },
          { text: 'Connect ERP, accounting, e-commerce and BI platforms' },
        ],
      },
      {
        emoji: '🎓',
        title: 'Team Training & Adoption',
        description: 'Comprehensive enablement programs for sustained platform success.',
        bullets: [
          { text: 'HubSpot Academy certified consultants' },
          { text: 'Department-specific training programs' },
          { text: 'Change management and adoption strategies' },
        ],
      },
      {
        emoji: '🚀',
        title: 'Ongoing Optimisation & Support',
        description: 'Continuous improvements to maximise ROI and platform performance.',
        bullets: [
          { text: 'Performance monitoring and reporting' },
          { text: 'Workflow refinements and new use cases' },
          { text: 'Dedicated retainer support packages' },
        ],
      },
      {
        emoji: '🌐',
        title: 'Specialist Integration Development',
        description: 'Connect HubSpot with your ERP, accounting, e-commerce and BI platforms to drive a unified customer view.',
        bullets: [
          { text: 'Custom objects, workflows, and automation' },
          { text: 'Revenue operations alignment' },
          { text: 'Enterprise integration development' },
        ],
      },
    ],
    comparisonHeading: 'HubSpot Specialist Areas',
    comparisonSubheading:
      'Deep expertise across the HubSpot platform — pick the focus area that matches your growth priorities.',
    comparisonTheme: 'light',
    comparisonTabs: [
      {
        label: 'Specialist Areas',
        items: [
          { number: '01', title: '🛠️ Advanced CRM Configuration', description: 'Custom objects, workflows, and automation across all HubSpot hubs.' },
          { number: '02', title: '🤝 Revenue Operations Alignment', description: 'Unified processes connecting marketing, sales, and customer success teams.' },
          { number: '03', title: '📧 Marketing Automation Excellence', description: 'Lead nurturing, email campaigns, and behavioural triggers that convert.' },
          { number: '04', title: '📊 Sales Enablement Solutions', description: 'Pipeline management, deal tracking, and forecasting tools that close more deals.' },
          { number: '05', title: '🌐 Enterprise Integration Development', description: 'Connect HubSpot with your ERP, accounting, e-commerce, and BI platforms.' },
        ],
      },
    ],
    calendlyHeading: 'Schedule a 30-min consultation with our HubSpot experts',
    calendlySubheading:
      'Contact our HubSpot experts to begin your digital transformation journey. As a certified Solutions Partner, we deliver enterprise-grade CRM and marketing automation that drives revenue growth and customer satisfaction.',
    faqTabs: [
      {
        label: 'HubSpot FAQs',
        items: [
          {
            question: 'How long does a typical HubSpot implementation take?',
            answer:
              'Implementation timelines vary based on complexity, but standard deployments range from 4-12 weeks. Enterprise implementations with extensive integrations and migrations may take 12-20 weeks. We provide detailed project plans with clear milestones during the discovery phase.',
          },
          {
            question: 'Can you migrate data from our existing CRM?',
            answer:
              'Yes, we specialise in data migration from platforms including Salesforce, Pipedrive, and custom databases. Our migration process includes data cleaning, mapping, testing, and validation to ensure accuracy.',
          },
          {
            question: 'What integrations can you implement with HubSpot?',
            answer:
              'We integrate HubSpot with 1,500+ applications through the HubSpot marketplace, plus custom API integrations with proprietary systems. Common integrations include Salesforce, Shopify, QuickBooks, Slack, WordPress, and various marketing tools.',
          },
          {
            question: 'What ongoing support do you offer after implementation?',
            answer:
              'We offer flexible retainer packages for ongoing optimisation, technical support, training, and strategic consulting. Many clients maintain monthly retainers to ensure continuous improvement and maximum ROI.',
          },
        ],
      },
    ],
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'HubSpot Marketing Hub',
    joinHeadingPart2: '',
    joinSubheading: 'Independent research on the platform that powers your revenue engine.',
    joinStats: [
      { value: '33%', label: 'increase in qualified leads' },
      { value: '42%', label: 'sales productivity improvement' },
      { value: '200,000+', label: 'customers worldwide' },
      { value: '1,500+', label: 'integrations available' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // Hootsuite
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'hootsuite-delivery-partner',
    title: 'Hootsuite APAC Delivery Partner',
    partnerName: 'Hootsuite',
    partnerLogoUrl: 'https://static.wixstatic.com/media/39b8ef_dbd91446b6904a68b700654caa5621a7~mv2.png',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_caca8d9fb7b14307893bb60e6335e5da~mv2.png',
    heroHeading: 'Hootsuite APAC Implementation Partner',
    heroSubheading:
      'Our team of certified Hootsuite experts is dedicated to providing tailored solutions that align with your unique goals — streamlining social media management, enhancing brand visibility, and driving meaningful engagement.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY_DEFAULT,
    seoTitle: 'Hootsuite APAC Delivery Partner | Implementation & Training | Fruition',
    seoDescription:
      'Fruition is a certified Hootsuite APAC implementation partner delivering social media setup, training, automation and analytics services.',
    comparisonHeading: 'Drive business impact with real-time social insights on Hootsuite.',
    comparisonSubheading:
      'We transform disconnected social media scheduling and monitoring into unified, automated workflows that enhance cross-team collaboration and deliver measurable ROI across all your social channels with our training and implementation services.',
    comparisonTheme: 'dark',
    comparisonTabs: [
      {
        label: 'Hootsuite Features',
        items: [
          {
            number: '01',
            title: 'Create, schedule, and publish content',
            description:
              'Manage all your social media networks in one place. Overcome creative block with our AI writer and post idea generator.',
          },
          {
            number: '02',
            title: 'Connect with your audience and grow your brand',
            description:
              'For customer service teams, the tools make it easy to respond fast and improve customer satisfaction. And team collaboration features make it easy for social media managers and customer support to work together more efficiently.',
          },
          {
            number: '03',
            title: 'Track trends and monitor topics, mentions, and hashtags',
            description:
              'See brand sentiment and get ideas for what to post. Blue Silk AI™ condenses complex data down to easy-to-read summaries and detects brand mentions in photos, videos, and gifs.',
          },
          {
            number: '04',
            title: 'Make data-driven decisions',
            description:
              "Decide with data every time you post with in-depth social media analytics tools. Maximise engagement by seeing the best time to post based on your audience and goals. Hootsuite Analytics will even show you industry benchmarks to see how you're doing compared to your peers.",
          },
          {
            number: '05',
            title: 'Get more out of every ad dollar',
            description:
              "Manage your paid social media ads alongside your organic content in an attractive social media calendar. Side-by-side reporting lets you determine which posts are working and which aren't. Automatically convert your top-performers into ads with Hootsuite Boost.",
          },
        ],
      },
      {
        label: 'Our Hootsuite Services',
        items: [
          {
            number: '01',
            title: '⚙️ Hootsuite Setup & Configuration',
            bullets: [
              { emoji: '🆕', text: 'Account creation and customisation' },
              { emoji: '🔗', text: 'Social media profile integration' },
              { emoji: '👥', text: 'Team member and access management' },
            ],
          },
          {
            number: '02',
            title: '🧭 Strategic Planning & Consulting',
            bullets: [
              { emoji: '📋', text: 'Social media strategy development' },
              { emoji: '📅', text: 'Content calendars and posting schedules' },
              { emoji: '🏭', text: 'Best practices and industry-specific guidance' },
            ],
          },
          {
            number: '03',
            title: '🎓 Training & Support',
            bullets: [
              { emoji: '📚', text: 'Comprehensive Hootsuite platform training' },
              { emoji: '🛟', text: 'Ongoing technical support and troubleshooting' },
              { emoji: '🔁', text: 'Regular check-ins and performance reviews' },
            ],
          },
          {
            number: '04',
            title: '🔌 Custom Integrations & Automation',
            bullets: [
              { emoji: '🧩', text: 'Integration with third-party tools and platforms' },
              { emoji: '📊', text: 'Custom dashboard creation and reporting' },
              { emoji: '🤖', text: 'Automation of repetitive tasks and workflows' },
            ],
          },
          {
            number: '05',
            title: '📈 Analytics & Reporting',
            bullets: [
              { emoji: '🔎', text: 'In-depth social media performance analysis' },
              { emoji: '📑', text: 'Customised reports and insights' },
              { emoji: '💡', text: 'Data-driven recommendations for optimisation' },
            ],
          },
        ],
      },
    ],
    calendlyHeading: 'Schedule a 30-min consultation with our certified Hootsuite consultants',
    calendlySubheading:
      'Talk to a certified Hootsuite expert about strategy, setup, training or analytics.',
    faqTabs: [
      {
        label: 'Hootsuite FAQs',
        items: [
          {
            question: 'What is Hootsuite used for?',
            answer:
              'Hootsuite is a social media management platform that lets you schedule content, monitor conversations, manage paid campaigns and report on social performance — all from a single dashboard.',
          },
          {
            question: 'Why work with a certified Hootsuite delivery partner?',
            answer:
              "A certified partner accelerates time to value — proper account architecture, integrations, training and reporting from day one — and gives you ongoing optimisation as Hootsuite's platform evolves.",
          },
          {
            question: 'Do you support paid social as well as organic?',
            answer:
              'Yes. We help teams manage paid ads alongside organic content in one calendar, with side-by-side reporting and Hootsuite Boost to auto-promote top organic posts.',
          },
        ],
      },
    ],
    joinHeadingPart1: 'A decade of ',
    joinHeadingAccent: 'social media delivery',
    joinHeadingPart2: '',
    joinSubheading: "Numbers from Fruition's Hootsuite delivery practice across APAC.",
    joinStats: [
      { value: '10+', label: 'years experience' },
      { value: '1,050+', label: 'projects completed' },
      { value: '500+', label: 'satisfied clients' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // Aircall
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'aircall-partner',
    title: 'Certified Aircall Partner',
    partnerName: 'Aircall',
    partnerLogoUrl: 'https://static.wixstatic.com/media/39b8ef_f3614c2185574c8b9e725bc530bcd96b~mv2.png',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_f527d9895db24a8bb11e6691a850444b~mv2.png',
    heroHeading: 'Aircall Certified Partner',
    heroSubheading:
      "Fruition is an official Aircall Partner specialising in enterprise-grade cloud phone implementations. Our certified team delivers Aircall integrations across CRM, contact centre and sales workflows — set up in minutes, scaled for the long run.",
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY_DEFAULT,
    seoTitle: 'Certified Aircall Partner | Cloud Phone System Integration | Fruition',
    seoDescription:
      "Official Aircall Partner delivering CRM-integrated cloud phone systems with smart routing, AI-powered call insights and contact centre operations.",
    capabilitiesHeading: 'Why Choose Aircall',
    capabilitiesCards: [
      { emoji: '📞', title: 'Advanced Communication Features', description: 'Real-time call monitoring & recording, smart call distribution, advanced analytics and international numbers across 100+ countries.' },
      { emoji: '🔌', title: 'Seamless Integration', description: 'Native CRM connections to Salesforce, HubSpot, Zendesk and monday.com plus custom API integrations and workflow automation tools.' },
      { emoji: '🔐', title: 'Security & Compliance', description: 'End-to-end call encryption, GDPR and HIPAA compliance, 24/7 security monitoring and secure data storage protocols.' },
    ],
    comparisonHeading: 'Top Challenges We Solve',
    comparisonSubheading:
      'How an Aircall implementation tackles the four issues most contact centres are losing time and money to today.',
    comparisonTabs: [
      {
        label: 'Top Challenges',
        items: [
          {
            number: '01',
            title: '📞 Call Abandonment Rate',
            description:
              "Long wait times cause customers to hang up. Aircall's smart call routing and call-back features keep customers off hold. Real-time analytics let teams forecast busy periods, optimise staffing and respond faster.",
          },
          {
            number: '02',
            title: '🔁 Repetitive Tasks',
            description:
              "Aircall's AI features — call transcription, tags, summaries and Call Scoring — eliminate pre- and post-call admin so agents focus on the customer relationship, not the paperwork.",
          },
          {
            number: '03',
            title: '🎯 Low First Call Resolution Rate',
            description:
              'Call recordings, in-call coaching and whispering help managers tackle challenging calls faster with less disruption. Custom tags and analytics turn FCR into a metric you can actually move.',
          },
          {
            number: '04',
            title: '🧩 Disconnected Tech Stack',
            description:
              'Connect your CRM and helpdesk so customer data flows into every call. Add new users, claim local or international numbers, and scale globally without re-platforming.',
          },
        ],
      },
      {
        label: 'How We Help',
        items: [
          {
            number: '01',
            title: '🤝 Aircall Integration Services',
            bullets: [
              { emoji: '🔗', text: 'Complete CRM integration: Salesforce, HubSpot, Zendesk' },
              { emoji: '☎️', text: 'Custom contact centre solutions for support teams' },
              { emoji: '📈', text: 'Sales operations: routing, analytics, performance' },
              { emoji: '🛟', text: 'Expert implementation support throughout deployment' },
            ],
          },
          {
            number: '02',
            title: '⚡ Working with Fruition',
            bullets: [
              { emoji: '🚀', text: 'Rapid deployment and setup' },
              { emoji: '🛠️', text: 'Custom integration development' },
              { emoji: '🎓', text: 'Comprehensive team training' },
              { emoji: '📊', text: 'Performance optimisation services' },
            ],
          },
          {
            number: '03',
            title: '🌍 Scale Your Communications',
            bullets: [
              { emoji: '☁️', text: 'Deploy cloud communications rapidly' },
              { emoji: '💸', text: 'Reduce operational costs significantly' },
              { emoji: '😊', text: 'Improve customer service metrics' },
              { emoji: '🏠', text: 'Enable remote team collaboration' },
            ],
          },
        ],
      },
    ],
    solutionCards: [
      {
        eyebrow: 'Set up in seconds',
        heading: 'Claim numbers, integrate, and scale — in clicks',
        body:
          'Easily claim numbers, set up integrations and manage your phone system with just a few clicks. Enhance every customer interaction with AI Voice Agents, instant insights, WhatsApp messaging and more.',
        imageUrl: 'https://static.wixstatic.com/media/39b8ef_6c10d4508c4548458ef35748fe7437f9~mv2.webp',
      },
      {
        eyebrow: 'Sales & Customer Support',
        heading: 'Better resolution rates, in one shared inbox',
        body:
          "Powerful shared inbox features keep cross-channel conversations under control. Agents know exactly what to do next instead of asking customers to repeat themselves.",
        imageUrl: 'https://static.wixstatic.com/media/39b8ef_72633f63899c4698b09cfb9f7a84c45e~mv2.webp',
      },
    ],
    calendlyHeading: 'Schedule a 30-min Aircall consultation',
    calendlySubheading: 'AI-powered customer conversations made easy.',
    faqTabs: [
      {
        label: 'Aircall FAQs',
        items: [
          {
            question: 'What is Aircall and how does it work?',
            answer:
              'Aircall is a cloud-based phone system designed to replace traditional phone systems with a flexible, scalable communications solution. Instead of physical phone lines, Aircall uses the internet to transmit voice data, letting users make and receive calls through software on any device.',
          },
          {
            question: 'What is Aircall Workspace?',
            answer:
              "Aircall Workspace helps end users navigate customer conversations with greater clarity — moving effortlessly between inboxes, conversations and customer context, all in one place.",
          },
          {
            question: 'How is Aircall different from other customer communication platforms?',
            answer:
              'Aircall is extremely easy to set up — minutes, no hardware. It syncs information across CRM, helpdesk and other essential tools, and provides clear analytics so you can monitor team performance in real time.',
          },
          {
            question: 'What is the Aircall + monday.com integration?',
            answer:
              "The integration connects your phone system with your work management platform, automatically logging calls, tracking conversations and managing customer interactions directly in monday.com.",
          },
          {
            question: 'How does Aircall integrate with monday.com?',
            answer:
              'Once connected, every incoming and outgoing call from Aircall can be automatically recorded in monday.com as an item or activity — centralising communication, follow-up tasks and call history without switching tools.',
          },
          {
            question: 'What are the benefits of using Aircall with monday.com?',
            answer:
              'Automatic call logging in monday.com boards, a centralised view of customer communications, streamlined sales and support workflows, increased accountability with call tracking, and reduced manual data entry.',
          },
          {
            question: 'Does the integration support automation?',
            answer:
              'Yes. You can create monday.com automations triggered by Aircall events. For example, when a missed call is logged, monday.com can notify the responsible team member or create a follow-up task automatically.',
          },
          {
            question: 'Is call data secure with the Aircall–monday.com integration?',
            answer:
              'Yes. Both Aircall and monday.com use advanced security protocols including data encryption and GDPR compliance to keep your call logs and customer information protected.',
          },
        ],
      },
    ],
    joinHeadingPart1: 'A decade of ',
    joinHeadingAccent: 'communications delivery',
    joinHeadingPart2: '',
    joinSubheading: 'Numbers behind our Aircall implementation practice.',
    joinStats: [
      { value: '10+', label: 'years experience' },
      { value: '1,050+', label: 'projects completed' },
      { value: '500+', label: 'satisfied clients' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // Atlassian
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'certified-atlassian-partner',
    title: 'Atlassian Certified Partner',
    partnerName: 'Atlassian',
    partnerLogoUrl: 'https://static.wixstatic.com/media/00f73d_cb26f511466042d69a9a7bbf49c711d8~mv2.png',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_e037355191fb41678315271590aac78b~mv2.png',
    heroHeading: 'Atlassian Certified Partner',
    heroSubheading:
      'Transform your business with seamless Atlassian integration. Automate enterprise workflows and implement powerful API integrations with our certified Atlassian solutions.',
    primaryCtaLabel: '🚀 Book a Meeting',
    primaryCtaUrl: CALENDLY_DEFAULT,
    secondaryCtaLabel: '📑 See Our Process',
    secondaryCtaUrl: '#our-process',
    seoTitle: 'Certified Atlassian Partner | Jira, Confluence, ROVO | Fruition',
    seoDescription:
      "Certified Atlassian partner: Jira, Confluence, JSM, ROVO and Atlassian Cloud migration delivered by Fruition.",
    capabilitiesHeading: 'Accelerate Your Enterprise with Atlassian',
    capabilitiesCards: [
      { emoji: '🤖', title: '#1 in ROVO', description: 'As former Atlassian team members, we build out ROVO AI agents with clear ROI — virtual service management agents, Jira chat support, and search across Confluence and Jira.' },
      { emoji: '🛎️', title: 'Service Management', description: 'Transform customer and employee support with Jira Service Management. Realise 277% ROI and eliminate disconnects between development and operations.' },
      { emoji: '☁️', title: 'Cloud Migration', description: 'Future-proof your Atlassian investment with secure, optimised expert cloud migration — including monday-Atlassian integration and Jira connectors.' },
      { emoji: '🤝', title: 'Direct Atlassian Expertise', description: 'Our close ties with Atlassian give you direct access to experts for insider advice and best practices — proactive, not just at renewal.' },
    ],
    comparisonHeading: 'Our Comprehensive Atlassian Services',
    comparisonSubheading: 'End-to-end Atlassian delivery from discovery to continuous improvement.',
    comparisonTabs: [
      {
        label: 'Our Services',
        items: [
          {
            number: '01',
            title: '🗺️ Process Discovery & Strategic Planning',
            description:
              'Map existing processes, define automation goals, analyse bottlenecks, and identify high-ROI opportunities across Jira, Confluence and JSM.',
            bullets: [
              { emoji: '🔍', text: 'Comprehensive process audit' },
              { emoji: '🎯', text: 'Automation opportunity assessment' },
              { emoji: '📈', text: 'ROI projections and timelines' },
              { emoji: '🧩', text: 'Custom integration planning' },
            ],
          },
          {
            number: '02',
            title: '👥 Tailored Training',
            description:
              'Comprehensive documentation and hands-on workshops tailored to your team — turning resistance into enthusiastic adoption.',
            bullets: [
              { emoji: '🎓', text: 'Personalised training sessions' },
              { emoji: '🧭', text: 'Day-to-day Atlassian usage walkthroughs' },
            ],
          },
          {
            number: '03',
            title: '⚡ Custom Configuration',
            description:
              'Configure Atlassian products to support your team, your processes and your systems with rigorous testing and validation.',
            bullets: [
              { emoji: '👥', text: 'User-centered design methodology' },
              { emoji: '🧪', text: 'Comprehensive testing protocols' },
              { emoji: '⚡', text: 'Performance optimisation' },
            ],
          },
          {
            number: '04',
            title: '🕙 Production Deployment & Monitoring',
            description:
              'Deploy enterprise-ready automations with dashboards, intelligent alerts and metrics that quantify efficiency gains.',
            bullets: [
              { emoji: '📊', text: 'Real-time performance dashboards' },
              { emoji: '🚨', text: 'Proactive alert systems' },
              { emoji: '📑', text: 'Detailed analytics and reporting' },
              { emoji: '💰', text: 'Cost tracking and optimisation' },
            ],
          },
          {
            number: '05',
            title: '☁️ Cloud Migration',
            description:
              'Take the guesswork out of your migration with recommendations, resources and tools for every stage — and a smooth path to the cloud.',
          },
          {
            number: '06',
            title: '📈 Continuous Improvement',
            description:
              'Ongoing support to refine workflows, implement enhancements and add new automation use cases as your business evolves.',
          },
        ],
      },
    ],
    solutionCards: [
      {
        eyebrow: 'Step 1',
        heading: 'Pick the right tools',
        body:
          "With our deep experience inside Atlassian, we'll guide you to the tools that fit your needs. You'll even get the chance to chat with the Atlassian Product team directly, ensuring your decisions are solid.",
        imageUrl: 'https://static.wixstatic.com/media/a280a5_e037355191fb41678315271590aac78b~mv2.png',
      },
      {
        eyebrow: 'Step 2',
        heading: 'Implement with ease',
        body:
          "Our experts lead the way, turning ideas into action with seamless implementation. Instead of bottlenecking knowledge, we use a 'train the trainer' model to build centres of excellence within your teams — so expertise stays with you.",
        imageUrl: 'https://static.wixstatic.com/media/a280a5_b18f1f18d3334638adc64fab0ec8e371~mv2.png',
      },
      {
        eyebrow: 'Step 3',
        heading: 'Boost adoption and team engagement',
        body:
          "We stick with you, offering proactive online training (leveraging free Atlassian University resources) and personalised support for your admins and power users. Need help with the details? We've got you covered.",
        ctaLabel: '🚀 Book a Meeting',
        ctaUrl: CALENDLY_DEFAULT,
      },
    ],
    calendlyHeading: 'Schedule a personalised Atlassian consult',
    calendlySubheading: 'Book a time with our product specialists to see how an Atlassian solution can be tailored to your specific business needs.',
    faqTabs: [
      {
        label: 'Atlassian FAQs',
        items: [
          {
            question: 'What is Atlassian used for?',
            answer:
              'Atlassian Cloud is a suite of cloud-based software and collaboration tools — products designed to help teams with software development, project management and team collaboration tasks.',
          },
          {
            question: 'What does Atlassian do?',
            answer:
              'Atlassian Corporation is an Australian-American software company that specialises in collaboration tools designed primarily for software development and project management.',
          },
          {
            question: 'What is Atlassian best known for?',
            answer:
              'Jira, Confluence, Trello and Bitbucket. Jira is project management, Confluence is collaboration and knowledge base, Trello is visual project management, and Bitbucket is code hosting and collaboration.',
          },
          {
            question: 'Who uses Atlassian?',
            answer:
              'Atlassian products are used by teams across many industries. Notable customers include Citigroup, eBay, Netflix, NASA, Coca-Cola, and United Airlines. 80% of Fortune 500 companies are Atlassian customers.',
          },
        ],
      },
    ],
    joinHeadingPart1: 'Proven ',
    joinHeadingAccent: 'Atlassian Cloud',
    joinHeadingPart2: ' results',
    joinSubheading: 'Real numbers from organisations running on Atlassian Cloud and JSM.',
    joinStats: [
      { value: '20%', label: 'ticket deflection with Jira Service Management' },
      { value: '358%', label: 'return on investment for companies using Atlassian Cloud' },
      { value: '3-4 hrs', label: 'saved per employee per day with Confluence AI replacing intranets' },
    ],
  },
]

function slugKey(slug: string, prefix: string, idx: number, sub?: number) {
  const base = `${prefix}-${slug}-${idx}`
  return sub === undefined ? base : `${base}-${sub}`
}

async function buildDocument(p: PartnerPage) {
  const docId = `partnershipPage-${p.slug}`

  const heroImage = p.heroImageUrl
    ? await uploadImageFromUrl(p.heroImageUrl, `${p.slug}-hero${extensionOf(p.heroImageUrl)}`)
    : undefined
  const partnerLogo = p.partnerLogoUrl
    ? await uploadImageFromUrl(p.partnerLogoUrl, `${p.slug}-logo${extensionOf(p.partnerLogoUrl)}`)
    : undefined

  const solutionCards = p.solutionCards
    ? await Promise.all(
        p.solutionCards.map(async (card, idx) => {
          const image = card.imageUrl
            ? await uploadImageFromUrl(card.imageUrl, `${p.slug}-solution-${idx}${extensionOf(card.imageUrl)}`)
            : undefined
          return {
            _key: slugKey(p.slug, 'sc', idx),
            _type: 'solutionCard',
            eyebrow: card.eyebrow,
            heading: card.heading,
            body: card.body,
            ctaLabel: card.ctaLabel,
            ctaUrl: card.ctaUrl,
            ...(image ? { image } : {}),
          }
        }),
      )
    : undefined

  const comparisonTabs = p.comparisonTabs?.map((tab, ti) => ({
    _key: slugKey(p.slug, 'ct', ti),
    _type: 'comparisonTab',
    label: tab.label,
    items: tab.items.map((item, ii) => ({
      _key: slugKey(p.slug, `ct${ti}-i`, ii),
      _type: 'comparisonItem',
      number: item.number,
      title: item.title,
      description: item.description,
      bullets: item.bullets?.map((b, bi) => ({
        _key: slugKey(p.slug, `ct${ti}-i${ii}-b`, bi),
        _type: 'bullet',
        emoji: b.emoji,
        text: b.text,
      })),
    })),
  }))

  const capabilitiesCards = p.capabilitiesCards?.map((c, i) => ({
    _key: slugKey(p.slug, 'cap', i),
    _type: 'capabilityCard',
    emoji: c.emoji,
    title: c.title,
    description: c.description,
    bullets: c.bullets?.map((b, bi) => ({
      _key: slugKey(p.slug, `cap${i}-b`, bi),
      _type: 'bullet',
      emoji: b.emoji,
      text: b.text,
    })),
  }))

  const servicesCards = p.servicesCards?.map((c, i) => ({
    _key: slugKey(p.slug, 'svc', i),
    _type: 'serviceCard',
    emoji: c.emoji,
    title: c.title,
    description: c.description,
    bullets: c.bullets?.map((b, bi) => ({
      _key: slugKey(p.slug, `svc${i}-b`, bi),
      _type: 'bullet',
      emoji: b.emoji,
      text: b.text,
    })),
  }))

  const featureListItems = p.featureListItems?.map((item, i) => ({
    _key: slugKey(p.slug, 'feat', i),
    _type: 'featureItem',
    number: item.number,
    title: item.title,
    description: item.description,
  }))

  const industryTabs = p.industryTabs?.map((t, i) => ({
    _key: slugKey(p.slug, 'ind', i),
    _type: 'industryTab',
    label: t.label,
    title: t.title,
    description: t.description,
    benefits: t.benefits.map((b, bi) => ({
      _key: slugKey(p.slug, `ind${i}-b`, bi),
      _type: 'benefit',
      emoji: b.emoji,
      text: b.text,
    })),
  }))

  const faqTabs = p.faqTabs?.map((tab, ti) => ({
    _key: slugKey(p.slug, 'faq', ti),
    _type: 'faqTab',
    label: tab.label,
    items: tab.items.map((q, qi) => ({
      _key: slugKey(p.slug, `faq${ti}-q`, qi),
      _type: 'faqPair',
      question: q.question,
      answer: q.answer,
    })),
  }))

  const joinStats = p.joinStats?.map((s, i) => ({
    _key: slugKey(p.slug, 'stat', i),
    _type: 'stat',
    value: s.value,
    label: s.label,
  }))

  return {
    _id: docId,
    _type: 'partnershipPage',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    partnerName: p.partnerName,
    ...(partnerLogo ? { partnerLogo } : {}),
    heroHeading: p.heroHeading,
    heroSubheading: p.heroSubheading,
    ...(heroImage ? { heroImage } : {}),
    primaryCtaLabel: p.primaryCtaLabel,
    primaryCtaUrl: p.primaryCtaUrl,
    secondaryCtaLabel: p.secondaryCtaLabel,
    secondaryCtaUrl: p.secondaryCtaUrl,
    capabilitiesHeading: p.capabilitiesHeading,
    capabilitiesHeadingAccent: p.capabilitiesHeadingAccent,
    capabilitiesSubheading: p.capabilitiesSubheading,
    capabilitiesTheme: p.capabilitiesTheme,
    capabilitiesColumns: p.capabilitiesColumns,
    capabilitiesCards,
    servicesHeading: p.servicesHeading,
    servicesHeadingAccent: p.servicesHeadingAccent,
    servicesSubheading: p.servicesSubheading,
    servicesTheme: p.servicesTheme,
    servicesCards,
    featureListHeading: p.featureListHeading,
    featureListHeadingAccent: p.featureListHeadingAccent,
    featureListSubheading: p.featureListSubheading,
    featureListTheme: p.featureListTheme,
    featureListColumns: p.featureListColumns,
    featureListItems,
    comparisonHeading: p.comparisonHeading,
    comparisonSubheading: p.comparisonSubheading,
    comparisonTabs,
    comparisonTheme: p.comparisonTheme,
    industryHeading: p.industryHeading,
    industryTabs,
    solutionCards,
    calendlyHeading: p.calendlyHeading,
    calendlySubheading: p.calendlySubheading,
    faqTabs,
    joinHeadingPart1: p.joinHeadingPart1,
    joinHeadingAccent: p.joinHeadingAccent,
    joinHeadingPart2: p.joinHeadingPart2,
    joinSubheading: p.joinSubheading,
    joinStats,
    joinFootnote: p.joinFootnote,
  }
}

function extensionOf(url: string): string {
  const m = url.match(/\.(png|jpe?g|webp|gif|avif|svg)(\?|~|$)/i)
  return m ? `.${m[1].toLowerCase()}` : '.png'
}

async function main() {
  console.log(`Migrating ${pages.length} partnership pages...`)
  for (const p of pages) {
    console.log(`\n→ ${p.slug}`)
    const doc = await buildDocument(p)
    await writeClient.createOrReplace(doc)
    console.log(`  ✓ wrote partnershipPage-${p.slug}`)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
