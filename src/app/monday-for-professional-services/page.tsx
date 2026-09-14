import { bookingHref } from "@/lib/bookingLink"
import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CapabilitiesGrid,
  CalendlySection,
  FaqAccordion,
  SolutionCardsSection,
  TestimonialCtaBanner,
  ServicesWorkflowTabs,
  CapabilityBlocksSection,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import { buildOgMetadata } from "@/lib/metadata"
import { getIndustryLogos, resolveIndustryLogos } from "@/sanity/industryLogos"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import { getIndustrySections } from "@/data/industrySections"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-professional-services")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-professional-services" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-professional-services",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, industryLogos] = await Promise.all([
    getIndustryPageBySlug("monday-for-professional-services"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-professional-services"),
    getIndustryLogos("professional-services"),
  ])

  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const calendlyUrl = bookingHref(rawCalendly)

  const effectiveFaqTabs = resolveFaqTabs(page.faqTabs, centralFaqs)

  const { capabilityBlocks } = getIndustrySections("monday-for-professional-services")

  const featuredTestimonial =
    caseStudies?.find(
      (c: { clientCompany?: string; clientName?: string }) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies?.[0]

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        headingPart1={page.heroHeading || page.title || ""}
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
      />

      {/* 2. Logo Cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={resolveIndustryLogos(industryLogos, siteSettings?.carouselLogos)}
      />

      {/* 3. Capabilities — "Run your services business on one platform" */}
      {page.capabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          heading={page.capabilitiesHeading}
          subheading={page.capabilitiesSubheading}
          theme="light"
          columns={3}
          cards={page.capabilitiesCards}
        />
      )}

      {/* 4. NEW — Six-tab services workflow section */}
      {page.workflowTabs?.length > 0 && (
        <ServicesWorkflowTabs
          heading={page.workflowTabsHeading}
          tabs={page.workflowTabs}
        />
      )}

      {/* 5. Existing comparison tabs (Sanity) */}
      {page.comparisonTabs?.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={page.comparisonTabs}
          theme={page.comparisonTheme || "light"}
          layout="tabs"
        />
      )}

      {/* 5b. What you can do with monday CRM for professional services */}
      {capabilityBlocks && (
        <CapabilityBlocksSection
          eyebrow={capabilityBlocks.eyebrow}
          heading={capabilityBlocks.heading}
          headingAccent={capabilityBlocks.headingAccent}
          lead={capabilityBlocks.lead}
          columns={capabilityBlocks.columns}
          blocks={capabilityBlocks.blocks}
          theme="tint"
        />
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 6. Solution Cards */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 7. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 8. FAQ */}
      {effectiveFaqTabs.length > 0 && <FaqAccordion tabs={effectiveFaqTabs} />}

      {/* 9. Bottom YouTube video */}
      {page.bottomVideoUrl && (
        <section className="bg-surface" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <YouTubeEmbed
                url={page.bottomVideoUrl}
                title={page.bottomVideoTitle}
              />
            </div>
          </div>
        </section>
      )}

      {/* 10. Join 900+ banner (replaces removed "What our customers say" grid) */}
      <TestimonialCtaBanner
        headingPart1={page.joinHeadingPart1}
        headingAccent={page.joinHeadingAccent}
        headingPart2={page.joinHeadingPart2}
        primaryCtaLabel={page.testimonialBannerPrimaryCtaLabel}
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}
