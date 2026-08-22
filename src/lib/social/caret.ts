"use client"

import { useCallback, useRef, type RefObject } from "react"

/**
 * Insert text where the writer's cursor is, not at the end.
 *
 * Both pickers open a popover, which takes focus off the textarea and then
 * keeps it — so the browser's own selection is only trustworthy for the FIRST
 * insert. After that React has re-rendered the controlled value and the DOM
 * caret has collapsed to the end, which is how "add three emoji in a row"
 * turns into three emoji stuck on the end of the caption.
 *
 * So the caret is tracked here instead of read from the DOM at insert time:
 * remembered whenever the writer moves it, and advanced by hand after every
 * insert. Focus is never stolen back from an open popover — the picker stays
 * usable, and `restore` hands the cursor over once it closes.
 */
export function useCaretInsert(
  ref: RefObject<HTMLTextAreaElement | null>,
  onInsert: (next: string) => void,
) {
  const caret = useRef<number | null>(null)

  /** Wire to the textarea's select/click/keyup so the caret stays current. */
  const remember = useCallback(() => {
    const el = ref.current
    if (el) caret.current = el.selectionEnd
  }, [ref])

  const insert = useCallback(
    (text: string) => {
      const el = ref.current
      const current = el?.value ?? ""
      const at = Math.min(caret.current ?? current.length, current.length)
      const after = at + text.length
      caret.current = after
      onInsert(current.slice(0, at) + text + current.slice(at))
      requestAnimationFrame(() => {
        // Only if the writer is already back in the box: reaching in while the
        // picker is open would close it on the first click.
        if (el && document.activeElement === el) el.setSelectionRange(after, after)
      })
    },
    [ref, onInsert],
  )

  /** Put the cursor back where the insert left it, after the picker closes. */
  const restore = useCallback(() => {
    const el = ref.current
    if (!el || caret.current === null) return
    const at = Math.min(caret.current, el.value.length)
    el.focus()
    el.setSelectionRange(at, at)
  }, [ref])

  return { remember, insert, restore }
}
