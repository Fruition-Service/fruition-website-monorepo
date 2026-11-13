/**
 * Raw purple → token rewriter.
 *
 * The Version C mock-ups and a few older components carry purple as raw
 * `rgba(128,21,232,.3)`-style values (shadows, glows, overlays). Raw values
 * cannot follow a palette switch, so this rewrites each one to the same colour
 * expressed through its token:
 *
 *   rgba(128,21,232,.3)  →  color-mix(in srgb, var(--vc-accent) 30%, transparent)
 *
 * which renders identically while the token holds its default value, and turns
 * blue with the rest of the site in Blue mode (src/styles/blueMode.css).
 *
 * Used by build-css.mjs on every Version C build, and runnable on files:
 *   node scripts/vc/tokenise-colors.mjs <file...>
 * (.css files get CSS syntax, .ts/.tsx files get Tailwind-aware syntax).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// r,g,b → token, per context. Version C files use the --vc-* names.
const RGB_TOKENS = {
  vc: {
    '15,13,20': '--vc-ink',
    '128,21,232': '--vc-accent',
    '16,0,58': '--vc-midnight',
    '186,131,240': '--purple-light',
    '199,156,246': '--vc-accent-on-dark',
    '85,14,155': '--purple-dark',
    '64,12,140': '--purple-dark',
    '52,10,100': '--purple-dark',
  },
  site: {
    '15,13,20': '--vc-ink',
    '128,21,232': '--purple-primary',
    '16,0,58': '--navy-900',
    '186,131,240': '--purple-light',
    '199,156,246': '--vc-accent-on-dark',
    '85,14,155': '--purple-dark',
    '64,12,140': '--purple-dark',
    '52,10,100': '--purple-dark',
  },
}

// Hex purples in component code (never applied to token definitions).
const HEX_TOKENS = {
  '#8015e8': '--purple-primary',
  '#6a11c2': '--vc-accent-press',
  '#ba83f0': '--purple-light',
  '#550e9b': '--purple-dark',
  '#e2d8f7': '--purple-track',
}

const RGBA = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+%?)\s*)?\)/g
const HEX = /#[0-9a-fA-F]{6}\b/g

function pct(alpha) {
  if (alpha === undefined) return null
  const a = alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha)
  if (a >= 1) return null
  return `${Math.round(a * 1000) / 10}%`
}

function mix(token, alpha, tailwind) {
  const p = pct(alpha)
  if (p === null) return `var(${token})`
  return tailwind
    ? `color-mix(in_srgb,var(${token})_${p},transparent)`
    : `color-mix(in srgb, var(${token}) ${p}, transparent)`
}

/** True when the match sits inside a Tailwind arbitrary value like `shadow-[...]`. */
function inTailwindValue(text, index) {
  let i = index - 1
  while (i >= 0 && !/[\s"'`{}]/.test(text[i])) {
    if (text[i] === '[') return true
    i--
  }
  return false
}

/**
 * @param {string} text  CSS declaration value, stylesheet, or TS/TSX source
 * @param {{ scope?: 'vc' | 'site', hex?: boolean, tailwind?: boolean }} opts
 */
export function tokeniseColors(text, { scope = 'vc', hex = false, tailwind = false } = {}) {
  const map = RGB_TOKENS[scope]
  let out = text.replace(RGBA, (m, r, g, b, a, offset, whole) => {
    const token = map[`${r},${g},${b}`]
    if (!token) return m
    return mix(token, a, tailwind && inTailwindValue(whole, offset))
  })
  if (hex) {
    out = out.replace(HEX, (m) => {
      const token = HEX_TOKENS[m.toLowerCase()]
      return token ? `var(${token})` : m
    })
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const file of process.argv.slice(2)) {
    const src = readFileSync(file, 'utf8')
    const isCode = /\.(ts|tsx)$/.test(file)
    const isVc = file.includes('styles/vc/') || file.includes('scripts/vc/')
    const out = tokeniseColors(src, {
      scope: isVc ? 'vc' : 'site',
      hex: isCode,
      tailwind: isCode,
    })
    if (out !== src) {
      writeFileSync(file, out)
      console.log(`tokenised ${file}`)
    }
  }
}
