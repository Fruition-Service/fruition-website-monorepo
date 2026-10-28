import ClientLogoWall from "./ClientLogoWall"
import type { CarouselLogo } from "./types"

interface ClientLogoSectionProps {
  headingPart1?: string
  headingAccent?: string
  description?: string
  logos?: CarouselLogo[]
  /** 2×5 by default — a sample of the industry's clients, not the whole book. */
  maxTiles?: number
  /** Mono label above the heading. */
  eyebrow?: string
  align?: "center" | "left"
  /** Surface and vertical rhythm of the section. */
  className?: string
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
  eyebrow,
  align = "center",
  className = "bg-surface py-[80px]",
}: ClientLogoSectionProps) {
  if (!logos.length) return null

  // Several industryPage docs carry an empty string here rather than no value at
  // all, and a default parameter only fires on `undefined` — which rendered an
  // empty heading above the wall. Treat blank as "unset" so the standard line
  // always shows unless an editor deliberately wrote something else.
  const part1 = headingPart1?.trim() ? headingPart1 : DEFAULT_PART1
  const accent = headingAccent?.trim() ? headingAccent : DEFAULT_ACCENT

  const left = align === "left"
  const heading = (
    <p className={left ? "text-section-h3 text-left" : "text-section-h3 text-center"}>
      <span className="text-body">{part1}</span>
      <span className="text-brand">{accent}</span>
    </p>
  )

  return (
    <section className={className}>
      <div className={`site-container flex flex-col ${left ? "items-start" : "items-center"} gap-[35px]`}>
        {eyebrow ? (
          <div>
            <p className="mb-[18px] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {eyebrow}
            </p>
            {heading}
          </div>
        ) : (
          heading
        )}
        {description && (
          <p
            className={`max-w-[860px] ${left ? "text-left" : "text-center"} text-base leading-[1.6] whitespace-pre-line text-muted`}
          >
            {description}
          </p>
        )}
        <ClientLogoWall logos={logos} maxTiles={maxTiles} className="w-full" />
      </div>
    </section>
  )
}
