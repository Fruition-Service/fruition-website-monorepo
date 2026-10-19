import type { ReactNode } from "react"
import type { UseCaseTile } from "@/features/ai-use-cases/types"

/**
 * One use case tile: industry label, AI / own-build pills, the organisation,
 * the challenge in brief and the teams involved. `action` is the footer:
 * a "See the build" button in the catalogue, a link on the landing pages.
 */

export const PILL = "rounded-badge px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]"

export function UseCasePills({ ai, own }: { ai: boolean; own: boolean }) {
  if (!ai && !own) return null
  return (
    <span className="flex shrink-0 gap-1.5">
      {ai && <span className={`${PILL} bg-brand text-white`}>AI</span>}
      {own && <span className={`${PILL} bg-brand-soft text-brand-dark`}>Our own build</span>}
    </span>
  )
}

interface UseCaseCardProps {
  tile: UseCaseTile
  action: ReactNode
  /** Hide the industry label where the whole list is one industry. */
  hideKicker?: boolean
  headingLevel?: "h2" | "h3"
}

export default function UseCaseCard({ tile, action, hideKicker, headingLevel = "h3" }: UseCaseCardProps) {
  const Heading = headingLevel
  const showKicker = !hideKicker || tile.own
  return (
    <article className="flex h-full flex-col rounded-card bg-surface-raised p-6 shadow-whisper ring-1 ring-ui transition-[box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:shadow-card hover:ring-brand-light motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7">
      <div className="flex items-start justify-between gap-3">
        {showKicker ? (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            {tile.kicker}
          </span>
        ) : (
          <span />
        )}
        <UseCasePills ai={tile.ai} own={tile.own} />
      </div>
      {tile.metric && (
        <p className="mt-4 font-mono text-sm font-semibold text-body">{tile.metric}</p>
      )}
      <Heading className={`${tile.metric ? "mt-1" : "mt-4"} text-[19px] leading-tight font-semibold tracking-[-0.01em] text-body`}>
        {tile.title}
      </Heading>
      <p className="mt-3 line-clamp-5 text-body-sm text-muted">{tile.summary}</p>
      {tile.teams.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tile.teams.slice(0, 3).map((team) => (
            <li key={team} className="rounded-badge bg-mist px-2 py-0.5 text-[12px] text-muted ring-1 ring-ui">
              {team}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-5">{action}</div>
    </article>
  )
}

/** The footer link style shared by the catalogue button and landing-page links. */
export const SEE_BUILD =
  "inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand transition-colors hover:text-brand-dark focus-visible:rounded-chip focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"
