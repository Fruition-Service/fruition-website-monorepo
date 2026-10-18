import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { bioPlainText, parseBioLinks } from "@/lib/bioLinks"
import BioText from "@/components/BioText"

const EDWARD =
  "Outside Fruition he runs [Kelin Studio](https://kelin.studio), a product studio, and is building [GrooveSheet](https://groovesheet.net) and [Volumet](https://www.volumet.net). See more at [edwardzehuazhang.com](https://edwardzehuazhang.com)."

describe("parseBioLinks", () => {
  it("returns nothing for an empty bio", () => {
    expect(parseBioLinks("")).toEqual([])
  })

  it("leaves a bio without link syntax as one untouched segment", () => {
    // Asterisks and underscores must stay literal: other bios contain them.
    const bio = "monday.com Partner · Make.com Level-4 *certified* · snake_case_name & <b>"
    expect(parseBioLinks(bio)).toEqual([{ text: bio }])
  })

  it("splits http(s) links out of the text", () => {
    expect(parseBioLinks("Runs [Kelin Studio](https://kelin.studio), a studio.")).toEqual([
      { text: "Runs " },
      { text: "Kelin Studio", href: "https://kelin.studio" },
      { text: ", a studio." },
    ])
  })

  it("handles several links and a link at the very end", () => {
    const segs = parseBioLinks(EDWARD)
    expect(segs.filter((s) => s.href).map((s) => s.href)).toEqual([
      "https://kelin.studio",
      "https://groovesheet.net",
      "https://www.volumet.net",
      "https://edwardzehuazhang.com",
    ])
    expect(segs.map((s) => s.text).join("")).toBe(bioPlainText(EDWARD))
  })

  it("keeps non-http schemes and relative links as literal text", () => {
    for (const bio of [
      "[x](javascript:alert(1))",
      "[x](mailto:a@b.co)",
      "[x](/contact-us)",
      "[x](data:text/html,hi)",
    ]) {
      expect(parseBioLinks(bio)).toEqual([{ text: bio }])
    }
  })

  it("keeps malformed link syntax literal", () => {
    for (const bio of ["[](https://a.co)", "[x] (https://a.co)", "[x](https://a.co", "[x](https://a b.co)"]) {
      expect(parseBioLinks(bio)).toEqual([{ text: bio }])
    }
  })
})

describe("bioPlainText", () => {
  it("reduces links to their labels", () => {
    expect(bioPlainText("See [my site](https://e.co).")).toBe("See my site.")
  })
})

describe("BioText", () => {
  it("renders a link-free bio exactly as plain text", () => {
    const bio = "Principal consultant. Tom & Jerry <script>"
    expect(renderToStaticMarkup(<BioText bio={bio} />)).toBe(
      "Principal consultant. Tom &amp; Jerry &lt;script&gt;",
    )
  })

  it("renders links as real anchors", () => {
    const html = renderToStaticMarkup(<BioText bio={EDWARD} />)
    for (const href of [
      "https://kelin.studio",
      "https://groovesheet.net",
      "https://www.volumet.net",
      "https://edwardzehuazhang.com",
    ]) {
      expect(html).toContain(`href="${href}"`)
    }
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).not.toContain("](")
  })

  it("never renders a javascript: href", () => {
    const html = renderToStaticMarkup(<BioText bio="[x](javascript:alert(1))" />)
    expect(html).not.toContain("<a")
  })
})
