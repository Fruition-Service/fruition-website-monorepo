/**
 * Ask Fruit tools: schemas the model sees and the server-side executors.
 *
 * Sam's catalog tools (search_catalog, keyword_search_catalog, get_product_info,
 * compare_products, get_pricing_detail, get_product_intelligence) collapse into
 * search_knowledge + get_details over Fruition's in-memory index. Sam's text
 * marker, profile-extraction side call and HTML document skills become
 * recommend_offerings, update_requirements and the two brief tools, whose
 * arguments are validated here before anything reaches the visitor.
 */
import { getRecords, searchKnowledge, isOfferingKind, type KnowledgeRecord } from "./knowledge"
import { OFFERING_KINDS } from "./knowledge/types"
import { matchStrength } from "./fit"
import { mergeRequirements } from "./requirements"
import {
  REQUIREMENT_KEYS,
  isRequirementKey,
  type AskFruitEvent,
  type BriefDocument,
  type ComparisonBrief,
  type EvaluationDetail,
  type FitCell,
  type FitSource,
  type FitStatus,
  type ImplementationBrief,
  type Offering,
  type RequirementKey,
} from "./types"

export interface ToolContext {
  /** Working copy of the evaluation; executors mutate it and the route persists it. */
  evaluation: EvaluationDetail
  emit: (event: AskFruitEvent) => void
}

export interface ToolResult {
  /** JSON sent back to the model. */
  content: unknown
  ok: boolean
}

type Json = Record<string, unknown>

const STRING_LIST = { type: "array", items: { type: "string" } }
const FIT_STATUS = ["yes", "partial", "no", "unknown"]

const REQUIREMENT_PROPERTIES = Object.fromEntries(REQUIREMENT_KEYS.map((k) => [k, STRING_LIST]))

export const TOOL_DEFINITIONS = [
  {
    name: "search_knowledge",
    description:
      "Search Fruition's knowledge base: solutions, services, platform partnerships, implementation packages, case studies, FAQs and regional pages. Returns ranked matches with ids, summaries and site URLs.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "2 to 5 key terms, e.g. 'salesforce monday crm migration'." },
        kinds: {
          type: "array",
          items: { type: "string", enum: ["solution", "service", "platform", "package", "case_study", "faq", "region", "page"] },
          description: "Optional filter. Omit to get offerings and supporting evidence together.",
        },
        limit: { type: "integer", minimum: 1, maximum: 10 },
      },
      required: ["query"],
    },
  },
  {
    name: "get_details",
    description: "Full record for up to four knowledge ids: facts (price, hours, phases, integrations, reference clients) and the page text.",
    parameters: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 } },
      required: ["ids"],
    },
  },
  {
    name: "update_requirements",
    description:
      "Record what the visitor has told you. Send only keys that changed, each with its complete new list (an empty list clears it). Also set open_questions and, once the goal is clear, a short title.",
    parameters: {
      type: "object",
      properties: {
        ...REQUIREMENT_PROPERTIES,
        open_questions: {
          type: "array",
          items: { type: "string", enum: [...REQUIREMENT_KEYS] },
          maxItems: 3,
          description: "The unanswered requirements that would most change the recommendation.",
        },
        title: { type: "string", description: "Three to six words naming the evaluation." },
      },
    },
  },
  {
    name: "recommend_offerings",
    description:
      "Publish your recommendation to the visitor's decision board, in the order your reply presents it. Only ids returned by search_knowledge for solutions, services, platforms or packages.",
    parameters: {
      type: "object",
      properties: {
        items: {
          type: "array",
          minItems: 1,
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              offering_id: { type: "string" },
              score: { type: "integer", minimum: 0, maximum: 100, description: "Fit with this visitor." },
              best_for: { type: "string", description: "One line: who or what this is best for." },
              reasons: { ...STRING_LIST, maxItems: 3 },
              considerations: { ...STRING_LIST, maxItems: 2 },
              fit: {
                type: "object",
                description: "Verdict per captured requirement key.",
                properties: Object.fromEntries(
                  REQUIREMENT_KEYS.map((k) => [
                    k,
                    {
                      type: "object",
                      properties: {
                        status: { type: "string", enum: FIT_STATUS },
                        source: { type: "string", enum: ["documented", "judgement"] },
                        note: { type: "string" },
                      },
                      required: ["status"],
                    },
                  ]),
                ),
              },
            },
            required: ["offering_id", "score", "reasons"],
          },
        },
      },
      required: ["items"],
    },
  },
  {
    name: "update_shortlist",
    description: "Add, remove or clear offerings on the visitor's shortlist.",
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["add", "remove", "clear"] },
        ids: { type: "array", items: { type: "string" } },
      },
      required: ["action", "ids"],
    },
  },
  {
    name: "create_comparison_brief",
    description: "Create a side-by-side comparison brief of two to four offerings against the visitor's requirements, with your recommendation.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        buyer_context: { type: "string", description: "One or two sentences on the visitor's situation." },
        offering_ids: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
        requirements: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              requirement: { type: "string" },
              why_it_matters: { type: "string" },
              fit: {
                type: "object",
                description: "Keyed by offering id.",
                additionalProperties: {
                  type: "object",
                  properties: { status: { type: "string", enum: FIT_STATUS }, note: { type: "string" } },
                  required: ["status"],
                },
              },
            },
            required: ["requirement", "fit"],
          },
        },
        strengths: { type: "object", description: "Offering id to up to three strengths.", additionalProperties: STRING_LIST },
        watch_outs: { type: "object", description: "Offering id to up to two watch-outs.", additionalProperties: STRING_LIST },
        recommendation: {
          type: "object",
          properties: { offering_id: { type: "string" }, reason: { type: "string" } },
          required: ["offering_id", "reason"],
        },
        next_steps: { ...STRING_LIST, maxItems: 4 },
      },
      required: ["title", "offering_ids", "requirements", "recommendation", "next_steps"],
    },
  },
  {
    name: "create_implementation_brief",
    description: "Create an implementation brief for the recommended offering: objectives, requirements, success criteria, phases, risks and next steps.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        recommended_offering_id: { type: "string" },
        considered_offering_ids: STRING_LIST,
        executive_summary: { type: "string" },
        business_objectives: { ...STRING_LIST, maxItems: 5 },
        key_requirements: { ...STRING_LIST, maxItems: 8 },
        success_criteria: { ...STRING_LIST, maxItems: 5 },
        phases: {
          type: "array",
          minItems: 1,
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              phase: { type: "string" },
              duration: { type: "string" },
              owner: { type: "string" },
              activities: { ...STRING_LIST, maxItems: 5 },
            },
            required: ["phase", "activities"],
          },
        },
        risks: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            properties: { risk: { type: "string" }, mitigation: { type: "string" } },
            required: ["risk"],
          },
        },
        next_steps: { ...STRING_LIST, maxItems: 4 },
      },
      required: ["title", "recommended_offering_id", "business_objectives", "phases", "next_steps"],
    },
  },
] as const

export type ToolName = (typeof TOOL_DEFINITIONS)[number]["name"]

export const TOOL_LABELS: Record<ToolName, string> = {
  search_knowledge: "Searching Fruition's solutions",
  get_details: "Reading the details",
  update_requirements: "Noting your requirements",
  recommend_offerings: "Updating your recommendations",
  update_shortlist: "Updating your shortlist",
  create_comparison_brief: "Writing your comparison brief",
  create_implementation_brief: "Writing your implementation brief",
}

export function isToolName(name: string): name is ToolName {
  return name in TOOL_LABELS
}

// ---------------------------------------------------------------------------
// Coercion helpers: the model's arguments are untrusted input.

function str(value: unknown, max = 400): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : ""
}

function strList(value: unknown, maxItems = 8, maxLen = 300): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => str(v, maxLen)).filter(Boolean).slice(0, maxItems)
}

function obj(value: unknown): Json {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {}
}

function fitStatus(value: unknown): FitStatus {
  return typeof value === "string" && (FIT_STATUS as string[]).includes(value) ? (value as FitStatus) : "unknown"
}

function compactFacts(facts: KnowledgeRecord["facts"], maxItems = 6): KnowledgeRecord["facts"] {
  const out: KnowledgeRecord["facts"] = {}
  for (const [k, v] of Object.entries(facts)) out[k] = Array.isArray(v) ? v.slice(0, maxItems) : v
  return out
}

function offeringFromRecord(record: KnowledgeRecord): Offering {
  return {
    offering_id: record.id,
    title: record.title,
    kind: record.kind,
    url: record.url,
    summary: record.summary.slice(0, 280),
    facts: compactFacts(record.facts),
  }
}

/** Resolve ids to recommendable records; returns the valid ones and the rejects. */
async function resolveOfferings(ids: string[]) {
  const unique = [...new Set(ids)]
  const records = await getRecords(unique)
  const byId = new Map(records.map((r) => [r.id, r]))
  const valid: KnowledgeRecord[] = []
  const rejected: string[] = []
  for (const id of unique) {
    const record = byId.get(id)
    if (record && isOfferingKind(record.kind)) valid.push(record)
    else rejected.push(id)
  }
  return { valid, rejected }
}

function newDocId(): string {
  return `doc_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`
}

const MAX_DOCUMENTS = 12

function addDocument(ctx: ToolContext, document: BriefDocument) {
  ctx.evaluation.documents = [...ctx.evaluation.documents, document].slice(-MAX_DOCUMENTS)
  ctx.emit({ type: "document_ready", data: { document } })
}

/** Offering data for a brief: the board's copy when it has one, else the knowledge record. */
function boardOrRecord(ctx: ToolContext, record: KnowledgeRecord): Offering {
  return ctx.evaluation.matches.find((m) => m.offering_id === record.id) ?? offeringFromRecord(record)
}

// ---------------------------------------------------------------------------
// Executors

async function searchTool(input: Json): Promise<ToolResult> {
  const query = str(input.query, 200)
  if (!query) return { ok: false, content: { error: "query is required" } }
  const kinds = strList(input.kinds, 8).filter((k) =>
    ["solution", "service", "platform", "package", "case_study", "faq", "region", "page"].includes(k),
  ) as KnowledgeRecord["kind"][]
  const limit = typeof input.limit === "number" ? Math.min(Math.max(Math.round(input.limit), 1), 10) : 6

  const shape = (r: KnowledgeRecord) => ({
    id: r.id,
    kind: r.kind,
    title: r.title,
    url: r.url,
    summary: r.summary.slice(0, 280),
    ...(Object.keys(r.facts).length ? { facts: compactFacts(r.facts, 4) } : {}),
  })

  if (kinds.length) {
    const hits = await searchKnowledge(query, { kinds, limit })
    return { ok: true, content: { query, results: hits.map((h) => shape(h.record)) } }
  }
  // Unfiltered: offerings and evidence ranked separately, so 470 FAQs can't
  // crowd the things the agent is allowed to recommend out of the results.
  const [offerings, evidence] = await Promise.all([
    searchKnowledge(query, { kinds: [...OFFERING_KINDS], limit }),
    searchKnowledge(query, { kinds: ["case_study", "faq", "region", "page"], limit: 4 }),
  ])
  return {
    ok: true,
    content: {
      query,
      offerings: offerings.map((h) => shape(h.record)),
      evidence: evidence.map((h) => shape(h.record)),
      ...(offerings.length ? {} : { note: "No offerings matched. Try different terms or ask the visitor one question." }),
    },
  }
}

async function detailsTool(input: Json): Promise<ToolResult> {
  const ids = strList(input.ids, 4, 120)
  if (!ids.length) return { ok: false, content: { error: "ids is required" } }
  const records = await getRecords(ids)
  const found = new Set(records.map((r) => r.id))
  return {
    ok: true,
    content: {
      records: records.map((r) => ({
        id: r.id,
        kind: r.kind,
        title: r.title,
        url: r.url,
        summary: r.summary,
        facts: r.facts,
        text: r.text.slice(0, 3500),
      })),
      ...(ids.some((id) => !found.has(id)) ? { not_found: ids.filter((id) => !found.has(id)) } : {}),
    },
  }
}

function requirementsTool(input: Json, ctx: ToolContext): ToolResult {
  const ev = ctx.evaluation
  ev.requirements = mergeRequirements(ev.requirements, input)
  if (Array.isArray(input.open_questions)) {
    ev.open_questions = strList(input.open_questions, 3).filter(isRequirementKey)
  }
  const title = str(input.title, 80)
  if (title) ev.title = title
  ctx.emit({
    type: "requirements",
    data: { requirements: ev.requirements, open_questions: ev.open_questions, ...(title ? { title } : {}) },
  })
  return { ok: true, content: { saved: true, requirements: ev.requirements, open_questions: ev.open_questions } }
}

function parseFit(value: unknown): Partial<Record<RequirementKey, FitCell>> {
  const out: Partial<Record<RequirementKey, FitCell>> = {}
  for (const [key, raw] of Object.entries(obj(value))) {
    if (!isRequirementKey(key)) continue
    const cell = obj(raw)
    const source: FitSource = cell.source === "documented" ? "documented" : "judgement"
    const note = str(cell.note, 200)
    out[key] = { status: fitStatus(cell.status), source, ...(note ? { note } : {}) }
  }
  return out
}

async function recommendTool(input: Json, ctx: ToolContext): Promise<ToolResult> {
  const items = Array.isArray(input.items) ? input.items.map(obj).slice(0, 5) : []
  if (!items.length) return { ok: false, content: { error: "items is required" } }
  const { valid, rejected } = await resolveOfferings(items.map((i) => str(i.offering_id, 120)))
  if (!valid.length) {
    return {
      ok: false,
      content: { error: "None of these ids are recommendable offerings. Use ids from search_knowledge offerings.", rejected },
    }
  }
  const byId = new Map(valid.map((r) => [r.id, r]))
  const offerings: Offering[] = []
  for (const item of items) {
    const record = byId.get(str(item.offering_id, 120))
    if (!record || offerings.some((o) => o.offering_id === record.id)) continue
    const score = typeof item.score === "number" ? Math.min(Math.max(Math.round(item.score), 0), 100) : null
    offerings.push({
      ...offeringFromRecord(record),
      rank: offerings.length + 1,
      match_score: score,
      match_strength: matchStrength(score),
      best_for: str(item.best_for, 200) || undefined,
      reasons: strList(item.reasons, 3, 240),
      considerations: strList(item.considerations, 2, 240),
      requirement_fit: parseFit(item.fit),
    })
  }

  const ev = ctx.evaluation
  // The board shows the latest recommendation. Offerings the visitor kept stay
  // on it even when the new recommendation leaves them out.
  const kept = ev.matches.filter((m) => ev.shortlist.includes(m.offering_id) && !byId.has(m.offering_id))
  ev.matches = [...offerings, ...kept]
  ev.match_count = ev.matches.length
  if (ev.stage === "discovery") ev.stage = "recommending"
  ctx.emit({ type: "recommendations", data: { items: ev.matches } })
  return {
    ok: true,
    content: { published: offerings.map((o) => o.offering_id), ...(rejected.length ? { rejected } : {}) },
  }
}

async function shortlistTool(input: Json, ctx: ToolContext): Promise<ToolResult> {
  const ev = ctx.evaluation
  const action = str(input.action, 10)
  const ids = strList(input.ids, 10, 120)
  if (action === "clear") {
    ev.shortlist = []
  } else if (action === "add") {
    const { valid, rejected } = await resolveOfferings(ids)
    for (const record of valid) {
      if (!ev.shortlist.includes(record.id)) ev.shortlist.push(record.id)
      if (!ev.matches.some((m) => m.offering_id === record.id)) ev.matches.push(offeringFromRecord(record))
    }
    ev.match_count = ev.matches.length
    if (rejected.length && !valid.length) return { ok: false, content: { error: "Unknown offering ids", rejected } }
  } else if (action === "remove") {
    ev.shortlist = ev.shortlist.filter((id) => !ids.includes(id))
  } else {
    return { ok: false, content: { error: "action must be add, remove or clear" } }
  }
  ev.shortlist_count = ev.shortlist.length
  ctx.emit({ type: "shortlist", data: { items: ev.shortlist } })
  ctx.emit({ type: "recommendations", data: { items: ev.matches } })
  return { ok: true, content: { shortlist: ev.shortlist } }
}

async function comparisonTool(input: Json, ctx: ToolContext): Promise<ToolResult> {
  const { valid, rejected } = await resolveOfferings(strList(input.offering_ids, 4, 120))
  if (valid.length < 2) return { ok: false, content: { error: "Need at least two valid offering ids.", rejected } }
  const ids = valid.map((r) => r.id)
  const perOffering = (value: unknown, max: number) =>
    Object.fromEntries(ids.map((id) => [id, strList(obj(value)[id], max, 240)]))

  const recommendation = obj(input.recommendation)
  const recommendedId = ids.includes(str(recommendation.offering_id, 120)) ? str(recommendation.offering_id, 120) : ids[0]
  const data: ComparisonBrief = {
    title: str(input.title, 120) || "Comparison brief",
    buyer_context: str(input.buyer_context, 500) || undefined,
    offerings: valid.map((r) => boardOrRecord(ctx, r)),
    requirements: (Array.isArray(input.requirements) ? input.requirements : [])
      .map(obj)
      .slice(0, 10)
      .map((row) => ({
        requirement: str(row.requirement, 160),
        why_it_matters: str(row.why_it_matters, 240) || undefined,
        fit: Object.fromEntries(
          ids.map((id) => {
            const cell = obj(obj(row.fit)[id])
            const note = str(cell.note, 200)
            return [id, { status: fitStatus(cell.status), ...(note ? { note } : {}) }]
          }),
        ),
      }))
      .filter((row) => row.requirement),
    strengths: perOffering(input.strengths, 3),
    watch_outs: perOffering(input.watch_outs, 2),
    recommendation: { offering_id: recommendedId, reason: str(recommendation.reason, 400) || undefined },
    next_steps: strList(input.next_steps, 4, 240),
  }
  const document: BriefDocument = {
    doc_id: newDocId(),
    doc_type: "comparison_brief",
    title: data.title,
    created_at: new Date().toISOString(),
    data,
  }
  addDocument(ctx, document)
  ctx.evaluation.stage = "comparing"
  return { ok: true, content: { created: document.doc_id, title: data.title, ...(rejected.length ? { rejected } : {}) } }
}

async function implementationTool(input: Json, ctx: ToolContext): Promise<ToolResult> {
  const recommendedId = str(input.recommended_offering_id, 120)
  const considered = strList(input.considered_offering_ids, 4, 120).filter((id) => id !== recommendedId)
  const { valid, rejected } = await resolveOfferings([recommendedId, ...considered])
  const recommended = valid.find((r) => r.id === recommendedId)
  if (!recommended) return { ok: false, content: { error: "recommended_offering_id is not a valid offering id.", rejected } }

  const phases = (Array.isArray(input.phases) ? input.phases : [])
    .map(obj)
    .slice(0, 6)
    .map((p) => ({
      phase: str(p.phase, 120),
      duration: str(p.duration, 60) || undefined,
      owner: str(p.owner, 80) || undefined,
      activities: strList(p.activities, 5, 240),
    }))
    .filter((p) => p.phase)
  if (!phases.length) return { ok: false, content: { error: "At least one phase is required." } }

  const data: ImplementationBrief = {
    title: str(input.title, 120) || "Implementation brief",
    recommended: boardOrRecord(ctx, recommended),
    executive_summary: str(input.executive_summary, 800) || undefined,
    business_objectives: strList(input.business_objectives, 5, 240),
    key_requirements: strList(input.key_requirements, 8, 240),
    success_criteria: strList(input.success_criteria, 5, 240),
    phases,
    risks: (Array.isArray(input.risks) ? input.risks : [])
      .map(obj)
      .slice(0, 5)
      .map((r) => ({ risk: str(r.risk, 240), mitigation: str(r.mitigation, 240) || undefined }))
      .filter((r) => r.risk),
    considered: valid.filter((r) => r.id !== recommendedId).map((r) => boardOrRecord(ctx, r)),
    next_steps: strList(input.next_steps, 4, 240),
  }
  const document: BriefDocument = {
    doc_id: newDocId(),
    doc_type: "implementation_brief",
    title: data.title,
    created_at: new Date().toISOString(),
    data,
  }
  addDocument(ctx, document)
  ctx.evaluation.stage = "planning"
  return { ok: true, content: { created: document.doc_id, title: data.title } }
}

export async function executeTool(name: string, rawArgs: string, ctx: ToolContext): Promise<ToolResult> {
  let input: Json
  try {
    input = rawArgs.trim() ? obj(JSON.parse(rawArgs)) : {}
  } catch {
    return { ok: false, content: { error: "Arguments were not valid JSON." } }
  }
  try {
    switch (name) {
      case "search_knowledge":
        return await searchTool(input)
      case "get_details":
        return await detailsTool(input)
      case "update_requirements":
        return requirementsTool(input, ctx)
      case "recommend_offerings":
        return await recommendTool(input, ctx)
      case "update_shortlist":
        return await shortlistTool(input, ctx)
      case "create_comparison_brief":
        return await comparisonTool(input, ctx)
      case "create_implementation_brief":
        return await implementationTool(input, ctx)
      default:
        return { ok: false, content: { error: `Unknown tool: ${name}` } }
    }
  } catch (err) {
    console.error(`[ask-fruit] tool ${name} threw`, err)
    return { ok: false, content: { error: `The ${name} tool failed. Carry on without it.` } }
  }
}
