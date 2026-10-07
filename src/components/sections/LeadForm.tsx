"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { trackLead } from "@/lib/leadTracking"
import { stashThankYouMessage, THANK_YOU_PATH } from "@/lib/thankYou"

export interface LeadFormField {
  /** Stored/displayed label, e.g. "What is your primary bottleneck?" */
  label?: string
  /** Input kind */
  type?: "text" | "textarea" | "select"
  /** Options for select fields */
  options?: string[]
  required?: boolean
}

interface LeadFormProps {
  heading?: string
  subheading?: string
  /** Identifies which page/form the lead came from (sent as `source`) */
  source?: string
  /** Extra qualifying questions beyond name/email/company */
  fields?: LeadFormField[]
  submitLabel?: string
  successMessage?: string
}

/**
 * Low-friction intake/discovery form. Posts to /api/leads (Slack + monday).
 * Name + email + company are always present; `fields` add page-specific
 * qualifying questions. Includes a hidden honeypot for spam.
 *
 * On success the visitor is sent to /thank-you — the conversion gets its own
 * URL for analytics, and the confirmation gets somewhere to send them next.
 * `successMessage` travels with them (see `@/lib/thankYou`), and the inline
 * panel below still renders as the fallback for the moment before the route
 * change, and for good if client-side navigation never happens.
 */
export default function LeadForm({
  heading = "Tell us about your workflow",
  subheading,
  source,
  fields = [],
  submitLabel = "Request a free workflow audit",
  successMessage = "Thanks, we'll be in touch within one business day.",
}: LeadFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState<string>("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    const fd = new FormData(e.currentTarget)
    const extra: Record<string, string> = {}
    for (const f of fields) {
      if (!f.label) continue
      const v = String(fd.get(f.label) ?? "").trim()
      if (v) extra[f.label] = v
    }
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      website: String(fd.get("website") ?? ""), // honeypot
      source,
      fields: extra,
    }
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (r.ok && body.ok) {
        setStatus("done")
        trackLead(source)
        stashThankYouMessage(successMessage)
        router.push(THANK_YOU_PATH)
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
    <section className="bg-surface px-4 py-[72px]">
      <div className="mx-auto rounded-card bg-surface-raised max-w-[620px] p-8 border border-brand-soft shadow-[0_24px_48px_-32px_rgba(64,12,140,0.28)] dark:shadow-none dark:border dark:border-ui">
        <h2 className={`text-section-h2 text-body ${subheading ? "mb-3" : "mb-6"}`}>
          {heading}
        </h2>
        {subheading && (
          <p className="text-muted text-[15px] leading-[22px] mb-[22px]">{subheading}</p>
        )}

        {status === "done" ? (
          <div className="rounded-card bg-[#f5fbf6] border border-[#d6ecd9] p-5 text-[#1e8449] text-base">
            {successMessage}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
            // WebMCP tool attributes (see src/types/webmcp.d.ts): the site's
            // general enquiry form, offered to browser agents as a tool.
            toolname="contact_fruition"
            tooldescription="Submit a consulting enquiry to Fruition Services about monday.com, monday CRM, AI and automation, Atlassian or HubSpot work. Requires the visitor's name and work email; company and any page-specific qualifying questions are optional. Fruition replies within one business day."
          >
            <Field name="name" label="Full name" required />
            <Field name="email" label="Work email" type="email" required />
            <Field name="company" label="Company" />
            {fields.map((f, i) =>
              f.type === "textarea" ? (
                <TextArea key={i} name={f.label || `field-${i}`} label={f.label} required={f.required} />
              ) : f.type === "select" ? (
                <Select key={i} name={f.label || `field-${i}`} label={f.label} options={f.options} required={f.required} />
              ) : (
                <Field key={i} name={f.label || `field-${i}`} label={f.label} required={f.required} />
              ),
            )}

            {/* Honeypot — hidden from users */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            {status === "error" && (
              <p role="alert" className="text-[#c0392b] text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className={`cta-btn cta-btn-primary self-start ${status === "sending" ? "opacity-70" : ""}`}
            >
              <span className="cta-btn-label">{status === "sending" ? "Sending…" : submitLabel}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

/* Canonical shared field style — .form-field in globals.css (DESIGN.md Inputs) */
const inputClass = "form-field"

function Labeled({ label, children }: { label?: string; children: React.ReactNode }) {
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
}: {
  name: string
  label?: string
  type?: string
  required?: boolean
}) {
  return (
    <Labeled label={label}>
      <input name={name} type={type} required={required} className={inputClass} />
    </Labeled>
  )
}

function TextArea({ name, label, required }: { name: string; label?: string; required?: boolean }) {
  return (
    <Labeled label={label}>
      <textarea name={name} required={required} rows={3} className={`${inputClass} resize-y`} />
    </Labeled>
  )
}

function Select({
  name,
  label,
  options = [],
  required,
}: {
  name: string
  label?: string
  options?: string[]
  required?: boolean
}) {
  return (
    <Labeled label={label}>
      <select name={name} required={required} defaultValue="" className={inputClass}>
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Labeled>
  )
}
