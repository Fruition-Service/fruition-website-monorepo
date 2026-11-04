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
import { PAGE_PATH, PAGE_SLUG } from "./content"
import { getMondayForGovernmentSections } from "./sanityContent"

/*
 * Meta title and description come from the `industryPage` document, as does
 * the copy in every section above the FAQ. The two long-form sections (the
 * numbered capability blocks and the permission ledger) come from the same
 * document's `sections` object, laid over the defaults in ./content.
 */

export async function generateMetadata() {
  const page = await getIndustryPageBySlug(PAGE_SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: PAGE_PATH },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: PAGE_PATH,
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, industryLogos, featuredUseCases, sections] = await Promise.all([
    getIndustryPageBySlug(PAGE_SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(PAGE_SLUG),
    getIndustryLogos("government"),
    getFeaturedUseCases(PAGE_PATH),
    getMondayForGovernmentSections(),
  ])
  return (
    <UniversalPageTemplate
      useCasesSlot={<FeaturedUseCasesSection featured={featuredUseCases} />}
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      industryLogos={industryLogos}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
      sections={sections}
    />
  )
}
