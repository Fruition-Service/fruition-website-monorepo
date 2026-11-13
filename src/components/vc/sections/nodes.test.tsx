import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { svgToReact } from "./nodes"

const html = (svg: string) => renderToStaticMarkup(<>{svgToReact(svg)}</>)

describe("svgToReact", () => {
  it("gives a bare sprite icon its 24-unit viewBox so the arrow is not clipped", () => {
    expect(html('<svg><path d="M5 12h14M13 6l6 6-6 6"/></svg>')).toBe(
      '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    )
  })

  it("keeps an existing viewBox", () => {
    expect(html('<svg viewBox="0 0 100 40"><path d="M0 0h10"/></svg>')).toContain('viewBox="0 0 100 40"')
  })

  it("leaves artwork sized by width and height alone", () => {
    expect(html('<svg width="200" height="80"><rect width="10" height="10"/></svg>')).not.toContain("viewBox")
  })

  it("only adds the viewBox to the root svg", () => {
    expect(html('<svg viewBox="0 0 48 48"><svg><path d="M1 1"/></svg></svg>').match(/viewBox/g)).toHaveLength(1)
  })
})
