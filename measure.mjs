import { chromium } from 'playwright'
const BASE = 'http://localhost:3141'
const routes = ['/monday-partner-australia', '/', '/monday-for-construction', '/monday-partner-uk', '/monday-partner-us']
const browser = await chromium.launch({ channel: 'chromium' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
for (const r of routes) {
  const page = await ctx.newPage()
  await page.goto(BASE + r, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(x => setTimeout(x, 40)) } })
  await page.waitForTimeout(800)
  const h = await page.evaluate(() => ({ h: document.body.scrollHeight, w: document.documentElement.scrollWidth }))
  console.log(`${r.padEnd(32)} ${String(h.h).padStart(7)}px  (${Math.round(h.h/844)} screens)  scrollW=${h.w}`)
  await page.close()
}
await browser.close()
