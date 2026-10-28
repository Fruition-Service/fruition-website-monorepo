import type { HubCard } from '@/components/hubs/HubSections'

/**
 * /industries hub (Josh's navigation prototype, 21 Oct 2026). Copy is the
 * prototype's, verbatim. The SEO title and description stay those of the
 * previous hub so the page keeps what it ranks for, and the "Also" line adds
 * Education and Nonprofits: they were linked only from the old hub, and
 * dropping them would leave both pages with no internal link at all.
 */

export const INDUSTRIES_HUB = {
  path: '/industries',
  pageKey: 'industries',
  seoTitle: 'Industry Solutions | Fruition: AI & Platform Consulting by Sector, AU · UK · US',
  seoDescription:
    'Fruition delivers AI and platform consulting shaped by sector: the compliance regimes, workflows, and data realities of construction, finance, healthcare, manufacturing, and more, across Australia, the UK, and the US.',
  eyebrow: 'Industries',
  heading: 'Workflow and AI consulting',
  accent: 'by industry',
  lead: 'Fruition designs project, CRM and AI workflows for construction, manufacturing, government, professional services, real estate and financial services. Each industry has prebuilt solutions in our use case hub that we adapt to your process.',
  facts: ['45 prebuilt solutions', 'NSW Government ICT Services Scheme supplier', '900+ implementations'],
  sectorsHeading: 'Industries we specialise in',
  sectors: [
    {
      group: 'Featured',
      title: 'Construction',
      body: 'Project delivery, site diaries, subcontractor compliance, variations and handover in one system.',
      cta: 'Construction solutions →',
      href: '/monday-for-construction',
      icon: 'building',
    },
    {
      group: 'Featured',
      title: 'Manufacturing',
      body: 'Production planning, quality, maintenance and purchase orders, connected to your ERP.',
      cta: 'Manufacturing solutions →',
      href: '/monday-for-manufacturing',
      icon: 'factory',
    },
    {
      group: 'Featured',
      title: 'Government',
      body: 'Secure program delivery and reporting for public-sector teams, with procurement-ready contracting.',
      cta: 'Government solutions →',
      href: '/monday-for-government',
      icon: 'flag',
    },
    {
      title: 'Professional services',
      body: 'Client onboarding, resourcing, time tracking and billing across every engagement.',
      cta: 'Professional services →',
      href: '/monday-for-professional-services',
      icon: 'briefcase',
    },
    {
      title: 'Real estate',
      body: 'Listings, deal pipelines, property operations and tenant requests.',
      cta: 'Real estate →',
      href: '/monday-for-real-estate',
      icon: 'home',
    },
    {
      title: 'Financial services',
      body: 'APRA- and FCA-aligned workflows, approvals and AI with an audit trail.',
      cta: 'Financial services →',
      href: '/industries/financial-services',
      icon: 'dollar',
    },
  ] satisfies HubCard[],
  also: [
    { label: 'Retail', href: '/monday-for-retail' },
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Solar & renewables', href: '/industries/solar-renewables' },
    { label: 'Education', href: '/industries/education' },
    { label: 'Nonprofits', href: '/industries/nonprofits' },
  ],
  useCasesHeading: 'Browse the use case hub',
  useCasesLede: 'Filter prebuilt solutions by team. Every one can be adapted to your industry.',
  useCases: [
    { label: 'Project management', href: '/monday-consulting-solutions/monday-project-management' },
    { label: 'Finance', href: '/monday-consulting-solutions/monday-for-finance' },
    { label: 'HR', href: '/monday-consulting-solutions/monday-for-hr' },
    { label: 'Service', href: '/monday-consulting-solutions/monday-service' },
    { label: 'Product management', href: '/monday-consulting-solutions/monday-product-management' },
    { label: 'Marketing & creative', href: '/monday-for-marketing' },
    { label: 'All AI use cases →', href: '/ai-use-cases', primary: true },
  ],
}
