/**
 * Lead conversion tracking.
 *
 * Pushes a `generate_lead` event onto the GTM dataLayer (container GTM-PF6XWTL6)
 * after a lead form has been accepted by /api/leads. In the container it fires:
 *
 * - the Google Ads "Website contact form" conversion (Submit lead forms goal),
 * - a GA4 `generate_lead` event, which is a key event in the Fruition property.
 *
 * Push only on a confirmed `ok` from the API, never on submit, so a failed or
 * spam-trapped submission is not counted. The booking flow is tracked separately
 * (GTM listens for Calendly's `calendly.event_scheduled` message), so the
 * booking card's details step deliberately does not call this: one booking
 * would otherwise count as both a lead and an appointment.
 */

export function trackLead(source: string | undefined): void {
  if (typeof window === "undefined") return
  try {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({
      event: "generate_lead",
      form_source: source || "unknown",
      page_path: window.location.pathname,
    })
  } catch {
    // Analytics must never break the form.
  }
}
