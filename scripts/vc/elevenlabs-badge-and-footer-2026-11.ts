/**
 * ElevenLabs partnership + footer links (13 Nov 2026).
 *
 *   npx tsx scripts/vc/elevenlabs-badge-and-footer-2026-11.ts          # dry run
 *   npx tsx scripts/vc/elevenlabs-badge-and-footer-2026-11.ts --apply  # backs up, then writes
 *
 * 1. /partnerships directory: the ElevenLabs tile moves from "Also delivered"
 *    to the core AI platforms, right after Anthropic Claude, with the Eleven
 *    Agents Certified Partner badge as its mark. The head's "Six platforms"
 *    becomes "Seven platforms" to match.
 * 2. Every Version C page with a partner badge row (vcLogos, vcHero creds,
 *    vcChannels, the home page's markup row) gets the ElevenLabs badge right
 *    after the OpenAI Select Partner badge, and the /certifications-and-awards
 *    directory gets an ElevenLabs tile after OpenAI. The OpenAI page itself is
 *    skipped (its row is OpenAI's own badge).
 * 3. Footer "Platforms" column: adds Grok Bot and Meta Muse after Vapi (they
 *    left the menu for the footer; Gemini, OpenClaw and Vapi are already there).
 *
 * Rollback: npx tsx scripts/vc/elevenlabs-badge-and-footer-2026-11.ts --restore <backup.json>
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from '../sanity-migrate/lib'

const BADGE_ALT = 'ElevenLabs Eleven Agents Certified Partner'
const OPENAI_ALT = /OpenAI Select Partner/i
const SKIP_DOCS = new Set(['vcPage-openai-chatgpt-partner'])
const altOf = (x: Record<string, any>) => (x?.alt || x?.image?.alt || '') as string
const newKey = () => Math.random().toString(16).slice(2, 14)

/** Insert the badge after every OpenAI badge in any array of the doc; returns how many. */
function addBadgeRows(node: any, assetId: string): number {
  let n = 0
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const item = node[i]
      if (item && typeof item === 'object' && OPENAI_ALT.test(altOf(item)) && !node.some((x: any) => altOf(x) === BADGE_ALT)) {
        const aws = node.find((x: any) => /AWS/.test(altOf(x)))
        const ref = { _type: 'reference', _ref: assetId }
        const clone =
          item._type === 'vcNode'
            ? { _key: newKey(), _type: 'vcNode', tag: 'img', style: aws?.style || 'height:56px', image: { _type: 'image', alt: BADGE_ALT, asset: ref } }
            : { _key: newKey(), _type: item._type, alt: BADGE_ALT, image: { _type: 'image', asset: ref }, shape: 'sq' }
        node.splice(i + 1, 0, clone)
        n++
        i++
      }
      n += addBadgeRows(node[i], assetId)
    }
  } else if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) n += addBadgeRows(node[k], assetId)
  }
  return n
}

const BADGE = path.join(process.cwd(), 'public/images/partner-badges/elevenlabs.svg')
const BACKUP_DIR = path.join(process.cwd(), 'scripts/sanity-backups')
const ELEVEN_HREF = '/partnerships/elevenlabs-partner'
const AFTER_HREF = '/partnerships/anthropic-claude-partner'
const FOOTER_ADD = [
  { label: 'Grok Bot', href: '/partnerships/grok-bot-partner' },
  { label: 'Meta Muse', href: '/partnerships/meta-muse-partner' },
]

type Tile = { _key: string; href?: string; groups?: string[]; tag?: string; logo?: unknown; logoShape?: string; title?: string }
type Section = { _key: string; _type: string; tiles?: Tile[]; head?: { lead?: string } }
type FooterLink = { _key: string; _type?: string; label?: string; href?: string }
type FooterColumn = { _key: string; heading?: string; links?: FooterLink[] }

async function main() {
  const args = process.argv.slice(2)
  const restoreAt = args.indexOf('--restore')
  if (restoreAt !== -1) {
    const snap = JSON.parse(fs.readFileSync(args[restoreAt + 1], 'utf8'))
    await writeClient.patch('vcPage-partnerships').set({ sections: snap.sections }).commit()
    await writeClient.patch(snap.settingsId).set({ footerColumns: snap.footerColumns }).commit()
    for (const d of snap.pages ?? []) await writeClient.patch(d._id).set({ sections: d.sections }).commit()
    console.log('Restored /partnerships sections and footerColumns.')
    return
  }
  const apply = args.includes('--apply')

  const page = await writeClient.fetch<{ sections: Section[] }>(`*[_id == "vcPage-partnerships"][0]{ sections }`)
  const settings = await writeClient.fetch<{ _id: string; footerColumns: FooterColumn[] }>(
    `*[_type == "siteSettings"][0]{ _id, footerColumns }`,
  )
  if (!page || !settings) throw new Error('vcPage-partnerships or siteSettings not found')

  const dir = page.sections.find((s) => s._type === 'vcDirectory')
  if (!dir?.tiles) throw new Error('No vcDirectory on /partnerships')
  const eleven = dir.tiles.find((t) => t.href === ELEVEN_HREF)
  if (!eleven) throw new Error('No ElevenLabs tile')

  const col = settings.footerColumns.find((c) => c.heading === 'Platforms')
  // The footer is now rewritten whole by `seed-nav-vc.ts --footer-only`; this
  // step only runs while the old "Platforms" column is still live.
  const missing = col?.links ? FOOTER_ADD.filter((l) => !col.links!.some((x) => x.href === l.href)) : []
  const vapiAt = col?.links ? col.links.findIndex((l) => l.href === '/partnerships/vapi-partner') : -1

  console.log(`ElevenLabs tile: "${eleven.tag}" ${JSON.stringify(eleven.groups)} -> "AI PLATFORM · CERTIFIED PARTNER" ["ai","ai-platform","core"], after Anthropic Claude`)
  console.log(`Directory lead: "${dir.head?.lead}"`)
  console.log(`Footer Platforms: adding ${missing.map((l) => l.label).join(', ') || 'nothing'} after Vapi (index ${vapiAt})`)
  const pages = await writeClient.fetch<Record<string, any>[]>(`*[_type == "vcPage" && !(_id in path("drafts.**"))]`)
  const badgePlan = pages
    .filter((d) => !SKIP_DOCS.has(d._id))
    .map((d) => ({ id: d._id as string, rev: d._rev as string, sections: structuredClone(d.sections), n: 0 }))
    .map((d) => ({ ...d, n: addBadgeRows(d.sections, 'PENDING') }))
    .filter((d) => d.n > 0)
  for (const d of badgePlan) console.log(`Badge row: ${d.id} (+${d.n})`)
  const certs = pages.find((d) => d._id === 'vcPage-certifications-and-awards')
  const certDir = certs?.sections?.find((s: any) => s._type === 'vcDirectory')
  const certHas = certDir?.tiles?.some((t: any) => t.href === ELEVEN_HREF)
  console.log(`Certifications directory: ${certHas ? 'already has ElevenLabs' : 'adding an ElevenLabs tile after OpenAI'}`)

  if (!apply) {
    console.log('\nDry run. Add --apply to write.')
    return
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `elevenlabs-badge-footer-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        sections: page.sections,
        settingsId: settings._id,
        footerColumns: settings.footerColumns,
        pages: pages.filter((d) => badgePlan.some((b) => b.id === d._id) || d._id === 'vcPage-certifications-and-awards').map((d) => ({ _id: d._id, sections: d.sections })),
      },
      null,
      2,
    ),
  )
  console.log(`Backup: ${file}`)

  const asset = await writeClient.assets.upload('image', fs.readFileSync(BADGE), {
    filename: 'elevenlabs-eleven-agents-certified-partner.svg',
    contentType: 'image/svg+xml',
  })
  const nextTile: Tile = {
    ...eleven,
    groups: ['ai', 'ai-platform', 'core'],
    tag: 'AI PLATFORM · CERTIFIED PARTNER',
    logoShape: 'sq',
    logo: { _type: 'image', alt: BADGE_ALT, asset: { _type: 'reference', _ref: asset._id } },
  }
  const rest = dir.tiles.filter((t) => t._key !== eleven._key)
  const at = rest.findIndex((t) => t.href === AFTER_HREF)
  rest.splice(at === -1 ? 0 : at + 1, 0, nextTile)

  const lead = dir.head?.lead?.replace(/^Six platforms/, 'Seven platforms')
  let p = writeClient.patch('vcPage-partnerships').set({ [`sections[_key=="${dir._key}"].tiles`]: rest })
  if (lead && lead !== dir.head?.lead) p = p.set({ [`sections[_key=="${dir._key}"].head.lead`]: lead })
  await p.commit()

  // Badge rows on every other page, from fresh copies so the swapped asset id is right.
  for (const b of badgePlan) {
    const fresh = pages.find((d) => d._id === b.id)!
    const sections = structuredClone(fresh.sections)
    addBadgeRows(sections, asset._id)
    await writeClient.patch(b.id).ifRevisionId(b.rev).set({ sections }).commit()
    console.log(`  badge added on ${b.id}`)
  }
  if (certDir && !certHas) {
    const tiles = [...certDir.tiles]
    const at2 = tiles.findIndex((t: any) => t.href === '/partnerships/openai-chatgpt-partner')
    tiles.splice(at2 === -1 ? tiles.length : at2 + 1, 0, {
      _key: newKey(),
      _type: 'vcTile',
      body: 'Eleven Agents voice and conversational AI delivery.',
      groups: ['ai'],
      href: ELEVEN_HREF,
      logo: { _type: 'image', alt: BADGE_ALT, asset: { _type: 'reference', _ref: asset._id } },
      logoShape: 'sq',
      tag: 'AI platforms',
      title: 'ElevenLabs',
    })
    await writeClient.patch('vcPage-certifications-and-awards').set({ [`sections[_key=="${certDir._key}"].tiles`]: tiles }).commit()
    console.log('  ElevenLabs tile added on /certifications-and-awards')
  }

  if (col?.links && missing.length) {
    const links = [...col.links]
    links.splice(vapiAt === -1 ? links.length : vapiAt + 1, 0, ...missing.map((l, i) => ({
      _type: 'footerColumnLink',
      _key: `${l.href.split('/').pop()}-${Date.now()}-${i}`,
      ...l,
    })))
    await writeClient.patch(settings._id).set({ [`footerColumns[_key=="${col._key}"].links`]: links }).commit()
  }
  console.log('Done.')
  console.log(`Rollback: npx tsx scripts/vc/elevenlabs-badge-and-footer-2026-11.ts --restore ${path.relative(process.cwd(), file)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
