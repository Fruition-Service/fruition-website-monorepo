"use client"

import { useEffect } from "react"
import { INTERNAL_VISITOR_KEY } from "@/lib/internalVisitor"

/**
 * Marks this browser as staff once a signed-in portal page renders. The public
 * site's PostHog loader reads the flag and registers `internal: true`, which
 * the project's test-account filter excludes, so our own QA no longer shows up
 * as slow or confused visitors in PostHog's insights.
 */
export default function MarkInternalVisitor() {
  useEffect(() => {
    try {
      window.localStorage.setItem(INTERNAL_VISITOR_KEY, "1")
    } catch {
      // Storage blocked: nothing to mark.
    }
  }, [])
  return null
}
