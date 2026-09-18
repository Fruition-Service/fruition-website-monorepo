"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ExternalLink, Pencil, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, SortHeader, type DataTableFacet } from "@/components/internal/DataTable"
import { REGION_OPTIONS } from "@/lib/teamMemberOptions"

export interface TeamRow {
  _id: string
  name: string
  role: string | null
  regions: string[]
  certifications: string[]
  linkedinUrl: string | null
  order: number | null
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/**
 * Cards by default, table on request. A card carries the four things you scan
 * for — who, what they do, where they show up, and where they sit in the order.
 * The table keeps what cards cannot: sortable columns and certifications.
 */
export default function TeamTable({ rows }: { rows: TeamRow[] }) {
  const router = useRouter()
  const [view, setView] = React.useState<"cards" | "table">("cards")
  const [search, setSearch] = React.useState("")
  const [region, setRegion] = React.useState<string | null>(null)

  const visible = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows
      .filter((r) => (region ? r.regions.includes(region) : true))
      .filter((r) =>
        q ? `${r.name} ${r.role ?? ""}`.toLowerCase().includes(q) : true
      )
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
  }, [rows, search, region])

  const columns = React.useMemo<ColumnDef<TeamRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortHeader label="Name" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(128,21,232,0.10)] text-sm font-semibold text-[var(--purple-primary)]">
              {row.original.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="font-medium text-ink-heading">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => <SortHeader label="Role" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.role || "—"}</span>
        ),
      },
      {
        accessorKey: "regions",
        header: "Regions",
        enableSorting: false,
        filterFn: "arrIncludes",
        cell: ({ row }) =>
          row.original.regions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.regions.map((r) => (
                <Badge key={r} variant="outline">
                  {r}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "certifications",
        header: "Certifications",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.certifications.length > 0
              ? `${row.original.certifications.length} badge${row.original.certifications.length === 1 ? "" : "s"}`
              : "—"}
          </span>
        ),
      },
      {
        // undefined (not null) so sortUndefined places members without an order last
        accessorFn: (row) => row.order ?? undefined,
        id: "order",
        header: ({ column }) => <SortHeader label="Order" column={column} />,
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.order ?? "—"}</span>
        ),
        sortUndefined: "last",
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {row.original.linkedinUrl && (
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="LinkedIn"
                render={
                  <a href={row.original.linkedinUrl} target="_blank" rel="noopener noreferrer" />
                }
              >
                <ExternalLink className="size-4" />
              </Button>
            )}
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Edit"
              render={<Link href={`/internal/team/${encodeURIComponent(row.original._id)}`} />}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const facets: DataTableFacet[] = [
    {
      columnId: "regions",
      title: "Region",
      options: REGION_OPTIONS.map((r) => ({ label: r.label, value: r.value })),
    },
  ]

  if (view === "cards") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people"
            className="h-9 w-56 rounded-md border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setRegion(null)}
            aria-pressed={region === null}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              region === null
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
          >
            Everyone
          </button>
          {REGION_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRegion(region === r.value ? null : r.value)}
              aria-pressed={region === r.value}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                region === r.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-primary/40"
              }`}
            >
              {r.label}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            {region ? `${visible.length} of ${rows.length} in ${region}` : `${rows.length} people`}
            <button
              type="button"
              onClick={() => setView("table")}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Table view
            </button>
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm font-medium text-foreground">Nobody matches that</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Clear the search or pick another region.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((m) => (
              <Link
                key={m._id}
                href={`/internal/team/${encodeURIComponent(m._id)}`}
                className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--purple-primary)]/10 text-xs font-semibold text-[var(--purple-primary)]">
                  {initials(m.name)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-semibold text-ink-heading">{m.name}</span>
                  <span className="text-xs leading-snug text-muted-foreground">{m.role ?? "—"}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {m.regions.length > 0
                      ? m.regions.join(" · ")
                      : "No region — hidden from every regional page"}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60">
                  {m.order ?? "—"}
                </span>
              </Link>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Order decides where someone appears on the public team page. Opening a member lets you
          edit their role, regions, certifications and LinkedIn, or remove them from the site.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setView("cards")}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Card view
        </button>
      </div>
      <DataTable
      columns={columns}
      data={rows}
      searchColumn="name"
      searchPlaceholder="Search members…"
      facets={facets}
      initialSorting={[{ id: "order", desc: false }]}
      onRowClick={(row) => router.push(`/internal/team/${encodeURIComponent(row._id)}`)}
      emptyTitle="No team members yet"
      emptyDescription="Add people to show them on the public team pages."
      emptyIcon={<Users />}
    />
    </>
  )
}
