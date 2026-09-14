import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getTeamMembers,
} from "@/sanity/queries"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import RegionPageTemplate from "@/components/RegionPageTemplate"
import { REGION_PAGES } from "@/data/regionPages"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-partner-india"
const CONTENT = REGION_PAGES[SLUG]

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-partner-india" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-partner-india",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, teamMembers] = await Promise.all([
    getLocationPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getTeamMembers(),
  ])
  return (
    <RegionPageTemplate
      content={CONTENT}
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      teamMembers={mergeTeamMembers(teamMembers || [], siteSettings?.excludedTeamMemberNames || [])}
    />
  )
}
