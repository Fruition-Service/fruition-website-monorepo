import CtaButton from "@/components/CtaButton"

/** Hero for the AI use case hub and industry pages. */

interface Stat {
  value: string
  label: string
}

interface UseCasesHeroProps {
  eyebrow?: string
  badges?: string[]
  heading: string
  /** Substring of `heading` drawn in the accent colour. */
  headingAccent?: string
  lead: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
  stats: Stat[]
}

function Accented({ text, accent }: { text: string; accent?: string }) {
  const at = accent ? text.indexOf(accent) : -1
  if (!accent || at === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className="text-brand">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  )
}

export default function UseCasesHero({
  eyebrow,
  badges,
  heading,
  headingAccent,
  lead,
  primary,
  secondary,
  stats,
}: UseCasesHeroProps) {
  return (
    <section className="border-b border-ui bg-surface px-4 pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="mx-auto w-full max-w-[1200px]">
        {eyebrow && (
          <p className="mb-[18px] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {eyebrow}
          </p>
        )}
        {badges && badges.length > 0 && (
          <ul aria-label="Partnerships and awards" className="mb-6 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <li
                key={badge}
                className="rounded-pill bg-surface-raised px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted ring-1 ring-ui"
              >
                {badge}
              </li>
            ))}
          </ul>
        )}
        <h1 className="max-w-[18ch] text-display text-body text-balance">
          <Accented text={heading} accent={headingAccent} />
        </h1>
        <p className="mt-5 max-w-[62ch] text-body-lead text-muted">{lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaButton href={primary.href} label={primary.label} variant="primary" />
          {secondary && <CtaButton href={secondary.href} label={secondary.label} variant="outline" />}
        </div>
        {stats.length > 0 && (
          <dl
            className={`mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-ui ring-1 ring-ui [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1 ${
              stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
            }`}
          >
            {stats.map((s) => (
              <div key={s.label} className="bg-surface-raised px-5 py-4 md:px-6 md:py-5">
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {s.label}
                </dt>
                <dd className="mt-1 text-section-h3 text-body">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
