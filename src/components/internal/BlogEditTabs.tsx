"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

/**
 * Two-tab shell for the blog edit pages: the blog editor and the social
 * drafts panel. Both panes stay MOUNTED (hidden, not unmounted) so unsaved
 * editor state and loaded social drafts survive tab switches.
 */
export default function BlogEditTabs({ blog, social }: { blog: ReactNode; social: ReactNode }) {
  const [tab, setTab] = useState<"blog" | "social">("blog")

  const tabButton = (key: "blog" | "social", label: string) => (
    <Button
      key={key}
      role="tab"
      aria-selected={tab === key}
      variant={tab === key ? "brand" : "outline"}
      size="lg"
      onClick={() => setTab(key)}
    >
      {label}
    </Button>
  )

  return (
    <div>
      <div role="tablist" aria-label="Blog editor sections" className="mb-4 flex gap-2">
        {tabButton("blog", "Blog post")}
        {tabButton("social", "Social media")}
      </div>
      <div hidden={tab !== "blog"}>{blog}</div>
      <div hidden={tab !== "social"}>{social}</div>
    </div>
  )
}
