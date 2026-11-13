import { cache } from 'react'
import { client } from './client'

/**
 * Partners & badges: one `partner` document per technology partner holds its
 * badge, logo and mark. Page content points at it (`partner` + `partnerImage`
 * on logos, tiles, tool cards and markup images), and the loaders swap in the
 * partner's current image here, so a badge changed once updates every page.
 */

export type PartnerImageRole = 'badge' | 'logo' | 'mark'

export interface PartnerImage {
  _type?: string
  asset?: { _ref?: string; _type?: string }
  alt?: string
}

export interface PartnerDoc {
  _id: string
  key?: string
  name?: string
  href?: string
  badge?: PartnerImage
  logo?: PartnerImage
  mark?: PartnerImage
}

export const PARTNERS_QUERY = `*[_type == "partner" && !(_id in path("drafts.**"))]{ _id, "key": key.current, name, href, badge, logo, mark }`

export const getPartners = cache(async (): Promise<PartnerDoc[]> => client.fetch<PartnerDoc[]>(PARTNERS_QUERY))

/** Tiles, tool marquee tiles and logo cards (vcItem) keep their partner image in `logo`; everything else in `image`. */
const LOGO_FIELD_TYPES = new Set(['vcTile', 'vcTool', 'vcItem'])

type Node = Record<string, unknown> & { _type?: string; partner?: { _ref?: string }; partnerImage?: string }

function pick(p: PartnerDoc, role: string | undefined): PartnerImage | undefined {
  const want = (role === 'logo' || role === 'mark' ? role : 'badge') as PartnerImageRole
  const img = p[want]
  return img?.asset?._ref ? img : undefined
}

/**
 * Walk any content tree and replace each partner-linked image with the
 * partner's current one. Items whose partner or image is missing keep their
 * own image. Returns the same tree (mutated) for convenience.
 */
export function resolvePartnerImages<T>(tree: T, partners: PartnerDoc[] | null | undefined): T {
  if (!partners?.length) return tree
  const byId = new Map(partners.map((p) => [p._id, p]))
  const visit = (v: unknown) => {
    if (Array.isArray(v)) {
      v.forEach(visit)
      return
    }
    if (!v || typeof v !== 'object') return
    const node = v as Node
    const ref = node.partner?._ref
    const partner = ref ? byId.get(ref) : undefined
    const img = partner ? pick(partner, node.partnerImage) : undefined
    if (img) {
      const field = node._type && LOGO_FIELD_TYPES.has(node._type) ? 'logo' : 'image'
      const own = (node[field] as PartnerImage | undefined) ?? {}
      const alt = img.alt || own.alt
      node[field] = { _type: 'image', asset: img.asset, ...(alt ? { alt } : {}) }
    }
    for (const [k, child] of Object.entries(node)) if (k !== 'partner' && child && typeof child === 'object') visit(child)
  }
  visit(tree)
  return tree
}

/** Partner key -> its current badge, for the coded hero badge rows. */
export function partnerBadgeMap(partners: PartnerDoc[] | null | undefined): Record<string, PartnerImage> {
  const out: Record<string, PartnerImage> = {}
  for (const p of partners ?? []) if (p.key && p.badge?.asset?._ref) out[p.key] = p.badge
  return out
}
