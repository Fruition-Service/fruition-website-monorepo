import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { getFeaturedUseCases } from "@/features/ai-use-cases/data"
import FeaturedUseCasesSection from "@/components/ai-use-cases/FeaturedUseCasesSection"
import { buildOgMetadata } from "@/lib/metadata"
import { getIndustryLogos } from "@/sanity/industryLogos"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-retail")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-retail" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-retail",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, industryLogos, featuredUseCases] = await Promise.all([
    getIndustryPageBySlug("monday-for-retail"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-retail"),
    getIndustryLogos("retail"),
    getFeaturedUseCases("/monday-for-retail"),
  ])
  return (
    <UniversalPageTemplate
      useCasesSlot={<FeaturedUseCasesSection featured={featuredUseCases} />}
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      industryLogos={industryLogos}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs, "Retail")}
    />
  )
}
