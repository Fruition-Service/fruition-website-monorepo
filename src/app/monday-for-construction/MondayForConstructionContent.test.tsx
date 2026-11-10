import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ConstructionTestimonialsSection } from "./MondayForConstructionContent"

describe("ConstructionTestimonialsSection", () => {
  it("skips the image when a testimonial has none, keeping the frame, and always sets alt", () => {
    const html = renderToStaticMarkup(
      <ConstructionTestimonialsSection
        testimonials={[
          { title: "Site to office", quote: "Great", name: "Ann", role: "PM", image: "https://example.com/a.jpg" },
          { title: "", quote: "Solid", name: "Ben", role: "Director", image: "https://example.com/b.jpg" },
          { title: "", quote: "Helpful", name: "", role: "Ops", image: "" },
        ]}
      />,
    )
    const imgs = html.match(/<img\b[^>]*>/g) ?? []
    expect(imgs).toHaveLength(2)
    expect(imgs[0]).toContain('alt="Site to office"')
    expect(imgs[1]).toContain('alt="Ben"')
    // Every card keeps its image frame so the grid does not shift.
    expect(html.match(/aspect-\[16\/10\]/g)).toHaveLength(3)
    expect(html).not.toMatch(/<img(?![^>]*\bsrc=)/)
  })
})
