import { bookingHref } from "@/lib/bookingLink"
import { getTeamMembers, getPageBySlug, getSiteSettings } from "@/sanity/queries"
import type { SanityImageRef } from "@/components/sections/types"
import FruitionTeamClient, {
  type TeamMember,
  type TeamRegion,
  type HeroDescriptionBlock,
} from "./FruitionTeamClient"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getPageBySlug("fruition-team")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/fruition-team" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/fruition-team",
    }),
  }
}

export default async function TeamPage() {
  const [members, page, siteSettings] = await Promise.all([
    getTeamMembers() as Promise<TeamMember[]>,
    getPageBySlug("fruition-team"),
    getSiteSettings(),
  ])

  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)
  const certificationBadge = siteSettings?.badgeCertifications as SanityImageRef

  const mergedMembers = mergeTeamMembers(members, siteSettings?.excludedTeamMemberNames || [])

  const regions: TeamRegion[] = Array.isArray(page?.teamRegions)
    ? (page.teamRegions as TeamRegion[])
    : []

  const heroDescriptionBlocks: HeroDescriptionBlock[] = Array.isArray(
    page?.heroDescriptionBlocks
  )
    ? (page.heroDescriptionBlocks as HeroDescriptionBlock[])
    : []

  return (
    <FruitionTeamClient
      members={mergedMembers}
      heroHeading={page?.heroHeading}
      heroCtaLabel={page?.primaryCtaLabel}
      calendlyUrl={calendlyUrl}
      certificationBadge={certificationBadge}
      regions={regions}
      heroDescriptionBlocks={heroDescriptionBlocks}
      croSections={page?.croSections}
    />
  )
}
