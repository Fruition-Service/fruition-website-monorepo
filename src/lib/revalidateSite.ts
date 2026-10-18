import { revalidatePath } from "next/cache"
import { authorSlug } from "@/sanity/authorSlug"
import type { RegionSlug } from "@/components/region/types"

/**
 * Drop the cached copies of every page a blog post appears on.
 *
 * The site runs on OpenNext/Workers with a persistent ISR cache in KV
 * (open-next.config.ts), so a rendered page survives isolate restarts and
 * even the `revalidate = 3600` window is only honoured when something asks
 * for a re-render. `revalidatePath` is what asks — it writes the path's tag
 * to the KV tag cache (NEXT_TAG_CACHE_KV), and the next request to that path
 * misses the cache and re-renders from Sanity.
 *
 * Without the tag cache binding this is a silent no-op, which is exactly why
 * updating a published post used to change Sanity but never the live site.
 *
 * Never let a cache miss fail a publish: the write to Sanity has already
 * happened by the time this runs, so failures are collected and reported back
 * as a warning rather than thrown.
 */
export function revalidateBlogPaths({
  slug,
  previousSlug,
  author,
}: {
  slug: string
  /** Set when the post's slug changed — the old URL needs flushing too. */
  previousSlug?: string
  author?: string
}): { revalidated: string[]; failed: string[] } {
  // The `type` argument matters more than it looks. A rendered page carries
  // the tag `_N_T_<its real url>` plus `_N_T_<its route pattern>/page`, and
  // revalidatePath writes `_N_T_<path>` without a type but `_N_T_<path>/page`
  // with one. So a concrete URL must be passed untyped, and only the dynamic
  // route pattern (which stands in for every category page, so their slugs
  // don't have to be resolved) takes "page". Getting this backwards writes a
  // tag nothing is listening for and the stale page keeps serving.
  const targets: [string, ("page" | "layout")?][] = [
    [`/post/${slug}`],
    ["/consulting-blog"],
    ["/consulting-blog/categories/[slug]", "page"],
    ["/sitemap.xml"],
    ["/"],
  ]
  if (previousSlug && previousSlug !== slug) targets.push([`/post/${previousSlug}`])
  if (author) targets.push([`/author/${authorSlug(author)}`])

  const revalidated: string[] = []
  const failed: string[] = []
  for (const [path, type] of targets) {
    try {
      if (type) revalidatePath(path, type)
      else revalidatePath(path)
      revalidated.push(path)
    } catch (err) {
      console.error(`[revalidate] ${path} failed:`, err instanceof Error ? err.message : err)
      failed.push(path)
    }
  }
  return { revalidated, failed }
}

/** Every page that renders the team grid. A Record so a new region slug fails typecheck here. */
const TEAM_REGION_PAGES: Record<RegionSlug, true> = {
  "monday-partner-australia": true,
  "monday-partner-uk": true,
  "monday-partner-us": true,
  "monday-partner-singapore": true,
  "monday-partner-india": true,
  "monday-partner-philippines": true,
}

/**
 * Drop the cached copies of every page that shows team-member cards, after a
 * portal edit to a `teamMember` doc. Same contract as revalidateBlogPaths:
 * concrete URLs only, passed untyped, and failures are reported, not thrown.
 */
export function revalidateTeamPaths(memberName?: string): { revalidated: string[]; failed: string[] } {
  const paths = ["/fruition-team", ...Object.keys(TEAM_REGION_PAGES).map((s) => `/${s}`)]
  if (memberName) paths.push(`/author/${authorSlug(memberName)}`)
  const revalidated: string[] = []
  const failed: string[] = []
  for (const path of paths) {
    try {
      revalidatePath(path)
      revalidated.push(path)
    } catch (err) {
      console.error(`[revalidate] ${path} failed:`, err instanceof Error ? err.message : err)
      failed.push(path)
    }
  }
  return { revalidated, failed }
}
