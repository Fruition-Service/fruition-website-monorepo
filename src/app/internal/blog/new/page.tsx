import { requirePortalUser, authorDisplayName } from "@/lib/portalAuth"
import { getBlogCategories, getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, { type CategoryOption } from "@/components/internal/BlogEditor"

export const dynamic = "force-dynamic"

export default async function NewPostPage() {
  const user = await requirePortalUser({ next: "/internal/blog/new" })
  const [categories, team, currentAuthorName] = await Promise.all([
    getBlogCategories().catch(() => []) as Promise<CategoryOption[]>,
    getTeamMembers().catch(() => []) as Promise<{ name?: string }[]>,
    authorDisplayName(user),
  ])
  const authors = [...new Set(team.map((m) => m.name).filter((n): n is string => Boolean(n)))]

  return (
    <PortalShell email={user.email} active="new">
      {/* The shell header already says "New post", and the editor carries the
          post's state in its own header row. A third title just pushed the
          writing surface down the page. */}
      <BlogEditor categories={categories} authors={authors} currentAuthorName={currentAuthorName} />
    </PortalShell>
  )
}
