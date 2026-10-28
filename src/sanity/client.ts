import { createClient } from 'next-sanity'
import { rewriteBookingLinks } from '@/lib/bookingLink'
import { apiVersion, dataset, projectId } from './env'
import { isEditMode, stegaFilter } from './editMode'

const base = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * The inline editor's client (see src/components/edit/). Only used while a
 * portal user has edit mode on, which is Next draft mode: those requests skip
 * the ISR cache, so reading uncached from the API costs nothing on the live
 * site. Stega hides each string's document id and field path inside it as
 * zero-width characters; the overlay decodes them to know what to patch.
 */
const editBase = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_WRITE_TOKEN,
  stega: { enabled: true, studioUrl: '/studio', filter: stegaFilter },
})

/**
 * Read client for all CMS content.
 *
 * Every result is passed through rewriteBookingLinks, so a Calendly URL saved
 * in any Sanity field — hero CTA, sticky bar, page-builder block, a link in a
 * blog body — resolves to the on-site booking section. Doing it here rather
 * than at each render site means new CMS content can't reintroduce a raw
 * Calendly link. `siteSettings.calendlyLink` is deliberately exempt: the
 * booking card needs the real URL as its availability-failure escape hatch.
 */
export const client = {
  // Generic defaults to `any` to match next-sanity's own fetch signature —
  // call sites rely on that inference.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: async <T = any>(query: string, params?: Record<string, unknown>): Promise<T> => {
    const c = (await isEditMode()) ? editBase : base
    return rewriteBookingLinks(await c.fetch<T>(query, params ?? {}))
  },
}
