/**
 * Version C footer (approved November 2026). The columns, tagline, copyright
 * line and social icons are the approved mock-up's
 * (vc-mockups/review/p/*.html footer), with every link pointing at its live
 * route.
 *
 * This file is the seed: scripts/seed-nav-vc.ts writes it to Sanity
 * siteSettings (footerColumns, footerTagline, footerBadges, footerCopyrightText,
 * socialLinks), and from then on editors own the footer. Nothing renders from
 * this file at runtime.
 */

export interface FooterVcColumn {
  heading: string
  links: { label: string; href: string }[]
}

export interface FooterVcSocial {
  label: string
  href: string
  /** 1 or 2: the mock-up shows the social networks on row 1, WhatsApp and email on row 2. */
  row: number
  /** File name (without .svg) in scripts/nav-icons/. */
  icon: string
}

export const FOOTER_VC_TAGLINE = 'Platform-agnostic AI and workflow consultancy. Process before platform.'

/** The approved footer carries no credential chips; the field stays editable in Studio. */
export const FOOTER_VC_BADGES: string[] = []

export const FOOTER_VC_COPYRIGHT =
  '© 2026 Fruition Services · ABN 12 667 454 006 · Level 12, 64 York Street, Sydney NSW 2000'

export const FOOTER_VC_COLUMNS: FooterVcColumn[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Implementation packages', href: '/implementation-packages' },
      { label: 'Licence procurement', href: '/licence-procurement' },
      { label: 'Implementation calculator', href: '/ask-fruit' },
      { label: 'Implementation consultants', href: '/monday-implementation-consultants' },
      { label: 'CRM consulting', href: '/monday-crm-consulting' },
      { label: 'Training', href: '/training' },
      { label: 'monday Service (ITSM)', href: '/monday-consulting-solutions/monday-service' },
      { label: 'HR operations', href: '/monday-consulting-solutions/monday-for-hr' },
      { label: 'AI consulting', href: '/ai-consulting' },
      { label: 'AI capability assessment', href: '/ai-capability-assessment' },
      { label: 'AI strategy & execution', href: '/ai-strategy-and-execution' },
      { label: 'Agent development', href: '/ai-consulting/agent-development' },
      { label: 'RAG & knowledge systems', href: '/ai-consulting/rag-knowledge-systems' },
      { label: 'AI governance', href: '/ai-consulting/governance-and-compliance' },
      { label: 'AI customer service', href: '/ai-consulting/customer-service' },
      { label: 'AI marketing automation', href: '/ai-consulting/marketing-automation' },
      { label: 'AI sales & outbound', href: '/ai-consulting/sales-outbound' },
      { label: 'AI operations', href: '/ai-consulting/operations-back-office' },
    ],
  },
  {
    // Every partner page, one link each (HubSpot is one page, so one link),
    // then the integration pages. Matches the menu's Partnership tab plus the
    // AI platforms that live only here.
    heading: 'Partnership',
    links: [
      { label: 'monday.com', href: '/partnerships/monday-consulting-partner' },
      { label: 'Atlassian', href: '/atlassian-consulting' },
      { label: 'HubSpot', href: '/hubspot-consulting' },
      { label: 'ClickUp', href: '/partnerships/certified-clickup-partner' },
      { label: 'OpenAI', href: '/partnerships/openai-chatgpt-partner' },
      { label: 'Anthropic Claude', href: '/partnerships/anthropic-claude-partner' },
      { label: 'ElevenLabs', href: '/partnerships/elevenlabs-partner' },
      { label: 'Google Gemini', href: '/partnerships/google-gemini-vertex-ai-partner' },
      { label: 'OpenClaw', href: '/partnerships/openclaw-partner' },
      { label: 'Vapi', href: '/partnerships/vapi-partner' },
      { label: 'Grok Bot', href: '/partnerships/grok-bot-partner' },
      { label: 'Meta Muse', href: '/partnerships/meta-muse-partner' },
      { label: 'n8n', href: '/partnerships/n8n-integration-partner' },
      { label: 'Make', href: '/partnerships/make-partners' },
      { label: 'Aircall', href: '/partnerships/aircall-partner' },
      { label: 'All partners', href: '/partnerships' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'WhatsApp', href: '/integrations/whatsapp' },
      { label: 'LINE', href: '/integrations/line' },
      { label: 'Viber', href: '/integrations/viber' },
      { label: 'Twilio', href: '/integrations/twilio' },
      { label: 'Zapier', href: '/integrations/zapier' },
    ],
  },
  {
    // Same 18 industries, same order, as the menu's Industries tab.
    heading: 'Industries',
    links: [
      { label: 'Construction', href: '/monday-for-construction' },
      { label: 'Manufacturing', href: '/monday-for-manufacturing' },
      { label: 'Government', href: '/monday-for-government' },
      { label: 'Professional services', href: '/monday-for-professional-services' },
      { label: 'Real estate', href: '/monday-for-real-estate' },
      { label: 'Financial services', href: '/industries/financial-services' },
      { label: 'Retail', href: '/monday-for-retail' },
      { label: 'Healthcare', href: '/industries/healthcare' },
      { label: 'Solar & renewables', href: '/industries/solar-renewables' },
      { label: 'Marketing & creative', href: '/monday-for-marketing' },
      { label: 'Education', href: '/industries/education' },
      { label: 'Nonprofits', href: '/industries/nonprofits' },
      { label: 'Transport & logistics', href: '/industries/transport-logistics' },
      { label: 'Hospitality & events', href: '/industries/hospitality-tourism-events' },
      { label: 'Technology & SaaS', href: '/industries/technology-saas' },
      { label: 'Energy & utilities', href: '/industries/energy-utilities' },
      { label: 'Media & entertainment', href: '/industries/media-entertainment' },
      { label: 'Legal', href: '/industries/legal' },
      { label: 'AI use case hub', href: '/ai-use-cases' },
    ],
  },
  {
    heading: 'Locations',
    links: [
      { label: 'Australia', href: '/monday-partner-australia' },
      { label: 'United Kingdom', href: '/monday-partner-uk' },
      { label: 'United States', href: '/monday-partner-us' },
      { label: 'Singapore & Malaysia', href: '/monday-partner-singapore' },
      { label: 'India', href: '/monday-partner-india' },
      { label: 'Philippines', href: '/monday-partner-philippines' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Fruition', href: '/about-us' },
      { label: 'Team', href: '/fruition-team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Certifications & awards', href: '/certifications-and-awards' },
      { label: 'Customer stories', href: '/customer-testimonials' },
      { label: 'Blog', href: '/consulting-blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
]

export const FOOTER_VC_SOCIALS: FooterVcSocial[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/fruition-services', row: 1, icon: 'social-linkedin' },
  { label: 'Instagram', href: 'https://instagram.com/fruition.monday', row: 1, icon: 'social-instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100092289551680', row: 1, icon: 'social-facebook' },
  { label: 'YouTube', href: 'https://youtube.com/@fruitionservices', row: 1, icon: 'social-youtube' },
  { label: 'X', href: 'https://x.com/Fruitionservic', row: 1, icon: 'social-x' },
  { label: 'Reddit', href: 'https://reddit.com/user/Professional_Act2302', row: 1, icon: 'social-reddit' },
  { label: 'Pinterest', href: 'https://pinterest.com/fruitionservice', row: 1, icon: 'social-pinterest' },
  { label: 'WhatsApp', href: 'https://wa.me/61435520959', row: 2, icon: 'social-whatsapp' },
  { label: 'Email', href: 'mailto:contact@fruitionservices.io', row: 2, icon: 'social-email' },
]

export function footerVcHrefs(): string[] {
  return [...new Set(FOOTER_VC_COLUMNS.flatMap((c) => c.links.map((l) => l.href)))]
}
