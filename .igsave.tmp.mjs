import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chromium' })
const ctx = await b.newContext({ storageState: '.portal-state.tmp.json', viewport: { width: 1500, height: 1200 } })
const p = await ctx.newPage()
const seen = []
p.on('response', async r => {
  if (r.url().includes('/api/internal/social/compose')) {
    let body=''; try { body = (await r.text()).slice(0,1200) } catch {}
    seen.push({ m: r.request().method(), u: r.url(), s: r.status(), req: (r.request().postData()||'').slice(0,900), res: body })
  }
})
await p.goto('https://www.fruitionservices.io/internal/social/new', { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(1200)
await p.getByText('Instagram', { exact: true }).first().click()
await p.waitForTimeout(1200)
for (const n of [1,2,3,4]) {
  await p.locator('input[type=file][accept="image/*"]').last().setInputFiles(`.slide${n}.tmp.png`)
  await p.waitForTimeout(6000)
}
await p.locator('textarea').first().fill('Carousel verification for monday 2850486271 - four ordered slides. Safe to delete.')
await p.locator('input[placeholder*="Name this post"]').fill('TEMP carousel verification 2850486271')
await p.waitForTimeout(600)
await p.getByRole('button', { name: /Save draft/i }).click()
await p.waitForTimeout(6000)
console.log('URL now:', p.url())
console.log(JSON.stringify(seen, null, 1))
await b.close()
