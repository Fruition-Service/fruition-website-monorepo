import { notFound } from "next/navigation"
import { requirePortalUser, getPortalAdmin, authorDisplayName } from "@/lib/portalAuth"
import { getBlogCategories, getBlogPostForPortalEdit, getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, {
  type CategoryOption,
  type BlogEditorInitial,
  type BlogEditorFields,
} from "@/components/internal/BlogEditor"
import SocialDraftsPanel from "@/components/internal/SocialDraftsPanel"
import BlogEditTabs from "@/components/internal/BlogEditTabs"
import { slugifyTitle } from "@/lib/social/zernio"
import { resolveLiveDocId } from "@/lib/blogDraftLink"
import { portableTextToMarkdown } from "@/lib/portableTextToMarkdown"

export const dynamic = "force-dynamic"

/** The live Sanity post a draft is the working copy of, when there is one. */
interface LivePost {
  title?: string
  slug?: string
  publishedAt?: string
  author?: string
  industry?: string
  excerpt?: string
  seoKeyword?: string
  seoTitle?: string
  seoDescription?: string
  body?: unknown
  categoryIds?: string[]
}

interface DraftRow {
  id: string
  title: string | null
  body_markdown: string | null
  metadata: Record<string, unknown> | null
}

export default async function EditDraftPage({
  params,
}: {
  params: Promise<{ draftId: string }>
}) {
  const { draftId } = await params
  const user = await requirePortalUser({ next: `/internal/blog/${draftId}/edit` })

  // Drafts are a shared team workspace: any signed-in portal user can open any
  // draft by its link. The portal is already domain-locked to
  // @fruitionservices.io (requirePortalUser above), so there's no per-author gate.
  const { data } = await getPortalAdmin()
    .from("portal_drafts")
    .select("id, title, body_markdown, metadata")
    .eq("id", draftId)
    .maybeSingle()

  const draft = data as DraftRow | null
  if (!draft) notFound()

  const [categories, team, currentAuthorName] = await Promise.all([
    getBlogCategories().catch(() => []) as Promise<CategoryOption[]>,
    getTeamMembers().catch(() => []) as Promise<{ name?: string }[]>,
    authorDisplayName(user),
  ])
  const authors = [...new Set(team.map((m) => m.name).filter((n): n is string => Boolean(n)))]
  const meta = (draft.metadata ?? {}) as Record<string, unknown>
  const metaSlug = typeof meta.slug === "string" ? meta.slug : undefined
  // A draft can be the editing copy of a post that's already live. Resolving
  // its Sanity id here is what turns the primary action into "Update post" and
  // makes the write land on the live document instead of forking a new one.
  const liveDocId = await resolveLiveDocId(meta, metaSlug).catch(() => null)
  // The live post is the diff baseline: "Update post" lights up only when the
  // draft differs from what readers currently see.
  const livePost = liveDocId
    ? ((await getBlogPostForPortalEdit(liveDocId).catch(() => null)) as LivePost | null)
    : null
  const live: BlogEditorFields | undefined = livePost
    ? {
        title: livePost.title,
        slug: livePost.slug,
        excerpt: livePost.excerpt,
        industry: livePost.industry,
        categoryIds: livePost.categoryIds ?? undefined,
        seoKeyword: livePost.seoKeyword,
        seoTitle: livePost.seoTitle,
        seoDescription: livePost.seoDescription,
        publishedAt: livePost.publishedAt?.slice(0, 10),
        author: livePost.author,
        body: portableTextToMarkdown(livePost.body),
      }
    : undefined

  const metaStr = (key: string): string | undefined =>
    typeof meta[key] === "string" && meta[key] ? (meta[key] as string) : undefined

  // Sidebar fields fall back to the live post so the editor shows what's
  // actually on the site. The slug especially: leaving it to be re-derived
  // from the title would silently move a live post's URL on the next update.
  const initial: BlogEditorInitial = {
    draftId: draft.id,
    docId: liveDocId ?? undefined,
    live,
    title: draft.title ?? live?.title ?? "",
    body: draft.body_markdown ?? live?.body ?? "",
    slug: metaSlug ?? live?.slug,
    excerpt: metaStr("excerpt") ?? live?.excerpt,
    industry: metaStr("industry") ?? live?.industry,
    categoryIds: Array.isArray(meta.categoryIds)
      ? (meta.categoryIds as string[])
      : live?.categoryIds,
    // Generated drafts store the keyword as target_keyword; editor saves use seoKeyword.
    seoKeyword: metaStr("seoKeyword") ?? metaStr("target_keyword") ?? live?.seoKeyword,
    seoTitle: metaStr("seoTitle") ?? live?.seoTitle,
    seoDescription: metaStr("seoDescription") ?? live?.seoDescription,
    publishedAt: metaStr("publishedAt")?.slice(0, 10) ?? live?.publishedAt,
    author: metaStr("author") ?? live?.author,
    metadata: meta,
  }

  const title = draft.title ?? ""
  const socialSlug = initial.slug || (title ? slugifyTitle(title) : "")

  const editorPane = (
    <div>
      <BlogEditor
        categories={categories}
        authors={authors}
        currentAuthorName={currentAuthorName}
        initial={initial}
      />
    </div>
  )

  return (
    <PortalShell email={user.email} active="new">
      {socialSlug ? (
        <BlogEditTabs
          blog={editorPane}
          social={
            <SocialDraftsPanel
              source={{ slug: socialSlug, draftId: draft.id }}
              blog={{
                title,
                excerpt: initial.excerpt,
                bodyMarkdown: draft.body_markdown ?? undefined,
                industry: initial.industry,
                targetKeyword: initial.seoKeyword,
              }}
            />
          }
        />
      ) : (
        editorPane
      )}
    </PortalShell>
  )
}
