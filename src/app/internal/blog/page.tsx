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
function buildRows(drafts: DraftRow[], posts: SanityPost[]): PostRow[] {
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

    rows.push({
      key: draft.id,
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
    rows.push({
      key: post._id,
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
    // Analytics is a side panel on this page, never a reason it fails to load.
    getBlogPerformance(28).catch(() => null),
  ])

  const rows = buildRows((drafts ?? []) as DraftRow[], posts)
  const industries = [...new Set(rows.map((r) => r.industry).filter((i): i is string => Boolean(i)))].sort()
  const published = rows.filter((r) => r.status === "published").length
  const titles = new Map<string, string>()
  for (const p of posts) {
    if (p.slug && p.title) titles.set(p.slug, p.title)
  }

  return (
    <PortalShell email={user.email} active="blog" title="Blog posts">
      <PageHeader
        title="Blog posts"
        description={`${published} published on the site, ${rows.length - published} in drafts. Marketa drafts land here daily at 9am SGT.`}
        actions={<Button render={<Link href="/internal/blog/new" />}>New post</Button>}
      />
      <BlogTable rows={rows} industries={industries} />

      {performance && performance.posts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-ink-heading">Performance</CardTitle>
            <CardDescription>
              Top posts by views over the last 28 days.{" "}
              <Link href="/internal/insights" className="underline">
                See all posts and competitor data
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BlogPerformanceTable
              posts={performance.posts}
              titles={titles}
              limit={10}
              ctaTrackingIdle={performance.ctaTrackingIdle}
            />
          </CardContent>
        </Card>
      ) : null}
    </PortalShell>
  )
}
