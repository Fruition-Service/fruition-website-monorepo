import { afterEach, describe, expect, it, vi } from "vitest"
import {
  CLARITY_LIVE_HOSTS,
  CLARITY_LOADER,
  CLARITY_PROJECT_ID,
  isClarityLiveHost,
  trackClarityEnquiry,
} from "./clarity"

/** Runs the loader against a fake window and reports whether it injected the tag. */
function runLoader(hostname: string, pathname = "/", consent: string | null = null): boolean {
  const inserted: { src?: string }[] = []
  const anchor = { parentNode: { insertBefore: (el: { src?: string }) => inserted.push(el) } }
  const fakeDocument = {
    createElement: () => ({}),
    getElementsByTagName: () => [anchor],
  }
  const fakeWindow: Record<string, unknown> = {
    location: { hostname, pathname },
    localStorage: { getItem: () => consent },
  }
  new Function("window", "document", CLARITY_LOADER)(fakeWindow, fakeDocument)
  return inserted.some((el) => el.src === `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`)
}

describe("isClarityLiveHost", () => {
  it("accepts the live hosts", () => {
    expect(CLARITY_LIVE_HOSTS).toEqual(["www.fruitionservices.io", "fruitionservices.io"])
    expect(isClarityLiveHost("www.fruitionservices.io")).toBe(true)
    expect(isClarityLiveHost("fruitionservices.io")).toBe(true)
  })

  it.each([
    "localhost",
    "127.0.0.1",
    "foo.pages.dev",
    "fruition-landing.fruition.workers.dev",
    "staging.fruitionservices.io",
    "www.fruitionmonday.com",
  ])("rejects %s", (host) => {
    expect(isClarityLiveHost(host)).toBe(false)
  })
})

describe("CLARITY_LOADER", () => {
  it("carries the host gate, the consent gate and the portal/Studio skip", () => {
    expect(CLARITY_LOADER).toContain(`var LIVE_HOSTS=${JSON.stringify(CLARITY_LIVE_HOSTS)}`)
    expect(CLARITY_LOADER).toContain("if(LIVE_HOSTS.indexOf(window.location.hostname)<0)return;")
    expect(CLARITY_LOADER).toContain('getItem("fruition-visitor-consent")==="declined"')
    expect(CLARITY_LOADER).toContain("(internal|studio)")
    expect(CLARITY_LOADER).toContain(`"${CLARITY_PROJECT_ID}"`)
  })

  it("loads on the live hosts only", () => {
    expect(runLoader("www.fruitionservices.io")).toBe(true)
    expect(runLoader("fruitionservices.io")).toBe(true)
    for (const host of ["localhost", "127.0.0.1", "foo.pages.dev", "x.workers.dev", "staging.fruitionservices.io"]) {
      expect(runLoader(host)).toBe(false)
    }
  })

  it("still skips declined consent, the portal and the Studio on a live host", () => {
    expect(runLoader("www.fruitionservices.io", "/", "declined")).toBe(false)
    expect(runLoader("www.fruitionservices.io", "/internal/leads")).toBe(false)
    expect(runLoader("www.fruitionservices.io", "/studio")).toBe(false)
    expect(runLoader("www.fruitionservices.io", "/internally-built")).toBe(true)
  })
})

describe("trackClarityEnquiry", () => {
  afterEach(() => {
    delete window.clarity
  })

  it("sets the source and path, then fires enquiry_submitted once", () => {
    const clarity = vi.fn()
    window.clarity = clarity
    trackClarityEnquiry("cro-audit")
    expect(clarity.mock.calls).toEqual([
      ["set", "form_source", "cro-audit"],
      ["set", "page_path", window.location.pathname],
      ["event", "enquiry_submitted"],
    ])
  })

  it("falls back to an unknown source", () => {
    const clarity = vi.fn()
    window.clarity = clarity
    trackClarityEnquiry(undefined)
    expect(clarity).toHaveBeenCalledWith("set", "form_source", "unknown")
  })

  it("is a no-op without Clarity", () => {
    delete window.clarity
    expect(() => trackClarityEnquiry("cro-audit")).not.toThrow()
  })

  it("never throws when Clarity does", () => {
    window.clarity = () => {
      throw new Error("boom")
    }
    expect(() => trackClarityEnquiry("cro-audit")).not.toThrow()
  })
})
