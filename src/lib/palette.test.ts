import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { PALETTE_PROPS, coloursIn, isBrandMonoSvg, isPurple, toBlue, withPaletteTwins } from "./palette"

const ROOT = join(__dirname, "..", "..")
const read = (p: string) => readFileSync(join(ROOT, p), "utf8")

function walk(dir: string, ext: RegExp): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const rel = join(dir, name)
    return statSync(join(ROOT, rel)).isDirectory() ? walk(rel, ext) : ext.test(name) ? [rel] : []
  })
}

describe("toBlue", () => {
  it("moves purple to the blue hue, keeping notation and alpha", () => {
    expect(toBlue("#8015e8")).toBe("#0a66c2") // LinkedIn blue, the anchor
    expect(toBlue("rgba(128,21,232,.34)")).toBe("rgba(10,102,194,.34)")
    expect(toBlue("0 6px 22px rgba(52,10,100,.16), 0 0 0 #ae92df")).toMatch(/^0 6px 22px rgba\(\d+,\d+,\d+,\.16\), 0 0 0 #[0-9a-f]{6}$/)
  })
  it("leaves non-purples alone", () => {
    for (const c of ["#fff", "#000000", "rgba(255,255,255,.9)", "#ec4899", "#00ca72", "#1e40af"]) expect(toBlue(c)).toBe(c)
  })
})

describe("withPaletteTwins", () => {
  it("adds a --pal- twin only for purple values of palette properties", () => {
    const s: Record<string, unknown> = withPaletteTwins({ left: "138px", background: "rgba(128,21,232,.34)", color: "#fff", boxShadow: "0 1px #ae92df" })
    expect(s).toMatchObject({ left: "138px", background: "rgba(128,21,232,.34)", color: "#fff" })
    expect(s["--pal-background"]).toBe("rgba(10,102,194,.34)")
    expect(s["--pal-box-shadow"]).toMatch(/^0 1px #/)
    expect(s).not.toHaveProperty("--pal-color")
  })
})

describe("isBrandMonoSvg", () => {
  it("accepts a single-purple icon and rejects logos", () => {
    expect(isBrandMonoSvg('<svg><path stroke="#8015e8"/><path stroke="#8015E8"/></svg>')).toBe(true)
    expect(isBrandMonoSvg('<svg><path fill="#0052cc"/></svg>')).toBe(false)
    expect(isBrandMonoSvg('<svg><path fill="#6d00cc"/><path fill="#f0f"/></svg>')).toBe(false) // Make
    expect(isBrandMonoSvg("<svg><path/></svg>")).toBe(false)
  })
})

describe("Blue mode coverage", () => {
  const css = read("src/app/globals.css")
  const blueStart = css.indexOf('html[data-palette="blue"] {')
  const rootCss = css.slice(0, blueStart)
  const blueBlock = css.slice(blueStart, css.indexOf("}", blueStart))
  const twins = Object.fromEntries([...blueBlock.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6});/g)].map((m) => [m[1], m[2]]))

  it("every purple :root token has its toBlue() twin in the Blue mode block", () => {
    const missing: string[] = []
    for (const m of rootCss.matchAll(/^\s*(--[\w-]+):\s*(#[0-9a-fA-F]{6});/gm)) {
      const [name, value] = [m[1], m[2]]
      if (!isPurple(coloursIn(value)[0])) continue
      if (twins[name] !== toBlue(value)) missing.push(`${name}: ${value} -> expected ${toBlue(value)}, got ${twins[name] ?? "none"}`)
    }
    expect(missing).toEqual([])
  })

  it("stylesheets carry no raw purple outside token definitions", () => {
    const files = ["src/app/globals.css", ...walk("src/styles", /\.css$/)]
    const offenders: string[] = []
    for (const f of files) {
      const lines = read(f).split("\n")
      lines.forEach((line, i) => {
        if (/^\s*--[\w-]+:\s*#[0-9a-fA-F]{3,6};/.test(line)) return // a token definition
        if (coloursIn(line).some(isPurple)) offenders.push(`${f}:${i + 1}`)
      })
    }
    expect(offenders).toEqual([])
  })

  it("palette.css has a Blue mode rule for every PALETTE_PROPS entry", () => {
    const rules = read("src/styles/palette.css")
    for (const p of PALETTE_PROPS) expect(rules).toContain(`[style*="--pal-${p}:"]`)
  })
})
