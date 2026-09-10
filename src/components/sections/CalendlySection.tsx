import BookingSection, { type BookingRegion } from "./BookingSection"

/**
 * Thin wrapper over the unified BookingSection so every existing placement
 * (~15 hardcoded pages plus the Sanity page-builder `calendlyBlock`) upgrades
 * in place. `calendlyUrl` remains the last-resort link when availability fails.
 *
 * `region` exists for the country landing pages. Those pages are already an
 * answer to "where are you?" — someone reading /monday-partner-uk wants the UK
 * desk whatever their IP says — so declaring it beats geo-detection there. Every
 * other placement omits it and detection runs as before.
 */

interface CalendlySectionProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
  /**
   * Pins the desk for a country page, instead of detecting it from the
   * visitor's IP. The switch on the card still works, so a visitor reading
   * another country's page can put themselves back on their own desk.
   *
   * Named in full because TeamGridSection sits a few lines away on these same
   * pages and takes its own `region` — a different, overlapping vocabulary
   * (TeamRegion), so a bare `region` here invites pasting one into the other.
   */
  bookingRegion?: BookingRegion
}

export default function CalendlySection({
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  subheading,
  calendlyUrl,
  bookingRegion,
}: CalendlySectionProps) {
  return (
    <BookingSection
      eyebrow="Book a consultation"
      heading={heading}
      sub={subheading}
      calendlyUrl={calendlyUrl}
      forceRegion={bookingRegion}
    />
  )
}
