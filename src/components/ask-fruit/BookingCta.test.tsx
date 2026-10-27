import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { BookingCta } from "./BookingCta"

describe("BookingCta", () => {
  const html = renderToStaticMarkup(<BookingCta />)

  it("renders the closed card with its copy and actions", () => {
    expect(html).toContain("// Book a time")
    expect(html).toContain("Talk it through with a consultant.")
    expect(html).toContain("Book a 30 minute consultation")
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('href="/contact-us#book"')
    expect(html).toContain("Open the full booking page")
  })

  it("does not mount the Calendly iframe until opened", () => {
    expect(html).not.toContain("<iframe")
  })
})
