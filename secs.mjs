import { chromium } from 'playwright'
const BASE = 'http://localhost:3141'
const browser = await chromium.launch({ channel: 'chromium' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
for (const r of ['/monday-partner-australia', '/']) {
  const page = await ctx.newPage()
  await page.goto(BASE + r, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(x => setTimeout(x, 40)) } })
  await page.waitForTimeout(800)
  const s = await page.evaluate(() => {
    const out = []
    document.querySelectorAll('section').forEach((el) => {
      if (el.querySelector('section')) return
      const h = el.getBoundingClientRect().height
      if (h < 400) return
      const head = el.querySelector('h1,h2,h3')
      out.push({ h: Math.round(h), head: (head?.textContent || el.id || '').trim().replace(/\s+/g,' ').slice(0, 52) })
    })
    return out.sort((a,b)=>b.h-a.h).slice(0, 10)
  })
  console.log(`\n##### ${r}`)
  s.forEach(x => console.log(String(x.h).padStart(7) + 'px  ' + x.head))
  await page.close()
}
await browser.close()
