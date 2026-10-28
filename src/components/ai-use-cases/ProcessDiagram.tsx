import type { ProcessStep, ProcessStepKind, UseCaseProcess } from "@/features/ai-use-cases/types"

/**
 * The future-state process of a use case as a swimlane.
 *
 * From `md:` the lanes are columns and each step is a row, placed in its
 * lane's column, so the hand-offs between people, monday.com and connected
 * systems read top to bottom. On a phone five columns would not fit, so the
 * same list stacks with each step's lane shown as a label above it. It is
 * one render for every width: an industry page carries up to 70 of these.
 *
 * Every step is joined to the next by a connector that follows the lanes:
 * straight down within a lane, an elbow across lanes. A hand-off in `flow`
 * gets an arrow (and its branch label); a pair with no edge between them,
 * the tail of one branch above the head of another, gets a faint dashed
 * line instead. Jumps to anything other than the next step are written out
 * under the step, since a line across the whole diagram would not read.
 */

const KIND_BOX: Record<ProcessStepKind, string> = {
  start: "bg-surface-raised ring-1 ring-ui text-ink",
  end: "bg-surface-raised ring-1 ring-ui text-ink",
  task: "bg-surface-raised ring-1 ring-ui text-ink",
  auto: "bg-tint ring-1 ring-lilac-strong text-ink",
  ai: "bg-brand ring-1 ring-brand text-white",
  system: "bg-surface-subtle ring-1 ring-ui text-ink",
  decision: "bg-surface-raised ring-1 ring-amber text-ink",
}

const KIND_TAG: Partial<Record<ProcessStepKind, string>> = {
  start: "Start",
  end: "End",
  ai: "AI",
  decision: "Decision",
}

/** The legend, in the draft's own wording. */
const LEGEND: { kind: ProcessStepKind; label: string }[] = [
  { kind: "task", label: "Team step" },
  { kind: "auto", label: "monday.com automation" },
  { kind: "ai", label: "AI step" },
  { kind: "system", label: "Connected system" },
  { kind: "decision", label: "Decision" },
]

const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
}

const COL_START: Record<number, string> = {
  1: "md:col-start-1",
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
  5: "md:col-start-5",
}

const pad = (n: number) => String(n).padStart(2, "0")

interface Branch {
  label?: string
  to: number
  toLabel: string
}

/** Outgoing edges worth writing down for each step, keyed by step id. */
function branchesFor(process: UseCaseProcess): Map<string, Branch[]> {
  const position = new Map(process.steps.map((s, i) => [s.id, i]))
  const out = new Map<string, Branch[]>()
  for (const [from, to, label] of process.flow) {
    const a = position.get(from)
    const b = position.get(to)
    if (a === undefined || b === undefined) continue
    if (b === a + 1) continue
    const list = out.get(from) ?? []
    list.push({ label, to: b + 1, toLabel: process.steps[b].label })
    out.set(from, list)
  }
  return out
}

/** The edge from each step to the one after it, if `flow` has one. */
function nextEdges(process: UseCaseProcess): Map<string, { label?: string }> {
  const out = new Map<string, { label?: string }>()
  process.steps.forEach((step, i) => {
    const next = process.steps[i + 1]
    if (!next) return
    const edge = process.flow.find(([from, to]) => from === step.id && to === next.id)
    if (edge) out.set(step.id, { label: edge[2] })
  })
  return out
}

interface ConnectorProps {
  /** Lane columns, 0-based, of the step above and the step below. */
  from: number
  to: number
  /** The pair is a hand-off in `flow`. */
  linked: boolean
  label?: string
  cols: string
}

const LINE = "absolute border-current"

/**
 * The line between two consecutive steps. From `md:` it spans the lane
 * columns it crosses; the column centres are worked out from the span's
 * width so it lines up with the step boxes at any width without measuring.
 */
function Connector({ from, to, linked, label, cols }: ConnectorProps) {
  const lo = Math.min(from, to)
  const hi = Math.max(from, to)
  const span = hi - lo + 1
  // Centre of the first (and, mirrored, the last) column inside the span; 0.75rem is gap-x-3.
  const inset = `calc((100% - ${(span - 1) * 0.75}rem) / ${span * 2})`
  const edge = (col: number) => (col === lo ? { left: inset } : { right: inset })
  const shift = (col: number) => (col === lo ? "-translate-x-1/2" : "translate-x-1/2")
  const tone = linked ? "text-purple-mid" : "text-label"
  const stroke = linked ? "border-solid" : "border-dashed"
  const vertical = `${LINE} ${stroke} border-l-[1.5px]`
  const arrow = linked && (
    <span className="absolute bottom-0 size-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-current" />
  )
  const tag = label && (
    <span className="absolute top-1/2 -translate-y-1/2 rounded-full bg-surface-raised px-1.5 font-mono text-[10px] leading-4 font-semibold uppercase tracking-[0.12em] text-ink ring-1 ring-amber">
      {label}
    </span>
  )

  return (
    <div aria-hidden className={tone}>
      {/* Phone: one lane, so always straight down */}
      <div className="relative h-6 md:hidden">
        <span className={`${vertical} top-0 bottom-1 left-1/2 -translate-x-1/2`} />
        {arrow && <span className="absolute inset-x-0 bottom-0 flex justify-center">{arrow}</span>}
        {tag && <span className="absolute inset-y-0 left-1/2 ml-3">{tag}</span>}
      </div>

      <div className={`hidden h-7 gap-x-3 md:grid ${cols}`}>
        <div className="relative" style={{ gridColumn: `${lo + 1} / ${hi + 2}` }}>
          {span === 1 ? (
            <>
              <span className={`${vertical} top-0 bottom-1 left-1/2 -translate-x-1/2`} />
              {arrow && <span className="absolute inset-x-0 bottom-0 flex justify-center">{arrow}</span>}
              {tag && <span className="absolute inset-y-0 left-1/2 ml-3">{tag}</span>}
            </>
          ) : (
            <>
              <span className={`${vertical} top-0 h-1/2 ${shift(from)}`} style={edge(from)} />
              <span
                className={`${LINE} ${stroke} top-1/2 border-t-[1.5px]`}
                style={{ left: inset, right: inset, marginTop: "-0.75px" }}
              />
              <span className={`${vertical} top-1/2 bottom-1 ${shift(to)}`} style={edge(to)} />
              {arrow && (
                <span className={`absolute bottom-0 flex w-0 justify-center ${shift(to)}`} style={edge(to)}>
                  {arrow}
                </span>
              )}
              {tag && <span className="absolute inset-y-0 left-1/2 -translate-x-1/2">{tag}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StepBox({ step, n, branches }: { step: ProcessStep; n: number; branches?: Branch[] }) {
  const tag = KIND_TAG[step.kind]
  const onBrand = step.kind === "ai"
  return (
    <div className={`rounded-chip px-3 py-2.5 ${KIND_BOX[step.kind]}`}>
      <div
        className={`flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
          onBrand ? "text-white/80" : "text-muted"
        }`}
      >
        <span>{pad(n)}</span>
        {tag && <span className={onBrand ? "text-white" : "text-brand"}>{tag}</span>}
      </div>
      <p className="mt-1 text-[13px] leading-snug font-medium">{step.label}</p>
      <BranchNotes branches={branches} onBrand={onBrand} />
    </div>
  )
}

/** Inside the box, so the connector to the next step leaves from the box itself. */
function BranchNotes({ branches, onBrand }: { branches?: Branch[]; onBrand: boolean }) {
  if (!branches?.length) return null
  return (
    <ul
      className={`mt-2 space-y-0.5 border-t pt-1.5 text-[12px] leading-snug ${
        onBrand ? "border-white/30 text-white/80" : "border-ui text-muted"
      }`}
    >
      {branches.map((b) => (
        <li key={`${b.label}-${b.to}`}>
          {b.label && <strong className={`font-semibold ${onBrand ? "text-white" : "text-ink"}`}>{b.label} </strong>}→{" "}
          {pad(b.to)} {b.toLabel}
        </li>
      ))}
    </ul>
  )
}

export function ProcessLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-muted">
      {LEGEND.map((item) => (
        <li key={item.kind} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-3 rounded-[4px] ${KIND_BOX[item.kind]}`} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export default function ProcessDiagram({ process }: { process: UseCaseProcess }) {
  const lanes = process.lanes.slice(0, 5)
  const laneIndex = new Map(lanes.map((l, i) => [l, i]))
  const branches = branchesFor(process)
  const next = nextEdges(process)
  const col = (step: ProcessStep) => laneIndex.get(step.lane) ?? 0
  const cols = GRID_COLS[lanes.length] ?? GRID_COLS[5]

  return (
    <div>
      {/* Lane headers (tablet and up) */}
      <div aria-hidden className={`hidden gap-x-3 md:grid ${cols}`}>
        {lanes.map((lane) => (
          <p
            key={lane}
            className="border-b border-ui pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-label"
          >
            {lane}
          </p>
        ))}
      </div>
      <div className="relative md:mt-2">
        {/* Lane rules: one dashed line per column behind the steps */}
        <div aria-hidden className={`pointer-events-none absolute inset-0 hidden gap-x-3 md:grid ${cols}`}>
          {lanes.map((lane) => (
            <span key={lane} className="border-l border-dashed border-ui" />
          ))}
        </div>
        <ol className="relative md:pt-1.5 md:pb-1.5">
          {process.steps.map((step, i) => {
            const prev = process.steps[i - 1]
            const edge = prev && next.get(prev.id)
            return (
              <li key={step.id}>
                {prev && <Connector from={col(prev)} to={col(step)} linked={!!edge} label={edge?.label} cols={cols} />}
                <div className={`md:grid md:gap-x-3 ${cols}`}>
                  <div className={COL_START[col(step) + 1]}>
                    {/* Phone: the lane is a label, since the columns are gone */}
                    <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-label md:sr-only">
                      {step.lane}
                    </p>
                    <StepBox step={step} n={i + 1} branches={branches.get(step.id)} />
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
