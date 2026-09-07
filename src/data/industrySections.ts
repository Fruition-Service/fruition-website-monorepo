import type { CapabilityBlock, IndustryPoint, SpecPanel } from '@/components/sections/types'

/**
 * Long-form copy for the industry landing pages, lifted from the Fruition blog
 * archive and re-cut for the page.
 *
 * Construction, real estate, professional services and manufacturing came from
 * the content team's Aug 2026 handover. The FAQ half of that handover already
 * lives in Sanity as `faqItem` docs / page `faqTabs`; only the sections marked
 * "Use as H2" are here, because they needed section designs that did not exist
 * yet. Retail, marketing and government were then mined from the same blog
 * archive so every industry landing page carries the treatment:
 *   - retail      → monday-com-for-retail
 *   - marketing   → top-marketing-challenges, 5-mondaycom-features-for-marketing-teams
 *   - government  → mondaycom-enterprise-permissions (Enterprise-plan controls)
 *   - solar       → monday-com-for-solar
 *
 * The /industries leaves key off their full path ('industries/solar-renewables').
 * Their approach trio comes from the practice-cluster data instead — see
 * src/data/practicePages/toIndustryPage.ts.
 *
 * Every string may carry the inline-markdown subset `<RichText>` renders —
 * `**bold**` and `[text](/relative/path)`. Blog links are the current slugs,
 * not the Wix-era ones the source documents were written against.
 */

export interface CapabilityBlocksContent {
  eyebrow: string
  heading: string
  /** Trailing half of the heading, in voltage purple. Omitted when the copy is
   *  a single declarative sentence that reads worse split in two. */
  headingAccent?: string
  lead?: string
  columns?: 2 | 3
  blocks: CapabilityBlock[]
}

export interface BenefitLedgerContent {
  eyebrow: string
  heading: string
  headingAccent?: string
  intro?: string
  items: IndustryPoint[]
  footnote?: string
}

export interface TemplateSpecContent {
  eyebrow: string
  heading: string
  headingAccent?: string
  lead?: string
  columns?: 2 | 3
  panels: SpecPanel[]
}

export interface IndustrySections {
  capabilityBlocks?: CapabilityBlocksContent
  benefitLedger?: BenefitLedgerContent
  templateSpec?: TemplateSpecContent
}

const CONSTRUCTION: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Site-to-office',
    heading: '3 ways monday.com for construction bridges the',
    headingAccent: 'site-to-office gap',
    lead: 'Capturing on-site data, generating safety reports and raising RFIs is the easy part. Getting them to the office while there is still time to act is where projects are won or lost.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Real-time updates: instant team collaboration',
        lead: 'Automatic reminders for upcoming deadlines, and real-time progress updates the moment they are logged — whether by a site crew member in the field or a construction PMO in the office.',
        points: [
          {
            label: 'Automatic deadline reminders',
            text: 'No critical milestone is missed, regardless of location.',
          },
          {
            label: 'Mobile app access',
            text: 'Technicians and on-site workers stay connected with HQ in real time.',
          },
          {
            label: 'Instant progress updates',
            text: 'Visible to both office and field teams the moment they are entered.',
          },
          {
            label: 'Comment and feedback',
            text: 'Threads attach directly to specific tasks and RFIs, which keeps everyone in the loop and eliminates email trails.',
          },
        ],
      },
      {
        number: '02',
        title: 'Centralised document hub: one source of truth',
        lead: 'monday.com stores RFIs, images, inspection forms, project assets and more in a secure, searchable location. At the office or in the field, teams reach the latest file version.',
        points: [
          {
            text: 'Integrations with Dropbox, Outlook and Google Drive bring existing file workflows into monday WorkOS.',
          },
          { text: 'Mobile file access from any device across active construction sites.' },
          { text: 'Centralised storage for all construction documents, assets and drawings.' },
          { text: 'Real-time document collaboration, so everyone works from the current version.' },
          { text: 'Native documentation features like monday WorkDocs and WorkForms.' },
        ],
      },
      {
        number: '03',
        title: 'Automation bridges: removing manual handoffs',
        lead: 'The handoffs between site and office are where days disappear. These are the ones monday.com for construction automates away.',
        points: [
          { text: 'Progress reports are delivered to the relevant team members without manual compilation.' },
          {
            text: 'Notifications go out when deadlines approach, tasks are completed or budget thresholds are breached.',
          },
          { text: 'Invoice processing and payment tracking keep financial workflows on schedule.' },
          { text: 'Safety reports are generated once a completed inspection checklist triggers them.' },
        ],
      },
    ],
  },
  benefitLedger: {
    eyebrow: '// monday CRM for construction',
    heading: 'Benefits of using monday CRM for',
    headingAccent: 'construction',
    intro:
      'Construction software has always struggled with competition, cost management, complexity and regulatory compliance. monday CRM [aims to solve these](/post/monday-crm-construction) by being adaptive, flexible, customisable and full of unique features.\n\nThe result is better operational efficiency and higher customer satisfaction. Take a look at the key benefits — read: profitability — this platform offers.',
    items: [
      { text: 'Enables personalised, tailored client interactions and follow-ups.' },
      { text: 'Ensures you can track client histories, access communication logs and determine preferences.' },
      { text: 'Facilitates seamless communication between team members, clients and subcontractors.' },
      { text: 'Delivers real-time updates through document sharing and collaborative features.' },
      { text: 'Keeps you aligned with clients in one platform thanks to centralised data storage.' },
      {
        text: '[Visualises your business performance](/post/data-visualisation-on-monday-com) across insights, project profitability, sales pipeline and workforce productivity.',
      },
      {
        text: 'Excels at lead and client management by tracking interactions and post-construction relationships.',
      },
      { text: 'Pushes updates through automation triggers, reminders and to-do lists for a better information flow.' },
      { text: 'Organises your sales pipeline through tracking, budgeting, allocating and monitoring.' },
    ],
    footnote:
      'monday CRM for construction scales with your business, adapting as your needs change. Lead management, customisation, detailed project tracking, workflow automation and [third-party integrations](/post/monday-com-crm-integrations) are all part of the platform.',
  },
}

const REAL_ESTATE: IndustrySections = {
  // Was a single centred prose block on the page (Sanity `textContentSections`),
  // where the three tips ran together as one wall of text. Same copy, re-cut as
  // panels; each tip splits at its own sentence boundary into lead + closing note.
  capabilityBlocks: {
    eyebrow: '// Implementation tips',
    heading: 'Additional tips for successful',
    headingAccent: 'CRM implementation',
    lead: 'At Fruition Services, we have a tailored approach to help you implement monday.com as your purpose-built CRM for real estate.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Stakeholder Engagement',
        lead: 'Getting buy-in from all stakeholders, including your team members, is essential before starting the implementation process.',
        note: "This ensures that everyone is on board and committed to the project's success.",
      },
      {
        number: '02',
        title: 'Start Small, Scale Up',
        lead: "If you're new to CRM, we recommend starting with a smaller scope and gradually expanding the implementation.",
        note: 'This approach prevents overwhelming your team and allows for better management of the implementation process.',
      },
      {
        number: '03',
        title: 'Consultant Support',
        lead: 'If you require additional guidance or expertise, consider getting help from a consultant.',
        note: 'They bring their experience and knowledge to help you navigate the implementation process effectively and avoid common pitfalls.',
      },
    ],
  },
  benefitLedger: {
    eyebrow: '// Real estate CRM',
    heading: 'Why choose monday CRM for',
    headingAccent: 'real estate?',
    intro:
      'Real estate companies benefit from monday CRM because of its property management capabilities, its user-friendly interface, and custom features that improve client satisfaction and streamline communication.',
    items: [
      {
        text: 'Delivers personalised service by building strong client relationships with email ticketing and sequencing.',
      },
      {
        text: 'Creates boards that track lease agreements, maintenance tasks and listings for seamless property management.',
      },
      {
        text: 'Keeps real estate transactions on track through data visualisation on the monday CRM dashboard.',
      },
      {
        text: 'Centralises real estate documents in a secure database for easy access, management and collaboration.',
      },
      { text: 'Captures and manages leads in real time through integrations with popular real estate tools.' },
      {
        text: "Visualises real estate metrics, manages property showings and surfaces reporting insight through monday.com's customisable dashboards.",
      },
    ],
  },
  templateSpec: {
    eyebrow: '// Template anatomy',
    heading: 'What you can do on the monday.com',
    headingAccent: 'real estate CRM template',
    lead: 'The template ships configured. These are the parts your team will actually touch in week one.',
    panels: [
      {
        title: 'Column types',
        lead: 'The board mirrors how your agency already tracks a deal, without a developer.',
        bullets: [
          'Drag and drop 30+ columns to customise workflows.',
          'Add status columns and due dates to keep everything in context.',
        ],
        chipsLabel: 'Customise the board with',
        chips: ['People', 'Status', 'Location', 'Numbers', 'Files', 'Email'],
      },
      {
        title: 'Views',
        lead: 'The same records, six ways. Switching view never rebuilds the board underneath.',
        chipsLabel: 'Available views',
        chips: ['Kanban', 'Timeline', 'Map', 'Gantt', 'Workload', 'Calendar'],
        note: 'For the monday.com real estate CRM template, teams love the Chart, Timeline and Map views.',
      },
      {
        title: 'Automations and integrations',
        groups: [
          {
            label: 'monday automations help real estate businesses:',
            bullets: [
              'Automatically send reminder emails when due dates arrive.',
              "Receive real-time notifications when a task's status changes.",
            ],
          },
          {
            label: 'monday.com integrations help property management by:',
            bullets: [
              'Letting you keep working with your existing real estate tools.',
              'Syncing due dates with Google Calendar.',
              'Sharing Dropbox files with your team instantly.',
            ],
          },
        ],
        note: 'Realtors on monday real estate CRM most often connect Gmail, Slack, Excel and OneDrive.',
      },
    ],
  },
}

const PROFESSIONAL_SERVICES: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Professional services',
    heading: 'What you can do with monday CRM for',
    headingAccent: 'professional services',
    lead: 'Six things a services business gets out of monday CRM once it is configured around how the firm actually delivers work.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Customisation and flexibility',
        lead: 'Customise monday CRM to your service business. With board templates and dashboards, you can:',
        points: [
          { text: 'Dispatch and schedule jobs.' },
          { text: 'Fulfil purchase orders for the services you offer.' },
          { text: 'Manage payments and billing information.' },
          { text: 'Run automations that generate leads.' },
          { text: 'Create, share and store documents.' },
        ],
      },
      {
        number: '02',
        title: 'Great visualisation',
        lead: '[Data visualisation on monday.com](/post/data-visualisation-on-monday-com) has always been its USP. With monday CRM you can:',
        points: [
          { text: 'Visualise jobs, pipelines, updates and tasks.' },
          { text: 'Use Kanban, Timeline, Map, Gantt Chart and Calendar views.' },
        ],
        note: 'Chart view shows job status — completed, stuck or started — across a specific month, date or time.',
      },
      {
        number: '03',
        title: 'Intuitive interface',
        lead: "monday CRM is an intuitive platform that needs no developer assistance. If it does feel complicated, Fruition's consultants help you:",
        points: [
          { text: 'Create workflows with drag-and-drop functions.' },
          { text: 'Customise visual boards and build them from pre-made templates.' },
          { text: 'Run change management across the team.' },
        ],
      },
      {
        number: '04',
        title: 'Dashboards on monday CRM',
        lead: 'Shifting to monday CRM puts every important number on a single custom dashboard. It helps you:',
        points: [
          { text: 'Increase visibility into jobs and team performance.' },
          { text: 'See payment status across all projects.' },
          { text: 'Run reports on a high-level view of every business operation.' },
          { text: 'Use the numbers widget to check budget summaries and employee hours.' },
        ],
      },
      {
        number: '05',
        title: 'Automations',
        lead: '[Automations on monday.com](/post/monday-com-automations) build smart workflows that lift productivity. In a service business they:',
        points: [
          { text: 'Automate the repetitive processes that slow you down.' },
          { text: 'Free the team to focus on retaining and engaging customers.' },
          { text: 'Send alerts and reminders to employees about project updates.' },
          { text: 'Notify users when a job is complete.' },
          { text: 'Send personalised emails to clients and leads.' },
        ],
      },
      {
        number: '06',
        title: 'monday Sales CRM integrations',
        lead: 'The platform comes with [200+ integrations](/post/monday-com-crm-integrations), though only a handful genuinely move the needle for a services firm. Connect your account with:',
        points: [
          { text: 'Google Calendar' },
          { text: 'Slack' },
          { text: 'Salesforce' },
          { text: 'Gmail' },
          { text: 'Zapier' },
        ],
        note: 'Fruition sets these up without data loss and writes the custom automation recipes that streamline your sales pipeline.',
      },
    ],
  },
}

const MANUFACTURING: IndustrySections = {
  benefitLedger: {
    eyebrow: '// monday CRM for manufacturing',
    heading: 'The benefits of monday CRM for',
    headingAccent: 'manufacturing',
    intro:
      'What changes when sales, production and service data stop living in separate systems.',
    items: [
      {
        label: 'Sales performance',
        text: 'Centralises customer interactions and information in one repository, making it easier to identify customers, close deals, retain leads and upsell.',
      },
      {
        label: 'Supply chain visibility',
        text: 'Surfaces inventory management, operations, distribution chains and order processing, so you can manage production chains and raw material supply.',
      },
      {
        label: 'Customer satisfaction',
        text: 'A 360-degree view of customer interactions shows you their preferences, which improves service, loyalty and engagement.',
      },
      {
        label: 'Sales productivity',
        text: 'Automates repetitive tasks — data entry, reporting, follow-ups — so the team can focus on high-value activities.',
      },
      {
        label: 'Operational efficiency',
        text: 'Better data, lead and pipeline management means less duplication, clearer pipeline visibility, cross-functional collaboration and access to the right customer data.',
      },
      {
        label: 'Quality issue tracking',
        text: 'Tracks quality issues so you can address production bottlenecks efficiently and cut defective products out of inventory.',
      },
    ],
    footnote:
      'It also predicts demand from past metrics, reports and analytics — so you can see what sales and marketing look like next quarter for inventory management and production planning.',
  },
}


const RETAIL: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Retail operations',
    heading: 'Run the whole retail operation on',
    headingAccent: 'one platform',
    lead: 'Campaigns, merchandising and store rollouts stop being three disconnected systems. This is how the work divides up.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Product management',
        lead: 'Streamline the product portfolio and shorten time to market.',
        points: [
          {
            label: 'End-to-end product process',
            text: 'Private label or your own brand — from closing deals with manufacturers and package design through to in-store launch.',
          },
          {
            label: 'Supply chain management',
            text: 'Vendor communication in a comprehensive view of the supply chain, so blockers, inventory and vendor threads sit in one place.',
          },
          {
            label: 'Smart merchandising',
            text: 'Visualise in-store layouts and placements, with automations carrying the recurring parts.',
          },
        ],
      },
      {
        number: '02',
        title: 'Marketing management',
        lead: 'Build awareness by tightening the process that creates demand.',
        points: [
          {
            label: 'Product promotion',
            text: 'Standardise go-to-market end to end: defining objectives, executing campaigns, monitoring and launch.',
          },
          {
            label: 'Campaign and creative management',
            text: "A bird's-eye view of every campaign in one platform — budget, spend per channel, ROI goals.",
          },
          {
            label: 'Retail media',
            text: 'Manage in-store and online advertising in one place, across sales, production and delivery.',
          },
        ],
      },
      {
        number: '03',
        title: 'Operations management',
        lead: 'Lift operational efficiency across stores, staff and space.',
        points: [
          {
            label: 'Store updates and rollouts',
            text: 'Manage every part of a new store opening — inventory, hiring — plus the full franchise lifecycle.',
          },
          {
            label: 'Team management',
            text: 'Plan shift schedules and track employee performance across locations.',
          },
          {
            label: 'Space and range planning',
            text: 'Turn shelf organisation and product placement blueprints into action items.',
          },
        ],
      },
    ],
  },
  benefitLedger: {
    eyebrow: '// What it solves',
    heading: 'The retail problems monday.com',
    headingAccent: 'actually solves',
    intro:
      'Retail chaos is not just stressful, it is expensive. Stockouts, unsold inventory and siloed teams trace back to the same thing: nowhere that campaigns, stock and store operations meet.\n\nmonday.com for retail closes that gap by:',
    items: [
      { text: 'Centralising campaign management, with every initiative tracked on one dashboard.' },
      {
        text: 'Eliminating the communication silos between operations, sales, marketing and on-site teams.',
      },
      { text: 'Monitoring stock levels across channels and locations for real-time inventory visibility.' },
      {
        text: 'Coordinating product launches, promotional activity and seasonal displays in one merchandising workflow.',
      },
      {
        text: 'Cutting manual work with automations for task management, deadline tracking and notifications.',
      },
      { text: 'Backing decisions with the analytics and reporting the team already needs.' },
    ],
    footnote:
      'Fruition builds the boards that visualise stock across stores, automate low-stock alerts, and connect your eCommerce and POS systems to monday WorkOS — so multi-location retail stops running on spreadsheets.',
  },
}

const MARKETING: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Marketing challenges',
    heading: 'Six problems marketing teams bring us, and what',
    headingAccent: 'fixes them',
    lead: 'Every marketing and creative team we onboard arrives with some version of these. The fix is rarely more tools — it is one place where the work is visible.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Tight deadlines',
        lead: 'Marketing and creative teams work under constant deadline pressure, and the stress compounds.',
        points: [
          {
            text: 'A centralised timeline view of the whole portfolio — events, social, campaigns — so stakeholders can see what is coming.',
          },
          { text: 'Campaign intake through forms rather than email and chat, which ends the back-and-forth.' },
          { text: 'Load-balanced resourcing, so every available person is actually used.' },
        ],
      },
      {
        number: '02',
        title: 'Managing multiple projects',
        lead: 'Juggling concurrent campaigns makes it hard to allocate people, prioritise, and still deliver on time.',
        points: [
          { text: 'Set team capacity and allocate tasks across everyone in a single view.' },
          { text: 'Bring agile practice and workflow automation into how the team is structured.' },
        ],
      },
      {
        number: '03',
        title: 'Maintaining brand consistency',
        lead: 'Consistency across channels, campaigns and creative assets is hard once several teams touch the work.',
        points: [
          {
            text: 'Digital asset management keeps the current version of every digital and print asset in one place.',
          },
          {
            text: 'Integrations with Adobe CC, Figma, HubSpot, Hootsuite and PageProof keep the tools in sync and stop double handling.',
          },
        ],
      },
      {
        number: '04',
        title: 'Collaborating effectively',
        lead: 'Remote teams working across timezones lose things in multi-threaded conversation.',
        points: [
          { text: 'Meetings, chats and email land in one place, against the work they belong to.' },
          { text: 'Team meetings progress next steps instead of catching up on status.' },
        ],
      },
      {
        number: '05',
        title: 'Demonstrating ROI',
        lead: 'Budgets need justifying, and brand awareness does not measure itself.',
        points: [
          { text: 'ROI reporting per channel shows which ones actually return for your sector.' },
          {
            text: 'Make and Workato connect key data sources through the open API, so the ROI dashboard syncs live.',
          },
          { text: 'Audit advertising spend, and outsource low in-house expertise to a partner you can track.' },
        ],
      },
      {
        number: '06',
        title: 'Managing client expectations',
        lead: 'Aligning on objectives and delivering against them takes visible, continuous communication.',
        points: [
          { text: 'Automated notifications when milestones land or a bottleneck appears.' },
          {
            text: 'Unlimited guest collaborators at no extra cost on Pro and Enterprise, so clients can see the work.',
          },
          { text: 'Set deliverable and timeline expectations against real capacity visibility.' },
        ],
      },
    ],
  },
  benefitLedger: {
    eyebrow: '// Marketing features',
    heading: 'Five monday.com features marketing teams',
    headingAccent: 'lean on',
    intro:
      'The monday marketer template ships with these already configured. They are the ones teams keep using once the novelty wears off.',
    items: [
      {
        label: 'WorkDocs',
        text: 'A central place to brainstorm plans, goals and outlines, created straight from the files column on the marketing board.',
      },
      {
        label: 'Gantt view',
        text: 'An organised, fully interactive view of every project plan when several campaigns run at once.',
      },
      {
        label: 'Chart view',
        text: 'Board data as custom graphs — the quarterly budget chart shows how spend distributes across projects per quarter.',
      },
      {
        label: 'Connected boards',
        text: 'Link marketing initiatives to the campaign tracking board and manage them from either side.',
      },
      {
        label: 'Filters and dashboards',
        text: 'Advanced filters narrow the board to what matters — high-priority Q1 and Q2 work, say — and dashboard widgets roll it back up.',
      },
    ],
    footnote:
      "Fruition assesses the need, designs the marketing workflows and trains the team, so the template becomes your process rather than someone else's.",
  },
  templateSpec: {
    eyebrow: '// Board anatomy',
    heading: 'What the monday marketer',
    headingAccent: 'template gives you',
    lead: 'Over 200 templates ship with the platform. This is the bundle a marketing team starts from.',
    panels: [
      {
        title: 'Marketing plan board',
        lead: 'Every marketing project is an item, with the detail mapped across columns.',
        bullets: [
          '**Groups** — the quarter of the year the project runs in.',
          '**Items** — the workflow for each marketing initiative.',
          '**Columns** — owner, goal, timeline and budget.',
        ],
      },
      {
        title: 'Campaign templates',
        lead: 'Content, social, paid media and product launches each start from a template rather than a blank board.',
        chipsLabel: 'Included templates',
        chips: [
          'Content calendar',
          'Digital asset management',
          'Blog planning',
          'Social media planner',
          'Video production',
          'Creative team planner',
          'A/B testing',
          'Campaign planning',
          'Product launch',
        ],
      },
      {
        title: 'Dashboard widgets',
        lead: 'The roll-up view leadership asks for.',
        bullets: [
          '**Chart widgets** — initiatives and goals, budget against spend per campaign.',
          '**Number widgets** — total yearly budget against what is left.',
          '**Gantt widget** — project timelines and the relationships between them.',
        ],
      },
    ],
  },
}

const GOVERNMENT: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Public sector security',
    heading: 'The security standards agencies',
    headingAccent: 'cannot compromise on',
    lead: 'Public-sector workflows carry records that must not leak. These are the Enterprise-plan controls that make monday.com usable for them.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Item-level permissions',
        lead: 'The most granular control in the platform, and usually the reason an agency moves to Enterprise.',
        points: [
          { text: 'Board owners choose which people column governs item access.' },
          { text: 'Team members see only the items they are named on.' },
          { text: "'Only edit assigned content' restricts non-owners to their own work." },
          { text: 'Guests and non-board members never reach the wider workspace.' },
        ],
        note: 'Without it, teams duplicate boards to keep data apart — which fragments reporting and duplicates the data anyway.',
      },
      {
        number: '02',
        title: 'Compliance-grade data handling',
        lead: 'What regulated records require before they can live in a work platform at all.',
        points: [
          { text: 'HIPAA compliance, unlocked through a Business Associate Agreement.' },
          { text: '256-bit encryption and comprehensive audit logging.' },
          { text: 'Automatic broadcast disabling on sensitive boards.' },
          { text: 'A panic button that locks the account down if something is compromised.' },
        ],
      },
      {
        number: '03',
        title: 'Access control and identity',
        lead: 'Credential abuse is the most common way in, so the perimeter matters as much as the permissions.',
        points: [
          { text: 'IP whitelisting, so unapproved networks cannot reach sensitive data.' },
          { text: 'SSO with Azure AD, Okta, OneLogin or custom SAML, plus multi-factor authentication.' },
          { text: 'Public link sharing for WorkDocs disabled at the admin level.' },
          { text: 'Dashboard owners control widget and data visibility.' },
        ],
      },
    ],
  },
  benefitLedger: {
    eyebrow: '// Permission architecture',
    heading: 'Five layers of permission control, from',
    headingAccent: 'account to item',
    intro:
      'Standard and Pro carry the core measures — SOC 2, two-factor authentication, encryption, board-level permissions. Regulated public-sector work needs more than that, and the Enterprise plan layers it.\n\nEach layer overrides the one below it, so an account-level restriction cannot be escalated around further down.',
    items: [
      {
        label: 'Account level',
        text: 'Access by user type — member, viewer, guest — with admins defining who reaches billing, data export or integrations. Custom roles grant narrow privileges, like a billing-only admin.',
      },
      {
        label: 'Workspace level',
        text: 'Content actions and visibility per workspace. A closed workspace requires an invitation, and only its members see the boards inside.',
      },
      {
        label: 'Board level',
        text: "From 'edit everything' down to 'view and comment', including an 'only edit assigned items' setting that holds non-owners to their own work.",
      },
      {
        label: 'Column level',
        text: 'Hides sensitive fields — salary figures, client contract terms — from users who can otherwise see the board.',
      },
      {
        label: 'Item level',
        text: 'Board owners nominate a people column to govern which rows each person can see at all.',
      },
    ],
    footnote:
      'Together these map onto the frameworks agencies are held to: GDPR limiting personal data to authorised users, SOX segregating financial data, and contractual restrictions on sensitive projects. Fruition audits your user roles and configures the architecture to match.',
  },
}


const SOLAR_RENEWABLES: IndustrySections = {
  benefitLedger: {
    eyebrow: '// Solar operations suite',
    heading: 'What the Solar Operations Suite',
    headingAccent: 'actually does',
    intro:
      'Solar businesses rarely fail on demand. They fail on disconnected systems, project visibility gaps, inventory that nobody can see from the quote, and customer communication that breaks down between sales and the crew.\n\nFruition built a Solar Operations Suite on monday.com CRM and Work Management to close exactly those gaps.',
    items: [
      {
        label: 'End-to-end lifecycle management',
        text: 'Solution design and implementation across the whole job, rather than a CRM at one end and a scheduling board at the other.',
      },
      {
        label: 'Sales-to-operations handoff',
        text: 'Workflow customisation and template configuration, so an accepted quote becomes a project without anyone re-keying it.',
      },
      {
        label: 'Integrated inventory management',
        text: 'Third-party apps connected for solar operations and communication, with inventory linked directly to quotes.',
      },
      {
        label: 'Automated proposal and quote generation',
        text: 'Standardised CPQ that accelerates quote-to-cash instead of waiting on a spreadsheet.',
      },
      {
        label: 'Real-time project visibility',
        text: 'Portfolio-level reporting, plus the team adoption and training that makes people actually use it.',
      },
    ],
    footnote:
      'The suite ships as pre-configured boards for client acquisition, project execution and inventory; dashboards for the metrics that cross them; integrations for proposal generation, document signature and customer communication; and automations from quote-to-cash through to reordering.',
  },
  templateSpec: {
    eyebrow: '// Use cases',
    heading: 'Four ways solar teams',
    headingAccent: 'use it',
    lead: 'The parts of the suite crews and office staff touch every day.',
    columns: 2,
    panels: [
      {
        title: 'Smart invoicing',
        lead: 'Invoices raised faster, with the automations and integrations already wired in.',
        bullets: [
          'Customer invoices managed and tracked in one place.',
          'Standardised CPQ that shortens the quote-to-cash cycle.',
        ],
      },
      {
        title: 'Portfolio management',
        lead: 'Installation and maintenance portfolios in one view.',
        bullets: [
          'Project and portfolio managers collaborate on the same boards.',
          'Workflows execute with reporting that does not need assembling by hand.',
        ],
      },
      {
        title: 'Inventory tracking',
        lead: 'The Inventory App integration tracks stock in real time.',
        chipsLabel: 'Tracked in real time',
        chips: ['Solar panels', 'Batteries', 'Inverters', 'Other components'],
        note: 'Wired up properly, inventory links directly to the quote — so nobody sells what is not on the shelf.',
      },
      {
        title: 'Sales dashboard',
        lead: 'The financial forecasting layer over the pipeline.',
        bullets: [
          'Forecast revenue across active deals.',
          'Break the forecast down by month and by region.',
          'Pull data from multiple boards into one high-level view.',
        ],
      },
    ],
  },
}

/** Keyed by page slug, matching the route segment and the Sanity page key. */
export const INDUSTRY_SECTIONS: Record<string, IndustrySections> = {
  'monday-for-construction': CONSTRUCTION,
  'monday-for-real-estate': REAL_ESTATE,
  'monday-for-professional-services': PROFESSIONAL_SERVICES,
  'monday-for-manufacturing': MANUFACTURING,
  'monday-for-retail': RETAIL,
  'monday-for-marketing': MARKETING,
  'monday-for-government': GOVERNMENT,
  'industries/solar-renewables': SOLAR_RENEWABLES,
}

/** Empty object for pages with no long-form sections, so callers can destructure. */
export function getIndustrySections(slug?: string): IndustrySections {
  return (slug && INDUSTRY_SECTIONS[slug]) || {}
}
