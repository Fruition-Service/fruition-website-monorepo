import type { CapabilityCard, MethodologyStep } from "@/components/sections/types"
import type { ClosingCtaCopy } from "@/components/sections/ClosingCtaSection"

/**
 * Copy for /what-we-do. Every description is lifted verbatim from the page the
 * card links to (hero lead, meta description or section copy), so this page
 * makes no claim the service pages do not already make. Keep it that way: when
 * a service page's copy changes, update the matching card here.
 */

export const WHAT_WE_DO_SEO = {
  title: "What We Do | Fruition: monday.com, HubSpot, Atlassian & AI Consulting",
  description:
    "Platform-agnostic AI and workflow consultancy. Process before platform. An overview of Fruition's monday.com, CRM, AI, HubSpot and Atlassian consulting services.",
}

export const WHAT_WE_DO_HERO = {
  eyebrow: "Services",
  headingPart1: "What we ",
  headingAccent: "do",
  // Footer tagline and nav strapline, verbatim.
  subheading:
    "Platform-agnostic AI and workflow consultancy. Process before platform. We recommend the stack that fits your process, not the other way round.",
  primaryCtaLabel: "Book a discovery call",
  primaryCtaUrl: "/contact-us",
}

export const WHAT_WE_DO_SERVICES = {
  eyebrow: "// Service lines",
  heading: "Find the service that",
  headingAccent: "fits your process",
}

export const WHAT_WE_DO_CARDS: CapabilityCard[] = [
  {
    _key: "monday-implementation",
    title: "monday.com implementation",
    href: "/monday-implementation-consultants",
    description:
      "Get set up the right way, without spending valuable hours figuring it out yourself. Make monday.com work for you and the architecture of your business with a monday.com implementation expert.",
  },
  {
    _key: "monday-crm",
    title: "monday CRM consulting",
    href: "/monday-crm-consulting",
    description:
      "Unlock the full potential of monday.com CRM with our monday.com expert setup and support.",
  },
  {
    _key: "industries",
    title: "monday.com for your industry",
    href: "/monday-consulting-solutions",
    linkLabel: "All solutions",
    description:
      "Purpose-built solutions for every team. Powered by monday.com, configured by Fruition.",
    links: [
      { label: "Construction", href: "/monday-for-construction" },
      { label: "Manufacturing", href: "/monday-for-manufacturing" },
      { label: "Professional services", href: "/monday-for-professional-services" },
      { label: "Real estate", href: "/monday-for-real-estate" },
      { label: "Retail", href: "/monday-for-retail" },
      { label: "Marketing", href: "/monday-for-marketing" },
      { label: "Government", href: "/monday-for-government" },
    ],
  },
  {
    _key: "ai",
    title: "AI consulting",
    href: "/ai-consulting",
    description:
      "AI consulting that starts from how your business actually works. We assess, build, and govern AI systems on the platforms your teams already run, with fixed fees and practitioner-led delivery.",
    links: [
      { label: "AI capability assessment", href: "/ai-capability-assessment" },
      { label: "AI strategy & execution", href: "/ai-strategy-and-execution" },
      { label: "AI readiness blueprint", href: "/ai-readiness-blueprint" },
    ],
  },
  {
    _key: "hubspot",
    title: "HubSpot consulting",
    href: "/hubspot-consulting",
    description:
      "Fruition delivers HubSpot consulting across Australia, the UK, and the US (implementation, Breeze AI enablement, and integrations) as a multi-platform firm that recommends HubSpot when it fits and says so when it doesn’t.",
  },
  {
    _key: "atlassian",
    title: "Atlassian consulting",
    href: "/atlassian-consulting",
    description:
      "Fruition delivers Atlassian consulting across Australia, the UK, and the US: Jira, Confluence, and JSM implementation and optimisation, plus honest advice on when Atlassian is and isn’t your answer.",
  },
  {
    _key: "packages",
    title: "Packages & training",
    href: "/implementation-packages",
    linkLabel: "See packages",
    description:
      "Hit the ground running and drive lasting impact with hands-on support. Our consultants help drive adoption and ensure long term success with monday.com",
    links: [{ label: "monday.com training", href: "/monday-training" }],
  },
  {
    _key: "partnerships",
    title: "Technology partners",
    href: "/partnerships",
    description:
      "Fruition is a platform-agnostic consultancy. We're an OpenAI Select Partner, an Anthropic Claude partner, a monday.com and Atlassian Platinum Partner, and an n8n and Make partner, so we can recommend the stack that fits your process instead of the one we resell.",
  },
]

// The implementation blueprint from /monday-implementation-consultants, verbatim.
export const WHAT_WE_DO_PROCESS: MethodologyStep[] = [
  {
    _key: "discovery",
    title: "Discovery & Process Architecture",
    description: "Auditing your operational loops.",
  },
  {
    _key: "build",
    title: "Bespoke Workspace Build",
    description: "Configuring advanced boards, custom permissions, and cross-tool automations.",
  },
  {
    _key: "adoption",
    title: "User Adoption & Training",
    description: "Hands-on training to guarantee day-one team compliance.",
  },
]

export const WHAT_WE_DO_CLOSING_CTA: ClosingCtaCopy = {
  heading: "Ready to build systems that scale with your team?",
  headingAccent: "scale with your team",
  lead: "Speak to a consultant, not a salesperson.",
  primaryLabel: "Book a discovery call →",
  primaryUrl: "/contact-us",
}
