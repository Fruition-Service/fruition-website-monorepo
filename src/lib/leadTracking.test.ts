import { afterEach, describe, expect, it } from "vitest"
import { trackLead } from "./leadTracking"

describe("trackLead", () => {
  afterEach(() => {
    delete window.dataLayer
  })

  it("pushes generate_lead with the form source", () => {
    window.dataLayer = []
    trackLead("cro-audit")
    expect(window.dataLayer).toEqual([
      { event: "generate_lead", form_source: "cro-audit", page_path: window.location.pathname },
    ])
  })

  it("creates the dataLayer when GTM has not loaded yet", () => {
    delete window.dataLayer
    trackLead(undefined)
    expect(window.dataLayer?.[0]).toMatchObject({ event: "generate_lead", form_source: "unknown" })
  })
})
