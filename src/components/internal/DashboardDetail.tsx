"use client"

import type * as React from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { PostPerformance } from "@/lib/googleAnalytics"
import BlogPerformanceTable from "./BlogPerformanceTable"

export interface AeoSummary {
  citationRate: number
  totalRuns: number
  totalCitations: number
  competitors: { name: string; mentions: number }[]
}

/** Bar length as a custom property — Tailwind reads it back via w-[var(--bar)]. */
function barWidth(percent: number): React.CSSProperties {
  const clamped = Math.max(0, Math.min(percent, 100))
  return { "--bar": `${clamped.toFixed(1)}%` } as React.CSSProperties
}

export interface CountryRow {
  country: string
  users: number
}

/**
 * The dashboard's third band: one panel per question, rather than three stacked
 * cards that each answer a different one. Everything here is a summary — the
 * full working detail lives on the page each tab links to.
 */
export default function DashboardDetail({
  posts,
  titles,
  ctaTrackingIdle,
  aeo,
  countries,
}: {
  posts: PostPerformance[]
  titles: Map<string, string>
  ctaTrackingIdle: boolean
  aeo: AeoSummary | null
  countries: CountryRow[]
}) {
  const topCountry = countries[0]?.users ?? 1

  return (
    <Tabs defaultValue="posts">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="posts">Top posts</TabsTrigger>
          {aeo ? <TabsTrigger value="aeo">AI answer visibility</TabsTrigger> : null}
          {countries.length > 0 ? <TabsTrigger value="geo">Where readers are</TabsTrigger> : null}
        </TabsList>
      </div>

      <TabsContent value="posts">
        <Card>
          <CardContent>
            <BlogPerformanceTable
              posts={posts}
              titles={titles}
              limit={5}
              ctaTrackingIdle={ctaTrackingIdle}
            />
            <p className="mt-4 text-xs text-muted-foreground">
              Views and search clicks over the last 28 days.{" "}
              <Link href="/internal/blog" className="font-medium text-[var(--purple-primary)]">
                Every post and its numbers →
              </Link>
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {aeo ? (
        <TabsContent value="aeo">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <div className="flex w-full shrink-0 flex-col gap-2 md:w-56">
                  <p className="font-mono text-4xl font-semibold leading-none tracking-tight text-ink-heading tabular-nums">
                    {aeo.citationRate.toFixed(1)}
                    <span className="text-xl">%</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {aeo.totalRuns.toLocaleString()} sampled AI answers cited Fruition over the
                    last 90 days — {aeo.totalCitations} of them.
                  </p>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full w-[var(--bar)] rounded-full bg-[var(--purple-primary)]"
                      style={barWidth(aeo.citationRate)}
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-muted-foreground">
                    Named in the same answers
                  </p>
                  {aeo.competitors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No competitor was named in the sampled answers.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {aeo.competitors.map((c) => (
                        <li key={c.name} className="flex items-baseline gap-3 text-sm">
                          <span className="w-40 shrink-0 truncate text-ink-heading">{c.name}</span>
                          <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {c.mentions} answer{c.mentions === 1 ? "" : "s"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/internal/insights"
                    className="text-sm font-medium text-[var(--purple-primary)]"
                  >
                    Every prompt, model by model →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ) : null}

      {countries.length > 0 ? (
        <TabsContent value="geo">
          <Card>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {countries.map((c) => (
                  <li key={c.country} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-sm text-ink-heading">
                      {c.country}
                    </span>
                    <span className="h-2 flex-1 rounded-full bg-muted">
                      <span
                        className="block h-full w-[var(--bar)] rounded-full bg-[var(--purple-primary)]"
                        style={barWidth((c.users / topCountry) * 100)}
                      />
                    </span>
                    <span className="w-20 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
                      {c.users.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Visitors by country, GA4, last 28 days.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      ) : null}
    </Tabs>
  )
}
