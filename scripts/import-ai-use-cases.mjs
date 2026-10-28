#!/usr/bin/env node
/**
 * Imports Josh's AI use case catalogue draft into the site's data files.
 *
 *   node scripts/import-ai-use-cases.mjs <hub.html> <industry-pages-dir>
 *
 * <hub.html> is ai-use-cases-hub-draft-vN.html and <industry-pages-dir> is the
 * `ai-use-cases/` folder from ai-use-cases-draft-vN.zip (one <slug>/index.html
 * per industry). Re-run it whenever a new draft arrives; it rewrites
 * public/data/ai-use-cases/ from scratch.
 *
 * The data lives in public/ rather than src/ on purpose: the site Worker is
 * close to Cloudflare's script size cap, and ~1 MB of copy bundled into it
 * would push it over. src/features/ai-use-cases/data.ts reads these files from
 * disk at build time and from the ASSETS binding at runtime.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs"
import path from "node:path"
import { parse } from "node-html-parser"

const [hubPath, pagesDir] = process.argv.slice(2)
if (!hubPath || !pagesDir) {
  console.error("usage: node scripts/import-ai-use-cases.mjs <hub.html> <industry-pages-dir>")
  process.exit(1)
}

const OUT = path.join(process.cwd(), "public/data/ai-use-cases")

/** Draft filter key -> public URL slug. Order is the hub's order. */
const INDUSTRIES = [
  ["construction", "construction"],
  ["manufacturing", "manufacturing"],
  ["government", "government"],
  ["healthcare", "healthcare"],
  ["realestate", "real-estate"],
  ["professional", "professional-services"],
  ["financial", "financial-services"],
  ["education", "education-nonprofit"],
  ["retail", "retail-ecommerce"],
  ["logistics", "logistics"],
  ["tech", "technology-saas"],
  ["cross", "cross-industry"],
]

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")

/** Plain text of a node, whitespace collapsed, "->" drawn as an arrow. */
const text = (node) =>
  node
    ? decode(node.textContent)
        .replace(/\s+/g, " ")
        .replace(/\s?->\s?/g, " → ")
        .trim()
    : ""

/** Some generated sentences start lower-case ("replace a decades-old…"). */
const sentence = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const list = (node) => (node ? node.querySelectorAll("li").map(text).filter(Boolean) : [])
const words = (s) => (s || "").split(/\s+/).filter(Boolean)

function optionLabels(root, id) {
  const out = {}
  for (const o of root.querySelectorAll(`#${id} option`)) {
    const v = o.getAttribute("value")
    if (v) out[v] = text(o)
  }
  return out
}

/** The detail cards inside a tile's hidden `.build-src`, keyed by heading. */
function buildCards(tile) {
  const cards = {}
  for (const card of tile.querySelectorAll(".build-src .card")) {
    const h = text(card.querySelector("h3"))
    if (h) cards[h] = card
  }
  return cards
}

const hubHtml = readFileSync(hubPath, "utf8")
const hub = parse(hubHtml)

const diagrams = JSON.parse(hub.querySelector("#diagrams").textContent)
const industryNames = optionLabels(hub, "f-industry")
const departments = optionLabels(hub, "f-dept")
const solutionTypes = optionLabels(hub, "f-type")

const useCases = hub.querySelectorAll("article.tile").map((tile) => {
  const id = tile.getAttribute("id")
  const cards = buildCards(tile)
  const diagram = diagrams[id]
  const uc = {
    id,
    industry: tile.getAttribute("data-industry"),
    departments: words(tile.getAttribute("data-dept")),
    solutionTypes: words(tile.getAttribute("data-type")),
    ai: tile.getAttribute("data-ai") === "1",
    own: tile.getAttribute("data-own") === "1",
    kicker: text(tile.querySelector(".kicker")),
    title: text(tile.querySelector(":scope > h3")),
    summary: sentence(text(tile.querySelector(".summary"))),
    teams: list(cards["Teams involved"]),
    challenge: sentence(text(cards["The challenge"]?.querySelector("p"))),
    boards: list(cards["Boards & modules"]),
    automations: list(cards["Automations & AI steps"]),
    integrations: list(cards["Integrations"]),
  }
  const metric = text(tile.querySelector(".metric"))
  if (metric) uc.metric = metric
  const outcome = sentence(text(cards["Expected outcome"]?.querySelector("p")))
  if (outcome) uc.outcome = outcome
  const timeframe = text(cards["Timeframe for the complete build"]?.querySelector("p"))
  if (timeframe) uc.timeframe = timeframe
  if (diagram) {
    uc.process = {
      title: diagram.title,
      lanes: diagram.lanes,
      steps: diagram.steps.map((s) => ({ id: s.id, lane: s.lane, label: s.label, kind: s.kind })),
      flow: diagram.flow.map(([from, to, label]) => (label ? [from, to, label] : [from, to])),
    }
  }
  return uc
})

const missing = useCases.filter((u) => !u.title || !u.summary || !u.industry)
if (missing.length) {
  console.error("tiles missing a title, summary or industry:", missing.map((u) => u.id))
  process.exit(1)
}

/**
 * The draft's FAQ answers are generated from lowercased filter labels
 * ("operations & erp", "sales & crm", "technology & saas"). Restore the
 * acronyms' own casing; the wording itself is left as written.
 */
const ACRONYMS = [
  [/\berp\b/g, "ERP"],
  [/\bcrm\b/g, "CRM"],
  [/\bpmo\b/g, "PMO"],
  [/\bhr\b/g, "HR"],
  [/\bsaas\b/g, "SaaS"],
  [/\bit & engineering\b/g, "IT & engineering"],
  [/\bai agents\b/g, "AI agents"],
]
const fixAcronyms = (s) => ACRONYMS.reduce((out, [re, to]) => out.replace(re, to), s)

/** Industry page copy: SEO title/description and the page's own FAQ. */
function industryPage(slug) {
  const file = path.join(pagesDir, slug, "index.html")
  if (!existsSync(file)) throw new Error(`missing industry page ${file}`)
  const root = parse(readFileSync(file, "utf8"))
  const faq = root.querySelectorAll("details.faq-item").map((d) => ({
    question: fixAcronyms(text(d.querySelector("summary"))),
    answer: fixAcronyms(text(d.querySelector("p"))),
  }))
  const ids = root.querySelectorAll("article.tile").map((t) => t.getAttribute("id"))
  return {
    seoTitle: text(root.querySelector("title")),
    seoDescription: decode(root.querySelector('meta[name="description"]')?.getAttribute("content") ?? ""),
    heading: text(root.querySelector("#explore-h")),
    intro: text(root.querySelector("#explore .sec-head p")),
    faq,
    ids,
  }
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const index = {
  source: path.basename(hubPath),
  total: useCases.length,
  aiCount: useCases.filter((u) => u.ai).length,
  ownCount: useCases.filter((u) => u.own).length,
  /** The hub's tile order, which mixes industries. */
  order: useCases.map((u) => u.id),
  departments,
  solutionTypes,
  industries: [],
}

for (const [key, slug] of INDUSTRIES) {
  const page = industryPage(slug)
  const items = useCases.filter((u) => u.industry === key)
  // The industry page's order is the curated order; fall back to hub order.
  const order = new Map(page.ids.map((id, i) => [id, i]))
  items.sort((a, b) => (order.get(a.id) ?? 1e6) - (order.get(b.id) ?? 1e6))
  const notOnPage = items.filter((u) => !order.has(u.id)).length
  if (notOnPage) console.warn(`${slug}: ${notOnPage} hub tiles are not on the industry page`)
  const meta = {
    key,
    slug,
    name: industryNames[key],
    count: items.length,
    aiCount: items.filter((u) => u.ai).length,
  }
  index.industries.push(meta)
  const { ids: _ids, ...copy } = page
  writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify({ ...meta, ...copy, useCases: items }))
  console.log(`${slug}: ${items.length} use cases, ${meta.aiCount} with AI, ${page.faq.length} FAQs`)
}

const assigned = index.industries.reduce((n, i) => n + i.count, 0)
if (assigned !== useCases.length) {
  console.error(`only ${assigned} of ${useCases.length} use cases matched an industry`)
  process.exit(1)
}

writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2))
console.log(`total ${index.total}, ${index.aiCount} with AI, ${index.ownCount} Fruition builds`)
