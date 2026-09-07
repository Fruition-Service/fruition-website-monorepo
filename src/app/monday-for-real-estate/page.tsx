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
  SolutionCardsSection,
  TestimonialCtaBanner,
  JoinStatsSection,
  BenefitLedgerSection,
  CapabilityBlocksSection,
  TemplateSpecSection,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import CtaButton from "@/components/CtaButton"
import { buildOgMetadata } from "@/lib/metadata"
import { getIndustryLogos, resolveIndustryLogos } from "@/sanity/industryLogos"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import { getIndustrySections } from "@/data/industrySections"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-real-estate")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-real-estate" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-real-estate",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, industryLogos] = await Promise.all([
    getIndustryPageBySlug("monday-for-real-estate"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-real-estate"),
    getIndustryLogos("real-estate"),
  ])

  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const calendlyUrl = bookingHref(rawCalendly)

  const faqTabs = resolveFaqTabs(page.faqTabs, centralFaqs)

  const { capabilityBlocks, benefitLedger, templateSpec } =
    getIndustrySections("monday-for-real-estate")

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
        heroImageUrl={page.heroImageUrl}
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

      {/* 3. Three-tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        tabs={page.comparisonTabs || []}
        theme="light"
        layout="tabs"
        withPurpleCircle={false}
      />

      {/* 3b. Why choose monday CRM for real estate */}
      {benefitLedger && (
        <BenefitLedgerSection
          eyebrow={benefitLedger.eyebrow}
          heading={benefitLedger.heading}
          headingAccent={benefitLedger.headingAccent}
          intro={benefitLedger.intro}
          items={benefitLedger.items}
          theme="tint"
        />
      )}

      {/* 4. Featured case study — video + stats + quote + CTA */}
      {(page.caseStudyVideoUrl || page.caseStudyQuote || (page.caseStudyStats?.length ?? 0) > 0) && (
        <section className="bg-surface" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            {page.caseStudyBlockHeading && (
              <h2
                className="text-section-h2 text-center"
                style={{ color: "var(--text-body)", marginBottom: 40 }}
              >
                {page.caseStudyBlockHeading}
              </h2>
            )}
            <div
              className="grid grid-cols-1 lg:grid-cols-2"
              style={{ gap: 40, alignItems: "center" }}
            >
              {page.caseStudyVideoUrl && (
                <div className="w-full rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                  <YouTubeEmbed
                    url={page.caseStudyVideoUrl}
                    title={page.caseStudyVideoTitle}
                  />
                </div>
              )}
              <div className="flex flex-col" style={{ gap: 20 }}>
                {(page.caseStudyStats?.length ?? 0) > 0 && (
                  <div className="grid grid-cols-2" style={{ gap: 24 }}>
                    {page.caseStudyStats.map((stat: { _key?: string; value?: string; label?: string }) => (
                      <div key={stat._key}>
                        <div style={{ fontSize: 40, fontWeight: 800, color: "#8015e8", lineHeight: 1.1 }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: 14, color: "var(--text-muted-fg)", marginTop: 6 }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {page.caseStudyQuote && (
                  <blockquote
                    style={{
                      fontSize: 18,
                      lineHeight: "28px",
                      color: "var(--text-body)",
                      fontStyle: "italic",
                      borderLeft: "3px solid #8015e8",
                      paddingLeft: 16,
                    }}
                  >
                    {page.caseStudyQuote}
                  </blockquote>
                )}
                {page.caseStudyQuoteAuthor && (
                  <div style={{ fontSize: 14, color: "var(--text-muted-fg)" }}>
                    {page.caseStudyQuoteAuthor}
                  </div>
                )}
                {page.caseStudyCtaLabel && (
                  <div style={{ marginTop: 8 }}>
                    <CtaButton
                      href={bookingHref(page.caseStudyCtaUrl || calendlyUrl)}
                      label={page.caseStudyCtaLabel}
                      variant="primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4b. What the real estate CRM template ships with */}
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

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 5. Solution Cards — left/right */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 7. Why the best use monday.com — 9 capability cards (real estate) */}
      {page.capabilitiesCards?.length > 0 && (
        <section style={{ backgroundColor: "var(--surface-subtle)", paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            {page.whyBestHeading && (
              <h2
                className="text-section-h2 text-center"
                style={{ color: "var(--text-body)", marginBottom: 48 }}
              >
                {page.whyBestHeading}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
              {page.capabilitiesCards.map((card: { _key?: string; emoji?: string; title?: string; description?: string }) => (
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
      )}

      {/* 8. Join 500+ CTA */}
      <TestimonialCtaBanner
        primaryCtaLabel={page.testimonialBannerPrimaryCtaLabel}
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />

      {/* 9. Additional tips — three panels. Copy lives in industrySections.ts
          alongside this page's other section-designed long-form content. */}
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

      {/* 10. FAQ */}
      {!page.hideFaqSection && faqTabs.length > 0 && <FaqAccordion tabs={faqTabs} />}

      {/* 11. Stats — Years / Projects / Clients */}
      <JoinStatsSection
        headingPart1=""
        headingAccent=""
        headingPart2=""
        stats={page.bottomStats || []}
        siteSettings={siteSettings || undefined}
      />
    </div>
  )
}
