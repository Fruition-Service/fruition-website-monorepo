import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { PostPerformance } from "@/lib/googleAnalytics"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const nf = new Intl.NumberFormat()

function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

interface Props {
  posts: PostPerformance[]
  /** Slug → published title, so rows read as titles rather than slugs. */
  titles?: Map<string, string>
  limit?: number
  /** Renders the CTA columns with an explanatory empty state instead of zeros. */
  ctaTrackingIdle?: boolean
}

/**
 * Per-post performance: GA4 traffic, Search Console position and CTA clicks,
 * one row per `/post/<slug>`. Sorted by views upstream in getBlogPerformance().
 */
export default function BlogPerformanceTable({
  posts,
  titles,
  limit,
  ctaTrackingIdle = false,
}: Props) {
  const rows = limit ? posts.slice(0, limit) : posts

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No page data for the selected window yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Post</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Search clicks</TableHead>
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">Avg position</TableHead>
            <TableHead className="text-right">CTA clicks</TableHead>
            <TableHead className="text-right">CTA rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((post) => (
            <TableRow key={post.path}>
              <TableCell className="max-w-[22rem]">
                <Link
                  href={post.path}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-ink-heading hover:underline"
                >
                  <span className="truncate">
                    {titles?.get(post.slug) ?? titleFromSlug(post.slug)}
                  </span>
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
                <p className="truncate text-xs text-muted-foreground">{post.path}</p>
              </TableCell>
              <TableCell className="text-right tabular-nums">{nf.format(post.views)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {post.search ? nf.format(post.search.clicks) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {post.search ? nf.format(post.search.impressions) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {post.search ? post.search.position.toFixed(1) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {ctaTrackingIdle ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  nf.format(post.ctaClicks)
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {ctaTrackingIdle || post.ctaRate == null ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <Badge variant={post.ctaRate >= 2 ? "default" : "secondary"}>
                    {post.ctaRate.toFixed(1)}%
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
