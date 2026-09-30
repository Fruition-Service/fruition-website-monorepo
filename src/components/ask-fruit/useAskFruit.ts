"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  applyEvent,
  emptyEvaluation,
  getEvaluation,
  listEvaluations,
  patchEvaluation,
  placeSummary,
  streamChat,
  toSummary,
  type ApiError,
} from "@/lib/askFruit/client"
import type { EvaluationDetail, EvaluationSummary, Offering } from "@/lib/askFruit/types"

const ACTIVE_KEY = "ask-fruit-active-evaluation"
/** Local key for a conversation whose first turn hasn't been assigned an id yet. */
const DRAFT = "draft"

export interface WorkingStatus {
  label: string
  kind: "thinking" | "tool"
}

function readActive(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

function writeActive(id: string | null) {
  try {
    if (id) window.localStorage.setItem(ACTIVE_KEY, id)
    else window.localStorage.removeItem(ACTIVE_KEY)
  } catch {
    /* private mode */
  }
}

function nameList(names: string[]): string {
  if (names.length <= 1) return names.join("")
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
}

export function useAskFruit() {
  const [summaries, setSummaries] = useState<EvaluationSummary[]>([])
  const [details, setDetails] = useState<Record<string, EvaluationDetail>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<WorkingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const sendingRef = useRef(false)
  // The active id and details as of right now, not as of the last render: a
  // caller can switch conversations and send in the same tick (the ?q= hand-off
  // does), and a closure-captured activeId would send into the old one.
  const activeRef = useRef<string | null>(null)
  const detailsRef = useRef<Record<string, EvaluationDetail>>({})
  useEffect(() => {
    detailsRef.current = details
  }, [details])

  const activate = useCallback((id: string | null) => {
    activeRef.current = id
    setActiveId(id)
    writeActive(id === DRAFT ? null : id)
  }, [])

  const active = activeId ? (details[activeId] ?? null) : null

  const select = useCallback(
    async (id: string) => {
      activate(id)
      setError(null)
      try {
        const detail = await getEvaluation(id)
        setDetails((d) => ({ ...d, [id]: detail }))
      } catch (err) {
        setError((err as ApiError).message ?? "Could not open that conversation.")
        activate(null)
      }
    },
    [activate],
  )

  // Boot: load the list, reopen the last conversation.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await listEvaluations()
        if (cancelled) return
        setSummaries(list)
        const remembered = readActive()
        if (remembered && list.some((s) => s.evaluation_id === remembered)) await select(remembered)
      } catch {
        // First visit or storage down: start with an empty workspace.
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [select])

  const newConversation = useCallback(() => {
    abortRef.current?.abort()
    activate(null)
    setError(null)
  }, [activate])

  const send = useCallback(
    async (message: string) => {
      const text = message.trim()
      if (!text || sendingRef.current) return
      sendingRef.current = true
      setSending(true)
      setError(null)
      setStatus({ label: "Thinking it through", kind: "thinking" })

      const current0 = activeRef.current
      const startId = current0 && current0 !== DRAFT && detailsRef.current[current0] ? current0 : DRAFT
      let key = startId
      const now = new Date().toISOString()
      const base = startId === DRAFT ? emptyEvaluation(DRAFT, text.slice(0, 60)) : detailsRef.current[startId]
      let current: EvaluationDetail = {
        ...base,
        messages: [
          ...base.messages,
          { id: `local-u-${Date.now()}`, role: "user", markdown: text, status: "complete", created_at: now },
          { id: `local-a-${Date.now()}`, role: "assistant", markdown: "", status: "streaming", created_at: now },
        ],
      }
      setDetails((d) => ({ ...d, [key]: current }))
      if (startId === DRAFT) activate(DRAFT)

      const controller = new AbortController()
      abortRef.current = controller
      try {
        for await (const event of streamChat(
          { message: text, evaluation_id: startId === DRAFT ? null : startId },
          controller.signal,
        )) {
          current = applyEvent(current, event)
          if (event.type === "session" && key === DRAFT) {
            key = event.data.evaluation_id
            // Only follow the new conversation if the visitor is still on it.
            if (activeRef.current === DRAFT) activate(key)
          }
          if (event.type === "tool_call") setStatus(event.data.status === "started" ? { label: event.data.label, kind: "tool" } : null)
          if (event.type === "status") setStatus({ label: event.data.label, kind: "thinking" })
          if (event.type === "message_delta") setStatus(null)
          if (event.type === "error") setError(event.data.message)
          const snapshot = current
          setDetails((d) => {
            const next = { ...d, [key]: snapshot }
            if (key !== DRAFT) delete next[DRAFT]
            return next
          })
          if (event.type === "session" || event.type === "done" || event.type === "requirements") {
            setSummaries((list) => placeSummary(list, toSummary(snapshot)))
          }
        }
      } finally {
        if (current.messages[current.messages.length - 1]?.status === "streaming") {
          current = applyEvent(current, { type: "error", data: { code: "ABORTED", message: "", retryable: true } })
          const snapshot = current
          setDetails((d) => ({ ...d, [key]: snapshot }))
        }
        sendingRef.current = false
        abortRef.current = null
        setSending(false)
        setStatus(null)
      }
    },
    [activate],
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])

  const toggleShortlist = useCallback(
    async (offeringId: string) => {
      if (!active || active.evaluation_id === DRAFT) return
      const id = active.evaluation_id
      const previous = active.shortlist
      const next = previous.includes(offeringId) ? previous.filter((x) => x !== offeringId) : [...previous, offeringId]
      setDetails((d) => ({ ...d, [id]: { ...d[id], shortlist: next, shortlist_count: next.length } }))
      try {
        const saved = await patchEvaluation(id, { shortlist: next })
        setDetails((d) => ({ ...d, [id]: saved }))
      } catch (err) {
        setDetails((d) => ({ ...d, [id]: { ...d[id], shortlist: previous, shortlist_count: previous.length } }))
        setError((err as ApiError).message ?? "Could not update your shortlist.")
      }
    },
    [active],
  )

  const titles = (offerings: Offering[]) => offerings.map((o) => o.title)

  /** Briefs are ordinary turns, phrased the way Proploy's journey.ts phrased them. */
  const requestComparison = useCallback(
    (offerings: Offering[]) =>
      send(
        `Create a comparison brief for ${nameList(titles(offerings))}. Show side by side how each fits my requirements, and say which you would recommend.`,
      ),
    [send],
  )

  const requestImplementation = useCallback(
    (offering: Offering) =>
      send(
        `Create an implementation brief with ${offering.title} as the recommended option. Use the other options you have suggested as the ones we considered.`,
      ),
    [send],
  )

  const rename = useCallback(async (id: string, title: string) => {
    try {
      const saved = await patchEvaluation(id, { title })
      setDetails((d) => (d[id] ? { ...d, [id]: { ...d[id], title: saved.title } } : d))
      setSummaries((list) => list.map((s) => (s.evaluation_id === id ? { ...s, title: saved.title } : s)))
    } catch (err) {
      setError((err as ApiError).message ?? "Could not rename that conversation.")
    }
  }, [])

  const remove = useCallback(
    async (id: string) => {
      try {
        await patchEvaluation(id, { status: "deleted" })
        setSummaries((list) => list.filter((s) => s.evaluation_id !== id))
        setDetails((d) => {
          const next = { ...d }
          delete next[id]
          return next
        })
        if (activeRef.current === id) newConversation()
      } catch (err) {
        setError((err as ApiError).message ?? "Could not delete that conversation.")
      }
    },
    [newConversation],
  )

  return {
    summaries,
    active,
    loading,
    sending,
    status,
    error,
    clearError: () => setError(null),
    select,
    newConversation,
    send,
    stop,
    toggleShortlist,
    requestComparison,
    requestImplementation,
    rename,
    remove,
  }
}
