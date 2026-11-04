import { cache } from 'react'
import { getPracticePageDoc, type PracticePageDoc } from '@/sanity/queries'
import type { PracticeLink, PracticePage, PracticeRegion } from '@/data/practicePages/types'

/** Blank strings from the Studio are "not set", not "set to empty". */
function text(value: string | undefined | null, fallback: string): string
function text(value: string | undefined | null, fallback: string | undefined): string | undefined
function text(value: string | undefined | null, fallback: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

/**
 * Like `text`, but keeps the value as stored. The logo wall heading's plain
 * part ends in a space that separates it from the accent ("Clients who have
 * used our " + "monday.com consulting services"), so trimming it would run
 * the two words together.
 */
function untrimmed(value: string | undefined | null, fallback: string | undefined) {
  return value?.trim() ? value : fallback
}

/** Hrefs are machine values: trimmed, and left off entirely when blank. */
function href(value: string | undefined | null): { href?: string } {
  const trimmed = value?.trim()
  return trimmed ? { href: trimmed } : {}
}

/**
 * Only a list with usable entries replaces the shipped one. An editor who
 * empties an array in the Studio, or leaves half a row blank, should not be
 * able to blank a whole section of the live page.
 */
function list<TDoc, TOut>(
  items: (TDoc | null)[] | undefined | null,
  fallback: TOut[],
  map: (item: TDoc) => TOut | null,
): TOut[] {
  const mapped = (items ?? [])
    .map((item) => (item ? map(item) : null))
    .filter((item): item is TOut => item !== null)
  return mapped.length ? mapped : fallback
}

/**
 * Lays a `practicePage` document over the shipped copy, field by field.
 * `path` and `breadcrumb` stay code-only: the path is the document's lookup
 * key and the breadcrumb is not rendered. `targetQueries` and
 * `preferPageFaqs` are code-only flags. The shared blocks (logo wall heading,
 * coverage, practice leader, booking, FAQ heading) stay unset when the
 * document leaves them blank, so the template renders PRACTICE_SHARED_COPY.
 */
export function mergePracticePage(
  fallback: PracticePage,
  doc: PracticePageDoc | null | undefined,
): PracticePage {
  if (!doc) return fallback
  // A child link without a path goes nowhere, so the row is unusable.
  const children = list<NonNullable<PracticePageDoc['childLinks']>[number], PracticeLink>(
    doc.childLinks,
    [],
    (c) =>
      c.label?.trim() && c.href?.trim()
        ? {
            label: c.label.trim(),
            href: c.href.trim(),
            ...(c.description?.trim() ? { description: c.description.trim() } : {}),
          }
        : null,
  )
  return {
    ...fallback,
    seoTitle: text(doc.seoTitle, fallback.seoTitle),
    seoDescription: text(doc.seoDescription, fallback.seoDescription),
    primaryCtaLabel: text(doc.primaryCtaLabel, fallback.primaryCtaLabel),
    heading: text(doc.heading, fallback.heading),
    lead: text(doc.lead, fallback.lead),
    approachEyebrow: text(doc.approachEyebrow, fallback.approachEyebrow),
    approachHeading: text(doc.approachHeading, fallback.approachHeading),
    approach: list(doc.approach, fallback.approach, (a) =>
      a.title?.trim() && a.body?.trim() ? { title: a.title.trim(), body: a.body.trim() } : null,
    ),
    servicesEyebrow: text(doc.servicesEyebrow, fallback.servicesEyebrow),
    servicesHeading: text(doc.servicesHeading, fallback.servicesHeading),
    services: list(doc.services, fallback.services, (s) =>
      s.title?.trim() && s.body?.trim()
        ? { title: s.title.trim(), body: s.body.trim(), ...href(s.href) }
        : null,
    ),
    childrenEyebrow: text(doc.childrenEyebrow, fallback.childrenEyebrow),
    childrenHeading: text(doc.childrenHeading, fallback.childrenHeading),
    children: children.length ? children : fallback.children,
    faqs: list(doc.faqs, fallback.faqs, (f) =>
      f.q?.trim() && f.a?.trim() ? { q: f.q.trim(), a: f.a.trim() } : null,
    ),
    logoHeading: untrimmed(doc.logoHeading, fallback.logoHeading),
    logoHeadingAccent: text(doc.logoHeadingAccent, fallback.logoHeadingAccent),
    coverageEyebrow: text(doc.coverageEyebrow, fallback.coverageEyebrow),
    coverageHeading: text(doc.coverageHeading, fallback.coverageHeading),
    // The flag is decoration, so a region card only needs its words.
    coverageRegions: optionalList<NonNullable<PracticePageDoc['coverageRegions']>[number], PracticeRegion>(
      doc.coverageRegions,
      fallback.coverageRegions,
      (r) =>
        r.region?.trim() && r.cities?.trim() && r.body?.trim()
          ? {
              flag: r.flag?.trim() ?? '',
              region: r.region.trim(),
              cities: r.cities.trim(),
              body: r.body.trim(),
            }
          : null,
    ),
    leaderEyebrow: text(doc.leaderEyebrow, fallback.leaderEyebrow),
    leaderHeading: text(doc.leaderHeading, fallback.leaderHeading),
    leaderName: text(doc.leaderName, fallback.leaderName),
    leaderTitle: text(doc.leaderTitle, fallback.leaderTitle),
    leaderBio: text(doc.leaderBio, fallback.leaderBio),
    leaderPull: text(doc.leaderPull, fallback.leaderPull),
    leaderBadges: optionalList<string, string>(doc.leaderBadges, fallback.leaderBadges, (b) =>
      b.trim() ? b.trim() : null,
    ),
    bookingHeading: text(doc.bookingHeading, fallback.bookingHeading),
    bookingSubheading: text(doc.bookingSubheading, fallback.bookingSubheading),
    faqHeading: text(doc.faqHeading, fallback.faqHeading),
  }
}

/** `list` for a list the code copy may leave unset. */
function optionalList<TDoc, TOut>(
  items: (TDoc | null)[] | undefined | null,
  fallback: TOut[] | undefined,
  map: (item: TDoc) => TOut | null,
): TOut[] | undefined {
  const mapped = list(items, [], map)
  return mapped.length ? mapped : fallback
}

/**
 * A practice route's content: the shipped copy with its `practicePage` Studio
 * document (matched on path) merged over it. Cached per render pass because
 * each route reads it twice, once in generateMetadata and once in the body.
 */
export const getPracticePageContent = cache(async (fallback: PracticePage): Promise<PracticePage> => {
  // A Sanity blip drops the page back to the shipped copy rather than 500ing
  // a commercial page. The fallback is complete, so there is nothing to lose.
  const doc = await getPracticePageDoc(fallback.path).catch(() => null)
  return mergePracticePage(fallback, doc)
})
