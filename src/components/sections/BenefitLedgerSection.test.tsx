import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import BenefitLedgerSection from "./BenefitLedgerSection"
import RichText from "./RichText"
import { INDUSTRY_SECTIONS } from "@/data/industrySections"

function introParagraphs(intro: string | undefined) {
  const html = renderToStaticMarkup(
    <BenefitLedgerSection intro={intro} items={[{ text: "A benefit." }]} />,
  )
  const doc = new DOMParser().parseFromString(html, "text/html")
  return [...doc.querySelectorAll(".lg\\:sticky > p")]
}

/** What the intro read as when it was split into one <p> per paragraph. */
function textAsSplit(intro: string) {
  return intro
    .split("\n\n")
    .filter(Boolean)
    .map((p) => {
      const doc = new DOMParser().parseFromString(renderToStaticMarkup(<RichText text={p} />), "text/html")
      return doc.body.textContent
    })
}

const LEDGERS = Object.entries(INDUSTRY_SECTIONS).filter(([, s]) => s.benefitLedger?.intro)

describe("BenefitLedgerSection intro", () => {
  it.each(LEDGERS)("%s renders the same words in one element", (_slug, sections) => {
    const intro = sections.benefitLedger!.intro!
    const ps = introParagraphs(intro)
    expect(ps).toHaveLength(1)
    expect(ps[0].className).toContain("whitespace-pre-line")
    expect(ps[0].textContent!.split("\n\n")).toEqual(textAsSplit(intro))
  })

  it("keeps an edit marker at the end of the stored string with every paragraph", () => {
    const marker = "​‌‍"
    const ps = introParagraphs(`First paragraph.\n\nSecond paragraph.${marker}`)
    expect(ps).toHaveLength(1)
    expect(ps[0].textContent).toBe(`First paragraph.\n\nSecond paragraph.${marker}`)
  })

  it("renders no intro element for a blank intro", () => {
    expect(introParagraphs(undefined)).toHaveLength(0)
    expect(introParagraphs("  ")).toHaveLength(0)
  })
})
