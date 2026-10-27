import type { CapabilityBlock } from '@/components/sections/types'
import { SERVICES } from '@/components/home/data'

/**
 * /what-we-do, the services hub.
 *
 * Titles, body copy and destinations come from the canonical six practices
 * already rendered on the home page (SERVICES in src/components/home/data.ts),
 * so the hub and the home page can never drift apart. Only the three
 * deliverables and the per-practice link label are authored here.
 */
export const SERVICES_HUB = {
  path: '/what-we-do',
  pageKey: 'what-we-do',
  seoTitle: 'What we do | Fruition',
  seoDescription:
    'Fruition delivers six practices: platform implementation, integrations and automation, AI advisory and implementation, change management and adoption, software licence procurement, and FDE and managed services.',
  eyebrow: 'What we do',
  heading: 'Six practices, one team, from first workshop to',
  headingAccent: 'managed support.',
  lead: 'We implement monday.com, Atlassian and HubSpot, connect them to the systems around them, apply AI where it does real work, and stay on after launch. Take one practice or the whole operating model.',
  facts: ['900+ implementations', '6 markets', 'monday.com Platinum Partner'],
  practicesEyebrow: 'The six practices',
  practicesHeading: 'Design the way work should run, then build it.',
  practicesLead:
    'The first three practices cover the platform itself: the implementation, the integrations around it, and the AI that runs on top.',
  runEyebrow: 'Adoption and run',
  runHeading: 'The work that decides whether it sticks.',
  runLead:
    'The last three practices cover the people, the licences and the support: training that gets the team on board, contracts that stay under control, and a team that stays with you after go-live.',
  statsStatement: 'The proof behind the practices.',
  closingFallback: {
    eyebrow: 'Next step',
    heading: 'Ready to talk?',
    lead: "Book a 30-minute discovery call. We'll give you a frank read on scope, fit and cost.",
    primaryLabel: 'Book a discovery call',
    secondaryLabel: 'Contact us',
    secondaryUrl: '/contact-us',
  },
}

/** Three concrete deliverables per practice, keyed by its existing page. */
const DELIVERABLES: Record<string, { linkLabel: string; bullets: string[] }> = {
  '/monday-implementation-consultants': {
    linkLabel: 'Explore platform implementation',
    bullets: [
      'Discovery workshops that map current process, data and handoffs.',
      'Solution design and a build in your monday.com, Atlassian or HubSpot instance.',
      'Data migration, pilot, go-live and handover documentation.',
    ],
  },
  '/integrations': {
    linkLabel: 'Explore integrations and automation',
    bullets: [
      'A map of every system that needs to exchange data, and in which direction.',
      'Native connectors, API builds or n8n workflows, tested against real records.',
      'Monitoring and alerts so a failed sync surfaces before the team notices.',
    ],
  },
  '/ai-consulting': {
    linkLabel: 'Explore AI advisory and implementation',
    bullets: [
      'A readiness review covering your data, process and governance.',
      'A prioritised use case list with effort, owner and expected return.',
      'Agent and assistant builds on Claude, OpenAI or Copilot, with adoption material.',
    ],
  },
  '/monday-training': {
    linkLabel: 'Explore change management and adoption',
    bullets: [
      'Stakeholder map, comms plan and a named owner in each team.',
      'Role-based training sessions, recorded and documented.',
      'Adoption measures at 30, 60 and 90 days after go-live.',
    ],
  },
  '/pricing': {
    linkLabel: 'Explore software licence procurement',
    bullets: [
      'A licence audit against what each team actually uses.',
      'Sourcing and negotiation across Microsoft, Google, Adobe, Atlassian and monday.com.',
      'A renewal calendar so no contract auto-renews unreviewed.',
    ],
  },
  '/implementation-packages': {
    linkLabel: 'Explore FDE and managed services',
    bullets: [
      'A forward deployed engineer embedded in your team for the build.',
      'Ongoing optimisation of boards, automations and integrations.',
      'Managed support with agreed response times and a monthly review.',
    ],
  },
}

export type ServicePractice = CapabilityBlock & { href: string }

/** The six practices in their canonical order, numbered across both bands. */
export const SERVICE_PRACTICES: ServicePractice[] = SERVICES.map((service, index) => {
  const detail = DELIVERABLES[service.href]
  return {
    number: String(index + 1).padStart(2, '0'),
    title: service.title,
    lead: service.body,
    points: detail.bullets.map((text) => ({ text })),
    linkLabel: detail.linkLabel,
    href: service.href,
  }
})

