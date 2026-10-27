import Link from "next/link"
import SectionIntro from "./SectionIntro"
import RichText from "./RichText"
import type { CapabilityBlock, IndustryPoint } from "./types"

interface CapabilityBlocksSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  lead?: string
  blocks?: CapabilityBlock[]
  /** Widest column count; always 1 on mobile and 2 at `md:`. */
  columns?: 2 | 3
  theme?: "light" | "tint"
}

function PointRow({ point, first }: { point: IndustryPoint; first: boolean }) {
  return (
    <li
      className={`flex items-start gap-3 text-body-sm text-muted ${
        first ? "" : "border-t border-dashed border-ui pt-3 mt-3"
      }`}
    >
      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-[2px] bg-brand" />
      <span>
        {point.label && (
          <strong className="font-semibold text-body">{point.label}: </strong>
        )}
        <RichText text={point.text} />
      </span>
    </li>
  )
}

/**
 * Numbered capability blocks — a mono numeral on a hairline rule, a title, a
 * lead, then a dashed-ledger point list. Used for the "3 ways monday.com
 * bridges the site-to-office gap" style sections, where each block is a
 * mechanism rather than a feature bullet.
 */
export default function CapabilityBlocksSection({
  eyebrow,
  heading,
  headingAccent,
  lead,
  blocks = [],
  columns = 3,
  theme = "light",
}: CapabilityBlocksSectionProps) {
  if (blocks.length === 0) return null

  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  return (
    <section
      className={`px-4 py-14 md:py-20 lg:py-24 ${
        theme === "tint" ? "bg-surface-subtle" : "bg-surface"
      }`}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionIntro
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          lead={lead}
        />
        <div className={`${gridClass} gap-6 mt-12`}>
          {blocks.map((block, i) => (
            <article
              key={block.title}
              className="flex flex-col rounded-card ring-1 ring-ui bg-surface-raised shadow-whisper dark:shadow-none p-7 md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {block.number || String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px flex-1 bg-ui" />
              </div>
              <h3 className="text-card-title text-body mt-4">{block.title}</h3>
              {block.lead && (
                <p className="text-body-sm text-muted mt-3">
                  <RichText text={block.lead} />
                </p>
              )}
              {(block.points?.length ?? 0) > 0 && (
                <ul className="mt-5">
                  {block.points!.map((point, pi) => (
                    <PointRow key={point.text} point={point} first={pi === 0} />
                  ))}
                </ul>
              )}
              {block.note && (
                <p className="text-caption text-muted border-t border-ui pt-4 mt-6">
                  <RichText text={block.note} />
                </p>
              )}
              {block.linkLabel && block.href && (
                <div className="mt-auto pt-6">
                  <Link
                    href={block.href}
                    className="inline-flex min-h-11 w-full items-center gap-2 border-t border-ui pt-4 text-body-sm font-semibold text-brand-dark hover:underline"
                  >
                    {block.linkLabel}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
