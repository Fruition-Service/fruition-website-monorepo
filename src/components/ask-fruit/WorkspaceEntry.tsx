"use client"

import dynamic from "next/dynamic"
import { useSyncExternalStore } from "react"

/**
 * Client-only entry for /ask-fruit/workspace. The workspace is a browser app
 * with nothing to prerender, and keeping it out of the server bundle matters:
 * the Worker is close to Cloudflare's 10 MiB script limit.
 *
 * `?brief=<evaluationId>:<docId>` opens a brief on its own, laid out for
 * printing, instead of the workspace.
 */
const AskFruitWorkspace = dynamic(() => import("./AskFruitWorkspace"), { ssr: false, loading: () => <Loading /> })
const PrintableBrief = dynamic(() => import("./PrintableBrief"), { ssr: false, loading: () => <Loading /> })

function Loading() {
  return <div className="fixed inset-0 flex items-center justify-center bg-surface font-mono text-[12px] text-muted">Loading…</div>
}

const subscribe = () => () => {}
const readBrief = () => new URLSearchParams(window.location.search).get("brief")

export default function WorkspaceEntry() {
  const brief = useSyncExternalStore(subscribe, readBrief, () => null)
  const [evaluationId, docId] = brief?.split(":") ?? []
  if (evaluationId && docId) return <PrintableBrief evaluationId={evaluationId} docId={docId} />
  return <AskFruitWorkspace />
}
