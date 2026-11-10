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
 * free. A click on the scrim closes it, focus goes back to the
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
        className="group relative block w-full cursor-zoom-in p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand"
      >
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-pill border border-ui bg-surface text-body opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <ZoomIn size={16} />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-label={alt ? `Enlarged image: ${alt}` : "Enlarged image"}
        onClose={() => {
          setOpen(false)
          triggerRef.current?.focus()
        }}
        onClick={(e) => {
          // Scrim click closes. Clicks inside the panel bubble up with a different target.
          if (e.target === e.currentTarget) close()
        }}
        className="img-lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-surface-dark/70"
      >
        {open && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
            className="flex h-full w-full items-center justify-center p-4 md:p-6 lg:p-12"
          >
            <div className="flex max-h-full w-full max-w-[1200px] flex-col gap-4 overflow-y-auto rounded-tile bg-surface p-4 shadow-card md:p-5 lg:p-6">
              <div className="flex items-center justify-end gap-4">
                <span className="hidden font-mono text-[12px] leading-[16px] text-muted lg:inline">Esc to close</span>
                <button
                  type="button"
                  onClick={close}
                  autoFocus
                  className="cta-btn cta-btn-outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Close
                  <X size={16} aria-hidden />
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN already serves a sized, format-negotiated rendition; next/image would re-proxy it. */}
              <img
                src={largeSrc}
                alt={alt}
                width={width}
                height={height}
                decoding="async"
                className="mx-auto h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full object-contain"
              />
              {(caption || alt) && (
                <p className="text-center text-[14px] leading-[21px] text-muted text-pretty">{caption || alt}</p>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
