/**
 * The Ask Fruit knowledge base: every offering Fruition sells plus the FAQs,
 * case studies and regional pages that back them up.
 *
 * Two sources, merged into one in-memory index per Worker isolate and refreshed
 * every 30 minutes:
 * - The solutions catalog and practice pages, which live in the repo. They are
 *   written to /ask-fruit-knowledge.json at build time and read back through the
 *   ASSETS binding, so the chat route does not bundle a second copy of them
 *   into a Worker that is close to its size limit (see
 *   scripts/build-ask-fruit-knowledge.ts).
 * - Sanity pages, FAQs, case studies and package tiers, in one query. Sanity's
 *   CDN quota has been blown once already (see open-next.config.ts), so the
 *   agent never queries Sanity per tool call.
 *
 * Either source failing leaves the other serving; an incomplete index is
 * retried after a minute.
 */
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { client } from "@/sanity/client"
import { KNOWLEDGE_QUERY, KNOWLEDGE_TYPES, sanityRecords, type SanityDoc } from "./sanity"
import { buildIndex, searchIndex, type SearchIndex, type SearchOptions } from "./search"
import type { KnowledgeRecord } from "./types"

export type { KnowledgeRecord } from "./types"
export { isOfferingKind, OFFERING_KINDS } from "./types"

const TTL_MS = 30 * 60 * 1000
const STATIC_PATH = "/ask-fruit-knowledge.json"

let cached: { at: number; index: SearchIndex } | null = null
let inflight: Promise<SearchIndex> | null = null
let origin: string | null = null

/** The request origin, used to fetch the static knowledge under `next dev`. */
export function setKnowledgeOrigin(url: string) {
  try {
    origin = new URL(url).origin
  } catch {
    /* keep the previous origin */
  }
}

async function staticKnowledge(): Promise<KnowledgeRecord[]> {
  let res: Response | null = null
  try {
    // Production: the Worker's own static assets, no network hop.
    const assets = getCloudflareContext().env.ASSETS
    if (assets) res = await assets.fetch(new Request(`https://assets.local${STATIC_PATH}`))
  } catch {
    /* no Cloudflare context (next dev, tests) */
  }
  if ((!res || !res.ok) && origin) res = await fetch(`${origin}${STATIC_PATH}`)
  if (!res?.ok) throw new Error(`static knowledge unavailable (${res?.status ?? "no response"})`)
  const body = (await res.json()) as { records?: KnowledgeRecord[] }
  return body.records ?? []
}

async function load(): Promise<SearchIndex> {
  const [fromRepo, fromSanity] = await Promise.allSettled([
    staticKnowledge(),
    client.fetch<SanityDoc[]>(KNOWLEDGE_QUERY, { types: [...KNOWLEDGE_TYPES] }).then((docs) => sanityRecords(docs ?? [])),
  ])
  if (fromRepo.status === "rejected") console.error("[ask-fruit] knowledge: static records failed", fromRepo.reason)
  if (fromSanity.status === "rejected") console.error("[ask-fruit] knowledge: Sanity fetch failed", fromSanity.reason)

  const records = [
    ...(fromRepo.status === "fulfilled" ? fromRepo.value : []),
    ...(fromSanity.status === "fulfilled" ? fromSanity.value : []),
  ]
  // Ids must be unique; the first record wins (repo catalog before CMS pages).
  const seen = new Set<string>()
  const deduped = records.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
  const index = buildIndex(deduped)
  const complete = fromRepo.status === "fulfilled" && fromSanity.status === "fulfilled"
  cached = { at: complete ? Date.now() : Date.now() - TTL_MS + 60_000, index }
  return index
}

export async function getKnowledge(): Promise<SearchIndex> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.index
  if (!inflight) inflight = load().finally(() => (inflight = null))
  // Serve the stale index while a refresh is in flight.
  return cached?.index ?? inflight
}

export async function searchKnowledge(query: string, options?: SearchOptions) {
  return searchIndex(await getKnowledge(), query, options)
}

export async function getRecords(ids: string[]): Promise<KnowledgeRecord[]> {
  const index = await getKnowledge()
  return ids.map((id) => index.byId.get(id)).filter((r): r is KnowledgeRecord => Boolean(r))
}

/** Test seam: replace the index with a fixed corpus. */
export function __setKnowledgeForTests(records: KnowledgeRecord[] | null) {
  cached = records ? { at: Date.now(), index: buildIndex(records) } : null
}
