/**
 * Write the v3 menu (src/data/nav-v3.ts) and footer (src/data/footer-v3.ts)
 * to Sanity siteSettings.
 *
 *   npx tsx scripts/seed-nav-v3.ts                  # dry run: prints the menu tree
 *   npx tsx scripts/seed-nav-v3.ts --check-urls     # dry run + checks every menu and footer href on the live site
 *   npx tsx scripts/seed-nav-v3.ts --apply-footer   # footer fields only (new fields: safe before the deploy)
 *   npx tsx scripts/seed-nav-v3.ts --apply          # backs up, then writes the menu and the footer
 *
 * DEPLOY ORDER: run --apply-footer, merge and deploy, then --check-urls and
 * --apply. The menu links to /partnerships, which only exists once this
 * branch is live; --check-urls fails until then.
 *
 * Rollback: npx tsx scripts/seed-nav-v3.ts --restore scripts/nav-backups/<file>.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'
import { NAV_V3, navV3Hrefs } from '../src/data/nav-v3'
import {
  FOOTER_V3_BADGES,
  FOOTER_V3_COLUMNS,
  FOOTER_V3_COPYRIGHT,
  FOOTER_V3_TAGLINE,
  footerV3Hrefs,
} from '../src/data/footer-v3'

const LIVE_ORIGIN = 'https://www.fruitionservices.io'
const BACKUP_DIR = path.join(__dirname, 'nav-backups')
const BACKED_UP_FIELDS = ['navigation', 'footerTagline', 'footerBadges', 'footerColumns', 'footerCopyrightText'] as const

function withKey<T extends object>(obj: T): T & { _key: string } {
  return { ...obj, _key: Math.random().toString(36).slice(2, 12) }
}

function toSanityNav() {
  return NAV_V3.map((item) =>
    withKey({
      _type: 'navItem',
      label: item.label,
      ...(item.href ? { href: item.href } : {}),
      ...(item.layout ? { layout: item.layout } : {}),
      sections: (item.sections ?? []).map((section) =>
        withKey({
          _type: 'navSection',
          heading: section.heading,
          ...(section.columns ? { columns: section.columns } : {}),
          items: section.items.map((link) =>
            withKey({
              _type: 'navLink',
              label: link.label,
              href: link.href,
              ...(link.description ? { description: link.description } : {}),
              ...(link.icon ? { icon: link.icon } : {}),
              ...(link.tier ? { tier: link.tier } : {}),
            }),
          ),
        }),
      ),
      ...(item.footerNote ? { footerNote: item.footerNote } : {}),
      ...(item.footerLinks?.length
        ? { footerLinks: item.footerLinks.map((l) => withKey({ _type: 'navFooterLink', ...l })) }
        : {}),
      ...(item.feature ? { feature: item.feature } : {}),
    }),
  )
}

function toSanityFooter() {
  return {
    footerTagline: FOOTER_V3_TAGLINE,
    footerBadges: FOOTER_V3_BADGES,
    footerCopyrightText: FOOTER_V3_COPYRIGHT,
    footerColumns: FOOTER_V3_COLUMNS.map((col) =>
      withKey({
        _type: 'footerColumn',
        heading: col.heading,
        links: col.links.map((l) => withKey({ _type: 'footerColumnLink', ...l })),
      }),
    ),
  }
}

function printTree() {
  for (const item of NAV_V3) {
    if (item.href && !item.sections?.length) {
      console.log(`\n${item.label}  → ${item.href}  (direct link)`)
      continue
    }
    console.log(`\n${item.label}  [${item.layout ?? 'stacked'}]`)
    for (const s of item.sections ?? []) {
      console.log(`  ${s.heading}${s.columns ? `  (cols:${s.columns})` : ''}`)
      for (const l of s.items) console.log(`    ${l.label}${l.tier ? ` [${l.tier}]` : ''} -> ${l.href}`)
    }
    for (const l of item.footerLinks ?? []) console.log(`  ▸ ${l.label} -> ${l.href}`)
    if (item.feature) console.log(`  ❝ ${item.feature.attribution} -> ${item.feature.href}`)
  }
  console.log('\nFooter')
  for (const c of FOOTER_V3_COLUMNS) console.log(`  ${c.heading}: ${c.links.length} links`)
}

async function checkUrls() {
  const hrefs = [...new Set([...navV3Hrefs(), ...footerV3Hrefs()].map((h) => h.split('#')[0]))]
  console.log(`\nChecking ${hrefs.length} unique hrefs against ${LIVE_ORIGIN} …`)
  let failures = 0
  for (const href of hrefs) {
    const res = await fetch(`${LIVE_ORIGIN}${href}`, { method: 'GET', redirect: 'manual' })
    // A redirect means the link isn't to the real page (e.g. /partnerships before deploy).
    const ok = res.status === 200
    if (!ok) failures++
    console.log(`  ${ok ? 'OK ' : 'FAIL'} ${res.status}  ${href}${res.headers.get('location') ? ` → ${res.headers.get('location')}` : ''}`)
  }
  if (failures) throw new Error(`${failures} href(s) are not a 200 on the live site; fix before applying.`)
  console.log('All hrefs return 200. ✔')
}

async function backup() {
  const settings = await writeClient.fetch<Record<string, unknown> & { _id: string }>(
    `*[_type == "siteSettings"][0]{ _id, ${BACKED_UP_FIELDS.join(', ')} }`,
  )
  if (!settings) throw new Error('siteSettings document not found')
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `nav-v3-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  const snapshot = Object.fromEntries(BACKED_UP_FIELDS.map((f) => [f, settings[f] ?? null]))
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2))
  console.log(`\nBacked up ${BACKED_UP_FIELDS.join(', ')} → ${file}`)
  return { id: settings._id, file }
}

async function restore(file: string) {
  const snapshot = JSON.parse(fs.readFileSync(file, 'utf8'))
  const settings = await writeClient.fetch<{ _id: string }>(`*[_type == "siteSettings"][0]{ _id }`)
  if (!settings) throw new Error('siteSettings document not found')
  // Old nav-v2 backups are a bare navigation array.
  const fields: Record<string, unknown> = Array.isArray(snapshot) ? { navigation: snapshot } : snapshot
  const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== null))
  const unset = Object.entries(fields).filter(([, v]) => v === null).map(([k]) => k)
  await writeClient.patch(settings._id).set(set).unset(unset).commit()
  console.log(`Restored ${Object.keys(fields).join(', ')} from ${file}`)
}

async function main() {
  const args = process.argv.slice(2)
  const restoreIdx = args.indexOf('--restore')
  if (restoreIdx !== -1) {
    const file = args[restoreIdx + 1]
    if (!file) throw new Error('Usage: --restore <backup.json>')
    return restore(file)
  }

  printTree()
  if (args.includes('--check-urls')) await checkUrls()

  const applyAll = args.includes('--apply')
  const applyFooter = args.includes('--apply-footer')
  if (!applyAll && !applyFooter) {
    console.log('\nDry run — nothing written. --apply-footer writes the footer; --apply writes menu + footer (production dataset, live within ~2 min).')
    return
  }

  const { id, file } = await backup()
  const patch = applyAll ? { navigation: toSanityNav(), ...toSanityFooter() } : toSanityFooter()
  await writeClient.patch(id).set(patch).commit()
  console.log(`Wrote ${Object.keys(patch).join(', ')}. ✔`)
  console.log(`Rollback: npx tsx scripts/seed-nav-v3.ts --restore ${path.relative(process.cwd(), file)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
