/**
 * Streaming OpenRouter chat completions with tool calls.
 *
 * The site already routes every runtime LLM call through OpenRouter (see
 * api/internal/design/generate), so Ask Fruit uses the same key and billing
 * rather than adding an Anthropic SDK to a Worker bundle with ~1.8 MiB of
 * headroom. Tool calls arrive in OpenAI's delta format: fragments keyed by
 * `index`, with the id and name on the first fragment and the JSON arguments
 * spread across the rest.
 */

export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

export type ChatMessage =
  | { role: "system"; content: string | Array<{ type: "text"; text: string; cache_control?: { type: "ephemeral" } }> }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string }

export interface ToolCall {
  id: string
  type: "function"
  function: { name: string; arguments: string }
}

export type StreamPart =
  | { type: "text"; delta: string }
  | { type: "tool_start"; index: number; id: string; name: string }
  | { type: "finish"; reason: string; toolCalls: ToolCall[]; usage?: Usage }

export interface Usage {
  prompt_tokens?: number
  completion_tokens?: number
  cost?: number
}

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryable: boolean,
  ) {
    super(message)
  }
}

interface CompletionRequest {
  apiKey: string
  model: string
  messages: ChatMessage[]
  tools: ReadonlyArray<{ name: string; description: string; parameters: unknown }>
  maxTokens: number
  signal?: AbortSignal
  fetchImpl?: typeof fetch
}

/** POST with up to two retries on 429/5xx. Safe: nothing has been read yet. */
async function open(req: CompletionRequest): Promise<Response> {
  const body = JSON.stringify({
    model: req.model,
    stream: true,
    max_tokens: req.maxTokens,
    // Same routing as the design generator: Bedrock and other clouds are
    // region-gated from the Worker's edge, Anthropic first-party is not.
    provider: { order: ["anthropic"], allow_fallbacks: true },
    usage: { include: true },
    messages: req.messages,
    tools: req.tools.map((t) => ({ type: "function", function: t })),
  })
  const doFetch = req.fetchImpl ?? fetch
  const call = () =>
    doFetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${req.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.fruitionservices.io",
        "X-Title": "Fruition Ask Fruit",
      },
      body,
      signal: req.signal,
    })

  let res = await call()
  for (let attempt = 1; attempt <= 2 && (res.status === 429 || res.status >= 500); attempt++) {
    await res.body?.cancel().catch(() => {})
    await new Promise((r) => setTimeout(r, 600 * attempt))
    res = await call()
  }
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "")
    let message = detail.slice(0, 300)
    try {
      message = (JSON.parse(detail) as { error?: { message?: string } }).error?.message || message
    } catch {
      /* non-JSON gateway page */
    }
    throw new UpstreamError(message || `Upstream status ${res.status}`, res.status, res.status === 429 || res.status >= 500)
  }
  return res
}

interface ChunkChoice {
  delta?: {
    content?: string | null
    tool_calls?: Array<{ index?: number; id?: string; function?: { name?: string; arguments?: string } }>
  }
  finish_reason?: string | null
}

export async function* streamCompletion(req: CompletionRequest): AsyncGenerator<StreamPart> {
  const res = await open(req)
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  const calls = new Map<number, ToolCall>()
  let buffer = ""
  let finish: string | null = null
  let usage: Usage | undefined

  const handle = function* (line: string): Generator<StreamPart> {
    if (!line.startsWith("data:")) return // ": OPENROUTER PROCESSING" keep-alives and blank lines
    const data = line.slice(5).trim()
    if (!data || data === "[DONE]") return
    let parsed: { choices?: ChunkChoice[]; usage?: Usage; error?: { message?: string; code?: number } }
    try {
      parsed = JSON.parse(data)
    } catch {
      return
    }
    if (parsed.error) {
      const code = Number(parsed.error.code) || 502
      throw new UpstreamError(parsed.error.message || "Upstream stream error", code, code === 429 || code >= 500)
    }
    if (parsed.usage) usage = parsed.usage
    const choice = parsed.choices?.[0]
    if (!choice) return
    if (choice.delta?.content) yield { type: "text", delta: choice.delta.content }
    for (const frag of choice.delta?.tool_calls ?? []) {
      const index = frag.index ?? 0
      let call = calls.get(index)
      if (!call) {
        call = { id: frag.id ?? `call_${index}`, type: "function", function: { name: "", arguments: "" } }
        calls.set(index, call)
      }
      if (frag.id) call.id = frag.id
      if (frag.function?.name) {
        const first = !call.function.name
        call.function.name += frag.function.name
        if (first) yield { type: "tool_start", index, id: call.id, name: call.function.name }
      }
      if (frag.function?.arguments) call.function.arguments += frag.function.arguments
    }
    if (choice.finish_reason) finish = choice.finish_reason
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let nl: number
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trimEnd()
        buffer = buffer.slice(nl + 1)
        yield* handle(line)
      }
    }
    if (buffer.trim()) yield* handle(buffer.trim())
  } finally {
    reader.releaseLock()
  }

  const toolCalls = [...calls.entries()].sort((a, b) => a[0] - b[0]).map(([, c]) => c)
  yield { type: "finish", reason: finish ?? (toolCalls.length ? "tool_calls" : "stop"), toolCalls, usage }
}
