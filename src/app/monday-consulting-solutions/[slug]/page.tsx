import {
  getAllSolutionPages,
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { buildOgMetadata } from "@/lib/metadata"
import { notFound } from "next/navigation"
import { RETIRED_SOLUTION_SLUGS } from "@/lib/retiredLinks"

export async function generateStaticParams() {
  const pages = await getAllSolutionPages()
  return pages
    .filter((p: { slug: string }) => !RETIRED_SOLUTION_SLUGS.has(p.slug))
    .map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Retired duplicates are redirected in next.config.ts; never render them.
  if (RETIRED_SOLUTION_SLUGS.has(slug)) notFound()
  const page = await getSolutionPageBySlug(slug)
  if (!page) return {}
  const title = page?.seoTitle || page?.title || slug
  const description = page?.seoDescription
  return {
    alternates: { canonical: `/monday-consulting-solutions/${slug}` },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: `/monday-consulting-solutions/${slug}`,
    }),
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Retired duplicates are redirected in next.config.ts; never render them.
  if (RETIRED_SOLUTION_SLUGS.has(slug)) notFound()
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug(slug),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`monday-consulting-solutions/${slug}`),
  ])
  // Unknown slugs must 404, not render an empty 200 shell.
  if (!page) notFound()
  // Per-slug overrides
  const slugsWithCalendlyTop = new Set(["solar-crm-solution"])
  const adjustedPage = page
    ? {
        ...page,
        calendlyPosition: slugsWithCalendlyTop.has(slug)
          ? "top"
          : page.calendlyPosition,
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
