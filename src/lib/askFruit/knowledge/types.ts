/**
 * One searchable unit of Fruition knowledge.
 *
 * `offering` kinds (solution, service, platform, package) are the things Ask
 * Fruit can recommend and put on the decision board. `evidence` kinds (faq,
 * case_study, region, page) back up an answer but are never recommended.
 */
export type OfferingKind = "solution" | "service" | "platform" | "package"
export type EvidenceKind = "faq" | "case_study" | "region" | "page"
export type KnowledgeKind = OfferingKind | EvidenceKind

export const OFFERING_KINDS: readonly OfferingKind[] = ["solution", "service", "platform", "package"]

export function isOfferingKind(kind: string): kind is OfferingKind {
  return (OFFERING_KINDS as readonly string[]).includes(kind)
}

export interface KnowledgeRecord {
  /** Stable id the agent passes back to tools, e.g. `solution:c-commercial-ppm`. */
  id: string
  kind: KnowledgeKind
  title: string
  /** Site-relative URL of the page a visitor can open. */
  url: string
  /** One or two sentences, shown on cards and in search results. */
  summary: string
  /** Everything else, flattened to plain text and capped. */
  text: string
  /** Platforms, industries and regions this record is about. */
  tags: string[]
  /** Structured facts the agent can quote exactly: price, hours, timeline… */
  facts: Record<string, string | string[]>
}

/** Trimmed, case-insensitively de-duplicated, empties dropped. */
export function unique(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of values) {
    const clean = v?.trim()
    if (!clean || seen.has(clean.toLowerCase())) continue
    seen.add(clean.toLowerCase())
    out.push(clean)
  }
  return out
}
