import SectionIntro from "./SectionIntro"
import RichText from "./RichText"
import type { IndustryPoint } from "./types"

interface BenefitLedgerSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  /** Lead copy. Blank lines split it into paragraphs. */
  intro?: string
  items?: IndustryPoint[]
  /** Closing paragraph below the ledger, separated by a hairline. */
  footnote?: string
  theme?: "light" | "tint"
}

/**
 * The dashed-ledger benefit list: the framing copy holds a sticky left column
 * while the benefits run down the right as mono-indexed rows separated by
 * dashed hairlines. Built for the long "benefits of monday CRM for X" lists
 * that read badly as yet another card grid.
 */
export default function BenefitLedgerSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  items = [],
  footnote,
  theme = "tint",
}: BenefitLedgerSectionProps) {
  if (items.length === 0) return null

  const paragraphs = (intro ?? "").split("\n\n").filter(Boolean)

  return (
    <section
      className={`section-y ${
        theme === "tint" ? "bg-surface-subtle" : "bg-surface"
      }`}
    >
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,410px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionIntro
            eyebrow={eyebrow}
            heading={heading}
            headingAccent={headingAccent}
            align="left"
          />
          {paragraphs.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body text-muted">
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <ol className="flex flex-col">
            {items.map((item, i) => (
              <li
                key={item.text}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-dashed border-ui py-4 last:border-b-0 md:gap-6 md:py-5"
              >
                <span
                  aria-hidden
                  className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand pt-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-body-sm text-muted">
                  {item.label && (
                    <strong className="font-semibold text-body">{item.label}: </strong>
                  )}
                  <RichText text={item.text} />
                </p>
              </li>
            ))}
          </ol>
          {footnote && (
            <p className="text-body-sm text-muted border-t border-ui pt-6 mt-6">
              <RichText text={footnote} />
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
