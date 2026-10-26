/**
 * Footer v3 (Josh, 21 Oct 2026). With the menu cut to five tabs, the footer
 * carries every page that left it, so each page that gets traffic is still one
 * click from anywhere. Copy is the prototype's, verbatim; "Implementation
 * calculator" points at /ask-fruit, its real route.
 *
 * Written to Sanity siteSettings (footerTagline, footerBadges, footerColumns,
 * footerCopyrightText) by scripts/seed-nav-v3.ts, so editors own it after that.
 */

export interface FooterV3Column {
  heading: string
  links: { label: string; href: string }[]
}

export const FOOTER_V3_TAGLINE = 'Platform-agnostic AI and workflow consultancy. Process before platform.'

export const FOOTER_V3_BADGES = [
  'OpenAI Select Partner',
  'monday.com Platinum',
  'Atlassian Platinum',
  'Rising Star 2026 ×2',
]

export const FOOTER_V3_COPYRIGHT =
  '© 2026 Fruition Services · ABN 12 667 454 006 · Level 12, 64 York Street, Sydney NSW 2000'

export const FOOTER_V3_COLUMNS: FooterV3Column[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Implementation packages', href: '/implementation-packages' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Implementation consultants', href: '/monday-implementation-consultants' },
      { label: 'CRM consulting', href: '/monday-crm-consulting' },
      { label: 'Training', href: '/monday-training' },
      { label: 'AI consulting', href: '/ai-consulting' },
      { label: 'AI capability assessment', href: '/ai-capability-assessment' },
      { label: 'AI strategy & execution', href: '/ai-strategy-and-execution' },
      { label: 'Agent development', href: '/ai-consulting/agent-development' },
      { label: 'RAG & knowledge systems', href: '/ai-consulting/rag-knowledge-systems' },
      { label: 'AI governance', href: '/ai-consulting/governance-and-compliance' },
    ],
  },
  {
    heading: 'Platforms',
    links: [
      { label: 'Jira', href: '/atlassian-consulting/jira' },
      { label: 'Jira Service Management', href: '/atlassian-consulting/jira-service-management' },
      { label: 'Confluence', href: '/atlassian-consulting/confluence' },
      { label: 'Jira → monday migration', href: '/atlassian-consulting/jira-to-monday-migration' },
      { label: 'HubSpot implementation', href: '/hubspot-consulting/implementation' },
      { label: 'HubSpot Breeze AI', href: '/hubspot-consulting/breeze-ai' },
      { label: 'All partners', href: '/partnerships' },
      { label: 'Integrations', href: '/integrations' },
    ],
  },
  {
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
      { label: 'Solutions catalog', href: '/monday-consulting-solutions/catalog' },
      { label: 'Implementation calculator', href: '/ask-fruit' },
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

export function footerV3Hrefs(): string[] {
  return [...new Set(FOOTER_V3_COLUMNS.flatMap((c) => c.links.map((l) => l.href)))]
}
