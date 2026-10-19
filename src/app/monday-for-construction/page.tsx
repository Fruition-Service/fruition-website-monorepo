import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getCaseStudiesForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import { urlFor } from "@/sanity/image"

/* Legacy Wix imports can carry malformed asset refs — never let urlFor throw. */
function safePhotoUrl(img: unknown): string | undefined {
  try {
    // @ts-expect-error loose Sanity image shape
    if (!img?.asset?._ref) return undefined
    return urlFor(img).width(800).auto("format").url()
  } catch {
    return undefined
  }
}

import MondayForConstructionContent from "./MondayForConstructionContent"
import { getFeaturedUseCases } from "@/features/ai-use-cases/data"
import FeaturedUseCasesSection from "@/components/ai-use-cases/FeaturedUseCasesSection"
import { buildOgMetadata } from "@/lib/metadata"
import { getIndustryLogos } from "@/sanity/industryLogos"

const SLUG = "monday-for-construction"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-construction" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-construction",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, centralTestimonials, industryLogos, featuredUseCases] = await Promise.all([
    getIndustryPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(SLUG),
    getCaseStudiesForPage("monday-for-construction"),
    getIndustryLogos("construction"),
    getFeaturedUseCases("/monday-for-construction"),
  ])

  // Central testimonial store wins; the page-doc array stays as fallback.
  if (page && centralTestimonials?.length) {
    page.industryTestimonials = centralTestimonials.map((t: any) => ({ title: t.headline, quote: t.quote, name: t.clientName, role: t.clientRole, image: safePhotoUrl(t.profilePhoto) }))
  }
  return (
    <MondayForConstructionContent
      useCasesSlot={<FeaturedUseCasesSection featured={featuredUseCases} />}
      page={page}
      siteSettings={siteSettings}
      industryLogos={industryLogos}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
