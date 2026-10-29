import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Every public page must build its own <head> metadata: title, description and
 * an Open Graph / Twitter card. Without its own `openGraph`, Next.js hands the
 * page the root layout's card, so a shared link previews as the homepage.
 * Favicons come from src/app/{favicon.ico,icon.png,apple-icon.png} through the
 * root layout and need nothing per page.
 *
 * Google Ads landing pages are route handlers, not pages; adLandingPageHead.test.ts
 * covers those.
 */
const APP = path.join(__dirname, "..", "app")
const SKIP = new Set(["internal", "studio", "api"])

/** Helpers that return buildOgMetadata() output (openGraph + twitter). */
const OG_HELPERS = /\b(buildOgMetadata|practiceMetadata|channelMetadata)\(/

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return SKIP.has(entry.name) ? [] : pageFiles(full)
    return entry.name === "page.tsx" ? [full] : []
  })
}

const pages = pageFiles(APP).map((file) => ({
  page: "/" + path.relative(APP, path.dirname(file)).split(path.sep).join("/"),
  code: readFileSync(file, "utf8"),
}))

describe("page metadata", () => {
  it("finds the site's pages", () => {
    expect(pages.length).toBeGreaterThan(90)
  })

  it.each(pages)("$page exports metadata with a social preview card", ({ code }) => {
    expect(code).toMatch(/export (const metadata\b|(async )?function generateMetadata\b)/)
    // The OG helpers emit the openGraph + twitter card from the page title and description.
    if (OG_HELPERS.test(code)) return
    // Otherwise: a title and a description, as `title: …` or the `title,` shorthand…
    expect(code).toMatch(/\btitle\s*[:,]/)
    expect(code).toMatch(/\bdescription\s*[:,]/)
    // …and its own card, unless kept out of search (thank-you, workspace share the site card).
    if (/robots:\s*\{[^}]*index:\s*false/.test(code)) return
    expect(code).toMatch(/\bopenGraph:/)
  })

  it.each([
    ["monday-partner-australia", "en_AU"],
    ["monday-partner-us", "en_US"],
    ["monday-partner-uk", "en_GB"],
    ["monday-partner-india", "en_IN"],
    ["monday-partner-philippines", "en_PH"],
    ["monday-partner-singapore", "en_SG"],
  ])("/%s sets og:locale %s", (page, locale) => {
    const code = readFileSync(path.join(APP, page, "page.tsx"), "utf8")
    const call = code.match(/buildOgMetadata\(\{[\s\S]*?\}\)/)?.[0]
    expect(call).toBeTruthy()
    expect(call).toContain(`locale: "${locale}"`)
  })

  it("keeps the deprecated service agreements out of search (noindex)", () => {
    const deprecated = pages.filter(({ page }) => page.startsWith("/legal/deprecated/"))
    expect(deprecated.length).toBeGreaterThan(0)
    for (const { page, code } of deprecated) {
      expect(code, page).toMatch(/robots:\s*\{[^}]*index:\s*false/)
    }
  })
})
