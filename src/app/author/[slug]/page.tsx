import { getBlogAuthors, getPostsByAuthor, getTeamMemberByName } from "@/sanity/queries"
import AuthorProfileTemplate from "@/components/AuthorProfileTemplate"
import { notFound } from "next/navigation"
import { buildOgMetadata } from "@/lib/metadata"
import { bioPlainText } from "@/lib/bioLinks"

export const revalidate = 3600
export const dynamicParams = true

async function resolveAuthor(slug: string) {
  const authors = await getBlogAuthors()
  return authors.find((a) => a.slug === slug) ?? null
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = await resolveAuthor(slug)
  if (!author) notFound()

  const [posts, member] = await Promise.all([
    getPostsByAuthor(author.name),
    getTeamMemberByName(author.name),
  ])

  return (
    <AuthorProfileTemplate
      name={author.name}
      postCount={author.postCount}
      posts={posts}
      member={member}
    />
  )
}

export async function generateStaticParams() {
  const authors = await getBlogAuthors()
  return authors.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = await resolveAuthor(slug)
  if (!author) return {}
  const member = await getTeamMemberByName(author.name)
  const description = (member?.bio ? bioPlainText(member.bio).slice(0, 155) : "") || "Articles written by " + author.name + " on the Fruition consulting blog."
  const ogImageSource = member?.photo ?? undefined
  const title = author.name + ": Fruition Blog"
  return {
    alternates: { canonical: `/author/${slug}` },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: `/author/${slug}`,
      ogImageSource,
    }),
  }
}
