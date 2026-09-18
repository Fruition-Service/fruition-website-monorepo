"use client"

import { Button } from "@/components/ui/button"

import { useRef, useState, useTransition } from "react"
import { Camera, Hand } from "lucide-react"

interface RegionOption {
  value: string
  label: string
}

interface Props {
  regionOptions: RegionOption[]
}

interface SubmitResult {
  ok: boolean
  sanityId?: string
  mondayItemId?: string
  warnings?: string[]
  error?: string
}

const MAX_PHOTO_BYTES = 8 * 1024 * 1024
const todayIso = () => new Date().toISOString().slice(0, 10)

export default function OnboardingForm({ regionOptions }: Props) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [region, setRegion] = useState(regionOptions[0]?.value ?? "APAC")
  const [bio, setBio] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [emoji, setEmoji] = useState("")
  const [favouriteMovie, setFavouriteMovie] = useState("")
  const [favouriteFruit, setFavouriteFruit] = useState("")
  const [workAnniversary, setWorkAnniversary] = useState(todayIso())
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | null) {
    setPhotoError(null)
    if (!file) {
      setPhoto(null)
      setPhotoPreview(null)
      return
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.")
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo is too large (max 8 MB).")
      return
    }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!photo) {
      setPhotoError("A photo is required.")
      return
    }
    const fd = new FormData()
    fd.set("name", name.trim())
    fd.set("role", role.trim())
    fd.set("region", region)
    fd.set("bio", bio.trim())
    fd.set("linkedinUrl", linkedinUrl.trim())
    fd.set("emoji", emoji.trim())
    fd.set("favouriteMovie", favouriteMovie.trim())
    fd.set("favouriteFruit", favouriteFruit.trim())
    fd.set("workAnniversary", workAnniversary)
    fd.set("photo", photo)
    startTransition(async () => {
      const r = await fetch("/api/internal/onboarding", { method: "POST", body: fd })
      const data = (await r.json().catch(() => ({}))) as SubmitResult
      if (!r.ok || !data.ok) {
        setError(data.error ?? "Submission failed. Please try again.")
        return
      }
      setResult(data)
    })
  }

  if (result?.ok) {
    return (
      <div className="space-y-6 text-center">
        {photoPreview && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photoPreview}
            alt={name}
            className="mx-auto h-32 w-32 rounded-pill object-cover"
            style={{ boxShadow: "var(--shadow-card)" }}
          />
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--purple-primary)]">
            All done
          </p>
          <h2 className="mt-2 inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
            Welcome, {name}
            <Hand size={24} aria-hidden />
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Your profile is being published to fruitionservices.com and the monday.com team board.
            Refresh /fruition-team in a minute or two to see your card.
          </p>
        </div>
        {result.warnings && result.warnings.length > 0 && (
          <div
            className="mx-auto max-w-md rounded-chip px-4 py-3 text-left text-sm"
            style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
          >
            <p className="font-semibold">Heads up:</p>
            <ul className="mt-1 list-inside list-disc">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-sm">
          {result.mondayItemId && (
            <a
              href={`https://fruitionservices.monday.com/boards/1879224155/pulses/${result.mondayItemId}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--purple-primary)] underline-offset-4 hover:underline"
            >
              View your monday.com pulse →
            </a>
          )}
          <a
            href="/fruition-team"
            className="font-medium text-[var(--purple-primary)] underline-offset-4 hover:underline"
          >
            View the team page →
          </a>
        </div>
      </div>
    )
  }

  const photoBoxBorder = dragActive
    ? "var(--purple-primary)"
    : photo
      ? "var(--purple-light)"
      : "var(--color-border)"

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Full name" required>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Edward Zhang"
          className={inputClass}
        />
      </Field>
      <Field label="Role / Job title" required>
        <input
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Senior Web Developer"
          className={inputClass}
        />
      </Field>
      <Field label="Primary region" required>
        <div className="relative">
          <select
            required
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`${inputClass} appearance-none pr-11`}
          >
            {regionOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
        </div>
      </Field>
      <Field label="Photo" hint="Square headshot works best. Max 8 MB." required>
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          htmlFor="photo-input"
          className="flex cursor-pointer items-center gap-4 rounded-chip border border-dashed bg-surface p-4 transition"
          style={{ borderColor: photoBoxBorder }}
        >
          {photoPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoPreview}
              alt="preview"
              className="h-20 w-20 rounded-pill object-cover"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-pill text-[var(--color-text-secondary)]"
              style={{ backgroundColor: "var(--light-section-bg)" }}
              aria-hidden
            >
              <Camera size={32} aria-hidden />
            </div>
          )}
          <div className="flex-1 text-sm">
            <p className="font-medium text-ink-heading">
              {photo ? photo.name : "Drop a photo or click to choose"}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              {photo
                ? `${(photo.size / 1024 / 1024).toFixed(2)} MB · ${photo.type}`
                : "PNG, JPG, or WebP up to 8 MB"}
            </p>
          </div>
        </label>
        <input
          id="photo-input"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
        {photoError && <p className="mt-2 text-xs text-danger">{photoError}</p>}
      </Field>
      <Field label="Short bio" hint="2–4 sentences. What you focus on at Fruition.">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={1200}
          className={`${inputClass} resize-y`}
          placeholder="Tell future clients what you bring to the team…"
        />
      </Field>
      <Field label="LinkedIn URL">
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://www.linkedin.com/in/your-handle/"
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Emoji" hint="Optional fallback — e.g. 🥭">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value.slice(0, 4))}
            maxLength={4}
            className={inputClass}
            placeholder="🥭"
          />
        </Field>
        <Field label="Work anniversary">
          <div className="relative">
            <input
              type="date"
              value={workAnniversary}
              onChange={(e) => setWorkAnniversary(e.target.value)}
              className={`${inputClass} pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
            />
            <CalendarIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          </div>
        </Field>
        <Field label="Favourite movie">
          <input
            value={favouriteMovie}
            onChange={(e) => setFavouriteMovie(e.target.value)}
            className={inputClass}
            placeholder="The Princess Bride"
          />
        </Field>
        <Field label="Favourite fruit">
          <input
            value={favouriteFruit}
            onChange={(e) => setFavouriteFruit(e.target.value)}
            className={inputClass}
            placeholder="Mango"
          />
        </Field>
      </div>
      {error && (
        <div
          className="rounded-chip px-3 py-2 text-sm"
          style={{ backgroundColor: "var(--danger-surface)", color: "var(--danger-strong)" }}
          role="alert"
        >
          {error}
        </div>
      )}
      <Button type="submit" variant="brand" size="lg" disabled={pending} className="w-full">
        {pending ? "Adding you to the team…" : "Add me to the team"}
      </Button>
    </form>
  )
}

const inputClass =
  "block w-full rounded-chip border border-[var(--color-border)] bg-surface px-4 py-3 text-sm text-ink-heading placeholder:text-ink-faint outline-none transition hover:border-[var(--purple-light)] focus:border-[var(--purple-primary)] focus:ring-2 focus:ring-[rgba(128,21,232,0.18)]"

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-ink-heading">
        <span>
          {label}
          {required && <span className="ml-1 text-[var(--purple-primary)]">*</span>}
        </span>
        {hint && (
          <span className="text-xs font-normal text-[var(--color-text-secondary)]">{hint}</span>
        )}
      </label>
      {children}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M16 3v3M8 3v3M3 9.5h18" />
    </svg>
  )
}
