/**
 * Seed the about-us `page` doc with the hardcoded About Modern copy
 * so AboutModern.tsx can render Sanity-driven fields exclusively.
 *
 * Idempotent — uses setIfMissing so values already authored in Studio
 * are preserved.
 *
 *   npx tsx scripts/sanity-migrate/about-modern-full.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'about-us'
const TYPE = 'page'

const OFFICES = [
  { city: 'Sydney', country: 'Australia', flag: '🇦🇺', note: 'Head office' },
  { city: 'New York', country: 'United States', flag: '🇺🇸' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { city: 'New Delhi', country: 'India', flag: '🇮🇳' },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // Hero heading fragments
      heroHeadingPart1: 'The team behind',
      heroHeadingAccent: '500+ monday.com',
      heroHeadingPart2: 'transformations.',
      heroPartnerBadgesLabel: 'Certified partners',
      heroCalloutBadgeLabel: 'Platinum partner',
      heroCalloutBadgeText: 'monday.com · since 2025',
      heroCalloutOfficesText: '5 offices · 5 timezones',

      // Story section
      storyEyebrow: 'Our story',
      storyHeading: 'Built to make complex business operations',
      storyHeadingAccent: 'actually run smoothly.',
      storyCardEyebrowPrefix: 'Why Fruition',

      // Methodology extras
      methodologyEyebrow: 'Methodology',
      methodologyStepLabel: 'STEP',

      // Approach tabs
      approachEyebrow: 'Proven Approach',
      approachHeading: '500+ teams transformed.',
      approachHeadingAccent: 'Proven efficiency gains.',

      // Global presence
      globalPresenceEyebrow: 'Global presence',
      globalPresenceHeading: 'Five offices.',
      globalPresenceHeadingAccent: 'One delivery standard.',
      globalPresenceBody:
        'Local consultants across Australia, the UK, the US, Southeast Asia and India — sharing a single playbook so every rollout feels first-class.',
      offices: withKeys(OFFICES),

      // Partner stack
      partnerStackEyebrow: 'Our partner ecosystem',

      // Closing CTA
      closingCtaHeading: 'Ready to put a Platinum partner on your team?',
      closingCtaBody:
        'Book a 30-min consultation with a Fruition consultant. Walk away with a clear scope, timeline and ROI estimate.',
      closingCtaPrimaryLabel: 'Schedule a consultation',
      closingCtaSecondaryLabel: 'See client stories',
      closingCtaSecondaryUrl: '/customer-testimonials',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
