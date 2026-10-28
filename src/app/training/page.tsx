import {
  getMondayTrainingPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import TrainingContent from "./TrainingContent"
import { buildOgMetadata } from "@/lib/metadata"

// The dedicated Training page (monday 2893019668). It still renders the
// `mondayTrainingPage` Sanity document, and its FAQ items are still tagged
// "monday-training", so editors' existing content keeps resolving here.
export async function generateMetadata() {
  const data = await getMondayTrainingPage()
  const title = data?.seoTitle || data?.title
  const description = data?.seoDescription
  return {
    alternates: { canonical: "/training" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/training",
    }),
  }
}

export default async function Page() {
  const [data, settings, caseStudies, centralFaqs] = await Promise.all([
    getMondayTrainingPage(),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-training"),
  ])

  return (
    <TrainingContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
      siteSettings={settings}
      // Central faqItems tagged "monday-training" lead, as they did on
      // /monday-training; the doc's own faqTabs are the fallback.
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      navbarPartnerBadges={settings?.navbarPartnerBadges || []}
    />
  )
}
