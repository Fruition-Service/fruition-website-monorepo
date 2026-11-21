/**
 * Add Ask Fruit to the live nav: featured under Services → "Solutions by Team"
 * (after Solutions Catalog) and plain under Insights → "Content".
 *
 *   npx tsx scripts/add-ask-fruit-nav-link.ts          # dry run
 *   npx tsx scripts/add-ask-fruit-nav-link.ts --apply  # backs up, then writes
 *
 * Idempotent: a section that already links /ask-fruit is left alone.
 * Rollback: npx tsx scripts/seed-nav-v2.ts --restore scripts/nav-backups/<file>.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'

const HREF = '/ask-fruit'

type NavLink = { _key: string; _type: string; label: string; href: string; [k: string]: unknown }
type NavSection = { heading?: string; items?: NavLink[] }
type NavItem = { label?: string; sections?: NavSection[] }

const key = () => Math.random().toString(36).slice(2, 12)

const TARGETS = [
  {
    heading: 'Solutions by Team',
    after: '/monday-consulting-solutions/catalog',
    link: {
      label: 'Ask Fruit',
      description: 'AI assistant that matches your needs to a solution',
      icon: 'sparkle',
      featured: true,
    },
  },
  {
    heading: 'Content',
    after: '/monday-consulting-solutions/catalog',
    link: { label: 'Ask Fruit', icon: 'sparkle' },
  },
]

async function main() {
  const apply = process.argv.includes('--apply')
  const settings = await writeClient.fetch<{ _id: string; navigation: NavItem[] }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  if (!settings?.navigation) throw new Error('siteSettings.navigation not found')
  const navigation = settings.navigation
  const sections = navigation.flatMap((item) => item.sections ?? [])

  let changed = 0
  for (const target of TARGETS) {
    const section = sections.find((s) => s.heading === target.heading)
    if (!section) throw new Error(`No nav section "${target.heading}"`)
    const items = section.items ?? []
    if (items.some((it) => it.href === HREF)) {
      console.log(`"${target.heading}" already links ${HREF}`)
      continue
    }
    const at = items.findIndex((it) => it.href === target.after)
    items.splice(at === -1 ? items.length : at + 1, 0, {
      _key: key(),
      _type: 'navLink',
      href: HREF,
      ...target.link,
    })
    section.items = items
    changed++
    console.log(`+ "${target.link.label}" in "${target.heading}" at position ${at === -1 ? items.length : at + 2}`)
  }

  if (!changed) return console.log('No changes.')
  if (!apply) return console.log('Dry run. Re-run with --apply to write.')

  const backup = path.join(__dirname, 'nav-backups', `nav-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  const current = await writeClient.fetch(`*[_type == "siteSettings"][0].navigation`)
  fs.writeFileSync(backup, JSON.stringify(current, null, 2))
  console.log(`Backup: ${path.relative(process.cwd(), backup)}`)

  await writeClient.patch(settings._id).set({ navigation }).commit()
  console.log('Applied.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
