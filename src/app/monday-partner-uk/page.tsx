import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getTeamMembers,
} from "@/sanity/queries"
import { getRegionLogos, resolveRegionLogos } from "@/sanity/regionLogos"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import RegionPageTemplate from "@/components/RegionPageTemplate"
import { REGION_PAGES } from "@/data/regionPages"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-partner-uk"
const CONTENT = REGION_PAGES[SLUG]

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-partner-uk" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-partner-uk",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, teamMembers, regionLogos] = await Promise.all([
    getLocationPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getTeamMembers(),
    getRegionLogos(SLUG),
  ])
  return (
    <RegionPageTemplate
      content={CONTENT}
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      teamMembers={mergeTeamMembers(teamMembers || [], siteSettings?.excludedTeamMemberNames || [])}
      clientLogos={resolveRegionLogos(regionLogos?.logos, siteSettings?.carouselLogos)}
      clientLogosLead={regionLogos?.lead}
    />
  )
}
