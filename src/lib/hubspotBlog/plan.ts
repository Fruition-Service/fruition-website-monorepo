/**
 * What one run of the HubSpot → Fruition blog sync has to do. Pure, so the
 * rules can be tested without HubSpot, Supabase or Sanity, and without putting
 * a test post on the live site.
 *
 * HubSpot is the source of truth for every post that came from it:
 *
 *   HubSpot                     Fruition portal draft     Fruition site (Sanity)
 *   created / edited as DRAFT   created / updated         untouched (not live)
 *   SCHEDULED                   created / updated         untouched until it goes live
 *   PUBLISHED (or edited live)  updated, status published post created / updated
 *   PUBLISHED → DRAFT           updated, status drafted   post removed
 *   deleted (archived)          draft deleted             post removed
 *
 * HubSpot wins on every post it owns: a live HubSpot post deleted on the
 * Fruition side comes back on the next run, so take it down in HubSpot.
 *
 * Posts that did not come from HubSpot are never touched: only portal drafts
 * carrying `metadata.hubspot_post_id` are in scope.
 */

import type { HubSpotPost } from "./client"

/** A portal draft that is linked to a HubSpot post. */
export interface LinkedDraft {
  id: string
  metadata: Record<string, unknown>
}

export interface PostPlan {
  post: HubSpotPost
  /** The linked draft, if one exists already. */
  draftId: string | null
  /** The Sanity document this post publishes to. */
  docId: string
  /** Write the portal draft (create or update). */
  writeDraft: boolean
  /** Create or update the live post in Sanity. */
  publish: boolean
  /** Remove the live post from Sanity. */
  unpublish: boolean
}

export interface PrunePlan {
  draftId: string
  hubspotPostId: string
  /** Live Sanity document to remove with it, if any. */
  docId: string | null
}

export interface SyncPlan {
  posts: PostPlan[]
  prune: PrunePlan[]
  /** Set when pruning was skipped on purpose, with the reason. */
  pruneSkipped?: string
}

export const isLive = (p: HubSpotPost): boolean => (p.currentState ?? p.state) === "PUBLISHED"

/** Changes whenever the post is edited or changes state. */
export function fingerprint(p: HubSpotPost): string {
  return `${p.updated ?? ""}|${p.currentState ?? p.state}`
}

/**
 * The Sanity id a HubSpot post publishes to. A draft that was published from
 * the portal records its own id (`sanity_doc_id`); keep using it so the post
 * never ends up as two documents on one slug.
 */
export function docIdFor(postId: string, draft?: LinkedDraft): string {
  const recorded = draft?.metadata.sanity_doc_id
  return typeof recorded === "string" && recorded ? recorded : `blog-hubspot-${postId}`
}

export function planSync(input: {
  posts: HubSpotPost[]
  drafts: LinkedDraft[]
  /** Ids of the Sanity blogPost documents that exist right now. */
  liveDocIds: Set<string>
  /** Re-write every post even if HubSpot has not changed it. */
  force?: boolean
}): SyncPlan {
  const { posts, drafts, liveDocIds, force = false } = input
  const draftByPost = new Map<string, LinkedDraft>()
  for (const d of drafts) {
    const id = d.metadata.hubspot_post_id
    if (typeof id === "string" && id) draftByPost.set(id, d)
  }

  const plans: PostPlan[] = posts.map((post) => {
    const draft = draftByPost.get(post.id)
    const docId = docIdFor(post.id, draft)
    const changed = force || !draft || draft.metadata.hubspot_fingerprint !== fingerprint(post)
    const live = isLive(post)
    const inSanity = liveDocIds.has(docId)
    return {
      post,
      draftId: draft?.id ?? null,
      docId,
      writeDraft: changed,
      // Live and (edited, or missing from the site: someone deleted it there,
      // or an earlier publish failed). HubSpot wins either way.
      publish: live && (changed || !inSanity),
      // Only withdraw what HubSpot itself took offline (we last saw it live).
      // A HubSpot draft that a teammate published from the portal stays up.
      unpublish: !live && inSanity && draft?.metadata.hubspot_state === "PUBLISHED",
    }
  })

  const seen = new Set(posts.map((p) => p.id))
  const orphans = [...draftByPost.entries()].filter(([id]) => !seen.has(id))
  // An empty answer from HubSpot is far more likely an outage or a wrong token
  // than every post having been deleted at once. Never clear the blog on it.
  if (posts.length === 0 && orphans.length > 0) {
    return { posts: plans, prune: [], pruneSkipped: "HubSpot returned no posts at all" }
  }
  const prune: PrunePlan[] = orphans.map(([hubspotPostId, d]) => {
    const docId = docIdFor(hubspotPostId, d)
    return { draftId: d.id, hubspotPostId, docId: liveDocIds.has(docId) ? docId : null }
  })
  return { posts: plans, prune }
}
