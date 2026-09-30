"use client"

import { useRouter } from "next/navigation"
import { Composer, STARTERS } from "./Composer"

/** The /ask-fruit hero box: hands the question to the workspace as ?q=. */
export default function HeroPrompt() {
  const router = useRouter()
  const go = (text: string) => router.push(`/ask-fruit/workspace?q=${encodeURIComponent(text)}`)
  return (
    <div className="w-full">
      <Composer onSend={go} sending={false} large />
      <div className="mt-4 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => go(s.text)}
            className="rounded-pill border border-ui bg-surface px-3.5 py-1.5 text-[13px] font-medium text-body transition-colors hover:border-brand hover:text-brand"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
