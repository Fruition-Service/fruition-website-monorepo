import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Acc } from "./primitives"

describe("Acc brands", () => {
  it("colours Atlassian and HubSpot in an H1 heading without changing the words", () => {
    const html = renderToStaticMarkup(<Acc text="Advisory for *monday.com, Atlassian and HubSpot.*" brands />)
    expect(html).toBe(
      'Advisory for <span class="acc">monday.com, <span class="text-atlassian">Atlassian</span> and <span class="text-hubspot">HubSpot</span>.</span>',
    )
  })

  it("leaves headings alone without the brands flag", () => {
    expect(renderToStaticMarkup(<Acc text="Your *HubSpot* partner" />)).toBe('Your <span class="acc">HubSpot</span> partner')
  })
})
