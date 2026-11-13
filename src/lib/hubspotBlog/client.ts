/**
 * Read-only HubSpot CMS blog client for the HubSpot → Fruition blog sync.
 *
 * The posts live in HubSpot portal 442278519 ("OG Labs", AP1 region), blog
 * "Fruition Services blog". `api.hubapi.com` serves AP1 tokens too, so no
 * regional base URL is needed. Private-app scope: `content`.
 */

const POSTS_API = "https://api.hubapi.com/cms/v3/blogs/posts"
const AUTHORS_API = "https://api.hubapi.com/cms/v3/blogs/authors"

export type HubSpotState = "DRAFT" | "SCHEDULED" | "PUBLISHED"
export const HUBSPOT_STATES: HubSpotState[] = ["DRAFT", "SCHEDULED", "PUBLISHED"]

export interface HubSpotPost {
  id: string
  /** HubSpot's name for the title. */
  name: string
  /** Carries the blog path: "fruition-services-blog/<slug>". */
  slug: string
  state: string
  currentState?: string
  /** Last edit, ISO. The sync fingerprint. */
  updated?: string
  publishDate?: string
  postBody?: string
  postSummary?: string
  metaDescription?: string
  htmlTitle?: string
  featuredImage?: string
  featuredImageAltText?: string
  useFeaturedImage?: boolean
  blogAuthorId?: string
  contentGroupId?: string
}

async function hubspotGet<T>(url: URL, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`HubSpot ${res.status} ${url.pathname}: ${body.slice(0, 300)}`)
  }
  return (await res.json()) as T
}

/** Every non-archived post in one state, following the cursor. */
export async function listPostsInState(
  token: string,
  state: HubSpotState,
  contentGroupId?: string,
): Promise<HubSpotPost[]> {
  const posts: HubSpotPost[] = []
  let after: string | undefined
  for (let page = 0; page < 20; page++) {
    const url = new URL(POSTS_API)
    url.searchParams.set("limit", "100")
    url.searchParams.set("state", state)
    if (contentGroupId) url.searchParams.set("contentGroupId", contentGroupId)
    if (after) url.searchParams.set("after", after)
    const data = await hubspotGet<{ results?: HubSpotPost[]; paging?: { next?: { after?: string } } }>(url, token)
    posts.push(...(data.results ?? []))
    after = data.paging?.next?.after
    if (!after) return posts
  }
  throw new Error(`HubSpot ${state} posts did not finish paging; refusing a partial list`)
}

/**
 * Every live (non-archived) post in every state. Throws if any state fails:
 * a partial list would make the sync think the missing posts were deleted.
 * A deleted HubSpot post is archived, so it drops out of this list.
 */
export async function listAllPosts(token: string, contentGroupId?: string): Promise<HubSpotPost[]> {
  const lists = await Promise.all(HUBSPOT_STATES.map((s) => listPostsInState(token, s, contentGroupId)))
  const byId = new Map<string, HubSpotPost>()
  for (const p of lists.flat()) byId.set(p.id, p)
  return [...byId.values()]
}

/**
 * Author id → display name. A post's `authorName` is the last editor, not the
 * byline, so the byline has to come from `blogAuthorId`.
 */
export async function listAuthors(token: string): Promise<Record<string, string>> {
  const url = new URL(AUTHORS_API)
  url.searchParams.set("limit", "100")
  try {
    const data = await hubspotGet<{ results?: { id?: string; name?: string; displayName?: string }[] }>(url, token)
    const out: Record<string, string> = {}
    for (const a of data.results ?? []) {
      const name = a.displayName || a.name
      if (a.id && name) out[a.id] = name
    }
    return out
  } catch {
    return {} // bylines fall back; never fail a sync over it
  }
}
