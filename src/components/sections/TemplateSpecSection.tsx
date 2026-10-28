import { Check } from "lucide-react"
import SectionIntro from "./SectionIntro"
import RichText from "./RichText"
import type { SpecPanel } from "./types"

interface TemplateSpecSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  lead?: string
  panels?: SpecPanel[]
  /** Widest column count; always 1 on mobile and 2 at `md:`. */
  columns?: 2 | 3
  theme?: "light" | "tint"
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-2.5 text-body-sm text-muted">
          <Check size={14} aria-hidden className="mt-1 shrink-0 text-brand" />
          <span>
            <RichText text={bullet} />
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Template spec panels — what a monday.com board template actually ships with,
 * broken into columns, views and automations. Mono chips carry the enumerable
 * bits (column types, view names) so they read as the spec sheet they are
 * rather than as prose.
 */
export default function TemplateSpecSection({
  eyebrow,
  heading,
  headingAccent,
  lead,
  panels = [],
  columns = 3,
  theme = "tint",
}: TemplateSpecSectionProps) {
  if (panels.length === 0) return null

  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  return (
    <section
      className={`section-y ${
        theme === "tint" ? "bg-surface-subtle" : "bg-surface"
      }`}
    >
      <div className="site-container">
        <SectionIntro
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          lead={lead}
        />
        <div className={`${gridClass} gap-6 mt-12`}>
          {panels.map((panel) => (
            <article
              key={panel.title}
              className="flex flex-col gap-5 rounded-card ring-1 ring-ui bg-surface-raised shadow-whisper dark:shadow-none p-7 md:p-8"
            >
              <h3 className="text-card-title text-body">{panel.title}</h3>
              {panel.lead && (
                <p className="text-body-sm text-muted">
                  <RichText text={panel.lead} />
                </p>
              )}
              {(panel.bullets?.length ?? 0) > 0 && <BulletList bullets={panel.bullets!} />}
              {(panel.chips?.length ?? 0) > 0 && (
                <div>
                  {panel.chipsLabel && (
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-3">
                      {panel.chipsLabel}
                    </p>
                  )}
                  <ul className="flex flex-wrap gap-2">
                    {panel.chips!.map((chip) => (
                      <li
                        key={chip}
                        className="font-mono text-xs font-semibold rounded-pill border border-ui bg-surface px-3 py-1.5 text-body"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {panel.groups?.map((group) => (
                <div key={group.label}>
                  <p className="text-caption font-semibold text-body mb-2.5">{group.label}</p>
                  <BulletList bullets={group.bullets} />
                </div>
              ))}
              {panel.note && (
                <p className="text-caption text-muted border-t border-ui pt-4 mt-auto">
                  <RichText text={panel.note} />
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
