import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { CLAUDE_PARTNER, CLAUDE_PARTNER_TIER, CLAUDE_TIERS } from "./claudePartnerTier"
import { PARTNER_BADGES } from "./partnerBadges"

const ROOT = process.cwd()
const publicFile = (src: string) => path.join(ROOT, "public", src)

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return sourceFiles(p)
    return /\.(ts|tsx)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [p] : []
  })
}

describe("Claude Partner Network tier", () => {
  it("ships the artwork for both tiers, so switching needs no new files", () => {
    for (const [tier, t] of Object.entries(CLAUDE_TIERS)) {
      expect(fs.existsSync(publicFile(t.badge.src)), `${tier} hero badge ${t.badge.src}`).toBe(true)
      expect(fs.existsSync(publicFile(t.home.src)), `${tier} home badge ${t.home.src}`).toBe(true)
    }
  })

  it("feeds the hero badge map", () => {
    expect(PARTNER_BADGES.claude.src).toBe(CLAUDE_PARTNER.badge.src)
    expect(PARTNER_BADGES.claude.alt).toBe(CLAUDE_PARTNER.alt)
  })

  it("leaves no hard-coded Claude tier claim outside claudePartnerTier.ts", () => {
    const other = CLAUDE_PARTNER_TIER === "certified" ? "Select" : "Certified"
    const claim = new RegExp(`Claude[^"'\\n]{0,40}\\b${other} Services Partner`, "i")
    const offenders = sourceFiles(path.join(ROOT, "src"))
      .filter((f) => !f.endsWith("claudePartnerTier.ts"))
      .filter((f) => claim.test(fs.readFileSync(f, "utf8")))
      .map((f) => path.relative(ROOT, f))
    expect(offenders).toEqual([])
  })
})
