import { notFound } from "next/navigation"
import { requirePortalUser, authorDisplayName } from "@/lib/portalAuth"
import { getBlogCategories, getBlogPostForPortalEdit, getTeamMembers } from "@/sanity/queries"
import { portableTextToMarkdown } from "@/lib/portableTextToMarkdown"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, {
  type CategoryOption,
  type BlogEditorInitial,
} from "@/components/internal/BlogEditor"
import SocialDraftsPanel from "@/components/internal/SocialDraftsPanel"
import BlogEditTabs from "@/components/internal/BlogEditTabs"
import { slugifyTitle } from "@/lib/social/zernio"

export const dynamic = "force-dynamic"

interface SanityPost {
  _id: string
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

/**
 * Edit a post that lives only in Sanity (published outside the portal drafts
 * workflow, e.g. migrated or Marketa-published). The portable-text body is
 * converted to markdown for the editor; publishing patches the same doc in
 * place (docId), so the live post updates rather than duplicating.
 */
export default async function EditPublishedPostPage({
  params,
}: {
  params: Promise<{ docId: string }>
}) {
  const { docId: rawDocId } = await params
  const docId = decodeURIComponent(rawDocId)
  const user = await requirePortalUser({ next: `/internal/blog/post/${rawDocId}/edit` })

  const post = (await getBlogPostForPortalEdit(docId).catch(() => null)) as SanityPost | null
  if (!post?._id) notFound()

  const [categories, team, currentAuthorName] = await Promise.all([
    getBlogCategories().catch(() => []) as Promise<CategoryOption[]>,
    getTeamMembers().catch(() => []) as Promise<{ name?: string }[]>,
    authorDisplayName(user),
  ])
  const authors = [...new Set(team.map((m) => m.name).filter((n): n is string => Boolean(n)))]

  const initial: BlogEditorInitial = {
    docId: post._id,
    title: post.title ?? "",
    body: portableTextToMarkdown(post.body),
    slug: post.slug,
    excerpt: post.excerpt,
    industry: post.industry,
    categoryIds: post.categoryIds ?? undefined,
    seoKeyword: post.seoKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    // The publish-date field is a date input, so "YYYY-MM-DD".
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : undefined,
    author: post.author,
  }

  const editorPane = (
    <div>
      {/* State and actions live in the editor's own header now, so repeating
          them here just pushed the writing surface further down. */}
      <BlogEditor
        categories={categories}
        authors={authors}
        currentAuthorName={currentAuthorName}
        initial={initial}
      />
    </div>
  )

  return (
    <PortalShell email={user.email} active="blog" title="Edit published post">
      <BlogEditTabs
        blog={editorPane}
        social={
          <SocialDraftsPanel
            source={{ slug: post.slug || slugifyTitle(post.title ?? ""), docId: post._id }}
            blog={{
              title: post.title ?? "",
              excerpt: post.excerpt,
              bodyMarkdown: initial.body,
              industry: post.industry,
              targetKeyword: post.seoKeyword,
            }}
          />
        }
      />
    </PortalShell>
  )
}
