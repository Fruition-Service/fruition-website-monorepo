import Link from "next/link"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getAllBlogPostsForPortal } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import BlogPerformanceTable from "@/components/internal/BlogPerformanceTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBlogPerformance } from "@/lib/googleAnalytics"
import BlogTable, { type PostRow } from "./BlogTable"

export const dynamic = "force-dynamic"

const WINDOW_DAYS = 28

interface DraftRow {
  id: string
  title: string | null
  metadata: Record<string, unknown> | null
  updated_at: string
}

interface SanityPost {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  _updatedAt?: string
  author?: string
  industry?: string
  excerpt?: string
}

/**
 * Merge portal drafts (Supabase) with every published post (Sanity) into one
 * table. A draft that was published from the portal gets the stable doc id
 * `blog-portal-<slug>` (see /api/internal/blog), so a draft and a Sanity post
 * with that id are the same logical post — one row, carrying both ids.
 */
/** Same normalisation the duplicate audit uses: case and punctuation are noise. */
function normaliseTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function buildRows(
  drafts: DraftRow[],
  posts: SanityPost[],
  traffic: Map<string, { views: number; clicks: number }>
): PostRow[] {
  const postsById = new Map(posts.map((p) => [p._id, p]))
  const postsBySlug = new Map(posts.filter((p) => p.slug).map((p) => [p.slug as string, p]))
  const claimed = new Set<string>()
  const rows: PostRow[] = []

  for (const draft of drafts) {
    const meta = (draft.metadata ?? {}) as Record<string, unknown>
    const slug = typeof meta.slug === "string" ? meta.slug : null
    // Same resolution order as the editor (src/lib/blogDraftLink.ts): the id
    // recorded at publish, then the portal's own id convention, then whichever
    // post owns the slug — so posts published by Marketa, monday or the Studio
    // still show as one row with their draft rather than two.
    const recorded = typeof meta.sanity_doc_id === "string" ? meta.sanity_doc_id : null
    const match =
      (recorded ? postsById.get(recorded) : undefined) ??
      (slug ? (postsById.get(`blog-portal-${slug}`) ?? postsBySlug.get(slug)) : undefined)
    if (match) claimed.add(match._id)

    const metaStatus = (meta.status as string) || "drafted"
    const status: PostRow["status"] = match
      ? "published"
      : metaStatus === "published" || metaStatus === "edited"
        ? (metaStatus as PostRow["status"])
        : "drafted"

    const updated = [draft.updated_at, match?._updatedAt, match?.publishedAt]
      .filter((d): d is string => Boolean(d))
      .sort()
      .pop() as string

    const slugKey = match?.slug || slug
    const t = slugKey ? traffic.get(slugKey) : undefined
    rows.push({
      key: draft.id,
      views: t?.views ?? null,
      clicks: t?.clicks ?? null,
      ageDays: Math.floor((Date.now() - Date.parse(updated)) / 86_400_000),
      duplicate: false,
      title: draft.title || match?.title || "Untitled",
      excerpt: (meta.excerpt as string) || match?.excerpt || null,
      status,
      industry: (meta.industry as string) || match?.industry || null,
      googleDocUrl: (meta.google_doc_url as string) || null,
      linkedinDocUrl: (meta.linkedin_doc_url as string) || null,
      linkedinCopyReady: Boolean(meta.linkedin_copy),
      updated,
      slug: match?.slug || slug,
      draftId: draft.id,
      sanityId: match?._id ?? null,
    })
  }

  for (const post of posts) {
    if (claimed.has(post._id)) continue
    const t = post.slug ? traffic.get(post.slug) : undefined
    const postUpdated = post._updatedAt || post.publishedAt || ""
    rows.push({
      key: post._id,
      views: t?.views ?? null,
      clicks: t?.clicks ?? null,
      ageDays: postUpdated ? Math.floor((Date.now() - Date.parse(postUpdated)) / 86_400_000) : 0,
      duplicate: false,
      title: post.title || "Untitled",
      excerpt: post.excerpt ?? null,
      status: "published",
      industry: post.industry ?? null,
      googleDocUrl: null,
      linkedinDocUrl: null,
      linkedinCopyReady: false,
      updated: post._updatedAt || post.publishedAt || "",
      slug: post.slug ?? null,
      draftId: null,
      sanityId: post._id,
    })
  }

  // A title filed more than once is the single biggest source of noise in this
  // list — 19 of the 73 drafts are a copy of another one.
  const seen = new Map<string, number>()
  for (const r of rows) {
    const k = normaliseTitle(r.title)
    seen.set(k, (seen.get(k) ?? 0) + 1)
  }
  for (const r of rows) {
    if ((seen.get(normaliseTitle(r.title)) ?? 0) > 1) r.duplicate = true
  }

  return rows
}

export default async function BlogIndexPage() {
  const user = await requirePortalUser({ next: "/internal/blog" })
  const admin = getPortalAdmin()

  // Drafts are a shared team workspace — fetch everyone's. Sanity holds every
  // post live on the site, whatever tool published it.
  const [{ data: drafts }, posts, performance] = await Promise.all([
    admin
      .from("portal_drafts")
      .select("id, title, metadata, updated_at")
      .order("updated_at", { ascending: false })
      .limit(500),
    getAllBlogPostsForPortal().catch(() => []) as Promise<SanityPost[]>,
    // Traffic sits on the row it belongs to, never a reason the page fails.
    getBlogPerformance(WINDOW_DAYS).catch(() => null),
  ])

  const traffic = new Map<string, { views: number; clicks: number }>()
  for (const p of performance?.posts ?? []) {
    traffic.set(p.slug, { views: p.views, clicks: p.search?.clicks ?? 0 })
  }

  const rows = buildRows((drafts ?? []) as DraftRow[], posts, traffic)
  const industries = [...new Set(rows.map((r) => r.industry).filter((i): i is string => Boolean(i)))].sort()
  const published = rows.filter((r) => r.status === "published").length
  const stale = rows.filter((r) => r.status !== "published" && r.ageDays > 30).length
  const duplicates = rows.filter((r) => r.duplicate).length
  const titles = new Map<string, string>()
  for (const p of posts) {
    if (p.slug && p.title) titles.set(p.slug, p.title)
  }

  return (
    <PortalShell email={user.email} active="blog" title="Blog posts">
      <PageHeader
        title="Blog posts"
        description={[
          `${published} published on the site, ${rows.length - published} in drafts.`,
          stale > 0 ? `${stale} untouched for over 30 days.` : null,
          duplicates > 0 ? `${duplicates} share a title with another row.` : null,
          "Marketa files one every weekday at 9am SGT.",
        ]
          .filter(Boolean)
          .join(" ")}
        actions={<Button render={<Link href="/internal/blog/new" />}>New post</Button>}
      />
      <BlogTable rows={rows} industries={industries} />

    </PortalShell>
  )
}
