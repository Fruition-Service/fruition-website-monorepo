/**
 * Claude Partner Network tier in Sanity (Nov 2026: Certified, Select expected soon).
 *
 *   npx tsx scripts/claude-partner-tier/sanity.ts --tier certified           # dry run
 *   npx tsx scripts/claude-partner-tier/sanity.ts --tier certified --apply   # backs up, then writes
 *   npx tsx scripts/claude-partner-tier/sanity.ts --tier select --apply      # when Select is awarded
 *
 * 1. The `partner-claude` document's badge (shown on every Version C page that
 *    links a Claude badge to the partner registry) gets the tier's artwork and
 *    alt text. Certified uploads public/images/home/partner-claude-certified.png;
 *    Select reuses the original Select upload, which stays in the dataset.
 * 2. On every Version C page, Claude badge items (vcLogo, vcNode img) linked to
 *    partner-claude get the tier's alt text and fallback image, and directory
 *    tiles tagged "... SELECT/CERTIFIED SERVICES PARTNER" get the tier's tag.
 *
 * Idempotent: re-running with the same tier changes nothing.
 * Rollback: npx tsx scripts/claude-partner-tier/sanity.ts --restore <backup.json>
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from '../sanity-migrate/lib'

type Tier = 'certified' | 'select'

const TIERS: Record<Tier, { alt: string; tag: string; asset: () => Promise<string> }> = {
  certified: {
    alt: 'Claude Partner Network Certified Services Partner',
    tag: 'CERTIFIED SERVICES PARTNER',
    asset: () => uploadOnce('public/images/home/partner-claude-certified.png', 'claude-certified-services-partner.png'),
  },
  select: {
    alt: 'Claude Partner Network Select Services Partner',
    tag: 'SELECT SERVICES PARTNER',
    // The original Select badge upload (b-claude.png, 253x80).
    asset: async () => 'image-22427abb08ced2db62ca61fbf41998f7371cd8ed-253x80-png',
  },
}

const PARTNER_ID = 'partner-claude'
const CLAUDE_HREF = '/partnerships/anthropic-claude-partner'
const TIER_ALT = /^(Claude|Anthropic Claude)( Partner Network)? (Select|Certified) Services Partner$/i
const TIER_TAG = /\b(SELECT|CERTIFIED) SERVICES PARTNER\b/
const BACKUP_DIR = path.join(process.cwd(), 'scripts/sanity-backups')

async function uploadOnce(file: string, filename: string): Promise<string> {
  const existing = await writeClient.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  )
  if (existing) return existing
  const abs = path.join(process.cwd(), file)
  if (!fs.existsSync(abs)) throw new Error(`Missing ${file}: add the badge artwork first`)
  const asset = await writeClient.assets.upload('image', fs.readFileSync(abs), { filename, contentType: 'image/png' })
  return asset._id
}

interface Change {
  where: string
  from: string
  to: string
}

/** Rewrites Claude tier labels (and fallback badge images) in place; returns what changed. */
function retier(node: any, tier: Tier, assetId: string, at: string, out: Change[]): void {
  if (Array.isArray(node)) {
    node.forEach((n, i) => retier(n, tier, assetId, `${at}[${n?._key ?? i}]`, out))
    return
  }
  if (!node || typeof node !== 'object') return
  const t = TIERS[tier]
  const linked = node.partner?._ref === PARTNER_ID
  if (linked && node._type === 'vcLogo') {
    if (typeof node.alt === 'string' && TIER_ALT.test(node.alt) && node.alt !== t.alt) {
      out.push({ where: `${at}.alt`, from: node.alt, to: t.alt })
      node.alt = t.alt
    }
    if (node.image?.asset && node.image.asset._ref !== assetId) {
      out.push({ where: `${at}.image`, from: node.image.asset._ref, to: assetId })
      node.image.asset._ref = assetId
    }
  }
  if (linked && node._type === 'vcNode' && node.image) {
    if (typeof node.image.alt === 'string' && TIER_ALT.test(node.image.alt) && node.image.alt !== t.alt) {
      out.push({ where: `${at}.image.alt`, from: node.image.alt, to: t.alt })
      node.image.alt = t.alt
    }
    if (node.image.asset && node.image.asset._ref !== assetId) {
      out.push({ where: `${at}.image`, from: node.image.asset._ref, to: assetId })
      node.image.asset._ref = assetId
    }
  }
  if (node._type === 'vcTile' && node.href === CLAUDE_HREF && typeof node.tag === 'string' && TIER_TAG.test(node.tag)) {
    const tag = node.tag.replace(TIER_TAG, t.tag)
    if (tag !== node.tag) {
      out.push({ where: `${at}.tag`, from: node.tag, to: tag })
      node.tag = tag
    }
  }
  for (const k of Object.keys(node)) if (k !== 'image') retier(node[k], tier, assetId, `${at}.${k}`, out)
}

async function main() {
  const args = process.argv.slice(2)
  const restoreAt = args.indexOf('--restore')
  if (restoreAt !== -1) {
    const snap = JSON.parse(fs.readFileSync(args[restoreAt + 1], 'utf8'))
    await writeClient.patch(PARTNER_ID).set({ badge: snap.badge }).commit()
    for (const d of snap.pages) await writeClient.patch(d._id).set({ sections: d.sections }).commit()
    console.log(`Restored ${PARTNER_ID} badge and ${snap.pages.length} pages.`)
    return
  }
  const tier = args[args.indexOf('--tier') + 1] as Tier
  if (!(tier in TIERS) || !args.includes('--tier')) throw new Error('Pass --tier certified or --tier select')
  const apply = args.includes('--apply')
  const t = TIERS[tier]

  const partner = await writeClient.fetch<{ badge: any } | null>(`*[_id == $id][0]{ badge }`, { id: PARTNER_ID })
  if (!partner?.badge) throw new Error(`${PARTNER_ID} has no badge`)
  // Dry runs do not upload; they show the planned changes against a placeholder id.
  const assetId = apply || tier === 'select' ? await t.asset() : 'image-<certified upload>'

  const pages = await writeClient.fetch<{ _id: string; _rev: string; sections: unknown[] }[]>(
    `*[_type == "vcPage" && !(_id in path("drafts.**")) && references($id)]{ _id, _rev, sections }`,
    { id: PARTNER_ID },
  )
  const plan = pages
    .map((d) => {
      const sections = structuredClone(d.sections)
      const changes: Change[] = []
      retier(sections, tier, assetId, 'sections', changes)
      return { ...d, next: sections, changes }
    })
    .filter((d) => d.changes.length > 0)

  console.log(`Tier: ${tier}`)
  const badgeChanges = partner.badge.asset?._ref !== assetId || partner.badge.alt !== t.alt
  console.log(`${PARTNER_ID} badge: ${badgeChanges ? `${partner.badge.asset?._ref} "${partner.badge.alt}" -> ${assetId} "${t.alt}"` : 'already on this tier'}`)
  for (const d of plan) {
    console.log(`${d._id}:`)
    for (const c of d.changes) console.log(`  ${c.where}: ${c.from} -> ${c.to}`)
  }
  if (!badgeChanges && plan.length === 0) return console.log('Nothing to change.')
  if (!apply) return console.log('\nDry run. Add --apply to write.')

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `claude-tier-${tier}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(
    file,
    JSON.stringify({ badge: partner.badge, pages: plan.map((d) => ({ _id: d._id, sections: d.sections })) }, null, 2),
  )
  console.log(`Backup: ${file}`)

  if (badgeChanges) {
    await writeClient
      .patch(PARTNER_ID)
      .set({ 'badge.asset': { _type: 'reference', _ref: assetId }, 'badge.alt': t.alt })
      .commit()
  }
  for (const d of plan) await writeClient.patch(d._id).ifRevisionId(d._rev).set({ sections: d.next }).commit()
  console.log('Done. Publishing goes live in about two minutes (no deploy needed).')
  console.log(`Rollback: npx tsx scripts/claude-partner-tier/sanity.ts --restore ${path.relative(process.cwd(), file)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
