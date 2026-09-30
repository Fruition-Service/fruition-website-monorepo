/**
 * One Ask Fruit turn: model call, tool calls, repeat, until the model answers.
 *
 * Ported from Proploy's agent-harness run_turn_stream with its known defects
 * fixed:
 * - Every finish reason is handled. Sam re-called the model with identical
 *   input on anything but end_turn/tool_use/max_tokens.
 * - Text written before a tool call is kept. Sam streamed it, then dropped it
 *   from the saved reply.
 * - Tool results go back as JSON, not a Python repr.
 * - History is rebuilt from the evaluation's stored messages, and state the
 *   tools produced (requirements, board, briefs) rides in the system prompt, so
 *   tool blocks never have to be replayed across turns.
 */
import { streamCompletion, UpstreamError, type ChatMessage, type Usage } from "./openrouter"
import { buildStatePrompt, STATIC_PROMPT } from "./prompt"
import { executeTool, isToolName, TOOL_DEFINITIONS, TOOL_LABELS, type ToolContext } from "./tools"
import type { AskFruitEvent, EvaluationDetail } from "./types"

export const DEFAULT_MODEL = "anthropic/claude-sonnet-5"
const MAX_STEPS = 8
const MAX_OUTPUT_TOKENS = 6000
const HISTORY_MESSAGES = 16
const HISTORY_CHARS = 4000

export interface TurnInput {
  evaluation: EvaluationDetail
  message: string
  apiKey: string
  model?: string
  signal?: AbortSignal
  fetchImpl?: typeof fetch
}

export interface TurnOutcome {
  reply: string
  failed: boolean
  steps: number
  usage: { prompt_tokens: number; completion_tokens: number; cost: number }
}

/** Prior turns as plain user/assistant text, oldest first, roles strictly alternating. */
export function historyMessages(evaluation: EvaluationDetail): ChatMessage[] {
  const prior = evaluation.messages
    .filter((m) => m.status !== "failed" && m.status !== "streaming" && m.markdown.trim())
    .slice(-HISTORY_MESSAGES)
  const out: Array<{ role: "user" | "assistant"; content: string }> = []
  for (const m of prior) {
    const content = m.markdown.slice(0, HISTORY_CHARS)
    const last = out[out.length - 1]
    if (last && last.role === m.role) last.content += `\n\n${content}`
    else out.push({ role: m.role, content })
  }
  // The model must see a user message first.
  while (out.length && out[0].role !== "user") out.shift()
  // The new message is appended after this; drop a trailing user turn that never got an answer.
  if (out.length && out[out.length - 1].role === "user") out.pop()
  return out
}

function systemMessage(evaluation: EvaluationDetail): ChatMessage {
  return {
    role: "system",
    content: [
      { type: "text", text: STATIC_PROMPT, cache_control: { type: "ephemeral" } },
      { type: "text", text: buildStatePrompt(evaluation) },
    ],
  }
}

function addUsage(total: TurnOutcome["usage"], usage?: Usage) {
  if (!usage) return
  total.prompt_tokens += usage.prompt_tokens ?? 0
  total.completion_tokens += usage.completion_tokens ?? 0
  total.cost += usage.cost ?? 0
}

/**
 * Runs the turn, yielding wire events. The evaluation passed in is mutated in
 * place by the tools; the caller persists it. The generator's return value is
 * the outcome (reply text, usage) for logging.
 */
export async function* runTurn(input: TurnInput): AsyncGenerator<AskFruitEvent, TurnOutcome> {
  const { evaluation } = input
  const queue: AskFruitEvent[] = []
  const ctx: ToolContext = { evaluation, emit: (event) => queue.push(event) }
  const messages: ChatMessage[] = [...historyMessages(evaluation), { role: "user", content: input.message }]
  const usage = { prompt_tokens: 0, completion_tokens: 0, cost: 0 }
  let reply = ""

  const fail = (code: string, message: string, retryable: boolean): AskFruitEvent => ({
    type: "error",
    data: { code, message, retryable },
  })

  for (let step = 1; step <= MAX_STEPS; step++) {
    yield { type: "status", data: { label: step === 1 ? "Thinking it through" : "Putting it together" } }
    let stepText = ""
    let finish: { reason: string; toolCalls: import("./openrouter").ToolCall[] } | null = null

    try {
      for await (const part of streamCompletion({
        apiKey: input.apiKey,
        model: input.model || DEFAULT_MODEL,
        // Rebuilt every step so tool side effects (requirements, board) are visible to the next call.
        messages: [systemMessage(evaluation), ...messages],
        tools: TOOL_DEFINITIONS,
        maxTokens: MAX_OUTPUT_TOKENS,
        signal: input.signal,
        fetchImpl: input.fetchImpl,
      })) {
        if (part.type === "text") {
          // Separate this step's prose from the previous step's.
          const delta = !stepText && reply ? `\n\n${part.delta}` : part.delta
          stepText += part.delta
          reply += delta
          yield { type: "message_delta", data: { delta } }
        } else if (part.type === "tool_start") {
          const label = isToolName(part.name) ? TOOL_LABELS[part.name] : "Working"
          yield { type: "tool_call", data: { id: part.id, name: part.name, label, status: "started" } }
        } else {
          addUsage(usage, part.usage)
          finish = part
        }
      }
    } catch (err) {
      if (input.signal?.aborted) return { reply, failed: true, steps: step, usage }
      const upstream = err instanceof UpstreamError ? err : null
      console.error("[ask-fruit] model call failed", err)
      yield upstream?.retryable
        ? fail("MODEL_BUSY", "Fruit is busy right now. Try again in a moment.", true)
        : fail("MODEL_ERROR", "Fruit could not finish that answer. Try again.", true)
      return { reply, failed: true, steps: step, usage }
    }

    if (!finish) {
      yield fail("MODEL_ERROR", "The answer stopped early. Try again.", true)
      return { reply, failed: true, steps: step, usage }
    }

    if (finish.toolCalls.length && finish.reason !== "length") {
      messages.push({ role: "assistant", content: stepText || null, tool_calls: finish.toolCalls })
      for (const call of finish.toolCalls) {
        const result = await executeTool(call.function.name, call.function.arguments, ctx)
        while (queue.length) yield queue.shift()!
        yield {
          type: "tool_call",
          data: {
            id: call.id,
            name: call.function.name,
            label: isToolName(call.function.name) ? TOOL_LABELS[call.function.name] : "Working",
            status: result.ok ? "completed" : "failed",
          },
        }
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result.content) })
      }
      continue
    }

    if (finish.reason === "length") {
      if (finish.toolCalls.length || !reply.trim()) {
        yield fail("RESPONSE_TRUNCATED", "That answer ran too long. Try asking for less at once.", true)
        return { reply, failed: true, steps: step, usage }
      }
      reply += "\n\n(Cut short. Ask Fruit to continue.)"
    }

    // stop, end_turn, content_filter or anything else: the model is done.
    if (!reply.trim()) {
      yield fail("EMPTY_RESPONSE", "Fruit did not reply. Try rephrasing.", true)
      return { reply, failed: true, steps: step, usage }
    }
    yield { type: "message_final", data: { content: reply.trim() } }
    return { reply: reply.trim(), failed: false, steps: step, usage }
  }

  yield fail("MAX_STEPS", "That took too many steps. Try a narrower question.", true)
  return { reply, failed: true, steps: MAX_STEPS, usage }
}
