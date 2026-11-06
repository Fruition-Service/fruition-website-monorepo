import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  DESIGN_DOC_MODEL,
  FRUITION_LOGO_TOKEN,
  buildDocPrompt,
  designDocUserInstruction,
} from "@/lib/design/buildDocPrompt"
import { FRUITION_LOGO_WHITE_DATA_URI } from "@/lib/design/theme/assets"
import { DEFAULT_TEMPLATE_ID, isTemplateId } from "@/lib/design/templates"

export const runtime = "nodejs"
// A full document redesign is slow: OpenRouter spends ~30-60s parsing the PDF
// before the first token and the whole generation runs 3-4 minutes. The work is
// I/O-bound (waiting on OpenRouter) so it doesn't burn Worker CPU; the heartbeat
// below keeps the streamed connection alive through the long time-to-first-token
// gap that would otherwise make Cloudflare's edge drop the response.
export const maxDuration = 300

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MAX_PDF_BYTES = 10 * 1024 * 1024
// Pasted / extracted text. Roughly 250k tokens of source, well under the model's
// context once the prompt and output budget are accounted for.
const MAX_TEXT_CHARS = 600_000
const MAX_OUTPUT_TOKENS = 64000
// Comment sent before the model's first token so bytes flow immediately and at
// least every HEARTBEAT_MS. It sits before <!doctype html>, so the client's
// cleanHtml() strips it — it never reaches the rendered/saved document.
const HEARTBEAT = "<!-- fruition:generating -->\n"
const HEARTBEAT_MS = 10_000

/** Best-effort human-readable message from an OpenRouter error response body. */
function describeUpstreamError(body: string, status: number): string {
  let message = ""
  try {
    message = (JSON.parse(body) as { error?: { message?: string } }).error?.message || ""
  } catch {
    /* non-JSON error body (e.g. an HTML gateway page) */
  }
  if (!message) message = body.trim().slice(0, 200)

  const base = message
    ? `Generation failed: ${message}`
    : `Generation failed (upstream status ${status}).`
  if (status === 429) return `${base} The model is busy right now — wait a moment and try again.`
  if (status >= 500) return `${base} This is usually a temporary upstream issue; please try again.`
  if (status === 413 || /too large|too many pages|maximum.*pages/i.test(message)) {
    return `${base} The PDF may be too large or have too many pages for the model.`
  }
  return base
}

/**
 * Restyle a source document (an uploaded PDF, or extracted/pasted text) into a
 * Fruition-branded HTML document using the selected template.
 *
 * Routes through OpenRouter (same as src/lib/claudeClient.ts) so billing rolls
 * up under one account and the model is swappable. OpenRouter parses the PDF
 * with its native (Claude) engine. Streams the raw HTML back as plain text; the
 * client accumulates it and saves via POST /api/internal/design/docs.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 })
  }

  const file = form.get("file")
  const title = (form.get("title") as string | null)?.trim() || undefined
  const rawTemplate = form.get("template") as string | null
  const template = isTemplateId(rawTemplate) ? rawTemplate : DEFAULT_TEMPLATE_ID
  const text = (form.get("text") as string | null)?.trim() || ""

  // Two input shapes: a PDF the model parses natively, or already-extracted
  // text (pasted Markdown, or DOCX/PPTX extracted in the browser — see
  // src/lib/design/extract). Exactly one is required.
  const hasFile = file instanceof File
  if (!hasFile && !text) {
    return NextResponse.json({ error: "Provide a PDF or some text to redesign." }, { status: 400 })
  }
  if (hasFile) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 })
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "PDF is too large (max 10 MB)." }, { status: 400 })
    }
  } else if (text.length > MAX_TEXT_CHARS) {
    return NextResponse.json(
      { error: `That's too long (max ${MAX_TEXT_CHARS.toLocaleString()} characters).` },
      { status: 400 },
    )
  }

  const instruction = designDocUserInstruction(template, title)
  const userContent: Record<string, unknown>[] = [{ type: "text", text: instruction }]
  if (hasFile) {
    const pdfBase64 = Buffer.from(await file.arrayBuffer()).toString("base64")
    userContent.push({
      type: "file",
      file: {
        filename: file.name || "document.pdf",
        file_data: `data:application/pdf;base64,${pdfBase64}`,
      },
    })
  } else {
    userContent.push({ type: "text", text: `Source document:\n\n${text}` })
  }

  const requestBody = JSON.stringify({
    model: DESIGN_DOC_MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    stream: true,
    // OpenRouter multiplexes this model across Anthropic, Bedrock, Azure and
    // Google. Bedrock (and other cloud) endpoints are region-gated and return
    // "This model is not available in your region" when OpenRouter routes there
    // from the Cloudflare Worker's edge region. Anthropic's first-party API has
    // no such per-region model gating, so route there first; fallbacks remain
    // enabled for resilience if Anthropic is briefly unavailable.
    provider: { order: ["anthropic"], allow_fallbacks: true },
    // Use Claude's native PDF understanding rather than an OCR pre-pass. Only
    // meaningful when a file is attached.
    ...(hasFile ? { plugins: [{ id: "file-parser", pdf: { engine: "native" } }] } : {}),
    messages: [
      { role: "system", content: buildDocPrompt(template) },
      { role: "user", content: userContent },
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
      body: requestBody,
    })

  // Retry transient upstream failures (429 / 5xx) — nothing has been streamed to
  // the client yet, so a retry is safe. 4xx (bad PDF, etc.) is not retried.
  let upstream: Response
  try {
    upstream = await callUpstream()
    for (let attempt = 1; attempt <= 2 && (upstream.status === 429 || upstream.status >= 500); attempt++) {
      const failedBody = await upstream.text().catch(() => "")
      console.error(
        `[design/generate] upstream ${upstream.status} (attempt ${attempt}), retrying: ${failedBody.slice(0, 300)}`,
      )
      await new Promise((r) => setTimeout(r, 500 * attempt))
      upstream = await callUpstream()
    }
  } catch (err) {
    console.error("[design/generate] upstream request threw:", err)
    return NextResponse.json(
      { error: "Could not reach the design service. Please try again." },
      { status: 502 },
    )
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    console.error(`[design/generate] upstream failed ${upstream.status}: ${detail.slice(0, 500)}`)
    return NextResponse.json({ error: describeUpstreamError(detail, upstream.status) }, { status: 502 })
  }

  // Transform OpenRouter's SSE stream into a plain-text stream of HTML deltas,
  // substituting the logo placeholder for the real data URI as it flows.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()
  let buffer = ""
  // Holdback for the streaming logo substitution: any suffix of what we've seen
  // that could be the start of the placeholder is kept until the next chunk.
  let carry = ""
  const KEEP = FRUITION_LOGO_TOKEN.length - 1

  /** Emit `carry + text` with complete tokens replaced, retaining a safe tail. */
  function substitute(text: string, flush: boolean): string {
    carry = (carry + text).replaceAll(FRUITION_LOGO_TOKEN, FRUITION_LOGO_WHITE_DATA_URI)
    if (flush) {
      const out = carry
      carry = ""
      return out
    }
    // Keep the longest suffix that is a prefix of the token (a token may straddle
    // the chunk boundary); emit everything before it.
    let hold = 0
    for (let k = Math.min(KEEP, carry.length); k > 0; k--) {
      if (FRUITION_LOGO_TOKEN.startsWith(carry.slice(carry.length - k))) {
        hold = k
        break
      }
    }
    const out = carry.slice(0, carry.length - hold)
    carry = carry.slice(carry.length - hold)
    return out
  }

  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      // Send a byte immediately, then keep the connection warm every
      // HEARTBEAT_MS until the model's first token. Without this, the ~30-60s
      // silent gap while OpenRouter parses the PDF makes Cloudflare's edge drop
      // the streamed response and the client sees an opaque failure.
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
              // Only safe before the document starts — a comment mid-HTML would
              // corrupt it. Once content flows it arrives frequently enough to
              // keep the connection alive on its own.
              if (!seenContent) controller.enqueue(encoder.encode(HEARTBEAT))
              continue // the same read is still in flight
            }

            const { done, value } = next.r
            if (done) {
              const tail = substitute("", true)
              if (tail) controller.enqueue(encoder.encode(tail))
              controller.close()
              return
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() ?? ""
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith("data:")) continue // skip SSE comments / keep-alives
              const data = trimmed.slice(5).trim()
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data) as {
                  choices?: { delta?: { content?: string } }[]
                  error?: { message?: string }
                }
                // OpenRouter can report a failure mid-stream (after the 200
                // headers) as an error frame — log it so it isn't silently lost.
                if (parsed.error) {
                  console.error(`[design/generate] mid-stream error: ${JSON.stringify(parsed.error)}`)
                  continue
                }
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  seenContent = true
                  const out = substitute(delta, false)
                  if (out) controller.enqueue(encoder.encode(out))
                }
              } catch {
                /* partial/non-JSON SSE frame — ignore */
              }
            }
            pendingRead = reader.read()
          }
        } catch (err) {
          console.error("[design/generate] stream pump failed:", err)
          controller.error(err)
        }
      })()
    },
    cancel() {
      reader.cancel()
    },
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
