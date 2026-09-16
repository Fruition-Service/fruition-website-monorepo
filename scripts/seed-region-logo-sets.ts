/**
 * Seed the six `regionLogoSet` documents behind the client wall that now runs
 * under every region hero, and fill in the copy that frames it.
 *
 *   npx tsx scripts/seed-region-logo-sets.ts            # dry run: prints the plan
 *   npx tsx scripts/seed-region-logo-sets.ts --apply    # writes
 *
 * DEPLOY ORDER: merge and deploy the schema change BEFORE running --apply, or
 * the Studio will not know the `regionLogoSet` type or the `clients` field.
 *
 * Where the logos come from: every mark below already lives in Sanity, either
 * on `siteSettings.carouselLogos` or on an `industryLogoSet`. This script
 * copies the existing asset reference rather than re-uploading, so a client's
 * logo stays one asset no matter how many walls it appears on.
 *
 * Where the regions come from: the "Region" column (ANZ/UK/US/SEA/IND) on
 * monday board 5025525962, cross-checked by eye — that column has real
 * misfiles (UK and Australian companies sitting under US), and the US bucket
 * in particular could not be trusted wholesale. The sets below are the
 * corrected, hand-checked result.
 *
 * Singapore, India and the Philippines have almost nothing tagged on that
 * board: one genuine local client each. Those three sets lead with that client
 * and fill the rest with multinationals we have delivered for, which is what
 * the "900+ implementations" heading claims anyway. Tag more rows on the board
 * and re-run this to make them properly local.
 */
import { writeClient } from './sanity-migrate/lib'
import { REGION_PAGES, type RegionSlug } from '../src/data/regionPages'

interface PoolLogo {
  alt: string
  clientSlug?: string
  image: { asset: { _ref: string } }
}

/**
 * Nine tiles per region — the tenth cell in the 2×5 grid is the "900+ more"
 * counter. Names must match an `alt` already in Sanity; the script fails loudly
 * on anything it cannot resolve rather than quietly shipping a short wall.
 */
const SETS: Record<RegionSlug, string[]> = {
  'monday-partner-australia': [
    'Telstra',
    'Reserve Bank of Australia',
    'CSIRO',
    'Transport for NSW',
    'SBS',
    'Specsavers',
    'Ticketek',
    'Carsales',
    'Queensland Health',
  ],
  'monday-partner-uk': [
    'Surrey County Council',
    'Deckers UK',
    'Paladone Products',
    'Joloda Hydraroll',
    'Equip Outdoor Technologies',
    'Curtis Furniture',
    'Bloom Procurement Services',
    'Focaldata',
    'Givergy',
  ],
  'monday-partner-us': [
    'Honor Credit Union',
    'Craters & Freighters Franchise Co',
    'Housing Authority of San Antonio',
    'Stout Risius Ross',
    'Kitchen Tune-Up',
    'BasePoint Health Management',
    'Nsight Health',
    'Windfall Bio',
    'Uprise Electric Company',
  ],
  'monday-partner-singapore': [
    'At-Sunrice GlobalChef Academy Pte',
    'Pacific Community',
    'Ogilvy',
    'Scania',
    'Specsavers',
    'Telstra',
    'CSIRO',
    'Givergy',
    'Joloda Hydraroll',
  ],
  'monday-partner-india': [
    'Learning Links Foundation',
    'Ogilvy',
    'Telstra',
    'Scania',
    'Specsavers',
    'CSIRO',
    'Givergy',
    'Joloda Hydraroll',
    'Paladone Products',
  ],
  'monday-partner-philippines': [
    'Ogilvy Philippines',
    'Pacific Community',
    'Telstra',
    'Scania',
    'Specsavers',
    'CSIRO',
    'Ticketek',
    'Givergy',
    'Joloda Hydraroll',
  ],
}

const LABELS: Record<RegionSlug, string> = {
  'monday-partner-australia': 'Australia',
  'monday-partner-uk': 'United Kingdom',
  'monday-partner-us': 'United States',
  'monday-partner-singapore': 'Singapore',
  'monday-partner-india': 'India',
  'monday-partner-philippines': 'Philippines',
}

/** Every logo already in Sanity, keyed by alt text. First source wins. */
async function loadPool(): Promise<Map<string, PoolLogo>> {
  const [carousel, sets] = await Promise.all([
    writeClient.fetch<PoolLogo[]>(
      `*[_type == "siteSettings"][0].carouselLogos[]{ alt, clientSlug, image }`,
    ),
    writeClient.fetch<Array<{ logos?: PoolLogo[] }>>(
      `*[_type == "industryLogoSet"]{ logos[]{ alt, clientSlug, image } }`,
    ),
  ])
  const pool = new Map<string, PoolLogo>()
  for (const logo of [...(carousel ?? []), ...(sets ?? []).flatMap((s) => s.logos ?? [])]) {
    if (!logo?.alt || !logo.image?.asset?._ref || pool.has(logo.alt)) continue
    pool.set(logo.alt, logo)
  }
  return pool
}

async function main() {
  const apply = process.argv.includes('--apply')
  const pool = await loadPool()

  const unknown = Object.values(SETS)
    .flat()
    .filter((name) => !pool.has(name))
  if (unknown.length) {
    throw new Error(`No logo in Sanity for: ${[...new Set(unknown)].join(', ')}`)
  }

  const slugs = Object.keys(SETS) as RegionSlug[]
  const pages: Array<{ _id: string; slug: { current: string }; hero?: { heading?: string } }> =
    await writeClient.fetch(`*[_type == "locationPage" && slug.current in $slugs]{ _id, slug, hero }`, {
      slugs,
    })
  const pageBySlug = new Map(pages.map((p) => [p.slug?.current, p]))

  for (const slug of slugs) {
    const content = REGION_PAGES[slug]
    const logos = SETS[slug].map((name, i) => {
      const logo = pool.get(name)!
      return {
        _key: `logo-${i}`,
        _type: 'clientLogo',
        alt: logo.alt,
        image: logo.image,
        ...(logo.clientSlug ? { clientSlug: logo.clientSlug } : {}),
      }
    })

    console.log(`── ${slug}`)
    console.log(`   logos: ${SETS[slug].join(', ')}`)

    if (apply) {
      await writeClient.createOrReplace({
        _id: `regionLogoSet-${slug}`,
        _type: 'regionLogoSet',
        regionKey: slug,
        title: `${LABELS[slug]} client wall`,
        logos,
      })
      console.log('   ✅ logo set written')
    }

    const page = pageBySlug.get(slug)
    if (!page) {
      console.log('   ⚠️  no locationPage document — skipped the copy patch')
      continue
    }

    // `clients` is a new field, so nothing an editor typed can be clobbered —
    // setIfMissing leaves a filled-in block alone on a re-run.
    console.log(`   clients copy: "${content.clients.lead}"`)
    if (apply) {
      await writeClient
        .patch(page._id)
        .setIfMissing({ clients: { ...content.clients } })
        .commit()
      console.log('   ✅ clients copy written')
    }

    // The US H1 said "an elite monday.com partner"; the shipped copy now says
    // "the best". Guarded so it only rewrites the wording it was asked to
    // replace, never an editor's later rewrite.
    if (slug === 'monday-partner-us' && page.hero?.heading?.includes('an elite')) {
      const heading = content.hero.heading
      console.log(`   hero heading: "${page.hero.heading}" → "${heading}"`)
      if (apply) {
        await writeClient.patch(page._id).set({ 'hero.heading': heading }).commit()
        console.log('   ✅ hero heading written')
      }
    }
  }

  console.log(apply ? '\n✅ done' : '\nDry run — re-run with --apply to write.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
