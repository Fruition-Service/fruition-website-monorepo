/**
 * /contact-us (13 Nov 2026, Edward):
 *   - The "Reach the team directly" details (email, phone, LinkedIn, social icons) move into the
 *     hero, under the copy and beside the message form. The ISO / SOC 2 / GDPR / HIPAA marks that
 *     sat under the accreditation tiles come along as the last row.
 *   - The contact channels section (with its "Accreditations" tiles and "All certifications" link)
 *     is replaced by the "A certified partner ecosystem" marquee from /about-us, as a page-specific
 *     section (`pagespecific-contact-partner-ecosystem`). Its tiles reference the same partner
 *     records, so badge changes reach both pages.
 *
 *   npx tsx scripts/vc/contact-hero-partner-ecosystem-2026-11.ts            # dry run
 *   npx tsx scripts/vc/contact-hero-partner-ecosystem-2026-11.ts --apply    # backs up, then writes
 *   npx tsx scripts/vc/contact-hero-partner-ecosystem-2026-11.ts --preview  # writes the result to
 *       vcPage-zz-contact-preview (path /zz-contact-preview) for a local check; --preview --remove deletes it
 *
 * Rollback: --restore <backup.json>
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from '../sanity-migrate/lib'

const KEY = 'pagespecific-contact-partner-ecosystem'
const PREVIEW_ID = 'vcPage-zz-contact-preview'
const BACKUP_DIR = path.join(process.cwd(), 'scripts/sanity-backups')
const newKey = () => Math.random().toString(16).slice(2, 14)
const plain = (s?: string) => (s ?? '').replace(/\*/g, '').trim()

async function main() {
  const args = process.argv.slice(2)
  const r = args.indexOf('--restore')
  if (r !== -1) {
    const snap = JSON.parse(fs.readFileSync(args[r + 1], 'utf8'))
    await writeClient.patch(snap._id).set({ sections: snap.sections }).commit()
    console.log('Restored', snap._id)
    return
  }
  if (args.includes('--preview') && args.includes('--remove')) {
    await writeClient.delete(PREVIEW_ID)
    console.log('Deleted', PREVIEW_ID)
    return
  }

  const contact = await writeClient.fetch<any>(`*[_id == "vcPage-contact-us"][0]`)
  const about = await writeClient.fetch<any>(`*[_id == "vcPage-about-us"][0]{ sections }`)
  if (!contact || !about) throw new Error('vcPage-contact-us or vcPage-about-us not found')
  if (contact.sections.some((s: any) => s._key === KEY)) return console.log('Already applied: the partner ecosystem section is on /contact-us.')

  const heroIdx = contact.sections.findIndex((s: any) => s._type === 'vcHero')
  const chanIdx = contact.sections.findIndex((s: any) => s._type === 'vcChannels')
  const kit = about.sections.find((s: any) => s._type === 'vcToolkit' && /partner ecosystem/i.test(s.head?.heading ?? ''))
  if (heroIdx === -1 || chanIdx === -1 || !kit) throw new Error('Contact hero, contact channels or the about-us partner ecosystem section not found')
  const chan = contact.sections[chanIdx]

  const hero = {
    ...contact.sections[heroIdx],
    contactLabel: plain(chan.heading) || 'Reach the team directly',
    contactRows: chan.rows ?? [],
    followLabel: chan.followLabel,
    socials: chan.socials ?? [],
    securityLabel: 'Security & compliance',
    security: chan.security ?? [],
  }
  const ecosystem = {
    ...kit,
    _key: KEY,
    tone: 'alt',
    pageSpecific: true,
    pageSpecificNote:
      'Copy of the /about-us "A certified partner ecosystem" marquee, added 13 Nov 2026 at Edward\'s request in place of the contact channels section (its details moved into the hero). Tiles reference the shared partner records. Script: scripts/vc/contact-hero-partner-ecosystem-2026-11.ts',
    tiles: (kit.tiles ?? []).map((t: any) => ({ ...t, _key: newKey() })),
  }
  const sections = [...contact.sections]
  sections[heroIdx] = hero
  sections[chanIdx] = ecosystem

  console.log(`Hero gets ${hero.contactRows.length} contact rows, ${hero.socials.length} social links, ${hero.security.length} compliance badges.`)
  console.log(`Section ${chanIdx + 1} "${plain(chan.heading)}" (${chan.tiles?.length ?? 0} accreditation tiles) becomes "${plain(kit.head?.heading)}" (${ecosystem.tiles.length} tiles).`)
  console.log('Order after:', sections.map((s: any) => s._type).join(' > '))

  if (args.includes('--preview')) {
    const { _rev, _createdAt, _updatedAt, ...rest } = contact
    void _rev; void _createdAt; void _updatedAt
    await writeClient.createOrReplace({ ...rest, _id: PREVIEW_ID, path: '/zz-contact-preview', sections })
    return console.log(`Preview written to ${PREVIEW_ID}. Remove with --preview --remove.`)
  }
  if (!args.includes('--apply')) return console.log('\nDry run. Add --apply to write.')

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `contact-hero-partner-ecosystem-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(file, JSON.stringify({ _id: contact._id, sections: contact.sections }, null, 2))
  console.log(`Backup: ${file}`)
  await writeClient.patch(contact._id).ifRevisionId(contact._rev).set({ sections }).commit()
  console.log('Applied to vcPage-contact-us.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
