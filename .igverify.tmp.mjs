import { chromium } from 'playwright'
const link = process.argv[2]
const b = await chromium.launch({ channel: 'chromium' })
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } })
const p = await ctx.newPage()
await p.goto(link, { waitUntil: 'networkidle', timeout: 60000 })
console.log('URL after confirm:', p.url())
await p.waitForTimeout(2500)
console.log('URL settled:', p.url())
console.log('TITLE:', await p.title())
await ctx.storageState({ path: '.portal-state.tmp.json' })
await p.screenshot({ path: '.shot-composer.tmp.png', fullPage: true })
console.log('BODY SNIPPET:', (await p.locator('body').innerText()).slice(0, 800))
await b.close()
