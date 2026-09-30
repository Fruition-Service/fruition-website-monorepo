/**
 * Ask Fruit persistence in the portal Supabase project.
 *
 * Every read and write is scoped to the visitor id from the httpOnly cookie
 * (see visitor.ts). The tables have RLS on with no policies, so only this
 * service-role client can reach them.
 */
import { getPortalAdmin } from "@/lib/portalAuth"
import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  BriefDocument,
  EvaluationDetail,
  EvaluationMessage,
  EvaluationStage,
  EvaluationSummary,
  Offering,
  RequirementKey,
  Requirements,
} from "./types"

const TABLE = "ask_fruit_evaluations"
const MAX_MESSAGES = 200

interface Row {
  id: string
  visitor_id: string
  title: string
  stage: EvaluationStage
  status: string
  requirements: Requirements
  open_questions: RequirementKey[]
  matches: Offering[]
  shortlist: string[]
  documents: BriefDocument[]
  messages: EvaluationMessage[]
  updated_at: string
}

const SUMMARY_COLUMNS = "id,title,stage,matches,shortlist,updated_at"

function toSummary(row: Pick<Row, "id" | "title" | "stage" | "matches" | "shortlist" | "updated_at">): EvaluationSummary {
  return {
    evaluation_id: row.id,
    title: row.title,
    stage: row.stage,
    match_count: Array.isArray(row.matches) ? row.matches.length : 0,
    shortlist_count: Array.isArray(row.shortlist) ? row.shortlist.length : 0,
    updated_at: row.updated_at,
  }
}

function toDetail(row: Row): EvaluationDetail {
  return {
    ...toSummary(row),
    requirements: row.requirements ?? {},
    open_questions: row.open_questions ?? [],
    matches: row.matches ?? [],
    shortlist: row.shortlist ?? [],
    documents: row.documents ?? [],
    messages: row.messages ?? [],
  }
}

export function newEvaluation(title = "New conversation"): EvaluationDetail {
  return {
    evaluation_id: `ev_${crypto.randomUUID().replace(/-/g, "")}`,
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

export class EvaluationStore {
  constructor(private readonly db: SupabaseClient = getPortalAdmin()) {}

  async list(visitorId: string): Promise<EvaluationSummary[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select(SUMMARY_COLUMNS)
      .eq("visitor_id", visitorId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(50)
    if (error) throw error
    return (data ?? []).map(toSummary)
  }

  async get(visitorId: string, id: string): Promise<EvaluationDetail | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .eq("visitor_id", visitorId)
      .neq("status", "deleted")
      .maybeSingle()
    if (error) throw error
    return data ? toDetail(data as Row) : null
  }

  /**
   * Insert or overwrite the whole evaluation. One writer per turn, so no merge
   * is needed. Callers only pass ids that are server-generated or that get()
   * has already confirmed belong to this visitor.
   */
  async save(visitorId: string, evaluation: EvaluationDetail): Promise<EvaluationDetail> {
    const { data, error } = await this.db
      .from(TABLE)
      .upsert({
        id: evaluation.evaluation_id,
        visitor_id: visitorId,
        title: evaluation.title.slice(0, 120),
        stage: evaluation.stage,
        status: "active",
        requirements: evaluation.requirements,
        open_questions: evaluation.open_questions,
        matches: evaluation.matches,
        shortlist: evaluation.shortlist,
        documents: evaluation.documents,
        messages: evaluation.messages.slice(-MAX_MESSAGES),
      })
      .select("*")
      .single()
    if (error) throw error
    return toDetail(data as Row)
  }

  async update(
    visitorId: string,
    id: string,
    patch: Partial<Pick<Row, "title" | "status" | "shortlist">>,
  ): Promise<EvaluationDetail | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .update(patch)
      .eq("id", id)
      .eq("visitor_id", visitorId)
      .neq("status", "deleted")
      .select("*")
      .maybeSingle()
    if (error) throw error
    return data ? toDetail(data as Row) : null
  }
}

export interface TurnLog {
  evaluation_id: string | null
  visitor_id: string
  ip_hash: string | null
  status: "completed" | "failed" | "aborted"
  error_code?: string | null
  model: string
  steps: number
  prompt_tokens: number
  completion_tokens: number
  cost_usd: number
  latency_ms: number
}

export async function logTurn(entry: TurnLog, db: SupabaseClient = getPortalAdmin()): Promise<void> {
  const { error } = await db.from("ask_fruit_turns").insert(entry)
  if (error) console.error("[ask-fruit] failed to log turn", error)
}

export interface Usage {
  visitor_hour: number
  visitor_day: number
  ip_day: number
  cost_day: number
}

export async function getUsage(visitorId: string, ipHash: string | null, db: SupabaseClient = getPortalAdmin()): Promise<Usage> {
  const { data, error } = await db.rpc("ask_fruit_usage", { p_visitor_id: visitorId, p_ip_hash: ipHash })
  if (error) throw error
  const u = (data ?? {}) as Partial<Usage>
  return {
    visitor_hour: Number(u.visitor_hour ?? 0),
    visitor_day: Number(u.visitor_day ?? 0),
    ip_day: Number(u.ip_day ?? 0),
    cost_day: Number(u.cost_day ?? 0),
  }
}
