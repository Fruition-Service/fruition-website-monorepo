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
 * Only the edges a straight read would miss are spelled out: labelled
 * branches ("Yes", "No") and jumps to anything other than the next step.
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
    if (!label && b === a + 1) continue
    const list = out.get(from) ?? []
    list.push({ label, to: b + 1, toLabel: process.steps[b].label })
    out.set(from, list)
  }
  return out
}

function StepBox({ step, n }: { step: ProcessStep; n: number }) {
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
    </div>
  )
}

function BranchNotes({ branches }: { branches?: Branch[] }) {
  if (!branches?.length) return null
  return (
    <ul className="mt-1.5 space-y-0.5 text-[12px] leading-snug text-muted">
      {branches.map((b) => (
        <li key={`${b.label}-${b.to}`}>
          {b.label && <strong className="font-semibold text-ink">{b.label} </strong>}→ {pad(b.to)}{" "}
          {b.toLabel}
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
        <ol className="relative space-y-2 md:space-y-0">
          {process.steps.map((step, i) => (
            <li key={step.id} className={`md:grid md:gap-x-3 md:py-1.5 ${cols}`}>
              <div className={COL_START[(laneIndex.get(step.lane) ?? 0) + 1]}>
                {/* Phone: the lane is a label, since the columns are gone */}
                <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-label md:sr-only">
                  {step.lane}
                </p>
                <StepBox step={step} n={i + 1} />
                <BranchNotes branches={branches.get(step.id)} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
