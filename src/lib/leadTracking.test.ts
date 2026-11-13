import { afterEach, describe, expect, it, vi } from "vitest"
import { trackLead } from "./leadTracking"

describe("trackLead", () => {
  afterEach(() => {
    delete window.dataLayer
    delete window.clarity
    delete window.oaiq
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

  it("tags the Clarity recording with enquiry_submitted once", () => {
    window.dataLayer = []
    const clarity = vi.fn()
    window.clarity = clarity
    trackLead("cro-audit")
    expect(clarity).toHaveBeenCalledWith("set", "form_source", "cro-audit")
    expect(clarity.mock.calls.filter((c) => c[0] === "event")).toEqual([["event", "enquiry_submitted"]])
    expect(window.dataLayer).toHaveLength(1)
  })

  it("still pushes generate_lead when Clarity is absent", () => {
    window.dataLayer = []
    trackLead("cro-audit")
    expect(window.dataLayer).toHaveLength(1)
  })

  it("sends the OpenAI Ads lead_created conversion once", () => {
    window.dataLayer = []
    const oaiq = vi.fn()
    window.oaiq = oaiq
    trackLead("cro-audit")
    expect(oaiq.mock.calls).toEqual([["measure", "lead_created", { type: "customer_action" }]])
  })

  it("skips OpenAI when the pixel is absent (consent declined)", () => {
    window.dataLayer = []
    expect(() => trackLead("cro-audit")).not.toThrow()
    expect(window.dataLayer).toHaveLength(1)
  })
})
