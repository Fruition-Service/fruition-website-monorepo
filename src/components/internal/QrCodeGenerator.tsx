"use client"

import * as React from "react"
import qrcode from "qrcode-generator"
import { Download, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** Path of the logo-mark drawn in the middle of the code. Fetched once, recoloured per render. */
const MARK_SRC = "/images/logo-fruition-mark.svg"

/** Quiet zone, in modules. Four is the spec minimum; below it scanners get flaky. */
const MARGIN_MODULES = 4

/**
 * Fraction of the code's width covered by the logo plate. Error-correction level H
 * recovers ~30% of the symbol, so a quarter of the width is comfortably readable —
 * push past ~0.3 and phones start failing on the first try.
 */
const LOGO_RATIO = 0.24

const SIZES = ["512", "1024", "2048"] as const

/**
 * Swatches are the brand tokens, resolved from globals.css at runtime rather than
 * copied as hex — the palette stays in one place.
 */
const PRESETS = [
  { label: "Fruition purple", token: "--purple-primary" },
  { label: "Purple dark", token: "--purple-dark" },
  { label: "Ink", token: "--foreground" },
] as const

/**
 * Normalise any CSS colour (token values are `oklch()` inside the portal theme) to
 * the `#rrggbb` that `<input type="color">` and canvas fills both understand.
 */
function toHex(value: string): string {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return "#000000"
  ctx.fillStyle = "#000000"
  ctx.fillStyle = value
  const resolved = ctx.fillStyle
  if (typeof resolved === "string" && resolved.startsWith("#")) return resolved
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
}

function readToken(token: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  return raw ? toHex(raw) : "#000000"
}

/** A filename a human can find again: `qr-fruition-com-au.png`. */
function fileNameFor(url: string): string {
  let stem = "code"
  try {
    stem = new URL(url).hostname.replace(/^www\./, "")
  } catch {
    stem = url
  }
  const slug = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  return `qr-${slug || "code"}.png`
}

/** Adds a scheme when the user pastes a bare domain, so the code resolves when scanned. */
function normaliseUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export default function QrCodeGenerator() {
  const [url, setUrl] = React.useState("")
  const [fg, setFg] = React.useState("#000000")
  const [bg, setBg] = React.useState("#ffffff")
  const [size, setSize] = React.useState<(typeof SIZES)[number]>("1024")
  const [withLogo, setWithLogo] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [ready, setReady] = React.useState(false)
  const [swatches, setSwatches] = React.useState<{ label: string; hex: string }[]>([])

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const markRef = React.useRef<HTMLImageElement | null>(null)
  const markTextRef = React.useRef<string | null>(null)

  // Resolve the brand swatches once the theme's custom properties exist.
  React.useEffect(() => {
    setSwatches(PRESETS.map((p) => ({ label: p.label, hex: readToken(p.token) })))
    setFg(readToken("--purple-primary"))
  }, [])

  const target = normaliseUrl(url)

  /**
   * Loads the mark recoloured to `colour`. The file ships with `fill="currentColor"`,
   * which an <img> would resolve to plain black, so the fill is substituted in the
   * source text and handed to the image as a data URL.
   */
  const loadMark = React.useCallback(async (colour: string): Promise<HTMLImageElement | null> => {
    try {
      if (markTextRef.current === null) {
        const res = await fetch(MARK_SRC)
        if (!res.ok) return null
        markTextRef.current = await res.text()
      }
      const svg = markTextRef.current.replaceAll("currentColor", colour)
      const img = new Image()
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
      await img.decode()
      markRef.current = img
      return img
    } catch {
      return null
    }
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!target) {
      setReady(false)
      setError(null)
      const ctx = canvas.getContext("2d")
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    let cancelled = false

    async function draw() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Level H so the logo can sit on top without destroying the payload.
      const qr = qrcode(0, "H")
      try {
        qr.addData(target)
        qr.make()
      } catch {
        setReady(false)
        setError("That link is too long to encode. Shorten it — /s/<code> links work well here.")
        return
      }
      setError(null)

      const count = qr.getModuleCount()
      const px = Number(size)
      const scale = px / (count + MARGIN_MODULES * 2)
      const offset = scale * MARGIN_MODULES

      canvas.width = px
      canvas.height = px
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, px, px)
      ctx.fillStyle = fg
      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          if (!qr.isDark(row, col)) continue
          // Ceil the extent so neighbouring modules meet with no hairline seam.
          const x = Math.round(offset + col * scale)
          const y = Math.round(offset + row * scale)
          ctx.fillRect(x, y, Math.ceil(scale), Math.ceil(scale))
        }
      }

      if (withLogo) {
        const mark = await loadMark(fg)
        if (cancelled) return
        if (mark) {
          const plate = px * LOGO_RATIO
          const pad = plate * 0.16
          const box = plate + pad * 2
          const left = (px - box) / 2
          const radius = box * 0.22

          // A plate in the background colour keeps the mark legible over dark modules.
          ctx.fillStyle = bg
          ctx.beginPath()
          ctx.roundRect(left, left, box, box, radius)
          ctx.fill()

          const ratio = mark.naturalWidth / mark.naturalHeight || 1
          const w = ratio >= 1 ? plate : plate * ratio
          const h = ratio >= 1 ? plate / ratio : plate
          ctx.drawImage(mark, (px - w) / 2, (px - h) / 2, w, h)
        }
      }
      if (!cancelled) setReady(true)
    }

    void draw()
    return () => {
      cancelled = true
    }
  }, [target, fg, bg, size, withLogo, loadMark])

  function download() {
    const canvas = canvasRef.current
    if (!canvas || !ready) return
    const link = document.createElement("a")
    link.download = fileNameFor(target)
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Link</CardTitle>
          <CardDescription>
            Paste the destination, pick the colours, download the PNG. Nothing is stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="qr-url">Destination URL</Label>
            <Input
              id="qr-url"
              value={url}
              inputMode="url"
              autoComplete="off"
              placeholder="fruition.com.au/contact"
              onChange={(e) => setUrl(e.target.value)}
            />
            {target && !error ? (
              <p className="text-xs text-muted-foreground">Encodes {target}</p>
            ) : null}
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-fg">Code colour</Label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-fg"
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="size-8 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
                />
                <Input
                  value={fg}
                  aria-label="Code colour hex"
                  onChange={(e) => setFg(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {swatches.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    title={s.label}
                    aria-label={s.label}
                    onClick={() => setFg(s.hex)}
                    className="size-6 rounded-full border border-input transition-transform hover:scale-110"
                    style={{ background: s.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-bg">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-bg"
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="size-8 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
                />
                <Input
                  value={bg}
                  aria-label="Background hex"
                  onChange={(e) => setBg(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Keep a strong contrast against the code colour, or scanners give up.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-size">PNG size</Label>
              <Select
                value={size}
                onValueChange={(v) => setSize(v as (typeof SIZES)[number])}
              >
                <SelectTrigger id="qr-size" className="w-full" aria-label="PNG size">
                  <SelectValue>{`${size} × ${size} px`}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => (
                    <SelectItem key={s} value={s}>{`${s} × ${s} px`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-logo">Centre logo</Label>
              <label
                htmlFor="qr-logo"
                className="flex h-8 cursor-pointer items-center gap-2 text-sm text-muted-foreground"
              >
                <input
                  id="qr-logo"
                  type="checkbox"
                  checked={withLogo}
                  onChange={(e) => setWithLogo(e.target.checked)}
                  className="size-4 accent-[var(--purple-primary)]"
                />
                Show the Fruition mark
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Scan it before you print it.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)]">
            {/* One canvas, never remounted — swapping elements would drop the bitmap. */}
            <canvas ref={canvasRef} className={ready ? "h-full w-full" : "hidden"} />
            {ready ? null : (
              <div className="flex flex-col items-center gap-2 p-6 text-center">
                <QrCode className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Your code appears here once you enter a link.
                </p>
              </div>
            )}
          </div>
          <Button onClick={download} disabled={!ready} className="w-full">
            <Download className="size-4" />
            Download PNG
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
