"use client"

/**
 * ARCHIVED SNAPSHOT — src/components/sections/ContactSection.tsx as of 8b7a29d (4 June 2026, commit "feat: contact us").
 *
 * The contact page as it first shipped: hero, dotted world map, office band and a message form.
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
import WorldMap, { type MapOffice } from "@/components/sections/WorldMap"

export interface ContactOffice extends MapOffice {
  flag?: string
  phone?: string
  phoneTel?: string
  label?: string
}

interface ContactSectionProps {
  offices: ContactOffice[]
  /** Where the form is sent + the "Sales" channel. */
  salesEmail: string
  /** Support channel email. */
  supportEmail: string
  /** Display phone + tel: target. */
  phone?: string
  phoneTel?: string
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ddd6f3",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 15,
  color: "#10003a",
  background: "#fff",
}

export default function ContactSection({
  offices,
  salesEmail,
  supportEmail,
  phone,
  phoneTel,
}: ContactSectionProps) {
  return (
    <>
      <ContactHero offices={offices} salesEmail={salesEmail} supportEmail={supportEmail} phone={phone} phoneTel={phoneTel} />
      <OfficeBand offices={offices} />
      <ContactForm salesEmail={salesEmail} />
    </>
  )
}

/* ── Hero: headline, world map, three contact channels ─────────────────── */

function ContactHero({ offices, salesEmail, supportEmail, phone, phoneTel }: ContactSectionProps) {
  const telHref = phoneTel || (phone ? phone.replace(/[^\d+]/g, "") : "")
  // The CMS often uses one shared inbox — don't show the same address twice.
  const sameInbox = salesEmail.toLowerCase() === supportEmail.toLowerCase()
  return (
    <section className="bg-white px-4">
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1100, paddingTop: 104, paddingBottom: 24 }}>
        <span
          className="inline-flex items-center rounded-full"
          style={{
            backgroundColor: "#f4ecff",
            color: "var(--purple-primary)",
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: "1px solid #e4d6fb",
          }}
        >
          Contact us
        </span>

        <h1
          className="text-center"
          style={{
            marginTop: 24,
            maxWidth: 860,
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#10003a",
            textWrap: "balance",
          }}
        >
          We&rsquo;d love to hear from you
        </h1>

        <p
          className="text-center text-body-lead"
          style={{ marginTop: 20, maxWidth: 600, color: "#4a4a4a", textWrap: "pretty" }}
        >
          Reach the team directly, or find the office nearest you. We answer every message within one business day.
        </p>
      </div>

      {/* World map */}
      <div className="mx-auto px-4" style={{ maxWidth: 1100, paddingTop: 12, paddingBottom: 16 }}>
        <WorldMap offices={offices} />
      </div>

      {/* Channels */}
      <div className="mx-auto px-4" style={{ maxWidth: 1000, paddingTop: 24, paddingBottom: 88 }}>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, textAlign: "center" }}
        >
          {sameInbox ? (
            <Channel
              title="Email"
              blurb="Sales, support, or a general question."
              value={salesEmail}
              href={`mailto:${salesEmail}`}
            />
          ) : (
            <>
              <Channel
                title="Sales"
                blurb="New project or partnership? Start here."
                value={salesEmail}
                href={`mailto:${salesEmail}`}
              />
              <Channel
                title="Support"
                blurb="Existing client needing a hand."
                value={supportEmail}
                href={`mailto:${supportEmail}`}
              />
            </>
          )}
          <Channel
            title="Phone"
            blurb="Monday to Friday, business hours AEST."
            value={phone || "—"}
            href={telHref ? `tel:${telHref}` : undefined}
          />
          <Channel
            title="LinkedIn"
            blurb="Follow along and connect with the team."
            value="linkedin.com/company/fruition-services"
            href="https://www.linkedin.com/company/fruition-services"
          />
        </div>
      </div>
    </section>
  )
}

function Channel({ title, blurb, value, href }: { title: string; blurb: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 6 }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: "#10003a" }}>{title}</h2>
      <p style={{ fontSize: 14, color: "#686b82", lineHeight: "20px", maxWidth: 240 }}>{blurb}</p>
      {href ? (
        <a
          href={href}
          style={{ fontSize: 15, fontWeight: 600, color: "var(--purple-primary)", marginTop: 2, wordBreak: "break-word" }}
        >
          {value}
        </a>
      ) : (
        <span style={{ fontSize: 15, fontWeight: 600, color: "#686b82", marginTop: 2 }}>{value}</span>
      )}
    </div>
  )
}

/* ── Office band: full-bleed purple, addresses ─────────────────────────── */

function OfficeBand({ offices }: { offices: ContactOffice[] }) {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #10003a 0%, #2b074d 55%, #550e9b 100%)",
        padding: "96px 0",
      }}
    >
      <div className="mx-auto px-4 fr-office-band" style={{ maxWidth: 1280 }}>
        {/* Heading column */}
        <div style={{ maxWidth: 360, minWidth: 0 }}>
          <p style={{ color: "#d9bff5", fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>
            Our locations
          </p>
          <h2
            className="text-section-h2"
            style={{ color: "#ffffff", marginTop: 12, textWrap: "balance" }}
          >
            Visit our offices
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 20, lineHeight: "30px", marginTop: 20 }}>
            Local teams across {offices.length} cities, working in your timezone.
          </p>
        </div>

        {/* Office list */}
        <div className="fr-office-list">
          {offices.map((o, i) => (
            <div key={`${o.city}-${i}`} className="fr-office-item">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {o.flag && <span style={{ fontSize: 18, lineHeight: 1 }}>{o.flag}</span>}
                <span style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", lineHeight: "28px" }}>{o.city}</span>
              </div>
              {o.address &&
                (o.addressUrl ? (
                  <a
                    href={o.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", fontSize: 16, lineHeight: "24px", color: "rgba(255,255,255,0.72)", marginTop: 4 }}
                  >
                    {o.address}
                  </a>
                ) : (
                  <p style={{ fontSize: 16, lineHeight: "24px", color: "rgba(255,255,255,0.72)", marginTop: 4 }}>
                    {o.address}
                  </p>
                ))}
              {o.phone && (
                <a
                  href={`tel:${o.phoneTel || o.phone.replace(/[^\d+]/g, "")}`}
                  style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,0.72)", marginTop: 4 }}
                >
                  {o.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .fr-office-band {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .fr-office-list {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }
        .fr-office-item {
          flex: 1 0 0;
          min-width: 240px;
          max-width: 320px;
        }
        @media (min-width: 900px) {
          .fr-office-band { flex-direction: row; align-items: flex-start; gap: 64px; }
          .fr-office-band > div:first-child { flex: 0 0 auto; }
          .fr-office-list { flex: 1 1 0; gap: 32px 64px; }
        }
      `}</style>
    </section>
  )
}

/* ── Contact form ──────────────────────────────────────────────────────── */

function ContactForm({ salesEmail }: { salesEmail: string }) {
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
      phone: String(fd.get("phone") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      service,
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
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 96 }}>
      <div
        className="mx-auto grid"
        style={{ maxWidth: 1100, gap: 0, gridTemplateColumns: "minmax(0, 1fr)", overflow: "hidden", borderRadius: 24, border: "1px solid #ece7fb", boxShadow: "0 30px 70px -50px rgba(64,12,140,0.4)" }}
      >
        <div className="fr-form-grid">
          {/* Left: form */}
          <div style={{ padding: "clamp(28px, 4vw, 48px)" }}>
            <h2 className="text-section-h3" style={{ color: "#10003a" }}>
              Tell us what you&rsquo;re building
            </h2>
            <p style={{ color: "#686b82", fontSize: 15, lineHeight: "22px", marginTop: 10, marginBottom: 26 }}>
              A specialist reads every message and replies within one business day.
            </p>

            {status === "done" ? (
              <div
                className="rounded-card"
                style={{ background: "#f5fbf6", border: "1px solid #d6ecd9", padding: 22, color: "#1e7a40", fontSize: 16, lineHeight: "24px" }}
                role="status"
              >
                Thanks for reaching out. Your message is on its way to {salesEmail} and we&rsquo;ll be in touch within one business day.
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col" style={{ gap: 16 }}>
                <div className="fr-name-row" style={{ display: "grid", gap: 16 }}>
                  <Field name="firstName" label="First name" required invalid={fieldErrors.firstName} />
                  <Field name="lastName" label="Last name" />
                </div>
                <Field name="email" label="Email" type="email" required invalid={fieldErrors.email} />
                <Field name="phone" label="Phone (optional)" type="tel" />

                <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend style={{ fontSize: 13, color: "#10003a", fontWeight: 600, marginBottom: 8 }}>
                    What can we help with?
                  </legend>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SERVICE_OPTIONS.map((opt) => {
                      const selected = service === opt
                      return (
                        <label
                          key={opt}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderRadius: 9999,
                            fontSize: 13.5,
                            fontWeight: 500,
                            cursor: "pointer",
                            border: `1px solid ${selected ? "var(--purple-primary)" : "#ddd6f3"}`,
                            background: selected ? "#f4ecff" : "#fff",
                            color: selected ? "var(--purple-dark)" : "#4a4a4a",
                            transition: "border-color 0.18s ease, background 0.18s ease, color 0.18s ease",
                          }}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={opt}
                            checked={selected}
                            onChange={() => setService(opt)}
                            style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
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
                  <p role="alert" style={{ color: "#c0392b", fontSize: 14 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="cta-btn cta-btn-primary"
                  style={{ alignSelf: "flex-start", marginTop: 4, opacity: status === "sending" ? 0.7 : 1 }}
                >
                  <span className="cta-btn-label">{status === "sending" ? "Sending…" : "Send message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: brand panel */}
          <aside
            className="fr-form-aside"
            style={{
              background: "linear-gradient(150deg, #550e9b 0%, #8015e8 60%, #ba83f0 100%)",
              padding: "clamp(28px, 4vw, 48px)",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 360,
                height: 360,
                right: -120,
                top: -120,
                borderRadius: "9999px",
                background: "radial-gradient(circle, rgba(255,255,255,0.22), rgba(255,255,255,0))",
              }}
            />
            <div style={{ position: "relative" }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3 }}>What happens next</h3>
              <ol style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 20, listStyle: "none", padding: 0 }}>
                {[
                  ["We read your message", "A real person on the team, not a queue."],
                  ["You hear back within a day", "We reply with next steps or a few clarifying questions."],
                  ["We map out the work together", "A short call if it helps, scoped to what you need."],
                ].map(([title, body], i) => (
                  <li key={i} style={{ display: "flex", gap: 14 }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 30,
                        height: 30,
                        borderRadius: 9999,
                        background: "rgba(255,255,255,0.16)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15.5 }}>{title}</div>
                      <div style={{ fontSize: 14, lineHeight: "20px", color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{body}</div>
                    </div>
                  </li>
                ))}
              </ol>

              <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.18)" }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Prefer email?</div>
                <a href={`mailto:${salesEmail}`} style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                  {salesEmail}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .fr-form-grid { display: grid; grid-template-columns: 1fr; }
        .fr-name-row { grid-template-columns: 1fr; }
        @media (min-width: 600px) {
          .fr-name-row { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 880px) {
          .fr-form-grid { grid-template-columns: 1.15fr 0.85fr; }
        }
      `}</style>
    </section>
  )
}

function FieldLabel({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col" style={{ gap: 6 }}>
      {label && <span style={{ fontSize: 13, color: "#10003a", fontWeight: 600 }}>{label}</span>}
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
      <input
        name={name}
        type={type}
        required={required}
        aria-invalid={invalid || undefined}
        style={{ ...inputStyle, borderColor: invalid ? "#e0708a" : "#ddd6f3" }}
      />
    </FieldLabel>
  )
}

function TextArea({ name, label, required, invalid }: { name: string; label?: string; required?: boolean; invalid?: boolean }) {
  return (
    <FieldLabel label={label}>
      <textarea
        name={name}
        required={required}
        rows={4}
        aria-invalid={invalid || undefined}
        style={{ ...inputStyle, resize: "vertical", borderColor: invalid ? "#e0708a" : "#ddd6f3" }}
      />
    </FieldLabel>
  )
}
