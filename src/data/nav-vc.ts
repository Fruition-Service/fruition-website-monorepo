/**
 * Version C menu (approved November 2026): AI, Partnership, Industries, Pricing,
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
  /**
   * Pages of a flip book: when set, the card turns through them on its own
   * and the card's own label/href stays as the link under every page.
   */
  slides?: NavVcSlide[]
}

/** One page of a flip-book feature card. Logos are existing Sanity asset ids. */
export interface NavVcSlide {
  title?: string
  /** Short line under the title, e.g. "70 builds". */
  meta?: string
  quote?: string
  /** Render the quote as a plain blurb, without quotation marks. */
  plain?: boolean
  attribution?: string
  logos?: { asset: string; alt: string }[]
  metrics?: { value: string; label: string }[]
  href?: string
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
    // Slides: the five industries with the most builds, each with three client
    // logos from that industry's logo wall (industryLogoSet). Counts are
    // public/data/ai-use-cases/*.json. The whole card links to the hub.
    feature: {
      kicker: 'Use case hub',
      quote: '279 real AI and monday.com builds across 12 industries, filterable by team and outcome.',
      label: 'Browse AI use cases',
      href: '/ai-use-cases',
      slides: [
        {
          title: 'Professional services & agencies',
          meta: '70 builds',
          href: '/ai-use-cases/professional-services',
          logos: [
            { alt: 'Star Aviation', asset: 'image-674f58add988c753df8135bfc9664a7570e4def8-269x93-png' },
            { alt: 'Gordon Slater Lawyers', asset: 'image-4465eee9b6893fab7cdb4edf7da69ac5bb38b543-900x441-png' },
            { alt: 'Academy HR', asset: 'image-e126a72d4bc511ef8af3d99159bee5be0b41a374-899x156-png' },
          ],
        },
        {
          title: 'Construction, trades & field service',
          meta: '64 builds',
          href: '/ai-use-cases/construction',
          logos: [
            { alt: 'Evolve Constructions', asset: 'image-09ca61a758adbb476278fde27d53182a18ed95f1-269x114-png' },
            { alt: 'Creative Windows', asset: 'image-2873461a85419baafd677e865d2753638e941786-232x154-png' },
            { alt: 'Permcon', asset: 'image-86bfabf908c359ff52c149a6ff047c23aa1c2ea2-640x349-png' },
          ],
        },
        {
          title: 'Manufacturing',
          meta: '47 builds',
          href: '/ai-use-cases/manufacturing',
          logos: [
            { alt: 'Ausdeck', asset: 'image-5484ead34a282ea50b1ffda4d97ae12c7cb4cf60-153x42-png' },
            { alt: 'Bielby', asset: 'image-47f46119cde1e03ae657ef7e33b12dd5259de72f-167x56-png' },
            { alt: 'FibreconX', asset: 'image-bded71d00c16cc95c2dbd30f5a85584eb1e07310-900x139-png' },
          ],
        },
        {
          title: 'Real estate & property',
          meta: '16 builds',
          href: '/ai-use-cases/real-estate',
          logos: [
            { alt: 'Aligned Property Services', asset: 'image-4a819aea792e4bc75f7ba11c2e2be13db0b994d4-873x363-png' },
            { alt: 'Real Property Development', asset: 'image-8137628dd9bbdd295334cf71c16c7262a2506dde-277x139-png' },
            { alt: 'Leconfield Property Group', asset: 'image-491cdcabbc79ac443a127c3ab7ce20d13e435351-900x95-png' },
          ],
        },
        {
          title: 'Financial services & insurance',
          meta: '13 builds',
          href: '/ai-use-cases/financial-services',
          logos: [
            { alt: 'Hume Bank', asset: 'image-2e47befaf8cbc3314c3d35b04a3137641b05daec-803x140-png' },
            { alt: 'Avant Insurance', asset: 'image-a26e220c0afdc15b9018d49600b76a46f6c13c24-900x317-png' },
            { alt: 'AEON Bank', asset: 'image-bcaba4279a2dc43824abfdd933a39dfad31c084c-274x50-png' },
          ],
        },
      ],
    },
    footerLinks: [
      { label: 'All AI services', href: '/ai-consulting' },
      { label: 'Book an assessment', href: '/ai-capability-assessment' },
    ],
  },
  {
    label: 'Partnership',
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
          { label: 'OpenAI', href: '/partnerships/openai-chatgpt-partner', description: 'ChatGPT Enterprise & custom GPTs', icon: 'openai' },
          { label: 'Anthropic Claude', href: '/partnerships/anthropic-claude-partner', description: 'Enterprise Claude & Claude Code', icon: 'anthropic-claude' },
          { label: 'ElevenLabs', href: '/partnerships/elevenlabs-partner', description: 'Voice AI agents and lifelike speech', icon: 'elevenlabs' },
        ],
      },
      {
        heading: 'Automation',
        columns: 1,
        grow: 1,
        items: [
          { label: 'n8n', href: '/partnerships/n8n-integration-partner', description: 'Self-hosted workflows and AI agents', icon: 'n8n' },
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
    // 12 sectors were hidden from the menu on 13 Nov 2026 (Edward); their pages
    // stay live and are still listed in the footer and on /industries.
    footerLinks: [
      { label: 'Browse industries', href: '/ai-use-cases' },
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
    // Slides: six case studies, quotes and figures word for word from
    // page-customer-testimonials caseStudyCards. Popology is left out (its
    // figures are an exact copy of BL Air's) and so is CLSQ (3x ROI).
    // The top-level fields stay for any renderer that ignores slides.
    feature: {
      kicker: 'Case study',
      quote: 'This system will save \u201chundreds of thousands of dollars a year guaranteed\u201d',
      attribution: 'Brandon-Lee Horridge, Managing Director, BL Air Conditioning',
      logoAsset: 'image-45384aab63f4561950ccf9c2207d4313e6c63f35-289x174-png',
      metrics: [
        { value: '17x', label: 'ROI' },
        { value: '$125,000', label: 'Saved per year' },
      ],
      label: 'Read the case study',
      href: '/customer-testimonials#case-studies',
      slides: [
        {
          // The quote already carries its own marks, so no outer ones.
          quote: 'This system will save \u201chundreds of thousands of dollars a year guaranteed\u201d',
          plain: true,
          attribution: 'Brandon-Lee Horridge, Managing Director, BL Air Conditioning',
          logos: [{ alt: 'BL Air Conditioning', asset: 'image-45384aab63f4561950ccf9c2207d4313e6c63f35-289x174-png' }],
          metrics: [{ value: '17x', label: 'ROI' }, { value: '$125,000', label: 'Saved per year' }],
        },
        {
          quote: 'Fruition have been instrumental in moving us to a \u2018single source of truth\u2019 system for managing sales and projects.',
          attribution: 'Ron Amaram, General Manager, Risk 2 Solutions',
          logos: [{ alt: 'Risk 2 Solutions', asset: 'image-04beb83243a2515ec5c8b281f8ea81496b20bca0-372x373-png' }],
          metrics: [{ value: '11x', label: 'ROI' }, { value: '$117,000', label: 'Saved per year' }],
        },
        {
          quote: 'We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information, eliminating the need to email around for updates.',
          attribution: 'Mairhead McKinley, Delivery Manager, Givergy',
          logos: [{ alt: 'Givergy', asset: 'image-01cfeded16bbbdc0a3d76614a101f57413bcdcfc-405x158-png' }],
          metrics: [{ value: '10x', label: 'ROI' }, { value: '\u00a366,820', label: 'Saved annually' }],
        },
        {
          quote: 'We successfully aligned clients and projects in an organized and seamless manner, resolving a key operational challenge.',
          attribution: 'Robinson Sandino, Chief Executive Officer, Promotify Canada',
          logos: [{ alt: 'Promotify Canada', asset: 'image-4334073d6ebe7b383a49ff26d1fc07e7fa07dd96-360x361-png' }],
          metrics: [{ value: '14x', label: 'ROI' }, { value: '$72,000', label: 'Saved per year' }],
        },
        {
          quote: 'We gained efficiency on project tasks... Now that the solution has automated a lot of the manual work we can focus on the critical risks effectively.',
          attribution: 'Stephen Coates, Division Manager, HVAC Australia',
          logos: [{ alt: 'HVAC Australia', asset: 'image-93cbbba2bf9d9babaf56e60dea613e718e05d1da-462x157-png' }],
          metrics: [{ value: '10x', label: 'ROI' }, { value: '$52,000', label: 'Saved per year' }],
        },
        {
          quote: 'Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally and also improved collaboration across global teams.',
          attribution: 'Emily Hill, International Markets Manager, Tourism Northern Territory',
          logos: [{ alt: 'Tourism Northern Territory', asset: 'image-1c46740cad343bf54254c66032ceba69fcc48e2c-520x217-png' }],
          metrics: [{ value: '4x', label: 'ROI' }, { value: '$50,000', label: 'Saved per year' }],
        },
      ],
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
          { label: 'AI use cases', href: '/ai-use-cases', description: 'Solution catalogue of 279 real builds', icon: 'ai-consulting' },
        ],
      },
      {
        heading: 'About',
        columns: 1,
        grow: 1,
        items: [
          { label: 'About Fruition', href: '/about-us', description: 'Who we are and how we work', icon: 'about-fruition' },
          { label: 'Contact us', href: '/contact-us', description: 'Talk to the team or book a call', icon: 'contact-us' },
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

