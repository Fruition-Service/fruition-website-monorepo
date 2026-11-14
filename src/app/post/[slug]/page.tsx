import "@/styles/vc/pages/blog-post.css"
import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from "@/sanity/queries"
import { getVcPage } from "@/sanity/vcQueries"
import { vercelStegaClean } from "@vercel/stega"
import { buildOgMetadata } from "@/lib/metadata"
import { BOOKING_ANCHOR } from "@/lib/bookingLink"
import BlogPostTemplate from "@/components/BlogPostTemplate"
import type { VcClosingData } from "@/components/vc/types"
import { notFound } from "next/navigation"

/**
 * The closing band every post shares: the /consulting-blog page's own (Sanity,
 * vcPage-consulting-blog). Its "#book" CTA points at that page's booking band,
 * which a post does not have, so it goes to the contact page's instead.
 */
async function blogClosing(): Promise<VcClosingData | null> {
  const page = await getVcPage("/consulting-blog")
  const s = page?.sections?.find((x) => x._type === "vcClosing") as VcClosingData | undefined
  if (!s) return null
  return {
    ...s,
    ctas: s.ctas?.map((c) => (vercelStegaClean(c.href ?? "") === "#book" ? { ...c, href: BOOKING_ANCHOR } : c)),
  }
}

export const revalidate = 3600
export const dynamicParams = true

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, closing] = await Promise.all([getBlogPostBySlug(slug), blogClosing()])
  if (!post) notFound()
  // Related: same category first, then the newest posts.
  const categoryIds = ((post.categories ?? []) as { _id?: string }[]).map((c) => c?._id).filter((id): id is string => !!id)
  const relatedPosts = await getRelatedBlogPosts(slug, 3, categoryIds)

  return <BlogPostTemplate post={post} relatedPosts={relatedPosts} closing={closing} />
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
