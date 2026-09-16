import { chromium } from 'playwright'
import fs from 'node:fs'
const BASE = 'http://localhost:3141'
const OUT = '/tmp/shots2'
fs.mkdirSync(OUT, { recursive: true })
const HIDE = `[class*="rb2b" i],[id*="rb2b" i],.fixed.inset-x-0.bottom-0,[href*="wa.me"]{display:none!important}`

const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const browser = await chromium.launch({ channel: 'chromium' })
for (const j of jobs) {
  const ctx = await browser.newContext({ viewport: { width: j.w ?? 390, height: j.h ?? 900 }, deviceScaleFactor: 2, isMobile: (j.w ?? 390) < 768, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(BASE + j.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.addStyleTag({ content: HIDE })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0,0) })
  await page.waitForTimeout(1200)
  if (j.sel) {
    const box = await page.evaluate((s) => {
      // Support "heading:<text>" so a section can be found by its own h2.
      let el
      if (s.startsWith('heading:')) {
        const want = s.slice(8)
        el = [...document.querySelectorAll('section')].find((n) => {
          const h = n.querySelector('h2,h1,h3')
          return h && h.textContent.trim().startsWith(want)
        })
      } else el = document.querySelector(s)
      if (!el) return null
      el.scrollIntoView({ block: 'start', behavior: 'instant' })
      const r = el.getBoundingClientRect()
      return { x: Math.max(0, r.x + scrollX), y: Math.max(0, r.y + scrollY), width: Math.min(r.width, innerWidth), height: Math.min(r.height, 4000) }
    }, j.sel)
    if (!box) { console.log(j.name, 'SEL NOT FOUND'); await ctx.close(); continue }
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/${j.name}.png`, fullPage: true, clip: box })
  } else {
    await page.screenshot({ path: `${OUT}/${j.name}.png`, fullPage: !!j.full })
  }
  console.log(j.name, 'ok')
  await ctx.close()
}
await browser.close()
