import { describe, expect, it } from "vitest"
import nextConfig from "../../next.config"
import { REDIRECTED_POST_SLUGS } from "@/lib/redirectedPostSlugs"

/** Exact /post/<slug> sources in the redirect list Next actually serves. */
async function redirectedPostSlugs(): Promise<Set<string>> {
  const redirects = await nextConfig.redirects!()
  return new Set(
    redirects
      .map((r) => r.source)
      .filter((s) => s.startsWith("/post/") && !/[:*(]/.test(s.slice("/post/".length)))
      .map((s) => s.slice("/post/".length)),
  )
}

describe("REDIRECTED_POST_SLUGS", () => {
  it("covers every /post URL that redirects", async () => {
    const missing = [...(await redirectedPostSlugs())].filter((s) => !REDIRECTED_POST_SLUGS.has(s))
    expect(missing, "add these to src/lib/redirectedPostSlugs.ts").toEqual([])
  })

  it("lists only slugs that really redirect", async () => {
    const live = await redirectedPostSlugs()
    const stale = [...REDIRECTED_POST_SLUGS].filter((s) => !live.has(s))
    expect(stale, "remove these from src/lib/redirectedPostSlugs.ts").toEqual([])
  })
})
