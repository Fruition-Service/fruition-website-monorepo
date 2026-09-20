"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import type { ReactNode } from "react"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  MethodologySection,
  TestimonialsGrid,
  CalendlySection,
  FaqAccordion,
  DiscoverCtaSection,
  JoinStatsSection,
  SecurityBadgeSection,
  CapabilitiesGrid,
  ServicesCardsGrid,
  FeatureNumberList,
  SolutionCardsSection,
  CaseStudyCardsSection,
  IndustryTabsSection,
  TestimonialCtaBanner,
  AuditCtaBanner,
  RemoteTeamSection,
  ApplicationFormSection,
  TextContentSection,
  CapabilityBlocksSection,
  BenefitLedgerSection,
  TemplateSpecSection,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData } from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"

import type { FaqTab } from "@/components/sections/types"
import { resolveIndustryLogos } from "@/sanity/industryLogos"
import { getIndustrySections, type IndustrySections } from "@/data/industrySections"
import type { CarouselLogo } from "@/components/sections/types"

interface UniversalPageTemplateProps {
  page: any // the Sanity page document
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  /**
   * Central FAQs (faqItem docs) already grouped into tabs for this
   * page. When provided and non-empty, takes precedence over the
   * legacy embedded `page.faqTabs`. See src/sanity/groupFaqs.ts.
   */
  faqTabs?: FaqTab[]
  /**
   * When set, hides the individual partner-badge row in the hero and
   * renders this image below the heading instead.
   */
  heroPartnerImageSrc?: string
  /**
   * This page's own client logo wall. Falls back to the global carousel when
   * no industryLogoSet has been curated — see src/sanity/industryLogos.ts.
   */
  industryLogos?: CarouselLogo[] | null
  /**
   * Long-form sections for this page. Defaults to the registry entry for
   * `page.slug`; pages whose copy lives outside Sanity (the /industries
   * leaves) pass their own.
   */
  sections?: IndustrySections
}

function youtubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url
      const v = u.searchParams.get("v")
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
  } catch {
    return null
  }
  return null
}

export default function UniversalPageTemplate({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  heroPartnerImageSrc,
  industryLogos,
  sections,
}: UniversalPageTemplateProps) {
  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const comparisonTabs = page.comparisonTabs ?? []
  const methodologySteps = page.methodologySteps ?? []
  const shouldMergeMethodology =
    comparisonTabs.length >= 3 && methodologySteps.length > 0

  const mergedComparisonTabs = shouldMergeMethodology
    ? comparisonTabs.map((tab: any, idx: number) => {
        const label = tab.label ?? ""
        const isOurApproach =
          label.toLowerCase().includes("our approach") ||
          idx === comparisonTabs.length - 1
        if (!isOurApproach) return tab
        return {
          ...tab,
          items: methodologySteps.map((s: any) => ({
            _key: s._key,
            number: s.number,
            title: s.title,
            description: s.description,
          })),
        }
      })
    : comparisonTabs

  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)
  const bottomVideoEmbedSrc = youtubeEmbedUrl(page.bottomVideoUrl)

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  /* Long-form industry copy that has no Sanity home yet — see
     src/data/industrySections.ts. Renders nothing for pages with no entry. */
  const {
    capabilityBlocks,
    benefitLedger,
    templateSpec,
  } = sections ?? getIndustrySections(page.slug)

  const capabilitiesColumns =
    page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
      ? page.capabilitiesColumns
      : undefined

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        accentBlock={page.heroAccentBlock === true}
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        partnerImageSrc={heroPartnerImageSrc}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
        splitLayout={page.heroSplitLayout === true}
        hidePartnerBadges={page.hideHeroPartnerBadges === true}
      />

      {/* 1b. Calendly (top position) — opt-in via Sanity field calendlyPosition === "top" */}
      {page.calendlyPosition === "top" && (
        <CalendlySection
          heading={page.calendlyHeading}
          subheading={page.calendlySubheading}
          calendlyUrl={rawCalendly}
        />
      )}

      {/* 2. Logo Cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={resolveIndustryLogos(industryLogos, siteSettings?.carouselLogos)}
      />

      {/* 2b. Hero video (only when heroVideoUrl is set on the page doc) */}
      {heroVideoEmbedSrc && (
        <section className="bg-surface pb-14 md:pb-24">
          <div className="mx-auto px-4 max-w-[1042px]">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={heroVideoEmbedSrc} title={page.heroVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

      {/* 3. Capabilities Grid ("Why X choose monday.com") — render here unless capabilitiesPosition === 'afterFaq' */}
      {!page.hideCapabilitiesSection && page.capabilitiesCards?.length > 0 && page.capabilitiesPosition !== "afterFaq" && (
        <CapabilitiesGrid
          eyebrow={page.capabilitiesEyebrow}
          heading={page.capabilitiesHeading}
          headingAccent={page.capabilitiesHeadingAccent}
          subheading={page.capabilitiesSubheading}
          theme={page.capabilitiesTheme || "light"}
          columns={capabilitiesColumns}
          cards={page.capabilitiesCards}
          ctaLabel={page.capabilitiesCtaLabel}
          ctaUrl={page.capabilitiesCtaUrl}
          ctaSecondaryLabel={page.capabilitiesCtaSecondaryLabel}
          ctaSecondaryUrl={page.capabilitiesCtaSecondaryUrl}
        />
      )}

      {/* 7b. Secondary Capabilities Grid (e.g. "What We're Looking For") */}
      {page.secondaryCapabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.secondaryCapabilitiesEyebrow}
          heading={page.secondaryCapabilitiesHeading}
          headingAccent={page.secondaryCapabilitiesHeadingAccent}
          subheading={page.secondaryCapabilitiesSubheading}
          theme="light"
          columns={
            page.secondaryCapabilitiesColumns === 2 ||
            page.secondaryCapabilitiesColumns === 3
              ? page.secondaryCapabilitiesColumns
              : undefined
          }
          cards={page.secondaryCapabilitiesCards}
          ctaLabel={page.secondaryCapabilitiesCtaLabel}
          ctaUrl={page.secondaryCapabilitiesCtaUrl}
        />
      )}

      {/* 7c. Remote Team / Global Offices section */}
      {(page.officeLocations?.length > 0 || page.remoteTeamHeading) && (
        <RemoteTeamSection
          eyebrow={page.remoteTeamEyebrow}
          heading={page.remoteTeamHeading}
          headingAccent={page.remoteTeamHeadingAccent}
          subheading={page.remoteTeamSubheading}
          offices={page.officeLocations || []}
          features={page.remoteFeatures || []}
          ctaLabel={page.remoteTeamCtaLabel}
          ctaUrl={page.remoteTeamCtaUrl}
        />
      )}

      {/* Feature Number List (e.g. "The Everything App for Work") */}
      {page.featureListItems?.length > 0 && (
        <FeatureNumberList
          heading={page.featureListHeading}
          headingAccent={page.featureListHeadingAccent}
          accentBlock={page.featureListAccentBlock !== false}
          subheading={page.featureListSubheading}
          theme={page.featureListTheme || "dark"}
          columns={page.featureListColumns === 3 ? 3 : 2}
          items={page.featureListItems}
        />
      )}

      {/* Services Cards Grid (e.g. "Our Comprehensive n8n Services" as cards) */}
      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading}
          headingAccent={page.servicesHeadingAccent}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

      {/* 3. Comparison Tabs (if populated) */}
      {mergedComparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={mergedComparisonTabs}
          theme={page.comparisonTheme || "light"}
          layout={page.comparisonLayout === "sideBySide" ? "sideBySide" : "tabs"}
          withPurpleCircle={page.comparisonWithPurpleCircle ?? true}
        />
      )}

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
          theme={capabilityBlocks ? "light" : "tint"}
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
          theme={capabilityBlocks && !benefitLedger ? "light" : "tint"}
        />
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 3b. Methodology — moved before Calendly to match prod sequence */}
      {!shouldMergeMethodology && methodologySteps.length > 0 && (
        <MethodologySection
          heading={page.methodologyHeading}
          steps={methodologySteps}
        />
      )}

      {/* 4. Calendly (Book Your Personalised Demo) — skip when shown at top */}
      {page.calendlyPosition !== "top" && (
        <CalendlySection
          heading={page.calendlyHeading}
          subheading={page.calendlySubheading}
          calendlyUrl={rawCalendly}
        />
      )}

      {/* 4a. Long-form text content sections (e.g. About Us narrative) */}
      {page.textContentSections?.length > 0 &&
        page.textContentSections.map((section: { _key?: string; heading?: string; headingAccent?: string; body?: string; theme?: "light" | "tint" }, i: number) => (
          <TextContentSection
            key={section._key || `text-${i}`}
            heading={section.heading}
            headingAccent={section.headingAccent}
            body={section.body}
            theme={section.theme}
          />
        ))}

      {/* 5. FAQ — prefer central faqItem docs (single source of truth); fall
          back to the page's embedded faqTabs when the page hasn't been
          migrated yet. */}
      {!page.hideFaqSection && ((faqTabs && faqTabs.length > 0) ? (
        <FaqAccordion heading={page.faqHeading || "Frequently asked questions"} tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion heading={page.faqHeading || "Frequently asked questions"} tabs={page.faqTabs} />
      ) : null)}

      {/* 5b. Capabilities Grid (after FAQ) — opt-in via capabilitiesPosition === 'afterFaq' */}
      {!page.hideCapabilitiesSection && page.capabilitiesCards?.length > 0 && page.capabilitiesPosition === "afterFaq" && (
        <CapabilitiesGrid
          eyebrow={page.capabilitiesEyebrow}
          heading={page.capabilitiesHeading}
          headingAccent={page.capabilitiesHeadingAccent}
          subheading={page.capabilitiesSubheading}
          theme={page.capabilitiesTheme || "light"}
          columns={capabilitiesColumns}
          cards={page.capabilitiesCards}
          ctaLabel={page.capabilitiesCtaLabel}
          ctaUrl={page.capabilitiesCtaUrl}
          ctaSecondaryLabel={page.capabilitiesCtaSecondaryLabel}
          ctaSecondaryUrl={page.capabilitiesCtaSecondaryUrl}
        />
      )}

      {/* 6. Case Study Cards (if populated) */}
      {!page.hideCaseStudyCardsSection && page.caseStudyCards?.length > 0 && (
        <CaseStudyCardsSection
          heading={page.caseStudySectionHeading}
          cards={page.caseStudyCards}
        />
      )}

      {/* 6b. Solution Cards - left/right (if populated) — render after case studies to match prod */}
      {!page.hideSolutionCardsSection && page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 9. Industry Tabs (if populated) */}
      {page.industryTabs?.length > 0 && (
        <IndustryTabsSection
          heading={page.industryHeading}
          tabs={page.industryTabs}
        />
      )}

      {/* 11. Bottom video embed (if populated) */}
      {bottomVideoEmbedSrc && (
        <section className="bg-surface py-14 md:py-24">
          <div className="mx-auto px-4 max-w-[1042px]">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={bottomVideoEmbedSrc} title={page.bottomVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

      {/* 11b. Application form embed (monday.com WorkForms) */}
      {page.applicationFormEmbedUrl && (
        <ApplicationFormSection
          heading={page.applicationFormHeading}
          embedUrl={page.applicationFormEmbedUrl}
        />
      )}

      {/* 12. Testimonials */}
      {!page.hideTestimonialsSection && <TestimonialsGrid caseStudies={caseStudies} />}

      {/* 13. Discover CTA */}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}

      {/* 14. Join Stats */}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel}
          ctaUrl={bookingHref(page.joinCtaUrl || calendlyUrl)}
          siteSettings={siteSettings || undefined}
        />
      )}

      {/* 15. Testimonial CTA Banner (bottom) — defaults to "Join 900+ organisations …"
           but a page may override the copy via joinHeading* (most useful when
           hideJoinStatsSection is true so there's no duplicate banner). */}
      {!page.hideTestimonialBanner && (
        <TestimonialCtaBanner
          headingPart1={page.joinHeadingPart1 || "Join "}
          headingAccent={page.joinHeadingAccent || "900+ organisations"}
          headingPart2={page.joinHeadingPart2 || " that have maximised their workflows with our monday.com expert support"}
          primaryCtaUrl={calendlyUrl}
          secondaryCtaUrl={calendlyUrl}
          testimonial={featuredTestimonial}
          testimonials={caseStudies}
        />
      )}

      {/* 16. Security Badge */}
      {!page.hideSecurityBadgeSection && (
        <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
      )}
    </div>
  )
}
