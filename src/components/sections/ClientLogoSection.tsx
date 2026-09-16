import ClientLogoWall from "./ClientLogoWall"
import type { CarouselLogo } from "./types"

interface ClientLogoSectionProps {
  headingPart1?: string
  headingAccent?: string
  description?: string
  logos?: CarouselLogo[]
  /** 2×5 by default — a sample of the industry's clients, not the whole book. */
  maxTiles?: number
}

/**
 * Heading + client logo wall, used on every industry and partnership page.
 *
 * Replaced a scrolling marquee from md up: the logos are proof, and proof should
 * sit still long enough to read. Below md the wall scrolls itself again, because
 * a still grid there is nine rows of thumb-work — see `ClientLogoWall`. The
 * homepage uses the same component at 5×5.
 */
const DEFAULT_PART1 = "Clients who have used our "
const DEFAULT_ACCENT = "monday.com consulting services"

export default function ClientLogoSection({
  headingPart1,
  headingAccent,
  description,
  logos = [],
  maxTiles = 10,
}: ClientLogoSectionProps) {
  if (!logos.length) return null

  // Several industryPage docs carry an empty string here rather than no value at
  // all, and a default parameter only fires on `undefined` — which rendered an
  // empty heading above the wall. Treat blank as "unset" so the standard line
  // always shows unless an editor deliberately wrote something else.
  const part1 = headingPart1?.trim() ? headingPart1 : DEFAULT_PART1
  const accent = headingAccent?.trim() ? headingAccent : DEFAULT_ACCENT

  return (
    <section className="bg-surface py-[80px]">
      <div className="mx-auto flex w-full max-w-[1348px] flex-col items-center gap-[35px] px-5 md:px-8">
        <p className="text-section-h3 text-center">
          <span className="text-body">{part1}</span>
          <span className="text-brand">{accent}</span>
        </p>
        {description && (
          <p className="max-w-[860px] text-center text-base leading-[1.6] whitespace-pre-line text-muted">
            {description}
          </p>
        )}
        <ClientLogoWall logos={logos} maxTiles={maxTiles} className="w-full" />
      </div>
    </section>
  )
}
