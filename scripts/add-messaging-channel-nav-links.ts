/**
 * Append the three messaging-channel links (WhatsApp, LINE, Viber) to the live
 * navigation's Partnerships › "Automation, Agents & Tools" column, without
 * rewriting the whole array — seed-nav-v2.ts would regenerate every _key and
 * clobber the incremental patches applied since the last full seed.
 *
 * Idempotent: an existing link with the same href is updated in place and keeps
 * its _key, so re-running changes nothing structurally.
 *
 *   npx tsx scripts/add-messaging-channel-nav-links.ts            # dry run
 *   npx tsx scripts/add-messaging-channel-nav-links.ts --apply    # write to Sanity
 *
 * The pages must be live before applying — the nav is served from Sanity to
 * production immediately, and /integrations/<slug> has no soft-404 shell to
 * hide a missing route behind.
 */
import { writeClient } from './sanity-migrate/lib'

const PARENT = 'Partnerships'
const SECTION = 'Automation, Agents & Tools'

const NEW_LINKS = [
  {
    _type: 'navLink',
    label: 'WhatsApp',
    href: '/integrations/whatsapp',
    icon: 'whatsapp',
    description: 'WhatsApp Business Platform into your CRM',
  },
  {
    _type: 'navLink',
    label: 'LINE',
    href: '/integrations/line',
    icon: 'line',
    description: 'LINE Official Account into your CRM',
  },
  {
    _type: 'navLink',
    label: 'Viber',
    href: '/integrations/viber',
    icon: 'viber',
    description: 'Viber Business Messages into your CRM',
  },
]

type NavLink = { _key?: string; href?: string; label?: string }
type NavSection = { _key?: string; heading?: string; items?: NavLink[] }
type NavItem = { _key?: string; label?: string; sections?: NavSection[] }

function withKey<T extends object>(obj: T): T & { _key: string } {
  return { ...obj, _key: Math.random().toString(36).slice(2, 12) }
}

async function main() {
  const apply = process.argv.includes('--apply')

  const settings = await writeClient.fetch<{ _id: string; navigation?: NavItem[] }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  if (!settings) throw new Error('siteSettings document not found')

  const navigation = settings.navigation ?? []
  const parent = navigation.find((i) => i.label === PARENT)
  if (!parent) throw new Error(`No nav item labelled "${PARENT}"`)

  const target = parent.sections?.find((s) => s.heading === SECTION)
  if (!target) {
    console.log('Sections under', PARENT, '→', parent.sections?.map((s) => s.heading))
    throw new Error(`No section headed "${SECTION}" under "${PARENT}"`)
  }

  const items = target.items ?? []
  const hrefs = new Set(NEW_LINKS.map((l) => l.href))
  const existingByHref = new Map(items.filter((i) => hrefs.has(i.href ?? '')).map((i) => [i.href, i]))

  // Keep everything else in order; re-add ours at the bottom of the column.
  const rest = items.filter((i) => !hrefs.has(i.href ?? ''))
  const channelItems = NEW_LINKS.map((l) => {
    const prev = existingByHref.get(l.href)
    return prev?._key ? { ...l, _key: prev._key } : withKey(l)
  })
  target.items = [...rest, ...channelItems]

  console.log(`\n${PARENT} › ${SECTION} (${target.items.length} links):`)
  target.items.forEach((l) => console.log(`  ${hrefs.has(l.href ?? '') ? '+' : ' '} ${l.label} → ${l.href}`))

  if (!apply) {
    console.log('\nDry run — nothing written. Re-run with --apply.')
    return
  }

  await writeClient.patch(settings._id).set({ navigation }).commit({ autoGenerateArrayKeys: true })
  console.log('\nNavigation updated. Edge cache turnover is staggered — sample repeatedly for a few minutes.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
