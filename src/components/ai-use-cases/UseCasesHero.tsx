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
    <section className="hero-band border-b border-ui bg-surface pt-14 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
      <div className="site-container">
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
                className="rounded-pill bg-surface px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted ring-1 ring-ui"
              >
                {badge}
              </li>
            ))}
          </ul>
        )}
        <h1 className="max-w-[20ch] text-[clamp(2rem,6vw,4.875rem)] leading-[1.05] font-bold tracking-[-0.035em] text-balance text-body">
          <Accented text={heading} accent={headingAccent} />
        </h1>
        <p className="mt-6 max-w-[58ch] text-body-lead text-muted">{lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaButton href={primary.href} label={primary.label} variant="primary" />
          {secondary && <CtaButton href={secondary.href} label={secondary.label} variant="outline" />}
        </div>
        {stats.length > 0 && (
          <dl
            className={`mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-tile bg-ui ring-1 ring-ui [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1 ${
              stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
            }`}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-surface-raised px-5 py-5 md:px-6 md:py-6">
                <dt className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {s.label}
                </dt>
                <dd className="text-[32px] leading-none font-semibold tracking-[-0.02em] text-body md:text-[40px]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
