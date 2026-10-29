import { createClient } from 'next-sanity'
import { rewriteBookingLinks } from '@/lib/bookingLink'
import { dropRetiredHubNavLinks, rewriteRetiredLinks } from '@/lib/retiredLinks'
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
 *
 * Results also pass through rewriteRetiredLinks, which points any field whose
 * value is the retired /monday-consulting-solutions hub at
 * /monday-implementation-consultants. The homepage "Our monday.com services"
 * CTA (and any body copy) still links to the hub, and there is no Sanity write
 * access today, so the read layer rewrites it without a CMS edit.
 *
 * Navigation is the one exception: on the siteSettings payload, `navigation`
 * entries linking to the hub are dropped (dropRetiredHubNavLinks) before the
 * rewrite, because the Services menu already lists
 * /monday-implementation-consultants as "Implementation consultants" and a
 * rewritten entry would duplicate it.
 */
export const client = {
  // Generic defaults to `any` to match next-sanity's own fetch signature —
  // call sites rely on that inference.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: async <T = any>(query: string, params?: Record<string, unknown>): Promise<T> => {
    const c = (await isEditMode()) ? editBase : base
    return rewriteRetiredLinks(withoutRetiredHubNav(rewriteBookingLinks(await c.fetch<T>(query, params ?? {}))))
  },
}

/** Drops retired hub entries from a siteSettings `navigation` array; any other payload is returned as is. */
function withoutRetiredHubNav<T>(payload: T): T {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return payload
  const proto = Object.getPrototypeOf(payload)
  if (proto !== Object.prototype && proto !== null) return payload
  const { navigation } = payload as { navigation?: unknown }
  if (!Array.isArray(navigation)) return payload
  return { ...payload, navigation: dropRetiredHubNavLinks(navigation) }
}
