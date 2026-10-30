"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { trackLead } from "@/lib/leadTracking"
import { stashThankYouMessage, THANK_YOU_PATH } from "@/lib/thankYou"
import { FORM, type PageContent } from "./content"

/** Sent as the lead's origin; shows up in monday and the GTM generate_lead event. */
const LEAD_ORIGIN = "implementation-packages"

const ATTRIBUTION_KEYS = ["gclid", "utm_source", "utm_medium", "utm_campaign"] as const

/**
 * Hero "free system audit" form. Posts to /api/leads, the same endpoint and
 * payload shape as the shared LeadForm (name, email, company + `fields`), so
 * the lead lands on the monday CRM board with Slack as the fallback. The
 * qualifying answers and any gclid/UTM values ride along in `fields`.
 */
/** `copy`: the editable wording (Sanity); the option lists stay in ./content because the CRM maps them. */
export default function AuditLeadForm({ copy }: { copy: PageContent["form"] }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")

  // Copy ad-click and campaign parameters from the URL into the hidden inputs.
  useEffect(() => {
    const form = formRef.current
    if (!form) return
    try {
      const params = new URLSearchParams(window.location.search)
      for (const key of ATTRIBUTION_KEYS) {
        const value = params.get(key)
        const input = form.elements.namedItem(key)
        if (value && input instanceof HTMLInputElement) input.value = value
      }
    } catch {
      /* attribution is best-effort */
    }
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? "").trim()

    const fields: Record<string, string> = {}
    const add = (label: string, value: string) => {
      if (value) fields[label] = value
    }
    add("Industry", get("industry"))
    add("monday.com today", get("monday_plan"))
    add("Product", get("product"))
    add("Region", get("region"))
    add("Process to fix", get("process"))
    for (const key of ATTRIBUTION_KEYS) add(key, get(key))

    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          company: get("company"),
          website: String(fd.get("website") ?? ""), // honeypot
          source: LEAD_ORIGIN,
          fields,
        }),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (r.ok && body.ok) {
        setStatus("done")
        trackLead(LEAD_ORIGIN)
        stashThankYouMessage(copy.thanks)
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

  if (status === "done") {
    return (
      <div className="rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8" role="status">
        <h3 className="text-card-title text-body">{copy.thanksHeading}</h3>
        <p className="text-body-sm mt-3 text-muted">{copy.thanks}</p>
      </div>
    )
  }

  return (
    <form
      id="lead"
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8"
      toolname="book_monday_implementation_audit"
      tooldescription="Request a free 30-minute monday.com system audit from Fruition Services, which recommends one of the three implementation packages. Requires name, company and work email; industry, current monday.com plan, product, region and the process to fix are optional. Fruition replies within one business day."
    >
      <h2 className="text-section-h3 text-body">{copy.heading}</h2>
      <p className="text-body-sm mt-2 text-muted">{copy.intro}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="f-name" name="name" label="Name" autoComplete="name" required />
        <Field id="f-co" name="company" label="Company" autoComplete="organization" required />
        <div className="md:col-span-2">
          <Field id="f-email" name="email" label="Work email" type="email" autoComplete="email" required />
        </div>
        <Choice id="f-ind" name="industry" label="Industry" options={FORM.industries} />
        <Choice id="f-plan" name="monday_plan" label="monday.com today" options={FORM.plans} />
        <Choice id="f-prod" name="product" label="Product" options={FORM.products} />
        <Choice id="f-reg" name="region" label="Region" options={FORM.regions} />
        <div className="md:col-span-2">
          <Field id="f-proc" name="process" label="The process you most want to fix (optional)" />
        </div>
      </div>

      {ATTRIBUTION_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} />
      ))}
      {/* Honeypot, hidden from people */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      {status === "error" && (
        <p role="alert" className="text-caption mt-4 text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`cta-btn cta-btn-primary mt-6 w-full ${status === "sending" ? "opacity-70" : ""}`}
      >
        <span className="cta-btn-label">{status === "sending" ? "Sending…" : copy.submit}</span>
      </button>
      <p className="text-micro mt-3 text-muted">
        {copy.footnote}{" "}
        <Link href="/data-privacy" className="underline hover:text-brand">
          Privacy
        </Link>
      </p>
    </form>
  )
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string
  name: string
  label: string
  type?: string
  autoComplete?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-semibold text-body">
        {label}
      </label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} required={required} className="form-field" />
    </div>
  )
}

function Choice({ id, name, label, options }: { id: string; name: string; label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-semibold text-body">
        {label}
      </label>
      <select id={id} name={name} defaultValue={options[0]} className="form-field">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
