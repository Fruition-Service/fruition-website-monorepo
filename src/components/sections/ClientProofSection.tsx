import Reveal from "@/components/home/Reveal"
import ClientLogoWall from "./ClientLogoWall"
import type { CarouselLogo } from "./types"

interface ClientProofSectionProps {
  /** Small caps line above the heading. */
  eyebrow?: string
  heading?: string
  /** Paragraph under the heading. Omit to drop it entirely. */
  lead?: string
  logos: CarouselLogo[]
  /**
   * Tiles drawn before the counter cell. Pick a number that leaves the counter
   * completing the last row of five: 24 on the homepage (5×5), 9 on a region
   * page (2×5).
   */
  maxTiles?: number
  /** Last cell — the running implementation tally. Omit for no counter. */
  counterLabel?: string
  /** Anchor id, so in-page nav can target the section. */
  id?: string
  className?: string
}

/**
 * The "Our clients" proof band: eyebrow, heading, lead, rule, logo wall.
 *
 * Shared by the homepage (5×5, the global carousel) and the six region pages
 * (2×5, that region's own clients — see `src/sanity/regionLogos.ts`), so the
 * proof band reads identically wherever a visitor lands. The grid itself is
 * `ClientLogoWall`, which the industry pages use through `ClientLogoSection`.
 */
export default function ClientProofSection({
  eyebrow = "Our clients",
  heading = "Trusted by teams across 900+ implementations.",
  lead,
  logos,
  maxTiles = 24,
  counterLabel,
  id,
  className = "bg-surface pt-12 pb-16 md:pb-20 lg:pt-18 lg:pb-24",
}: ClientProofSectionProps) {
  if (!logos.length) return null

  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="mx-auto max-w-[660px] text-center">
          {eyebrow && (
            <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">{eyebrow}</p>
          )}
          <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[42px]" style={{ textWrap: "pretty" }}>
            {heading}
          </h2>
          {lead && (
            <p className="text-body mx-auto mt-4 max-w-[560px] text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
              {lead}
            </p>
          )}
          <span className="mx-auto mt-10 block h-px w-[228px] bg-lilac-quiet" />
        </Reveal>

        <Reveal className="mt-10 lg:mt-12">
          <ClientLogoWall logos={logos} maxTiles={maxTiles} counterLabel={counterLabel} />
        </Reveal>
      </div>
    </section>
  )
}
