import Link from "next/link"
import { CalendarClock, FileText, TriangleAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface NeedsYouItem {
  /** Which of the three kinds of attention this is. */
  kind: "schedule" | "backlog" | "broken"
  title: string
  /** Short lines under the title — a timetable, a note, a list of dead feeds. */
  lines: { label: string; detail?: string }[]
  href: string
  action: string
}

const ICONS = {
  schedule: CalendarClock,
  backlog: FileText,
  broken: TriangleAlert,
} as const

/**
 * The band above the numbers: the handful of things that want a person today.
 * Only items with something to say are passed in — an empty band renders
 * nothing rather than three cards congratulating you on an empty queue.
 */
export default function NeedsYou({ items }: { items: NeedsYouItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.09em] text-muted-foreground">
        Needs you
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.kind]
          return (
            <Card
              key={item.title}
              className={item.kind === "broken" ? "ring-[var(--danger-strong)]/25" : undefined}
            >
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon
                    className={
                      item.kind === "broken"
                        ? "size-4 text-[var(--danger-strong)]"
                        : item.kind === "backlog"
                          ? "size-4 text-[var(--warning-strong)]"
                          : "size-4 text-[var(--purple-primary)]"
                    }
                  />
                  <p className="text-sm font-semibold text-ink-heading">{item.title}</p>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {item.lines.map((line) => (
                    <li key={line.label} className="flex items-baseline gap-2 text-xs">
                      <span className="shrink-0 font-medium text-ink-heading">{line.label}</span>
                      {line.detail ? (
                        <span className="truncate text-muted-foreground">{line.detail}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <Link
                  href={item.href}
                  className="text-xs font-medium text-[var(--purple-primary)]"
                >
                  {item.action} →
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
