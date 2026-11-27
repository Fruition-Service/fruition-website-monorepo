import { NextResponse } from "next/server"
import { getPortalApiUser, getPortalAdmin } from "@/lib/portalAuth"
import { DESIGN_DOC_MODEL } from "@/lib/design/buildDocPrompt"
import { buildEditPrompt } from "@/lib/design/docEdit"

export const runtime = "nodejs"
// Edits are much faster than full generation (no PDF parse), but a large
// document plus a big requested change can still stream for a while.
export const maxDuration = 300

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MAX_OUTPUT_TOKENS = 64000
const MAX_HISTORY_MESSAGES = 24
const MAX_MESSAGE_CHARS = 8000
// Keep-alive comment streamed until the model's first token (same trick as the
// generate route); the chat client strips it from the displayed reply.
const HEARTBEAT = "<!-- fruition:working -->\n"
const HEARTBEAT_MS = 10_000

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

/** Surface OpenRouter's real error message (not a generic one) so failures are diagnosable. */
function describeEditError(body: string, status: number): string {
  let message = ""
  try {
    message = (JSON.parse(body) as { error?: { message?: string } }).error?.message || ""
  } catch {
    /* non-JSON error body (e.g. an HTML gateway page) */
  }
  if (!message) message = body.trim().slice(0, 200)

  const base = message ? `Edit failed: ${message}` : `Edit failed (upstream status ${status}).`
  if (status === 429) return `${base} The model is busy right now — wait a moment and try again.`
  if (status === 402) return `${base} The AI account is out of credit.`
  if (status >= 500) return `${base} This is usually a temporary upstream issue; please try again.`
  return base
}

type Ctx = { params: Promise<{ id: string }> }

/**
 * Chat turn against one of your design documents. The current HTML is loaded
 * fresh from the database each turn (it changes as edits are applied), so the
 * client only sends the conversation text. Streams the assistant reply —
 * prose + SEARCH/REPLACE edit blocks — as plain text; the client parses and
 * applies the blocks, then saves via PATCH ../docs/[id].
 */
export async function POST(req: Request, ctx: Ctx) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { id } = await ctx.params

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 })
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const history = (body.messages ?? [])
    .filter(
      (m): m is ChatMessage =>
        (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string",
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "The last message must be from the user." }, { status: 400 })
  }

  const admin = getPortalAdmin()
  const { data: doc, error: dbError } = await admin
    .from("design_docs")
    .select("id, title, html, template")
    .eq("id", id)
    .eq("author_id", user.id) // docs are private to their author
    .maybeSingle()
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 502 })
  if (!doc?.html) return NextResponse.json({ error: "Document not found." }, { status: 404 })

  const upstreamBody = JSON.stringify({
    model: DESIGN_DOC_MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    stream: true,
    messages: [
      { role: "system", content: buildEditPrompt(doc.template) },
      {
        role: "user",
        content: `Here is the current document, titled ${JSON.stringify(doc.title)}:\n\n${doc.html}`,
      },
      {
        role: "assistant",
        content: "I have the current document. What would you like me to change?",
      },
      ...history,
    ],
  })

  const callUpstream = () =>
    fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://fruitionservices.io",
        "X-Title": "Fruition Design",
      },
      body: upstreamBody,
    })

  // Retry transient upstream failures — nothing has been streamed yet.
  let upstream: Response
  try {
    upstream = await callUpstream()
    for (let attempt = 1; attempt <= 2 && (upstream.status === 429 || upstream.status >= 500); attempt++) {
      const failedBody = await upstream.text().catch(() => "")
      console.error(
        `[design/edit] upstream ${upstream.status} (attempt ${attempt}), retrying: ${failedBody.slice(0, 300)}`,
      )
      await new Promise((r) => setTimeout(r, 500 * attempt))
      upstream = await callUpstream()
    }
  } catch (err) {
    console.error("[design/edit] upstream request threw:", err)
    return NextResponse.json(
      { error: "Could not reach the design service. Please try again." },
      { status: 502 },
    )
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    console.error(`[design/edit] upstream failed ${upstream.status}: ${detail.slice(0, 500)}`)
    return NextResponse.json(
      { error: describeEditError(detail, upstream.status) },
      { status: 502 },
    )
  }

  // Transform OpenRouter's SSE stream into a plain-text stream of reply deltas.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()
  let buffer = ""

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(HEARTBEAT))
      let seenContent = false
      let pendingRead = reader.read()

      ;(async () => {
        try {
          for (;;) {
            let timer: ReturnType<typeof setTimeout> | undefined
            const heartbeat = new Promise<"heartbeat">((resolve) => {
              timer = setTimeout(() => resolve("heartbeat"), HEARTBEAT_MS)
            })
            const next = await Promise.race([
              pendingRead.then((r) => ({ kind: "read" as const, r })),
              heartbeat.then(() => ({ kind: "heartbeat" as const })),
            ])
            if (timer) clearTimeout(timer)

            if (next.kind === "heartbeat") {
              // Only safe before the reply starts — the client strips whole
              // heartbeat lines, so one mid-reply could split a real line.
              if (!seenContent) controller.enqueue(encoder.encode(HEARTBEAT))
              continue // the same read is still in flight
            }

            const { done, value } = next.r
            if (done) {
              controller.close()
              return
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() ?? ""
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith("data:")) continue
              const data = trimmed.slice(5).trim()
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data) as {
                  choices?: { delta?: { content?: string } }[]
                  error?: { message?: string }
                }
                if (parsed.error) {
                  console.error(`[design/edit] mid-stream error: ${JSON.stringify(parsed.error)}`)
                  continue
                }
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  seenContent = true
                  controller.enqueue(encoder.encode(delta))
                }
              } catch {
                /* partial/non-JSON SSE frame — ignore */
              }
            }
            pendingRead = reader.read()
          }
        } catch (err) {
          console.error("[design/edit] stream pump failed:", err)
          controller.error(err)
        }
      })()
    },
    cancel() {
      reader.cancel()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
