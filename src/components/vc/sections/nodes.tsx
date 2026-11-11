import { createElement, type CSSProperties, type ReactNode } from "react"
import { vercelStegaClean } from "@vercel/stega"
import { dims, imgUrl } from "../primitives"
import type { VcNodeData } from "../types"

/**
 * Renders a vcNode tree: the elements of an animated or decorative block as
 * approved in the mock-up. Text and images are Sanity content (so they are
 * click-to-edit); tag, class, style and the SVG artwork are the design.
 */

const VOID = new Set(["img", "br", "hr", "input"])

const clean = (s?: string) => vercelStegaClean(s ?? "")

/** "left:12px;--x:1" -> a React style object. Custom properties are kept as is. */
export function parseStyle(css?: string): CSSProperties | undefined {
  const raw = clean(css).trim()
  if (!raw) return undefined
  const out: Record<string, string> = {}
  for (const decl of raw.split(";")) {
    const i = decl.indexOf(":")
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    const v = decl.slice(i + 1).trim()
    if (!k || !v) continue
    out[k.startsWith("--") ? k : k.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())] = v
  }
  return out as CSSProperties
}

const ATTR_NAMES: Record<string, string> = {
  class: "className", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray", "stroke-dashoffset": "strokeDashoffset", "stroke-opacity": "strokeOpacity",
  "fill-opacity": "fillOpacity", "fill-rule": "fillRule", "clip-rule": "clipRule", "clip-path": "clipPath", "stop-color": "stopColor",
  "stop-opacity": "stopOpacity", "font-size": "fontSize", "font-weight": "fontWeight", "font-family": "fontFamily", "text-anchor": "textAnchor",
  "letter-spacing": "letterSpacing", "stroke-miterlimit": "strokeMiterlimit", "marker-end": "markerEnd", "marker-start": "markerStart",
  "gradient-units": "gradientUnits", "xlink:href": "href", viewbox: "viewBox",
}

/** Minimal SVG to React: tags, attributes, text. No scripts, handlers, foreign content or JS URLs. */
export function svgToReact(raw?: string): ReactNode {
  const svg = clean(raw).trim()
  if (!/^<svg[\s>]/.test(svg) || /<script|<foreignObject|\son\w+\s*=|javascript:/i.test(svg)) return null
  const tokens = svg.match(/<\/?[a-zA-Z][^>]*>|[^<]+/g) ?? []
  type Frame = { tag: string; props: Record<string, unknown>; kids: ReactNode[] }
  const stack: Frame[] = []
  let root: ReactNode = null
  let key = 0
  const close = () => {
    const f = stack.pop()!
    const el = createElement(f.tag, { ...f.props, key: key++ }, ...(f.kids.length ? f.kids : []))
    if (stack.length) stack[stack.length - 1].kids.push(el)
    else root = el
  }
  for (const t of tokens) {
    if (t.startsWith("</")) {
      close()
    } else if (t.startsWith("<")) {
      const m = t.match(/^<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>$/)!
      const props: Record<string, unknown> = {}
      for (const a of m[2].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
        const name = /^(aria|data)-/.test(a[1]) ? a[1] : (ATTR_NAMES[a[1]] ?? a[1].replace(/-([a-z])/g, (_x, c: string) => c.toUpperCase()))
        props[name] = name === "style" ? parseStyle(a[2]) : a[2]
      }
      stack.push({ tag: m[1], props, kids: [] })
      if (m[3] === "/") close()
    } else if (stack.length && t.trim()) {
      stack[stack.length - 1].kids.push(t)
    }
  }
  return root
}

const BOOLEAN_ATTRS = new Set(["hidden", "disabled", "checked"])

export function VcNode({ n }: { n: VcNodeData }): ReactNode {
  const tag = clean(n.tag) || "div"
  if (tag === "#text") return <>{n.text}</>
  if (tag === "svg" || n.svg) return svgToReact(n.svg)
  const props: Record<string, unknown> = {}
  const cls = clean(n.className)
  if (cls) props.className = cls
  const style = parseStyle(n.style)
  if (style) props.style = style
  const href = clean(n.href)
  if (href) props.href = href
  for (const a of n.attrs ?? []) {
    const i = clean(a).indexOf("=")
    const k = i < 0 ? clean(a) : clean(a).slice(0, i)
    const v = i < 0 ? "" : clean(a).slice(i + 1)
    props[k] = BOOLEAN_ATTRS.has(k) ? true : v
  }
  if (tag === "img") {
    const w = Number(clean(n.attrs?.find((a) => clean(a).startsWith("width="))).split("=")[1]) || 0
    const src = imgUrl(n.image, (w || 240) * 2, { fit: "max" })
    if (!src) return null
    return createElement("img", { ...props, src, alt: clean(n.image?.alt), ...dims(n.image, w || undefined), loading: "lazy", decoding: "async" })
  }
  if (VOID.has(tag)) return createElement(tag, props)
  const kids: ReactNode[] = (n.children ?? []).map((c, i) => <VcNode key={c._key ?? i} n={c} />)
  return createElement(tag, props, ...(n.text ? [n.text, ...kids] : kids))
}

export function VcNodes({ nodes }: { nodes?: VcNodeData[] }) {
  return <>{(nodes ?? []).map((n, i) => <VcNode key={n._key ?? i} n={n} />)}</>
}
