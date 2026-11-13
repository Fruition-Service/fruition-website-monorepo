/**
 * HubSpot → Fruition blog sync: carries out the plan from plan.ts.
 *
 * Runs every 5 minutes from the Worker's cron (workers/site-entry.ts →
 * /api/cron/hubspot-blog-sync). Thana writes in HubSpot (portal 442278519,
 * "Fruition Services blog"); every draft, edit, publish, unpublish and delete
 * there is mirrored into the portal's blog CMS (Supabase `portal_drafts`) and,
 * when live, onto the site (Sanity `blogPost`, served at /post/<slug>).
 *
 * WEBSITE ONLY. Publishing here never creates social posts: nothing in this
 * module touches Zernio, Marketa or the social composer, and the Sanity
 * webhook it triggers only refreshes caches. Social stays a deliberate,
 * on-demand step in the portal. sync.test.ts guards this.
 */

import { getPortalAdmin } from "@/lib/portalAuth"
import {
  upsertBlogPost,
  uploadImageAsset,
  deleteDocument,
  getBlogPostCacheKeys,
  sideloadBodyImages,
  existingBlogPostIds,
} from "@/lib/sanityWriteClient"
import { fetchRemoteImage } from "@/lib/remoteImage"
import { revalidateBlogPaths } from "@/lib/revalidateSite"
import { bumpEdgeContentVersion } from "@/lib/edgeContentVersion"
import { listAllPosts, listAuthors, type HubSpotPost } from "./client"
import { htmlToMarkdown, htmlToText, toFruitionBrand } from "./htmlToMarkdown"
import { categoriesFor, industryFor } from "./categories"
import { planSync, fingerprint, isLive, docIdFor, type LinkedDraft, type PostPlan } from "./plan"

export interface SyncOptions {
  token: string
  /** Report what would change, write nothing. */
  dryRun?: boolean
  /** Rewrite every post even if HubSpot has not changed it. */
  force?: boolean
  /** Restrict to one HubSpot blog (contentGroupId). */
  contentGroupId?: string
}

export interface SyncReport {
  ok: boolean
  dryRun: boolean
  hubspotPosts: number
  draftsWritten: string[]
  published: string[]
  unpublished: string[]
  deleted: string[]
  pruneSkipped?: string
  errors: string[]
  warnings: string[]
}

/** The bare slug: HubSpot prefixes the blog path ("fruition-services-blog/<slug>"). */
export function bareSlug(post: HubSpotPost): string {
  const raw = (post.slug ?? "").split("/").filter(Boolean).pop() ?? ""
  const slug = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150)
  return slug || `hubspot-${post.id}`
}

/** Everything the portal and Sanity need, derived from one HubSpot post. */
export function toFruitionPost(post: HubSpotPost, authors: Record<string, string>) {
  const title = toFruitionBrand(post.name?.trim() || "Untitled")
  const body = toFruitionBrand(htmlToMarkdown(post.postBody ?? ""))
  const summary = htmlToText(post.postSummary ?? "")
  const excerpt = toFruitionBrand((post.metaDescription?.trim() || summary).slice(0, 300))
  return {
    title,
    body,
    slug: bareSlug(post),
    excerpt,
    seoTitle: post.htmlTitle ? toFruitionBrand(post.htmlTitle.trim()) : undefined,
    seoDescription: post.metaDescription ? toFruitionBrand(post.metaDescription.trim()) : undefined,
    author: (post.blogAuthorId && authors[post.blogAuthorId]) || undefined,
    publishedAt: post.publishDate || undefined,
    coverUrl: post.useFeaturedImage !== false && post.featuredImage ? post.featuredImage : undefined,
  }
}

async function loadLinkedDrafts(): Promise<LinkedDraft[]> {
  const { data, error } = await getPortalAdmin()
    .from("portal_drafts")
    .select("id, metadata")
    .not("metadata->>hubspot_post_id", "is", null)
  if (error) throw new Error(`portal_drafts read failed: ${error.message}`)
  return (data ?? []).map((r) => ({ id: r.id as string, metadata: (r.metadata ?? {}) as Record<string, unknown> }))
}

/** Upload the HubSpot cover once; reuse the asset while the source URL is unchanged. */
async function coverAsset(
  coverUrl: string | undefined,
  slug: string,
  meta: Record<string, unknown>,
): Promise<{ assetId?: string; warning?: string }> {
  if (!coverUrl) return {}
  if (meta.hubspot_cover_source === coverUrl && typeof meta.cover_image_asset_id === "string") {
    return { assetId: meta.cover_image_asset_id }
  }
  try {
    const img = await fetchRemoteImage(coverUrl)
    return { assetId: await uploadImageAsset(img.bytes, img.mime, `blog-${slug}`) }
  } catch (err) {
    return { warning: `Cover for ${slug} not uploaded: ${err instanceof Error ? err.message : String(err)}` }
  }
}

async function unpublishDoc(docId: string): Promise<string | null> {
  const live = await getBlogPostCacheKeys(docId).catch(() => null)
  await deleteDocument(docId)
  if (live?.slug) revalidateBlogPaths({ slug: live.slug, author: live.author ?? undefined })
  return live?.slug ?? docId
}

async function applyPost(
  plan: PostPlan,
  authors: Record<string, string>,
  existingMeta: Record<string, unknown>,
  report: SyncReport,
): Promise<boolean> {
  const { post } = plan
  const fp = toFruitionPost(post, authors)
  // Carry every key through: Marketa and the editor keep their own state in
  // this blob (docs/architecture.md §9).
  const meta: Record<string, unknown> = {
    ...existingMeta,
    source: "hubspot",
    hubspot_post_id: post.id,
    hubspot_state: post.currentState ?? post.state,
    hubspot_updated: post.updated ?? null,
    hubspot_fingerprint: fingerprint(post),
    slug: fp.slug,
    excerpt: fp.excerpt,
    seo_title: fp.seoTitle ?? existingMeta.seo_title,
    seo_description: fp.seoDescription ?? existingMeta.seo_description,
    author: fp.author ?? existingMeta.author,
  }
  let body = fp.body
  let siteChanged = false

  if (plan.publish) {
    const cover = await coverAsset(fp.coverUrl, fp.slug, existingMeta)
    if (cover.warning) report.warnings.push(cover.warning)
    if (cover.assetId) {
      meta.cover_image_asset_id = cover.assetId
      meta.hubspot_cover_source = fp.coverUrl
    }
    const side = await sideloadBodyImages(body).catch((err) => ({
      body,
      warnings: [`Image side-loading failed: ${err instanceof Error ? err.message : String(err)}`],
    }))
    body = side.body
    report.warnings.push(...side.warnings)
    const result = await upsertBlogPost({
      docId: plan.docId,
      title: fp.title,
      body,
      slug: fp.slug,
      excerpt: fp.excerpt || undefined,
      author: fp.author,
      seoTitle: fp.seoTitle,
      seoDescription: fp.seoDescription,
      coverImageAssetId: cover.assetId,
      publishedAt: fp.publishedAt,
      categoryIds: categoriesFor(fp),
      industry: industryFor(fp),
    })
    revalidateBlogPaths({ slug: result.slug, previousSlug: result.previousSlug, author: fp.author })
    meta.sanity_doc_id = plan.docId
    meta.status = "published"
    report.published.push(fp.slug)
    siteChanged = true
  } else if (plan.unpublish) {
    await unpublishDoc(plan.docId)
    report.unpublished.push(fp.slug)
    siteChanged = true
  }
  if (!isLive(post)) meta.status = "drafted"

  if (plan.writeDraft || plan.publish || plan.unpublish) {
    const admin = getPortalAdmin()
    const row = {
      title: fp.title,
      body_markdown: body,
      // Status lives in metadata.status (the portal reads it there; the
      // table's own status column was never migrated in production).
      metadata: meta,
      updated_at: new Date().toISOString(),
    }
    const { error } = plan.draftId
      ? await admin.from("portal_drafts").update(row).eq("id", plan.draftId)
      : await admin.from("portal_drafts").insert(row)
    if (error) throw new Error(`portal draft write failed: ${error.message}`)
    report.draftsWritten.push(fp.slug)
  }
  return siteChanged
}

export async function runHubSpotBlogSync(opts: SyncOptions): Promise<SyncReport> {
  const report: SyncReport = {
    ok: true,
    dryRun: Boolean(opts.dryRun),
    hubspotPosts: 0,
    draftsWritten: [],
    published: [],
    unpublished: [],
    deleted: [],
    errors: [],
    warnings: [],
  }

  const [posts, authors, drafts] = await Promise.all([
    listAllPosts(opts.token, opts.contentGroupId),
    listAuthors(opts.token),
    loadLinkedDrafts(),
  ])
  report.hubspotPosts = posts.length
  const draftByPost = new Map(drafts.map((d) => [String(d.metadata.hubspot_post_id), d]))
  const candidateIds = [
    ...posts.map((p) => docIdFor(p.id, draftByPost.get(p.id))),
    ...drafts.map((d) => docIdFor(String(d.metadata.hubspot_post_id), d)),
  ]
  const liveDocIds = await existingBlogPostIds([...new Set(candidateIds)])
  const plan = planSync({ posts, drafts, liveDocIds, force: opts.force })
  if (plan.pruneSkipped) report.pruneSkipped = plan.pruneSkipped

  if (opts.dryRun) {
    for (const p of plan.posts) {
      const slug = bareSlug(p.post)
      if (p.writeDraft) report.draftsWritten.push(slug)
      if (p.publish) report.published.push(slug)
      if (p.unpublish) report.unpublished.push(slug)
    }
    report.deleted = plan.prune.map((p) => p.hubspotPostId)
    return report
  }

  let siteChanged = false
  for (const p of plan.posts) {
    if (!p.writeDraft && !p.publish && !p.unpublish) continue
    try {
      const existingMeta = p.draftId ? (draftByPost.get(p.post.id)?.metadata ?? {}) : {}
      if (await applyPost(p, authors, existingMeta, report)) siteChanged = true
    } catch (err) {
      report.ok = false
      report.errors.push(`${bareSlug(p.post)}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  for (const orphan of plan.prune) {
    try {
      if (orphan.docId) {
        await unpublishDoc(orphan.docId)
        siteChanged = true
      }
      const { error } = await getPortalAdmin().from("portal_drafts").delete().eq("id", orphan.draftId)
      if (error) throw new Error(error.message)
      report.deleted.push(orphan.hubspotPostId)
    } catch (err) {
      report.ok = false
      report.errors.push(`delete ${orphan.hubspotPostId}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // The fruition-edge HTML cache keys on a content version; bump it so the
  // change shows on plain URLs within a couple of minutes.
  if (siteChanged) await bumpEdgeContentVersion().catch(() => null)
  return report
}
