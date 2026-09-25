/**
 * Website Reorganisation Plan v1.0 (July 2026) — six-tab navigation.
 * Services · Partnerships · Industries · Insights · About · Contact.
 *
 * Supersedes the earlier v2.1 five-tab menu. Menu labels and URL slugs are
 * independent: pages appear under new headings without their URLs changing,
 * and NO ranked monday.com URL is moved. Every href resolves to a page that
 * exists (existing routes, the practice-cluster pages, or the industries /
 * case-studies / certifications / pricing / n8n pages built alongside this).
 *
 * Deliberate omissions (page does not exist yet — omitted rather than 404):
 *  - Services › monday.com "Managed Services / FDE" (P2, needs scoping w/ Josh)
 *  - Insights "Guides & Playbooks", "Video Library", "Webinars" (P3, month 3+)
 * These slot in once their pages are built.
 *
 * Consumed by:
 *  - scripts/seed-nav-v2.ts   → writes to Sanity siteSettings.navigation
 *  - src/app/layout.tsx       → local preview when NAV_V2_PREVIEW=1
 */

export interface NavV2Link {
  label: string
  href: string
  description?: string
  icon?: string
  featured?: boolean
}

export interface NavV2Section {
  heading: string
  /** Partner mark shown beside the heading (path under /public). */
  logo?: string
  columns?: number
  highlight?: boolean
  badge?: string
  items: NavV2Link[]
}

export interface NavV2Item {
  label: string
  href?: string
  layout?: 'stacked' | 'columns'
  sections?: NavV2Section[]
}

export const NAV_V2: NavV2Item[] = [
  {
    label: 'Services',
    layout: 'columns',
    sections: [
      {
        heading: 'AI Consulting',
        items: [
          {
            label: 'AI Capability Assessment',
            href: '/ai-capability-assessment',
            icon: 'sparkle',
            description: 'Fixed-fee assessment, your AI roadmap in weeks',
            featured: true,
          },
          {
            label: 'AI Strategy & Roadmap',
            href: '/ai-strategy-and-execution',
            icon: 'bulb',
            description: 'From use-case discovery to deployed agents',
          },
          {
            label: 'Agent Development',
            href: '/ai-consulting/agent-development',
            icon: 'zap',
            description: 'Autonomous agents built for production',
          },
          {
            label: 'RAG & Knowledge Systems',
            href: '/ai-consulting/rag-knowledge-systems',
            icon: 'layers',
            description: 'Retrieval grounded in your own knowledge',
          },
          {
            label: 'Governance & Compliance',
            href: '/ai-consulting/governance-and-compliance',
            icon: 'shield',
            description: 'AI policy, risk & compliance frameworks',
          },
          {
            label: 'View all AI services',
            href: '/ai-consulting',
            icon: 'list',
            description: 'The full AI consulting practice',
          },
        ],
      },
      {
        heading: 'monday.com',
        logo: '/images/home/partner-monday.png',
        highlight: true,
        badge: 'Platinum Partner',
        items: [
          {
            label: 'Implementation Packages',
            href: '/implementation-packages',
            icon: 'package',
            description: 'Fixed-fee packages: 900+ delivered',
            featured: true,
          },
          {
            label: 'CRM Consulting',
            href: '/monday-crm-consulting',
            icon: 'chart',
            description: 'Sales pipeline & customer management',
          },
          {
            label: 'Training',
            href: '/monday-training',
            icon: 'graduation',
            description: 'Role-based monday.com enablement',
          },
          {
            label: 'Implementation Consultants',
            href: '/monday-implementation-consultants',
            icon: 'wrench',
            description: 'Certified consultants, end to end',
          },
          {
            label: 'Licensing',
            href: '/pricing',
            icon: 'dollar',
            description: 'Licences, renewals and seat right-sizing',
          },
        ],
      },
      {
        heading: 'Atlassian',
        logo: '/images/home/partner-atlassian.png',
        badge: 'Platinum Partner',
        items: [
          {
            label: 'Jira',
            href: '/atlassian-consulting/jira',
            icon: 'layers',
            description: 'Implementation, optimisation & rescue',
          },
          {
            label: 'Confluence',
            href: '/atlassian-consulting/confluence',
            icon: 'document',
            description: 'Knowledge architecture & governance',
          },
          {
            label: 'Jira Service Management',
            href: '/atlassian-consulting/jira-service-management',
            icon: 'shield',
            description: 'ITSM, service desks & SLAs',
          },
          {
            label: 'Jira → monday Migration',
            href: '/atlassian-consulting/jira-to-monday-migration',
            icon: 'zap',
            description: 'The structured migration playbook',
          },
        ],
      },
      {
        heading: 'HubSpot',
        logo: '/images/home/partner-hubspot.png',
        badge: 'Solution Partner',
        items: [
          {
            label: 'HubSpot Implementation',
            href: '/hubspot-consulting/implementation',
            icon: 'megaphone',
            description: 'CRM & Marketing Hub, done right',
          },
          {
            label: 'HubSpot Agent Hub',
            href: '/hubspot-consulting/breeze-ai',
            icon: 'sparkle',
            description: 'HubSpot’s AI, deployed with governance',
          },
        ],
      },
      {
        heading: 'Solutions by Team',
        items: [
          {
            label: 'Solutions Catalog',
            href: '/monday-consulting-solutions/catalog',
            icon: 'list',
            description: 'Browse every prebuilt solution',
            featured: true,
          },
          {
            label: 'Project Management',
            href: '/monday-consulting-solutions/monday-project-management',
            icon: 'layers',
            description: 'Delivery, portfolios & PMO',
          },
          {
            label: 'Finance',
            href: '/monday-consulting-solutions/monday-for-finance',
            icon: 'dollar',
            description: 'Approvals, budgeting & reporting',
          },
          {
            label: 'HR',
            href: '/monday-consulting-solutions/monday-for-hr',
            icon: 'users',
            description: 'Hiring pipelines & onboarding',
          },
          {
            label: 'Service',
            href: '/monday-consulting-solutions/monday-service',
            icon: 'heart',
            description: 'Service desks & ticketing',
          },
          {
            label: 'Product Management',
            href: '/monday-consulting-solutions/monday-product-management',
            icon: 'bulb',
            description: 'Roadmaps & product ops',
          },
          {
            label: 'Marketing & Creative',
            href: '/monday-for-marketing',
            icon: 'megaphone',
            description: 'Campaigns & creative production',
          },
        ],
      },
    ],
  },
  {
    label: 'Partnerships',
    layout: 'columns',
    sections: [
      {
        heading: 'Platform Partners',
        highlight: true,
        badge: 'Platinum ×2',
        items: [
          {
            label: 'monday.com',
            href: '/partnerships/monday-consulting-partner',
            icon: 'monday',
            description: 'Platinum Partner · Rising Star 2026 · Advanced Delivery Partner',
            featured: true,
          },
          {
            label: 'Atlassian',
            href: '/partnerships/certified-atlassian-partner',
            icon: 'atlassian',
            description: 'Platinum Partner · Rising Star 2026',
          },
          {
            label: 'HubSpot',
            href: '/partnerships/certified-hubspot-partner',
            icon: 'hubspot',
            description: 'Certified HubSpot partner',
          },
          {
            label: 'ClickUp',
            href: '/partnerships/certified-clickup-partner',
            icon: 'clickup',
            description: 'Certified ClickUp partner',
          },
        ],
      },
      {
        heading: 'AI Consulting & Implementation',
        items: [
          { label: 'Anthropic Claude', href: '/partnerships/anthropic-claude-partner', icon: 'anthropic', description: 'Enterprise Claude & Claude Code' },
          { label: 'OpenAI', href: '/partnerships/openai-chatgpt-partner', icon: 'openai', description: 'ChatGPT Enterprise & custom GPTs' },
          { label: 'Microsoft Copilot', href: '/partnerships/microsoft-copilot-partner', icon: 'copilot', description: 'Copilot across Microsoft 365' },
          { label: 'Google Gemini & Vertex AI', href: '/partnerships/google-gemini-vertex-ai-partner', icon: 'gemini', description: 'Gemini on Google’s AI stack' },
        ],
      },
      {
        heading: 'Cloud Services',
        items: [
          { label: 'Azure Cloud', href: '/partnerships/microsoft-azure-partner', icon: 'azure', description: 'AI & enterprise workloads on Azure' },
          { label: 'Supabase', href: '/partnerships/supabase-partner', icon: 'supabase', description: 'Postgres, auth & vector search' },
          { label: 'Google Cloud', href: '/partnerships/google-cloud-partner', icon: 'googlecloud', description: 'AI workloads on Google Cloud' },
          { label: 'AWS', href: '/partnerships/aws-partner', icon: 'aws', description: 'Bedrock & the AWS AI stack' },
        ],
      },
      {
        heading: 'Automation, Agents & Tools',
        items: [
          { label: 'Make', href: '/partnerships/make-partners', icon: 'make', description: 'Certified Make partner' },
          { label: 'n8n', href: '/partnerships/n8n-integration-partner', icon: 'n8n', description: 'Certified n8n partner' },
          { label: 'Zapier', href: '/integrations/zapier', icon: 'zapier', description: 'Quick connections between tools' },
          { label: 'LangGraph', href: '/partnerships/langgraph-partner', icon: 'langgraph', description: 'Agent orchestration & stateful graphs' },
          { label: 'Clay', href: '/partnerships/clay-partner', icon: 'clay', description: 'GTM data enrichment & prospecting' },
          { label: 'ElevenLabs', href: '/partnerships/elevenlabs-partner', icon: 'elevenlabs', description: 'Voice AI & speech generation' },
          { label: 'Vapi', href: '/partnerships/vapi-partner', icon: 'vapi', description: 'Voice agents for inbound & outbound calls' },
          { label: 'WhatsApp', href: '/integrations/whatsapp', icon: 'whatsapp', description: 'WhatsApp Business Platform into your CRM' },
          { label: 'LINE', href: '/integrations/line', icon: 'line', description: 'LINE Official Account into your CRM' },
          { label: 'Viber', href: '/integrations/viber', icon: 'viber', description: 'Viber Business Messages into your CRM' },
        ],
      },
    ],
  },
  {
    label: 'Industries',
    layout: 'columns',
    sections: [
      {
        heading: 'By Industry',
        columns: 3,
        items: [
          { label: 'Construction', href: '/monday-for-construction', icon: 'building', description: 'Project & site delivery' },
          { label: 'Manufacturing', href: '/monday-for-manufacturing', icon: 'factory', description: 'Production planning & ops' },
          { label: 'Retail', href: '/monday-for-retail', icon: 'bag', description: 'Store ops & merchandising' },
          { label: 'Professional Services', href: '/monday-for-professional-services', icon: 'briefcase', description: 'Client delivery & resourcing' },
          { label: 'Government', href: '/monday-for-government', icon: 'flag', description: 'Secure public-sector delivery' },
          { label: 'Real Estate', href: '/monday-for-real-estate', icon: 'home', description: 'Listings, deals & property ops' },
          { label: 'Solar & Renewables', href: '/industries/solar-renewables', icon: 'sun', description: 'Solar CRM & work management' },
          { label: 'Financial Services', href: '/industries/financial-services', icon: 'dollar', description: 'APRA/FCA-aligned platforms & AI' },
          { label: 'Healthcare', href: '/industries/healthcare', icon: 'heart', description: 'HIPAA-configured platforms & AI' },
        ],
      },
    ],
  },
    {
    label: 'Insights',
    layout: 'columns',
    sections: [
      {
        heading: 'Content',
        columns: 2,
        items: [
          { label: 'Blog', href: '/consulting-blog', icon: 'edit', description: '100+ articles on monday.com, AI & automation' },
          { label: 'Case Studies', href: '/customer-testimonials', icon: 'chart', description: '8 verified client implementations, filterable' },
          { label: 'Solutions Catalog', href: '/monday-consulting-solutions/catalog', icon: 'list', description: '45 prebuilt monday.com solutions in one atlas' },
          { label: 'FAQs', href: '/faqs', icon: 'question', description: 'Direct answers to common questions' },
        ],
      },
    ],
  },
  {
    label: 'About',
    layout: 'columns',
    sections: [
      {
        heading: 'Company',
        columns: 2,
        items: [
          { label: 'About Fruition', href: '/about-us', icon: 'info', description: 'Who we are & how we work' },
          { label: 'Team', href: '/fruition-team', icon: 'users', description: 'The consultants behind Fruition' },
          { label: 'Certifications & Awards', href: '/certifications-and-awards', icon: 'handshake', description: 'Platinum ×2, Rising Star 2026 & partner tiers' },
          { label: 'Careers', href: '/careers', icon: 'briefcase', description: 'Open roles at Fruition' },
        ],
      },
      {
        heading: 'Locations',
        columns: 2,
        items: [
          { label: 'Australia', href: '/monday-partner-australia', icon: 'globe', description: 'Sydney HQ: APAC delivery' },
          { label: 'United Kingdom', href: '/monday-partner-uk', icon: 'globe', description: 'London delivery centre' },
          { label: 'United States', href: '/monday-partner-us', icon: 'globe', description: 'New York delivery centre' },
          { label: 'Singapore', href: '/monday-partner-singapore', icon: 'globe', description: 'APAC delivery' },
          { label: 'India', href: '/monday-partner-india', icon: 'globe', description: 'APAC delivery' },
          { label: 'Philippines', href: '/monday-partner-philippines', icon: 'globe', description: 'APAC delivery' },
        ],
      },
    ],
  },
  {
    label: 'Contact',
    href: '/contact-us',
  },
]
