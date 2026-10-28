import type { UseCase } from "@/features/ai-use-cases/types"
import ProcessDiagram, { ProcessLegend } from "./ProcessDiagram"

/**
 * "See the build": everything behind one use case. Rendered inside the build
 * dialog, and server-rendered on the industry pages so the detail is part of
 * the page's HTML rather than only fetched on click.
 */

const CARD = "rounded-card bg-surface-raised p-5 ring-1 ring-ui md:p-6"
const CARD_TITLE = "font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand"

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3">
      {items.map((item, i) => (
        <li
          key={`${i}-${item}`}
          className={`flex items-start gap-3 text-body-sm text-muted ${
            i === 0 ? "" : "mt-2.5 border-t border-dashed border-ui pt-2.5"
          }`}
        >
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-[2px] bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-badge bg-mist px-2.5 py-1 text-[13px] leading-snug text-body ring-1 ring-ui"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function Fact({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={CARD}>
      <h3 className={CARD_TITLE}>{title}</h3>
      {children}
    </div>
  )
}

export default function UseCaseBuild({ useCase }: { useCase: UseCase }) {
  const { process } = useCase
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        {process && (
          <div className={CARD}>
            <h3 className={CARD_TITLE}>Future-state process</h3>
            <p className="mt-3 text-card-title text-body">{process.title}</p>
            <p className="mt-1 text-body-sm text-muted">How the work flows once the solution is live.</p>
            <div className="mt-5">
              <ProcessDiagram process={process} />
            </div>
            <div className="mt-5 border-t border-ui pt-4">
              <ProcessLegend />
            </div>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {useCase.boards.length > 0 && (
            <Fact title="Boards & modules">
              <Bullets items={useCase.boards} />
            </Fact>
          )}
          {useCase.automations.length > 0 && (
            <Fact title="Automations & AI steps">
              <Bullets items={useCase.automations} />
            </Fact>
          )}
        </div>
      </div>

      <aside className="grid content-start gap-4 md:grid-cols-2 lg:grid-cols-1">
        {useCase.challenge && (
          <Fact title="The challenge">
            <p className="mt-3 text-body-sm text-muted">{useCase.challenge}</p>
          </Fact>
        )}
        {useCase.outcome && (
          <Fact title="Expected outcome">
            <p className="mt-3 text-body-sm text-muted">{useCase.outcome}</p>
          </Fact>
        )}
        {useCase.timeframe && (
          <Fact title="Timeframe for the complete build">
            <p className="mt-3 text-body font-semibold text-body">{useCase.timeframe}</p>
          </Fact>
        )}
        {useCase.integrations.length > 0 && (
          <Fact title="Integrations">
            <Tags items={useCase.integrations} />
          </Fact>
        )}
        {useCase.teams.length > 0 && (
          <Fact title="Teams involved">
            <Tags items={useCase.teams} />
          </Fact>
        )}
      </aside>
    </div>
  )
}
