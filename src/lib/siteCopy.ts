/**
 * Copy slots for the parts every page shares: the announcement strip, the
 * mid-page audit banner and the booking band and card.
 *
 * Same contract as the home page (`src/components/home/copy.ts`): the text
 * lives on the `siteSettings` document as `copy[]`, one entry per slot keyed by
 * slot id, so the inline editor can edit it in place. The wording below is the
 * default and shows whenever a slot is missing or emptied in Sanity.
 * `scripts/seed-home-copy.ts --site` writes these defaults for any slot that
 * doesn't exist yet. The nav and footer are not here: their text already lives
 * in their own `siteSettings` fields.
 *
 * To add shared text: add a slot here, read it with useSiteText() (client) or
 * siteText() (server), then run the seed script.
 */

export const SITE_COPY = {
  // Announcement strip above the nav
  "award-text": { label: "Top banner: announcement", text: "Fruition named OpenAI Select Partner" },
  "award-link": { label: "Top banner: link", text: "Read the announcement →" },

  // Mid-page audit banner (default wording; a page can pass its own)
  "audit-heading": { label: "Audit banner: heading", text: "Ready to build systems that scale with your team?" },
  "audit-body": {
    label: "Audit banner: body",
    text: "Book a complimentary 30-minute audit with a Fruition consultant — we will map your workflows, spot the automation wins and show you what the build looks like.",
  },
  "audit-cta": { label: "Audit banner: button", text: "Book a 30-Min System Audit" },

  // Booking band, default wording
  "booking-eyebrow": { label: "Booking band: eyebrow (default)", text: "See it on your pipeline" },
  "booking-heading": { label: "Booking band: heading (default)", text: "Watch your sales process run on monday CRM." },
  "booking-sub": {
    label: "Booking band: paragraph (default)",
    text: "Pick a time and we'll map your pipeline live on the call: your stages, your handoffs, your reporting. No slides.",
  },
  "booking-proof": { label: "Booking band: proof line", text: "Platinum monday.com partner · 900+ implementations" },

  // Booking band on /contact-us
  "booking-contact-eyebrow": { label: "Contact page booking band: eyebrow", text: "Book a call" },
  "booking-contact-heading": { label: "Contact page booking band: heading", text: "Tell us what you’re building" },
  "booking-contact-sub": {
    label: "Contact page booking band: paragraph",
    text: "Pick a time and talk it through with a specialist, or email us and we’ll reply within one business day.",
  },

  // Booking band on pages that use the Calendly section
  "booking-calendly-eyebrow": { label: "Calendly booking band: eyebrow", text: "Book a time" },
  "booking-calendly-heading": {
    label: "Calendly booking band: heading (when the page sets none)",
    text: "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  },

  // Booking band on /training
  "booking-training-eyebrow": { label: "Training page booking band: eyebrow", text: "monday.com training" },
  "booking-training-heading": { label: "Training page booking band: heading", text: "Book a FREE Training Consultation" },
  "booking-training-sub": {
    label: "Training page booking band: paragraph",
    text: "Tell us about your team and the workflows you want to master, we’ll tailor the session live on the call.",
  },

  // Booking card: pick a time
  "card-title": { label: "Booking card: title (before the length)", text: "Discovery call" },
  "card-desk-fallback": { label: "Booking card: consultant line before region is known", text: "with a certified monday consultant" },
  "card-loading": { label: "Booking card: loading message", text: "Loading available times…" },
  "card-pick-day": { label: "Booking card: time column before a day is picked", text: "Pick a day" },
  "card-no-slots": { label: "Booking card: no times on that day", text: "Nothing open — try another day." },
  "card-pick-cta": { label: "Booking card: button before a time is picked", text: "Pick a time to continue" },
  "card-live-note": { label: "Booking card: note under the button", text: "Live availability · confirmed instantly" },

  // Booking card: your details
  "card-field-name": { label: "Booking card: name field", text: "Name" },
  "card-field-email": { label: "Booking card: email field", text: "Work email" },
  "card-field-company": { label: "Booking card: company field", text: "Company" },
  "card-prepare": { label: "Booking card: platforms question", text: "What should we prepare for? (pick any)" },
  "card-message": { label: "Booking card: message question", text: "Anything we should read first? (optional)" },
  "card-continue": { label: "Booking card: details button", text: "Continue to confirm" },
  "card-privacy": { label: "Booking card: privacy line", text: "By booking you agree to our privacy policy. We never share your details." },

  // Booking card: confirm and fallback
  "card-confirm-note": { label: "Booking card: confirm step note", text: "Your details are filled in already, just press Schedule." },
  "card-fallback-cta": { label: "Booking card: open calendar link (when times fail to load)", text: "Open the booking calendar" },
} as const satisfies Record<string, { label: string; text: string }>

export type SiteCopySlot = keyof typeof SITE_COPY
export type SiteCopy = Partial<Record<string, string>>

export function siteText(copy: SiteCopy | undefined, id: SiteCopySlot): string {
  const v = copy?.[id]
  return v && v.trim() ? v : SITE_COPY[id].text
}

/** Sanity `copy[]` → lookup map. */
export function toSiteCopy(slots: { _key?: string; text?: string }[] | null | undefined): SiteCopy {
  const out: SiteCopy = {}
  for (const s of slots ?? []) if (s?._key && typeof s.text === "string") out[s._key] = s.text
  return out
}
