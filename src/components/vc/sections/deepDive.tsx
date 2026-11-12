import { Head, Sec } from "../primitives"
import type { VcDeepDiveData } from "../types"

/**
 * Service deep dive (vcDeepDive). PAGE-SPECIFIC: not part of any page group's
 * Version C template (pageSpecific: true, keys pagespecific-*). It carries the copy of a retired leaf page on its hub
 * (first use: the four Atlassian services on /atlassian-consulting, anchors
 * #jira #confluence #jsm #migration). Only existing Version C classes are
 * used (shead, steps/step, cards4/card), plus the dd-* spacing rules in
 * scripts/vc/extras-atlassian-consulting.css.
 */
export function VcDeepDive({ s }: { s: VcDeepDiveData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="deep-dive">
      <Head head={s.head} />
      {s.stepsHeading && <h3 className="h3 dd-sub">{s.stepsHeading}</h3>}
      {!!s.steps?.length && (
        <div className="steps">
          {s.steps.map((it, i) => (
            <div className="step" key={it._key ?? i}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              {it.title && <h4 className="h3">{it.title}</h4>}
              {it.body && <p className="body">{it.body}</p>}
            </div>
          ))}
        </div>
      )}
      {s.cardsHeading && <h3 className="h3 dd-sub">{s.cardsHeading}</h3>}
      {!!s.cards?.length && (
        <div className="cards4">
          {s.cards.map((it, i) => (
            <article className="card" key={it._key ?? i}>
              {it.title && <h4 className="h3">{it.title}</h4>}
              {it.body && <p className="body">{it.body}</p>}
            </article>
          ))}
        </div>
      )}
    </Sec>
  )
}
