import {
  getAllPartnershipPages,
  getPartnershipPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { buildOgMetadata } from "@/lib/metadata"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const pages = await getAllPartnershipPages()
  return pages.map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPartnershipPageBySlug(slug)
  if (!page) return {}
  const title = page?.seoTitle || page?.title || slug
  const description = page?.seoDescription
  return {
    alternates: { canonical: `/partnerships/${slug}` },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: `/partnerships/${slug}`,
    }),
  }
}

export default async function PartnershipPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getPartnershipPageBySlug(slug),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`partnerships/${slug}`),
  ])
  // Unknown slugs must 404, not render an empty 200 shell.
  if (!page) notFound()
  // Testimonials are monday-specific; force-hide on non-monday partnership pages.
  const isMondayThemed = slug.includes("monday")
  const adjustedPage = page
    ? {
        ...page,
        hideTestimonialsSection: isMondayThemed
          ? page.hideTestimonialsSection
          : true,
      }
    : page
  return (
    <UniversalPageTemplate
      page={adjustedPage}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
