import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import TestimonialsGrid from "./TestimonialsGrid"
import TestimonialsRoll from "@/components/home/TestimonialsRoll"
import { BOOKING_ANCHOR, bookingHref } from "@/lib/bookingLink"

describe("TestimonialsGrid copy", () => {
  const caseStudies = [{ _id: "a", quote: "They mapped it first.", clientName: "A Person", clientCompany: "Acme" }]

  it("renders what it rendered before it passed the eyebrow and intro itself", () => {
    const before = renderToStaticMarkup(
      <TestimonialsRoll
        testimonials={[{ _key: "a", quote: "They mapped it first.", authorName: "A Person", company: "Acme" }]}
        bookingHref={bookingHref(BOOKING_ANCHOR)}
        heading="What our customers say about us 🙌"
        ctaLabel="Start Your Transformation"
      />,
    )
    expect(renderToStaticMarkup(<TestimonialsGrid caseStudies={caseStudies} />)).toBe(before)
    expect(before).toContain("Client proof")
  })

  it("renders an editor's words", () => {
    const html = renderToStaticMarkup(
      <TestimonialsGrid caseStudies={caseStudies} eyebrow="Proof" heading="In their words" ctaLabel="Talk to us" />,
    )
    expect(html).toContain("Proof")
    expect(html).toContain("In their words")
    expect(html).toContain("Talk to us")
    expect(html).not.toContain("Client proof")
  })
})
