// @ts-expect-error next ships this compiled module without type declarations
import { pathToRegexp } from "next/dist/compiled/path-to-regexp"
import { describe, expect, it } from "vitest"
import nextConfig from "../../next.config"

/** monday 2904193295: the malformed /monday-partner-ukhttps:/... URL redirects home. */
describe("malformed /monday-partner-uk link redirect", () => {
  it("sends the glued absolute URL, raw or percent-encoded, to /monday-partner-uk", async () => {
    const redirects = await nextConfig.redirects!()
    const hit = (path: string) =>
      redirects.find((r) => pathToRegexp(r.source, [], { strict: false, sensitive: false }).test(path))
    for (const path of [
      "/monday-partner-ukhttps:/www.fruitionservices.io/monday-partner-uk",
      "/monday-partner-ukhttps://www.fruitionservices.io/monday-partner-uk",
      "/monday-partner-ukhttps%3A/www.fruitionservices.io/monday-partner-uk",
    ]) {
      const r = hit(path)
      expect(r, path).toBeDefined()
      expect(r!.destination).toBe("/monday-partner-uk")
      expect("permanent" in r! && r!.permanent).toBe(true)
    }
    expect(hit("/monday-partner-uk")).toBeUndefined()
  })
})
