/**
 * Rename the "Ask Fruit" nav links to "Fruitai" (the assistant's new name).
 * Only labels change; hrefs stay /ask-fruit.
 *
 *   npx tsx scripts/rename-nav-ask-fruit-to-fruitai.ts          # dry run
 *   npx tsx scripts/rename-nav-ask-fruit-to-fruitai.ts --apply  # backs up, then writes
 *
 * Rollback: npx tsx scripts/seed-nav-v2.ts --restore scripts/nav-backups/<file>.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'

const FROM = 'Ask Fruit'
const TO = 'Fruitai'

/** Every string under `node` with FROM replaced; counts replacements in `hits`. */
function rename(node: unknown, hits: string[]): unknown {
  if (typeof node === 'string') {
    if (!node.includes(FROM)) return node
    hits.push(node)
    return node.split(FROM).join(TO)
  }
  if (Array.isArray(node)) return node.map((n) => rename(n, hits))
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, rename(v, hits)]))
  }
  return node
}

async function main() {
  const apply = process.argv.includes('--apply')
  const settings = await writeClient.fetch<{ _id: string; navigation: unknown[] }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  if (!settings?.navigation) throw new Error('siteSettings.navigation not found')
  const hits: string[] = []
  const navigation = rename(settings.navigation, hits)
  for (const h of hits) console.log(`"${h}" -> "${h.split(FROM).join(TO)}"`)
  if (!hits.length) return console.log('Nothing to rename.')
  if (!apply) return console.log('Dry run. Re-run with --apply to write.')

  const dir = path.join(process.cwd(), 'scripts/nav-backups')
  fs.mkdirSync(dir, { recursive: true })
  const backup = path.join(dir, `nav-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(backup, JSON.stringify(settings.navigation, null, 2))
  console.log(`Backup: ${path.relative(process.cwd(), backup)}`)

  await writeClient.patch(settings._id).set({ navigation }).commit()
  console.log('Applied.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
