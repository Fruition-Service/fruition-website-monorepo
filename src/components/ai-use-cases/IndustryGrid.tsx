import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { IndustryMeta } from "@/features/ai-use-cases/types"
import { industryHref } from "@/features/ai-use-cases/types"

/** "Browse by industry": one card per catalogue industry page. */
export default function IndustryGrid({ industries }: { industries: IndustryMeta[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {industries.map((i) => (
        <li key={i.slug}>
          <Link
            href={industryHref(i.slug)}
            className="group flex h-full min-h-11 items-center justify-between gap-4 rounded-card bg-surface-raised px-5 py-4 ring-1 ring-ui transition-[box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:shadow-card hover:ring-brand-light focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-6 md:py-5"
          >
            <span>
              <span className="block text-[17px] leading-snug font-semibold text-body">{i.name}</span>
              <span className="mt-1 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                {i.count} use cases · {i.aiCount} with AI
              </span>
            </span>
            <ArrowRight
              size={18}
              aria-hidden
              className="shrink-0 text-brand transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
