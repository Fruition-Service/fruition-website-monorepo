/**
 * Add Singapore (SG) and Philippines (PH) region tabs to /fruition-team.
 *
 *  - Sets the `teamRegions` pills on the `fruition-team` page doc to the
 *    ordered list: APAC, UK, US, Singapore, India, Philippines.
 *  - Tags the curated SG roster and the existing PH roster with the new
 *    region codes (append + dedupe, so existing tags are preserved).
 *
 * Idempotent — re-running re-sets the same pills and re-adds the same
 * region codes without duplicating.
 *
 *   npx tsx scripts/sanity-migrate/fruition-team-sg-ph.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'fruition-team'

// Ordered pills: APAC → UK → US → Singapore → India → Philippines
const TEAM_REGIONS = [
  { code: 'APAC', label: 'Meet the APAC Team', emoji: '🌏' },
  { code: 'UK', label: 'Meet the UK Team', emoji: '🇬🇧' },
  { code: 'US', label: 'Meet the US Team', emoji: '🇺🇸' },
  { code: 'SG', label: 'Meet the Singapore Team', emoji: '🇸🇬' },
  { code: 'IN', label: 'Meet the India Team', emoji: '🇮🇳' },
  { code: 'PH', label: 'Meet the Philippines Team', emoji: '🇵🇭' },
]

// Curated Singapore roster (exact Sanity teamMember names).
// Not Josh or Chloe: both are Australia only (TEAM_TABS_ONLY in
// src/lib/mergeTeamMembers.ts). Re-running this used to tag them SG and PH.
const SG_NAMES = [
  'Branson McMahon',
  'Nikhil Tiwari',
  'Nikki Glucksman',
  'Suzzane Castro',
  'Sarah Wealleans',
  'Thana Witchawut',
  'Edward Zehua Zhang',
]

// Existing Philippines roster (from monday-partner-philippines-team.ts,
// mapped to exact Sanity names — 'Prince Posadas' not 'Prince Ericson Posadas').
const PH_NAMES = [
  'Suzzane Castro',
  'Annica Galang',
  'Pierre Santos',
  'Ronelyn Tabuena',
  'Benjie Belotindos',
  'Julia Maningas',
  'Prince Posadas',
  'Nikki Glucksman',
  'Thana Witchawut',
]

async function tagRegion(names: string[], code: string) {
  const docs = await writeClient.fetch<{ _id: string; name: string; regions?: string[] }[]>(
    `*[_type == "teamMember" && name in $names]{ _id, name, regions }`,
    { names },
  )
  const found = new Set(docs.map((d) => d.name))
  const missing = names.filter((n) => !found.has(n))
  if (missing.length) {
    throw new Error(`[${code}] no teamMember doc for: ${missing.join(', ')}`)
  }

  let tx = writeClient.transaction()
  for (const d of docs) {
    const next = Array.from(new Set([...(d.regions ?? []), code]))
    tx = tx.patch(d._id, (p) => p.set({ regions: next }))
  }
  await tx.commit()
  console.log(`✅ tagged ${docs.length} members with ${code}`)
}

async function main() {
  const page = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "page" && slug.current == $slug][0]{ _id }`,
    { slug: SLUG },
  )
  if (!page?._id) throw new Error(`No page doc with slug ${SLUG}`)

  await tagRegion(SG_NAMES, 'SG')
  await tagRegion(PH_NAMES, 'PH')

  await writeClient.patch(page._id).set({ teamRegions: withKeys(TEAM_REGIONS) }).commit()
  console.log('✅ set teamRegions pills: APAC, UK, US, SG, IN, PH')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
