import { describe, expect, it } from "vitest"
import { planSync, fingerprint, docIdFor, type LinkedDraft } from "./plan"
import type { HubSpotPost } from "./client"

const post = (id: string, state: string, updated = "2026-11-01T00:00:00Z"): HubSpotPost => ({
  id,
  name: `Post ${id}`,
  slug: `fruition-services-blog/post-${id}`,
  state,
  currentState: state,
  updated,
})

const draft = (p: HubSpotPost, extra: Record<string, unknown> = {}): LinkedDraft => ({
  id: `d-${p.id}`,
  metadata: {
    hubspot_post_id: p.id,
    hubspot_fingerprint: fingerprint(p),
    hubspot_state: p.currentState,
    ...extra,
  },
})

describe("planSync", () => {
  it("creates a portal draft for a new HubSpot draft and leaves the site alone", () => {
    const p = post("1", "DRAFT")
    const [plan] = planSync({ posts: [p], drafts: [], liveDocIds: new Set() }).posts
    expect(plan).toMatchObject({ draftId: null, writeDraft: true, publish: false, unpublish: false })
  })

  it("updates the portal draft when a HubSpot draft is edited", () => {
    const before = post("1", "DRAFT", "2026-11-01T00:00:00Z")
    const after = post("1", "DRAFT", "2026-11-02T00:00:00Z")
    const [plan] = planSync({ posts: [after], drafts: [draft(before)], liveDocIds: new Set() }).posts
    expect(plan).toMatchObject({ draftId: "d-1", writeDraft: true, publish: false })
  })

  it("does nothing on a quiet tick", () => {
    const p = post("1", "PUBLISHED")
    const [plan] = planSync({ posts: [p], drafts: [draft(p)], liveDocIds: new Set(["blog-hubspot-1"]) }).posts
    expect(plan).toMatchObject({ writeDraft: false, publish: false, unpublish: false })
  })

  it("publishes a post that goes live, to a stable doc id", () => {
    const before = post("1", "DRAFT")
    const after = post("1", "PUBLISHED", "2026-11-02T00:00:00Z")
    const [plan] = planSync({ posts: [after], drafts: [draft(before)], liveDocIds: new Set() }).posts
    expect(plan).toMatchObject({ docId: "blog-hubspot-1", publish: true, writeDraft: true })
  })

  it("republishes an edit to a live post", () => {
    const before = post("1", "PUBLISHED", "2026-11-01T00:00:00Z")
    const after = post("1", "PUBLISHED", "2026-11-03T00:00:00Z")
    const [plan] = planSync({ posts: [after], drafts: [draft(before)], liveDocIds: new Set(["blog-hubspot-1"]) }).posts
    expect(plan.publish).toBe(true)
  })

  it("puts a live post back when it went missing from the site", () => {
    const p = post("1", "PUBLISHED")
    const [plan] = planSync({ posts: [p], drafts: [draft(p)], liveDocIds: new Set() }).posts
    expect(plan.publish).toBe(true)
  })

  it("takes a post down when HubSpot unpublishes it", () => {
    const before = post("1", "PUBLISHED")
    const after = post("1", "DRAFT", "2026-11-02T00:00:00Z")
    const [plan] = planSync({ posts: [after], drafts: [draft(before)], liveDocIds: new Set(["blog-hubspot-1"]) }).posts
    expect(plan).toMatchObject({ publish: false, unpublish: true })
  })

  it("leaves a HubSpot draft alone that a teammate published from the portal", () => {
    const p = post("1", "DRAFT")
    const d = draft(p, { sanity_doc_id: "blog-portal-post-1" })
    const [plan] = planSync({ posts: [p], drafts: [d], liveDocIds: new Set(["blog-portal-post-1"]) }).posts
    expect(plan).toMatchObject({ docId: "blog-portal-post-1", unpublish: false, publish: false })
  })

  it("keeps publishing to the doc id the portal recorded", () => {
    expect(docIdFor("9", { id: "x", metadata: { sanity_doc_id: "blog-portal-foo" } })).toBe("blog-portal-foo")
    expect(docIdFor("9")).toBe("blog-hubspot-9")
  })

  it("deletes the draft and the live post when a post is deleted in HubSpot", () => {
    const gone = post("1", "PUBLISHED")
    const kept = post("2", "DRAFT")
    const plan = planSync({
      posts: [kept],
      drafts: [draft(gone), draft(kept)],
      liveDocIds: new Set(["blog-hubspot-1"]),
    })
    expect(plan.prune).toEqual([{ draftId: "d-1", hubspotPostId: "1", docId: "blog-hubspot-1" }])
  })

  it("never prunes when HubSpot returns nothing at all", () => {
    const p = post("1", "PUBLISHED")
    const plan = planSync({ posts: [], drafts: [draft(p)], liveDocIds: new Set(["blog-hubspot-1"]) })
    expect(plan.prune).toEqual([])
    expect(plan.pruneSkipped).toBeTruthy()
  })

  it("ignores portal drafts that did not come from HubSpot", () => {
    const plan = planSync({ posts: [], drafts: [{ id: "m", metadata: { slug: "x" } }], liveDocIds: new Set() })
    expect(plan.prune).toEqual([])
  })

  it("force rewrites everything", () => {
    const p = post("1", "PUBLISHED")
    const [plan] = planSync({ posts: [p], drafts: [draft(p)], liveDocIds: new Set(["blog-hubspot-1"]), force: true }).posts
    expect(plan).toMatchObject({ writeDraft: true, publish: true })
  })
})
