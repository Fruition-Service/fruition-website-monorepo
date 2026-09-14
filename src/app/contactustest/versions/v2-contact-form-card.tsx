"use client"

/**
 * ARCHIVED SNAPSHOT — src/components/sections/ContactFormCard.tsx as of 6c66013 (29 July 2026, PR #83).
 *
 * The message form of the same release, lifted out of the contact page into a shared card.
 *
 * Frozen on purpose. Nothing here should be refactored, re-themed or kept
 * in step with the live component: the page it feeds exists to show what
 * the card actually looked like on that date, and an edit here is a lie
 * about the past. Two departures from the committed file, both mechanical:
 * imports point at their present-day paths, and every write goes through
 * previewWrite (./previewWrite.ts) so an archived card can never create a
 * lead, an enquiry or a booking.
 */
import { previewWrite } from "./previewWrite"

import { useState } from "react"

/**
 * The shared contact-form card (form + "what happens next" brand panel).
 * Extracted from ContactSection so any page can drop it in with its own
 * heading — e.g. /monday-training uses "Book a FREE Training Consultation".
 * Submissions post to /api/contact and flow into the ILE lead pipeline; the
 * `source` prop becomes the lead's utm_source so per-page volume is visible.
 */

interface ContactFormCardProps {
  heading?: string
  subheading?: string
  salesEmail?: string
  /** Which form/page the lead came from — the lead's utm_source. */
  source?: string
}

const SERVICE_OPTIONS = [
  "monday.com implementation",
  "Workflow automation",
  "Integrations",
  "Training & enablement",
  "Strategy & consulting",
  "Other",
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Canonical shared field style — .form-field in globals.css (DESIGN.md Inputs) */
const inputClass = "form-field"

export default function ContactFormCard({
  heading = "Tell us what you’re building",
  subheading = "A specialist reads every message and replies within one business day.",
  salesEmail = "contact@fruitionservices.io",
  source = "contact-us",
}: ContactFormCardProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")
  const [service, setService] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      service,
      source,
      website: String(fd.get("website") ?? ""), // honeypot
    }

    const errs: Record<string, boolean> = {}
    if (!payload.firstName) errs.firstName = true
    if (!EMAIL_RE.test(payload.email)) errs.email = true
    if (!payload.message) errs.message = true
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      setStatus("error")
      setError("Please fill in your name, a valid email, and a message.")
      return
    }

    setStatus("sending")
    setError("")
    try {
      const r = await previewWrite("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (r.ok && body.ok) {
        setStatus("done")
      } else {
        setStatus("error")
        setError(body.error || "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setError("Network error. Please try again.")
    }
  }

  return (
    <section className="bg-surface px-4 pt-20 pb-24">
      <div className="mx-auto grid bg-surface-raised dark:shadow-none dark:border dark:border-ui max-w-[1100px] gap-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[24px] border border-[#ece7fb] shadow-[0_30px_70px_-50px_rgba(64,12,140,0.4)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: form */}
          <div className="p-[clamp(28px,4vw,48px)]">
            <h2 className="text-section-h3 text-body">{heading}</h2>
            <p className="text-muted text-[15px] leading-[22px] mt-2.5 mb-[26px]">{subheading}</p>

            {status === "done" ? (
              <div
                className="rounded-card bg-[#f5fbf6] border border-[#d6ecd9] p-[22px] text-[#1e7a40] text-base leading-6"
                role="status"
              >
                Thanks for reaching out. Your message is on its way to {salesEmail} and we&rsquo;ll be in touch within one business day.
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="firstName" label="First name" required invalid={fieldErrors.firstName} />
                  <Field name="lastName" label="Last name" />
                </div>
                <Field name="email" label="Email" type="email" required invalid={fieldErrors.email} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="company" label="Company (optional)" />
                  <Field name="phone" label="Phone (optional)" type="tel" />
                </div>

                <fieldset className="border-0 p-0 m-0">
                  <legend className="text-[13px] text-body font-semibold mb-2">
                    What can we help with?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((opt) => {
                      const selected = service === opt
                      return (
                        <label
                          key={opt}
                          className="inline-flex items-center px-3.5 py-2 rounded-full text-[13.5px] font-medium cursor-pointer transition-colors"
                          style={{
                            border: `1px solid ${selected ? "var(--purple-primary)" : "var(--border-ui)"}`,
                            background: selected ? "var(--purple-soft)" : "var(--surface-raised)",
                            color: selected ? "var(--purple-dark)" : "var(--text-body)",
                          }}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={opt}
                            checked={selected}
                            onChange={() => setService(opt)}
                            className="absolute opacity-0 w-px h-px"
                          />
                          {opt}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <TextArea name="message" label="Message" required invalid={fieldErrors.message} />

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />

                {status === "error" && (
                  <p role="alert" className="text-[#c0392b] text-sm">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="cta-btn cta-btn-primary self-start mt-1"
                  style={{ opacity: status === "sending" ? 0.7 : 1 }}
                >
                  <span className="cta-btn-label">{status === "sending" ? "Sending…" : "Send message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: brand panel */}
          <aside className="relative overflow-hidden text-white p-[clamp(28px,4vw,48px)] bg-[linear-gradient(150deg,var(--color-brand-dark)_0%,var(--color-brand)_60%,var(--color-brand-light)_100%)]">
            <div
              aria-hidden="true"
              className="absolute w-[360px] h-[360px] right-[-120px] top-[-120px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),rgba(255,255,255,0))]"
            />
            <div className="relative">
              <h3 className="text-[22px] font-semibold leading-[1.3]">What happens next</h3>
              <ol className="mt-[22px] flex flex-col gap-5 list-none p-0">
                {[
                  ["We read your message", "A real person on the team, not a queue."],
                  ["You hear back within a day", "We reply with next steps or a few clarifying questions."],
                  ["We map out the work together", "A short call if it helps, scoped to what you need."],
                ].map(([title, body], i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="shrink-0 w-[30px] h-[30px] rounded-full bg-white/[0.16] grid place-items-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-[15.5px]">{title}</div>
                      <div className="text-sm leading-5 text-white/80 mt-0.5">{body}</div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-9 pt-6 border-t border-white/[0.18]">
                <div className="text-[13px] text-white/70">Prefer email?</div>
                <a href={`mailto:${salesEmail}`} className="text-base font-semibold text-white">
                  {salesEmail}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function FieldLabel({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] text-body font-semibold">{label}</span>}
      {children}
    </label>
  )
}

function Field({
  name,
  label,
  type = "text",
  required,
  invalid,
}: {
  name: string
  label?: string
  type?: string
  required?: boolean
  invalid?: boolean
}) {
  return (
    <FieldLabel label={label}>
      <input name={name} type={type} required={required} aria-invalid={invalid || undefined} className={inputClass} />
    </FieldLabel>
  )
}

function TextArea({ name, label, required, invalid }: { name: string; label?: string; required?: boolean; invalid?: boolean }) {
  return (
    <FieldLabel label={label}>
      <textarea name={name} required={required} rows={4} aria-invalid={invalid || undefined} className={`${inputClass} resize-y`} />
    </FieldLabel>
  )
}
