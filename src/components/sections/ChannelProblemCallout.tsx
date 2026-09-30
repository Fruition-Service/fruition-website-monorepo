interface Props {
  /** Mono label on the left rail, e.g. "The engineering problem". */
  eyebrow?: string
  /** Short statement on the left rail, e.g. "Why LINE is not a connector." */
  title: string
  /** Body copy. Blank lines split paragraphs; the first reads as the lead. */
  body: string
}

/**
 * The positioning statement on the messaging-channel pages, set as its own
 * card rather than loose centred text under the hero CTAs, where it read as
 * an orphaned caption to the buttons. A labelled left rail says what the
 * paragraph is; the first paragraph is the claim, the rest is the reasoning.
 */
export default function ChannelProblemCallout({ eyebrow, title, body }: Props) {
  const [lead, ...rest] = body.split("\n\n").filter(Boolean)
  if (!lead) return null

  return (
    <section className="bg-surface px-4 pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-[1100px] overflow-hidden rounded-card bg-surface-raised shadow-whisper ring-1 ring-ui md:grid md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <div className="border-b border-ui bg-brand-soft p-6 md:border-b-0 md:border-r md:p-10">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              {eyebrow}
            </p>
          )}
          <p className="text-2xl font-semibold leading-tight text-body">{title}</p>
        </div>
        <div className="p-6 md:p-10">
          <p className="text-body-lead text-body">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-4 text-body text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
