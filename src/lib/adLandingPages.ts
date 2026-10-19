import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

/**
 * Test support: every Google Ads landing page in the repo, found from its route
 * handler rather than from a hard-coded list of region folders. A page added
 * under a new folder (as /sea was on 2026-10-20) is picked up by the head-tag
 * and theme checks automatically instead of slipping past them.
 *
 * A landing page is any `route.ts` under src/app that serves through
 * `landingPageResponse`, next to the `content.ts` that holds its document.
 */
export interface AdLandingPage {
  /** Path under src/app, e.g. "sea/monday-partner-singapore-malaysia". */
  page: string
  source: string
  region: string
}

const APP = path.join(__dirname, "..", "app")

function routeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === "api" ? [] : routeFiles(full)
    return entry.name === "route.ts" ? [full] : []
  })
}

export function adLandingPages(): AdLandingPage[] {
  return routeFiles(APP)
    .map((file) => ({ file, code: readFileSync(file, "utf8") }))
    .filter(({ code }) => code.includes("landingPageResponse("))
    .map(({ file, code }) => ({
      page: path.relative(APP, path.dirname(file)).split(path.sep).join("/"),
      source: code.match(/source:\s*"([^"]+)"/)?.[1] ?? "",
      region: code.match(/region:\s*"([^"]+)"/)?.[1] ?? "",
    }))
    .sort((a, b) => a.page.localeCompare(b.page))
}
