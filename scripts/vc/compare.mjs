#!/usr/bin/env node
/**
 * Screenshot a Version C page next to its approved mock-up, section by section.
 *
 *   node scripts/vc/compare.mjs --base http://localhost:3110 --mockups ../vc-mockups/review \
 *     --page monday-for-retail:/monday-for-retail [--widths 1440,390] [--out /tmp/vc-cmp]
 *
 * For each width it writes <out>/<slug>-<w>-site.png and -mock.png (full page,
 * site chrome and floating widgets hidden) plus a JSON report: section count,
 * section heights, horizontal overflow, broken images and console errors.
 * Run from the repo root so Node resolves the repo's playwright.
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const arg = (k, d) => {
  const i = args.indexOf(k)
  return i >= 0 ? args[i + 1] : d
}
const base = arg('--base', 'http://localhost:3110')
const mock = resolve(arg('--mockups', '../vc-mockups/review'))
const widths = arg('--widths', '1440,390').split(',').map(Number)
const out = resolve(arg('--out', '/tmp/vc-cmp'))
const pages = args.flatMap((a, i) => (args[i - 1] === '--page' ? [a] : []))
mkdirSync(out, { recursive: true })

const HIDE_SITE = `
  header, nav[aria-label], footer, [class*="fixed"], [style*="position: fixed"], .cookie, #CybotCookiebotDialog { display:none !important }
  nextjs-portal { display:none !important }
`
const HIDE_MOCK = `.ann, header.nav, footer, .footer { display:none !important }`

async function measure(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.vc') ?? document.body
    const secs = [...root.querySelectorAll(':scope > section, body > section')].map((s) => ({
      cls: s.className, sec: s.getAttribute('data-sec'), h: Math.round(s.getBoundingClientRect().height),
    }))
    const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.closest('.vc, body')).map((i) => i.src.slice(0, 120))
    const texts = []
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const p = n.parentElement
      if (!p || p.closest('script,style,svg,noscript,header.nav,.ann,footer,.footer,[aria-hidden="true"]')) continue
      const t = n.textContent.replace(/\s+/g, ' ').trim()
      if (t.length >= 2) texts.push(t)
    }
    return { overflow: document.documentElement.scrollWidth - window.innerWidth, secs, broken, texts }
  })
}

// The repo's pinned full Chromium build is often missing locally; the cached
// headless shell works. Override with CHROME=/path/to/binary.
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
function findShell() {
  if (process.env.CHROME) return process.env.CHROME
  const dir = join(homedir(), 'Library/Caches/ms-playwright')
  if (!existsSync(dir)) return undefined
  for (const d of readdirSync(dir).filter((x) => x.startsWith('chromium_headless_shell')).sort().reverse()) {
    const bin = join(dir, d, 'chrome-headless-shell-mac-arm64/chrome-headless-shell')
    if (existsSync(bin)) return bin
  }
}
const executablePath = findShell()
const browser = await chromium.launch(executablePath ? { executablePath } : { channel: 'chromium' })
const report = {}
for (const spec of pages) {
  const [slug, path] = spec.split(':')
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)))
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))
    await page.goto(`${base}${path}`, { waitUntil: 'load', timeout: 120000 })
    await page.waitForTimeout(2500)
    await page.addStyleTag({ content: HIDE_SITE })
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(800)
    const site = await measure(page)
    const vc = await page.$('.vc')
    if (vc) await vc.screenshot({ path: join(out, `${slug}-${w}-site.png`) })

    const file = slug === 'monday-implementation-consultants' ? join(mock, 'c.html') : join(mock, 'p', `${slug}.html`)
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' })
    await page.addStyleTag({ content: HIDE_MOCK })
    await page.waitForTimeout(500)
    const m = await measure(page)
    await page.screenshot({ path: join(out, `${slug}-${w}-mock.png`), fullPage: true })
    const norm = (t) => t.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[^a-z0-9$%+.]+/g, ' ').trim()
    const sAll = ' ' + site.texts.map(norm).join(' ') + ' '
    const mAll = ' ' + m.texts.map(norm).join(' ') + ' '
    const missing = [...new Set(m.texts)].filter((t) => norm(t).length > 2 && !sAll.includes(' ' + norm(t) + ' ') && !sAll.includes(norm(t)))
    const extra = [...new Set(site.texts)].filter((t) => norm(t).length > 2 && !mAll.includes(norm(t)))
    delete site.texts; delete m.texts
    report[`${slug}@${w}`] = { site, mock: m, errors, missing, extra }
    await ctx.close()
  }
}
await browser.close()
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1))
for (const [k, v] of Object.entries(report)) {
  const pair = v.site.secs.map((s, i) => `${s.sec ?? '?'}:${s.h}/${v.mock.secs[i]?.h ?? '-'}`).join(' ')
  console.log(`${k} overflow=${v.site.overflow} broken=${v.site.broken.length} errors=${v.errors.length} secs ${v.site.secs.length}/${v.mock.secs.length}\n  ${pair}`)
  if (v.errors.length) console.log('  ' + v.errors.slice(0, 5).join('\n  '))
  if (v.missing.length) console.log(`  TEXT missing on site (${v.missing.length}): ` + v.missing.slice(0, 12).map((t) => JSON.stringify(t.slice(0, 70))).join(' | '))
  if (v.extra.length) console.log(`  TEXT only on site (${v.extra.length}): ` + v.extra.slice(0, 12).map((t) => JSON.stringify(t.slice(0, 70))).join(' | '))
  if (v.site.broken.length) console.log('  broken: ' + v.site.broken.slice(0, 5).join(' '))
}
