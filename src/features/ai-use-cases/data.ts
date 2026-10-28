import "server-only"

import type { IndustryMeta, IndustryUseCases, UseCase, UseCaseIndex, UseCaseTile } from "./types"
import { USE_CASES_DATA_PATH, toTile } from "./types"
import {
  LANDING_PAGE_USE_CASES,
  pickFeaturedUseCases,
  type FeaturedUseCaseSource,
  type LandingPagePath,
} from "./featured"

/**
 * Loads the use case catalogue from `public/data/ai-use-cases/`.
 *
 * The files are deliberately not imported: the site Worker sits close to
 * Cloudflare's script size cap, and bundling ~1 MB of copy would push it
 * over. Instead they ship as static assets. `next build` (and `next dev`)
 * read them from disk; an ISR re-render inside the Worker, where there is no
 * project directory, fetches them through the ASSETS binding.
 */

const cache = new Map<string, Promise<unknown>>()

async function readFromDisk<T>(name: string): Promise<T> {
  const { readFile } = await import("node:fs/promises")
  const { join } = await import("node:path")
  const file = join(process.cwd(), "public", USE_CASES_DATA_PATH, name)
  return JSON.parse(await readFile(file, "utf8")) as T
}

async function readFromAssets<T>(name: string): Promise<T> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare")
  const { env } = await getCloudflareContext({ async: true })
  const assets = (env as { ASSETS?: { fetch: (input: string) => Promise<Response> } }).ASSETS
  if (!assets) throw new Error("ASSETS binding is not available")
  const res = await assets.fetch(`https://assets.local${USE_CASES_DATA_PATH}/${name}`)
  if (!res.ok) throw new Error(`ASSETS ${name}: ${res.status}`)
  return (await res.json()) as T
}

function readDataFile<T>(name: string): Promise<T> {
  let pending = cache.get(name) as Promise<T> | undefined
  if (!pending) {
    pending = readFromDisk<T>(name).catch(() => readFromAssets<T>(name))
    // A failed read must not stick for the life of the isolate.
    pending.catch(() => cache.delete(name))
    cache.set(name, pending)
  }
  return pending
}

export function getUseCaseIndex(): Promise<UseCaseIndex> {
  return readDataFile<UseCaseIndex>("index.json")
}

/** One industry's page data, or null for an unknown slug. */
export async function getIndustryUseCases(slug: string): Promise<IndustryUseCases | null> {
  const index = await getUseCaseIndex()
  if (!index.industries.some((i) => i.slug === slug)) return null
  return readDataFile<IndustryUseCases>(`${slug}.json`)
}

/** Every use case, in the hub's display order. */
export async function getAllUseCases(): Promise<UseCase[]> {
  const index = await getUseCaseIndex()
  const pages = await Promise.all(
    index.industries.map((i) => readDataFile<IndustryUseCases>(`${i.slug}.json`)),
  )
  const rank = new Map(index.order.map((id, i) => [id, i]))
  return pages
    .flatMap((p) => p.useCases)
    .sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity))
}

/**
 * The featured use cases for an industry landing page. Returns null rather
 * than throwing, so a missing data file can never take a landing page down.
 */
export async function getFeaturedUseCases(
  path: LandingPagePath,
  limit = 6,
): Promise<{ industry: IndustryMeta; tiles: UseCaseTile[]; heading?: string } | null> {
  const source: FeaturedUseCaseSource = LANDING_PAGE_USE_CASES[path]
  try {
    const data = await getIndustryUseCases(source.industrySlug)
    if (!data) return null
    const industry: IndustryMeta = {
      key: data.key,
      slug: data.slug,
      name: data.name,
      count: data.count,
      aiCount: data.aiCount,
    }
    const tiles = pickFeaturedUseCases(data.useCases, source, limit).map(toTile)
    return tiles.length ? { industry, tiles, ...(source.heading ? { heading: source.heading } : {}) } : null
  } catch (err) {
    console.error(`[ai-use-cases] featured use cases for ${path} failed:`, err)
    return null
  }
}
