"use client"

import { usePathname } from 'next/navigation'

/**
 * Site-wide BreadcrumbList JSON-LD, rendered once by SiteFrame (§05: breadcrumb
 * schema on every page). The visible trail was removed on 28 Oct 2026 at
 * Edward's request; only the structured data remains, so search results keep
 * their breadcrumb path. Labels derive from the path; LABELS overrides the
 * prettifier where kebab-case can't be prettified into the real page name.
 */

const HIDDEN_PREFIXES = ['/internal', '/studio', '/post', '/api']

/**
 * Virtual hierarchy for flat legacy URLs: the crumb trail shows the logical
 * cluster (Home / Industries / …) without moving any ranked URL — §07 of the
 * v2.1 proposal forbids touching ranking monday.com slugs. Parents without an
 * href are omitted from the JSON-LD.
 */
const INDUSTRIES_PARENT = { label: 'Industries', href: '/industries' }
const REGIONS_PARENT = { label: 'Regions' }
const AI_PARENT = { label: 'AI Consulting', href: '/ai-consulting' }

const VIRTUAL_PARENTS: Record<string, { label: string; href?: string }> = {
  '/monday-for-construction': INDUSTRIES_PARENT,
  '/monday-for-manufacturing': INDUSTRIES_PARENT,
  '/monday-for-retail': INDUSTRIES_PARENT,
  '/monday-for-professional-services': INDUSTRIES_PARENT,
  '/monday-for-government': INDUSTRIES_PARENT,
  '/monday-for-marketing': INDUSTRIES_PARENT,
  '/monday-for-real-estate': INDUSTRIES_PARENT,
  '/monday-partner-australia': REGIONS_PARENT,
  '/monday-partner-uk': REGIONS_PARENT,
  '/monday-partner-us': REGIONS_PARENT,
  '/monday-partner-singapore': REGIONS_PARENT,
  '/monday-partner-india': REGIONS_PARENT,
  '/monday-partner-philippines': REGIONS_PARENT,
  '/ai-capability-assessment': AI_PARENT,
  '/ai-strategy-and-execution': AI_PARENT,
  '/implementation-packages': { label: 'monday.com consulting', href: '/partnerships/monday-consulting-partner' },
}

/**
 * Pages that publish their BreadcrumbList inside their own JSON-LD @graph, so the
 * page carries one merged block.
 */
const PAGES_WITH_OWN_BREADCRUMB_SCHEMA = new Set(['/implementation-packages'])

const LABELS: Record<string, string> = {
  'consulting-blog': 'Blog',
  partnerships: 'Partners',
  'customer-testimonials': 'Customer Stories',
  'fruition-team': 'Meet the Team',
  'monday-consulting-solutions': 'monday.com Solutions',
  'rag-knowledge-systems': 'RAG & Knowledge Systems',
  'operations-back-office': 'Operations & Back-office',
  'jira-to-monday-migration': 'Jira → monday Migration',
  'hubspot-to-monday-migration': 'HubSpot → monday Migration',
  'monday-hubspot-integration': 'monday ↔ HubSpot Integration',
  'work-management': 'Work Management',
  'terms-and-conditions': 'Terms & Conditions',
  'monday-for-cabinetry-renovation': 'Installation & Renovation',
  'solar-crm-solution': 'Solar CRM Solution',
  // AI use case catalogue (/ai-use-cases/<industry>)
  'ai-use-cases': 'AI Use Cases',
  'education-nonprofit': 'Education & Nonprofit',
  'retail-ecommerce': 'Retail & E-commerce',
  'technology-saas': 'Technology & SaaS',
  'cross-industry': 'Cross-industry',
  // The assistant kept its /ask-fruit URL through two renames.
  'ask-fruit': 'Implementation Calculator',
  // The pricing page (/pricing redirects here) keeps its packages URL.
  'implementation-packages': 'Pricing',
  'licence-procurement': 'Licence procurement',
  // Messaging channels — the prettifier would title-case these into
  // "Whatsapp" and "Line", which are both wrong as brand names.
  whatsapp: 'WhatsApp',
  line: 'LINE',
  viber: 'Viber',
}

/** Whole words that need casing the title-case fallback can't produce. */
const WORD_FIXUPS: Record<string, string> = {
  monday: 'monday.com',
  ai: 'AI',
  crm: 'CRM',
  hr: 'HR',
  it: 'IT',
  faqs: 'FAQs',
  rag: 'RAG',
  jira: 'Jira',
  jsm: 'JSM',
  hubspot: 'HubSpot',
  atlassian: 'Atlassian',
  openai: 'OpenAI',
  chatgpt: 'ChatGPT',
  aws: 'AWS',
  n8n: 'n8n',
  clickup: 'ClickUp',
  langgraph: 'LangGraph',
  elevenlabs: 'ElevenLabs',
  vapi: 'Vapi',
  supabase: 'Supabase',
  azure: 'Azure',
  us: 'US',
  uk: 'UK',
}

const LOWERCASE_WORDS = new Set(['for', 'and', 'to', 'the', 'of', 'with', 'in'])

function labelFor(segment: string): string {
  if (LABELS[segment]) return LABELS[segment]
  return segment
    .split('-')
    .map((word, i) => {
      if (WORD_FIXUPS[word]) {
        // "monday" only means monday.com when it starts the slug (monday-for-…),
        // not mid-slug (jira-to-monday-migration is handled by LABELS anyway)
        if (word === 'monday' && i > 0) return 'monday'
        return WORD_FIXUPS[word]
      }
      if (i > 0 && LOWERCASE_WORDS.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  if (!pathname || pathname === '/' || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const pathCrumbs = segments.map((segment, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    return {
      label: labelFor(segment),
      href: href as string | undefined,
    }
  })

  const virtualParent = VIRTUAL_PARENTS[pathname]
  const crumbs = virtualParent
    ? [{ label: virtualParent.label, href: virtualParent.href }, ...pathCrumbs]
    : pathCrumbs

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      // virtual parents without a real page are kept out of the schema
      ...crumbs
        .filter((c) => c.href)
        .map((c, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: c.label,
          item: `${BASE}${c.href}`,
        })),
    ],
  }

  if (PAGES_WITH_OWN_BREADCRUMB_SCHEMA.has(pathname)) return null

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
