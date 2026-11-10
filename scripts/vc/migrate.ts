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
  /** Use case catalogue industry of this page, learned from its "See the build" cards. */
  catalogueSlug?: string
  slug: string
  file: string
  path: string
  live: HTMLElement | null
}

function liveHref(ctx: Ctx, label: string): string | undefined {
  if (!ctx.live) return undefined
  const a = ctx.live.querySelectorAll('a').find((x) => text(x).toLowerCase() === label.toLowerCase())
  return a?.getAttribute('href') ?? undefined
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
  return { _type: 'vcLogo', _key: key(), image: imageFromSrc(img.getAttribute('src'), ctx.file), alt }
}

const tone = (sec: HTMLElement) => (has(sec, 'alt') ? 'alt' : 'plain')

function hero(sec: HTMLElement, ctx: Ctx) {
  const left = sec.querySelector('.hero-grid > div')!
  const art = sec.querySelector('.hero-art')
  const s: Record<string, unknown> = {
    _type: 'vcHero',
    _key: key(),
    variant: cls(sec).filter((c) => c !== 'hero').join(' ') || undefined,
    badge: text(left.querySelector('.badge')) || undefined,
    heading: rich(left.querySelector('h1')),
    lead: text(left.querySelector('.lead')) || undefined,
    ctas: left.querySelectorAll('.ctas a').map((a) => cta(a, ctx)),
  }
  const img3d = art?.querySelector('img.hero-3d')
  if (img3d) {
    s.art = imageFromSrc(img3d.getAttribute('src'), ctx.file)
    s.artClass = cls(img3d).filter((c) => c !== 'hero-3d').join(' ') || undefined
  }
  const badge = art?.querySelector('.ph-badge img')
  if (badge) {
    s.floatBadge = imageFromSrc(badge.getAttribute('src'), ctx.file)
    s.floatBadgeAlt = decode(badge.getAttribute('alt') ?? '')
  }
  const frame = art?.querySelector('.frame')
  if (frame) {
    s.creds = frame.querySelectorAll('.creds img').map((i) => logo(i, ctx))
    const shot = frame.querySelectorAll('img').find((i) => !i.closest('.creds'))
    if (shot) s.frameImage = imageFromSrc(shot.getAttribute('src'), ctx.file, decode(shot.getAttribute('alt') ?? ''))
    s.chipValue = text(frame.querySelector('.chip b')) || undefined
    s.chipLabel = text(frame.querySelector('.chip .label')) || undefined
  }
  const stats = sec.querySelectorAll('.stats .stat')
  if (stats.length)
    s.stats = stats.map((st) => ({ _type: 'vcStat', _key: key(), value: rich(st.querySelector('b')), label: text(st.querySelector('p')) }))
  const trust = sec.querySelector('.hm-trust')
  if (trust) {
    s.trustLabel = text(trust.querySelector('.hm-trust-h .label')) || undefined
    const run = trust.querySelector('.hm-run')
    s.trustLogos = run?.querySelectorAll('img').map((i) => logo(i, ctx))
  }
  if (!img3d && !frame) warnings.push(`${ctx.slug}: hero has no 3D graphic or frame`)
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
  const shot = card.querySelector('.shot img, .pc2-img img, .pichd img')
  if (shot) it.image = imageFromSrc(shot.getAttribute('src'), ctx.file, decode(shot.getAttribute('alt') ?? '') || undefined)
  const first = card.childNodes.find((n) => (n as HTMLElement).tagName && !has(n as HTMLElement, 'shot') && !has(n as HTMLElement, 'pichd') && !has(n as HTMLElement, 'pc2-img')) as HTMLElement | undefined
  if (first && has(first, 'label')) it.label = text(first)
  const top = card.querySelector('.top')
  if (top) {
    it.title = text(top.querySelector('h3')) || undefined
    it.ai = !!top.querySelector('.ai')
  } else it.title = text(card.querySelector('h3')) || undefined
  it.body = text(card.querySelector('p.body, p.small')) || undefined
  const tg = card.querySelectorAll('.tags span, .pills span')
  if (tg.length) it.tags = tg.map((t) => text(t))
  const last = card.querySelectorAll(':scope > span.label').pop()
  if (last && last !== first) it.meta = text(last)
  const link = card.querySelector('a.link')
  if (link) {
    it.linkLabel = text(link)
    const href = link.getAttribute('href')
    if (href && href !== '#') it.href = href
    else {
      const hit = useCaseByTitle(String(it.title ?? ''))
      if (hit) {
        it.href = `/ai-use-cases/${hit.slug}#${hit.id}`
        ctx.catalogueSlug ??= hit.slug
      } else {
        it.href = liveHref(ctx, text(link)) ?? '#'
        if (it.href === '#') warnings.push(`${ctx.slug}: no link for card "${it.title}"`)
      }
    }
  }
  return it
}

function section(sec: HTMLElement, ctx: Ctx): Record<string, unknown> | null {
  const base = { _key: key(), tone: tone(sec), ...(sec.getAttribute('id') && sec.getAttribute('id') !== 'book' && sec.getAttribute('id') !== 'faq' ? { anchor: sec.getAttribute('id') } : {}) }
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
    return {
      _type: 'vcBooking', _key: key(), badge: text(l.querySelector('.badge')), heading: rich(l.querySelector('h2')),
      lead: text(l.querySelector('.lead')) || undefined, ...(calTitle && calTitle !== 'Discovery call' ? { calTitle } : {}),
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
  if (sec.querySelector('.quotes.mq')) {
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
    return { _type: 'vcLogos', ...base, head: headOf(sec), logos: sec.querySelectorAll('.logos img').map((i) => logo(i, ctx)), more: text(sec.querySelector('.logos .more')) || undefined }
  }
  const steps = sec.querySelector('.steps, .steps4, .steps5')
  if (steps) {
    return {
      _type: 'vcSteps', ...base, head: headOf(sec), layout: cls(steps)[0],
      items: steps.querySelectorAll('.step').map((st) => ({
        _type: 'vcStep', _key: key(), n: text(st.querySelector('.n')) || undefined, title: text(st.querySelector('h3')) || undefined,
        body: text(st.querySelector('.body')) || undefined, meta: text(st.querySelector(':scope > .label')) || undefined,
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
    const layout = c === 'cards3' && has(first, 'oc') ? 'oc' : grid.querySelector('.card .top') ? 'ucpills' : c
    const imageFrame = grid.querySelector('.pichd') ? 'pichd' : undefined
    const tagClass = grid.querySelector('.tags span.label') ? 'label' : undefined
    const sectionClass = cls(sec).filter((c) => c !== 'alt').join(' ') || undefined
    return {
      _type: 'vcCards', ...base, head: headOf(sec), layout, imageFrame, tagClass, sectionClass,
      items: grid.querySelectorAll(':scope > article, :scope > div, :scope > a').map((x) => item(x, ctx)),
    }
  }
  if (sec.querySelector('.josh')) return { _type: 'vcPractitioners', ...base }
  return null
}

/* ---------------------------------------------------------------- main */

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
  const shared: Doc[] = await client.fetch(`*[_type in ["vcCase", "vcQuote"] && !(_id in path("drafts.**"))]`)
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
    const ctx: Ctx = { slug, file, path, live }
    const secs = root.querySelectorAll('body > section, main > section')
    const out: Record<string, unknown>[] = []
    for (const sec of secs) {
      const s = section(sec, ctx)
      if (!s) throw new Error(`${slug}: unknown section ${sec.getAttribute('class') ?? ''} data-sec=${sec.getAttribute('data-sec')}\n${sec.outerHTML.slice(0, 400)}`)
      out.push(JSON.parse(JSON.stringify(s)))
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
    warnings,
  }
  writeFileSync(OUT, JSON.stringify({ report, pages, shared: [...sharedDocs.values()], newFaqs, faqPatches }, null, 1))
  console.log(JSON.stringify({ ...report, faqPatches: report.faqPatches.length }, null, 1))
  console.log(`written ${OUT}`)
  if (!APPLY) return

  await uploadAll()
  const tx = client.transaction()
  for (const d of [...sharedDocs.values(), ...newFaqs, ...pages]) tx.createOrReplace(resolveAssets(d) as Doc)
  for (const p of faqPatches) tx.patch(p.id, (q) => q.set({ answer: p.answer }))
  const res = await tx.commit()
  console.log(`committed ${res.results.length} mutations`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
