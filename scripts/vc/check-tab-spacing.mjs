#!/usr/bin/env node
/**
 * Finds tab, filter and pill rows that sit flush on the content below them.
 *
 *   node scripts/vc/check-tab-spacing.mjs [baseUrl] [width]
 *   (defaults: https://www.fruitionservices.io, 1440; also run it at 375)
 *
 * Why: a Version C `.tabs` row only has space above it. The block that
 * follows must supply the gap, and twice it did not (the /fruition-team
 * panels, the /partnerships directory tiles). This walks every page in the
 * live sitemap (plus three blog posts), measures the gap from each row to the
 * next visible sibling, and exits 1 if any is under 16px.
 *
 * Uses the installed Google Chrome through Playwright (`channel: 'chrome'`).
 */
import { chromium } from 'playwright'

const base = (process.argv[2] || 'https://www.fruitionservices.io').replace(/\/$/, '')
const width = Number(process.argv[3] || 1440)
const MIN_GAP = 16

const xml = await (await fetch('https://www.fruitionservices.io/sitemap.xml')).text()
let paths = [...xml.matchAll(/<loc>https:\/\/www\.fruitionservices\.io([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
const posts = paths.filter((p) => p.startsWith('/post/'))
paths = [...new Set([...paths.filter((p) => !p.startsWith('/post/')), ...posts.slice(0, 3)])]

const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({ viewport: { width, height: 900 } })
const rows = []
const errors = []
let next = 0

async function worker() {
  const page = await ctx.newPage()
  while (next < paths.length) {
    const path = paths[next++]
    try {
      await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForTimeout(400)
      const found = await page.evaluate(() => {
        const visible = (e) => {
          const r = e.getBoundingClientRect()
          const cs = getComputedStyle(e)
          return r.height > 0 && r.width > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.position !== 'absolute'
        }
        const candidates = new Set(document.querySelectorAll('[role="tablist"], .tabs, .filters, .chips'))
        for (const e of document.querySelectorAll('div, nav, ul')) {
          const kids = [...e.children]
          if (kids.length < 3) continue
          const buttons = kids.filter((k) => k.matches('button, [role="tab"]'))
          if (buttons.length >= 3 && buttons.length / kids.length > 0.8 && getComputedStyle(e).display.includes('flex')) candidates.add(e)
        }
        const out = []
        for (const row of candidates) {
          if (!visible(row) || row.closest('header, footer, [role="dialog"]')) continue
          let sib = row.nextElementSibling
          while (sib && !visible(sib)) sib = sib.nextElementSibling
          if (!sib) continue
          // Side-by-side layouts (a list beside its detail panel) are not stacked rows.
          const rb = row.getBoundingClientRect(), sb = sib.getBoundingClientRect()
          if (sb.left >= rb.right - 1 || sb.right <= rb.left + 1 || sb.bottom <= rb.top) continue
          out.push({
            section: row.closest('[data-sec]')?.getAttribute('data-sec') || '',
            row: String(row.className || row.tagName).slice(0, 40),
            next: String(sib.className || sib.tagName).slice(0, 40),
            gap: Math.round(sib.getBoundingClientRect().top - row.getBoundingClientRect().bottom),
          })
        }
        return out
      })
      for (const r of found) rows.push({ path, ...r })
    } catch (e) {
      errors.push(`${path}: ${String(e).slice(0, 100)}`)
    }
  }
  await page.close()
}

await Promise.all(Array.from({ length: 6 }, worker))
await browser.close()

const flush = rows.filter((r) => r.gap < MIN_GAP)
console.log(`${paths.length} pages, ${rows.length} rows checked at ${width}px, ${errors.length} errors, ${flush.length} under ${MIN_GAP}px`)
for (const r of flush) console.log(`  ${r.gap}px  ${r.path}  [${r.section}] .${r.row} -> .${r.next}`)
for (const e of errors) console.log(`  error  ${e}`)
process.exit(flush.length || errors.length ? 1 : 0)
