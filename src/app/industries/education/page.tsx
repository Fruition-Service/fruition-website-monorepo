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
import {
  pageKeyFor,
  practiceFaqTabs,
  practiceIndustrySections,
  practiceToIndustryPage,
} from '@/data/practicePages/toIndustryPage'

const practice = INDUSTRIES_PAGES['education']

export const metadata = practiceMetadata(practice)

export default async function Page() {
  const [siteSettings, caseStudies, centralFaqs, industryLogos, featuredUseCases] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPageStrict(pageKeyFor(practice)),
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
