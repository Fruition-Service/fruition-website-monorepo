import Link from "next/link"
import { Sparkles } from "lucide-react"

/**
 * Announcement strip above the site nav. Rendered in the root layout, so it
 * appears on every marketing page — retire it by removing that one usage.
 */
export default function AwardBanner() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 bg-surface-dark px-6 py-2.75 text-center text-[13.5px] font-medium text-white">
      <Sparkles size={16} strokeWidth={2} className="hidden flex-none text-amber sm:block" aria-hidden />
      <span>Fruition named OpenAI Select Partner</span>
      <Link href="/post/fruition-open-ai-select-partner" className="font-semibold text-brand-light hover:text-white">
        Read the announcement →
      </Link>
    </div>
  )
}
