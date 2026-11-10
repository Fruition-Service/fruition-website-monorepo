"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { X, ZoomIn } from "lucide-react"

/**
 * Click-to-enlarge wrapper for article body images.
 *
 * Clarity showed readers clicking body images that did nothing (about 50 dead
 * clicks per long article, Nov 2026). The inline image (passed as children,
 * server-rendered `next/image`) is wrapped in a real button; activating it
 * opens a native modal <dialog> with a larger rendition.
 *
 * `showModal()` gives the focus trap, Escape-to-close and an inert page for
 * free. A click anywhere outside the image closes it, focus goes back to the
 * trigger, and page scroll is locked by the `html:has(dialog.img-lightbox[open])`
 * rule in globals.css. The large image is only requested once the dialog opens.
 */
interface ZoomableImageProps {
  /** The inline image, rendered as-is inside the trigger button. */
  children: ReactNode
  /** Large rendition URL (Sanity `urlFor(...).width(...).auto("format")`). */
  largeSrc: string
  alt: string
  caption?: string
  /** Intrinsic size of the large rendition, when known, to avoid layout jumps. */
  width?: number
  height?: number
}

export default function ZoomableImage({
  children,
  largeSrc,
  alt,
  caption,
  width,
  height,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  const label = alt ? `Enlarge image: ${alt}` : "Enlarge image"

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        className="group relative block w-full cursor-zoom-in p-0 text-left outline-none transition-shadow hover:ring-2 hover:ring-brand/30 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-pill bg-surface-dark/70 text-white opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <ZoomIn size={18} />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt ? `Enlarged image: ${alt}` : "Enlarged image"}
        onClose={() => {
          setOpen(false)
          triggerRef.current?.focus()
        }}
        onClick={(e) => {
          // Close on any click outside the picture itself (backdrop, padding, caption area).
          if (!(e.target instanceof HTMLImageElement)) close()
        }}
        className="img-lightbox m-0 h-dvh max-h-none w-screen max-w-none cursor-zoom-out bg-transparent p-0 backdrop:bg-surface-dark/85"
      >
        {open && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 md:p-8">
            <button
              type="button"
              onClick={close}
              autoFocus
              className="absolute top-3 right-3 inline-flex h-11 items-center justify-center gap-1.5 rounded-pill border border-white/30 bg-surface-dark/70 px-4 text-sm font-semibold text-white transition-colors hover:bg-surface-dark focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:top-5 md:right-5"
            >
              <X size={18} aria-hidden />
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN already serves a sized, format-negotiated rendition; next/image would re-proxy it. */}
            <img
              src={largeSrc}
              alt={alt}
              width={width}
              height={height}
              decoding="async"
              className="h-auto max-h-[calc(100dvh-7rem)] w-auto max-w-full cursor-default rounded-card object-contain"
            />
            {caption && (
              <p className="max-w-[740px] text-center text-[14px] leading-[22px] text-white/85">{caption}</p>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
