/**
 * BM25 ranking over the Ask Fruit knowledge records.
 *
 * The corpus is small (a few hundred records, well under 2 MB of text), so an
 * in-memory inverted index rebuilt when the content cache refreshes is cheaper
 * and more predictable on the Worker than a vector store: no embedding call per
 * query, no extra subrequest, and the model reformulates queries itself when a
 * first search comes back thin.
 */
import type { KnowledgeRecord } from "./types"

const STOPWORDS = new Set(
  (
    "a an and are as at be but by can do does for from has have how i if in into is it its " +
    "me my of on or our so than that the their them then there these they this to us was " +
    "we what when where which who why will with you your need needs want looking help " +
    "use using get make best"
  ).split(" "),
)

/** Lowercase, split on non-alphanumerics, drop stopwords, crude plural/tense folding. */
export function tokenize(text: string): string[] {
  const out: string[] = []
  for (const raw of text.toLowerCase().split(/[^a-z0-9.+#]+/)) {
    const word = raw.replace(/^[.]+|[.]+$/g, "")
    if (word.length < 2 || STOPWORDS.has(word)) continue
    out.push(stem(word))
  }
  return out
}

function stem(word: string): string {
  if (word.length > 5 && word.endsWith("ies")) return `${word.slice(0, -3)}y`
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3)
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1)
  return word
}

// Field weights: a hit in the title says far more than one buried in body copy.
const FIELD_WEIGHTS = { title: 4, tags: 3, summary: 2, text: 1 } as const
const K1 = 1.2
const B = 0.75

export interface SearchIndex {
  records: KnowledgeRecord[]
  byId: Map<string, KnowledgeRecord>
  postings: Map<string, Array<{ doc: number; tf: number }>>
  lengths: number[]
  avgLength: number
}

export function buildIndex(records: KnowledgeRecord[]): SearchIndex {
  const postings = new Map<string, Array<{ doc: number; tf: number }>>()
  const lengths: number[] = []

  records.forEach((record, doc) => {
    const counts = new Map<string, number>()
    let length = 0
    for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
      const value = field === "tags" ? record.tags.join(" ") : record[field as "title" | "summary" | "text"]
      for (const token of tokenize(value)) {
        counts.set(token, (counts.get(token) ?? 0) + weight)
        length += 1
      }
    }
    lengths.push(length)
    for (const [token, tf] of counts) {
      const list = postings.get(token)
      if (list) list.push({ doc, tf })
      else postings.set(token, [{ doc, tf }])
    }
  })

  const total = lengths.reduce((sum, n) => sum + n, 0)
  return {
    records,
    byId: new Map(records.map((r) => [r.id, r])),
    postings,
    lengths,
    avgLength: records.length ? total / records.length : 1,
  }
}

export interface SearchOptions {
  limit?: number
  kinds?: KnowledgeRecord["kind"][]
}

export function searchIndex(
  index: SearchIndex,
  query: string,
  options: SearchOptions = {},
): Array<{ record: KnowledgeRecord; score: number }> {
  const limit = Math.min(Math.max(options.limit ?? 8, 1), 20)
  const kinds = options.kinds?.length ? new Set(options.kinds) : null
  const terms = [...new Set(tokenize(query))]
  if (!terms.length) return []

  const n = index.records.length
  const scores = new Map<number, number>()
  for (const term of terms) {
    const list = index.postings.get(term)
    if (!list) continue
    const idf = Math.log(1 + (n - list.length + 0.5) / (list.length + 0.5))
    for (const { doc, tf } of list) {
      const norm = tf + K1 * (1 - B + (B * index.lengths[doc]) / index.avgLength)
      scores.set(doc, (scores.get(doc) ?? 0) + idf * ((tf * (K1 + 1)) / norm))
    }
  }

  return [...scores.entries()]
    .filter(([doc]) => !kinds || kinds.has(index.records[doc].kind))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([doc, score]) => ({ record: index.records[doc], score: Math.round(score * 100) / 100 }))
}
