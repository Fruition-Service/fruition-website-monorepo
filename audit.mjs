import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = 'http://localhost:3141'
const ROUTES = fs.readFileSync('/tmp/routes.txt', 'utf8').trim().split('\n')

/** Suppress the overlays that sit on every page so they don't mask findings. */
const HIDE = `
  [class*="rb2b" i],[id*="rb2b" i],
  .fixed.inset-x-0.bottom-0,
  [class*="whatsapp" i],[href*="wa.me"] { display:none !important; }
`

const audit = () => {
  const vw = document.documentElement.clientWidth
  const res = { overflow: [], tiny: [], tap: [], tall: [], img: [] }
  const seen = new Set()

  const label = (el) => {
    const id = el.id ? `#${el.id}` : ''
    const cls = typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 42)
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 90) + (txt ? ` « ${txt} »` : '')
  }

  // 1. Anything painting past the right edge of the viewport.
  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return

    // Elements sticking out past the viewport, ignoring deliberate decorative
    // bleed (absolutely positioned glows inside an overflow:hidden parent).
    if (r.right > vw + 1 || r.left < -1) {
      let clipped = false
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const pcs = getComputedStyle(p)
        if (pcs.overflow !== 'visible' || pcs.overflowX !== 'visible') { clipped = true; break }
      }
      const k = label(el)
      if (!clipped && !seen.has('o' + k)) {
        seen.add('o' + k)
        res.overflow.push({ el: k, right: Math.round(r.right), left: Math.round(r.left), vw })
      }
    }

    // 2. Body copy under 13px.
    const fs_ = parseFloat(cs.fontSize)
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 12)
    if (ownText && fs_ < 13 && cs.textTransform !== 'uppercase') {
      const k = label(el)
      if (!seen.has('t' + k)) { seen.add('t' + k); res.tiny.push({ el: k, px: fs_ }) }
    }

    // 3. Tap targets under 40px in either axis.
    if (['A', 'BUTTON'].includes(el.tagName) || el.getAttribute('role') === 'button') {
      const inNav = el.closest('nav,header,footer')
      if (!inNav && (r.height < 40 || r.width < 40) && (el.textContent || '').trim()) {
        const k = label(el)
        if (!seen.has('p' + k)) { seen.add('p' + k); res.tap.push({ el: k, w: Math.round(r.width), h: Math.round(r.height) }) }
      }
    }
  })

  // 4. Sections taller than ~4 phone screens.
  document.querySelectorAll('section').forEach((el) => {
    const h = el.getBoundingClientRect().height
    if (h > 3400) res.tall.push({ el: label(el), h: Math.round(h) })
  })

  // 5. Images served far larger than they render.
  document.querySelectorAll('img').forEach((im) => {
    const r = im.getBoundingClientRect()
    if (r.width > 0 && im.naturalWidth > r.width * 3.5 && im.naturalWidth > 700) {
      res.img.push({ src: (im.currentSrc || im.src).slice(-70), natural: im.naturalWidth, css: Math.round(r.width) })
    }
  })

  res.docScrollW = document.documentElement.scrollWidth
  res.vw = vw
  res.pageH = document.body.scrollHeight
  return res
}

const browser = await chromium.launch({ channel: 'chromium' })
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
})
const out = {}
for (const route of ROUTES) {
  const page = await ctx.newPage()
  try {
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.addStyleTag({ content: HIDE })
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(700)
    const r = await page.evaluate(audit)
    r.status = resp?.status()
    out[route] = r
    const n = r.overflow.length + r.tiny.length + r.tap.length
    console.log(`${route}  scrollW=${r.docScrollW} h=${r.pageH}  ovf=${r.overflow.length} tiny=${r.tiny.length} tap=${r.tap.length} tall=${r.tall.length} img=${r.img.length}`)
  } catch (e) {
    out[route] = { error: String(e).slice(0, 120) }
    console.log(`${route}  ERROR ${String(e).slice(0, 80)}`)
  }
  await page.close()
}
fs.writeFileSync('/tmp/audit.json', JSON.stringify(out, null, 1))
await browser.close()
