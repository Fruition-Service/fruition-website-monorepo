/**
 * Repair blog images that were scraped at placeholder resolution.
 *
 * WHAT WENT WRONG
 * Wix server-renders `<img src>` with a lazy-load placeholder — a 49px or 147px
 * crop with a gaussian blur baked in. `import-blog.ts` and `migrate-blog-images.ts`
 * uploaded that `src` verbatim, so ~100 body images across the older posts are
 * stored in Sanity at 147x83 and rendered into a 740px slot. That is the blur.
 *
 * WHY IT IS RECOVERABLE
 * A Wix placeholder URL still names the same media id, and stripping the
 * `/v1/<transform>/` segment makes Wix serve the full-resolution upload (see
 * src/lib/wixImage.ts). So the repair is: find the original URL, strip the
 * transform, re-upload, re-point the reference. Three ways to find that URL,
 * best first:
 *
 *   1. The old Wix site, which is STILL LIVE at www.fruition-services.io and
 *      still serving originals. Pass it with `--source-base`. This is where
 *      essentially every recovery comes from — 166 of them, including 89 of
 *      the ~90 placeholders. Nothing else comes close, so use it.
 *   2. `coverImageUrl` — the migration kept the Wix URL on 214 posts. Covers only.
 *   3. An archived copy of the post page (Wayback, then Common Crawl). Neither
 *      captured the affected posts: they were live on Wix about five weeks and
 *      the crawlers did not visit them in that window. Kept as a fallback for
 *      the day the origin goes away.
 *
 * That last point is the risk worth knowing: if www.fruition-services.io is
 * ever taken down before this has run, those ~90 originals are gone for good.
 *
 * SAFETY
 * Read-only by default. A replacement is only written when the re-fetched image
 * decodes and is meaningfully wider than what is already there, so a failed
 * recovery can never downgrade a post. Alt text, captions and `_key`s are
 * preserved — only `asset._ref` moves.
 *
 * USAGE
 *   # audit only — no writes, no credentials
 *   npx tsx scripts/fix-blurry-blog-images.ts
 *
 *   # the real repair, against the still-live Wix origin
 *   npx tsx scripts/fix-blurry-blog-images.ts --apply \
 *     --source-base https://www.fruition-services.io
 *
 *   # rehearse one post first
 *   npx tsx scripts/fix-blurry-blog-images.ts --plan \
 *     --source-base https://www.fruition-services.io --only ai-call-recording-apps
 *
 * FLAGS
 *   --plan | --apply     resolve replacements / also write them (default: audit only)
 *   --only <slug>        restrict to one post
 *   --target <px>        width a blog image needs to be sharp (default 1480 = 740 @2x)
 *   --limit <n>          stop after n posts that need work
 *   --source-base <url>  scrape this origin instead of the archives (see above)
 *   --before <YYYYMMDD>  newest archive snapshot to consider (default 20260520)
 *   --snapshots <n>      captures to try per host, newest first (default 6)
 *   --no-common-crawl    skip the Common Crawl fallback
 *   --cc-indexes <n>     Common Crawl crawls to search (default 4)
 *   --delay <ms>         pause between upstream requests (default 1200)
 *   --report <path>      write the full findings as JSON
 *
 * Needs SANITY_WRITE_TOKEN in .env.local for --apply; audit only needs read access.
 */
import { parse } from "node-html-parser"
import type { HTMLElement } from "node-html-parser"
import { writeClient } from "./sanity-client.js"
import { imageSize } from "../src/lib/imageSize.js"
import { parseWixMediaUrl, wixOriginalUrl } from "../src/lib/wixImage.js"
import { unlandedPaths, type PatchTargetDoc } from "../src/lib/sanityPatchPath.js"
import { matchArchivedImage } from "../src/lib/archivedImageMatch.js"

// ---------------------------------------------------------------- CLI

const argv = process.argv.slice(2)
const has = (flag: string) => argv.includes(flag)
function opt(flag: string, fallback: string): string {
  const i = argv.indexOf(flag)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}

if (has("--help") || has("-h")) {
  console.log(
    [
      "fix-blurry-blog-images — re-fetch blog images that were scraped at placeholder size",
      "",
      "  --plan | --apply     resolve replacements / also write them (default: audit only)",
      "  --only <slug>        restrict to one post",
      "  --target <px>        sharpness target (default 1480 = the 740px slot at 2x)",
      "  --limit <n>          stop after n posts that need work",
      "  --source-base <url>  scrape this origin instead of the Wayback Machine",
      "  --before <YYYYMMDD>  newest archive snapshot to consider (default 20260520)",
      "  --snapshots <n>      captures to try per host, newest first (default 6)",
      "  --no-common-crawl    skip the Common Crawl fallback",
      "  --cc-indexes <n>     Common Crawl crawls to search (default 4)",
      "  --delay <ms>         pause between upstream requests (default 1200)",
      "  --report <path>      write the full findings as JSON",
    ].join("\n"),
  )
  process.exit(0)
}

const APPLY = has("--apply")
const PLAN = APPLY || has("--plan")
const ONLY = opt("--only", "")
const TARGET = Number(opt("--target", "1480"))
const LIMIT = Number(opt("--limit", "0"))
const SOURCE_BASE = opt("--source-base", "").replace(/\/+$/, "")
// The last date the Wix site is *known* to have been serving: the scraper that
// created these placeholders ran against it on 2026-05-19. The previous default
// of 20260301 predated the affected posts entirely (published 2026-04-11), so
// no capture could ever match and every one of them reported "no archived copy".
const BEFORE = opt("--before", "20260520")
const SNAPSHOTS = Number(opt("--snapshots", "6"))
const NO_CC = has("--no-common-crawl")
const CC_INDEXES = Number(opt("--cc-indexes", "4"))
const CC_RECORDS = Number(opt("--cc-records", "2"))
const DELAY = Number(opt("--delay", "1200"))
const REPORT = opt("--report", "")

/** The blog body column is 740px wide; below that an image is soft even at 1x. */
const SLOT_WIDTH = 740

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------- types

interface SanityImage {
  assetId: string | null
  width: number | null
  height: number | null
  filename: string | null
}
interface BodyImage extends SanityImage {
  key: string
  alt: string | null
}
interface Post {
  _id: string
  slug: string | null
  title: string | null
  coverImageUrl: string | null
  cover: SanityImage | null
  bodyImages: BodyImage[] | null
}

type SlotKind = "cover" | "body"

interface Slot {
  kind: SlotKind
  /** Position among the post's body images, 1-based, as the scraper saw them. */
  index: number
  key?: string
  alt: string
  width: number
  height: number
  filename: string | null
  /** Sanity patch path for this slot's asset reference. */
  path: string
}

interface Finding extends Slot {
  postId: string
  slug: string
  candidateUrl?: string
  candidateWidth?: number
  outcome: "sharp" | "unresolved" | "no-better-source" | "fetch-failed" | "replaceable" | "replaced"
  note?: string
}

// ---------------------------------------------------------------- helpers

/**
 * `<slug>-body-7` / `<slug>-img-3` — the scrapers numbered each body image in
 * page order, which survives even when the blocks were later reshuffled. Falls
 * back to the block's position in the body array.
 */
function scrapeIndex(filename: string | null, fallback: number): number {
  const n = filename ? /-(?:body|img)-(\d+)$/.exec(filename)?.[1] : null
  return n ? Number(n) : fallback
}

/** Every body-image slot plus the cover, as uniform records. */
function slotsFor(post: Post): Slot[] {
  const slots: Slot[] = []
  if (post.cover?.assetId && post.cover.width) {
    slots.push({
      kind: "cover",
      index: 0,
      alt: "",
      width: post.cover.width,
      height: post.cover.height ?? 0,
      filename: post.cover.filename,
      path: "coverImage.asset._ref",
    })
  }
  ;(post.bodyImages ?? []).forEach((img, i) => {
    if (!img.assetId || !img.width) return
    slots.push({
      kind: "body",
      index: scrapeIndex(img.filename, i + 1),
      key: img.key,
      alt: img.alt ?? "",
      width: img.width,
      height: img.height ?? 0,
      filename: img.filename,
      path: `body[_key=="${img.key}"].asset._ref`,
    })
  })
  return slots
}

// ---------------------------------------------------------------- upstream

interface ArchivedPage {
  url: string
  cover: string | null
  body: { src: string; alt: string }[]
}

async function getHtml(url: string): Promise<HTMLElement | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "FruitionBlogImageRepair/1.0 (+https://fruitionservices.io)" },
      signal: AbortSignal.timeout(45000),
      redirect: "follow",
    })
    if (!res.ok) return null
    return parse(await res.text()) as unknown as HTMLElement
  } catch {
    return null
  }
}

/**
 * Wayback captures of a URL at or before --before, newest first.
 *
 * Several are returned rather than just the newest because the exact date the
 * site left Wix is not known: a capture taken after it carries the *new*
 * site's markup, whose images are the blurry Sanity ones we are replacing.
 * The caller walks the list until a capture actually contains Wix media, so a
 * too-late cutoff costs a wasted fetch instead of a wrong answer.
 */
async function waybackSnapshots(pageUrl: string): Promise<string[]> {
  const cdx =
    "https://web.archive.org/cdx/search/cdx" +
    `?url=${encodeURIComponent(pageUrl)}` +
    `&output=json&filter=statuscode:200&filter=mimetype:text/html` +
    `&to=${BEFORE}&collapse=digest&limit=-${SNAPSHOTS}`
  try {
    const res = await fetch(cdx, { signal: AbortSignal.timeout(45000) })
    if (!res.ok) return []
    const rows = (await res.json()) as string[][]
    // CDX returns oldest first; `id_` gives the original bytes, without
    // Wayback's URL rewriting, so the wixstatic URLs are still the real ones.
    return rows
      .slice(1)
      .map(([, timestamp]) => `https://web.archive.org/web/${timestamp}id_/${pageUrl}`)
      .reverse()
  } catch {
    return []
  }
}

/**
 * Hosts the blog may have been archived under.
 *
 * CDX keys a capture by its exact host, so `www.` and the apex are separate
 * lookups — asking for only one of them reports "no archived copy" for pages
 * that were captured under the other.
 */
const ARCHIVE_HOSTS = ["https://www.fruitionservices.io", "https://fruitionservices.io"]

/**
 * One domain-wide CDX sweep, logged before the per-post work starts.
 *
 * Answers the question a run of "no archived copy" lines cannot: is the blog
 * absent from the archive entirely, or were we asking under the wrong host?
 */
async function cdxRows(query: string): Promise<string[][] | null> {
  try {
    const res = await fetch(`https://web.archive.org/cdx/search/cdx?${query}`, {
      signal: AbortSignal.timeout(60000),
    })
    if (!res.ok) {
      console.log(`  CDX returned ${res.status}`)
      return null
    }
    const text = await res.text()
    if (!text.trim()) return []
    return (JSON.parse(text) as string[][]).slice(1)
  } catch (err) {
    console.log(`  CDX lookup failed — ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

async function reportArchiveCoverage(): Promise<void> {
  const domain = `url=${encodeURIComponent("fruitionservices.io")}&matchType=domain&output=json&to=${BEFORE}`

  // Two queries, because one number cannot tell "never archived" apart from
  // "archived, but my filter was wrong".
  const all = await cdxRows(`${domain}&collapse=urlkey&fl=original,timestamp&limit=5000`)
  await sleep(DELAY)
  const posts = all?.filter(([original]) => original?.includes("/post/")) ?? []

  if (all === null) {
    console.log("archive coverage: unknown — the sweep itself failed, treat misses below as inconclusive")
    return
  }
  console.log(
    `archive coverage: ${all.length} distinct URLs archived on the domain at or before ${BEFORE}, ` +
      `${posts.length} of them blog posts`,
  )
  for (const [original, timestamp] of posts.slice(0, 5)) {
    console.log(`  e.g. ${timestamp}  ${original}`)
  }
  if (all.length === 0) {
    console.log("  → nothing from this domain is in the archive at all")
  } else if (posts.length === 0) {
    console.log("  → the domain was crawled but never a /post/ page; body images are unrecoverable from the archive")
  }
}

/** Candidate captures of a post, newest first, across every host spelling. */
async function findSnapshots(slug: string): Promise<string[]> {
  const out: string[] = []
  for (const host of ARCHIVE_HOSTS) {
    out.push(...(await waybackSnapshots(`${host}/post/${slug}`)))
    await sleep(DELAY)
  }
  return out
}

/** Wix wraps images in <wow-image data-image-info='{"imageData":{"uri":"…"}}'>. */
function wowImageUri(el: HTMLElement): string | null {
  const raw = el.getAttribute("data-image-info")
  if (!raw) return null
  try {
    const info = JSON.parse(raw) as { imageData?: { uri?: string } }
    const uri = info.imageData?.uri
    return uri ? `https://static.wixstatic.com/media/${uri}` : null
  } catch {
    return null
  }
}

function bodyContainer(root: HTMLElement): HTMLElement | null {
  return (
    root.querySelector('[data-hook="post-description"]') ||
    root.querySelector(".post-description") ||
    root.querySelector('[class*="post-description"]') ||
    root.querySelector('[data-hook="post-content"]') ||
    root.querySelector("article") ||
    null
  )
}

/** Pull the cover and the ordered body images out of an archived Wix post page. */
/** Read one captured page. Returns null when it holds no Wix media at all. */
async function readWixPage(target: string): Promise<ArchivedPage | null> {
  const root = await getHtml(target)
  if (!root) return null
  return parseWixDoc(root, target)
}

function parseWixDoc(root: HTMLElement, target: string): ArchivedPage | null {
  const og = root.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? ""
  const container = bodyContainer(root)
  const body: { src: string; alt: string }[] = []
  const seen = new Set<string>()

  if (container) {
    for (const el of container.querySelectorAll("img, wow-image")) {
      const raw =
        (el.tagName?.toLowerCase() === "wow-image" ? wowImageUri(el) : null) ??
        el.getAttribute("src") ??
        el.getAttribute("data-src") ??
        el.getAttribute("data-pin-media") ??
        ""
      const parsed = parseWixMediaUrl(raw)
      if (!parsed) continue
      if (seen.has(parsed.original)) continue
      seen.add(parsed.original)
      body.push({ src: parsed.original, alt: el.getAttribute("alt") ?? "" })
    }
  }

  // wixOriginalUrl() deliberately passes non-Wix URLs through untouched, so it
  // cannot be used as the "is this a Wix page" test: a capture taken after the
  // migration has a cdn.sanity.io og:image and would sail through.
  const cover = parseWixMediaUrl(og)?.original ?? null
  // A capture taken after the site left Wix parses fine but carries only
  // cdn.sanity.io URLs, which is exactly what we are replacing. Treat it as a
  // miss so the caller falls back to an older capture.
  if (!cover && body.length === 0) return null
  return { url: target, cover, body }
}

// ------------------------------------------------- Common Crawl (2nd archive)

/**
 * The Wayback Machine is not the only archive, and it missed the posts that
 * matter here — they were only live on Wix for about five weeks. Common Crawl
 * runs its own monthly crawls with an independent index, so a page Wayback
 * never visited may still exist there.
 */
let ccIndexes: string[] | null = null

async function commonCrawlIndexes(): Promise<string[]> {
  if (ccIndexes) return ccIndexes
  try {
    const res = await fetch("https://index.commoncrawl.org/collinfo.json", {
      signal: AbortSignal.timeout(45000),
    })
    if (!res.ok) {
      ccIndexes = []
      return ccIndexes
    }
    const all = (await res.json()) as { id: string; "cdx-api": string; from?: string; to?: string }[]
    // Only crawls that ran while the site was still on Wix are any use: a later
    // crawl captured the Sanity site, whose images are the ones we are
    // replacing. collinfo.json carries each crawl's window, so use it rather
    // than guessing from the CC-MAIN-<year>-<week> name.
    const cutoff = `${BEFORE.slice(0, 4)}-${BEFORE.slice(4, 6)}-${BEFORE.slice(6, 8)}`
    const dated = all.filter((c) => (c.from ?? c.to ?? "") && (c.from ?? c.to!) <= cutoff)
    // Newest-first: the closest crawl before the migration is the best match.
    const chosen = (dated.length ? dated : all).slice(0, CC_INDEXES)
    console.log(`  common crawl: searching ${chosen.map((c) => c.id).join(", ") || "nothing"}`)
    ccIndexes = chosen.map((c) => c["cdx-api"])
    return ccIndexes
  } catch {
    ccIndexes = []
    return ccIndexes
  }
}

interface CcRecord {
  filename: string
  offset: string
  length: string
  status?: string
  mime?: string
}

/** Fetch the exact WARC byte range for a record and return its HTML body. */
async function commonCrawlBody(rec: CcRecord): Promise<string | null> {
  const start = Number(rec.offset)
  const end = start + Number(rec.length) - 1
  try {
    const res = await fetch(`https://data.commoncrawl.org/${rec.filename}`, {
      headers: { Range: `bytes=${start}-${end}` },
      signal: AbortSignal.timeout(60000),
    })
    if (!res.ok) return null
    const gz = Buffer.from(await res.arrayBuffer())
    const { gunzipSync } = await import("node:zlib")
    const raw = gunzipSync(gz).toString("utf8")
    // WARC header, blank line, HTTP header, blank line, then the body.
    const i = raw.indexOf("\r\n\r\n")
    if (i < 0) return null
    const j = raw.indexOf("\r\n\r\n", i + 4)
    return j < 0 ? null : raw.slice(j + 4)
  } catch {
    return null
  }
}

async function commonCrawlPage(slug: string): Promise<ArchivedPage | null> {
  for (const api of await commonCrawlIndexes()) {
    for (const host of ARCHIVE_HOSTS) {
      const url = `${api}?url=${encodeURIComponent(`${host}/post/${slug}`)}&output=json`
      await sleep(DELAY)
      let lines: string[]
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(45000) })
        // 404 is the index saying "not in this crawl" — normal, not an error.
        if (!res.ok) continue
        lines = (await res.text()).split("\n").filter(Boolean)
      } catch {
        continue
      }
      for (const line of lines.slice(-CC_RECORDS)) {
        let rec: CcRecord
        try {
          rec = JSON.parse(line) as CcRecord
        } catch {
          continue
        }
        if (rec.status && rec.status !== "200") continue
        await sleep(DELAY)
        const html = await commonCrawlBody(rec)
        if (!html) continue
        const page = parseWixDoc(parse(html) as unknown as HTMLElement, `commoncrawl:${rec.filename}`)
        if (page) return page
      }
    }
  }
  return null
}

async function fetchArchivedPage(slug: string, deep: boolean): Promise<ArchivedPage | null> {
  if (SOURCE_BASE) {
    await sleep(DELAY)
    return readWixPage(`${SOURCE_BASE}/post/${slug}`)
  }

  for (const target of await findSnapshots(slug)) {
    await sleep(DELAY)
    const page = await readWixPage(target)
    if (page) return page
  }
  // Common Crawl costs several requests per post, so it is reserved for the
  // posts that actually hold placeholder scrapes rather than merely soft images.
  if (NO_CC || !deep) return null
  const cc = await commonCrawlPage(slug)
  if (cc) console.log(`  found in Common Crawl: ${cc.url}`)
  return cc
}

/** Pick the archived image that belongs to a slot: alt text first, then order. */
function matchArchived(slot: Slot, page: ArchivedPage, taken: Set<string>): string | null {
  if (slot.kind === "cover") return page.cover
  return matchArchivedImage({ index: slot.index, alt: slot.alt }, page.body, taken)
}

interface Downloaded {
  bytes: Buffer
  mime: string
  width: number
  height: number
}

/** Fetch a candidate and read its real dimensions before anything is written. */
/**
 * Run an upstream call, retrying a couple of times with backoff.
 *
 * Returns null once it has genuinely failed, so a single bad image can never
 * abort a run that still has dozens of posts to repair.
 */
async function withRetry<T>(fn: () => Promise<T>, what: string, attempts = 3): Promise<T | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (i === attempts) {
        console.log(`  ! ${what} failed after ${attempts} attempts — ${msg}`)
        return null
      }
      const wait = DELAY * i * 2
      console.log(`  … ${what} failed (${msg}); retrying in ${wait}ms`)
      await sleep(wait)
    }
  }
  return null
}

async function download(url: string): Promise<Downloaded | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent": "FruitionBlogImageRepair/1.0 (+https://fruitionservices.io)",
      },
      signal: AbortSignal.timeout(60000),
      redirect: "follow",
    })
    if (!res.ok) return null
    const mime = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "image/jpeg"
    if (!mime.startsWith("image/")) return null
    const bytes = Buffer.from(await res.arrayBuffer())
    const size = imageSize(bytes)
    if (!size) return null
    return { bytes, mime, width: size.width, height: size.height }
  } catch {
    return null
  }
}

/**
 * Only swap in a replacement that is a real improvement: strictly wider, and
 * either sharp enough for the slot or a decisive jump. Stops the repair from
 * churning assets for a 5% gain.
 */
function isUpgrade(current: number, next: number): boolean {
  if (next <= current) return false
  return next >= TARGET || next >= current * 1.25
}

// ---------------------------------------------------------------- main

const QUERY = `*[_type == "blogPost" ${ONLY ? "&& slug.current == $only " : ""}] | order(publishedAt asc) {
  _id,
  "slug": slug.current,
  title,
  coverImageUrl,
  "cover": coverImage{
    "assetId": asset._ref,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "filename": asset->originalFilename
  },
  "bodyImages": body[_type == "image"]{
    "key": _key,
    alt,
    "assetId": asset._ref,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "filename": asset->originalFilename
  }
}`

async function main() {
  if (APPLY && !process.env.SANITY_WRITE_TOKEN) {
    throw new Error("--apply needs SANITY_WRITE_TOKEN in .env.local")
  }

  const posts: Post[] = await writeClient.fetch(QUERY, ONLY ? { only: ONLY } : {})
  const mode = APPLY ? "APPLY" : PLAN ? "PLAN" : "AUDIT"
  console.log(`${mode} — ${posts.length} post(s), sharpness target ${TARGET}px\n`)

  // Only meaningful when we are actually going to consult the archive.
  if (PLAN && !SOURCE_BASE) {
    await reportArchiveCoverage()
    console.log()
  }

  const findings: Finding[] = []
  let postsTouched = 0
  let replaced = 0

  for (const post of posts) {
    const slug = post.slug ?? post._id
    const slots = slotsFor(post)
    const degraded = slots.filter((s) => s.width < TARGET)
    for (const s of slots.filter((s) => s.width >= TARGET)) {
      findings.push({ ...s, postId: post._id, slug, outcome: "sharp" })
    }
    if (degraded.length === 0) continue
    if (LIMIT && postsTouched >= LIMIT) break
    postsTouched++

    const worst = Math.min(...degraded.map((s) => s.width))
    console.log(
      `${slug}\n  ${degraded.length}/${slots.length} image(s) under ${TARGET}px (smallest ${worst}px)`,
    )

    if (!PLAN) {
      for (const s of degraded) {
        findings.push({ ...s, postId: post._id, slug, outcome: "unresolved", note: "audit only" })
      }
      continue
    }

    // One archive fetch per post, and only when something actually needs it.
    const needsArchive = degraded.some((s) => s.kind === "body" || !post.coverImageUrl)
    // A sub-400px slot is a real placeholder scrape, worth the deeper search.
    const deep = degraded.some((s) => s.width < 400)
    const page = needsArchive ? await fetchArchivedPage(slug, deep) : null
    if (needsArchive && !page) console.log(`  ! no archived copy of /post/${slug}`)

    const patch: Record<string, string> = {}
    // Source URLs already claimed by an earlier slot in this post.
    const taken = new Set<string>()

    for (const slot of degraded) {
      const finding: Finding = { ...slot, postId: post._id, slug, outcome: "unresolved" }
      findings.push(finding)

      const label = slot.kind === "cover" ? "cover" : `body #${slot.index}`
      const stored =
        slot.kind === "cover" && post.coverImageUrl ? wixOriginalUrl(post.coverImageUrl) : null
      const candidate = stored ?? (page ? matchArchived(slot, page, taken) : null)
      if (candidate) taken.add(candidate)

      if (!candidate) {
        console.log(`  - ${label} ${slot.width}px — no source found`)
        continue
      }
      finding.candidateUrl = candidate

      await sleep(DELAY)
      const got = await download(candidate)
      if (!got) {
        finding.outcome = "fetch-failed"
        console.log(`  ! ${label} ${slot.width}px — could not fetch ${candidate}`)
        continue
      }
      finding.candidateWidth = got.width

      if (!isUpgrade(slot.width, got.width)) {
        finding.outcome = "no-better-source"
        console.log(`  = ${label} ${slot.width}px — source is only ${got.width}px, leaving it`)
        continue
      }

      if (!APPLY) {
        finding.outcome = "replaceable"
        console.log(`  ✓ ${label} ${slot.width}px → ${got.width}px available`)
        continue
      }

      const filename = slot.filename ?? `${slug}-${slot.kind}-${slot.index}`
      // An upload that throws used to kill the whole run from main().catch,
      // abandoning every post after it — that is how a real run stopped
      // half-way through australian-standards. Retry the transient case, then
      // give up on this one image and carry on with the rest.
      const asset = await withRetry(
        () => writeClient.assets.upload("image", got.bytes, { filename, contentType: got.mime }),
        `upload ${filename}`,
      )
      if (!asset) {
        finding.outcome = "fetch-failed"
        finding.note = "upload failed"
        console.log(`  ! ${label} — upload failed, skipping`)
        continue
      }
      patch[slot.path] = asset._id
      finding.outcome = "replaced"
      replaced++
      console.log(`  ✓ ${label} ${slot.width}px → ${got.width}px uploaded`)
    }

    if (APPLY && Object.keys(patch).length > 0) {
      // `set` with a key-matched path (body[_key=="…"].asset._ref) silently
      // does nothing if the path matches no node — the commit still succeeds.
      // Read the references back off the returned document so a no-op cannot
      // be reported as a repair.
      const updated = (await withRetry(
        () => writeClient.patch(post._id).set(patch).commit({ returnDocuments: true }),
        `patch ${post._id}`,
      )) as unknown as PatchTargetDoc | null

      if (!updated) {
        // The uploads succeeded but the references did not move. Say so rather
        // than counting them, and leave the rest of the run to continue.
        console.log(`  !! ${post._id} — patch failed, images uploaded but not linked`)
        for (const f of findings) {
          if (f.postId === post._id && f.outcome === "replaced") {
            f.outcome = "fetch-failed"
            f.note = "patch failed"
            replaced--
          }
        }
        continue
      }

      const missed = unlandedPaths(updated, patch)
      console.log(`  → patched ${post._id} (${Object.keys(patch).length - missed.length} image(s))`)
      for (const path of missed) {
        console.log(`  !! ${path} did not take — the reference is unchanged`)
      }
      if (missed.length) {
        // Keep the run going, but do not let the summary claim these as fixed.
        for (const f of findings) {
          if (f.postId === post._id && missed.includes(f.path)) {
            f.outcome = "fetch-failed"
            f.note = "patch did not apply"
            replaced--
          }
        }
      }
    }
  }

  // ------------------------------------------------------------ summary

  const blog = findings.filter((f) => f.outcome !== "sharp")
  const byOutcome = (o: Finding["outcome"]) => blog.filter((f) => f.outcome === o).length
  const belowSlot = blog.filter((f) => f.width < SLOT_WIDTH).length

  console.log("\n─────────────────────────────────────────")
  console.log(`images checked          ${findings.length}`)
  console.log(`under ${TARGET}px target     ${blog.length}`)
  console.log(`  visibly blurry (<${SLOT_WIDTH}px) ${belowSlot}`)
  if (PLAN) {
    console.log(`recoverable             ${byOutcome("replaceable") + byOutcome("replaced")}`)
    console.log(`already the best source ${byOutcome("no-better-source")}`)
    console.log(`fetch failed            ${byOutcome("fetch-failed")}`)
    console.log(`no source found         ${byOutcome("unresolved")}`)
  }
  if (APPLY) console.log(`\nreplaced ${replaced} image(s)`)
  else console.log(`\nno writes made — re-run with --apply once the plan looks right`)

  if (REPORT) {
    const { writeFile } = await import("node:fs/promises")
    await writeFile(
      REPORT,
      JSON.stringify({ target: TARGET, mode, totals: { checked: findings.length, degraded: blog.length, belowSlot }, findings }, null, 2),
    )
    console.log(`report written to ${REPORT}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
