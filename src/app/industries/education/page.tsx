import {
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPageStrict,
} from '@/sanity/queries'
import UniversalPageTemplate from '@/components/UniversalPageTemplate'
import { getFeaturedUseCases } from '@/features/ai-use-cases/data'
import FeaturedUseCasesSection from '@/components/ai-use-cases/FeaturedUseCasesSection'
import { getIndustryLogos } from '@/sanity/industryLogos'
import { INDUSTRIES_PAGES } from '@/data/practicePages/industries'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'
import {
  pageKeyFor,
  practiceFaqTabs,
  practiceIndustrySections,
  practiceToIndustryPage,
} from '@/data/practicePages/toIndustryPage'

const fallback = INDUSTRIES_PAGES['education']

export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(fallback))
}

export default async function Page() {
  const [practice, siteSettings, caseStudies, centralFaqs, industryLogos, featuredUseCases] = await Promise.all([
    getPracticePageContent(fallback),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPageStrict(pageKeyFor(fallback)),
    getIndustryLogos('education'),
    getFeaturedUseCases('/industries/education'),
  ])

  return (
    <UniversalPageTemplate
      useCasesSlot={<FeaturedUseCasesSection featured={featuredUseCases} />}
      page={practiceToIndustryPage(practice)}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      industryLogos={industryLogos}
      faqTabs={practiceFaqTabs(practice, centralFaqs)}
      sections={practiceIndustrySections(practice)}
    />
  )
}
