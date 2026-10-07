import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from "@/sanity/queries"
import { buildOgMetadata, buildOgImage } from "@/lib/metadata"
import BlogPostTemplate from "@/components/BlogPostTemplate"
import { notFound } from "next/navigation"

export const revalidate = 3600
export const dynamicParams = true

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, relatedPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRelatedBlogPosts(slug, 3),
  ])
  if (!post) notFound()

  return <BlogPostTemplate post={post} relatedPosts={relatedPosts} />
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(50, 0)
  return posts
    .filter((p: { slug?: string }) => typeof p.slug === "string" && p.slug.length > 0)
    .map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  const title = post.seoTitle || post.title || slug
  const description = post.seoDescription || post.excerpt || ""
  return {
    alternates: { canonical: `/post/${slug}` },
    title,
    description,
    ...(post.seoKeyword ? { keywords: [post.seoKeyword] } : {}),
    ...buildOgMetadata({
      title,
      description,
      path: `/post/${slug}`,
      ogImageSource: post.coverImage,
      extra: {
        openGraph: {
          type: "article",
          publishedTime: post.publishedAt,
        },
      },
    }),
  }
}
