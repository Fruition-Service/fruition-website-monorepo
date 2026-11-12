/**
 * /atlassian-consulting: put the four service deep dives back (Jira,
 * Confluence, Jira Service Management, Jira to monday.com migration).
 *
 * PR #415 (5 Nov 2026) folded the four leaf pages into the hub with one
 * section each; the Version C rollout (#435, 11 Nov) replaced the page with
 * the partner template and the sections disappeared. Vadim (SEO) flagged it
 * on 12 Nov. This script adds them back as Version C `vcDeepDive` sections,
 * marked PAGE-SPECIFIC (scope "page" + scopeNote), right after the
 * "Our Atlassian services" cards, and points those four cards at the anchors.
 *
 * Copy comes verbatim from src/data/practicePages/atlassianDeepDives.ts
 * (the retired pages' text); only the accent asterisks are added.
 *
 *   npx tsx scripts/vc/atlassian-deep-dives.ts           # dry run
 *   npx tsx scripts/vc/atlassian-deep-dives.ts --apply   # write
 *
 * Re-runnable: deep dives already on the page (matched by anchor) are left alone.
 */
import { randomBytes } from 'node:crypto'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { ATLASSIAN_DEEP_DIVES } from '../../src/data/practicePages/atlassianDeepDives'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
const key = () => randomBytes(6).toString('hex')

const PAGE_ID = 'vcPage-atlassian-consulting'
/** Version C accent: the words after the split render in the accent colour. */
const ACCENT: Record<string, string> = {
  jira: 'Jira that developers tolerate *and leaders can read*',
  confluence: 'Confluence as a knowledge base, *not a document graveyard*',
  jsm: 'ITSM that resolves tickets *instead of routing them in circles*',
  migration: 'Leave Jira *without leaving your history behind*',
}
const SCOPE_NOTE =
  'Page-specific to /atlassian-consulting, not part of the partner page template. Carries the copy of the retired leaf page (PR #415, 5 Nov 2026), restored after the Version C rollout dropped it (Vadim, SEO, 12 Nov 2026). The old leaf URL 301s to this anchor.'

type Section = { _key: string; _type: string; anchor?: string; head?: { heading?: string }; items?: { _key: string; title?: string; href?: string }[] }

async function main() {
  const page = await client.fetch<{ sections: Section[] } | null>(`*[_id == $id][0]{ sections }`, { id: PAGE_ID })
  if (!page) throw new Error(`no ${PAGE_ID}`)
  const services = page.sections.find((s) => s._type === 'vcCards' && /Atlassian services/.test(s.head?.heading ?? ''))
  if (!services) throw new Error('"Our Atlassian services" cards not found')
  const have = new Set(page.sections.filter((s) => s._type === 'vcDeepDive').map((s) => s.anchor))

  const add = ATLASSIAN_DEEP_DIVES.filter((d) => !have.has(d.id)).map((d) => ({
    _type: 'vcDeepDive',
    _key: key(),
    scope: 'page',
    scopeNote: SCOPE_NOTE,
    anchor: d.id,
    // Alternate from the plain services section: alt, plain, alt, plain (the results cards after are alt).
    tone: ATLASSIAN_DEEP_DIVES.indexOf(d) % 2 === 0 ? 'alt' : 'plain',
    head: { _type: 'vcHead', badge: d.eyebrow, heading: ACCENT[d.id], lead: d.lead },
    stepsHeading: d.stepsHeading,
    steps: d.steps.map((s) => ({ _key: key(), _type: 'vcDeepDiveStep', title: s.title, body: s.body })),
    cardsHeading: d.cardsHeading,
    cards: d.cards.map((c) => ({ _key: key(), _type: 'vcDeepDiveCard', title: c.title, body: c.body })),
  }))
  for (const s of add) console.log(`add #${s.anchor}: ${s.head.heading} (${s.tone})`)

  const tx = client.transaction()
  if (add.length) {
    // After the services cards, or after the last deep dive already there.
    const last = [...page.sections].reverse().find((s) => s._type === 'vcDeepDive') ?? services
    tx.patch(client.patch(PAGE_ID).insert('after', `sections[_key=="${last._key}"]`, add))
  }

  // The four service cards jump to their deep dive (same order as ATLASSIAN_DEEP_DIVES).
  const p = client.patch(PAGE_ID)
  let linked = 0
  services.items?.slice(0, 4).forEach((it, i) => {
    const href = `/atlassian-consulting#${ATLASSIAN_DEEP_DIVES[i].id}`
    if (it.href === href) return
    p.set({ [`sections[_key=="${services._key}"].items[_key=="${it._key}"].href`]: href, [`sections[_key=="${services._key}"].items[_key=="${it._key}"].linkLabel`]: 'See how we run it' })
    console.log(`link card "${it.title}" -> ${href}`)
    linked++
  })
  if (linked) tx.patch(p)

  if (!add.length && !linked) return console.log('nothing to do')
  if (!APPLY) return console.log('\nDry run. Pass --apply to write.')
  const res = await tx.commit()
  console.log(`\ncommitted transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
