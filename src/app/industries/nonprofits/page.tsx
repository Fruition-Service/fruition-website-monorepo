import {
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPageStrict,
} from '@/sanity/queries'
import UniversalPageTemplate from '@/components/UniversalPageTemplate'
import { getIndustryLogos } from '@/sanity/industryLogos'
import { INDUSTRIES_PAGES } from '@/data/practicePages/industries'
import { practiceMetadata } from '@/data/practicePages/types'
import {
  pageKeyFor,
  practiceFaqTabs,
  practiceIndustrySections,
  practiceToIndustryPage,
} from '@/data/practicePages/toIndustryPage'

const practice = INDUSTRIES_PAGES['nonprofits']

export const metadata = practiceMetadata(practice)

export default async function Page() {
  const [siteSettings, caseStudies, centralFaqs, industryLogos] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPageStrict(pageKeyFor(practice)),
    getIndustryLogos('nonprofits'),
  ])

  return (
    <UniversalPageTemplate
      page={practiceToIndustryPage(practice)}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      industryLogos={industryLogos}
      faqTabs={practiceFaqTabs(practice, centralFaqs)}
      sections={practiceIndustrySections(practice)}
    />
  )
}
