import { DEFAULT_MODEL, runTurn, type TurnOutcome } from "@/lib/askFruit/agent"
import { setKnowledgeOrigin } from "@/lib/askFruit/knowledge"
import {
  askFruitEnabled,
  getVisitor,
  hashIp,
  jsonError,
  keepAlive,
  limitBreach,
  sameOrigin,
  withVisitorCookie,
} from "@/lib/askFruit/server"
import { EvaluationStore, getUsage, logTurn, newEvaluation } from "@/lib/askFruit/store"
import { MAX_MESSAGE_CHARS, type AskFruitEvent, type EvaluationDetail } from "@/lib/askFruit/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Silence longer than this makes Cloudflare's edge drop the response, and the
// first model token can take a while behind a tool call. See design/generate.
const HEARTBEAT_MS = 10_000

function encode(event: AskFruitEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`
}

/** A readable title from the opening message until the agent names the evaluation. */
function titleFrom(message: string): string {
  const clean = message.replace(/\s+/g, " ").trim()
  if (clean.length <= 60) return clean
  return `${clean.slice(0, 60).replace(/\s+\S*$/, "")}…`
}

/**
 * One Ask Fruit turn, streamed as server-sent events.
 *
 * Body: { message, evaluation_id? }. Without an evaluation id a new evaluation
 * is created. Events: session, status, tool_call, message_delta, requirements,
 * recommendations, shortlist, document_ready, message_final | error, done.
 */
export async function POST(req: Request) {
  if (!askFruitEnabled()) return jsonError(503, "UNAVAILABLE", "Ask Fruit is offline right now.")
  if (!sameOrigin(req)) return jsonError(403, "FORBIDDEN", "Cross-site requests are not allowed.")

  let body: { message?: unknown; evaluation_id?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError(400, "BAD_REQUEST", "Expected a JSON body.")
  }
  const message = typeof body.message === "string" ? body.message.trim() : ""
  if (!message) return jsonError(400, "BAD_REQUEST", "Type a message first.")
  if (message.length > MAX_MESSAGE_CHARS) {
    return jsonError(400, "MESSAGE_TOO_LONG", `Keep messages under ${MAX_MESSAGE_CHARS.toLocaleString()} characters.`)
  }

  setKnowledgeOrigin(req.url)
  const visitor = await getVisitor()
  const ipHash = await hashIp(req)
  const store = new EvaluationStore()

  try {
    const breach = limitBreach(await getUsage(visitor.id, ipHash))
    if (breach) return withVisitorCookie(jsonError(429, breach.code, breach.message), visitor)
  } catch (err) {
    // Fail closed: without the usage check there is no cost ceiling.
    console.error("[ask-fruit] usage check failed", err)
    return jsonError(503, "UNAVAILABLE", "Ask Fruit is offline right now. Try again shortly.", true)
  }

  let evaluation: EvaluationDetail
  if (typeof body.evaluation_id === "string" && body.evaluation_id) {
    const existing = await store.get(visitor.id, body.evaluation_id).catch(() => null)
    if (!existing) return withVisitorCookie(jsonError(404, "NOT_FOUND", "That conversation was not found."), visitor)
    evaluation = existing
  } else {
    evaluation = newEvaluation(titleFrom(message))
  }

  const model = process.env.ASK_FRUIT_MODEL || DEFAULT_MODEL
  const apiKey = process.env.OPENROUTER_API_KEY!
  const abort = new AbortController()
  const startedAt = Date.now()
  const encoder = new TextEncoder()
  let closed = false

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const write = (chunk: string) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(chunk))
        } catch {
          closed = true
        }
      }
      const send = (event: AskFruitEvent) => write(encode(event))
      const heartbeat = setInterval(() => write(": ping\n\n"), HEARTBEAT_MS)

      const turn = (async () => {
        send({ type: "session", data: { evaluation_id: evaluation.evaluation_id, title: evaluation.title } })
        const priorMessages = evaluation.messages
        let outcome: TurnOutcome = {
          reply: "",
          failed: true,
          steps: 0,
          usage: { prompt_tokens: 0, completion_tokens: 0, cost: 0 },
        }
        let errorCode: string | null = null
        try {
          const gen = runTurn({ evaluation, message, apiKey, model, signal: abort.signal })
          while (true) {
            const next = await gen.next()
            if (next.done) {
              outcome = next.value
              break
            }
            if (next.value.type === "error") errorCode = next.value.data.code
            send(next.value)
          }
        } catch (err) {
          console.error("[ask-fruit] turn crashed", err)
          errorCode = "INTERNAL_ERROR"
          send({ type: "error", data: { code: errorCode, message: "Something went wrong. Try again.", retryable: true } })
        }

        const now = new Date().toISOString()
        evaluation.messages = [
          ...priorMessages,
          { id: crypto.randomUUID(), role: "user", markdown: message, status: "complete", created_at: now },
          {
            id: crypto.randomUUID(),
            role: "assistant",
            markdown: outcome.reply,
            status: outcome.failed ? "failed" : "complete",
            created_at: now,
          },
        ]
        evaluation.match_count = evaluation.matches.length
        evaluation.shortlist_count = evaluation.shortlist.length

        try {
          const saved = await store.save(visitor.id, evaluation)
          send({ type: "done", data: { evaluation: saved } })
        } catch (err) {
          console.error("[ask-fruit] failed to save evaluation", err)
          send({ type: "error", data: { code: "SAVE_FAILED", message: "Your answer arrived but could not be saved.", retryable: false } })
          send({ type: "done", data: { evaluation } })
        } finally {
          clearInterval(heartbeat)
          if (!closed) {
            closed = true
            try {
              controller.close()
            } catch {
              /* already closed by a cancel */
            }
          }
        }

        await logTurn({
          evaluation_id: evaluation.evaluation_id,
          visitor_id: visitor.id,
          ip_hash: ipHash,
          status: abort.signal.aborted ? "aborted" : outcome.failed ? "failed" : "completed",
          error_code: errorCode,
          model,
          steps: outcome.steps,
          prompt_tokens: outcome.usage.prompt_tokens,
          completion_tokens: outcome.usage.completion_tokens,
          cost_usd: Math.round(outcome.usage.cost * 1e6) / 1e6,
          latency_ms: Date.now() - startedAt,
        })
      })()

      keepAlive(turn)
    },
    cancel() {
      // Visitor closed the tab or pressed stop: stop paying for tokens, but let
      // the turn finish saving what it has (keepAlive holds the Worker open).
      closed = true
      abort.abort()
    },
  })

  return withVisitorCookie(
    new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    }),
    visitor,
  )
}
