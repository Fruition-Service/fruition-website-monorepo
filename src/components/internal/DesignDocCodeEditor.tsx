"use client"

import { Button } from "@/components/ui/button"

import * as React from "react"

interface Props {
  value: string
  onChange: (next: string) => void
  /** Save the current value. Called by the Cmd/Ctrl+S shortcut too. */
  onSave: () => void
  dirty: boolean
  saving: boolean
}

const TAB = "  "

/**
 * Plain-text HTML editor for a design document.
 *
 * Deliberately a textarea rather than a code-editor dependency: the portal has
 * no editor bundle and this only needs to be a faithful, fast view of the
 * stored HTML. Wrapping is off so one logical line is one visual line, which
 * is what keeps the line-number gutter in sync with a single scrollTop copy.
 */
export default function DesignDocCodeEditor({ value, onChange, onSave, dirty, saving }: Props) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const gutterRef = React.useRef<HTMLDivElement>(null)

  const lineCount = React.useMemo(() => value.split("\n").length, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault()
      onSave()
      return
    }
    if (e.key === "Tab") {
      e.preventDefault()
      const el = e.currentTarget
      const { selectionStart, selectionEnd } = el
      const next = value.slice(0, selectionStart) + TAB + value.slice(selectionEnd)
      onChange(next)
      // Restore the caret after React re-renders with the new value.
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + TAB.length
      })
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-card)-8px)] border border-[var(--color-border)] bg-[#0f1117]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wide text-white/50">
          document.html
        </span>
        <div className="flex items-center gap-2">
          {dirty && <span className="text-[11px] text-amber-300">Unsaved changes</span>}
          <Button variant="brand" size="xs" onClick={onSave} disabled={!dirty || saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          aria-hidden
          className="select-none overflow-hidden py-3 pl-3 pr-2 text-right font-mono text-xs leading-5 text-white/25"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={(e) => {
            if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop
          }}
          wrap="off"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Document HTML"
          className="min-h-0 flex-1 resize-none bg-transparent py-3 pr-3 font-mono text-xs leading-5 text-white/90 outline-none"
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/40">
        <span>
          {lineCount.toLocaleString()} lines · {value.length.toLocaleString()} characters
        </span>
        <span>⌘S / Ctrl+S to save</span>
      </div>
    </div>
  )
}
