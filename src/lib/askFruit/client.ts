/**
 * Browser side of Ask Fruit: the SSE reader, the JSON API calls, and the pure
 * reducer that applies stream events to an evaluation. Ported from Proploy's
 * features/ai-workspace stream.ts, client.ts and evaluation-reducer.ts.
 */
import {
  EVENT_TYPES,
  type AskFruitEvent,
  type AskFruitEventType,
  type EvaluationDetail,
  type EvaluationSummary,
} from "./types"

export interface ApiError {
  code: string
  message: string
  retryable: boolean
}

async function readError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as { error?: Partial<ApiError> }
    if (body.error?.message) {
      return { code: body.error.code ?? `HTTP_${res.status}`, message: body.error.message, retryable: Boolean(body.error.retryable) }
    }
  } catch {
    /* not JSON */
  }
  return { code: `HTTP_${res.status}`, message: "Something went wrong. Try again.", retryable: res.status >= 500 }
}

/** Parse one SSE frame ("event: x\ndata: {...}"). Comments and unknown events return null. */
export function parseFrame(frame: string): AskFruitEvent | null {
  let event = "message"
  const data: string[] = []
  for (const line of frame.split("\n")) {
    if (!line || line.startsWith(":")) continue
    const colon = line.indexOf(":")
    const field = colon === -1 ? line : line.slice(0, colon)
    const value = colon === -1 ? "" : line.slice(colon + 1).replace(/^ /, "")
    if (field === "event") event = value
    else if (field === "data") data.push(value)
  }
  if (!data.length || !(EVENT_TYPES as readonly string[]).includes(event)) return null
  try {
    return { type: event as AskFruitEventType, data: JSON.parse(data.join("\n")) } as AskFruitEvent
  } catch {
    return null
  }
}

/**
 * POST a message and yield events as they arrive. Network and HTTP failures
 * surface as a synthetic `error` event so the caller has one code path.
 */
export async function* streamChat(
  body: { message: string; evaluation_id?: string | null },
  signal?: AbortSignal,
): AsyncGenerator<AskFruitEvent> {
  let res: Response
  try {
    res = await fetch("/api/ask-fruit/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(body),
      signal,
    })
  } catch {
    if (signal?.aborted) return
    yield { type: "error", data: { code: "NETWORK_ERROR", message: "Could not reach Fruit. Check your connection.", retryable: true } }
    return
  }
  if (!res.ok || !res.body) {
    yield { type: "error", data: await readError(res) }
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let sawAny = false
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n")
      let split: number
      while ((split = buffer.indexOf("\n\n")) >= 0) {
        const event = parseFrame(buffer.slice(0, split))
        buffer = buffer.slice(split + 2)
        if (event) {
          sawAny = true
          yield event
        }
      }
    }
  } catch {
    if (signal?.aborted) return
    yield { type: "error", data: { code: "STREAM_READ_FAILED", message: "The connection dropped mid-answer. Try again.", retryable: true } }
    return
  }
  if (!sawAny) yield { type: "error", data: { code: "EMPTY_STREAM", message: "Fruit did not respond. Try again.", retryable: true } }
}

export async function listEvaluations(): Promise<EvaluationSummary[]> {
  const res = await fetch("/api/ask-fruit/evaluations", { cache: "no-store" })
  if (!res.ok) throw await readError(res)
  return ((await res.json()) as { evaluations: EvaluationSummary[] }).evaluations
}

export async function getEvaluation(id: string): Promise<EvaluationDetail> {
  const res = await fetch(`/api/ask-fruit/evaluations?id=${encodeURIComponent(id)}`, { cache: "no-store" })
  if (!res.ok) throw await readError(res)
  return ((await res.json()) as { evaluation: EvaluationDetail }).evaluation
}

export async function patchEvaluation(
  id: string,
  patch: { title?: string; status?: "archived" | "deleted"; shortlist?: string[] },
): Promise<EvaluationDetail> {
  const res = await fetch(`/api/ask-fruit/evaluations?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw await readError(res)
  return ((await res.json()) as { evaluation: EvaluationDetail }).evaluation
}

// ---------------------------------------------------------------------------
// Reducer

export function emptyEvaluation(id: string, title: string): EvaluationDetail {
  return {
    evaluation_id: id,
    title,
    stage: "discovery",
    match_count: 0,
    shortlist_count: 0,
    updated_at: new Date().toISOString(),
    requirements: {},
    open_questions: [],
    matches: [],
    shortlist: [],
    documents: [],
    messages: [],
  }
}

/** The streaming assistant message is always the last one while a turn runs. */
function patchLastAssistant(ev: EvaluationDetail, fn: (markdown: string) => { markdown: string; status: "streaming" | "complete" | "failed" }) {
  const messages = [...ev.messages]
  const last = messages[messages.length - 1]
  if (!last || last.role !== "assistant") return ev
  messages[messages.length - 1] = { ...last, ...fn(last.markdown) }
  return { ...ev, messages }
}

/** Apply one stream event. Pure; `done` replaces local state with the saved copy. */
export function applyEvent(ev: EvaluationDetail, event: AskFruitEvent): EvaluationDetail {
  switch (event.type) {
    case "session":
      return { ...ev, evaluation_id: event.data.evaluation_id, title: ev.title || event.data.title }
    case "message_delta":
      return patchLastAssistant(ev, (md) => ({ markdown: md + event.data.delta, status: "streaming" }))
    case "message_final":
      return patchLastAssistant(ev, () => ({ markdown: event.data.content, status: "complete" }))
    case "requirements":
      return {
        ...ev,
        requirements: event.data.requirements,
        open_questions: event.data.open_questions,
        ...(event.data.title ? { title: event.data.title } : {}),
      }
    case "recommendations":
      return { ...ev, matches: event.data.items, match_count: event.data.items.length }
    case "shortlist":
      return { ...ev, shortlist: event.data.items, shortlist_count: event.data.items.length }
    case "document_ready":
      if (ev.documents.some((d) => d.doc_id === event.data.document.doc_id)) return ev
      return { ...ev, documents: [...ev.documents, event.data.document] }
    case "error":
      return patchLastAssistant(ev, (md) => ({ markdown: md, status: "failed" }))
    case "done": {
      // A local failure (the stream dropped) must not be overwritten by a
      // server copy that never saw the reply.
      const saved = event.data.evaluation
      return saved.messages.length ? saved : ev
    }
    default:
      return ev
  }
}

export function toSummary(ev: EvaluationDetail): EvaluationSummary {
  return {
    evaluation_id: ev.evaluation_id,
    title: ev.title,
    stage: ev.stage,
    match_count: ev.matches.length,
    shortlist_count: ev.shortlist.length,
    updated_at: ev.updated_at,
  }
}

/** Update a summary row in place, or put a new one at the top. */
export function placeSummary(list: EvaluationSummary[], summary: EvaluationSummary): EvaluationSummary[] {
  const without = list.filter((s) => s.evaluation_id !== summary.evaluation_id)
  return [summary, ...without]
}
