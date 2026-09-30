"use client"

import { useEffect, useRef } from "react"
import { FileText, Maximize2 } from "lucide-react"
import type { BriefDocument, EvaluationDetail } from "@/lib/askFruit/types"
import { Composer, STARTERS } from "./Composer"
import { Markdown } from "./Markdown"
import type { WorkingStatus } from "./useAskFruit"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"
/** Follow new output only when the reader is already near the bottom. */
const FOLLOW_THRESHOLD_PX = 80

export function Welcome({ onSend, sending }: { onSend: (text: string) => void; sending: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center px-5 py-10 md:px-8">
      <p className={`${EYEBROW} text-brand`}>{"// Ask Fruit"}</p>
      <h1 className="text-section-h2 mt-4 text-body">
        What are you trying to <span className="text-brand">make happen?</span>
      </h1>
      <p className="text-body-lead mt-4 max-w-[600px] text-muted">
        Describe the problem in your own words. Fruit asks what it needs to, recommends the Fruition solution that fits,
        and writes up a comparison or delivery plan you can share.
      </p>
      <div className="mt-8">
        <Composer onSend={onSend} sending={sending} autoFocus large />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.label}
            type="button"
            disabled={sending}
            onClick={() => onSend(s.text)}
            className="rounded-pill border border-ui bg-surface px-3.5 py-1.5 text-[13px] font-medium text-body transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
      </div>
      <ol className="mt-10 grid grid-cols-1 gap-4 border-t border-ui pt-6 md:grid-cols-3">
        {[
          ["01", "Describe", "Your goal, your tools, what is breaking."],
          ["02", "Compare", "Matched Fruition solutions, scored against your requirements."],
          ["03", "Plan", "A brief to share, then a call with a consultant when you are ready."],
        ].map(([n, t, d]) => (
          <li key={n} className="flex flex-col gap-1">
            <span className="font-mono text-[12px] font-semibold text-brand">{n}</span>
            <span className="text-[15px] font-semibold text-body">{t}</span>
            <span className="text-[13.5px] leading-snug text-muted">{d}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function WorkingPanel({ status }: { status: WorkingStatus }) {
  return (
    <div className="flex w-fit items-center gap-2.5 rounded-chip bg-surface-dark px-3.5 py-2 font-mono text-[12px] text-white/80" role="status">
      <span className="text-brand-light">[{status.kind === "tool" ? "RUN" : "THINK"}]</span>
      <span>{status.label}</span>
      <span className="flex gap-0.5" aria-hidden>
        <span className="h-1 w-1 animate-pulse rounded-full bg-white/70" />
        <span className="h-1 w-1 animate-pulse rounded-full bg-white/70 [animation-delay:150ms]" />
        <span className="h-1 w-1 animate-pulse rounded-full bg-white/70 [animation-delay:300ms]" />
      </span>
    </div>
  )
}

function DocumentCard({ doc, onOpen }: { doc: BriefDocument; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full max-w-[520px] items-center gap-3 rounded-chip border border-ui bg-surface p-3.5 text-left shadow-micro transition-colors hover:border-brand"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-badge bg-surface-dark text-white">
        <FileText size={17} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`${EYEBROW} block text-muted`}>
          {doc.doc_type === "comparison_brief" ? "Comparison brief" : "Implementation brief"}
        </span>
        <span className="block truncate text-[14px] font-semibold text-body">{doc.title}</span>
      </span>
      <span className="flex items-center gap-1 text-[12.5px] font-semibold text-brand">
        Open <Maximize2 size={14} aria-hidden />
      </span>
    </button>
  )
}

export function Conversation({
  evaluation,
  sending,
  status,
  prefill,
  onSend,
  onStop,
  onOpenBrief,
}: {
  evaluation: EvaluationDetail
  sending: boolean
  status: WorkingStatus | null
  prefill: { text: string; nonce: number } | null
  onSend: (text: string) => void
  onStop: () => void
  onOpenBrief: (doc: BriefDocument) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const following = useRef(true)
  const last = evaluation.messages[evaluation.messages.length - 1]

  useEffect(() => {
    const el = scroller.current
    if (el && following.current) el.scrollTop = el.scrollHeight
  }, [last?.markdown, evaluation.messages.length, status, evaluation.documents.length])

  // Briefs appear in the transcript after the reply of the turn that made them.
  const docsByTurn = new Map<number, BriefDocument[]>()
  const assistantIdx = evaluation.messages.map((m, i) => (m.role === "assistant" ? i : -1)).filter((i) => i >= 0)
  for (const doc of evaluation.documents) {
    const at = assistantIdx.find((i) => (evaluation.messages[i].created_at ?? "") >= doc.created_at) ?? assistantIdx[assistantIdx.length - 1]
    if (at == null) continue
    docsByTurn.set(at, [...(docsByTurn.get(at) ?? []), doc])
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget
          following.current = el.scrollHeight - el.scrollTop - el.clientHeight < FOLLOW_THRESHOLD_PX
        }}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-6 px-5 py-8 md:px-8">
          {evaluation.messages.map((m, i) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-chip rounded-br-[4px] bg-surface-subtle px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap text-body">
                  {m.markdown}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex flex-col gap-2">
                <p className={`${EYEBROW} text-brand`}>Fruit</p>
                {m.markdown ? <Markdown markdown={m.markdown} /> : null}
                {m.status === "failed" ? (
                  <p className="text-[13px] text-muted">
                    {m.markdown ? "The answer was cut short." : "No answer this time."} Send your message again to retry.
                  </p>
                ) : null}
                {(docsByTurn.get(i) ?? []).map((doc) => (
                  <DocumentCard key={doc.doc_id} doc={doc} onOpen={() => onOpenBrief(doc)} />
                ))}
              </div>
            ),
          )}
          {sending && status ? <WorkingPanel status={status} /> : null}
        </div>
      </div>
      <div className="border-t border-ui bg-surface px-5 py-3 md:px-8">
        <div className="mx-auto w-full max-w-[820px]">
          <Composer onSend={onSend} onStop={onStop} sending={sending} prefill={prefill} />
          <p className="mt-2 text-center text-[11.5px] text-faint">
            Fruit can be wrong. Pricing and timelines are confirmed with a consultant.
          </p>
        </div>
      </div>
    </div>
  )
}
