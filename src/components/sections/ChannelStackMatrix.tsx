import SectionIntro from "./SectionIntro"

/** How well a CRM/ERP supports a messaging channel out of the box. */
export type NativeSupport = "native" | "partial" | "none"

export interface ChannelStackRow {
  /** Platform name, e.g. "monday.com" or "HubSpot". */
  platform: string
  support: NativeSupport
  /** What the platform gives you before we touch it. */
  outOfTheBox: string
  /** The route we actually build — named systems, not adjectives. */
  weBuild: string
}

interface Props {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  lead?: string
  rows?: ChannelStackRow[]
  /** Caveat under the ledger — sourcing, dated claims, regional limits. */
  note?: string
}

const SUPPORT_LABEL: Record<NativeSupport, string> = {
  native: "Native",
  partial: "Partial",
  none: "Not native",
}

/**
 * The connection ledger: for each CRM or ERP, what it supports on its own and
 * what we build to close the gap. Drawn as dashed-rule rows rather than cards
 * because the honest answer is usually "nothing out of the box" and a grid of
 * cards makes three empty answers look like three features.
 *
 * Mobile stacks each row into a labelled block; `md:` opens the four columns.
 */
export default function ChannelStackMatrix({
  eyebrow,
  heading,
  headingAccent,
  lead,
  rows = [],
  note,
}: Props) {
  if (rows.length === 0) return null

  return (
    <section className="bg-surface px-4 py-14 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionIntro
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          lead={lead}
          align="left"
        />

        <div className="mt-10">
          {/* Column headers — desktop only; the mobile blocks carry their own labels. */}
          <div className="hidden md:grid md:grid-cols-[1.1fr_0.7fr_1.5fr_1.7fr] gap-6 pb-3 border-b border-ui">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">Platform</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">Support</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">Out of the box</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">What we build</span>
          </div>

          <ul className="flex flex-col">
            {rows.map((row) => (
              <li
                key={row.platform}
                className="border-b border-dashed border-ui py-5 md:grid md:grid-cols-[1.1fr_0.7fr_1.5fr_1.7fr] md:gap-6 md:items-start"
              >
                <p className="text-base font-semibold text-body">{row.platform}</p>

                <p className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center rounded-badge px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      row.support === "native"
                        ? "bg-brand-soft text-brand"
                        : row.support === "partial"
                          ? "bg-surface-subtle text-body ring-1 ring-ui"
                          : "bg-surface-subtle text-muted ring-1 ring-ui"
                    }`}
                  >
                    {SUPPORT_LABEL[row.support]}
                  </span>
                </p>

                <p className="mt-3 md:mt-0 text-body-sm text-muted">
                  <span className="md:hidden font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted block mb-1">
                    Out of the box
                  </span>
                  {row.outOfTheBox}
                </p>

                <p className="mt-3 md:mt-0 text-body-sm text-body">
                  <span className="md:hidden font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand block mb-1">
                    What we build
                  </span>
                  {row.weBuild}
                </p>
              </li>
            ))}
          </ul>

          {note && <p className="mt-6 text-body-sm text-muted max-w-[760px]">{note}</p>}
        </div>
      </div>
    </section>
  )
}
