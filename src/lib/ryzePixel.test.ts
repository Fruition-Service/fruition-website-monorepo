import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { RYZE_LANDING_HEAD, RYZE_LOADER, RYZE_PIXEL_URL, trackRyzeLead } from "./ryzePixel"

// jsdom here has no working localStorage, so give each test a fresh one.
let store: Map<string, string>
beforeEach(() => {
  store = new Map()
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete window.ryzeq
  document.head.innerHTML = ""
})

/** Runs the inline <script> body of RYZE_LANDING_HEAD in jsdom. */
function runLandingHead() {
  document.head.appendChild(document.createElement("script"))
  const body = RYZE_LANDING_HEAD.replace(/^<script>/, "").replace(/<\/script>$/, "")
  new Function(body)()
}

describe("Ryze pixel", () => {
  it("queues a lead whether or not px.js has loaded", () => {
    trackRyzeLead()
    expect(window.ryzeq).toEqual([["track", "lead"]])
    trackRyzeLead()
    expect(window.ryzeq).toHaveLength(2)
  })

  it("layout loader skips the portal and Studio and honours the consent gate", () => {
    expect(RYZE_LOADER).toContain(RYZE_PIXEL_URL)
    expect(RYZE_LOADER).toContain("(internal|studio)")
    expect(RYZE_LOADER).toContain('"fruition-visitor-consent")==="declined"')
  })

  it("ad page head loads px.js async and turns a Calendly booking into a lead", () => {
    runLandingHead()
    const px = document.querySelector(`script[src="${RYZE_PIXEL_URL}"]`) as HTMLScriptElement | null
    expect(px?.async).toBe(true)
    window.dispatchEvent(new MessageEvent("message", { origin: "https://evil.example", data: { event: "calendly.event_scheduled" } }))
    window.dispatchEvent(new MessageEvent("message", { origin: "https://calendly.com", data: { event: "calendly.page_height" } }))
    expect(window.ryzeq).toEqual([])
    window.dispatchEvent(new MessageEvent("message", { origin: "https://calendly.com", data: { event: "calendly.event_scheduled" } }))
    expect(window.ryzeq).toEqual([["track", "lead"]])
  })

  it("ad page head does not load px.js when the visitor declined", () => {
    window.localStorage.setItem("fruition-visitor-consent", "declined")
    runLandingHead()
    expect(document.querySelector(`script[src="${RYZE_PIXEL_URL}"]`)).toBeNull()
    expect(window.ryzeq).toEqual([])
  })
})
