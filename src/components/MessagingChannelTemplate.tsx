import { MessageCircleQuestion } from "lucide-react"
import { BOOKING_ANCHOR } from "@/lib/bookingLink"
import {
  getServicePageBySlug,
  getSiteSettings,
  getFaqItemsForPageStrict,
  getClosingCtaForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import {
  HeroBanner,
  ChannelProblemCallout,
  WorkflowConnector,
  ChannelStackMatrix,
  ChannelSpecPanel,
  CapabilitiesGrid,
  ComparisonTabsSection,
  IndustryTabsSection,
  FeatureNumberList,
  CalendlySection,
  FaqAccordion,
  AuditCtaBanner,
} from "@/components/sections"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import type { ChannelPage } from "@/data/messagingChannels/types"

/**
 * Shared renderer for the three messaging-channel integration pages
 * (/integrations/whatsapp, /line, /viber). They answer the same question in
 * the same order, so they share one template and differ only in data.
 *
 * Sanity (`servicePage`, slug `integrations-<channel>`) overrides the copy in
 * `src/data/messagingChannels/` field by field, so an editor can reword the
 * page without a deploy while the file stays the source of truth for anything
 * they have not touched. Central `faqItem` docs win over the file's FAQs the
 * same way — via the strict query, never the /faqs fallback.
 */
export default async function MessagingChannelTemplate({ page }: { page: ChannelPage }) {
  const pageKey = page.path.replace(/^\//, "")
  const [doc, siteSettings, centralFaqs, closingCta] = await Promise.all([
    getServicePageBySlug(page.sanitySlug),
    getSiteSettings(),
    getFaqItemsForPageStrict(pageKey),
    getClosingCtaForPage(pageKey),
  ])

  const cms = doc ?? {}
  const rawCalendly = siteSettings?.calendlyLink
  // Page document first, central `faqItem` docs second, the file last. Never
  // the other way round — central-wins silently discards editors' page edits.
  const resolved = resolveFaqTabs(cms.faqTabs, centralFaqs ?? [])
  const faqTabs = resolved.length
    ? resolved
    : [
        {
          label: "General questions",
          items: page.faqs.map((f) => ({ question: f.q, answer: f.a })),
        },
      ]

  return (
    <div className="bg-surface text-body">
      <HeroBanner
        eyebrow={cms.heroEyebrow || page.heroEyebrow}
        headingPart1={cms.heroHeading || page.heroHeading}
        headingAccent={cms.heroHeadingAccent ?? page.heroHeadingAccent}
        subheading={cms.heroSubheading || page.heroSubheading}
        heroImage={cms.heroImage}
        /* No partner badges: these are platform-neutral integrations we
           deliver for monday.com, HubSpot, Salesforce and the rest, so the
           monday.com partner row would misstate who the page is for. */
        hidePartnerBadges
        /* HeroBanner demotes its `primary` slot to an outline button whenever a
           secondary is present, and renders the secondary as the filled pill.
           So the booking CTA goes in the secondary slot: the filled button is
           the one we want people to press. */
        primaryCtaLabel={cms.secondaryCtaLabel || page.secondaryCtaLabel}
        primaryCtaUrl="#faq"
        primaryCtaIcon={<MessageCircleQuestion size={18} aria-hidden />}
        secondaryCtaLabel={cms.primaryCtaLabel || page.primaryCtaLabel}
        secondaryCtaUrl={BOOKING_ANCHOR}
      />

      {/* Positioning — what we are actually claiming, before any feature talk.
          No client logo wall after it: none of the site's logo clients have
          bought messaging-channel work, so showing them here would imply they had. */}
      <ChannelProblemCallout
        eyebrow="The engineering problem"
        title={page.introTitle}
        body={cms.introStripBody || page.intro}
      />

      {/* Where the channel actually is — the reason this page exists per market. */}
      <section className="bg-surface-subtle px-4 py-14 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1100px]">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
            {page.reachEyebrow}
          </p>
          <h2 className="text-section-h2 text-body max-w-[820px]">
            {page.reachHeading}
            {page.reachHeadingAccent && <span className="text-brand"> {page.reachHeadingAccent}</span>}
          </h2>
          <p className="mt-5 text-body-lead text-muted max-w-[720px]">{page.reachLead}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {page.reach.map((r) => (
              <div
                key={r.market}
                className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6"
              >
                <span className="text-2xl" aria-hidden>
                  {r.flag}
                </span>
                <p className="mt-3 text-base font-semibold text-body">{r.market}</p>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mt-1 mb-3">
                  {r.stat}
                </p>
                <p className="text-body-sm text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkflowConnector
        eyebrow={page.flowEyebrow}
        heading={page.flowHeading}
        subheading={page.flowSubheading}
        theme="dark"
        steps={page.flowSteps}
        footnote={page.flowFootnote}
      />

      <ChannelStackMatrix
        eyebrow={page.matrixEyebrow}
        heading={page.matrixHeading}
        headingAccent={page.matrixHeadingAccent}
        lead={page.matrixLead}
        rows={page.matrix}
        note={page.matrixNote}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      <CapabilitiesGrid
        eyebrow={cms.capabilitiesEyebrow || page.capabilitiesEyebrow}
        heading={cms.capabilitiesHeading || page.capabilitiesHeading}
        headingAccent={cms.capabilitiesHeadingAccent ?? page.capabilitiesHeadingAccent}
        subheading={cms.capabilitiesSubheading || page.capabilitiesSubheading}
        cards={cms.capabilitiesCards?.length ? cms.capabilitiesCards : page.capabilities}
        theme="light"
        columns={3}
      />

      <ChannelSpecPanel
        eyebrow={page.specEyebrow}
        heading={page.specHeading}
        headingAccent={page.specHeadingAccent}
        lead={page.specLead}
        rows={page.spec}
        footnote={page.specFootnote}
      />

      <IndustryTabsSection
        heading={cms.industryHeading || page.industryHeading}
        tabs={cms.industryTabs?.length ? cms.industryTabs : page.industries}
      />

      <ComparisonTabsSection
        heading={cms.comparisonHeading || page.comparisonHeading}
        subheading={cms.comparisonSubheading || page.comparisonSubheading}
        tabs={cms.comparisonTabs?.length ? cms.comparisonTabs : page.comparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />

      <FeatureNumberList
        heading={page.phasesHeading}
        headingAccent={page.phasesHeadingAccent}
        subheading={page.phasesSubheading}
        items={page.phases}
        theme="dark"
        columns={2}
      />

      <CalendlySection
        heading={cms.calendlyHeading || page.calendlyHeading}
        subheading={cms.calendlySubheading || page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />

      <ClosingCtaSection
        cta={closingCta}
        fallback={{
          heading: page.closing.heading,
          headingAccent: page.closing.headingAccent,
          lead: page.closing.lead,
          primaryLabel: "Book a discovery call →",
          primaryUrl: BOOKING_ANCHOR,
        }}
      />
    </div>
  )
}
