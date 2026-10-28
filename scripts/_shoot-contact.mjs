// Screenshot /contact-us at 375, 768 and 1440 wide. Usage:
//   node scripts/_shoot-contact.mjs <baseUrl> <outPrefix> [widths]
import { chromium } from "playwright"

const base = process.argv[2] || "http://localhost:3417"
const prefix = process.argv[3] || "shots/contact"
const widths = (process.argv[4] || "375,768,1440").split(",").map(Number)

// PW_CHROME lets a broken local Playwright cache point at a complete build.
const browser = await chromium.launch({ channel: "chromium", ...(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {}) })
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } })
  await page.goto(`${base}/contact-us`, { waitUntil: "networkidle", timeout: 120000 })
  // Dismiss the visitor-tracking notice so it does not cover the page.
  await page.getByRole("button", { name: "Decline" }).first().click({ timeout: 3000 }).catch(() => {})
  // Open the first office so the expanded state is visible too.
  await page.locator("details summary").first().click().catch(() => {})
  // Scroll through so lazy images load.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)
  const m = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    h1: document.querySelectorAll("h1").length,
    brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    order: [...document.querySelectorAll("h1, h2")].map((h) => h.textContent.trim().slice(0, 40)),
  }))
  console.log(w, JSON.stringify(m))
  await page.screenshot({ path: `${prefix}-${w}.png`, fullPage: true })
  await page.screenshot({ path: `${prefix}-${w}-top.png` })
  await page.close()
}
await browser.close()
