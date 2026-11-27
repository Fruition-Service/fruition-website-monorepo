import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chromium' })
const p = await b.newPage({ viewport: { width: 1080, height: 1080 } })
const colors = [['1','#0f172a'],['2','#7c3aed'],['3','#0ea5e9'],['4','#f59e0b']]
for (const [n,c] of colors) {
  await p.setContent(`<body style="margin:0;width:1080px;height:1080px;background:${c};display:flex;align-items:center;justify-content:center;font:700 400px system-ui;color:#fff">${n}</body>`)
  await p.screenshot({ path: `.slide${n}.tmp.png` })
}
await b.close()
console.log('ok')
