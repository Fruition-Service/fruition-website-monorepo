"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { pageShell } from '@/lib/pageShell'

/**
 * Site-wide breadcrumb bar, rendered by SiteFrame directly under the navbar so
 * every marketing page — legacy and practice-cluster alike — gets the same
 * trail (§05: breadcrumb schema on every page). Labels derive from the path;
 * LABELS overrides the prettifier where kebab-case can't be prettified into
 * the real page name.
 */

const HIDDEN_PREFIXES = ['/internal', '/studio', '/post', '/api']

/** Parents that exist as real pages — intermediates outside this set render as plain text. */
const LINKABLE_PARENTS = new Set([
  '/ai-consulting',
  '/atlassian-consulting',
  '/hubspot-consulting',
  '/integrations',
  '/monday-consulting-solutions',
  '/partnerships',
  '/consulting-blog',
])

/**
 * Virtual hierarchy for flat legacy URLs: the crumb trail shows the logical
 * cluster (Home / Industries / …) without moving any ranked URL — §07 of the
 * v2.1 proposal forbids touching ranking monday.com slugs. Parents without an
 * href render as plain text and are omitted from the JSON-LD.
 */
const INDUSTRIES_PARENT = { label: 'Industries' }
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
}

const LABELS: Record<string, string> = {
  'consulting-blog': 'Blog',
  'customer-testimonials': 'Case Studies',
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
      isLast: i === segments.length - 1,
      linkable: i === segments.length - 1 ? false : LINKABLE_PARENTS.has(href),
    }
  })

  const virtualParent = VIRTUAL_PARENTS[pathname]
  const crumbs = virtualParent
    ? [{ label: virtualParent.label, href: virtualParent.href, isLast: false, linkable: !!virtualParent.href }, ...pathCrumbs]
    : pathCrumbs

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      // virtual parents without a real page are visual-only — kept out of the schema
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

  return (
    <div className="bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* The trail runs in the same container as the page below it — see
          pageShell.ts. A single hardcoded width left it 26-66px adrift of the
          copy on every page that is not a 1148px practice page. */}
      <nav aria-label="Breadcrumb" className={`${pageShell(pathname)} mx-auto pt-5`}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li>
            <Link href="/" className="hover:text-[#8015e8] transition-colors">Home</Link>
          </li>
          {crumbs.map((c) => (
            <li key={`${c.label}-${c.href ?? 'virtual'}`} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {c.isLast ? (
                /* The current page reads as part of the trail, not as a heading:
                   same muted grey and weight as every other crumb. */
                <span aria-current="page">{c.label}</span>
              ) : c.linkable && c.href ? (
                <Link href={c.href} className="hover:text-[#8015e8] transition-colors">{c.label}</Link>
              ) : (
                <span>{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
