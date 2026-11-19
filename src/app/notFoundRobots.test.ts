import { describe, expect, it } from "vitest"
import { resolveRobots } from "next/dist/lib/metadata/resolvers/resolve-basics"
import { metadata } from "./not-found"

/**
 * 404 pages must not carry an index signal (monday 2913602725). Next merges a
 * segment's `robots` over the root layout's as one value, so the not-found
 * page's own robots replaces the layout's "index, follow" and its googlebot
 * tag. Next then adds its own bare `noindex`; the fruition-edge Worker drops
 * that one (workers/edge/index.test.js), leaving a single tag.
 */
describe("not-found robots", () => {
  it("resolves to a single noindex, nofollow tag and no googlebot tag", () => {
    expect(resolveRobots(metadata.robots ?? null)).toEqual({ basic: "noindex, nofollow", googleBot: null })
  })
})
