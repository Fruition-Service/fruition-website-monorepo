/**
 * Read-only scan for malformed hrefs across every Sanity document (monday 2904193295).
 *
 *   npm run scan:malformed-hrefs                    markdown to stdout
 *   npm run scan:malformed-hrefs -- --json          JSON to stdout
 *   npm run scan:malformed-hrefs -- --out <file>    also write the output to a file
 *
 * Checks link markDefs and any string field named href, url, link or *Url/*Href/*Link,
 * in every document type. With SANITY_WRITE_TOKEN or SANITY_API_READ_TOKEN set it also
 * scans drafts; without one it sees published documents only. Never writes to Sanity.
 * Rules: src/lib/malformedHrefs.ts. See scripts/internal-links/README.md.
 */
import { createClient } from "@sanity/client"
import * as dotenv from "dotenv"
import { writeFileSync } from "node:fs"
import { findMalformedHrefs, type MalformedHref } from "../src/lib/malformedHrefs"

dotenv.config({ path: ".env.local" })

type Hit = MalformedHref & { _id: string; _type: string }

async function main() {
  const argv = process.argv.slice(2)
  const json = argv.includes("--json")
  const outIdx = argv.indexOf("--out")
  const out = outIdx >= 0 ? argv[outIdx + 1] : undefined

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    console.error("scan-malformed-hrefs: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set (.env.local)")
    process.exit(1)
  }
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN
  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "raw",
    ...(token ? { token } : {}),
  })

  // Page through every document by _id, skipping system documents.
  const hits: Hit[] = []
  let scanned = 0
  let lastId = ""
  for (;;) {
    const page = await client.fetch<Array<Record<string, unknown> & { _id: string; _type: string }>>(
      `*[!(_id in path("_.**")) && _id > $lastId] | order(_id) [0...200]`,
      { lastId },
    )
    if (!page.length) break
    for (const doc of page) {
      for (const h of findMalformedHrefs(doc)) hits.push({ _id: doc._id, _type: doc._type, ...h })
    }
    scanned += page.length
    lastId = page[page.length - 1]._id
  }

  const text = json
    ? JSON.stringify({ scanned, drafts: !!token, hits }, null, 2)
    : [
        `# Malformed hrefs`,
        "",
        `Scanned ${scanned} documents (${token ? "published and drafts" : "published only"}). ${hits.length} hit(s).`,
        "",
        ...(hits.length
          ? [
              "| kind | _id | _type | path | href |",
              "| --- | --- | --- | --- | --- |",
              ...hits.map((h) => `| ${h.kind} | ${h._id} | ${h._type} | \`${h.path}\` | ${h.href.replace(/\|/g, "\\|")} |`),
            ]
          : []),
        "",
      ].join("\n")
  if (out) writeFileSync(out, text)
  console.log(text)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
