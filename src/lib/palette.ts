/**
 * Site palette: the one place that knows how purple becomes blue.
 *
 * The site ships in purple. Sanity Site Settings > "Blue mode" renders
 * <html data-palette="blue">, and every purple then shows as its blue twin.
 * The rule is anchored on LinkedIn blue: the brand purple (#8015e8) becomes
 * exactly #0a66c2, and every other purple moves the same way (hue to 210°,
 * saturation scaled, mid-tones darkened most, tints and near-blacks barely).
 *
 * Purple reaches the page four ways, and each one goes through this module:
 * 1. Tokens in globals.css. The html[data-palette="blue"] block holds a twin
 *    for every purple-hued :root token; palette.test.ts fails if one is
 *    missing or differs from toBlue().
 * 2. Raw purples in stylesheets are rewritten to token form by
 *    scripts/vc/tokenise-colors.mjs; palette.test.ts fails on any left over.
 * 3. Inline styles stored in Sanity content (Version C nodes). withPaletteTwins()
 *    adds a precomputed `--pal-<prop>` twin next to each purple declaration and
 *    src/styles/palette.css applies it in Blue mode.
 * 4. Single-colour brand icons uploaded as SVG (nav dropdown). isBrandMonoSvg()
 *    spots them so they render as a mask painted with the accent token.
 */

/** Blue mode anchor: the brand purple maps exactly onto LinkedIn blue. */
export const BLUE_ANCHOR = { purple: "#8015e8", blue: "#0a66c2" } as const

/** CSS properties whose inline purple values get a Blue mode twin (see palette.css). */
export const PALETTE_PROPS = [
  "background",
  "background-color",
  "background-image",
  "color",
  "border",
  "border-color",
  "box-shadow",
  "text-shadow",
  "outline-color",
  "fill",
  "stroke",
  "stop-color",
] as const

type Rgb = [number, number, number]

function rgbToHsl([r, g, b]: Rgb): [number, number, number] {
  const R = r / 255, G = g / 255, B = b / 255
  const max = Math.max(R, G, B), min = Math.min(R, G, B)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === R) h = (G - B) / d + (G < B ? 6 : 0)
  else if (max === G) h = (B - R) / d + 2
  else h = (R - G) / d + 4
  return [h / 6, s, l]
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (s === 0) return [l, l, l].map((v) => Math.round(v * 255)) as Rgb
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)].map((v) => Math.round(v * 255)) as Rgb
}

/** Purple-hued and visibly tinted: the colours Blue mode moves. */
export function isPurple(rgb: Rgb): boolean {
  const [h, s, l] = rgbToHsl(rgb)
  return h >= 0.68 && h <= 0.89 && s > 0.08 && l > 0.03 && l < 0.995
}

const hex2 = (n: number) => n.toString(16).padStart(2, "0")

function parseHex(hex: string): Rgb {
  const h = hex.length === 4 ? [...hex.slice(1)].map((c) => c + c).join("") : hex.slice(1)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb
}

// The transform, derived from the anchor pair so the brand purple lands exactly:
// hue → the anchor's hue; saturation × the anchor ratio; lightness pulled down by
// DARKEN·sin(πl), which is largest at mid-tones and fades to nothing at white and black.
const [, ANCHOR_S, ANCHOR_L] = rgbToHsl(parseHex(BLUE_ANCHOR.purple))
const [BLUE_H, BLUE_S, BLUE_L] = rgbToHsl(parseHex(BLUE_ANCHOR.blue))
const SAT_SCALE = BLUE_S / ANCHOR_S
const DARKEN = (ANCHOR_L - BLUE_L) / Math.sin(Math.PI * ANCHOR_L)

function shiftHue(rgb: Rgb): Rgb {
  const [, s, l] = rgbToHsl(rgb)
  return hslToRgb(BLUE_H, Math.min(1, s * SAT_SCALE), l - DARKEN * Math.sin(Math.PI * l))
}

const COLOUR = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+%?\s*)?\)/g

/** Every colour literal in a CSS value, as [r, g, b]. */
export function coloursIn(value: string): Rgb[] {
  return [...value.matchAll(COLOUR)].map((m) =>
    m[0].startsWith("#") ? parseHex(m[0]) : ([Number(m[1]), Number(m[2]), Number(m[3])] as Rgb),
  )
}

/** One colour literal → its Blue mode twin, in the same notation. Non-purples come back unchanged. */
export function toBlue(colour: string): string {
  return colour.replace(COLOUR, (m, r, g, b, alpha) => {
    const rgb: Rgb = m.startsWith("#") ? parseHex(m) : [Number(r), Number(g), Number(b)]
    if (!isPurple(rgb)) return m
    const [R, G, B] = shiftHue(rgb)
    if (m.startsWith("#")) return `#${hex2(R)}${hex2(G)}${hex2(B)}`
    return alpha ? `rgba(${R},${G},${B}${alpha.replace(/\s/g, "")})` : `rgb(${R},${G},${B})`
  })
}

const PROP_SET = new Set<string>(PALETTE_PROPS)
const camelToKebab = (k: string) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/**
 * Adds a Blue mode twin beside each purple declaration in a React style object:
 * `{ background: "#8a25e8" }` → `{ background: "#8a25e8", "--pal-background": "#255ae8" }`.
 * The original keeps rendering; palette.css swaps in the twin under data-palette="blue".
 */
export function withPaletteTwins<T extends Record<string, unknown>>(style: T): T {
  let out: Record<string, unknown> | null = null
  for (const [key, value] of Object.entries(style)) {
    if (typeof value !== "string" || key.startsWith("--")) continue
    const prop = camelToKebab(key)
    if (!PROP_SET.has(prop)) continue
    const twin = toBlue(value)
    if (twin === value) continue
    out ??= { ...style }
    out[`--pal-${prop}`] = twin
  }
  return (out ?? style) as T
}

/**
 * True when an SVG uses exactly one colour and it is purple (a Fruition brand
 * line icon), so it can be drawn as a mask painted with the accent token.
 * Multi-colour partner logos (Make's purple gradient included), black marks and
 * SVGs without colours return false.
 */
export function isBrandMonoSvg(svg: string): boolean {
  const unique = new Map(coloursIn(svg).map((c) => [c.join(","), c]))
  if (unique.size !== 1) return false
  return isPurple([...unique.values()][0])
}
