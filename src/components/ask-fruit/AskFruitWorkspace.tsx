"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, MessageSquare, PanelRight, Pencil, Plus, Printer, Trash2, X } from "lucide-react"
import type { BriefDocument, EvaluationSummary } from "@/lib/askFruit/types"
import { BriefBody, BriefFooter } from "./BriefView"
import { Conversation, Welcome } from "./Conversation"
import { ResultsPanel } from "./ResultsPanel"
import { useAskFruit } from "./useAskFruit"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"
const BOOKING_URL = "/contact-us#book"

function ConversationList({
  summaries,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: {
  summaries: EvaluationSummary[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onRename: (id: string, current: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <button
          type="button"
          onClick={onNew}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-pill bg-brand text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <Plus size={16} aria-hidden /> New conversation
        </button>
      </div>
      <p className={`${EYEBROW} px-4 pt-2 pb-2 text-muted`}>
        Your conversations <span className="text-faint">{String(summaries.length).padStart(2, "0")}</span>
      </p>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4" aria-label="Your conversations">
        {summaries.length ? (
          summaries.map((s) => {
            const active = s.evaluation_id === activeId
            return (
              <div
                key={s.evaluation_id}
                className={`group flex items-center gap-1 rounded-chip pr-1 transition-colors ${active ? "bg-tint" : "hover:bg-surface-subtle"}`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(s.evaluation_id)}
                  aria-current={active ? "true" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
                >
                  <MessageSquare size={14} className={active ? "shrink-0 text-brand" : "shrink-0 text-muted"} aria-hidden />
                  <span className={`truncate text-[13px] ${active ? "font-semibold text-body" : "text-body"}`}>{s.title}</span>
                  {s.match_count ? <span className="ml-auto font-mono text-[10.5px] text-muted">{s.match_count}</span> : null}
                </button>
                <button
                  type="button"
                  onClick={() => onRename(s.evaluation_id, s.title)}
                  aria-label={`Rename ${s.title}`}
                  className="rounded-badge p-1.5 text-muted opacity-0 group-hover:opacity-100 hover:text-brand focus-visible:opacity-100"
                >
                  <Pencil size={13} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.evaluation_id)}
                  aria-label={`Delete ${s.title}`}
                  className="rounded-badge p-1.5 text-muted opacity-0 group-hover:opacity-100 hover:text-brand focus-visible:opacity-100"
                >
                  <Trash2 size={13} aria-hidden />
                </button>
              </div>
            )
          })
        ) : (
          <p className="mx-2 rounded-chip border border-dashed border-ui p-4 text-[12.5px] leading-snug text-muted">
            Your conversations are saved to this browser so you can pick them up later.
          </p>
        )}
      </nav>
    </div>
  )
}

function Drawer({
  side,
  open,
  onClose,
  label,
  children,
}: {
  side: "left" | "right"
  open: boolean
  onClose: () => void
  label: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-surface-dark/40" />
      <div
        className={`absolute top-0 bottom-0 flex w-[min(92vw,380px)] flex-col bg-surface shadow-card ${side === "left" ? "left-0" : "right-0"}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ui px-4">
          <span className={`${EYEBROW} text-muted`}>{label}</span>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-badge p-1.5 text-muted hover:text-brand">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function BriefDialog({ doc, evaluationId, onClose }: { doc: BriefDocument; evaluationId: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-surface-dark/50 md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="af-brief-title">
      <div className="flex max-h-full w-full max-w-[980px] flex-col overflow-hidden bg-surface md:rounded-card md:shadow-card">
        <div className="flex shrink-0 items-center gap-3 border-b border-ui px-5 py-3.5 md:px-7">
          <div className="min-w-0 flex-1">
            <p className={`${EYEBROW} text-brand`}>{doc.doc_type === "comparison_brief" ? "Comparison brief" : "Implementation brief"}</p>
            <h2 id="af-brief-title" className="truncate text-[17px] font-semibold text-body">
              {doc.title}
            </h2>
          </div>
          <a
            href={`/ask-fruit/workspace?brief=${encodeURIComponent(`${evaluationId}:${doc.doc_id}`)}`}
            target="_blank"
            rel="noopener"
            className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-ui px-3 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
          >
            <Printer size={15} aria-hidden />
            <span className="hidden md:inline">Print or save PDF</span>
          </a>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close brief" className="rounded-badge p-2 text-muted hover:text-brand">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-7">
          <BriefBody document={doc} />
          <BriefFooter />
        </div>
      </div>
    </div>
  )
}

export default function AskFruitWorkspace() {
  const af = useAskFruit()
  const { active } = af
  const [navOpen, setNavOpen] = useState(false)
  const [resultsOpen, setResultsOpen] = useState(false)
  const [brief, setBrief] = useState<BriefDocument | null>(null)
  const [prefill, setPrefill] = useState<{ text: string; nonce: number } | null>(null)
  const handledQuery = useRef(false)

  // A question typed on /ask-fruit arrives as ?q= and starts a new conversation.
  // Read from window.location so the page itself stays statically rendered.
  const { loading, send, newConversation } = af
  useEffect(() => {
    if (loading || handledQuery.current) return
    handledQuery.current = true
    const q = new URLSearchParams(window.location.search).get("q")?.trim()
    if (!q) return
    window.history.replaceState(null, "", window.location.pathname)
    newConversation()
    void send(q.slice(0, 4000))
  }, [loading, send, newConversation])

  const hasConversation = Boolean(active && active.messages.length)
  const prefillComposer = (text: string) => {
    setResultsOpen(false)
    setPrefill({ text, nonce: Date.now() })
  }

  const rename = (id: string, current: string) => {
    const title = window.prompt("Rename this conversation", current)?.trim()
    if (title && title !== current) void af.rename(id, title)
  }
  const remove = (id: string) => {
    if (window.confirm("Delete this conversation? This cannot be undone.")) void af.remove(id)
  }

  const list = (
    <ConversationList
      summaries={af.summaries}
      activeId={active?.evaluation_id ?? null}
      onSelect={(id) => {
        setNavOpen(false)
        void af.select(id)
      }}
      onNew={() => {
        setNavOpen(false)
        af.newConversation()
      }}
      onRename={rename}
      onDelete={remove}
    />
  )

  const results = active ? (
    <ResultsPanel
      evaluation={active}
      busy={af.sending}
      onPrefill={prefillComposer}
      onToggleKeep={(id) => void af.toggleShortlist(id)}
      onCompare={(offerings) => {
        setResultsOpen(false)
        void af.requestComparison(offerings)
      }}
      onPlan={(offering) => {
        setResultsOpen(false)
        void af.requestImplementation(offering)
      }}
      onOpenBrief={setBrief}
    />
  ) : null

  return (
    <div className="fixed inset-0 flex flex-col bg-surface">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-ui px-3 md:px-5">
        <button type="button" onClick={() => setNavOpen(true)} aria-label="Your conversations" className="rounded-badge p-2 text-body hover:text-brand lg:hidden">
          <Menu size={19} aria-hidden />
        </button>
        <Link href="/" className="flex shrink-0 items-center" aria-label="Fruition home">
          <Image src="/images/logo-fruition-black.svg" alt="Fruition Services" width={1366} height={280} className="h-6 w-auto" priority unoptimized />
        </Link>
        <span className="mx-1 hidden h-5 w-px bg-ui md:block" aria-hidden />
        <span className={`${EYEBROW} hidden text-brand md:inline`}>Ask Fruit</span>
        <span className="min-w-0 flex-1 truncate px-2 text-[13.5px] font-medium text-body">{hasConversation ? active?.title : ""}</span>
        {hasConversation ? (
          <button
            type="button"
            onClick={() => setResultsOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-ui px-3 text-[13px] font-semibold text-body hover:border-brand hover:text-brand lg:hidden"
          >
            <PanelRight size={15} aria-hidden />
            {active?.matches.length ? `Results ${active.matches.length}` : "Results"}
          </button>
        ) : null}
        <a href={BOOKING_URL} className="cta-btn cta-btn-primary hidden !px-4 !py-2 md:inline-flex">
          <span className="cta-btn-label">Book a call</span>
        </a>
      </header>

      {af.error ? (
        <div className="flex items-center justify-between gap-3 border-b border-lilac-strong bg-tint px-5 py-2 text-[13px] text-body" role="alert">
          <span>{af.error}</span>
          <button type="button" onClick={af.clearError} aria-label="Dismiss" className="text-muted hover:text-brand">
            <X size={15} aria-hidden />
          </button>
        </div>
      ) : null}

      <div className={`grid min-h-0 flex-1 grid-cols-1 ${hasConversation ? "lg:grid-cols-[240px_minmax(0,1fr)_360px]" : "lg:grid-cols-[240px_minmax(0,1fr)]"}`}>
        <aside className="hidden min-h-0 border-r border-ui bg-surface lg:block">{list}</aside>

        <main className="flex min-h-0 flex-col">
          {af.loading ? (
            <div className="flex flex-1 items-center justify-center font-mono text-[12px] text-muted">Loading…</div>
          ) : hasConversation && active ? (
            <Conversation
              evaluation={active}
              sending={af.sending}
              status={af.status}
              prefill={prefill}
              onSend={(t) => void af.send(t)}
              onStop={af.stop}
              onOpenBrief={setBrief}
            />
          ) : (
            <div className="flex min-h-0 flex-1 overflow-y-auto">
              <Welcome onSend={(t) => void af.send(t)} sending={af.sending} />
            </div>
          )}
        </main>

        {hasConversation ? (
          <aside className="hidden min-h-0 overflow-y-auto border-l border-ui bg-surface-subtle p-4 lg:block" aria-label="Recommendations">
            {results}
          </aside>
        ) : null}
      </div>

      <Drawer side="left" open={navOpen} onClose={() => setNavOpen(false)} label="Your conversations">
        {list}
      </Drawer>
      <Drawer side="right" open={resultsOpen} onClose={() => setResultsOpen(false)} label="Recommendations">
        <div className="bg-surface-subtle p-4">{results}</div>
      </Drawer>
      {brief && active ? <BriefDialog doc={brief} evaluationId={active.evaluation_id} onClose={() => setBrief(null)} /> : null}
    </div>
  )
}
