/**
 * Version C content migration: approved mock-up HTML -> Sanity documents.
 *
 *   npx tsx scripts/vc/migrate.ts --mockups <review dir> --slugs monday-for-retail,healthcare [--apply] [--out file.json]
 *
 * Dry run by default: prints what it would write and saves the documents to
 * --out (default scratch JSON). With --apply it uploads the images and
 * createOrReplaces the documents.
 *
 * What it writes, per page:
 * - vcPage-<slug>: path, group, SEO title/description copied from the LIVE
 *   page's <head> (so metadata is unchanged), and one section object per
 *   mock-up <section>.
 * - vcCase-<client> / vcQuote-<name>: shared case studies and quotes, reused
 *   across pages when the content is identical.
 * - FAQ: each question is matched to the central faqItem store by its text.
 *   A match is referenced (and its answer updated to the approved mock-up
 *   wording if that differs); a question with no match becomes a new faqItem
 *   tagged to the page.
 *
 * No copy is retyped: every string comes from the mock-up as approved.
 * Links the mock-up left as "#" are taken from the live page by button label.
 * Unknown section markup aborts that page so nothing is silently dropped.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, resolve, dirname, basename } from 'node:path'
import { parse, type HTMLElement } from 'node-html-parser'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const args = process.argv.slice(2)
const arg = (k: string) => {
  const i = args.indexOf(k)
  return i >= 0 ? args[i + 1] : undefined
}
const APPLY = args.includes('--apply')
const MOCKUPS = resolve(arg('--mockups') ?? '../vc-mockups/review')
const SLUGS = (arg('--slugs') ?? '').split(',').filter(Boolean)
const OUT = arg('--out') ?? `/tmp/vc-migrate-${Date.now()}.json`
const CACHE_FILE = join(dirname(MOCKUPS), 'asset-cache.json')
const LIVE = 'https://www.fruitionservices.io'

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

/** slug -> [live path, group]. Mirrors the page picker in fruition-page-merge.html. */
export const PAGES: Record<string, [string, string]> = {
  'monday-for-construction': ['/monday-for-construction', 'industry'],
  'monday-for-manufacturing': ['/monday-for-manufacturing', 'industry'],
  'monday-for-government': ['/monday-for-government', 'industry'],
  'monday-for-professional-services': ['/monday-for-professional-services', 'industry'],
  'monday-for-real-estate': ['/monday-for-real-estate', 'industry'],
  'financial-services': ['/industries/financial-services', 'industry'],
  'monday-for-retail': ['/monday-for-retail', 'industry'],
  healthcare: ['/industries/healthcare', 'industry'],
  'solar-renewables': ['/industries/solar-renewables', 'industry'],
  'monday-for-marketing': ['/monday-for-marketing', 'industry'],
  'industries-education': ['/industries/education', 'industry'],
  'industries-nonprofits': ['/industries/nonprofits', 'industry'],
  'monday-crm-consulting': ['/monday-crm-consulting', 'msol'],
  'monday-project-management': ['/monday-consulting-solutions/monday-project-management', 'msol'],
  'monday-service': ['/monday-consulting-solutions/monday-service', 'msol'],
  'monday-for-hr': ['/monday-consulting-solutions/monday-for-hr', 'msol'],
  'monday-training': ['/training', 'msol'],
  'monday-implementation-consultants': ['/monday-implementation-consultants', 'msol'],
  partnerships: ['/partnerships', 'partner'],
  'openai-chatgpt-partner': ['/partnerships/openai-chatgpt-partner', 'partner'],
  'anthropic-claude-partner': ['/partnerships/anthropic-claude-partner', 'partner'],
  'gemini-partner': ['/partnerships/google-gemini-vertex-ai-partner', 'partner'],
  'openclaw-partner': ['/partnerships/openclaw-partner', 'partner'],
  'vapi-partner': ['/partnerships/vapi-partner', 'partner'],
  'monday-consulting-partner': ['/partnerships/monday-consulting-partner', 'partner'],
  'atlassian-consulting': ['/atlassian-consulting', 'partner'],
  'hubspot-consulting': ['/hubspot-consulting', 'partner'],
  'clickup-partner': ['/partnerships/certified-clickup-partner', 'partner'],
  'aircall-partner': ['/partnerships/aircall-partner', 'partner'],
  'n8n-integration-partner': ['/partnerships/n8n-integration-partner', 'partner'],
  'make-partners': ['/partnerships/make-partners', 'partner'],
  integrations: ['/integrations', 'partner'],
  'ai-capability-assessment': ['/ai-capability-assessment', 'ai'],
  'ai-consulting': ['/ai-consulting', 'ai'],
  'agent-development': ['/ai-consulting/agent-development', 'ai'],
  'rag-knowledge-systems': ['/ai-consulting/rag-knowledge-systems', 'ai'],
  'governance-and-compliance': ['/ai-consulting/governance-and-compliance', 'ai'],
  'ai-readiness-blueprint': ['/ai-readiness-blueprint', 'ai'],
  'ai-strategy-and-execution': ['/ai-strategy-and-execution', 'ai'],
  'monday-partner-australia': ['/monday-partner-australia', 'region'],
  'monday-partner-uk': ['/monday-partner-uk', 'region'],
  'monday-partner-us': ['/monday-partner-us', 'region'],
  'monday-partner-singapore': ['/monday-partner-singapore', 'region'],
  'monday-partner-india': ['/monday-partner-india', 'region'],
  'monday-partner-philippines': ['/monday-partner-philippines', 'region'],
  'about-us': ['/about-us', 'company'],
  'fruition-team': ['/fruition-team', 'company'],
  careers: ['/careers', 'company'],
  'certifications-and-awards': ['/certifications-and-awards', 'company'],
  'customer-testimonials': ['/customer-testimonials', 'company'],
  'consulting-blog': ['/consulting-blog', 'company'],
  faqs: ['/faqs', 'company'],
  'contact-us': ['/contact-us', 'company'],
  pricing: ['/implementation-packages', 'core'],
  'ai-use-cases': ['/ai-use-cases', 'core'],
  'ask-fruit': ['/ask-fruit', 'core'],
  home: ['/', 'core'],
  // 14 Nov 2026: pages the 11 Nov rollout missed, mock-ups approved by Edward (review-v3)
  'aws-partner': ['/partnerships/aws-partner', 'partner'],
  'google-cloud-partner': ['/partnerships/google-cloud-partner', 'partner'],
  'microsoft-azure-partner': ['/partnerships/microsoft-azure-partner', 'partner'],
  'microsoft-copilot-partner': ['/partnerships/microsoft-copilot-partner', 'partner'],
  'supabase-partner': ['/partnerships/supabase-partner', 'partner'],
  'clay-partner': ['/partnerships/clay-partner', 'partner'],
  'elevenlabs-partner': ['/partnerships/elevenlabs-partner', 'partner'],
  'hootsuite-delivery-partner': ['/partnerships/hootsuite-delivery-partner', 'partner'],
  'int-twilio': ['/integrations/twilio', 'partner'],
  'int-zapier': ['/integrations/zapier', 'partner'],
  'ai-customer-service': ['/ai-consulting/customer-service', 'ai'],
  'ai-marketing-automation': ['/ai-consulting/marketing-automation', 'ai'],
  'ai-operations-back-office': ['/ai-consulting/operations-back-office', 'ai'],
  'ai-sales-outbound': ['/ai-consulting/sales-outbound', 'ai'],
}

/* ------------------------------------------------------------- helpers */

const key = () => createHash('md5').update(String(Math.random())).digest('hex').slice(0, 12)
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

function decode(s: string): string {
  const named: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', rsquo: '\u2019', lsquo: '\u2018',
    rdquo: '\u201d', ldquo: '\u201c', middot: '\u00b7', hellip: '\u2026', times: '\u00d7', rarr: '\u2192',
    larr: '\u2190', copy: '\u00a9', reg: '\u00ae', trade: '\u2122', bull: '\u2022', deg: '\u00b0', pound: '\u00a3',
    euro: '\u20ac', eacute: '\u00e9', check: '\u2713',
  }
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m)
}

/** Text with accent spans / <em> turned into *asterisks*; other markup dropped. */
function rich(el: HTMLElement | null | undefined): string {
  if (!el) return ''
  let h = el.innerHTML
  h = h.replace(/<svg[\s\S]*?<\/svg>/g, '')
  h = h.replace(/<span class="acc">([\s\S]*?)<\/span>/g, '*$1*').replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
  h = h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')
  return decode(h).replace(/[ \t\n\r]+/g, ' ').trim()
}
const text = (el: HTMLElement | null | undefined) => (el ? decode(el.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')).replace(/[ \t\n\r]+/g, ' ').trim() : '')
const cls = (el: HTMLElement | null | undefined) => (el?.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)
const has = (el: HTMLElement | null | undefined, c: string) => cls(el).includes(c)
const dashCheck = (s: string, where: string) => {
  if (/[\u2013\u2014]/.test(s)) warnings.push(`dash in ${where}: ${s.slice(0, 80)}`)
}
const warnings: string[] = []

/* -------------------------------------------------------------- images */

const assetCache: Record<string, string> = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf8')) : {}
const pendingUploads: { file: string; buf: Buffer; name: string }[] = []

function imageFromSrc(src: string | undefined, pageFile: string, alt?: string) {
  if (!src) return undefined
  let buf: Buffer
  let name: string
  if (src.startsWith('data:')) {
    const m = src.match(/^data:([^;,]+)(;base64)?,(.*)$/s)
    if (!m) return undefined
    buf = m[2] ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]))
    name = `inline-${createHash('sha1').update(buf).digest('hex').slice(0, 10)}.${(m[1].split('/')[1] ?? 'png').replace('svg+xml', 'svg')}`
  } else {
    const file = resolve(dirname(pageFile), src.split('?')[0])
    if (!existsSync(file)) {
      warnings.push(`missing image ${src}`)
      return undefined
    }
    buf = readFileSync(file)
    name = basename(file)
  }
  const hash = createHash('sha1').update(buf).digest('hex')
  if (!assetCache[hash]) pendingUploads.push({ file: hash, buf, name })
  return { _type: 'image', asset: { _type: 'reference', _ref: `__asset:${hash}` }, ...(alt ? { alt } : {}) }
}

async function uploadAll() {
  const uniq = new Map(pendingUploads.map((p) => [p.file, p]))
  let i = 0
  for (const p of uniq.values()) {
    if (assetCache[p.file]) continue
    const doc = await client.assets.upload('image', p.buf, { filename: p.name })
    assetCache[p.file] = doc._id
    if (++i % 10 === 0) console.log(`  uploaded ${i}/${uniq.size}`)
  }
  writeFileSync(CACHE_FILE, JSON.stringify(assetCache, null, 1))
}

/** Replace the __asset:<sha1> placeholders with real asset ids. */
function resolveAssets<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value).replace(/"__asset:([0-9a-f]{40})"/g, (_m, h) => {
      const id = assetCache[h]
      if (!id && APPLY) throw new Error(`asset ${h} not uploaded`)
      return JSON.stringify(id ?? `image-${h}-1x1-png`)
    }),
  )
}

/* ---------------------------------------------------- shared documents */

type Doc = Record<string, unknown> & { _id: string; _type: string }
const sharedDocs = new Map<string, Doc>()
let practitionerSig: string | undefined
let practitionerShared: Record<string, unknown> | undefined
const faqPatches: { id: string; answer: unknown[]; was: string; now: string }[] = []
const newFaqs: Doc[] = []
let liveFaqs: { _id: string; question?: string; pages?: string[]; answer?: { children?: { text?: string }[] }[] }[] = []

/** Shared docs already in Sanity, so a partial run never repoints another page's reference. */
let existingShared = new Map<string, string>()
const SYS = new Set(['_key', '_id', '_type', '_rev', '_createdAt', '_updatedAt'])
/** Canonical JSON: sorted keys, system fields dropped, so Sanity's key order never matters. */
function canon(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`
  if (v && typeof v === 'object')
    return `{${Object.keys(v).filter((k) => !SYS.has(k) && (v as Record<string, unknown>)[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canon((v as Record<string, unknown>)[k])}`).join(',')}}`
  return JSON.stringify(v)
}
/**
 * Same client, same content: one document, reused by every page. Same client,
 * different content (e.g. a page tuned the summary): a second document whose
 * id carries a hash of its content, so ids are stable across partial runs.
 */
function upsertShared(prefix: string, base: string, doc: Omit<Doc, '_id'>): string {
  const sig = canon(doc)
  const baseId = `${prefix}-${base}`
  const taken = sharedDocs.get(baseId)
  const takenSig = taken ? canon(taken) : existingShared.get(baseId)
  const id = !takenSig || takenSig === sig ? baseId : `${baseId}-${createHash('md5').update(sig).digest('hex').slice(0, 6)}`
  if (!sharedDocs.has(id)) sharedDocs.set(id, { _id: id, ...doc } as Doc)
  return id
}

const normQ = (s: string) => s.toLowerCase().replace(/[\u2010-\u2015.-]/g, ' ').replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim()
/** Answer text with typography and list numbering ignored: only a real wording change triggers a patch. */
const normA = (s: string) =>
  s.replace(/[\u200b-\u200f\ufeff]/g, '').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
    .replace(/(^|\n)\s*\d+\.\s+/g, '$1').replace(/\s+/g, ' ').trim().toLowerCase()
const ptText = (a?: { children?: { text?: string }[] }[]) => (a ?? []).map((b) => (b.children ?? []).map((c) => c.text ?? '').join('')).join('\n\n')

function answerBlocks(el: HTMLElement): unknown[] {
  const ps = el.querySelectorAll('p')
  const paras = ps.length ? ps.map((p) => text(p)) : [text(el)]
  return paras.filter(Boolean).map((t) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text: t, marks: [] }],
  }))
}

function faqRef(q: string, ansEl: HTMLElement, tabLabel: string, pageKey: string, ownTab: boolean) {
  dashCheck(q, 'faq question')
  const blocks = answerBlocks(ansEl)
  const now = ptText(blocks as never)
  dashCheck(now, 'faq answer')
  const match = liveFaqs.find((f) => f.question && normQ(f.question) === normQ(q) && !f._id.startsWith('faqItem-vc-p-'))
  if (match) {
    const was = ptText(match.answer)
    // Only the page's own tab was edited for the mock-up; related tabs were copied verbatim.
    if (ownTab && normA(was) !== normA(now)) {
      const onlyHere = (match.pages ?? []).every((p) => p === pageKey || p === 'faqs')
      if (!onlyHere) {
        // Shared question whose wording this page changed: give the page its
        // own copy so other pages keep the wording their mock-ups show.
        const cid = `faqItem-vc-p-${createHash('md5').update(pageKey + normQ(q)).digest('hex').slice(0, 10)}`
        if (!newFaqs.some((d) => d._id === cid)) newFaqs.push({ _id: cid, _type: 'faqItem', question: q, answer: blocks, category: tabLabel, pages: [pageKey] })
        return { _type: 'reference', _ref: cid, _key: key() }
      }
      if (!faqPatches.some((p) => p.id === match._id)) faqPatches.push({ id: match._id, answer: blocks, was, now })
    }
    return { _type: 'reference', _ref: match._id, _key: key() }
  }
  const id = `faqItem-vc-${createHash('md5').update(normQ(q)).digest('hex').slice(0, 10)}`
  if (!newFaqs.some((d) => d._id === id)) {
    newFaqs.push({ _id: id, _type: 'faqItem', question: q, answer: blocks, category: tabLabel, pages: [pageKey] })
    liveFaqs.push({ _id: id, question: q, answer: blocks as never })
  }
  return { _type: 'reference', _ref: id, _key: key() }
}

/* ----------------------------------------------------- use case catalogue */

let useCases: { slug: string; id: string; title: string }[] | null = null
function useCaseByTitle(title: string) {
  if (!useCases) {
    const dir = 'public/data/ai-use-cases'
    const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8')) as { industries: { slug: string }[] }
    useCases = index.industries.flatMap((i) =>
      (JSON.parse(readFileSync(join(dir, `${i.slug}.json`), 'utf8')).useCases as { id: string; title: string }[]).map((u) => ({ slug: i.slug, id: u.id, title: u.title })),
    )
  }
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  return useCases.find((u) => n(u.title) === n(title))
}

/* ------------------------------------------------------------ sections */

interface Ctx {
  scripts: string[]
  /** Use case catalogue industry of this page, learned from its "See the build" cards. */
  catalogueSlug?: string
  slug: string
  file: string
  path: string
  live: HTMLElement | null
}

/** Labels whose target is fixed site-wide, for buttons the live page does not carry. */
const KNOWN_LINKS: Record<string, string> = {
  'see pricing': '/implementation-packages',
  // Partner directory tiles whose mock-up link was a placeholder.
  openai: '/partnerships/openai-chatgpt-partner',
  'monday.com': '/partnerships/monday-consulting-partner',
  atlassian: '/atlassian-consulting',
  langgraph: '/ai-consulting/agent-development',
  'monday.com platinum partner': '/partnerships/monday-consulting-partner',
  'google cloud': '/partnerships/google-cloud-partner',
  aws: '/partnerships/aws-partner',
}

function liveHref(ctx: Ctx, label: string): string | undefined {
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9.+ ]+/g, ' ').replace(/\s+/g, ' ').trim()
  const want = norm(label)
  // In-page anchors of the old layout (#services) mean nothing on the new page; #book does.
  const a = ctx.live?.querySelectorAll('a').find((x) => norm(text(x)) === want && !/^#(?!book$)/.test(x.getAttribute('href') ?? ''))
  const href = a?.getAttribute('href') ?? KNOWN_LINKS[want]
  // The booking band is on the page itself; in-page anchors scroll instead of leaving.
  return href === '/contact-us#book' ? '#book' : href
}

function cta(a: HTMLElement, ctx: Ctx) {
  const label = text(a.querySelector('.roll > span') ?? a)
  let href = a.getAttribute('href') ?? ''
  if (href === '#' || !href) {
    const found = liveHref(ctx, label)
    if (!found) warnings.push(`${ctx.slug}: no live link for button "${label}"`)
    href = found ?? '#book'
  }
  const c = cls(a)
  const style = c.includes('outline') ? 'outline' : c.includes('inverse') ? 'inverse' : c.includes('ghost') ? 'ghost' : 'primary'
  return { _type: 'vcCta', _key: key(), label, href, style, arrow: !!a.querySelector('svg') }
}

function headOf(sec: HTMLElement) {
  const h = sec.querySelector('.shead')
  if (!h) return undefined
  return {
    _type: 'vcHead',
    badge: text(h.querySelector('.badge')) || undefined,
    heading: rich(h.querySelector('h2')) || undefined,
    lead: text(h.querySelector('.lead')) || undefined,
  }
}

function logo(img: HTMLElement, ctx: Ctx) {
  const alt = decode(img.getAttribute('alt') ?? '')
  return { _type: 'vcLogo', _key: key(), image: imageFromSrc(img.getAttribute('src'), ctx.file), alt, shape: cls(img).join(' ') || undefined }
}

const tone = (sec: HTMLElement) => (has(sec, 'alt') ? 'alt' : 'plain')
/** Section classes beyond the ones the renderer sets itself. */
const RENDERER_CLASSES = new Set(['alt', 'hero', 'cta-band', 'book-sec', 'closing', 'on-dark'])
const secClass = (sec: HTMLElement) => cls(sec).filter((c) => !RENDERER_CLASSES.has(c)).join(' ') || undefined

function hero(sec: HTMLElement, ctx: Ctx) {
  const left = (sec.querySelector('.hero-grid > div') ?? sec.querySelector('.hc-in'))!
  const art = sec.querySelector('.hero-art') ?? (sec.querySelector('.frame.hc-shot') ? sec.querySelector('.wrap') : null)
  const s: Record<string, unknown> = {
    _type: 'vcHero',
    _key: key(),
    variant: cls(sec).filter((c) => c !== 'hero').join(' ') || undefined,
    badge: text(left.querySelector('.badge')) || undefined,
    heading: rich(left.querySelector('h1')),
    lead: text(left.querySelector('.lead')) || undefined,
    ctas: left.querySelectorAll('.ctas a').map((a) => cta(a, ctx)),
  }
  const stageEl = art && has(art, 'hn-wrap') ? art : null
  if (stageEl) {
    s.stageClass = cls(stageEl).join(' ')
    s.stage = toNodes(stageEl, ctx)
  }
  const img3d = art?.querySelector('img.hero-3d')
  if (img3d) {
    s.art = imageFromSrc(img3d.getAttribute('src'), ctx.file)
    s.artClass = cls(img3d).filter((c) => c !== 'hero-3d').join(' ') || undefined
  }
  const badges = art?.querySelectorAll('.ph-badge img') ?? []
  if (badges.length) {
    s.floatBadges = badges.map((b) => logo(b, ctx))
    s.floatBadgeClass = cls(art!.querySelector('.ph-badge')).filter((c) => c !== 'ph-badge').join(' ') || undefined
  }
  const frame = art?.querySelector('.frame')
  if (frame) {
    s.creds = frame.querySelectorAll('.creds img').map((i) => logo(i, ctx))
    const shot = frame.querySelectorAll('img').find((i) => !i.closest('.creds'))
    const artSvg = frame.querySelector('.art svg')
    if (artSvg && !shot) {
      s.frameSvg = artSvg.outerHTML
      s.frameSvgAria = decode(frame.querySelector('.art')?.getAttribute('aria-label') ?? '') || undefined
      s.frameClass = cls(frame).filter((c) => c !== 'frame').join(' ') || undefined
      s.credsClass = cls(frame.querySelector('.creds')).filter((c) => c !== 'creds').join(' ') || undefined
    }
    if (shot) s.frameImage = imageFromSrc(shot.getAttribute('src'), ctx.file, decode(shot.getAttribute('alt') ?? ''))
    s.chipValue = text(frame.querySelector('.chip b')) || undefined
    s.chipLabel = text(frame.querySelector('.chip .label')) || undefined
  }
  const stats = sec.querySelectorAll('.stats .stat')
  if (stats.length)
    s.stats = stats.map((st) => ({ _type: 'vcStat', _key: key(), value: rich(st.querySelector('b')), label: text(st.querySelector('p')) }))
  const trust = sec.querySelector('.hm-trust')
  if (trust && /height:\s*var\(--sec\)/.test(trust.previousElementSibling?.getAttribute('style') ?? '')) s.spacer = true
  if (trust) {
    s.trustLabel = text(trust.querySelector('.hm-trust-h .label')) || undefined
    const run = trust.querySelector('.hm-run')
    s.trustLogos = run?.querySelectorAll('img').map((i) => logo(i, ctx))
  }
  const rmap = art?.querySelector('.rmap')
  const amap = art?.querySelector('.art.map')
  if (rmap || amap) {
    delete s.frameImage; delete s.creds; delete s.chipValue; delete s.chipLabel
    const host = (rmap ?? amap)!
    s.mapKind = rmap ? 'rmap' : 'art'
    s.mapSvg = host.querySelector('svg')!.outerHTML
    s.mapAspect = rmap ? (rmap.getAttribute('style') ?? '').match(/--ar:\s*([\d.]+)/)?.[1] : (amap!.getAttribute('style') ?? '').match(/aspect-ratio:\s*([^;]+)/)?.[1]?.trim()
    s.mapAria = decode(amap?.getAttribute('aria-label') ?? '') || undefined
    if (rmap) s.pins = rmap.querySelectorAll('.pin').map((p) => {
      const st = p.getAttribute('style') ?? ''
      return { _type: 'vcPin', _key: key(), label: text(p.querySelector('b')), left: Number(st.match(/left:\s*([\d.]+)%/)?.[1]), top: Number(st.match(/top:\s*([\d.]+)%/)?.[1]), side: p.getAttribute('data-s') ?? 'r', on: has(p, 'on') }
    })
    if (amap) {
      s.mapFlag = text(amap.querySelector('.maplabel .flag')) || undefined
      const ml = amap.querySelector('.maplabel')
      s.mapLabel = ml ? text(parse(`<b>${ml.innerHTML.replace(ml.querySelector('.flag')?.outerHTML ?? '', '')}</b>`).querySelector('b')) : undefined
    }
  }
  const msg = sec.querySelector('.frame .msg')
  if (msg) {
    delete s.frameImage; delete s.creds; delete s.chipValue; delete s.chipLabel
    const flds = msg.querySelectorAll('.fld')
    const lab = (n: string) => text(flds.find((f) => f.querySelector(`[name=${n}]`))?.querySelector('label'))
    s.form = {
      heading: text(msg.querySelector('h2')), subheading: text(msg.querySelector(':scope > p.small')) || undefined,
      phoneLabel: lab('phone') || undefined, messageLabel: lab('need') || undefined,
      messagePlaceholder: decode(msg.querySelector('textarea')?.getAttribute('placeholder') ?? '') || undefined,
      submitLabel: text(msg.querySelector('button .roll > span')) || undefined, successMessage: text(msg.querySelector('.done p')) || undefined,
    }
  }
  const hs = sec.querySelector('.hsearch input')
  if (hs) {
    s.searchPlaceholder = decode(hs.getAttribute('placeholder') ?? '') || 'Search'
    s.searchClear = !!sec.querySelector('.hsearch .clr')
  }
  const heroFrame = sec.querySelector('.hero-grid > .frame, .hc-in')
  if (!img3d && !frame && !msg && !heroFrame && !sec.querySelector('.inner.dark') && !stageEl) warnings.push(`${ctx.slug}: hero has no 3D graphic or frame`)
  return s
}

function item(card: HTMLElement, ctx: Ctx) {
  const it: Record<string, unknown> = { _type: 'vcItem', _key: key() }
  if (has(card, 'go-card')) {
    // Full-width "see all" card: the whole tile links to the page's industry catalogue.
    it.cardLink = true
    it.title = text(card.querySelector('h3')) || undefined
    it.body = text(card.querySelector('p')) || undefined
    const href = card.getAttribute('href')
    it.href = href && href !== '#' ? href : ctx.catalogueSlug ? `/ai-use-cases/${ctx.catalogueSlug}` : '/ai-use-cases'
    return it
  }
  const shot = card.querySelector('.shot img, .pc2-img img, .pichd img, .w4-img img')
  if (shot) it.image = imageFromSrc(shot.getAttribute('src'), ctx.file, decode(shot.getAttribute('alt') ?? '') || undefined)
  const kids = card.childNodes.filter((n) => (n as HTMLElement).tagName && !['shot', 'pichd', 'pc2-img', 'w4-img'].some((c) => has(n as HTMLElement, c))) as HTMLElement[]
  const num = kids.find((k) => has(k, 'num'))
  if (num) it.num = text(num)
  const hIdx = kids.findIndex((k) => k.tagName === 'H3')
  const first = kids.find((k) => !has(k, 'num'))
  if (first && has(first, 'label')) it.label = text(first)
  const afterTitle = hIdx >= 0 ? kids[hIdx + 1] : undefined
  if (afterTitle && has(afterTitle, 'label') && afterTitle.tagName === 'SPAN') it.kicker = text(afterTitle)
  if (!card.querySelector('a.link') && card.querySelector(':scope > span.link')) it.arrow = true
  const top = card.querySelector('.top')
  if (top) {
    it.title = text(top.querySelector('h3')) || undefined
    it.ai = !!top.querySelector('.ai')
  } else it.title = text(card.querySelector('h3')) || undefined
  const bodies = card.querySelectorAll(':scope > p.body')
  it.body = (bodies.length > 1 ? bodies.map((b) => text(b)).join('\n\n') : text(card.querySelector('p.body, p.small'))) || undefined
  const ucAi = card.querySelector('p.uc-ai')
  if (ucAi) {
    it.aiLabel = text(ucAi.querySelector('b')) || undefined
    const b = ucAi.querySelector('b')
    it.aiNote = text(parse(`<p>${ucAi.innerHTML.replace(b ? b.outerHTML : '', '')}</p>`).querySelector('p')) || undefined
  }
  const ocn = card.querySelector('.oc-n')
  if (ocn) {
    it.metric = text(ocn.querySelector('b')) || undefined
    it.metricLabel = text(ocn.querySelector('span')) || undefined
  }
  const ticks = card.querySelectorAll(':scope > ul li')
  if (ticks.length) it.bullets = ticks.map((li) => text(li))
  const dn = card.querySelector(':scope > ul.dn')
  if (dn) {
    it.listClass = cls(dn).join(' ')
    it.bulletIcon = (dn.querySelector('use')?.getAttribute('href') ?? '#chk').slice(1)
  }
  const ico = card.querySelector(':scope > .ico svg')
  if (ico) it.icon = ico.outerHTML
  const tg = card.querySelectorAll('.tags span, .pills span')
  if (tg.length) it.tags = tg.map((t) => text(t))
  const last = card.querySelectorAll(':scope > span.label').pop()
  if (last && last !== first && last !== afterTitle) it.meta = text(last)
  const link = card.querySelector('a.link')
  if (link) {
    it.linkLabel = text(link) || undefined
    const href = link.getAttribute('href')
    if (href && href !== '#') it.href = href
    else {
      const hit = useCaseByTitle(String(it.title ?? ''))
      if (hit) {
        it.href = `/ai-use-cases/${hit.slug}#${hit.id}`
        ctx.catalogueSlug ??= hit.slug
      } else {
        it.href = liveHref(ctx, text(link) || String(it.title ?? '')) ?? KNOWN_LINKS[String(it.title ?? '').toLowerCase()] ?? '#'
        if (it.href === '#') warnings.push(`${ctx.slug}: no link for card "${it.title}"`)
      }
    }
  }
  return it
}

function section(sec: HTMLElement, ctx: Ctx): Record<string, unknown> | null {
  const base = { _key: key(), tone: tone(sec), sectionClass: secClass(sec), ...(sec.getAttribute('id') && sec.getAttribute('id') !== 'book' && sec.getAttribute('id') !== 'faq' ? { anchor: sec.getAttribute('id') } : {}) }
  if (has(sec, 'hero')) return hero(sec, ctx)
  if (has(sec, 'cta-band')) {
    const a = sec.querySelector('.audit')!
    return {
      _type: 'vcAudit', _key: key(), tone: has(sec, 'alt') ? 'alt' : 'plain',
      heading: rich(a.querySelector('h2')), text: text(a.querySelector('p')) || undefined,
      cta: a.querySelector('a.btn') ? { ...cta(a.querySelector('a.btn')!, ctx), _key: undefined } : undefined,
    }
  }
  if (sec.getAttribute('id') === 'book' || has(sec, 'book-sec')) {
    const l = sec.querySelector('.book > div')!
    const calTitle = text(sec.querySelector('.cal-h b')).replace(/\s*\u00b7\s*\d+\s*min$/, '')
    const tag = text(l.querySelector('.tag .label')) || undefined
    return {
      _type: 'vcBooking', _key: key(), badge: text(l.querySelector('.badge')), heading: rich(l.querySelector('h2')),
      lead: text(l.querySelector('.lead')) || undefined, tag, ...(calTitle && calTitle !== 'Discovery call' ? { calTitle } : {}),
    }
  }
  if (has(sec, 'closing')) {
    return {
      _type: 'vcClosing', _key: key(), badge: text(sec.querySelector('.badge')) || undefined,
      heading: rich(sec.querySelector('h2')), lead: text(sec.querySelector('.lead')) || undefined,
      ctas: sec.querySelectorAll('.ctas a').map((a) => cta(a, ctx)),
    }
  }
  if (sec.querySelector('.fxpanel')) {
    const tabs = sec.querySelectorAll('.fxtabs button').map((b) => text(b))
    const panels = sec.querySelectorAll('.fxpanel')
    return {
      _type: 'vcFaq', ...base,
      badge: text(sec.querySelector('.badge')) || undefined,
      heading: rich(sec.querySelector('h2')) || undefined,
      tabs: panels.map((p, i) => ({
        _type: 'vcFaqTab', _key: key(), label: tabs[i] ?? 'FAQ',
        items: p.querySelectorAll('.qa').map((qa) => faqRef(text(qa.querySelectorAll('button span')[1]), qa.querySelector('.ans')!, tabs[i] ?? 'FAQ', ctx.path.replace(/^\//, ''), i === 0)),
      })),
    }
  }
  if (sec.querySelector('.quotes.mq') && sec.querySelector('figure.q')) {
    const st = sec.querySelector('.sticky') ?? sec.querySelector('.shead')!
    const figs = sec.querySelectorAll('.mq-col').flatMap((c) => c.querySelectorAll('figure.q').filter((f) => f.getAttribute('aria-hidden') !== 'true'))
    return {
      _type: 'vcProof', ...base, layout: sec.querySelector('.sticky') ? 'sticky' : 'stacked',
      badge: text(st.querySelector('.badge')) || undefined, heading: rich(st.querySelector('h2')), lead: text(st.querySelector('.lead')) || undefined,
      ctas: st.querySelectorAll('.ctas a').map((a) => cta(a, ctx)),
      quotes: figs.map((f) => {
        const doc = {
          _type: 'vcQuote',
          org: text(f.querySelector('.label')),
          quote: text(f.querySelector('blockquote')).replace(/^["\u201c]|["\u201d]$/g, ''),
          name: text(f.querySelector('.who b')),
          role: text(f.querySelector('.who .small')),
          initials: text(f.querySelector('.av')),
        }
        dashCheck(doc.quote, 'quote')
        return { _type: 'reference', _key: key(), _ref: upsertShared('vcQuote', slugify(`${doc.name} ${doc.org}`), doc) }
      }),
    }
  }
  if (sec.querySelector('.cs2')) {
    return {
      _type: 'vcCases', ...base, head: headOf(sec),
      cases: sec.querySelectorAll('.csc').map((c) => {
        const imgs = c.querySelectorAll('.csc-img img')
        const mark = c.querySelector('.csc-mark')
        const doc = {
          _type: 'vcCase',
          client: text(c.querySelector('h3')),
          label: text(c.querySelector('.csc-b .label')) || undefined,
          body: text(c.querySelector('.csc-b .body')) || undefined,
          tags: c.querySelectorAll('.csc-tags span').map((t) => text(t)),
          results: c.querySelectorAll('.csc-res > div').map((r) => ({ _type: 'vcResult', _key: key(), value: text(r.querySelector('b')), label: text(r.querySelector('span')) })),
          photo: imageFromSrc(imgs.find((i) => i !== mark)?.getAttribute('src'), ctx.file),
          logo: mark ? imageFromSrc(mark.getAttribute('src'), ctx.file, decode(mark.getAttribute('alt') ?? '')) : undefined,
        }
        return { _type: 'reference', _key: key(), _ref: upsertShared('vcCase', slugify(doc.client), doc) }
      }),
    }
  }
  if (sec.querySelector('.card.uc')) {
    // The mock-ups edited the catalogue summaries, so the cards are stored as
    // approved; each links to its build in the use case catalogue.
    const grid = sec.querySelector('.card.uc')!.parentNode as HTMLElement
    const kids = grid.querySelectorAll(':scope > article, :scope > a, :scope > div')
    const items = kids.filter((c) => has(c, 'uc')).map((c) => {
      const title = text(c.querySelector('h3'))
      const hit = useCaseByTitle(title)
      if (hit) ctx.catalogueSlug ??= hit.slug
      if (!hit) warnings.push(`${ctx.slug}: use case not found in catalogue: ${title}`)
      const link = c.querySelector('a.link')
      return {
        _type: 'vcItem', _key: key(), title, body: text(c.querySelector('p.body')) || undefined,
        ...(c.querySelector('p.uc-ai') ? { aiLabel: text(c.querySelector('p.uc-ai b')) || undefined, aiNote: text(parse(`<p>${c.querySelector('p.uc-ai')!.innerHTML.replace(c.querySelector('p.uc-ai b')?.outerHTML ?? '', '')}</p>`).querySelector('p')) } : {}),
        tags: c.querySelectorAll('.tags span').map((t) => text(t)),
        ...(link ? { linkLabel: text(link) || 'See the build', href: hit ? `/ai-use-cases/${hit.slug}#${hit.id}` : '/ai-use-cases' } : {}),
      }
    })
    const extra = kids.filter((c) => !has(c, 'uc')).map((c) => item(c, ctx))
    return {
      _type: 'vcCards', ...base, anchor: base.anchor ?? 'use-cases', head: headOf(sec),
      layout: has(grid, 'cards2') ? 'uc2' : 'uc', items: [...items, ...extra],
    }
  }
  if (sec.querySelector('.logos')) {
    return { _type: 'vcLogos', ...base, head: headOf(sec), gridClass: cls(sec.querySelector('.logos')).filter((c) => c !== 'logos').join(' ') || undefined, logos: sec.querySelectorAll('.logos img').map((i) => logo(i, ctx)), more: text(sec.querySelector('.logos .more')) || undefined }
  }
  const steps = sec.querySelector('.steps, .steps4, .steps5')
  if (steps) {
    return {
      _type: 'vcSteps', ...base, head: headOf(sec), layout: cls(steps).join(' '), titleClass: steps.querySelector('h3.title') ? 'title' : undefined,
      items: steps.querySelectorAll('.step').map((st) => ({
        _type: 'vcStep', _key: key(), n: text(st.querySelector('.n')) || undefined,
        bar: st.querySelector('.bar i') ? Number((st.querySelector('.bar i')!.getAttribute('style') ?? '').match(/width:\s*([\d.]+)%/)?.[1] ?? 0) : undefined, title: text(st.querySelector('h3')) || undefined,
        body: text(st.querySelector('.body')) || undefined,
        bullets: st.querySelectorAll('ul.ticks li').map((li) => text(li)), meta: text(st.querySelector(':scope > .label')) || undefined,
      })),
    }
  }
  if (sec.querySelector('.prod2')) {
    return { _type: 'vcProducts', ...base, head: headOf(sec), items: sec.querySelectorAll('.pc2').map((c) => item(c, ctx)) }
  }
  const grid = sec.querySelector('.cards2, .cards3, .cards4, .grid3, .grid4, .grid6, .why4')
  if (grid) {
    const c = cls(grid)[0]
    const first = grid.querySelector('article, div')
    const layout = c === 'cards3' && has(first, 'oc') ? 'oc' : grid.querySelector('.card .top') ? 'ucpills' : has(grid, 'bgrid') ? 'cards2 bgrid' : c
    const imageFrame = grid.querySelector('.pichd') ? 'pichd' : grid.querySelector('.w4-img') ? 'w4-img' : undefined
    const tagClass = grid.querySelector('.tags span.label') ? 'label' : undefined
    const titleClass = grid.querySelector(':scope > * > h3.title') ? 'title' : undefined
    const plainList = grid.querySelector(':scope > * > ul:not(.ticks)')
    const listClass = plainList ? '' : undefined
    return {
      _type: 'vcCards', ...base, head: headOf(sec), layout, imageFrame, titleClass, tagClass, listClass,
      items: grid.querySelectorAll(':scope > article, :scope > div, :scope > a').map((x) => item(x, ctx)),
    }
  }
  if (sec.querySelector('.josh')) {
    const copy = sec.querySelector('.josh-copy')!
    const j = sec.querySelector('.josh')!
    const photo = j.querySelector('.josh-photo img')
    const shared = {
      badge: text(copy.querySelector('.badge')), heading: rich(copy.querySelector('h2')),
      photo: imageFromSrc(photo?.getAttribute('src'), ctx.file, decode(photo?.getAttribute('alt') ?? '')),
      name: text(j.querySelector('.josh-name')), role: text(j.querySelector('.josh-body > div > .label')),
      facts: j.querySelectorAll('.josh-facts > div').map((d) => ({ _type: 'vcFact', _key: key(), label: text(d.querySelector('dt')), value: text(d.querySelector('dd')) })),
      pills: j.querySelectorAll('.josh-pills .badge').map((b) => text(b)),
    }
    const sig = canon(shared)
    if (practitionerSig && practitionerSig !== sig) warnings.push(`${ctx.slug}: practitioner block differs from the shared one`)
    practitionerSig ??= sig
    practitionerShared ??= shared
    return {
      _type: 'vcPractitioners', ...base,
      paragraphs: copy.querySelectorAll(':scope > p').map((p) => ({ _type: 'vcLeadPara', _key: key(), text: text(p), style: /color:\s*var\(--ink\)/.test(p.getAttribute('style') ?? '') ? 'ink' : 'body' })),
    }
  }
  return null
}


/** The 11-character YouTube id the live page uses for a video with this name, if any. */
const STAR_AVIATION = '7vtrtlfC1Zg'
function liveVideoId(ctx: Ctx, alt: string): string | undefined {
  const html = ctx.live?.toString() ?? ''
  const ids = [...new Set([...html.matchAll(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/|ytimg\.com\/vi\/)([A-Za-z0-9_-]{11})/g)].map((m) => m[1]))]
  if (/star aviation/i.test(alt)) return STAR_AVIATION
  // The region pages' walkthrough, reused on the partner pages in the mock-ups.
  if (/how fruition builds monday\.com systems/i.test(alt)) return 'eoOCR6OjJhI'
  const scripted = ctx.scripts.join('\n').match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/)
  if (scripted) return scripted[1]
  return ids[0]
}

const paras = (els: HTMLElement[]) =>
  els.map((p) => ({ _type: 'vcPara', _key: key(), text: text(p), style: has(p, 'lead') ? 'lead' : 'body' })).filter((p) => p.text)

/** Live-page data for the interactive sections whose other states the mock-ups do not show. */
const CRM_FIXES = [
  { title: 'Lead Routing', problem: 'Leads sit unassigned or land with the wrong rep.', steps: ['Automated round-robin and rule-based assignment', 'Instant Slack / email alerts on new leads', 'SLA timers that escalate stalled leads'], outcome: 'Every lead reaches the right rep in seconds, not days.' },
  { title: 'Forecasting', problem: 'Forecasts live in stale spreadsheets nobody trusts.', steps: ['Weighted pipeline stages with automated probability', 'Real-time executive dashboards by rep and region', 'Snapshot reporting to track forecast vs actual'], outcome: 'A live forecast leadership can actually act on.' },
  { title: 'ERP Integration', problem: 'Sales and finance data never reconcile.', steps: ['Two-way sync between monday CRM and your ERP', 'Automated order and invoice status mirroring', 'Custom field mapping with zero double entry'], outcome: 'One source of truth from first touch to paid invoice.' },
]

function pageLink(ctx: Ctx, href: string | undefined, name: string): string | undefined {
  if (href && href !== '#') {
    const m = href.match(/^([a-z0-9-]+)\.html$/)
    if (m) return PAGES[m[1]]?.[0] ?? (m[1] === 'c' ? '/monday-implementation-consultants' : undefined)
    return href
  }
  return liveHref(ctx, name)
}

let teamMembers: { _id: string; name: string; bio?: string; role?: string }[] | null = null

/** A team card from the mock-up as a reference to its Team Member, with page overrides where the card differs. */
async function teamRef(pc: HTMLElement, ctx: Ctx) {
  teamMembers ??= await client.fetch(`*[_type == "teamMember" && !(_id in path("drafts.**"))]{ _id, name, bio, role }`)
  const name = text(pc.querySelector('h3, b.title, figcaption b'))
  const hit = teamMembers!.find((m) => m.name?.trim().toLowerCase() === name.toLowerCase())
  if (!hit) { warnings.push(`${ctx.slug}: team member not in Sanity: ${name}`); return null }
  const role = text(pc.querySelector('.label'))
  const bio = text(pc.querySelector('p.bio, p.small'))
  return {
    _type: 'vcTeamRef', _key: key(), person: { _type: 'reference', _ref: hit._id },
    role: role && role.toLowerCase() !== (hit.role ?? '').toLowerCase() ? role : undefined,
    bio: bio && bio !== hit.bio ? bio : undefined,
  }
}

async function extraSection(sec: HTMLElement, ctx: Ctx): Promise<Record<string, unknown> | null> {
  const base = { _key: key(), tone: tone(sec), sectionClass: secClass(sec) }
  const ds = sec.getAttribute('data-sec')
  if (ds === 'numbers' && sec.querySelector('.stats')) {
    return {
      _type: 'vcStatsRow', ...base, head: headOf(sec),
      stats: sec.querySelectorAll('.stats .stat').map((st) => ({ _type: 'vcStat', _key: key(), value: rich(st.querySelector('b')), label: text(st.querySelector('p')) })),
      note: text(sec.querySelector('.foot-note')) || undefined,
      statsClass: cls(sec.querySelector('.stats')).filter((c) => c !== 'stats').join(' ') || undefined,
      noteBelow: !sec.querySelector('.stats .foot-note') && !!sec.querySelector('.foot-note'),
    }
  }
  if (sec.querySelector('#posts-grid, .posts')) {
    return {
      _type: 'vcBlogList', ...base, anchor: undefined, allLabel: text(sec.querySelector('.pbar .tabs button')) || undefined,
      otherLabel: 'General', emptyText: text(sec.querySelector('#empty, .empty')) || undefined,
    }
  }
  if (sec.querySelector('.help #side, .help .side')) {
    const root = parse(readFileSync(ctx.file, 'utf8'))
    const data = JSON.parse(root.querySelector('#faqdata')!.textContent) as { id: string; n: string; d: string; g: { n: string; i: { q: string; a: string }[] }[] }[]
    const pageKey = ctx.path.replace(/^\//, '')
    return {
      _type: 'vcFaqHub', ...base, anchor: undefined, sideLabel: text(sec.querySelector('.side .label')) || undefined, allLabel: 'All topics',
      categories: data.map((c) => ({
        _type: 'vcFaqCategory', _key: key(), key: c.id, name: c.n, description: c.d,
        groups: c.g.map((g) => ({
          _type: 'vcFaqGroup', _key: key(), name: g.n,
          items: g.i.map((it) => faqRef(it.q, parse(`<div>${it.a}</div>`).querySelector('div')!, g.n, pageKey, false)),
        })),
      })),
    }
  }
  if (sec.querySelector('.csgrid')) {
    const script = ctx.scripts.find((x) => x.includes('const CASES='))!
    const cases = JSON.parse(script.match(/const CASES=(\[[\s\S]*?\]);\s*\n/)![1]) as {
      num: string; client: string; sub: string; sol: string; weeks: string; logo: string; m: { v: string; l: string; s: string }[]
      q: string; people: { n: string; r: string }[]; ch: string; so: string; im: string; kv: Record<string, string>
    }[]
    const cards = sec.querySelectorAll('.csgrid .cs')
    const toBlocks = (html: string) => {
      const root = parse(`<div>${html}</div>`).querySelector('div')!
      const out: unknown[] = []
      for (const el of root.childNodes as HTMLElement[]) {
        if (!el.tagName) continue
        const mk = (t: string, listItem?: string) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], ...(listItem ? { listItem, level: 1 } : {}), children: [{ _type: 'span', _key: key(), text: t, marks: [] }] })
        if (el.tagName === 'UL') el.querySelectorAll('li').forEach((li) => out.push(mk(text(li), 'bullet')))
        else out.push(mk(text(el)))
      }
      return out
    }
    const refs = cases.map((c, i) => {
      const doc = {
        _type: 'vcStory', num: c.num, client: c.client, sub: c.sub, solution: c.sol, weeks: c.weeks,
        logo: imageFromSrc(c.logo, ctx.file, `${c.client} logo`),
        metrics: c.m.map((m) => ({ _type: 'vcMetric', _key: key(), value: m.v, label: m.l, sub: m.s || undefined })),
        quote: c.q.replace(/^[\u201c"]|[\u201d"]$/g, ''), people: c.people.map((p) => ({ _type: 'vcPerson', _key: key(), name: p.n, role: p.r })),
        challenge: toBlocks(c.ch), solutionText: toBlocks(c.so), impact: toBlocks(c.im),
        location: c.kv.LOCATION, employees: c.kv.EMPLOYEES, industry: c.kv.INDUSTRY, useCase: c.kv['USE CASE'],
        tags: cards[i] ? cards[i].querySelectorAll('.cs-tags .tag').map((t) => text(t)) : [],
      }
      dashCheck(JSON.stringify(doc), `story ${c.client}`)
      return { _type: 'reference', _key: key(), _ref: upsertShared('vcStory', slugify(c.client), doc) }
    })
    return {
      _type: 'vcStories', ...base, anchor: undefined, head: headOf(sec), filterLabel: text(sec.querySelector('.filters > .label')) || undefined,
      countText: 'Showing {shown} of {total} success stories', stories: refs,
    }
  }
  if (sec.querySelector('#mq') && ctx.scripts.some((x) => x.includes('const TEST='))) {
    const script = ctx.scripts.find((x) => x.includes('const TEST='))!
    const test = JSON.parse(script.match(/const TEST=(\[[\s\S]*?\]);/)![1]) as { q: string; name: string; role: string; comp: string; tag: string; ini: string }[]
    const st = sec.querySelector('.sticky')!
    return {
      _type: 'vcProof', ...base, layout: 'sticky', badge: text(st.querySelector('.badge')) || undefined, heading: rich(st.querySelector('h2')),
      filters: st.querySelectorAll('.tabs button').map((b) => ({ _type: 'vcQuoteFilter', _key: key(), label: text(b), key: b.getAttribute('data-t') ?? '' })),
      quotes: test.map((t) => {
        const doc = { _type: 'vcQuote', org: t.comp, quote: t.q.replace(/^[\u201c"]|[\u201d"]$/g, ''), name: t.name, role: t.role, initials: t.ini, tag: t.tag || undefined }
        return { _type: 'reference', _key: key(), _ref: upsertShared('vcQuote', slugify(`${t.name} ${t.comp}`), doc) }
      }),
    }
  }
  if (sec.querySelector('.mform iframe')) {
    const mock = sec.querySelector('.mform iframe')!.getAttribute('src') ?? ''
    const live: string | null = await client.fetch(`*[_type == "page" && slug.current == "careers"][0].applicationFormEmbedUrl`)
    if (live && live !== mock) warnings.push(`${ctx.slug}: form URL differs from live; using live ${live}`)
    return {
      _type: 'vcFormEmbed', ...base, anchor: sec.getAttribute('id') ?? undefined, head: headOf(sec), src: live || mock,
      title: decode(sec.querySelector('.mform iframe')!.getAttribute('title') ?? ''), note: text(sec.querySelector('.mform-note')) || undefined,
    }
  }
  if (sec.querySelector('.rgrid .rbox')) {
    const rl = sec.querySelector('.rl')!
    return {
      _type: 'vcRemote', ...base, anchor: sec.getAttribute('id') ?? undefined, badge: text(rl.querySelector('.badge')) || undefined,
      heading: rich(rl.querySelector('h2')), lead: text(rl.querySelector('.lead')) || undefined,
      perks: rl.querySelectorAll('.rperks li').map((li) => ({ _type: 'vcPerk', _key: key(), icon: li.querySelector('.ico svg')?.outerHTML, text: text(li.querySelector(':scope > span:last-child')) })),
      listLabel: text(sec.querySelectorAll('.rhead .label')[0]) || undefined, timeLabel: text(sec.querySelectorAll('.rhead .label')[1]) || undefined,
      places: sec.querySelectorAll('.roffices .ro').map((li) => ({
        _type: 'vcPlace', _key: key(), flag: text(li.querySelector('.flag')) || undefined, title: text(li.querySelector('.rt b')),
        line: text(li.querySelector('.rt .small')) || undefined, label: text(li.querySelector('.rr .label')) || undefined,
        tz: li.querySelector('.clock')?.getAttribute('data-tz') ?? undefined,
      })),
    }
  }
  if (sec.querySelector('.chan .rows')) {
    const left = sec.querySelector('.chan > div')!
    const right = sec.querySelectorAll('.chan > div')[1]
    const allLink = right?.querySelector('.acc-h a.link')
    return {
      _type: 'vcChannels', ...base, badge: text(left.querySelector('.badge')) || undefined, heading: rich(left.querySelector('h2')),
      rows: left.querySelectorAll('.rows > a').map((a) => ({ _type: 'vcChannelRow', _key: key(), label: text(a.querySelector('.label')), value: text(a.querySelector('b')), href: a.getAttribute('href') })),
      followLabel: text(left.querySelector('.srow .label')) || undefined,
      socials: left.querySelectorAll('.sicons a').map((a) => ({ _type: 'vcSocial', _key: key(), network: (a.getAttribute('title') ?? '').toLowerCase(), label: decode(a.getAttribute('aria-label') ?? ''), href: a.getAttribute('href') })),
      tilesLabel: text(right?.querySelector('.acc-h .label')) || undefined,
      tilesLink: allLink ? { _type: 'vcCta', label: text(allLink), href: allLink.getAttribute('href') === '#' ? '/certifications-and-awards' : allLink.getAttribute('href'), style: 'primary' } : undefined,
      tiles: (right?.querySelectorAll('.tiles > div:not(.wide)') ?? []).map((d) => ({ ...logo(d.querySelector('img')!, ctx), shape: cls(d).join(' ') || undefined })),
      security: (right?.querySelectorAll('.secrow img') ?? []).map((i) => logo(i, ctx)),
    }
  }
  if (sec.querySelector('.ceo')) {
    const ceo = sec.querySelector('.ceo')!
    const ceoRef = await teamRef(ceo, ctx)
    return {
      _type: 'vcLeadership', ...base, head: headOf(sec), ceo: ceoRef ? { ...ceoRef, _key: undefined, bio: undefined } : undefined,
      quote: text(ceo.querySelector('blockquote')), caption: text(ceo.querySelector('figcaption .small')) || undefined,
      people: (await Promise.all(sec.querySelectorAll('.lgrid .lc').map((lc) => teamRef(lc, ctx)))).filter(Boolean),
    }
  }
  if (sec.querySelector('.offices .office')) {
    const live: { city?: string }[] = (await client.fetch(`*[_id == "siteSettings"][0].offices`)) ?? []
    const mock = sec.querySelectorAll('.office h3').map((h) => text(h))
    const missing = mock.filter((c) => !live.some((o) => o.city === c))
    if (missing.length) warnings.push(`${ctx.slug}: offices not in siteSettings: ${missing.join(', ')}`)
    return { _type: 'vcOffices', ...base, head: headOf(sec) }
  }
  if (sec.querySelector('.panel .pc') && sec.querySelector('.tabs button[data-r]')) {
    const btns = sec.querySelectorAll('.tabs button')
    const panels = sec.querySelectorAll('.panel')
    return {
      _type: 'vcTeamTabs', ...base, badge: text(sec.querySelector('.shead .badge')) || undefined,
      headingPrefix: text(parse(`<b>${sec.querySelector('.shead h2')!.innerHTML.replace(/<span class="acc"[\s\S]*$/, '')}</b>`).querySelector('b')),
      tabs: await Promise.all(btns.map(async (b, i) => {
        const flag = b.querySelector('.flag')
        const p = panels[i]
        return {
          _type: 'vcTeamTab', _key: key(),
          label: text(parse(`<b>${b.innerHTML.replace(flag?.outerHTML ?? '', '')}</b>`).querySelector('b')),
          flag: flag ? text(flag) : undefined, title: `${b.getAttribute('data-h')} Team`,
          leaders: (await Promise.all(p.querySelectorAll('.lgrid .pc').map((pc) => teamRef(pc, ctx)))).filter(Boolean),
          members: (await Promise.all(p.querySelectorAll('.tgrid .pc').map((pc) => teamRef(pc, ctx)))).filter(Boolean),
        }
      })),
    }
  }
  if (sec.querySelector('.tgrid .pc')) {
    teamMembers ??= await client.fetch(`*[_type == "teamMember" && !(_id in path("drafts.**"))]{ _id, name, bio }`)
    const compact = !sec.querySelector('.tgrid .pc .more')
    const members = sec.querySelectorAll('.tgrid .pc').map((pc) => {
      const name = text(pc.querySelector('h3'))
      const hit = teamMembers!.find((m) => m.name?.trim().toLowerCase() === name.toLowerCase())
      if (!hit) warnings.push(`${ctx.slug}: team member not in Sanity: ${name}`)
      const shown = text(pc.querySelector('p.bio, p.small'))
      return hit ? { _type: 'vcTeamRef', _key: key(), person: { _type: 'reference', _ref: hit._id }, bio: shown && shown !== hit.bio ? shown : undefined } : null
    }).filter(Boolean)
    return { _type: 'vcTeam', ...base, head: headOf(sec), layout: compact ? 'compact' : 'full', members }
  }
  if (sec.querySelector('.answer')) {
    const a = sec.querySelector('.answer')!
    return { _type: 'vcAnswer', ...base, badge: text(a.querySelector('.badge')) || undefined, heading: rich(a.querySelector('h2')), body: text(a.querySelector('p.body')) }
  }
  if (sec.querySelector('.ogrid')) {
    const src = sec.querySelector('.omap iframe')?.getAttribute('src') ?? ''
    const q = decodeURIComponent((src.match(/[?&]q=([^&]+)/)?.[1] ?? '').replace(/\+/g, ' '))
    const v = sec.querySelector('.ovisit')
    return {
      _type: 'vcCoverage', ...base, head: headOf(sec), mapQuery: q, mapTitle: decode(sec.querySelector('.omap iframe')?.getAttribute('title') ?? ''),
      visitLabel: text(v?.querySelector('.label')), visitHeading: text(v?.querySelector('h3')), visitAddress: text(v?.querySelector('p')),
      visitLinkLabel: text(v?.querySelector('a.link')), visitHref: v?.querySelector('a.link')?.getAttribute('href') ?? undefined,
      cityStyle: sec.querySelector('.ocards .city') ? 'city' : 'card',
      cities: sec.querySelectorAll('.ocards > article').map((c) => {
        const h = c.querySelector('h3')
        const flag = h?.querySelector('.flag')
        return {
          _type: 'vcCity', _key: key(), label: text(c.querySelector(':scope > .label')) || undefined,
          title: h ? text(parse(`<b>${h.innerHTML.replace(flag?.outerHTML ?? '', '')}</b>`).querySelector('b')) : '',
          flag: flag ? text(flag) : undefined, hq: !!c.querySelector('.dot'), body: text(c.querySelector('p')),
        }
      }),
    }
  }
  if (sec.querySelector('.pst')) {
    return {
      _type: 'vcPartnerStatus', ...base,
      badgeImages: sec.querySelectorAll('.pst-badge img').map((i) => logo(i, ctx)),
      badge: text(sec.querySelector('.pst-copy .badge')) || undefined, heading: rich(sec.querySelector('.pst-copy h2')),
      points: sec.querySelectorAll('.pst-pt').map((pt) => ({ _type: 'vcPoint', _key: key(), n: text(pt.querySelector('.label')), title: text(pt.querySelector('b')), body: text(pt.querySelector('.small')) })),
    }
  }
  if (sec.querySelector('.pgrid, .pcards')) {
    const isCards = !!sec.querySelector('.pcards')
    return {
      _type: 'vcDirectory', ...base, head: headOf(sec), variant: isCards ? 'pcards' : 'pgrid',
      filters: sec.querySelectorAll('.tabs button').map((b) => ({ _type: 'vcFilter', _key: key(), label: text(b), key: b.getAttribute('data-f') ?? 'all' })),
      tiles: sec.querySelectorAll('.ptile, .pcards > .card').map((t) => {
        const img = t.querySelector('.logo img')
        const title = text(t.querySelector('h3'))
        const href = pageLink(ctx, t.querySelector('a.link')?.getAttribute('href') ?? undefined, title)
        if (!href) warnings.push(`${ctx.slug}: no link for partner tile "${title}"`)
        return {
          _type: 'vcTile', _key: key(), logo: imageFromSrc(img?.getAttribute('src'), ctx.file, title), logoShape: cls(img).join(' ') || undefined,
          tag: text(t.querySelector('.gtag')), title, body: text(t.querySelector('p.body')) || undefined, href, groups: (t.getAttribute('data-g') ?? '').split(/\s+/).filter(Boolean),
        }
      }),
    }
  }
  if (sec.querySelector('.accr .tile')) {
    return {
      _type: 'vcToolkit', ...base, head: headOf(sec),
      tiles: sec.querySelectorAll('.accr .tile').filter((t) => t.getAttribute('aria-hidden') !== 'true').map((t) => {
        const img = t.querySelector('.logo img')
        return { _type: 'vcTool', _key: key(), logo: imageFromSrc(img?.getAttribute('src'), ctx.file), logoShape: cls(img).join(' ') || undefined, title: text(t.querySelector('b')), body: text(t.querySelector('.small')) }
      }),
    }
  }
  const video = sec.querySelector('.video')
  if (video && sec.querySelector('.case')) {
    const left = sec.querySelector('.case > div')!
    const img = video.querySelector('img')
    const alt = decode(img?.getAttribute('alt') ?? '')
    const id = liveVideoId(ctx, alt)
    if (!id) warnings.push(`${ctx.slug}: no YouTube id for video "${alt}"`)
    const dts = left.querySelectorAll('dl dt')
    return {
      _type: 'vcVideo', ...base, badge: text(left.querySelector('.badge')) || undefined, heading: rich(left.querySelector('h2')),
      paragraphs: paras(left.querySelectorAll(':scope > p')),
      facts: dts.map((dt) => ({ _type: 'vcVideoFact', _key: key(), label: text(dt), value: text(dt.nextElementSibling as HTMLElement) })),
      youtubeId: id, poster: imageFromSrc(img?.getAttribute('src'), ctx.file, alt), caption: text(video.querySelector('.cap')) || undefined,
    }
  }
  if (sec.querySelector('.txt2')) {
    const t = sec.querySelector('.txt2')!
    return { _type: 'vcTextPair', ...base, badge: text(t.querySelector('.badge')) || undefined, heading: rich(t.querySelector('h2')), paragraphs: paras(t.querySelectorAll('.txt2-b p')) }
  }
  if (sec.querySelector('.fix')) {
    const first = text(sec.querySelector('.fix-detail h3'))
    if (first !== CRM_FIXES[0].title) warnings.push(`${ctx.slug}: fix picker first item "${first}" differs from live data`)
    return {
      _type: 'vcFix', ...base, head: headOf(sec), detailLabel: text(sec.querySelector('.fix-detail .label')) || undefined,
      items: CRM_FIXES.map((f, i) => i === 0
        ? { _type: 'vcFixItem', _key: key(), title: first, problem: text(sec.querySelector('.frow .small')), steps: sec.querySelectorAll('.fix-detail .tl li').map((li) => text(li)), outcome: text(sec.querySelector('.fix-detail .out')) }
        : { _type: 'vcFixItem', _key: key(), ...f }),
      cta: sec.querySelector('.fix-detail a.btn') ? { ...cta(sec.querySelector('.fix-detail a.btn')!, ctx), _key: undefined } : undefined,
    }
  }
  if (sec.querySelector('.inds')) {
    // First tab as approved in the mock-up; the others from the live page's solutionPage.industryTabs.
    const live: { title?: string; description?: string; benefits?: { text?: string }[] }[] =
      (await client.fetch(`*[_type == "solutionPage" && slug.current == $s][0].industryTabs`, { s: ctx.slug })) ?? []
    const labels = sec.querySelectorAll('.inds span').map((x) => text(x))
    const ind = sec.querySelector('.ind')!
    const strip = (t?: string) => (t ?? '').replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, '').trim()
    return {
      _type: 'vcIndustryTabs', ...base, head: headOf(sec), benefitsLabel: text(ind.querySelector('.label')) || undefined,
      tabs: labels.map((label, i) => i === 0
        ? { _type: 'vcIndTab', _key: key(), label, title: text(ind.querySelector('h3')), body: text(ind.querySelector('.body')), benefits: ind.querySelectorAll('.tl li').map((li) => text(li)) }
        : { _type: 'vcIndTab', _key: key(), label, title: live[i]?.title, body: live[i]?.description, benefits: (live[i]?.benefits ?? []).map((b) => strip(b.text)).filter(Boolean) }),
      cta: ind.querySelector('a.btn') ? { ...cta(ind.querySelector('a.btn')!, ctx), _key: undefined } : undefined,
    }
  }
  if (sec.querySelector('.track')) {
    const script = ctx.scripts.find((x) => x.includes('const TR='))
    const tr = script ? (new Function(`return ${script.match(/const TR=(\[[\s\S]*?\]\]);/)![1]}`)() as string[][]) : []
    if (!tr.length) warnings.push(`${ctx.slug}: track data not found`)
    const rec = sec.querySelector('.rec')!
    return {
      _type: 'vcTrack', ...base, head: headOf(sec), sizeLabel: text(sec.querySelector('.tcard .row b')),
      complexityLabel: text(sec.querySelectorAll('.tcard > div')[1]?.querySelector('b')),
      complexity: sec.querySelectorAll('.opts3 button').map((b) => text(b)), recLabel: text(rec.querySelector('.label')),
      tracks: tr.map(([title, body, fit]) => ({ _type: 'vcTrackItem', _key: key(), title, body, fit })),
      cta: rec.querySelector('a.btn') ? { ...cta(rec.querySelector('a.btn')!, ctx), _key: undefined } : undefined,
      pills: sec.querySelectorAll('.pills .badge').map((b) => text(b)),
    }
  }
  if (sec.querySelector('.table')) {
    const th = sec.querySelectorAll('.tr.th > div').map((d) => text(d))
    return {
      _type: 'vcTable', ...base, head: headOf(sec), variant: sec.querySelector('.tr .help') ? 'help' : 'compare', columns: th,
      rows: sec.querySelectorAll('.tr:not(.th)').map((r) => {
        const c = r.querySelectorAll(':scope > div')
        return { _type: 'vcRow', _key: key(), label: text(c[0]), no: text(c[1]), yes: text(c[2]) }
      }),
    }
  }
  if (ds === 'faq' && sec.querySelector('#qas')) {
    // FAQ rendered from a script bank in this mock-up (c.html).
    const script = ctx.scripts.find((x) => /bank=\{/.test(x))!
    const lit = script.slice(script.indexOf('bank=') + 5, script.indexOf('function render'))
    const bank = new Function(`return ${lit.trim().replace(/;\s*$/, '')}`)() as Record<string, [string, string][]>
    const tabs = sec.querySelectorAll('#tabs button').map((b) => text(b))
    const pageKey = ctx.path.replace(/^\//, '')
    return {
      _type: 'vcFaq', ...base, badge: text(sec.querySelector('.badge')) || undefined, heading: rich(sec.querySelector('h2')) || undefined,
      tabs: await Promise.all(tabs.map(async (label, i) => {
        if (bank[i]) {
          return { _type: 'vcFaqTab', _key: key(), label, items: bank[i].map(([q, a]) => faqRef(q, parse(`<div>${a}</div>`).querySelector('div')!, label, pageKey, true)) }
        }
        // The mock-up has no questions for this tab (its script falls back to
        // tab 1); use the live page's central questions in the same category.
        const live: { _id: string; question: string }[] = await client.fetch(
          `*[_type == "faqItem" && $p in pages && lower(category) match $c && !(_id in path("drafts.**"))] | order(order asc){ _id, question }`,
          { p: pageKey, c: `${label.toLowerCase().split(' ')[0]}*` },
        )
        const seen = new Set<string>()
        const items = live.filter((f) => !seen.has(normQ(f.question)) && seen.add(normQ(f.question)))
        if (!items.length) warnings.push(`${ctx.slug}: no live questions for FAQ tab "${label}"`)
        return { _type: 'vcFaqTab', _key: key(), label, items: items.map((f) => ({ _type: 'reference', _ref: f._id, _key: key() })) }
      })),
    }
  }
  return null
}

/* ---------------------------------------------------------------- main */

/* ------------------------------------------------------- core pages */

const CORE_SLUGS = new Set(['pricing', 'ai-use-cases', 'ask-fruit', 'ai-readiness-blueprint', 'home'])
const keyed = <T extends Record<string, unknown>>(type: string, o: T) => ({ _type: type, _key: key(), ...o })
const link = (a: HTMLElement | null | undefined, ctx: Ctx) => {
  if (!a) return undefined
  const label = text(a)
  let href = a.getAttribute('href') ?? ''
  if (!href || href === '#') href = REGION_LINKS(label) ?? liveHref(ctx, label) ?? ''
  if (!href) warnings.push(`${ctx.slug}: no link for "${label}"`)
  return { label, href: href.replace(/^([a-z0-9-]+)\.html$/, (_m, n) => PAGES[n]?.[0] ?? `/${n}`) }
}
function REGION_LINKS(title: string): string | undefined {
  const t = title.toLowerCase()
  const m = t.match(/^monday\.com partner (\w+)/)
  if (m && PAGES[`monday-partner-${m[1] === 'australia' ? 'australia' : m[1]}`]) return PAGES[`monday-partner-${m[1]}`][0]
  if (t === 'monday.com implementation consultants') return '/monday-implementation-consultants'
  if (t === 'monday.com training') return '/training'
  return undefined
}

/* -------- node trees (animated and bespoke home blocks) -------- */

const ICON_PATHS: Record<string, string> = { arr: 'M5 12h14M13 6l6 6-6 6', chk: 'M5 12.5l4.5 4.5L19 7.5', x: 'M7 7l10 10M17 7L7 17', plus: 'M12 5v14M5 12h14' }
const VOID_TAGS = new Set(['img', 'br', 'hr', 'input'])

function svgClean(svg: string): string {
  // The mock-ups draw icons from a sprite (<use href="#arr">); inline the path instead.
  // The sprite's <symbol> carried the 24-unit viewBox, so the <svg> needs it now.
  if (!/<use href="#/.test(svg)) return svg
  const inlined = svg.replace(/<use href="#(\w+)"\s*\/?>(<\/use>)?/g, (_m, id) => `<path d="${ICON_PATHS[id] ?? ICON_PATHS.arr}"/>`)
  return /^<svg[^>]*\bviewBox=/i.test(inlined) ? inlined : inlined.replace(/^<svg\b/, '<svg viewBox="0 0 24 24"')
}

function nodeHref(ctx: Ctx, href: string | undefined, label: string): string | undefined {
  if (!href) return undefined
  if (href === '#') return liveHref(ctx, label)
  const m = href.match(/^([a-z0-9-]+)\.html$/)
  if (m) return m[1] === 'pricing' ? '/implementation-packages' : PAGES[m[1]]?.[0]
  return href
}

/** An element's children as vcNode objects: text runs, images (as Sanity assets), inline SVG and nested elements. */
function toNodes(el: HTMLElement, ctx: Ctx): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = []
  for (const c of el.childNodes) {
    if (c.nodeType === 3) {
      const t = decode(c.rawText).replace(/[ \t\n\r]+/g, ' ')
      if (t.trim()) out.push(keyed('vcNode', { tag: '#text', text: t }))
      continue
    }
    const e = c as HTMLElement
    const tag = e.tagName?.toLowerCase()
    if (!tag) continue
    if (tag === 'svg') {
      out.push(keyed('vcNode', { tag: 'svg', svg: svgClean(e.outerHTML) }))
      continue
    }
    const attrs: string[] = []
    for (const [k, v] of Object.entries(e.attributes)) {
      if (['class', 'style', 'href', 'src', 'alt', 'loading', 'decoding'].includes(k)) continue
      attrs.push(v === '' ? k : `${k}=${decode(v)}`)
    }
    const style = (e.getAttribute('style') ?? '').replace(/animation-name:\s*fruEnergy/g, 'animation-name:vc-fruEnergy')
    const node: Record<string, unknown> = { tag, className: e.getAttribute('class') || undefined, style: style || undefined }
    if (tag === 'img') {
      node.image = imageFromSrc(e.getAttribute('src'), ctx.file, decode(e.getAttribute('alt') ?? ''))
      if (e.getAttribute('width')) attrs.push(`width=${e.getAttribute('width')}`)
    }
    if (tag === 'a') node.href = nodeHref(ctx, e.getAttribute('href') ?? undefined, text(e))
    if (attrs.length) node.attrs = attrs
    if (!VOID_TAGS.has(tag)) {
      const kids = toNodes(e, ctx)
      if (kids.length) node.children = kids
    }
    out.push(keyed('vcNode', node))
  }
  return out
}

async function coreSection(sec: HTMLElement, ctx: Ctx): Promise<Record<string, unknown> | null> {
  if (!CORE_SLUGS.has(ctx.slug)) return null
  const ds = sec.getAttribute('data-sec') ?? ''
  const base = { _key: key(), tone: tone(sec), sectionClass: secClass(sec), ...(sec.getAttribute('id') && sec.getAttribute('id') !== 'book' && sec.getAttribute('id') !== 'faq' ? { anchor: sec.getAttribute('id') } : {}) }
  if (ctx.slug === 'pricing') {
    if (['glance', 'packages', 'licences'].includes(ds)) {
      const grid = sec.querySelector('.grid3')!
      return {
        _type: 'vcPriceCards', ...base, head: headOf(sec), gridClass: cls(grid).join(' '),
        items: grid.querySelectorAll(':scope > article').map((c) => {
          const price = c.querySelector('.pricebox b.price')
          const unit = price?.querySelector('.un')
          const bf = c.querySelector('b.bf')
          const body = c.querySelector(':scope > p.body')
          const lk = c.querySelector(':scope > a.link')
          const btn = c.querySelector(':scope > a.btn')
          const logoImg = c.querySelector('.logo-s img')
          const labels = c.querySelectorAll(':scope > span.label')
          return keyed('vcPriceCard', {
            cardClass: cls(c).filter((x) => x !== 'card').join(' ') || undefined,
            logo: logoImg ? imageFromSrc(logoImg.getAttribute('src'), ctx.file, decode(logoImg.getAttribute('alt') ?? '')) : undefined,
            logoShape: logoImg ? cls(logoImg).join(' ') || undefined : undefined,
            kicker: labels.find((l) => has(l, 'ac')) ? text(labels.find((l) => has(l, 'ac'))) : undefined,
            title: text(c.querySelector('h3')) || undefined,
            body: bf ? undefined : text(body) || undefined,
            meta: labels.find((l) => !has(l, 'ac')) ? text(labels.find((l) => !has(l, 'ac'))) : undefined,
            priceLabel: text(c.querySelector('.pricebox > .label')) || undefined,
            price: price && !has(price, 'pq') ? text(parse(`<b>${price.innerHTML.replace(unit?.outerHTML ?? '', '')}</b>`).querySelector('b')) : undefined,
            unit: unit ? text(unit) : undefined,
            quote: price && has(price, 'pq') ? text(price) : undefined,
            bestLabel: bf ? text(bf) : undefined,
            best: bf && body ? text(parse(`<p>${body.innerHTML.replace(bf.outerHTML, '')}</p>`).querySelector('p')) : undefined,
            bullets: c.querySelectorAll(':scope > ul.ticks li').map((li) => text(li)),
            cta: btn ? { ...cta(btn, ctx), _key: undefined } : undefined,
            linkLabel: lk ? text(lk) : undefined,
            href: lk ? link(lk, ctx)?.href : undefined,
          })
        }),
        notes: sec.querySelectorAll('.notes2 .nt').map((n) => keyed('vcPriceNote', {
          label: text(n.querySelector('.label')), body: text(n.querySelector('p.body')),
          links: n.querySelectorAll('a.link').map((a) => keyed('vcNoteLink', link(a, ctx)!)),
        })),
      }
    }
    if (ds === 'regions') {
      const grid = sec.querySelector('.grid3')!
      return {
        _type: 'vcLinkCards', ...base, head: headOf(sec), gridClass: cls(grid).join(' '),
        items: grid.querySelectorAll('a.card').map((a) => keyed('vcLinkCard', { title: text(a.querySelector('.title')), href: link(a.querySelector('.title') as HTMLElement, ctx) ? (a.getAttribute('href') && a.getAttribute('href') !== '#' ? a.getAttribute('href')! : REGION_LINKS(text(a.querySelector('.title'))) ?? '') : '' })),
      }
    }
    if (ds === 'services') {
      const { DEFAULT_CONTENT } = await import('../../src/app/implementation-packages/content')
      const known = DEFAULT_CONTENT.servicePrices.flatMap((g) => g.items.map((i) => ({ name: i.name.toLowerCase(), href: i.href })))
      const tabs = sec.querySelectorAll('.svtabs button')
      return {
        _type: 'vcServices', ...base, head: headOf(sec), footnote: text(sec.querySelector('.note-b')) || undefined,
        tabs: sec.querySelectorAll('.svpanel').map((p, i) => {
          const intro = p.querySelector('.sv-intro2')!
          const b = intro.querySelector('a.btn')
          const tabLabel = text(parse(`<b>${tabs[i].innerHTML.replace(tabs[i].querySelector('.n')?.outerHTML ?? '', '')}</b>`).querySelector('b'))
          return keyed('vcServiceTab', {
            label: tabLabel, kicker: text(intro.querySelector('.label')), title: text(intro.querySelector('h3')), body: text(intro.querySelector('p.body')),
            fromLabel: text(intro.querySelector('.sv-from .label')), from: text(intro.querySelector('.sv-from b')),
            cta: b ? { ...cta(b, ctx), href: link(b, ctx)?.href, _key: undefined } : undefined,
            rows: p.querySelectorAll('.svc').map((r) => {
              const name = text(parse(`<b>${r.querySelector('span')!.innerHTML.replace(r.querySelector('span .label')?.outerHTML ?? '', '')}</b>`).querySelector('b'))
              return keyed('vcServiceRow', { name, note: text(r.querySelector('span .label')), price: text(r.querySelector('b.price')), href: known.find((k) => k.name === name.toLowerCase())?.href })
            }),
          })
        }),
      }
    }
    if (ds === 'facts') {
      return {
        _type: 'vcFacts', ...base, head: headOf(sec),
        rows: sec.querySelectorAll('dl dt').map((dt) => keyed('vcFactRow', { label: text(dt), value: text(dt.nextElementSibling) })),
      }
    }
  }
  if (ctx.slug === 'ai-readiness-blueprint' && ds === 'quiz') {
    const script = ctx.scripts.find((x) => x.includes('const Q=['))!
    const Q = new Function(`return ${script.slice(script.indexOf('const Q=') + 8, script.indexOf('const ans='))}`)() as { k: string; q: string; h: string; o: string[][]; d: number | null }[]
    // The numbers behind each option are the live quiz logic (AiBlueprintClient), not the mock-up's illustrative scoring.
    const VALUES = [[0, 1, 2, 3], [0, 1, 2, 0], [0, 1, 2, 3], [0, 1, 2, 3], [15, 40, 65, 90], [15, 40, 70, 92], [15, 40, 70, 92], [10, 38, 68, 92], [12, 38, 65, 90], [15, 42, 68, 90], [15, 45, 72, 92], [35, 60, 78, 90]]
    const dims = sec.querySelectorAll('.dlist .dr > span:first-child').map((x) => text(x))
    const done = script.match(/class="final">([\s\S]*?)<\/div><\/div>';/)?.[1] ?? ''
    const fin = parse(`<div>${done}</div>`)
    return {
      _type: 'vcQuiz', ...base, head: headOf(sec), dims,
      ui: Object.entries({
        liveAria: decode(sec.querySelector('.live')?.getAttribute('aria-label') ?? ''), liveLabel: text(sec.querySelector('.live > .label')), begin: text(sec.querySelector('#state')),
        stateAdvanced: 'advanced · ready to build', stateDeveloping: 'developing · foundations first', stateEmerging: 'emerging · start with basics',
        note: text(sec.querySelector('.live .note')), back: '← Back', next: 'Next →', generate: 'Generate my blueprint →',
        finalCount: '{n} / {n}', finalHeading: text(fin.querySelector('h3')), finalBody: text(fin.querySelector('p.body')),
        emailPlaceholder: 'you@company.com', emailAria: 'Email address', emailSubmit: 'Email my blueprint', sending: 'Sending…',
        leadDone: "Done, your blueprint is on its way. We'll follow up within one business day.",
        leadError: 'Something went wrong. Please try again or email us directly at hello@fruitionservices.io.',
        book: text(fin.querySelectorAll('.ctas a')[1]), restart: text(fin.querySelector('a.restart')),
        reportMeta: 'AI Readiness Blueprint · generated {date}', landscapeH: 'Landscape & objective', scorecardH: 'Readiness scorecard',
        scorecardText: 'Strongest leverage comes from addressing your two lowest dimensions first: {a} and {b}. These are weighted into Phase 1.',
        stackH: 'Recommended stack', stackText: 'Vendor recommendations are indicative and refined during discovery. Everything below is something we implement ourselves, with no handoffs.',
        phasesH: 'Phased implementation plan', phaseLabel: 'PHASE {n} · {window}', estimated: 'estimated', investH: 'Indicative investment',
        investNote: 'Indicative only, based on self-reported answers. A fixed quote follows a scoping call. Licence costs billed by the vendor and estimated at list pricing.',
      }).map(([id, t]) => keyed('vcUiText', { id, text: t })),
      questions: Q.map((q, i) => keyed('vcQuizQuestion', {
        kicker: q.k, title: q.q, help: q.h, dim: q.d ?? undefined,
        options: q.o.map(([label, hint], j) => keyed('vcQuizOption', { label, hint: hint || undefined, value: VALUES[i][j] })),
      })),
    }
  }
  if (ctx.slug === 'ask-fruit') {
    const script = ctx.scripts.find((x) => x.includes('const SC='))!
    const grab = () => new Function(`${script.slice(script.indexOf('const SC='), script.indexOf('const $='))}; return { SC, M, FIELDS, PH, REG }`)() as {
      SC: Record<string, { chip: string; title: string; user: string; goals: string; tools: string; reply: string[]; m: string[] }>
      M: Record<string, { why: string; fit: string[]; s: string; w: string; rec: string; ph: string[] }>
      FIELDS: string[]; PH: Record<string, string>; REG: string[]
    }
    const md = (h: string) => decode(h.replace(/<b>([\s\S]*?)<\/b>/g, '*$1*').replace(/<[^>]+>/g, ''))
    if (ds === 'hero') {
      const h = hero(sec, ctx) as Record<string, unknown>
      const box = sec.querySelector('.inner.dark')!
      const { SC } = grab()
      h.prompt = {
        _type: 'object', label: text(box.querySelector('.label')), placeholder: decode(box.querySelector('input')?.getAttribute('placeholder') ?? ''),
        ariaLabel: decode(box.querySelector('input')?.getAttribute('aria-label') ?? ''), sendLabel: decode(box.querySelector('button.send')?.getAttribute('aria-label') ?? ''),
        note: text(box.querySelector('p.small')), href: '/ask-fruit/workspace',
        chips: Object.values(SC).map((c) => keyed('vcPromptChip', { label: c.chip, text: c.user })),
      }
      return h
    }
    if (ds === 'tool') {
      const { SC, M, FIELDS, PH, REG } = grab()
      const U: Record<string, string> = {
        appTitle: text(sec.querySelector('.app-h .label')), newConversation: text(sec.querySelector('#newConv')),
        replyPlaceholder: decode(sec.querySelector('#chatIn')?.getAttribute('placeholder') ?? ''), replyAria: decode(sec.querySelector('#chatIn')?.getAttribute('aria-label') ?? ''),
        sendAria: decode(sec.querySelector('#chatForm button')?.getAttribute('aria-label') ?? ''), foot: text(sec.querySelector('.foot')),
        knowsLabel: text(sec.querySelector('.know-h .label')), contextLabel: text(sec.querySelector('.ctx')), assistant: 'Implementation Calculator',
        tabMatches: 'Matches', tabShortlist: 'Shortlist', tabBriefs: 'Briefs', goalsKey: 'Goals', toolsKey: 'Current tools',
        state1: 'Enough to start. A few more details will sharpen the recommendation.', state2: 'Getting clearer. The matches are now scored against these requirements.', state3: 'Plenty to work with. Ask for a brief when you are ready.',
        shortlist: 'Shortlist', shortlisted: 'Shortlisted', add: 'Add', open: 'Open', metText: '{me} of {n} met',
        emptyShortlist: 'Shortlist options from Matches to compare them or ask for a brief.', emptyBriefs: 'Briefs you ask for appear here. Shortlist options first.',
        cmpBrief: 'Comparison brief', impBrief: 'Implementation brief', sampleCmp: 'Sample comparison brief', sampleImp: 'Sample implementation brief',
        back: 'Back to chat', print: 'Print or save PDF', reqFit: 'Requirements fit', reqCol: 'Requirement', sw: 'Strengths and watch-outs', strength: 'Strength', watch: 'Watch-out',
        recHeading: 'A clear recommendation', plan: 'Delivery plan', statusMeets: 'Meets', statusPartly: 'Partly', statusGap: 'Gap',
        recTemplate: '{m} fits best against your {n} requirements ({me} met, {pa} partly met, {gap} gap). {rec} A consultant confirms scope, price and timeline.',
        objective: 'Objective:', phase: 'Phase', owners: 'Owners:', ownersText: 'your project owner with a Fruition consultant.', risk: 'Risk:',
        noteAdded: 'Added to what I know: *{k}*, {v}. The matches are re-scored against it.', noteTeam: 'Noted. I have recorded the *{k}* and re-scored the matches.', notePain: 'Noted. I have recorded that under *{k}* and re-scored the matches.',
        teamSuffix: 'people',
      }
      FIELDS.forEach((f, i) => { U[`field${i + 1}`] = f; if (PH[f]) U[`field${i + 1}Ph`] = PH[f] })
      REG.forEach((r, i) => { U[`region${i + 1}`] = r })
      return {
        _type: 'vcAskDemo', ...base, head: headOf(sec), note: text(sec.querySelector('.note-ill')),
        ui: Object.entries(U).map(([id, t]) => keyed('vcUiText', { id, text: t })),
        scenarios: Object.entries(SC).map(([id, c]) => keyed('vcAskScenario', { id, chip: c.chip, title: c.title, user: c.user, goals: c.goals, tools: c.tools, reply: c.reply.map(md), matches: c.m.map(decode) })),
        solutions: Object.entries(M).map(([name, m]) => keyed('vcAskSolution', { name, why: m.why, fit: m.fit, strength: m.s, watch: m.w, rec: m.rec, phases: m.ph })),
      }
    }
  }
  if (ctx.slug === 'home') {
    if (ds === 'insights') return { _type: 'vcInsights', ...base, head: headOf(sec) }
    if (['services', 'method', 'markets', 'industries', 'platforms', 'ai'].includes(ds)) {
      return {
        _type: 'vcMarkup', _key: key(), sectionClass: cls(sec).join(' ') || undefined, anchor: sec.getAttribute('id') ?? undefined, dataSec: ds,
        behaviour: ds === 'method' || ds === 'industries' ? ds : undefined, nodes: toNodes(sec, ctx),
      }
    }
  }
  if (ctx.slug === 'ai-use-cases') {
    if (ds === 'industries') {
      const first = text(sec.querySelector('.go-card .label'))
      const m = first.match(/^(\d+)( use cases · )(\d+)( with AI)$/)
      return { _type: 'vcIndustryGrid', ...base, head: headOf(sec), labelTemplate: m ? `{count}${m[2]}{ai}${m[4]}` : '{count} use cases · {ai} with AI' }
    }
    if (ds === 'catalogue') {
      const rows = sec.querySelectorAll('.frow')
      const own = sec.querySelector('.uc .uc-top .label')
      return {
        _type: 'vcCatalogue', ...base, head: headOf(sec),
        departmentLabel: text(rows[0].querySelector('.label')), allDepartmentsLabel: text(rows[0].querySelector('.tabs button')),
        searchLabel: text(rows[1].querySelector('label')), searchPlaceholder: decode(rows[1].querySelector('input')?.getAttribute('placeholder') ?? ''),
        filterLabel: text(rows[2].querySelector('.label')), aiOnlyLabel: text(rows[2].querySelector('label.ftog')),
        countAll: 'Showing all {total} use cases', countFiltered: 'Showing {shown} of {total} matching use cases',
        emptyText: text(sec.querySelector('#empty')), ownLabel: text(own), aiLabel: text(sec.querySelector('.uc .tag.ai')),
        linkLabel: text(sec.querySelector('.uc a.link')), moreLabel: 'Show more',
        overrides: sec.querySelectorAll('article.uc').map((a) => {
          const title = text(a.querySelector('h3'))
          const hit = useCaseByTitle(title)
          if (!hit) { warnings.push(`ai-use-cases: tile not in catalogue: ${title}`); return null }
          const metric = text(a.querySelector('.uc-top .tag:not(.ai)')) || undefined
          return keyed('vcTileOverride', { id: hit.id, title, summary: text(a.querySelector('p.body')), metric })
        }).filter(Boolean),
      }
    }
  }
  return null
}

async function fetchLive(path: string) {
  try {
    const res = await fetch(`${LIVE}${path}`, { headers: { 'user-agent': 'Mozilla/5.0 (fruition vc migrate)' } })
    if (!res.ok) return null
    return parse(await res.text())
  } catch {
    return null
  }
}

async function main() {
  if (!SLUGS.length) throw new Error('--slugs required')
  const shared: Doc[] = await client.fetch(`*[_type in ["vcCase", "vcQuote", "vcStory"] && !(_id in path("drafts.**"))]`)
  // Asset refs in Sanity are real ids; map them back to the placeholder form the parser emits.
  const back = new Map(Object.entries(assetCache).map(([h, id]) => [id, `__asset:${h}`]))
  existingShared = new Map(shared.map((d) => [d._id, canon(JSON.parse(JSON.stringify(d), (k, v) => (k === '_ref' && back.has(v) ? back.get(v) : v)))]))
  liveFaqs = await client.fetch(`*[_type == "faqItem" && !(_id in path("drafts.**"))]{ _id, question, answer, pages }`)
  const pages: Doc[] = []
  for (const slug of SLUGS) {
    const entry = PAGES[slug]
    if (!entry) throw new Error(`unknown slug ${slug}`)
    const [path, group] = entry
    const file = slug === 'monday-implementation-consultants' ? join(MOCKUPS, 'c.html') : join(MOCKUPS, 'p', `${slug}.html`)
    const root = parse(readFileSync(file, 'utf8'))
    const live = await fetchLive(path)
    const html = readFileSync(file, 'utf8')
    const ctx: Ctx = { slug, file, path, live, scripts: [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]) }
    const secs = root.querySelectorAll('body > section, main > section')
    const out: Record<string, unknown>[] = []
    for (const sec of secs) {
      const s = (await coreSection(sec, ctx)) ?? section(sec, ctx) ?? (await extraSection(sec, ctx))
      if (!s && process.env.VC_LIST_UNKNOWN) { console.log(`UNKNOWN ${slug}: ${sec.getAttribute('class') ?? ''} ${sec.getAttribute('data-sec')} :: ${sec.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 300).replace(/\s+/g, ' ')}`); continue }
      if (!s) throw new Error(`${slug}: unknown section ${sec.getAttribute('class') ?? ''} data-sec=${sec.getAttribute('data-sec')}\n${sec.outerHTML.slice(0, 400)}`)
      out.push(JSON.parse(JSON.stringify(s)))
    }
    if (slug === 'ask-fruit') {
      const fix = (v: unknown): void => {
        if (Array.isArray(v)) v.forEach(fix)
        else if (v && typeof v === 'object') {
          const o = v as Record<string, unknown>
          if (o.href === '#tool') o.href = '/ask-fruit/workspace'
          Object.values(o).forEach(fix)
        }
      }
      fix(out)
    }
    const seoTitle = live ? text(live.querySelector('title')) : undefined
    const seoDescription = live?.querySelector('meta[name="description"]')?.getAttribute('content') ?? undefined
    if (!seoTitle) warnings.push(`${slug}: could not read live title`)
    const all = JSON.stringify(out)
    if (/[\u2013\u2014]/.test(all)) warnings.push(`${slug}: page copy contains an em/en dash`)
    pages.push({
      _id: `vcPage-${slug}`, _type: 'vcPage', title: text(root.querySelector('title')).replace(/^Version C:\s*/, ''),
      path, group, seoTitle, seoDescription: seoDescription ? decode(seoDescription) : undefined, sections: out,
    })
    console.log(`${slug}: ${out.map((s) => String(s._type).replace('vc', '')).join(' > ')}`)
  }

  const report = {
    pages: pages.length,
    shared: [...sharedDocs.keys()],
    newFaqs: newFaqs.map((f) => f.question),
    faqPatches: faqPatches.map((p) => ({ id: p.id, was: p.was.slice(0, 160), now: p.now.slice(0, 160) })),
    uploads: new Set(pendingUploads.map((p) => p.file)).size,
    practitioner: practitionerShared ? { name: practitionerShared.name, facts: (practitionerShared.facts as unknown[]).length } : undefined,
    warnings,
  }
  writeFileSync(OUT, JSON.stringify({ report, pages, shared: [...sharedDocs.values()], newFaqs, faqPatches }, null, 1))
  console.log(JSON.stringify({ ...report, faqPatches: report.faqPatches.length }, null, 1))
  console.log(`written ${OUT}`)
  if (!APPLY) return

  // createOrReplace below rebuilds each page from its mock-up and would drop sections that exist on
  // one page only (docs/version-c.md "Page-specific sections"). Refuse unless explicitly overridden.
  const pageIds = pages.map((p) => p._id)
  const kept = await client.fetch<{ _id: string; path: string; keys: string[] }[]>(
    `*[_id in $ids]{ _id, path, "keys": sections[pageSpecific == true || _key match "pagespecific-*"]._key }[count(keys) > 0]`,
    { ids: pageIds },
  )
  if (kept.length && !process.argv.includes('--drop-page-specific')) {
    for (const p of kept) console.error(`${p.path} has page-specific sections: ${p.keys.join(', ')}`)
    console.error('Refusing to replace these pages. Re-add those sections after migrating, or pass --drop-page-specific and update src/data/vcPageSpecificSections.ts.')
    process.exit(1)
  }
  // Same for per-page "Who leads it" leaders and fixed booking desks (docs/version-c.md
  // "Per-page leaders and booking desks"): the mock-ups carry neither.
  const pinned = await client.fetch<{ path: string }[]>(
    `*[_id in $ids && count(sections[defined(leader.person) || defined(desk)]) > 0]{ path }`,
    { ids: pageIds },
  )
  if (pinned.length && !process.argv.includes('--drop-page-leaders')) {
    for (const p of pinned) console.error(`${p.path} has its own leader or booking desk`)
    console.error('Refusing to replace these pages. Re-run scripts/sanity-migrate/partner-page-leaders.ts --apply after migrating, or pass --drop-page-leaders.')
    process.exit(1)
  }

  await uploadAll()
  const tx = client.transaction()
  for (const d of [...sharedDocs.values(), ...newFaqs, ...pages]) tx.createOrReplace(resolveAssets(d) as Doc)
  for (const p of faqPatches) tx.patch(p.id, (q) => q.set({ answer: p.answer }))
  // --keep-shared-practitioner: pages whose snapshot heading differs (old page copy) must not overwrite the shared block
  if (practitionerShared && !process.argv.includes('--keep-shared-practitioner')) {
    tx.createIfNotExists({ _id: 'vcShared', _type: 'vcShared' })
    tx.patch('vcShared', (q) => q.set({ practitioners: resolveAssets({ _type: 'object', ...practitionerShared }) }))
  }
  const res = await tx.commit()
  console.log(`committed ${res.results.length} mutations`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
