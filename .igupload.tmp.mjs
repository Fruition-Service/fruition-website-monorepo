import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chromium' })
const ctx = await b.newContext({ storageState: '.portal-state.tmp.json', viewport: { width: 1500, height: 1200 } })
const p = await ctx.newPage()
const reqs = []
p.on('request', r => { if (r.url().includes('/api/internal/social')) reqs.push([r.method(), r.url()]) })
await p.goto('https://www.fruitionservices.io/internal/social/new', { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(1200)
await p.getByText('Instagram', { exact: true }).first().click()
await p.waitForTimeout(1200)

for (const n of [1,2,3,4]) {
  await p.locator('input[type=file][accept="image/*"]').last().setInputFiles(`.slide${n}.tmp.png`)
  await p.waitForTimeout(6000)
  const t = await p.locator('body').innerText()
  const m = t.match(/IMAGES[^\n]*/i)
  console.log(`after upload ${n}:`, m ? m[0] : 'n/a')
}
// caption
const ta = p.locator('textarea').first()
await ta.click(); await ta.fill('Carousel verification for monday 2850486271 — four ordered slides.')
await p.waitForTimeout(800)
await p.screenshot({ path: '.shot-ig4.tmp.png', fullPage: true })
console.log('REQS:', JSON.stringify(reqs))
await b.close()
