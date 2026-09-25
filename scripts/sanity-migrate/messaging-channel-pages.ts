/**
 * Seed the three messaging-channel integration pages into Sanity as
 * `servicePage` documents, so editors can reword them without a deploy.
 *
 *   npx tsx scripts/sanity-migrate/messaging-channel-pages.ts          # dry run
 *   npx tsx scripts/sanity-migrate/messaging-channel-pages.ts --apply
 *
 * Source of truth is src/data/messagingChannels — this script mirrors it into
 * Sanity rather than duplicating the copy, so the file and the CMS cannot
 * disagree on the day they are seeded.
 *
 * `servicePage`, not `partnershipPage`: sitemap.ts enumerates every
 * partnershipPage doc into /partnerships/<slug>, and /partnerships/[slug]
 * renders any slug it is given. A partnershipPage here would publish three
 * duplicate URLs we never asked for. servicePage is fetched by explicit slug
 * only, and nothing enumerates it.
 *
 * Only the fields an editor would plausibly reword are written. The structural
 * sections (the connection ledger, the platform spec panel, the reach strip)
 * stay in code: they carry dated, sourced platform claims, and a half-edited
 * spec sheet is worse than one that is wrong in an obvious place.
 */
import { writeClient, withKeys, upsertDocBySlug } from './lib'
import { CHANNEL_PAGES } from '../../src/data/messagingChannels'

function toServicePage(key: keyof typeof CHANNEL_PAGES) {
  const p = CHANNEL_PAGES[key]
  return {
    title: `${p.channel} integration`,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,

    heroEyebrow: p.heroEyebrow,
    heroHeading: p.heroHeading,
    heroSubheading: p.heroSubheading,
    primaryCtaLabel: p.primaryCtaLabel,
    secondaryCtaLabel: p.secondaryCtaLabel,

    introStripBody: p.intro,

    logoCloudHeadingPart1: p.logoCloudHeadingPart1,
    logoCloudHeadingAccent: p.logoCloudHeadingAccent,

    capabilitiesEyebrow: p.capabilitiesEyebrow,
    capabilitiesHeading: p.capabilitiesHeading,
    capabilitiesHeadingAccent: p.capabilitiesHeadingAccent,
    capabilitiesSubheading: p.capabilitiesSubheading,
    capabilitiesTheme: 'light',
    capabilitiesColumns: 3,
    capabilitiesCards: withKeys(
      p.capabilities.map((c) => ({
        _type: 'capabilityCard',
        emoji: c.emoji,
        title: c.title,
        description: c.description,
        bullets: withKeys((c.bullets ?? []).map((b) => ({ _type: 'bullet', text: b.text }))),
      })),
    ),

    industryHeading: p.industryHeading,
    industryTabs: withKeys(
      p.industries.map((t) => ({
        _type: 'industryTab',
        label: t.label,
        title: t.title,
        description: t.description,
        benefits: withKeys(t.benefits.map((b) => ({ _type: 'benefit', text: b.text }))),
      })),
    ),

    comparisonHeading: p.comparisonHeading,
    comparisonSubheading: p.comparisonSubheading,
    comparisonTheme: 'light',
    comparisonTabs: withKeys(
      p.comparisonTabs.map((tab) => ({
        _type: 'comparisonTab',
        label: tab.label,
        items: withKeys(
          (tab.items ?? []).map((item) => ({
            _type: 'comparisonItem',
            number: item.number,
            title: item.title,
            description: item.description,
            bullets: withKeys(
              (item.bullets ?? []).map((b) => ({ _type: 'bullet', text: b.text })),
            ),
          })),
        ),
      })),
    ),

    calendlyHeading: p.calendlyHeading,
    calendlySubheading: p.calendlySubheading,

    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'General questions',
        items: withKeys(
          p.faqs.map((f) => ({ _type: 'faqPair', question: f.q, answer: f.a })),
        ),
      },
    ]),
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const keys = Object.keys(CHANNEL_PAGES) as Array<keyof typeof CHANNEL_PAGES>

  for (const key of keys) {
    const page = CHANNEL_PAGES[key]
    const doc = toServicePage(key)
    console.log(`\n${page.path}  →  servicePage:${page.sanitySlug}`)
    console.log(`  hero        ${doc.heroHeading}`)
    console.log(`  capabilities ${doc.capabilitiesCards.length} · industries ${doc.industryTabs.length} · faqs ${page.faqs.length}`)
    if (apply) await upsertDocBySlug('servicePage', page.sanitySlug, doc)
  }

  if (!apply) {
    console.log('\nDry run — nothing written. Re-run with --apply.')
    return
  }
  console.log(`\nSeeded ${keys.length} servicePage documents.`)
  // Touch nothing else: the routes read these by slug and fall back to the
  // file, so a partial seed degrades to the shipped copy rather than a blank.
  await writeClient.fetch('*[_type == "servicePage" && slug.current in $s]{ "slug": slug.current }', {
    s: keys.map((k) => CHANNEL_PAGES[k].sanitySlug),
  }).then((r) => console.log('Verified in dataset:', r))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
