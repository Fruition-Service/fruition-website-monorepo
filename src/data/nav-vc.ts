/**
 * Version C menu (approved November 2026): AI, Platforms, Industries, Pricing,
 * Company and a direct Contact link. Copy, links and structure are the
 * approved mock-up's (vc-mockups/review/nav.js), with each link pointing at
 * its live route.
 *
 * This file is the seed: scripts/seed-nav-vc.ts writes it to Sanity
 * siteSettings.navigation, and from then on editors own the menu. Nothing
 * renders from this file at runtime. `icon` names a file in scripts/nav-icons/
 * which the seed uploads as a Sanity image asset (the item's `logo`).
 */

export interface NavVcLink {
  label: string
  href: string
  description: string
  /** File name (without .svg) in scripts/nav-icons/. */
  icon: string
  tier?: string
}

export interface NavVcSection {
  heading: string
  /** Grid columns for the links inside the section. */
  columns: number
  /** The section's share of the dropdown width. */
  grow: number
  items: NavVcLink[]
}

/**
 * Card in the dropdown's last column: a plain blurb, or a case study when it
 * has a logo, a photo and headline figures. Images are existing Sanity asset
 * ids (the case study's own logo and headshot on page-customer-testimonials).
 */
export interface NavVcFeature {
  kicker: string
  quote: string
  label: string
  href: string
  attribution?: string
  logoAsset?: string
  imageAsset?: string
  metrics?: { value: string; label: string }[]
}

export interface NavVcItem {
  label: string
  /** A plain link instead of a dropdown. */
  href?: string
  /** Line in the dropdown's bottom bar until an item is hovered. */
  note?: string
  sections?: NavVcSection[]
  feature?: NavVcFeature
  footerLinks?: { label: string; href: string }[]
}

export const NAV_VC: NavVcItem[] = [
  {
    label: 'AI',
    note: 'From a fixed-fee assessment to agents in production, with governance from day one.',
    sections: [
      {
        heading: 'Assess',
        columns: 1,
        grow: 1,
        items: [
          { label: 'AI capability assessment', href: '/ai-capability-assessment', description: 'Fixed-fee assessment, your AI roadmap in weeks', icon: 'ai-capability-assessment' },
          { label: 'AI readiness blueprint', href: '/ai-readiness-blueprint', description: 'Free self-assessment of your AI readiness', icon: 'ai-readiness-blueprint' },
        ],
      },
      {
        heading: 'Build',
        columns: 1,
        grow: 1,
        items: [
          { label: 'AI consulting', href: '/ai-consulting', description: 'The full AI consulting practice', icon: 'ai-consulting' },
          { label: 'Agent development', href: '/ai-consulting/agent-development', description: 'Autonomous agents built for production', icon: 'agent-development' },
          { label: 'RAG & knowledge systems', href: '/ai-consulting/rag-knowledge-systems', description: 'Retrieval grounded in your own knowledge', icon: 'rag-and-knowledge-systems' },
        ],
      },
      {
        heading: 'Run',
        columns: 1,
        grow: 1,
        items: [
          { label: 'AI strategy & execution', href: '/ai-strategy-and-execution', description: 'Roadmaps that turn into shipped work', icon: 'ai-strategy-and-execution' },
          { label: 'Governance & compliance', href: '/ai-consulting/governance-and-compliance', description: 'AI policy, risk & compliance frameworks', icon: 'governance-and-compliance' },
        ],
      },
    ],
    feature: { kicker: 'Use case hub', quote: '279 real AI and monday.com builds across 12 industries, filterable by team and outcome.', label: 'Browse AI use cases', href: '/ai-use-cases' },
    footerLinks: [
      { label: 'All AI services', href: '/ai-consulting' },
      { label: 'Book an assessment', href: '/ai-capability-assessment' },
    ],
  },
  {
    label: 'Platforms',
    note: 'One page per platform: our partnership and what we deliver on it.',
    sections: [
      {
        heading: 'Work management',
        columns: 1,
        grow: 1,
        items: [
          { label: 'monday.com', href: '/partnerships/monday-consulting-partner', description: 'Platinum Partner · Rising Star 2026 · Advanced Delivery Partner', icon: 'monday-com', tier: 'Platinum' },
          { label: 'Atlassian', href: '/atlassian-consulting', description: 'Platinum Partner · Rising Star 2026', icon: 'atlassian', tier: 'Platinum' },
          { label: 'ClickUp', href: '/partnerships/certified-clickup-partner', description: 'Workspaces, migration and automation', icon: 'clickup' },
        ],
      },
      {
        heading: 'CRM & customer',
        columns: 1,
        grow: 1,
        items: [
          { label: 'HubSpot', href: '/hubspot-consulting', description: 'HubSpot builds, Breeze AI and integration', icon: 'hubspot' },
          { label: 'monday CRM', href: '/monday-crm-consulting', description: 'Sales pipeline & customer management', icon: 'monday-com' },
          { label: 'Aircall', href: '/partnerships/aircall-partner', description: 'Cloud phone connected to your CRM', icon: 'aircall' },
        ],
      },
      {
        heading: 'AI platforms',
        columns: 1,
        grow: 1,
        items: [
          { label: 'OpenAI', href: '/partnerships/openai-chatgpt-partner', description: 'ChatGPT Enterprise & custom GPTs', icon: 'openai', tier: 'Select' },
          { label: 'Anthropic Claude', href: '/partnerships/anthropic-claude-partner', description: 'Enterprise Claude & Claude Code', icon: 'anthropic-claude', tier: 'Select' },
          { label: 'Google Gemini', href: '/partnerships/google-gemini-vertex-ai-partner', description: 'Workspace AI and Gemini agents', icon: 'google-gemini' },
          { label: 'OpenClaw', href: '/partnerships/openclaw-partner', description: 'Agents that act across your tools', icon: 'openclaw' },
          { label: 'Vapi', href: '/partnerships/vapi-partner', description: 'Voice agents for inbound and outbound calls', icon: 'vapi' },
          { label: 'Grok Bot', href: '/partnerships/grok-bot-partner', description: 'AI teammates in Slack, Teams and your tools', icon: 'grok' },
          { label: 'Meta Muse', href: '/partnerships/meta-muse-partner', description: 'Muse agents for small-business operations', icon: 'meta-muse' },
        ],
      },
      {
        heading: 'Automation',
        columns: 1,
        grow: 1,
        items: [
          { label: 'n8n', href: '/partnerships/n8n-integration-partner', description: 'Self-hosted workflows and AI agents', icon: 'n8n', tier: 'Expert' },
          { label: 'Make', href: '/partnerships/make-partners', description: 'No-code automation across your stack', icon: 'make', tier: 'Gold' },
          { label: 'Integrations', href: '/integrations', description: 'Connect monday.com, your CRM and the rest of your stack', icon: 'integrations' },
        ],
      },
    ],
    footerLinks: [
      { label: 'All partners', href: '/partnerships' },
      { label: 'Integrations', href: '/integrations' },
    ],
  },
  {
    label: 'Industries',
    note: 'Industry templates and named client builds for each sector.',
    sections: [
      {
        heading: 'Industries',
        columns: 2,
        grow: 2,
        items: [
          { label: 'Construction', href: '/monday-for-construction', description: 'Project & site delivery', icon: 'construction' },
          { label: 'Manufacturing', href: '/monday-for-manufacturing', description: 'Production planning & ops', icon: 'manufacturing' },
          { label: 'Government', href: '/monday-for-government', description: 'Secure public-sector delivery', icon: 'government' },
          { label: 'Professional services', href: '/monday-for-professional-services', description: 'Client delivery & resourcing', icon: 'professional-services' },
          { label: 'Real estate', href: '/monday-for-real-estate', description: 'Listings, deals & property ops', icon: 'real-estate' },
          { label: 'Financial services', href: '/industries/financial-services', description: 'APRA/FCA-aligned platforms & AI', icon: 'financial-services' },
          { label: 'Retail', href: '/monday-for-retail', description: 'Stores, ranges and supplier ops', icon: 'retail' },
          { label: 'Healthcare', href: '/industries/healthcare', description: 'Referrals, intake and care operations', icon: 'healthcare' },
          { label: 'Solar & renewables', href: '/industries/solar-renewables', description: 'Pipeline to install and grid sign-off', icon: 'solar-and-renewables' },
          { label: 'Marketing & creative', href: '/monday-for-marketing', description: 'Campaigns, content and client delivery', icon: 'marketing-and-creative' },
          { label: 'Education', href: '/industries/education', description: 'Service desks, events and admissions', icon: 'education' },
          { label: 'Nonprofits', href: '/industries/nonprofits', description: 'Programs, grants, donors and volunteers', icon: 'nonprofits' },
          { label: 'Transport & logistics', href: '/industries/transport-logistics', description: 'Dispatch, fleet and freight operations', icon: 'transport-and-logistics' },
          { label: 'Hospitality & events', href: '/industries/hospitality-tourism-events', description: 'Venues, tourism campaigns and events', icon: 'hospitality-and-events' },
          { label: 'Technology & SaaS', href: '/industries/technology-saas', description: 'Pipeline, onboarding and delivery', icon: 'technology-and-saas' },
          { label: 'Energy & utilities', href: '/industries/energy-utilities', description: 'Field work, projects and compliance', icon: 'energy-and-utilities' },
          { label: 'Media & entertainment', href: '/industries/media-entertainment', description: 'Productions, content and approvals', icon: 'media-and-entertainment' },
          { label: 'Legal', href: '/industries/legal', description: 'Matters, intake and deadlines', icon: 'legal' },
        ],
      },
      {
        heading: 'By team',
        columns: 1,
        grow: 1,
        items: [
          { label: 'Project & portfolio', href: '/monday-consulting-solutions/monday-project-management', description: 'Delivery, portfolios & PMO', icon: 'rag-and-knowledge-systems' },
          { label: 'CRM & sales', href: '/monday-crm-consulting', description: 'Pipeline and customer management', icon: 'crm-and-sales' },
          { label: 'Service (ITSM)', href: '/monday-consulting-solutions/monday-service', description: 'Service desks and request portals', icon: 'service-itsm' },
          { label: 'HR operations', href: '/monday-consulting-solutions/monday-for-hr', description: 'Hiring, onboarding and people ops', icon: 'hr-operations' },
        ],
      },
    ],
    footerLinks: [
      { label: 'Browse AI use cases', href: '/ai-use-cases' },
      { label: 'Customer stories', href: '/customer-testimonials' },
    ],
  },
  {
    label: 'Pricing',
    note: 'Fixed scope, fixed fees. See what a project costs before you commit.',
    sections: [
      {
        heading: 'Ways to work with us',
        columns: 2,
        grow: 2,
        items: [
          { label: 'Implementation packages', href: '/implementation-packages', description: 'Fixed-fee packages: 900+ delivered', icon: 'implementation-packages' },
          { label: 'Training', href: '/training', description: 'Role-based enablement for your teams', icon: 'training' },
          { label: 'Licence procurement', href: '/licence-procurement', description: 'Audit, sourcing and renewal management', icon: 'financial-services' },
          { label: 'Implementation calculator', href: '/ask-fruit', description: 'Estimated scope, timeline and fee in minutes', icon: 'implementation-calculator' },
        ],
      },
    ],
    // BL Air Conditioning: the strongest of the eight case studies (17x ROI,
    // $125,000 a year). Quote word for word from its caseStudyCards entry.
    feature: {
      kicker: 'Case study',
      quote: 'This system will save \u201chundreds of thousands of dollars a year guaranteed\u201d',
      attribution: 'Brandon-Lee Horridge, Managing Director, BL Air Conditioning',
      logoAsset: 'image-45384aab63f4561950ccf9c2207d4313e6c63f35-289x174-png',
      imageAsset: 'image-46c993c9a04b11d90f0f7bc04dde0a316f9e0be0-240x240-jpg',
      metrics: [
        { value: '17x', label: 'ROI' },
        { value: '$125,000', label: 'Saved per year' },
      ],
      label: 'Read the case study',
      href: '/customer-testimonials#case-studies',
    },
    footerLinks: [
      { label: 'See packages', href: '/implementation-packages' },
      { label: 'Book a call', href: '/contact-us' },
    ],
  },
  {
    label: 'Company',
    note: '900+ implementations, six offices, one delivery standard.',
    sections: [
      {
        heading: 'Proof',
        columns: 1,
        grow: 1,
        items: [
          { label: 'Customer stories', href: '/customer-testimonials', description: 'Client results in their own words', icon: 'customer-stories' },
          { label: 'Case studies', href: '/customer-testimonials#case-studies', description: '8 verified client implementations, filterable', icon: 'crm-and-sales' },
          { label: 'Certifications & awards', href: '/certifications-and-awards', description: 'Partner tiers and certifications', icon: 'certifications-and-awards' },
        ],
      },
      {
        heading: 'About',
        columns: 1,
        grow: 1,
        items: [
          { label: 'About Fruition', href: '/about-us', description: 'Who we are and how we work', icon: 'about-fruition' },
          { label: 'Our team', href: '/fruition-team', description: 'The consultants behind Fruition', icon: 'hr-operations' },
          { label: 'Careers', href: '/careers', description: 'Remote roles across six countries', icon: 'careers' },
          { label: 'Blog', href: '/consulting-blog', description: 'Articles on AI, platforms and automation', icon: 'ai-readiness-blueprint' },
          { label: 'FAQs', href: '/faqs', description: 'Direct answers to common questions', icon: 'faqs' },
        ],
      },
      {
        heading: 'Where we work',
        columns: 1,
        grow: 1,
        items: [
          { label: 'Australia', href: '/monday-partner-australia', description: 'Sydney head office', icon: 'location-pin' },
          { label: 'United Kingdom', href: '/monday-partner-uk', description: 'London', icon: 'location-pin' },
          { label: 'United States', href: '/monday-partner-us', description: 'New York', icon: 'location-pin' },
          { label: 'Singapore', href: '/monday-partner-singapore', description: 'Singapore', icon: 'location-pin' },
          { label: 'India', href: '/monday-partner-india', description: 'New Delhi', icon: 'location-pin' },
          { label: 'Philippines', href: '/monday-partner-philippines', description: 'Manila', icon: 'location-pin' },
        ],
      },
    ],
    footerLinks: [
      { label: 'About Fruition', href: '/about-us' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  { label: 'Contact', href: '/contact-us' },
]

export function navVcHrefs(): string[] {
  return [
    ...new Set(
      NAV_VC.flatMap((i) => [
        ...(i.href ? [i.href] : []),
        ...(i.sections ?? []).flatMap((s) => s.items.map((l) => l.href)),
        ...(i.footerLinks ?? []).map((l) => l.href),
        ...(i.feature ? [i.feature.href] : []),
      ]),
    ),
  ]
}

/** Every icon file the menu needs. */
export function navVcIconKeys(): string[] {
  return [...new Set(NAV_VC.flatMap((i) => (i.sections ?? []).flatMap((s) => s.items.map((l) => l.icon))))]
}

