import type { Metadata } from "next"
import { getBlogPosts, getBlogCategories } from "@/sanity/queries"
import BlogCard from "@/components/BlogCard"
import { buildOgMetadata } from "@/lib/metadata"
import { notFound } from "next/navigation"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catName = slug.replace(/-/g, " ")
  const title = catName + ": Fruition Blog"
  const description = "Browse all Fruition consulting blog posts in the " + catName + " category."
  return {
    title,
    description,
    alternates: { canonical: "/consulting-blog/categories/" + slug },
    robots: { index: false, follow: true },
    ...buildOgMetadata({
      title,
      description,
      path: "/consulting-blog/categories/" + slug,
    }),
  }
}

interface BlogCategoryRef { slug: string }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [categories, posts] = await Promise.all([getBlogCategories(), getBlogPosts(300, 0)])
  // Unknown categories must 404, not render an empty 200 shell.
  if (!categories.some((c: { slug?: string }) => c.slug === slug)) notFound()
  const filtered = posts.filter((p: { categories?: BlogCategoryRef[] }) =>
    p.categories?.some((c) => c.slug === slug)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-body mb-8 capitalize">{slug.replace(/-/g, " ")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post: Parameters<typeof BlogCard>[0]) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner contained={false} className="mt-16" />
    </div>
  )
}

export async function generateStaticParams() {
  const categories = await getBlogCategories()
  return categories
    .filter((c: { slug?: string }) => typeof c.slug === 'string' && c.slug.length > 0)
    .map((c: { slug: string }) => ({ slug: c.slug }))
}
