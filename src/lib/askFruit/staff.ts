/**
 * Staff-side reads for /internal/ask-fruit. Across all visitors, so only ever
 * called behind requirePortalUser.
 */
import { getPortalAdmin } from "@/lib/portalAuth"
import type { EvaluationDetail, EvaluationMessage, Offering, Requirements } from "./types"

export interface StaffRow {
  id: string
  title: string
  stage: string
  requirements: Requirements
  matches: Offering[]
  shortlist: string[]
  documents: EvaluationDetail["documents"]
  messages: EvaluationMessage[]
  created_at: string
  updated_at: string
}

export interface StaffStats {
  conversations7d: number
  turns7d: number
  failed7d: number
  cost7d: number
  costToday: number
}

export async function recentConversations(limit = 100): Promise<StaffRow[]> {
  const { data, error } = await getPortalAdmin()
    .from("ask_fruit_evaluations")
    .select("id,title,stage,requirements,matches,shortlist,documents,messages,created_at,updated_at")
    .neq("status", "deleted")
    .order("updated_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as StaffRow[]
}

export async function conversation(id: string): Promise<StaffRow | null> {
  const { data, error } = await getPortalAdmin()
    .from("ask_fruit_evaluations")
    .select("id,title,stage,requirements,matches,shortlist,documents,messages,created_at,updated_at")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return (data as StaffRow) ?? null
}

export async function usageStats(): Promise<StaffStats> {
  const db = getPortalAdmin()
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString()
  const dayAgo = new Date(Date.now() - 864e5).toISOString()
  const [{ count: conversations }, { data: turns }] = await Promise.all([
    db.from("ask_fruit_evaluations").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    db.from("ask_fruit_turns").select("status,cost_usd,created_at").gte("created_at", weekAgo).limit(10000),
  ])
  const rows = (turns ?? []) as Array<{ status: string; cost_usd: number | string | null; created_at: string }>
  const cost = (r: (typeof rows)[number]) => Number(r.cost_usd ?? 0)
  return {
    conversations7d: conversations ?? 0,
    turns7d: rows.length,
    failed7d: rows.filter((r) => r.status === "failed").length,
    cost7d: rows.reduce((s, r) => s + cost(r), 0),
    costToday: rows.filter((r) => r.created_at >= dayAgo).reduce((s, r) => s + cost(r), 0),
  }
}
