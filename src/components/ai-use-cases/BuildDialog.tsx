"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"

/**
 * Native modal <dialog> for "See the build". `showModal()` gives focus
 * trapping, Escape-to-close and the inert background for free; a click on
 * the backdrop (the dialog element itself, outside its panel) closes it too.
 * Page scroll is locked by the `html:has(dialog.uc-dialog[open])` rule in
 * globals.css.
 */
interface BuildDialogProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  header: ReactNode
  children: ReactNode
}

export default function BuildDialog({ open, onClose, labelledBy, header, children }: BuildDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="uc-dialog m-auto h-[calc(100dvh-1rem)] max-h-none w-[calc(100%-1rem)] max-w-[1180px] overflow-hidden rounded-card bg-surface-subtle p-0 text-body shadow-card backdrop:bg-surface-dark/60 md:h-auto md:max-h-[calc(100dvh-3rem)] md:w-[calc(100%-3rem)]"
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-ui bg-surface-raised px-5 py-4 md:px-8 md:py-6">
          <div className="min-w-0">{header}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-muted transition-colors hover:bg-mist hover:text-body focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <X size={22} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 md:px-8 md:py-7">{children}</div>
      </div>
    </dialog>
  )
}
