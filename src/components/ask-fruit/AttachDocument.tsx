"use client"

import { useRef, type ChangeEvent } from "react"
import { CircleAlert, FileText, Info, Loader2, Paperclip, X } from "lucide-react"
import { DOCUMENT_ACCEPT, MAX_DOCUMENT_CHARS } from "@/lib/askFruit/documents"
import { documentLabel, type DocumentAttach } from "./useDocumentAttach"

/**
 * Upload controls for the Implementation Calculator's inputs: the paperclip
 * button (with its hidden file input) and the attached-file chip. `vc` renders
 * with the Version C start screen's classes (scripts/vc/extras-ask-fruit-workspace.css),
 * `app` with the conversation composer's Tailwind tokens.
 */
type Variant = "app" | "vc"

export function AttachButton({
  attach,
  disabled,
  variant,
  inputId,
}: {
  attach: DocumentAttach
  disabled?: boolean
  variant: Variant
  inputId: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    void attach.pick(e.target.files?.[0])
    // Let the same file be picked again after it was removed.
    e.target.value = ""
  }
  return (
    <>
      <input
        ref={ref}
        id={inputId}
        type="file"
        accept={DOCUMENT_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={onChange}
      />
      <button
        type="button"
        aria-label="Attach a document"
        title="Attach a document"
        disabled={disabled}
        onClick={() => ref.current?.click()}
        className={
          variant === "vc"
            ? "attach"
            : "flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-muted transition-colors hover:bg-brand/5 hover:text-brand focus-visible:bg-brand/5 focus-visible:text-brand disabled:opacity-50"
        }
      >
        <Paperclip size={variant === "vc" ? 20 : 18} aria-hidden />
      </button>
    </>
  )
}

/** The chip, plus the one-line error or truncation note under it. */
export function AttachStatus({ attach, variant }: { attach: DocumentAttach; variant: Variant }) {
  const { status, fileName, doc, error } = attach
  const vc = variant === "vc"
  if (status === "idle" && !error) return null
  return (
    <div
      className={vc ? "att" : "flex flex-col gap-2 pr-2 pb-2"}
      // Polite: the extraction result is announced without stealing focus.
      aria-live="polite"
    >
      {status !== "idle" ? (
        <div
          className={vc ? "att-chip" : "flex min-h-11 items-center gap-2.5 rounded-chip border border-ui bg-surface-subtle pl-3 text-brand"}
        >
          {status === "reading" ? (
            <Loader2 size={16} className="shrink-0 animate-spin" aria-label="Reading document" role="status" />
          ) : (
            <FileText size={16} className="shrink-0 text-brand" aria-hidden />
          )}
          <span className={vc ? "att-name" : "min-w-0 flex-1 truncate py-2 text-[14px] font-medium text-ink"}>
            {status === "reading" ? `Reading ${fileName}…` : doc?.name}
          </span>
          {status === "ready" && doc ? (
            <span className={vc ? "att-meta" : "shrink-0 font-mono text-[11.5px] text-muted"}>
              {documentLabel(doc)}
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Remove attachment"
            onClick={attach.clear}
            className={
              vc
                ? "att-x"
                : "flex h-11 w-11 shrink-0 items-center justify-center rounded-chip text-muted transition-colors hover:text-brand"
            }
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      ) : null}
      {status === "ready" && doc?.truncated ? (
        <p className={vc ? "att-note" : "flex items-center gap-1.5 px-1 text-[13px] leading-snug text-muted"}>
          <Info size={14} className="shrink-0" aria-hidden />
          Long document: the first {MAX_DOCUMENT_CHARS.toLocaleString("en-US")} characters will be used.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className={vc ? "att-note att-err" : "flex items-center gap-1.5 px-1 text-[13px] leading-snug text-destructive"}>
          <CircleAlert size={14} className="shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  )
}
