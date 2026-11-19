import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

// The 404 shell (monday 2913602725): Next prerenders one `/_not-found` route and
// serves it for every junk URL, so the crumb trail must not come from the path.
const nav = vi.hoisted(() => ({ pathname: "/" as string | null, segments: [] as string[] }))
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useSelectedLayoutSegments: () => nav.segments,
}))

import Breadcrumbs, { isNotFoundRoute } from "@/components/Breadcrumbs"

const BASE = "https://www.fruitionservices.io"

function render(pathname: string, segments: string[]) {
  nav.pathname = pathname
  nav.segments = segments
  return renderToStaticMarkup(<Breadcrumbs />)
}

describe("Breadcrumbs on 404s", () => {
  beforeEach(() => {
    nav.pathname = "/"
    nav.segments = []
  })

  it("renders no BreadcrumbList in the prerendered 404 shell", () => {
    const html = render("/_not-found", ["/_not-found"])
    expect(html).toBe("")
    expect(html).not.toContain("BreadcrumbList")
  })

  it("renders none in the browser either, where the path is the junk URL", () => {
    expect(render("/fruition-team/winning303", ["/_not-found"])).toBe("")
    expect(render("/a22d0c9d-mka", ["_not-found"])).toBe("")
  })

  it("only treats the not-found route as a 404", () => {
    expect(isNotFoundRoute("/_not-found", [])).toBe(true)
    expect(isNotFoundRoute("/x", ["/_not-found"])).toBe(true)
    expect(isNotFoundRoute("/fruition-team", ["fruition-team"])).toBe(false)
    expect(isNotFoundRoute("/not-found-guide", ["not-found-guide"])).toBe(false)
  })
})

describe("Breadcrumbs on real pages", () => {
  it("keeps the BreadcrumbList for /fruition-team", () => {
    expect(render("/fruition-team", ["fruition-team"])).toBe(
      '<script type="application/ld+json">' +
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE },
            { "@type": "ListItem", position: 2, name: "Meet the Team", item: `${BASE}/fruition-team` },
          ],
        }) +
        "</script>",
    )
  })

  it("keeps the nested trail for a partner page", () => {
    const html = render("/partnerships/monday-consulting-partner", ["partnerships", "monday-consulting-partner"])
    const data = JSON.parse(html.replace(/^<script[^>]*>|<\/script>$/g, ""))
    expect(data.itemListElement.map((i: { name: string }) => i.name)).toEqual([
      "Home",
      "Partners",
      "monday.com Consulting Partner",
    ])
    expect(data.itemListElement[2].item).toBe(`${BASE}/partnerships/monday-consulting-partner`)
  })
})
