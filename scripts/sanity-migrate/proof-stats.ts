/**
 * Seed the proofStats singleton with the canonical entity-signal values
 * (audited from the live dataset 2026-07-18 — 900+ implementations is the
 * dominant, consistent figure). CREATE-ONLY: rerunning never overwrites
 * editor changes.
 *
 * Run with: npx tsx scripts/sanity-migrate/proof-stats.ts
 */
import { writeClient } from './lib'

async function main() {
  await writeClient.createIfNotExists({
    _id: 'proofStats',
    _type: 'proofStats',
    implementations: '900+',
    clientRating: '4.9',
    marketsCount: '6',
    mondayEcosystemCustomers: '180,000+',
    partnerTierMonday: 'Platinum monday.com Partner',
    partnerTierAtlassian: 'Platinum Atlassian Partner',
    awards: ['monday.com Rising Star 2026', 'Atlassian Rising Star of the Year 2026'],
  })
  console.log('Done. proofStats singleton seeded (or already existed).')
}

main().catch((e) => { console.error(e); process.exit(1) })
