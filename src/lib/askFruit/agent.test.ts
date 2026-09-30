import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// The knowledge loader imports the Sanity client; tests use a fixed corpus instead.
vi.mock("@/sanity/client", () => ({ client: { fetch: vi.fn(async () => []) } }))

import { historyMessages, runTurn } from "./agent"
import { __setKnowledgeForTests } from "./knowledge"
import { streamCompletion } from "./openrouter"
import { newEvaluation } from "./store"
import { executeTool } from "./tools"
import type { AskFruitEvent, EvaluationDetail } from "./types"
import type { KnowledgeRecord } from "./knowledge/types"

const CORPUS: KnowledgeRecord[] = [
  {
    id: "solution:solar-crm",
    kind: "solution",
    title: "Solar CRM",
    url: "/monday-consulting-solutions/catalog",
    summary: "Lead to grid connection on monday CRM.",
    text: "solar installers crm pipeline",
    tags: ["solar"],
    facts: { product: "monday CRM" },
  },
  {
    id: "package:lock-step",
    kind: "package",
    title: "Lock-Step implementation package",
    url: "/implementation-packages",
    summary: "40 hrs",
    text: "process mapping build support",
    tags: [],
    facts: { price: "Scoped and quoted by the Fruition team", hours: "40 hrs" },
  },
  {
    id: "faq:hipaa",
    kind: "faq",
    title: "Is monday.com HIPAA compliant?",
    url: "/faqs",
    summary: "On Enterprise.",
    text: "hipaa",
    tags: [],
    facts: {},
  },
]

/** An SSE body in OpenRouter's chunk format. */
function sse(chunks: unknown[]): Response {
  const body = chunks.map((c) => `data: ${JSON.stringify(c)}\n\n`).join("") + "data: [DONE]\n\n"
  return new Response(new TextEncoder().encode(": OPENROUTER PROCESSING\n\n" + body), {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  })
}

const text = (t: string) => ({ choices: [{ delta: { content: t } }] })
const finish = (reason: string, usage?: object) => ({ choices: [{ delta: {}, finish_reason: reason }], ...(usage ? { usage } : {}) })
/** A tool call split across three fragments, as the API streams it. */
const toolCall = (index: number, id: string, name: string, args: object) => {
  const json = JSON.stringify(args)
  const mid = Math.floor(json.length / 2)
  return [
    { choices: [{ delta: { tool_calls: [{ index, id, function: { name, arguments: "" } }] } }] },
    { choices: [{ delta: { tool_calls: [{ index, function: { arguments: json.slice(0, mid) } }] } }] },
    { choices: [{ delta: { tool_calls: [{ index, function: { arguments: json.slice(mid) } }] } }] },
  ]
}

function scriptedFetch(responses: Response[]) {
  const calls: Array<{ messages: Array<{ role: string; content: unknown }> }> = []
  const impl = vi.fn(async (_url: unknown, init?: RequestInit) => {
    calls.push(JSON.parse(String(init?.body)))
    const next = responses.shift()
    if (!next) throw new Error("no scripted response left")
    return next
  })
  return { impl: impl as unknown as typeof fetch, calls }
}

async function drain(evaluation: EvaluationDetail, fetchImpl: typeof fetch, message = "We install solar panels") {
  const events: AskFruitEvent[] = []
  const gen = runTurn({ evaluation, message, apiKey: "test", fetchImpl })
  while (true) {
    const next = await gen.next()
    if (next.done) return { events, outcome: next.value }
    events.push(next.value)
  }
}

beforeEach(() => __setKnowledgeForTests(CORPUS))
afterEach(() => __setKnowledgeForTests(null))

describe("streamCompletion", () => {
  it("reassembles fragmented tool calls and reports usage", async () => {
    const { impl } = scriptedFetch([
      sse([text("Looking. "), ...toolCall(0, "call_1", "search_knowledge", { query: "solar crm" }), finish("tool_calls", { prompt_tokens: 10, completion_tokens: 5, cost: 0.001 })]),
    ])
    const parts = []
    for await (const p of streamCompletion({ apiKey: "k", model: "m", messages: [], tools: [], maxTokens: 10, fetchImpl: impl })) parts.push(p)
    expect(parts[0]).toEqual({ type: "text", delta: "Looking. " })
    expect(parts[1]).toMatchObject({ type: "tool_start", name: "search_knowledge", id: "call_1" })
    const end = parts[parts.length - 1]
    expect(end).toMatchObject({ type: "finish", reason: "tool_calls", usage: { cost: 0.001 } })
    expect(end.type === "finish" && JSON.parse(end.toolCalls[0].function.arguments)).toEqual({ query: "solar crm" })
  })

  it("retries a 429 before any bytes are read", async () => {
    const { impl } = scriptedFetch([new Response("busy", { status: 429 }), sse([text("ok"), finish("stop")])])
    const parts = []
    for await (const p of streamCompletion({ apiKey: "k", model: "m", messages: [], tools: [], maxTokens: 10, fetchImpl: impl })) parts.push(p)
    expect(parts[0]).toEqual({ type: "text", delta: "ok" })
  })
})

describe("runTurn", () => {
  it("runs tools, publishes the board and finishes with the reply", async () => {
    const evaluation = newEvaluation()
    const { impl, calls } = scriptedFetch([
      sse([
        ...toolCall(0, "c1", "update_requirements", { industry: ["Solar"], goals: ["Track installs"], open_questions: ["team_size"], title: "Solar CRM rollout" }),
        ...toolCall(1, "c2", "search_knowledge", { query: "solar crm" }),
        finish("tool_calls", { prompt_tokens: 100, completion_tokens: 20, cost: 0.01 }),
      ]),
      sse([
        text("Let me put that on your board."),
        ...toolCall(0, "c3", "recommend_offerings", {
          items: [
            { offering_id: "solution:solar-crm", score: 140, reasons: ["Built for installers"], fit: { industry: { status: "yes", source: "documented" }, nonsense: { status: "yes" } } },
            { offering_id: "faq:hipaa", score: 50, reasons: ["not an offering"] },
          ],
        }),
        finish("tool_calls", { prompt_tokens: 200, completion_tokens: 30, cost: 0.02 }),
      ]),
      sse([text("**Solar CRM** is the fit."), finish("stop", { prompt_tokens: 300, completion_tokens: 10, cost: 0.03 })]),
    ])

    const { events, outcome } = await drain(evaluation, impl)
    const types = events.map((e) => e.type)
    expect(types).toContain("requirements")
    expect(types).toContain("recommendations")
    expect(types[types.length - 1]).toBe("message_final")

    // Pre-tool prose is kept, separated from the answer.
    expect(outcome.reply).toBe("Let me put that on your board.\n\n**Solar CRM** is the fit.")
    expect(outcome.failed).toBe(false)
    expect(outcome.steps).toBe(3)
    expect(outcome.usage).toEqual({ prompt_tokens: 600, completion_tokens: 60, cost: 0.06 })

    // Tool side effects landed on the evaluation.
    expect(evaluation.title).toBe("Solar CRM rollout")
    expect(evaluation.requirements).toEqual({ industry: ["Solar"], goals: ["Track installs"] })
    expect(evaluation.open_questions).toEqual(["team_size"])
    expect(evaluation.stage).toBe("recommending")
    expect(evaluation.matches).toHaveLength(1)
    expect(evaluation.matches[0]).toMatchObject({
      offering_id: "solution:solar-crm",
      match_score: 100, // clamped
      match_strength: "Strong match",
      requirement_fit: { industry: { status: "yes", source: "documented" } },
    })

    // Tool results go back as JSON, and the next call sees the updated state.
    const toolMsg = calls[1].messages.find((m) => m.role === "tool")
    expect(() => JSON.parse(String(toolMsg?.content))).not.toThrow()
    const system = calls[2].messages[0].content as Array<{ text: string }>
    expect(system[0]).toMatchObject({ cache_control: { type: "ephemeral" } })
    expect(system[1].text).toContain("solution:solar-crm")
  })

  it("stops with an error when the answer is truncated mid tool call", async () => {
    const { impl } = scriptedFetch([sse([...toolCall(0, "c1", "search_knowledge", { query: "x" }), finish("length")])])
    const { events, outcome } = await drain(newEvaluation(), impl)
    expect(outcome.failed).toBe(true)
    expect(events[events.length - 1]).toMatchObject({ type: "error", data: { code: "RESPONSE_TRUNCATED" } })
  })

  it("gives up after the step cap instead of looping forever", async () => {
    const loop = () => sse([...toolCall(0, "c", "search_knowledge", { query: "solar" }), finish("tool_calls")])
    const { impl } = scriptedFetch(Array.from({ length: 8 }, loop))
    const { events, outcome } = await drain(newEvaluation(), impl)
    expect(outcome.steps).toBe(8)
    expect(events[events.length - 1]).toMatchObject({ type: "error", data: { code: "MAX_STEPS" } })
  })

  it("reports an upstream failure as a retryable busy error", async () => {
    const { impl } = scriptedFetch([500, 500, 500].map(() => new Response("down", { status: 503 })))
    const { events } = await drain(newEvaluation(), impl)
    expect(events[events.length - 1]).toMatchObject({ type: "error", data: { code: "MODEL_BUSY", retryable: true } })
  })
})

describe("historyMessages", () => {
  it("keeps completed turns, merges same-role runs and starts with the user", () => {
    const ev = newEvaluation()
    ev.messages = [
      { id: "0", role: "assistant", markdown: "orphan", status: "complete" },
      { id: "1", role: "user", markdown: "a", status: "complete" },
      { id: "2", role: "assistant", markdown: "", status: "failed" },
      { id: "3", role: "user", markdown: "b", status: "complete" },
      { id: "4", role: "assistant", markdown: "c", status: "complete" },
      { id: "5", role: "user", markdown: "unanswered", status: "complete" },
    ]
    expect(historyMessages(ev)).toEqual([
      { role: "user", content: "a\n\nb" },
      { role: "assistant", content: "c" },
    ])
  })
})

describe("tools", () => {
  it("rejects malformed arguments without throwing", async () => {
    const ctx = { evaluation: newEvaluation(), emit: () => {} }
    expect(await executeTool("search_knowledge", "{not json", ctx)).toMatchObject({ ok: false })
    expect(await executeTool("nope", "{}", ctx)).toMatchObject({ ok: false })
    expect(await executeTool("recommend_offerings", JSON.stringify({ items: [{ offering_id: "faq:hipaa", score: 1, reasons: [] }] }), ctx)).toMatchObject({ ok: false })
  })

  it("separates offerings from evidence in unfiltered searches", async () => {
    const ctx = { evaluation: newEvaluation(), emit: () => {} }
    const res = await executeTool("search_knowledge", JSON.stringify({ query: "solar hipaa" }), ctx)
    const content = res.content as { offerings: Array<{ id: string }>; evidence: Array<{ id: string }> }
    expect(content.offerings.map((o) => o.id)).toEqual(["solution:solar-crm"])
    expect(content.evidence.map((o) => o.id)).toEqual(["faq:hipaa"])
  })

  it("keeps shortlisted offerings on the board through a new recommendation", async () => {
    const events: AskFruitEvent[] = []
    const ctx = { evaluation: newEvaluation(), emit: (e: AskFruitEvent) => events.push(e) }
    await executeTool("update_shortlist", JSON.stringify({ action: "add", ids: ["package:lock-step"] }), ctx)
    await executeTool("recommend_offerings", JSON.stringify({ items: [{ offering_id: "solution:solar-crm", score: 80, reasons: ["x"] }] }), ctx)
    expect(ctx.evaluation.matches.map((m) => m.offering_id)).toEqual(["solution:solar-crm", "package:lock-step"])
    expect(ctx.evaluation.shortlist).toEqual(["package:lock-step"])
  })

  it("builds a comparison brief from board data and validated verdicts", async () => {
    const events: AskFruitEvent[] = []
    const ctx = { evaluation: newEvaluation(), emit: (e: AskFruitEvent) => events.push(e) }
    const res = await executeTool(
      "create_comparison_brief",
      JSON.stringify({
        title: "Solar CRM vs Lock-Step",
        offering_ids: ["solution:solar-crm", "package:lock-step", "faq:hipaa"],
        requirements: [{ requirement: "Tracks installs", fit: { "solution:solar-crm": { status: "yes" }, "package:lock-step": { status: "maybe" } } }],
        recommendation: { offering_id: "not-real", reason: "Fits best" },
        next_steps: ["Book a call"],
      }),
      ctx,
    )
    expect(res.ok).toBe(true)
    const doc = ctx.evaluation.documents[0]
    expect(doc.doc_type).toBe("comparison_brief")
    if (doc.doc_type !== "comparison_brief") return
    expect(doc.data.offerings.map((o) => o.offering_id)).toEqual(["solution:solar-crm", "package:lock-step"])
    expect(doc.data.requirements[0].fit["package:lock-step"].status).toBe("unknown")
    expect(doc.data.recommendation.offering_id).toBe("solution:solar-crm") // falls back to a real option
    expect(ctx.evaluation.stage).toBe("comparing")
    expect(events.some((e) => e.type === "document_ready")).toBe(true)
  })
})
