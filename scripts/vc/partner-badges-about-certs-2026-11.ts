/**
 * Partner badges on /about-us and /certifications-and-awards (13 Nov 2026).
 *
 *   npx tsx scripts/vc/partner-badges-about-certs-2026-11.ts          # dry run
 *   npx tsx scripts/vc/partner-badges-about-certs-2026-11.ts --apply  # backs up, then writes
 *
 * /about-us "A certified partner ecosystem" (vcToolkit):
 *   - Aircall tile shows the official Aircall Partners badge (the one on the
 *     Aircall page hero) instead of the wordmark.
 *   - Hootsuite tile shows the Hootsuite Solution Partner badge.
 *   - New ElevenLabs tile with the Eleven Agents Certified Partner badge, after HubSpot.
 * /certifications-and-awards directory: new Hootsuite tile after Aircall.
 *
 * Rollback: --restore <backup.json>
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from '../sanity-migrate/lib'

const AIRCALL_BADGE = 'image-ea4be7caa487639e94ca1f8bc9fd1924630325ef-480x349-png'
const HOOT_FILE = path.join(process.cwd(), 'public/images/partner-badges/hootsuite.webp')
const ELEVEN_FILE = path.join(process.cwd(), 'public/images/partner-badges/elevenlabs.svg')
const HOOT_HREF = '/partnerships/hootsuite-delivery-partner'
const BACKUP_DIR = path.join(process.cwd(), 'scripts/sanity-backups')
const img = (ref: string) => ({ _type: 'image', asset: { _type: 'reference', _ref: ref } })
const newKey = () => Math.random().toString(16).slice(2, 14)

async function main() {
  const args = process.argv.slice(2)
  const r = args.indexOf('--restore')
  if (r !== -1) {
    const snap = JSON.parse(fs.readFileSync(args[r + 1], 'utf8'))
    for (const d of snap) await writeClient.patch(d._id).set({ sections: d.sections }).commit()
    console.log('Restored', snap.map((d: { _id: string }) => d._id).join(', '))
    return
  }
  const apply = args.includes('--apply')
  const about = await writeClient.fetch<any>(`*[_id == "vcPage-about-us"][0]{ _id, _rev, sections }`)
  const certs = await writeClient.fetch<any>(`*[_id == "vcPage-certifications-and-awards"][0]{ _id, _rev, sections }`)
  if (!about || !certs) throw new Error('vcPage-about-us or vcPage-certifications-and-awards not found')
  const kit = about.sections.find((s: any) => s._type === 'vcToolkit' && /partner ecosystem/i.test(s.head?.heading ?? ''))
  const dir = certs.sections.find((s: any) => s._type === 'vcDirectory')
  if (!kit || !dir) throw new Error('Partner ecosystem toolkit or certifications directory not found')

  const aircall = kit.tiles.find((t: any) => /aircall/i.test(t.title))
  const hoot = kit.tiles.find((t: any) => /hootsuite/i.test(t.title))
  const hasEleven = kit.tiles.some((t: any) => /elevenlabs/i.test(t.title))
  const certHasHoot = dir.tiles.some((t: any) => t.href === HOOT_HREF)
  console.log(`About: Aircall tile ${aircall ? 'found' : 'MISSING'}, Hootsuite tile ${hoot ? 'found' : 'MISSING'}, ElevenLabs ${hasEleven ? 'already there' : 'to add'}`)
  console.log(`Certifications: Hootsuite tile ${certHasHoot ? 'already there' : 'to add after Aircall'}`)
  if (!apply) return console.log('\nDry run. Add --apply to write.')

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `partner-badges-about-certs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(file, JSON.stringify([{ _id: about._id, sections: about.sections }, { _id: certs._id, sections: certs.sections }], null, 2))
  console.log(`Backup: ${file}`)

  const hootAsset = await writeClient.assets.upload('image', fs.readFileSync(HOOT_FILE), {
    filename: 'hootsuite-solution-partner-badge.webp',
    contentType: 'image/webp',
  })
  const elevenAsset = await writeClient.assets.upload('image', fs.readFileSync(ELEVEN_FILE), {
    filename: 'elevenlabs-eleven-agents-certified-partner.svg',
    contentType: 'image/svg+xml',
  })

  const tiles = kit.tiles.map((t: any) => {
    if (t === aircall) return { ...t, logo: img(AIRCALL_BADGE), logoShape: 'hs' }
    if (t === hoot) return { ...t, title: 'Hootsuite Solution Partner', logo: img(hootAsset._id), logoShape: 'hs' }
    return t
  })
  if (!hasEleven) {
    const at = tiles.findIndex((t: any) => /hubspot/i.test(t.title))
    tiles.splice(at === -1 ? tiles.length : at + 1, 0, {
      _key: newKey(),
      _type: 'vcTool',
      body: '',
      title: 'ElevenLabs Certified Partner',
      logo: img(elevenAsset._id),
      logoShape: 'hs',
    })
  }
  await writeClient.patch(about._id).ifRevisionId(about._rev).set({ [`sections[_key=="${kit._key}"].tiles`]: tiles }).commit()
  console.log('About us partner ecosystem updated.')

  if (!certHasHoot) {
    const ct = [...dir.tiles]
    const at = ct.findIndex((t: any) => t.href === '/partnerships/aircall-partner')
    ct.splice(at === -1 ? ct.length : at + 1, 0, {
      _key: newKey(),
      _type: 'vcTile',
      body: 'Social media publishing, listening and reporting delivery.',
      groups: ['sup'],
      href: HOOT_HREF,
      logo: { ...img(hootAsset._id), alt: 'Hootsuite Solution Partner' },
      logoShape: 'sq',
      tag: 'Supporting ecosystem',
      title: 'Hootsuite',
    })
    await writeClient.patch(certs._id).ifRevisionId(certs._rev).set({ [`sections[_key=="${dir._key}"].tiles`]: ct }).commit()
    console.log('Certifications directory: Hootsuite tile added.')
  }
  console.log(`Rollback: npx tsx scripts/vc/partner-badges-about-certs-2026-11.ts --restore ${path.relative(process.cwd(), file)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
