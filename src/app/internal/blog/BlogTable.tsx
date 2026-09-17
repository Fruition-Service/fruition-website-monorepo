"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ExternalLink, Loader2, Newspaper, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { DataTable, SortHeader, type DataTableFacet } from "@/components/internal/DataTable"

/** One row of the merged blog table: a portal draft, a published Sanity post, or both. */
export interface PostRow {
  key: string
  title: string
  excerpt: string | null
  status: "drafted" | "edited" | "published"
  industry: string | null
  googleDocUrl: string | null
  linkedinDocUrl: string | null
  linkedinCopyReady: boolean
  /** ISO timestamp used for sorting; rendered as a local date. */
  updated: string
  /** GA4 views over the reporting window; null when the post has no traffic row. */
  views: number | null
  /** Search Console clicks over the same window. */
  clicks: number | null
  /** Days since the last edit — drives the stale treatment. */
  ageDays: number
  /** True when another row carries the same normalised title. */
  duplicate: boolean
  slug: string | null
  draftId: string | null
  sanityId: string | null
}

/** Matches the dashboard: past this, a draft is a decision rather than work in progress. */
const STALE_DAYS = 30

const STATUS_LABEL: Record<PostRow["status"], string> = {
  drafted: "Draft",
  edited: "Edited",
  published: "Published",
}

function StatusBadge({ status }: { status: PostRow["status"] }) {
  const className =
    status === "published"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "edited"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-yellow-50 text-yellow-700 border-yellow-200"
  return (
    <Badge variant="outline" className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}

function editHref(row: PostRow): string | null {
  if (row.draftId) return `/internal/blog/${row.draftId}/edit`
  if (row.sanityId) return `/internal/blog/post/${encodeURIComponent(row.sanityId)}/edit`
  return null
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

export default function BlogTable({
  rows,
  industries,
}: {
  rows: PostRow[]
  industries: string[]
}) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = React.useState<PostRow | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function confirmDelete() {
    const row = deleteTarget
    if (!row) return
    setDeleting(true)
    setError(null)
    try {
      if (row.sanityId) {
        const r = await fetch(`/api/internal/blog?docId=${encodeURIComponent(row.sanityId)}`, {
          method: "DELETE",
        })
        if (!r.ok) {
          throw new Error(((await r.json()) as { error?: string }).error || "Unpublish failed.")
        }
      }
      if (row.draftId) {
        const r = await fetch(`/api/internal/blog/draft?id=${encodeURIComponent(row.draftId)}`, {
          method: "DELETE",
        })
        if (!r.ok) {
          throw new Error(((await r.json()) as { error?: string }).error || "Draft delete failed.")
        }
      }
      setDeleteTarget(null)
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<PostRow>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        filterFn: "equalsString",
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => <SortHeader label="Title" column={column} />,
        cell: ({ row }) => {
          const href = editHref(row.original)
          return (
            <div className="max-w-xs">
              {href ? (
                <Link href={href} className="font-medium text-ink-heading hover:underline">
                  <span className="line-clamp-1">{row.original.title}</span>
                </Link>
              ) : (
                <span className="line-clamp-1 font-medium text-ink-heading">
                  {row.original.title}
                </span>
              )}
              {row.original.duplicate && (
                <div className="mt-0.5 text-xs text-[var(--warning-strong)]">
                  Another row carries this title
                </div>
              )}
              {!row.original.duplicate && row.original.excerpt && (
                <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {row.original.excerpt}
                </div>
              )}
            </div>
          )
        },
      },
      {
        accessorFn: (row) => row.industry ?? "",
        id: "industry",
        header: "Industry",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.industry || "—"}</span>
        ),
        filterFn: "equalsString",
        enableSorting: false,
      },
      {
        id: "docs",
        header: "Docs",
        enableSorting: false,
        cell: ({ row }) => {
          const { googleDocUrl, linkedinDocUrl, linkedinCopyReady, slug, status } = row.original
          const links: React.ReactNode[] = []
          if (googleDocUrl) {
            links.push(
              <a key="g" href={googleDocUrl} target="_blank" rel="noopener" className="text-primary hover:underline">
                Blog Doc
              </a>,
            )
          }
          if (linkedinDocUrl) {
            links.push(
              <a key="l" href={linkedinDocUrl} target="_blank" rel="noopener" className="text-primary hover:underline">
                LinkedIn Doc
              </a>,
            )
          } else if (linkedinCopyReady) {
            links.push(
              <span key="lc" className="text-green-600">
                Copy ready
              </span>,
            )
          }
          if (status === "published" && slug) {
            links.push(
              <a key="live" href={`/post/${slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-primary hover:underline">
                Live <ExternalLink className="size-3" />
              </a>,
            )
          }
          return links.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs">{links}</div>
          ) : (
            <span className="text-xs text-muted-foreground/50">—</span>
          )
        },
      },
      {
        accessorKey: "views",
        header: ({ column }) => <SortHeader label="Views" column={column} />,
        cell: ({ row }) => (
          <span className="block text-right font-mono text-xs tabular-nums text-ink-heading">
            {row.original.views == null ? "—" : row.original.views.toLocaleString()}
          </span>
        ),
        sortUndefined: "last",
      },
      {
        accessorKey: "clicks",
        header: ({ column }) => <SortHeader label="Clicks" column={column} />,
        cell: ({ row }) => (
          <span className="block text-right font-mono text-xs tabular-nums text-muted-foreground">
            {row.original.clicks == null ? "—" : row.original.clicks.toLocaleString()}
          </span>
        ),
        sortUndefined: "last",
      },
      {
        accessorKey: "updated",
        header: ({ column }) => <SortHeader label="Updated" column={column} />,
        cell: ({ row }) => (
          <span
            className={
              row.original.ageDays > STALE_DAYS && row.original.status !== "published"
                ? "text-xs text-[var(--warning-strong)]"
                : "text-xs text-muted-foreground"
            }
          >
            {fmtDate(row.original.updated)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const href = editHref(row.original)
          return (
            <div className="flex justify-end gap-1">
              {href && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Edit"
                  render={<Link href={href} />}
                >
                  <Pencil className="size-4" />
                </Button>
              )}
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Remove"
                onClick={() => {
                  setError(null)
                  setDeleteTarget(row.original)
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          )
        },
      },
    ],
    [],
  )

  const facets: DataTableFacet[] = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Draft", value: "drafted" },
        { label: "Edited", value: "edited" },
        { label: "Published", value: "published" },
      ],
    },
    {
      columnId: "industry",
      title: "Industry",
      options: industries.map((i) => ({ label: i, value: i })),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        searchColumn="title"
        searchPlaceholder="Search titles…"
        facets={facets}
        initialSorting={[{ id: "updated", desc: true }]}
        emptyTitle="No posts found"
        emptyDescription="No blog posts or drafts match your filters."
        emptyIcon={<Newspaper />}
      />

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{deleteTarget?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.sanityId && deleteTarget?.draftId
                ? "This deletes the draft AND removes the published post from the live site."
                : deleteTarget?.sanityId
                  ? "This removes the published post from the live site."
                  : "This permanently deletes the draft."}{" "}
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault()
                void confirmDelete()
              }}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
