"use client"

import { useEffect } from "react"
import { trackClarityEnquiry } from "@/lib/clarity"
import { trackRyzeLead } from "@/lib/ryzePixel"
import { trackOpenAiConversion } from "@/lib/openaiPixel"

/**
 * Records a completed Calendly booking as a `booking_scheduled` PostHog event,
 * a Ryze `lead` event and an OpenAI Ads `appointment_scheduled` conversion.
 *
 * Calendly's inline embed reports bookings to the host page via postMessage
 * (`calendly.event_scheduled`). GTM already turns that into the Google Ads and
 * GA4 conversion; this gives PostHog the same signal so funnels and replays can
 * end on a real booking rather than on a CTA click. Ryze gets it through its
 * pre-load queue (window.ryzeq), so a booking made before px.js has loaded is
 * still sent. The ad landing pages have no React and send the same Ryze event
 * from RYZE_LANDING_HEAD in src/lib/ryzePixel.ts.
 *
 * Renders nothing. Mounted once in the root layout.
 */
export default function BookingEventTracker() {
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!/(^|\.)calendly\.com$/.test(new URL(e.origin, location.href).hostname)) return
      const data = e.data as { event?: string } | null
      if (data?.event !== "calendly.event_scheduled") return
      try {
        window.posthog?.capture("booking_scheduled", { page_path: window.location.pathname })
      } catch {
        // Analytics must never break the booking flow.
      }
      try {
        trackRyzeLead()
      } catch {
        // Same rule for Ryze.
      }
      trackOpenAiConversion("appointment_scheduled")
      // A booking is an enquiry: tag the Clarity recording like a lead form does.
      trackClarityEnquiry("calendly_booking")
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return null
}
