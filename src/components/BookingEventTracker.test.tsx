// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import BookingEventTracker from "@/components/BookingEventTracker"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | null = null
let container: HTMLElement | null = null

function mount() {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(<BookingEventTracker />))
}

function post(origin: string, event: string) {
  act(() => {
    window.dispatchEvent(new MessageEvent("message", { origin, data: { event } }))
  })
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = null
  container = null
  delete (window as { clarity?: unknown }).clarity
})

describe("BookingEventTracker", () => {
  it("fires the Clarity enquiry_submitted event on a completed Calendly booking", () => {
    const clarity = vi.fn()
    ;(window as unknown as { clarity: unknown }).clarity = clarity
    mount()
    post("https://calendly.com", "calendly.event_scheduled")
    expect(clarity).toHaveBeenCalledWith("event", "enquiry_submitted")
    expect(clarity).toHaveBeenCalledWith("set", "form_source", "calendly_booking")
  })

  it("ignores other Calendly events and other origins", () => {
    const clarity = vi.fn()
    ;(window as unknown as { clarity: unknown }).clarity = clarity
    mount()
    post("https://calendly.com", "calendly.date_and_time_selected")
    post("https://evil.example", "calendly.event_scheduled")
    expect(clarity).not.toHaveBeenCalled()
  })

  it("does nothing when Clarity is not loaded", () => {
    mount()
    expect(() => post("https://calendly.com", "calendly.event_scheduled")).not.toThrow()
  })
})
