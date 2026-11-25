import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  IMPLEMENTATION_COUNT,
  IMPLEMENTATION_COUNT_NUMBER,
  IMPLEMENTATION_COUNT_TOKEN,
  PREVIOUS_IMPLEMENTATION_COUNTS,
  syncImplementationCount,
  syncImplementationCountIn,
  tokeniseImplementationCount,
} from "./implementationCount"

describe("syncImplementationCount", () => {
  it("fills in the token", () => {
    expect(syncImplementationCount(`Join ${IMPLEMENTATION_COUNT_TOKEN} businesses`)).toBe(
      `Join ${IMPLEMENTATION_COUNT} businesses`,
    )
  })

  it.each(PREVIOUS_IMPLEMENTATION_COUNTS.filter((c) => c !== IMPLEMENTATION_COUNT))(
    "brings %s up to date",
    (old) => {
      expect(syncImplementationCount(`Trusted by teams across ${old} implementations.`)).toBe(
        `Trusted by teams across ${IMPLEMENTATION_COUNT} implementations.`,
      )
      expect(syncImplementationCount(old)).toBe(IMPLEMENTATION_COUNT)
    },
  )

  it("updates prose counts without a plus", () => {
    expect(syncImplementationCount("He has led over 900 implementations.")).toBe(
      `He has led over ${IMPLEMENTATION_COUNT_NUMBER} implementations.`,
    )
    expect(syncImplementationCount("more than 900 small and mid-sized organisations")).toBe(
      `more than ${IMPLEMENTATION_COUNT_NUMBER} small and mid-sized organisations`,
    )
  })

  it("leaves figures that are not Fruition's count alone", () => {
    for (const s of [
      "1,900+ staff",
      "a $900+ onboarding fee",
      "USD 165 to USD 900+",
      "700+ integrations",
      "Connect seamlessly with 1000+ apps and services",
      "Platinum in 2026 with 700 clients",
      "over 900 people attended",
      "29001000+",
    ]) {
      expect(syncImplementationCount(s)).toBe(s)
    }
  })

  it("walks nested CMS payloads but not system keys", () => {
    const doc = { _id: "900+", stats: [{ _key: "a", value: "900+" }], body: [{ children: [{ text: "Join 700+ teams" }] }] }
    expect(syncImplementationCountIn(doc)).toEqual({
      _id: "900+",
      stats: [{ _key: "a", value: IMPLEMENTATION_COUNT }],
      body: [{ children: [{ text: `Join ${IMPLEMENTATION_COUNT} teams` }] }],
    })
  })
})

describe("tokeniseImplementationCount", () => {
  it("turns current and previous counts into the token", () => {
    expect(tokeniseImplementationCount(`${IMPLEMENTATION_COUNT} implementations, 900+ delivered`)).toBe(
      `${IMPLEMENTATION_COUNT_TOKEN} implementations, ${IMPLEMENTATION_COUNT_TOKEN} delivered`,
    )
    expect(tokeniseImplementationCount("1000+ apps")).toBe("1000+ apps")
  })
})

/** The count must come from the constant, never be typed out. */
describe("no hard-coded implementation count", () => {
  const root = path.resolve(__dirname, "../..")
  const files: string[] = []
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (/\.(ts|tsx|js|mjs)$/.test(e.name)) files.push(p)
    }
  }
  walk(path.join(root, "src"))
  walk(path.join(root, "workers/og-card/src"))
  const own = [path.join(root, "src/lib/implementationCount.ts"), path.join(root, "src/lib/implementationCount.test.ts")]

  it("in src/ or the og-card worker", () => {
    const offenders = files
      .filter((f) => !own.includes(f))
      .filter((f) => {
        // Mentioning the token itself (docs, Studio help text) is fine.
        const text = fs.readFileSync(f, "utf8").split(IMPLEMENTATION_COUNT_TOKEN).join("")
        return tokeniseImplementationCount(text) !== text || syncImplementationCount(text) !== text
      })
      .map((f) => path.relative(root, f))
    expect(offenders, "use IMPLEMENTATION_COUNT / IMPLEMENTATION_COUNT_NUMBER from src/lib/implementationCount.ts").toEqual([])
  })

  // public/*.md are static files the build cannot fill in: update them by hand.
  it.each(fs.readdirSync(path.join(root, "public")).filter((f) => f.endsWith(".md")))("public/%s is current", (f) => {
    const text = fs.readFileSync(path.join(root, "public", f), "utf8")
    expect(syncImplementationCount(text), `update the count in public/${f}`).toBe(text)
  })

  it("public/index.md states the current count", () => {
    expect(fs.readFileSync(path.join(root, "public/index.md"), "utf8")).toContain(IMPLEMENTATION_COUNT_NUMBER)
  })
})
