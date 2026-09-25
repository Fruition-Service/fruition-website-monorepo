/**
 * Seed the practice-cluster closing CTA as a single Sanity `closingCta` doc
 * tagged with every practice route, copy verbatim from the previous hardcoded
 * PracticePageTemplate section. CREATE-ONLY (createIfNotExists) — rerun-safe,
 * never overwrites editor changes.
 *
 * AI partner pages are intentionally NOT seeded: their closing copy already
 * lives in their aiPartnerPage docs and renders via the template fallback.
 *
 * Run with: npx tsx scripts/sanity-migrate/closing-cta.ts
 */
import { writeClient } from './lib'

import { AI_CONSULTING_PAGES } from '../../src/data/practicePages/aiConsulting'
import { ATLASSIAN_PAGES } from '../../src/data/practicePages/atlassian'
import { HUBSPOT_PAGES } from '../../src/data/practicePages/hubspot'
import { INDUSTRIES_PAGES } from '../../src/data/practicePages/industries'
import { INTEGRATIONS_PAGES } from '../../src/data/practicePages/integrations'
import { MONDAY_PRODUCTS_PAGES } from '../../src/data/practicePages/mondayProducts'
import { PROOF_PAGES } from '../../src/data/practicePages/proof'
import { LICENSING_PAGES } from '../../src/data/practicePages/licensing'
import { DISCOVERY_CALL_URL, type PracticePage } from '../../src/data/practicePages/types'

async function main() {
  const maps: Record<string, PracticePage>[] = [
    AI_CONSULTING_PAGES, ATLASSIAN_PAGES, HUBSPOT_PAGES, INDUSTRIES_PAGES,
    INTEGRATIONS_PAGES, MONDAY_PRODUCTS_PAGES, PROOF_PAGES, LICENSING_PAGES,
  ]
  const pages = [...new Set(maps.flatMap((m) => Object.values(m).map((p) => p.path.replace(/^\//, ''))))].sort()

  await writeClient.createIfNotExists({
    _id: 'closingCta-practice-default',
    _type: 'closingCta',
    title: 'Practice pages default ("Ready to talk?")',
    heading: 'Ready to talk?',
    lead: "Book a 30-minute discovery call. We'll give you a frank read on scope, fit, and cost.",
    primaryLabel: 'Book a discovery call →',
    primaryUrl: DISCOVERY_CALL_URL,
    pages,
  })
  console.log(`Done. closingCta-practice-default covers ${pages.length} practice routes.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
