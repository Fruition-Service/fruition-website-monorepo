/**
 * Write the Version C menu (src/data/nav-vc.ts), footer (src/data/footer-vc.ts),
 * social icons and banner link to Sanity siteSettings.
 *
 *   npx tsx scripts/seed-nav-vc.ts                       # dry run: prints the menu tree and checks the icon files
 *   npx tsx scripts/seed-nav-vc.ts --check-urls          # dry run + checks every menu and footer href on the live site
 *   npx tsx scripts/seed-nav-vc.ts --preview-file f.json # uploads the icons, writes the patch to f.json, changes no document
 *   npx tsx scripts/seed-nav-vc.ts --backup              # only saves the current values to scripts/nav-backups/ (commit it with the PR)
 *   npx tsx scripts/seed-nav-vc.ts --apply               # backs up, then writes menu, footer, socials and banner link
 *   npx tsx scripts/seed-nav-vc.ts --only Pricing --apply  # backs up, then replaces only that tab in the live menu
 *                                                         # (also works with --preview-file); every other tab and the footer stay as editors left them
 *
 * Fields written: navigation, footerTagline, footerBadges, footerColumns,
 * footerCopyrightText, socialLinks, announcementHref. The banner text and the
 * button labels (navbarCtaLabel, footerCtaLabel) are left as they are.
 *
 * Icons are the SVG files in scripts/nav-icons/, uploaded as Sanity image
 * assets and referenced from each menu link's `logo` and each social link's
 * `icon`. Sanity de-duplicates uploads by content, so re-running adds nothing.
 *
 * Rollback (no deploy needed for the data; revert the PR for the code):
 *   npx tsx scripts/seed-nav-vc.ts --restore scripts/nav-backups/<file>.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'
import { NAV_VC, navVcHrefs, navVcIconKeys, type NavVcItem } from '../src/data/nav-vc'
import {
  FOOTER_VC_BADGES,
  FOOTER_VC_COLUMNS,
  FOOTER_VC_COPYRIGHT,
  FOOTER_VC_SOCIALS,
  FOOTER_VC_TAGLINE,
  footerVcHrefs,
} from '../src/data/footer-vc'

const LIVE_ORIGIN = 'https://www.fruitionservices.io'
const ICON_DIR = path.join(__dirname, 'nav-icons')
const BACKUP_DIR = path.join(__dirname, 'nav-backups')
const BACKED_UP_FIELDS = [
  'navigation',
  'footerTagline',
  'footerBadges',
  'footerColumns',
  'footerCopyrightText',
  'socialLinks',
  'announcementHref',
] as const
const ANNOUNCEMENT_HREF = '/post/fruition-claude-partner-network-certification'

const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type ImageRef = { _type: 'image'; asset: { _type: 'reference'; _ref: string } }

function iconFile(key: string): string {
  const file = path.join(ICON_DIR, `${key}.svg`)
  if (!fs.existsSync(file)) throw new Error(`Missing icon file ${file}`)
  return file
}

/** Upload every icon the menu and socials use; returns key -> image reference. */
async function uploadIcons(): Promise<Record<string, ImageRef>> {
  const keys = [...new Set([...navVcIconKeys(), ...FOOTER_VC_SOCIALS.map((s) => s.icon)])]
  const refs: Record<string, ImageRef> = {}
  for (const key of keys) {
    const asset = await writeClient.assets.upload('image', fs.readFileSync(iconFile(key)), {
      filename: `${key}.svg`,
      contentType: 'image/svg+xml',
    })
    refs[key] = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  }
  console.log(`Uploaded ${keys.length} icons (Sanity reuses any it already has).`)
  return refs
}

const assetImage = (id: string): ImageRef => ({ _type: 'image', asset: { _type: 'reference', _ref: id } })

function toSanityFeature(f: NonNullable<NavVcItem['feature']>) {
  return {
    kicker: f.kicker,
    quote: f.quote,
    plain: true,
    ...(f.attribution ? { attribution: f.attribution } : {}),
    ...(f.logoAsset ? { logo: assetImage(f.logoAsset) } : {}),
    ...(f.imageAsset ? { image: assetImage(f.imageAsset) } : {}),
    ...(f.metrics?.length
      ? { metrics: f.metrics.map((m, k) => ({ _type: 'navFeatureMetric', _key: `metric-${k}`, value: m.value, label: m.label })) }
      : {}),
    label: f.label,
    href: f.href,
  }
}

function toSanityNav(refs: Record<string, ImageRef>) {
  return NAV_VC.map((item: NavVcItem, i) => ({
    _type: 'navItem',
    _key: `${slug(item.label)}-${i}`,
    label: item.label,
    ...(item.href ? { href: item.href } : {}),
    ...(item.sections?.length ? { layout: 'columns' } : {}),
    ...(item.sections?.length
      ? {
          sections: item.sections.map((section, s) => ({
            _type: 'navSection',
            _key: `${slug(section.heading)}-${s}`,
            heading: section.heading,
            columns: section.columns,
            grow: section.grow,
            items: section.items.map((link, l) => ({
              _type: 'navLink',
              _key: `${slug(link.label)}-${l}`,
              label: link.label,
              href: link.href,
              description: link.description,
              ...(link.tier ? { tier: link.tier } : {}),
              logo: refs[link.icon],
            })),
          })),
        }
      : {}),
    ...(item.note ? { footerNote: item.note } : {}),
    ...(item.footerLinks?.length
      ? {
          footerLinks: item.footerLinks.map((l, k) => ({
            _type: 'navFooterLink',
            _key: `${slug(l.label)}-${k}`,
            label: l.label,
            href: l.href,
          })),
        }
      : {}),
    ...(item.feature
      ? {
          feature: toSanityFeature(item.feature),
        }
      : {}),
  }))
}

function toSanityFooter(refs: Record<string, ImageRef>) {
  return {
    footerTagline: FOOTER_VC_TAGLINE,
    footerBadges: FOOTER_VC_BADGES,
    footerCopyrightText: FOOTER_VC_COPYRIGHT,
    footerColumns: FOOTER_VC_COLUMNS.map((col, i) => ({
      _type: 'footerColumn',
      _key: `${slug(col.heading)}-${i}`,
      heading: col.heading,
      links: col.links.map((l, j) => ({
        _type: 'footerColumnLink',
        _key: `${slug(l.label)}-${j}`,
        label: l.label,
        href: l.href,
      })),
    })),
    socialLinks: FOOTER_VC_SOCIALS.map((s, i) => ({
      _type: 'socialLink',
      _key: `${slug(s.label)}-${i}`,
      label: s.label,
      href: s.href,
      row: s.row,
      icon: refs[s.icon],
    })),
  }
}

function buildPatch(refs: Record<string, ImageRef>) {
  return { navigation: toSanityNav(refs), ...toSanityFooter(refs), announcementHref: ANNOUNCEMENT_HREF }
}

function printTree() {
  for (const item of NAV_VC) {
    if (item.href && !item.sections?.length) {
      console.log(`\n${item.label}  -> ${item.href}  (direct link)`)
      continue
    }
    console.log(`\n${item.label}`)
    for (const s of item.sections ?? []) {
      console.log(`  ${s.heading}  (cols:${s.columns} grow:${s.grow})`)
      for (const l of s.items) console.log(`    ${l.label}${l.tier ? ` [${l.tier}]` : ''} -> ${l.href}   (${l.icon}.svg)`)
    }
    for (const l of item.footerLinks ?? []) console.log(`  > ${l.label} -> ${l.href}`)
    if (item.feature) console.log(`  feature: ${item.feature.kicker} -> ${item.feature.href}`)
  }
  console.log('\nFooter')
  for (const c of FOOTER_VC_COLUMNS) console.log(`  ${c.heading}: ${c.links.length} links`)
  console.log(`  socials: ${FOOTER_VC_SOCIALS.map((s) => s.label).join(', ')}`)
}

function checkIconFiles() {
  const keys = [...new Set([...navVcIconKeys(), ...FOOTER_VC_SOCIALS.map((s) => s.icon)])]
  for (const key of keys) iconFile(key)
  console.log(`\n${keys.length} icon files present in scripts/nav-icons/.`)
}

async function checkUrls() {
  const hrefs = [...new Set([...navVcHrefs(), ...footerVcHrefs()].map((h) => h.split('#')[0]))]
  console.log(`\nChecking ${hrefs.length} unique hrefs against ${LIVE_ORIGIN} ...`)
  let failures = 0
  for (const href of hrefs) {
    const res = await fetch(`${LIVE_ORIGIN}${href}`, { method: 'GET', redirect: 'manual' })
    const ok = res.status === 200
    if (!ok) failures++
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${res.status}  ${href}${res.headers.get('location') ? ` -> ${res.headers.get('location')}` : ''}`)
  }
  if (failures) throw new Error(`${failures} href(s) are not a 200 on the live site; fix before applying.`)
  console.log('All hrefs return 200.')
}

async function backup() {
  const settings = await writeClient.fetch<Record<string, unknown> & { _id: string }>(
    `*[_type == "siteSettings"][0]{ _id, ${BACKED_UP_FIELDS.join(', ')} }`,
  )
  if (!settings) throw new Error('siteSettings document not found')
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `nav-vc-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  const snapshot = Object.fromEntries(BACKED_UP_FIELDS.map((f) => [f, settings[f] ?? null]))
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2))
  console.log(`\nBacked up ${BACKED_UP_FIELDS.join(', ')} -> ${file}`)
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

/**
 * Swap one tab of the live menu for its seed version, keeping the live tab's
 * _key and position. Everything else in siteSettings is left untouched.
 */
async function replaceTab(label: string, previewFile: string | null, apply: boolean) {
  const live = await writeClient.fetch<{ _id: string; navigation?: { _key: string; label?: string }[] }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  const current = live?.navigation?.find((i) => i.label === label)
  if (!live || !current) throw new Error(`No live tab labelled "${label}"`)
  const refs = await uploadIcons()
  const seeded = toSanityNav(refs).find((i) => i.label === label)
  if (!seeded) throw new Error(`No seed tab labelled "${label}" in src/data/nav-vc.ts`)
  const next = { ...seeded, _key: current._key }
  if (previewFile) {
    const navigation = live.navigation!.map((i) => (i._key === current._key ? next : i))
    fs.writeFileSync(previewFile, JSON.stringify({ navigation }, null, 2))
    console.log(`Wrote a preview with the new "${label}" tab to ${previewFile}.`)
    return
  }
  if (!apply) {
    console.log(`\nDry run: would replace the live "${label}" tab (${current._key}). Add --apply to write it.`)
    return
  }
  const { file } = await backup()
  await writeClient.patch(live._id).set({ [`navigation[_key=="${current._key}"]`]: next }).commit()
  console.log(`Replaced the "${label}" tab.`)
  console.log(`Rollback: npx tsx scripts/seed-nav-vc.ts --restore ${path.relative(process.cwd(), file)}`)
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
  checkIconFiles()
  if (args.includes('--check-urls')) await checkUrls()

  if (args.includes('--backup')) {
    await backup()
    return
  }

  const onlyIdx = args.indexOf('--only')
  if (onlyIdx !== -1) {
    const label = args[onlyIdx + 1]
    if (!label) throw new Error('Usage: --only <tab label>')
    const previewAt = args.indexOf('--preview-file')
    return replaceTab(label, previewAt === -1 ? null : args[previewAt + 1], args.includes('--apply'))
  }

  const previewIdx = args.indexOf('--preview-file')
  if (previewIdx !== -1) {
    const file = args[previewIdx + 1]
    if (!file) throw new Error('Usage: --preview-file <out.json>')
    fs.writeFileSync(file, JSON.stringify(buildPatch(await uploadIcons()), null, 2))
    console.log(`Wrote the patch to ${file}. Preview: NAV_VC_PREVIEW_FILE=${file} npm run dev`)
    return
  }

  if (!args.includes('--apply')) {
    console.log('\nDry run, nothing written. --apply writes the production dataset (live within ~1 min).')
    return
  }

  const { id, file } = await backup()
  const patch = buildPatch(await uploadIcons())
  await writeClient.patch(id).set(patch).commit()
  console.log(`Wrote ${Object.keys(patch).join(', ')}.`)
  console.log(`Rollback: npx tsx scripts/seed-nav-vc.ts --restore ${path.relative(process.cwd(), file)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
