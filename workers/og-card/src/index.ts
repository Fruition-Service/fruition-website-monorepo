import { CustomFont, ImageResponse, cache } from "@cf-wasm/og/workerd"
import semibold from "./assets/Poppins-SemiBold.ttf"
import medium from "./assets/Poppins-Medium.ttf"
import logoSvg from "./assets/logo-fruition-white.svg"

/**
 * Social preview card (1200×630) for every fruitionservices.io page that has no
 * image of its own. The site's `buildOgMetadata` points og:image here with
 * `?title=…&eyebrow=…&v=…`; the card is fully determined by the query string, so
 * it is cached hard and `v` is bumped whenever the design changes.
 *
 * Colours are the brand tokens from the site's globals.css (purple-primary,
 * purple-dark, purple-light); satori cannot read CSS variables, so they are
 * written out here.
 */

const MAX_TITLE = 110
const MAX_EYEBROW = 48
const LOGO = `data:image/svg+xml;base64,${btoa(logoSvg)}`

type Node = { type: string; key?: string; props: { style?: Record<string, unknown>; children?: unknown; [k: string]: unknown } }
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
})

function clean(value: string | null, max: number): string {
  const text = (value ?? "").replace(/\s+/g, " ").trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function card(title: string, eyebrow: string): Node {
  // Long titles step down so they always fit in four lines.
  const titleSize = title.length > 80 ? 54 : title.length > 52 ? 62 : 72
  const chip = (text: string) =>
    h(
      "div",
      {
        display: "flex",
        padding: "10px 22px",
        borderRadius: 999,
        fontSize: 22,
        fontWeight: 500,
        backgroundColor: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.28)",
      },
      text,
      { key: text },
    )

  return h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      fontFamily: "Poppins",
      color: "#ffffff",
      backgroundColor: "#550e9b",
      backgroundImage:
        "radial-gradient(circle at 100% 0%, rgba(186,131,240,0.55) 0%, rgba(186,131,240,0) 55%), linear-gradient(135deg, #3d0a72 0%, #8015e8 100%)",
    },
    [
      h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        h("img", {}, undefined, { src: LOGO, width: 234, height: 48, key: "logo" }),
        h(
          "div",
          { display: "flex", fontSize: 22, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: "#e3cdfb" },
          eyebrow,
          { key: "eyebrow" },
        ),
      ]),
      h(
        "div",
        { display: "flex", fontSize: titleSize, fontWeight: 600, lineHeight: 1.15, letterSpacing: -1, maxWidth: 1040 },
        title,
        { key: "title" },
      ),
      h(
        "div",
        { display: "flex", alignItems: "center", justifyContent: "space-between" },
        [
          h("div", { display: "flex", gap: 14 }, [chip("monday.com Platinum Partner"), chip("900+ implementations")], { key: "chips" }),
          h("div", { display: "flex", fontSize: 24, fontWeight: 500, color: "#e3cdfb" }, "fruitionservices.io", { key: "domain" }),
        ],
        { key: "footer" },
      ),
    ],
  )
}

export default {
  async fetch(request, _env, ctx) {
    const url = new URL(request.url)
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 })
    }
    cache.setExecutionContext(ctx)

    // Each card is immutable for its query string: serve repeats from the edge cache.
    const cacheKey = new Request(url.toString(), { method: "GET" })
    const hit = await caches.default.match(cacheKey)
    if (hit) return hit

    const title = clean(url.searchParams.get("title"), MAX_TITLE) || "monday.com consulting, automation & AI"
    const eyebrow = clean(url.searchParams.get("eyebrow"), MAX_EYEBROW) || "Consulting · Automation · AI"

    const image = await ImageResponse.async(card(title, eyebrow) as never, {
      width: 1200,
      height: 630,
      format: "png",
      fonts: [
        new CustomFont("Poppins", semibold, { weight: 600, style: "normal" }),
        new CustomFont("Poppins", medium, { weight: 500, style: "normal" }),
      ],
    })
    const headers = new Headers(image.headers)
    headers.set("Content-Type", "image/png")
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=31536000, immutable")
    headers.set("X-Robots-Tag", "noindex")
    const response = new Response(image.body, { status: 200, headers })
    ctx.waitUntil(caches.default.put(cacheKey, response.clone()))
    return response
  },
} satisfies ExportedHandler
