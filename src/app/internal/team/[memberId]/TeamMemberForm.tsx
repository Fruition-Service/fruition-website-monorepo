"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { REGION_OPTIONS, CERTIFICATION_OPTIONS } from "@/lib/teamMemberOptions"

export interface TeamMemberDetail {
  _id: string
  name?: string
  role?: string
  emoji?: string
  bio?: string
  linkedinUrl?: string
  websiteUrl?: string
  regions?: string[]
  certifications?: string[]
  order?: number
  photoUrl?: string
}

/** Edit form for one team member; PATCHes the Sanity doc via the portal API. */
export default function TeamMemberForm({ member }: { member: TeamMemberDetail }) {
  const router = useRouter()
  const [name, setName] = React.useState(member.name ?? "")
  const [role, setRole] = React.useState(member.role ?? "")
  const [emoji, setEmoji] = React.useState(member.emoji ?? "")
  const [bio, setBio] = React.useState(member.bio ?? "")
  const [linkedinUrl, setLinkedinUrl] = React.useState(member.linkedinUrl ?? "")
  const [websiteUrl, setWebsiteUrl] = React.useState(member.websiteUrl ?? "")
  const [order, setOrder] = React.useState(member.order?.toString() ?? "")
  const [regions, setRegions] = React.useState<string[]>(member.regions ?? [])
  const [certifications, setCertifications] = React.useState<string[]>(
    member.certifications ?? [],
  )
  const [photo, setPhoto] = React.useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [status, setStatus] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!photo) {
      setPhotoPreview(null)
      return
    }
    const url = URL.createObjectURL(photo)
    setPhotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  function toggle(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  async function save() {
    setSaving(true)
    setStatus(null)
    setError(null)
    try {
      const fd = new FormData()
      fd.set("name", name.trim())
      fd.set("role", role.trim())
      fd.set("bio", bio.trim())
      fd.set("emoji", emoji.trim())
      fd.set("linkedinUrl", linkedinUrl.trim())
      fd.set("websiteUrl", websiteUrl.trim())
      fd.set("order", order.trim())
      regions.forEach((r) => fd.append("regions", r))
      certifications.forEach((c) => fd.append("certifications", c))
      if (photo) fd.set("photo", photo)

      const r = await fetch(`/api/internal/team/${encodeURIComponent(member._id)}`, {
        method: "PATCH",
        body: fd,
      })
      if (!r.ok) {
        throw new Error(((await r.json()) as { error?: string }).error || "Save failed.")
      }
      setStatus("Saved — live on the public site.")
      setPhoto(null)
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const currentPhoto = photoPreview ?? member.photoUrl ?? null

  return (
    <div className="grid max-w-3xl gap-6">
      <div className="flex items-center gap-4">
        {currentPhoto ? (
          <Image
            src={currentPhoto}
            alt={name || "Member photo"}
            width={72}
            height={72}
            className="size-18 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-18 items-center justify-center rounded-full bg-[rgba(128,21,232,0.10)] text-xl font-semibold text-[var(--purple-primary)]">
            {(name || "?").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="grid gap-1.5">
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">Leave empty to keep the current photo.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="emoji">Emoji</Label>
          <Input id="emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🍉" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Lower = earlier on the page"
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/…"
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="website">Personal website URL</Label>
          <Input
            id="website"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-ink-heading">Regions</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {REGION_OPTIONS.map((r) => (
            <label key={r.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={regions.includes(r.value)}
                onCheckedChange={() => toggle(regions, r.value, setRegions)}
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-ink-heading">Certifications</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {CERTIFICATION_OPTIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={certifications.includes(c)}
                onCheckedChange={() => toggle(certifications, c, setCertifications)}
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {status && <p className="text-sm text-green-700">{status}</p>}

      <div>
        <Button onClick={save} disabled={saving || !name.trim() || !role.trim()}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save member
        </Button>
      </div>
    </div>
  )
}
