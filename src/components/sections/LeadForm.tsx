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
  /**
   * Key the answer is sent under in `fields`. Defaults to `label`. Use it when
   * the visible label differs from the key the lead sinks read, e.g. "Phone"
   * (monday phone column) or "Message" (monday notes column).
   */
  name?: string
  /** HTML input type for text fields, e.g. "tel". Defaults to "text". */
  inputType?: "text" | "tel" | "url"
  /** Browser autofill hint, e.g. "tel". */
  autoComplete?: string
  placeholder?: string
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
  /** Show the optional Company field. Defaults to true. */
  showCompany?: boolean
  /**
   * "section" (default) wraps the card in its own full-width page section.
   * "card" renders only the card, for pages that place it in their own layout.
   */
  variant?: "section" | "card"
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
  showCompany = true,
  variant = "section",
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
      const key = f.name || f.label
      if (!key) continue
      const v = String(fd.get(key) ?? "").trim()
      if (v) extra[key] = v
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

  const card = (
      <div
        className={`rounded-card bg-surface-raised border border-brand-soft shadow-[0_24px_48px_-32px_rgba(64,12,140,0.28)] dark:shadow-none dark:border dark:border-ui ${
          variant === "card" ? "w-full p-6 md:p-8" : "mx-auto max-w-[620px] p-8"
        }`}
      >
        <h2 className={`${variant === "card" ? "text-section-h3" : "text-section-h2"} text-body ${subheading ? "mb-3" : "mb-6"}`}>
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
            <Field name="name" label="Full name" autoComplete="name" required />
            <Field name="email" label="Work email" type="email" autoComplete="email" required />
            {showCompany && <Field name="company" label="Company" autoComplete="organization" />}
            {fields.map((f, i) => {
              const name = f.name || f.label || `field-${i}`
              return f.type === "textarea" ? (
                <TextArea key={i} name={name} label={f.label} required={f.required} placeholder={f.placeholder} />
              ) : f.type === "select" ? (
                <Select key={i} name={name} label={f.label} options={f.options} required={f.required} />
              ) : (
                <Field
                  key={i}
                  name={name}
                  label={f.label}
                  type={f.inputType}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              )
            })}

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
  )

  if (variant === "card") return card

  return <section className="bg-surface px-4 py-[72px]">{card}</section>
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
  autoComplete,
  placeholder,
  required,
}: {
  name: string
  label?: string
  type?: string
  autoComplete?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <Labeled label={label}>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </Labeled>
  )
}

function TextArea({
  name,
  label,
  required,
  placeholder,
}: {
  name: string
  label?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <Labeled label={label}>
      <textarea name={name} required={required} placeholder={placeholder} rows={4} className={`${inputClass} resize-y`} />
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
