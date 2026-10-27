import type { Metadata } from "next"
import HeroBanner from "@/components/sections/HeroBanner"
import CapabilitiesGrid from "@/components/sections/CapabilitiesGrid"
import MethodologySection from "@/components/sections/MethodologySection"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import { getClosingCtaForPage } from "@/sanity/queries"
import { buildOgMetadata } from "@/lib/metadata"
import {
  WHAT_WE_DO_CARDS,
  WHAT_WE_DO_CLOSING_CTA,
  WHAT_WE_DO_HERO,
  WHAT_WE_DO_PROCESS,
  WHAT_WE_DO_SEO,
  WHAT_WE_DO_SERVICES,
} from "@/data/whatWeDo"

export const metadata: Metadata = {
  title: WHAT_WE_DO_SEO.title,
  description: WHAT_WE_DO_SEO.description,
  alternates: { canonical: "/what-we-do" },
  ...buildOgMetadata({
    title: WHAT_WE_DO_SEO.title,
    description: WHAT_WE_DO_SEO.description,
    path: "/what-we-do",
  }),
}

export default async function WhatWeDoPage() {
  // A Sanity closingCta doc tagged "what-we-do" overrides the fallback copy.
  const closingCta = await getClosingCtaForPage("what-we-do")

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      <HeroBanner {...WHAT_WE_DO_HERO} />

      <CapabilitiesGrid
        eyebrow={WHAT_WE_DO_SERVICES.eyebrow}
        heading={WHAT_WE_DO_SERVICES.heading}
        headingAccent={WHAT_WE_DO_SERVICES.headingAccent}
        cards={WHAT_WE_DO_CARDS}
        columns={2}
      />

      {/* Both sections sit on surface-subtle; a hairline keeps them apart. */}
      <div className="border-t border-ui">
        <MethodologySection steps={WHAT_WE_DO_PROCESS} />
      </div>

      <ClosingCtaSection cta={closingCta} fallback={WHAT_WE_DO_CLOSING_CTA} />
    </div>
  )
}
