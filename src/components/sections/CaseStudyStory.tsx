import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react"
import FramedMedia from "@/components/common/FramedMedia"

export interface CaseStudyPerson {
  name?: string
  role?: string
  company?: string
  /** Pre-resolved on the server. */
  photoUrl?: string | null
}

export interface CaseStudyMetric {
  value?: string
  label?: string
  note?: string
}

/** The text body of a case study: everything that used to be baked into its image. */
export interface CaseStudyStoryContent {
  clientName?: string
  logoUrl?: string | null
  quote?: string
  quotePeople?: CaseStudyPerson[]
  challenge?: PortableTextBlock[]
  solution?: PortableTextBlock[]
  impactMetrics?: CaseStudyMetric[]
  impact?: PortableTextBlock[]
  location?: string
  companySize?: string
  sector?: string
  useCase?: string
}

/** True once a card carries real text, so the legacy image can be dropped. */
export function hasCaseStudyStory(story: CaseStudyStoryContent): boolean {
  return Boolean(story.challenge?.length || story.solution?.length || story.impact?.length)
}

const proseComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-3 first:mt-0">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-3 first:mt-0 flex flex-col gap-2 pl-5 list-disc marker:text-brand [&_ul]:mt-2 [&_ul]:list-[circle]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-3 first:mt-0 flex flex-col gap-2 pl-5 list-decimal marker:font-mono marker:text-xs marker:font-semibold marker:text-brand">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  },
}

function StoryColumn({ heading, value }: { heading: string; value?: PortableTextBlock[] }) {
  if (!value?.length) return null
  return (
    <section className="min-w-0">
      <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand pb-3 mb-4 border-b border-ui">
        {heading}
      </h4>
      <div className="text-body-sm text-muted">
        <PortableText value={value} components={proseComponents} />
      </div>
    </section>
  )
}

export function CaseStudyLogo({ story }: { story: CaseStudyStoryContent }) {
  if (!story.logoUrl) return null
  return (
    <FramedMedia className="shrink-0">
      <div className="flex items-center justify-center w-[120px] h-[76px] md:w-[176px] md:h-[112px] p-3 rounded-tile bg-surface-raised ring-1 ring-ui shadow-micro">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.logoUrl}
          alt={story.clientName ? `${story.clientName} logo` : ""}
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
      </div>
    </FramedMedia>
  )
}

/**
 * Metrics, client quote, challenge / solution / impact and the fact row of one
 * case study, as real text. Rendered inside the TestimonialFilterGrid card.
 */
export default function CaseStudyStory({ story }: { story: CaseStudyStoryContent }) {
  const metrics = (story.impactMetrics ?? []).filter((m) => m.value)
  const people = (story.quotePeople ?? []).filter((p) => p.name)
  const facts = [
    { label: "Location", value: story.location },
    { label: "Employees", value: story.companySize },
    { label: "Industry", value: story.sector },
    { label: "Use case", value: story.useCase },
  ].filter((f) => f.value)

  return (
    // Client outcomes in their own currency, never converted.
    <div className="mt-10 flex flex-col gap-10" data-currency-skip="">
      {metrics.length > 0 && (
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {metrics.map((m, i) => (
            <div
              key={`${m.value}-${i}`}
              className="flex flex-col-reverse justify-end gap-1 p-5 md:p-6 rounded-tile bg-surface-raised ring-1 ring-ui shadow-whisper"
            >
              <dt className="text-caption text-muted">
                {m.label}
                {m.note && <span className="block text-micro text-faint mt-0.5">{m.note}</span>}
              </dt>
              <dd className="font-bold text-[clamp(30px,5vw,40px)] leading-[1.1] tracking-[-0.02em] text-brand">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {story.quote && (
        <figure className="rounded-tile bg-surface-raised ring-1 ring-ui p-6 md:p-8 lg:p-10">
          <blockquote className="text-[19px] md:text-[22px] leading-[1.45] font-medium text-ink text-pretty">
            <p>&ldquo;{story.quote}&rdquo;</p>
          </blockquote>
          {people.length > 0 && (
            <figcaption className="mt-6 flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-x-8">
              {people.map((person, i) => (
                <div key={`${person.name}-${i}`} className="flex items-center gap-3.5">
                  {person.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.photoUrl}
                      alt={person.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-soft"
                    />
                  )}
                  <div className="text-body-sm leading-snug">
                    <cite className="not-italic font-semibold text-ink block">{person.name}</cite>
                    <span className="text-muted block">
                      {[person.role, person.company].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>
              ))}
            </figcaption>
          )}
        </figure>
      )}

      {hasCaseStudyStory(story) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 lg:gap-10">
          <StoryColumn heading="The challenge" value={story.challenge} />
          <StoryColumn heading="The solution" value={story.solution} />
          <div className="md:col-span-2 lg:col-span-1 min-w-0">
            <StoryColumn heading="The impact" value={story.impact} />
          </div>
        </div>
      )}

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pt-6 border-t border-ui">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{f.label}</dt>
              <dd className="text-body-sm font-medium text-ink mt-1">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
