import { describe, expect, it, vi } from "vitest"

// The pages read their SEO fields from Sanity; no test talks to Sanity.
vi.mock("@/sanity/vcQueries", () => ({
  getVcPage: async () => ({ seoTitle: "Title", seoDescription: "Description" }),
  getVcShared: async () => null,
}))
vi.mock("server-only", () => ({}))

const ORIGIN = "https://www.fruitionservices.io"

/** The seven alternates every regional partner page must carry (monday 2909138172). */
const EXPECTED = {
  "en-au": `${ORIGIN}/monday-partner-australia`,
  "en-gb": `${ORIGIN}/monday-partner-uk`,
  "en-us": `${ORIGIN}/monday-partner-us`,
  "en-sg": `${ORIGIN}/monday-partner-singapore`,
  "en-in": `${ORIGIN}/monday-partner-india`,
  "en-ph": `${ORIGIN}/monday-partner-philippines`,
  "x-default": `${ORIGIN}/monday-partner-australia`,
}

const PAGES = {
  "monday-partner-australia": () => import("@/app/monday-partner-australia/page"),
  "monday-partner-uk": () => import("@/app/monday-partner-uk/page"),
  "monday-partner-us": () => import("@/app/monday-partner-us/page"),
  "monday-partner-singapore": () => import("@/app/monday-partner-singapore/page"),
  "monday-partner-india": () => import("@/app/monday-partner-india/page"),
  "monday-partner-philippines": () => import("@/app/monday-partner-philippines/page"),
}

describe("location page hreflang", () => {
  it.each(Object.entries(PAGES))("/%s carries all 7 hreflang alternates and keeps its canonical", async (slug, load) => {
    const { generateMetadata } = await load()
    const meta = await generateMetadata()
    expect(meta.alternates?.languages).toEqual(EXPECTED)
    expect(meta.alternates?.canonical).toBe(`/${slug}`)
    expect(meta.title).toBe("Title")
    expect(meta.openGraph).toBeTruthy()
  })
})
