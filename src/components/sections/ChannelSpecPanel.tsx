export interface ChannelSpecRow {
  /** Mono label, e.g. "Messaging window" or "Pricing model". */
  label: string
  /** The platform's own answer, stated plainly. */
  value: string
  /** Why it changes what you build. Optional — not every row needs one. */
  implication?: string
}

interface Props {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  lead?: string
  rows?: ChannelSpecRow[]
  /** Sourcing / as-at caveat. Platform terms move; say when this was checked. */
  footnote?: string
}

/**
 * The platform spec sheet, rendered as the log panel the design system reserves
 * for proof-of-work: mono labels down the left, the platform's own rules in the
 * middle, and what that forces in the build on the right.
 *
 * These constraints (message windows, template approval, per-conversation
 * pricing) are the reason these integrations are engineering work rather than a
 * connector toggle, so they get a section rather than a footnote.
 */
export default function ChannelSpecPanel({
  eyebrow,
  heading,
  headingAccent,
  lead,
  rows = [],
  footnote,
}: Props) {
  if (rows.length === 0) return null

  return (
    <section className="bg-surface-dark px-4 py-14 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        {eyebrow && (
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light mb-3">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="text-section-h2 text-white max-w-[820px]">
            {heading}
            {headingAccent && <span className="text-brand-light"> {headingAccent}</span>}
          </h2>
        )}
        {lead && <p className="mt-5 text-body-lead text-white/70 max-w-[720px]">{lead}</p>}

        <dl className="mt-10 border-t border-white/15">
          {rows.map((row) => (
            <div
              key={row.label}
              className="border-b border-white/15 py-5 md:grid md:grid-cols-[0.8fr_1.3fr_1.4fr] md:gap-8 md:items-baseline"
            >
              <dt className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                {row.label}
              </dt>
              <dd className="mt-2 md:mt-0 text-body-sm font-medium text-white">{row.value}</dd>
              {row.implication ? (
                <dd className="mt-2 md:mt-0 text-body-sm text-white/70">
                  <span className="md:hidden font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-light block mb-1">
                    What it means
                  </span>
                  {row.implication}
                </dd>
              ) : (
                <dd className="hidden md:block" />
              )}
            </div>
          ))}
        </dl>

        {footnote && <p className="mt-6 text-body-sm text-white/55 max-w-[760px]">{footnote}</p>}
      </div>
    </section>
  )
}
