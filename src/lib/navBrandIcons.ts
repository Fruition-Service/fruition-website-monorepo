import { cache } from "react"
import { urlFor } from "@/sanity/image"
import { coloursIn, isBrandMonoSvg } from "@/lib/palette"

/**
 * Nav dropdown icons are SVGs uploaded in Sanity. Fruition's own line icons are
 * drawn in one brand purple; partner logos keep their own colours. For the
 * brand icons this returns the SVG with its colour swapped for currentColor,
 * so the Navbar can inline it and it follows the accent token (purple, or blue
 * in Blue mode). Anything else, or any fetch problem, returns null and the
 * Navbar shows the uploaded file as before.
 */
const UNSAFE = /<script|<foreignObject|\son\w+\s*=|javascript:|<!ENTITY/i

export const brandIconSvg = cache(async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const svg = (await res.text()).trim()
    if (!svg.startsWith("<svg") || UNSAFE.test(svg) || svg.length > 8000) return null
    if (!isBrandMonoSvg(svg)) return null
    const [colour] = coloursIn(svg)
    return svg.replace(/#[0-9a-fA-F]{3,6}\b|rgba?\([^)]*\)/g, (m) => {
      const [c] = coloursIn(m)
      return c && c.join() === colour.join() ? "currentColor" : m
    })
  } catch {
    return null
  }
})

type NavItem = { logo?: { asset?: { _ref?: string } }; logoSvg?: string }

/** Adds `logoSvg` to every nav link whose uploaded icon is a single-purple brand icon. */
export async function inlineBrandNavIcons(settings: { navigation?: unknown } | null | undefined): Promise<void> {
  const nav = Array.isArray(settings?.navigation) ? settings.navigation : []
  const items: NavItem[] = nav
    .flatMap((n: { sections?: { items?: NavItem[] }[] }) => n?.sections ?? [])
    .flatMap((s) => s?.items ?? [])
    .filter((i): i is NavItem => Boolean(i?.logo?.asset?._ref?.endsWith("-svg")))
  await Promise.all(
    items.map(async (item) => {
      let url: string
      try {
        url = urlFor(item.logo).url()
      } catch {
        return
      }
      const svg = await brandIconSvg(url)
      if (svg) item.logoSvg = svg
    }),
  )
}
