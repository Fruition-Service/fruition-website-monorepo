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
  CalendlySection,
  FaqAccordion,
  CaseStudyCardsSection,
  SolutionCardsSection,
  TestimonialCtaBanner,
  CapabilityBlocksSection,
  BenefitLedgerSection,
  TemplateSpecSection,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import { buildOgMetadata } from "@/lib/metadata"
import { getIndustryLogos, resolveIndustryLogos } from "@/sanity/industryLogos"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import { getIndustrySections } from "@/data/industrySections"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-marketing" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-marketing",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, industryLogos] = await Promise.all([
    getIndustryPageBySlug("monday-for-marketing"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-marketing"),
    getIndustryLogos("marketing"),
  ])

  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const calendlyUrl = bookingHref(rawCalendly)

  const effectiveFaqTabs = resolveFaqTabs(page.faqTabs, centralFaqs)

  const featuredTestimonial =
    caseStudies?.find(
      (c: { clientCompany?: string; clientName?: string }) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies?.[0]

  const { capabilityBlocks, benefitLedger, templateSpec } =
    getIndustrySections("monday-for-marketing")

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        headingPart1={page.heroHeading || page.title || ""}
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        partnerImageSrc={page.heroPartnerImagePath}
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

      {/* 3. Three-tab "Why monday.com for Marketing & Creative?" */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        tabs={page.comparisonTabs || []}
        theme="light"
        layout="tabs"
        withPurpleCircle={false}
      />

      {/* 3a. Long-form industry sections (src/data/industrySections.ts) */}
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

      {benefitLedger && (
        <BenefitLedgerSection
          eyebrow={benefitLedger.eyebrow}
          heading={benefitLedger.heading}
          headingAccent={benefitLedger.headingAccent}
          intro={benefitLedger.intro}
          items={benefitLedger.items}
          footnote={benefitLedger.footnote}
          theme="light"
        />
      )}

      {templateSpec && (
        <TemplateSpecSection
          eyebrow={templateSpec.eyebrow}
          heading={templateSpec.heading}
          headingAccent={templateSpec.headingAccent}
          lead={templateSpec.lead}
          columns={templateSpec.columns}
          panels={templateSpec.panels}
          theme="tint"
        />
      )}

      {/* 4. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 5. FAQ */}
      {effectiveFaqTabs.length > 0 && <FaqAccordion tabs={effectiveFaqTabs} />}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 6. Marketing Case Studies (with video) */}
      <CaseStudyCardsSection
        heading={page.caseStudySectionHeading}
        cards={page.marketingCaseStudyCards || []}
      />

      {/* 7. Streamline content creation */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 8. Full-width video + Why the best use monday.com — single unified section */}
      <section style={{ backgroundColor: "var(--surface-subtle)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          {page.bottomVideoUrl && (
            <div
              className="w-full rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9", marginBottom: 64 }}
            >
              <YouTubeEmbed
                url={page.bottomVideoUrl}
                title={page.bottomVideoTitle}
              />
            </div>
          )}
          {page.whyBestHeading && (
            <h2
              className="text-section-h2 text-center"
              style={{ color: "var(--text-body)", marginBottom: 48 }}
            >
              {page.whyBestHeading}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
            {(page.whyBestCards || []).map((card: { _key?: string; emoji?: string; title?: string; description?: string }) => (
              <div
                key={card._key}
                className="bg-surface-raised rounded-card border border-ui"
                style={{ padding: 28 }}
              >
                <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 12 }}>{card.emoji}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-body)", marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: "22px", color: "var(--text-muted-fg)" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Join 900+ CTA + testimonial */}
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
