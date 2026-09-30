/**
 * Writes the in-repo half of Ask Fruit's knowledge base (the solutions catalog
 * and practice pages) to public/ask-fruit-knowledge.json. Runs before
 * `next dev` and `next build` (predev/prebuild).
 *
 * Why a static asset and not an import: route handlers get their own module
 * graph, so importing these data modules into the chat route bundled a second
 * copy of them into the Worker (about 45 KiB gzipped), and the Worker already
 * sits within ~115 KiB of Cloudflare's 10 MiB script limit. Static assets are
 * served from the ASSETS binding and do not count toward that limit.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { staticRecords } from "../src/lib/askFruit/knowledge/static"

const out = join(process.cwd(), "public", "ask-fruit-knowledge.json")
const records = staticRecords()
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({ generated_at: new Date().toISOString(), records }))
console.log(`[ask-fruit] wrote ${records.length} knowledge records to public/ask-fruit-knowledge.json`)
