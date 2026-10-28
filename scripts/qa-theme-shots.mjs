#!/usr/bin/env node
/**
 * Theme QA: above-the-fold screenshots at 375 / 768 / 1440 for a sample of
 * pages built on the shared layer, plus a horizontal-overflow check
 * (scrollWidth <= innerWidth) at every width.
 *
 *   node scripts/qa-theme-shots.mjs <label> [--base http://localhost:3000] [--out dir] [--full]
 *
 * Writes <out>/theme-<label>-<page>-<width>.png. `--full` also captures a
 * full-page shot at each width. Exits 1 when any page overflows.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const PAGES = [
  ['practice', '/atlassian-consulting'],
  ['industry', '/monday-for-government'],
  ['industry-practice', '/industries/healthcare'],
  ['region', '/monday-partner-australia'],
  ['partnership', '/partnerships/monday-consulting-partner'],
  ['team', '/fruition-team'],
  ['about', '/about-us'],
  ['blog-post', '/post/base44-vs-lovable'],
  ['implementation-consultants', '/monday-implementation-consultants'],
  ['marketing', '/monday-for-marketing'],
  ['testimonials', '/customer-testimonials'],
]
const WIDTHS = [
  [375, 812],
  [768, 1024],
  [1440, 900],
]

const arg = (name) => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : undefined
}
const label = process.argv[2]
if (!label || label.startsWith('--')) {
  console.error('usage: node scripts/qa-theme-shots.mjs <label> [--base url] [--out dir] [--full]')
  process.exit(2)
}
const base = arg('--base') ?? 'http://localhost:3000'
const outDir = path.resolve(arg('--out') ?? 'qa/theme')
const full = process.argv.includes('--full')
const only = arg('--only')?.split(',')
await mkdir(outDir, { recursive: true })

// PW_CHROMIUM_PATH points at another Chromium build when the bundled one is
// missing from the Playwright cache.
const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH
    ? { executablePath: process.env.PW_CHROMIUM_PATH }
    : { channel: 'chromium' },
)
const failures = []

for (const [name, route] of PAGES) {
  if (only && !only.includes(name)) continue
  for (const [width, height] of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    const page = await ctx.newPage()
    try {
      await page.goto(base + route, { waitUntil: 'load', timeout: 120000 })
    } catch (err) {
      console.error(`  ${route} @${width}: goto failed: ${err.message}`)
      failures.push(`${route}@${width} load`)
      await ctx.close()
      continue
    }
    // Dismiss the cookie notice so it does not cover the fold.
    await page
      .locator('button:has-text("Accept"), button:has-text("Got it"), button:has-text("OK")')
      .first()
      .click({ timeout: 1500 })
      .catch(() => {})
    await page.waitForTimeout(1200)
    const { sw, iw, h1 } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
      h1: document.querySelector('h1')?.getBoundingClientRect().top ?? -1,
    }))
    const overflow = sw > iw
    if (overflow) failures.push(`${route}@${width} overflow ${sw}>${iw}`)
    console.log(`${overflow ? 'FAIL' : 'ok  '} ${route} @${width} scrollWidth=${sw} h1Top=${Math.round(h1)}`)
    const file = path.join(outDir, `theme-${label}-${name}-${width}.png`)
    await page.screenshot({ path: file })
    if (full) {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 60))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(500)
      await page.screenshot({
        path: path.join(outDir, `theme-${label}-${name}-${width}-full.png`),
        fullPage: true,
      })
    }
    await ctx.close()
  }
}

await browser.close()
if (failures.length) {
  console.error('\nFailures:\n  ' + failures.join('\n  '))
  process.exit(1)
}
console.log('\nNo horizontal overflow at 375 / 768 / 1440.')
