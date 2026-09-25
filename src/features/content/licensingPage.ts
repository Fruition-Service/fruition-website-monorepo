import { cache } from 'react'
import { getLicensingPage, type LicensingPageDoc } from '@/sanity/queries'
import { LICENSING_PAGES } from '@/data/practicePages/licensing'
import type { PracticePage } from '@/data/practicePages/types'

/** Blank strings from the Studio are "not set", not "set to empty". */
function text(value: string | undefined, fallback: string): string
function text(value: string | undefined, fallback: string | undefined): string | undefined
function text(value: string | undefined, fallback: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

/**
 * Only a list with usable entries replaces the shipped one. An editor who
 * empties an array in the Studio, or leaves half a row blank, should not be
 * able to blank a whole section of the live page.
 */
function list<TDoc, TOut>(
  items: TDoc[] | undefined,
  fallback: TOut[],
  map: (item: TDoc) => TOut | null,
): TOut[] {
  const mapped = (items ?? []).map(map).filter((item): item is TOut => item !== null)
  return mapped.length ? mapped : fallback
}

export function mergeLicensingPage(
  fallback: PracticePage,
  doc: LicensingPageDoc | null,
): PracticePage {
  if (!doc) return fallback
  return {
    ...fallback,
    seoTitle: text(doc.seoTitle, fallback.seoTitle),
    seoDescription: text(doc.seoDescription, fallback.seoDescription),
    eyebrow: text(doc.eyebrow, fallback.eyebrow),
    heading: text(doc.heading, fallback.heading),
    lead: text(doc.lead, fallback.lead),
    approachEyebrow: text(doc.approachEyebrow, fallback.approachEyebrow),
    approachHeading: text(doc.approachHeading, fallback.approachHeading),
    approach: list(doc.approach, fallback.approach, (a) =>
      a?.title?.trim() && a?.body?.trim() ? { title: a.title.trim(), body: a.body.trim() } : null,
    ),
    servicesEyebrow: text(doc.servicesEyebrow, fallback.servicesEyebrow),
    servicesHeading: text(doc.servicesHeading, fallback.servicesHeading),
    services: list(doc.services, fallback.services, (s) =>
      s?.title?.trim() && s?.body?.trim() ? { title: s.title.trim(), body: s.body.trim() } : null,
    ),
    childrenEyebrow: text(doc.childrenEyebrow, fallback.childrenEyebrow),
    childrenHeading: text(doc.childrenHeading, fallback.childrenHeading),
    children: list(doc.childLinks, fallback.children ?? [], (c) =>
      c?.label?.trim() && c?.href?.trim()
        ? {
            label: c.label.trim(),
            href: c.href.trim(),
            ...(c.description?.trim() ? { description: c.description.trim() } : {}),
          }
        : null,
    ),
    faqs: list(doc.faqs, fallback.faqs, (f) =>
      f?.q?.trim() && f?.a?.trim() ? { q: f.q.trim(), a: f.a.trim() } : null,
    ),
  }
}

/**
 * /pricing content: shipped copy with the `licensingPage` Studio document
 * merged over it. Cached per render pass because the route reads it twice,
 * once in generateMetadata and once in the component body.
 */
export const getLicensingPageContent = cache(async (): Promise<PracticePage> => {
  // A Sanity blip drops the page back to the shipped copy rather than 500ing a
  // commercial page. The fallback is complete, so there is nothing to lose.
  const doc = await getLicensingPage().catch(() => null)
  return mergeLicensingPage(LICENSING_PAGES.pricing, doc)
})
