import { Acc, Badge, Sec } from "../primitives"
import type { VcSolutionFinderData } from "../types"
import VcSolutionFinder from "./VcSolutionFinder"

/**
 * Solution finder section (vcSolutionFinder). PAGE-SPECIFIC: not part of any
 * page group's Version C template (pageSpecific: true, key
 * pagespecific-hubspot-solution-finder, registered in
 * src/data/vcPageSpecificSections.ts). First use: /hubspot-consulting, directly
 * under the hero. Section head and how-it-works lines on the left, the chat
 * card on the right; one column below 1024px. Styles: sf-* rules in
 * scripts/vc/extras-hubspot-consulting.css.
 */
export function VcSolutionFinderSection({ s }: { s: VcSolutionFinderData }) {
  const head = s.head
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor ?? "solution-finder"} cls={s.sectionClass} dataSec="solution-finder">
      <div className="sf-grid">
        <div className="sf-intro">
          {head?.badge && <Badge>{head.badge}</Badge>}
          {head?.heading && (
            <h2 className="h2">
              <Acc text={head.heading} />
            </h2>
          )}
          {head?.lead && <p className="lead">{head.lead}</p>}
          {!!s.howTo?.length && (
            <ol className="sf-how">
              {s.howTo.map((t, i) => (
                <li key={i}>
                  <span className="sf-how-n">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <VcSolutionFinder s={s} />
      </div>
    </Sec>
  )
}
