"use client"

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowUp, Square } from "lucide-react"
import { MAX_MESSAGE_CHARS } from "@/lib/askFruit/types"

export const STARTERS = [
  { label: "Move our CRM", text: "We run sales on Salesforce and want to move to monday CRM. What would that involve?" },
  { label: "Get projects under control", text: "Our project delivery lives in spreadsheets and email. We are a 40-person team. Where should we start?" },
  { label: "Put AI to work", text: "We want to use AI in customer support without hurting satisfaction. What would you recommend?" },
  { label: "Connect our tools", text: "We use monday.com and HubSpot and they do not talk to each other. How would you connect them?" },
]

export function Composer({
  onSend,
  onStop,
  sending,
  prefill,
  autoFocus,
  large,
}: {
  onSend: (text: string) => void
  onStop?: () => void
  sending: boolean
  prefill?: { text: string; nonce: number } | null
  autoFocus?: boolean
  large?: boolean
}) {
  const [value, setValue] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null)

  // A gap chip puts a sentence starter in the box without sending it. Adopted
  // during render (keyed on the nonce) rather than in an effect.
  const [seenNonce, setSeenNonce] = useState<number | null>(null)
  if (prefill && prefill.nonce !== seenNonce) {
    setSeenNonce(prefill.nonce)
    setValue(prefill.text)
  }

  useEffect(() => {
    if (!prefill) return
    const el = ref.current
    if (el) {
      el.focus()
      el.setSelectionRange(prefill.text.length, prefill.text.length)
    }
  }, [prefill])

  // Grow with the text, up to a cap, then scroll inside.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, large ? 240 : 200)}px`
  }, [value, large])

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const text = value.trim()
    if (!text || sending) return
    onSend(text)
    setValue("")
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e)
  }

  return (
    <form
      onSubmit={submit}
      className={`flex items-end gap-2 rounded-card border border-ui bg-surface shadow-card transition-colors focus-within:border-brand ${
        large ? "p-3 pl-5" : "p-2 pl-4"
      }`}
    >
      <label htmlFor="af-composer" className="sr-only">
        Message Fruit
      </label>
      <textarea
        id="af-composer"
        ref={ref}
        rows={1}
        value={value}
        maxLength={MAX_MESSAGE_CHARS}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={large ? "Describe what you are trying to fix or build…" : "Reply to Fruit…"}
        className={`min-h-11 flex-1 resize-none bg-transparent py-2.5 text-body outline-none placeholder:text-faint ${large ? "text-[16px]" : "text-[15px]"}`}
      />
      {sending && onStop ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-ui text-body transition-colors hover:border-brand hover:text-brand"
        >
          <Square size={14} fill="currentColor" aria-hidden />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Send"
          disabled={!value.trim() || sending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-brand text-white transition-colors hover:bg-brand-dark disabled:bg-lilac-strong"
        >
          <ArrowUp size={18} aria-hidden />
        </button>
      )}
    </form>
  )
}
