/**
 * /integrations: one "By tool." section instead of two (Edward, 13 Nov 2026).
 *
 * The page had a "Tools we integrate daily." logo marquee (vcToolkit) and, below it, a
 * "By tool." grid of eight cards with no links and no logos. The marquee's "WhatsApp, LINE
 * and Viber" tile only had a WhatsApp image (whatsapp.png, no logo shape, so it rendered at
 * 299px and spilled out of its box). This script:
 *
 *   1. removes the marquee section;
 *   2. switches "By tool." to the "tools" card layout (logo, name, line; the whole card links
 *      to the tool page; styles in scripts/vc/extras-integrations.css);
 *   3. gives every card its link (the old practice-page children, src/data/practicePages/
 *      integrations.ts) and its logo: the marquee's logos for Aircall, Twilio, Make, n8n and
 *      Zapier (keeping the Partners & badges link where the tile had one), and new square
 *      brand marks for WhatsApp, LINE and Viber, uploaded from the official Simple Icons paths
 *      already in src/components/common/icons/NavIcons.tsx, so the three messaging apps sit
 *      side by side with their own logos.
 *
 * Copy is unchanged (titles and lines are the cards' own). Writes a backup of the page first.
 *
 *   npx tsx scripts/vc/integrations-by-tool-2026-11.ts           # dry run: prints the new section
 *   npx tsx scripts/vc/integrations-by-tool-2026-11.ts --apply   # uploads the marks, patches the page
 *   npx tsx scripts/vc/integrations-by-tool-2026-11.ts --restore <backup.json>
 *   npx tsx scripts/vc/integrations-by-tool-2026-11.ts --preview   # writes the result to a throwaway
 *       vcPage-integrations-preview (path /integrations-preview, no route on the live site) to check
 *       locally before the layout code ships; delete that document afterwards
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { writeClient } from '../sanity-migrate/lib'

const PREVIEW = process.argv.includes('--preview')
const APPLY = process.argv.includes('--apply') || PREVIEW
const RESTORE = process.argv.includes('--restore') ? process.argv[process.argv.indexOf('--restore') + 1] : undefined
const PAGE_ID = 'vcPage-integrations'
const TOOLKIT_KEY = '8d26f3b1d5fb'
const CARDS_KEY = 'fd44a4549a42'

type Img = { _type: 'image'; asset: { _type: 'reference'; _ref: string } }
type Item = Record<string, unknown> & { _key: string; title?: string }
type Section = Record<string, unknown> & { _key: string; _type: string }

const img = (ref: string): Img => ({ _type: 'image', asset: { _type: 'reference', _ref: ref } })

/** Card title -> its tool page (the hub's old children links). */
const HREF: Record<string, string> = {
  Aircall: '/partnerships/aircall-partner',
  Twilio: '/integrations/twilio',
  Make: '/partnerships/make-partners',
  n8n: '/partnerships/n8n-integration-partner',
  Zapier: '/integrations/zapier',
  WhatsApp: '/integrations/whatsapp',
  LINE: '/integrations/line',
  Viber: '/integrations/viber',
}

/** Official brand colours for the three messaging marks. */
const MARKS: Record<string, { key: string; color: string }> = {
  WhatsApp: { key: 'whatsapp', color: '#25D366' },
  LINE: { key: 'line', color: '#06C755' },
  Viber: { key: 'viber', color: '#7360F2' },
}

function markSvg(key: string, color: string): string {
  const src = readFileSync(join(__dirname, '../../src/components/common/icons/NavIcons.tsx'), 'utf8')
  const m = src.match(new RegExp(`\\n  ${key}: \\(p\\) => \\(\\s*<svg \\{\\.\\.\\.brand\\(p\\)\\}>\\s*<path d="([^"]+)"`))
  if (!m) throw new Error(`No ${key} mark in NavIcons.tsx`)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="${color}" d="${m[1]}"/></svg>\n`
}

async function main() {
  const client = writeClient

  if (RESTORE) {
    const doc = JSON.parse(readFileSync(RESTORE, 'utf8'))
    await client.createOrReplace(doc)
    console.log(`Restored ${doc._id} from ${RESTORE}`)
    return
  }

  const page = await client.getDocument<Record<string, unknown> & { sections: Section[] }>(PAGE_ID)
  if (!page) throw new Error(`${PAGE_ID} not found`)
  const toolkit = page.sections.find((s) => s._key === TOOLKIT_KEY)
  const cards = page.sections.find((s) => s._key === CARDS_KEY)
  if (!cards) throw new Error('By tool section not found')

  // Logos from the marquee tiles, matched by name.
  const tiles = ((toolkit?.tiles as Item[] | undefined) ?? []).filter((t) => t.title)
  const tileFor = (title: string) => tiles.find((t) => t.title === title)

  // Upload (or, in a dry run, describe) the three messaging marks.
  const markRef: Record<string, string> = {}
  for (const [title, { key, color }] of Object.entries(MARKS)) {
    const svg = markSvg(key, color)
    if (APPLY) {
      const asset = await client.assets.upload('image', Buffer.from(svg), { filename: `${key}-mark.svg`, contentType: 'image/svg+xml' })
      markRef[title] = asset._id
    } else {
      markRef[title] = `(upload ${key}-mark.svg, ${svg.length} bytes)`
    }
  }

  const items = ((cards.items as Item[]) ?? []).map((it) => {
    const title = it.title ?? ''
    const href = HREF[title]
    if (!href) throw new Error(`No link for card "${title}"`)
    const { arrow: _arrow, ...rest } = it
    const tile = tileFor(title)
    const next: Item = { ...rest, href }
    if (MARKS[title]) {
      next.logo = img(markRef[title])
      next.logoShape = 'sq'
    } else if (tile?.logo) {
      next.logo = tile.logo
      next.logoShape = tile.logoShape ?? 'wm-img'
      if (tile.partner) {
        next.partner = tile.partner
        next.partnerImage = tile.partnerImage ?? 'logo'
      }
    } else {
      throw new Error(`No logo for card "${title}"`)
    }
    return next
  })

  const newCards: Section = { ...cards, layout: 'tools', items }
  const sections = page.sections.filter((s) => s._key !== TOOLKIT_KEY).map((s) => (s._key === CARDS_KEY ? newCards : s))

  console.log(JSON.stringify(newCards, null, 2))
  console.log(`\nSections: ${page.sections.length} -> ${sections.length} (${toolkit ? 'marquee removed' : 'marquee already gone'})`)
  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write.')
    return
  }

  if (PREVIEW) {
    await client.createOrReplace({ ...page, _id: `${PAGE_ID}-preview`, path: '/integrations-preview', sections })
    console.log(`\nWrote ${PAGE_ID}-preview (path /integrations-preview).`)
    return
  }
  const dir = join(__dirname, 'backups')
  mkdirSync(dir, { recursive: true })
  const backup = join(dir, `integrations-by-tool-${Date.now()}.json`)
  writeFileSync(backup, JSON.stringify(page, null, 2))
  await client.patch(PAGE_ID).set({ sections }).commit()
  console.log(`\nPatched ${PAGE_ID}. Backup: ${backup}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
