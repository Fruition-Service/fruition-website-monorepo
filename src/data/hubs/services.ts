import type { HubCard } from '@/components/hubs/HubSections'
import { SERVICES, type ServiceCard } from '@/components/home/data'

/**
 * /what-we-do, the services hub.
 *
 * The six cards are the canonical service set already rendered on the home
 * page (SERVICES in src/components/home/data.ts): same titles, same bodies,
 * same destinations. Deriving them here means the hub and the home page can
 * never drift apart.
 *
 * NavIcon only ships a subset of the home page's icon names, so each service
 * icon is mapped to its nearest existing mark rather than dropping the badge.
 */
const NAV_ICON: Record<ServiceCard['icon'], string> = {
  layers: 'layers',
  zap: 'zap',
  sparkles: 'sparkle',
  users: 'users',
  file: 'document',
  crosshair: 'package',
}

export const SERVICES_HUB = {
  path: '/what-we-do',
  pageKey: 'what-we-do',
  seoTitle: 'What we do | Fruition: implementation, integration and AI services',
  seoDescription:
    'Fruition delivers platform implementation, integrations and automation, AI advisory and implementation, change management and adoption, software licence procurement, and FDE and managed services for monday.com, Atlassian and HubSpot teams.',
  eyebrow: 'Services',
  heading: 'What we do',
  lead: 'Implementation, integration and AI advisory for monday.com, Atlassian and HubSpot. Fruition is a monday.com Platinum Partner helping small businesses, mid-market and enterprise teams across Australia, India, the Philippines, Singapore, the UK and the US.',
  facts: ['900+ implementations', '6 markets', 'monday.com Platinum Partner'],
  servicesHeading: 'Six practices, one operating model',
  closingFallback: {
    heading: 'Ready to talk?',
    lead: "Book a 30-minute discovery call. We'll give you a frank read on scope, fit, and cost.",
    primaryLabel: 'Book a discovery call →',
  },
}

export const SERVICES_CARDS: HubCard[] = SERVICES.map((service) => ({
  title: service.title,
  body: service.body,
  href: service.href,
  icon: NAV_ICON[service.icon],
  cta: 'Learn more →',
}))
