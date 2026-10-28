import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { IndustryMeta, UseCaseTile } from "@/features/ai-use-cases/types"
import { industryHref, caseAnchorHref, USE_CASES_PATH } from "@/features/ai-use-cases/types"
import SectionIntro from "@/components/sections/SectionIntro"
import CtaButton from "@/components/CtaButton"
import UseCaseCard, { SEE_BUILD } from "./UseCaseCard"

/**
 * Featured use cases on an industry landing page: up to six builds from the
 * AI use case catalogue, each linking into its build on the catalogue's
 * industry page, plus a link to the full list. Load the props with
 * `getFeaturedUseCases()` (features/ai-use-cases/data) in the page's server
 * component; this component renders nothing when they are missing.
 */

export interface FeaturedUseCases {
  industry: IndustryMeta
  tiles: UseCaseTile[]
  heading?: string
}

export default function FeaturedUseCasesSection({
  featured,
  theme = "light",
}: {
  featured?: FeaturedUseCases | null
  theme?: "light" | "tint"
}) {
  if (!featured?.tiles.length) return null
  const { industry, tiles } = featured

  return (
    <section
      id="use-cases"
      className={`scroll-mt-24 py-14 md:py-20 lg:py-24 ${theme === "tint" ? "bg-surface-subtle" : "bg-surface"}`}
    >
      <div className="site-container">
        <SectionIntro
          eyebrow="Use case catalogue"
          heading={featured.heading ?? `${industry.name} use cases`}
          lead="Every use case comes from a real Fruition client engagement, with the client's name withheld."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <li key={tile.id}>
              <UseCaseCard
                tile={tile}
                hideKicker
                action={
                  <Link href={caseAnchorHref(industry.slug, tile.id)} className={SEE_BUILD}>
                    See the build
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                }
              />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
          <CtaButton
            href={industryHref(industry.slug)}
            label={`See all ${industry.count} use cases`}
            variant="outline"
            icon={<ArrowRight size={18} aria-hidden />}
          />
          <Link
            href={USE_CASES_PATH}
            className="inline-flex min-h-11 items-center text-[15px] font-semibold text-brand hover:underline"
          >
            Browse every industry
          </Link>
        </div>
      </div>
    </section>
  )
}
