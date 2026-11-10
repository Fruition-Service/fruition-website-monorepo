import { beforeEach, describe, expect, it, vi } from "vitest"

const REDIRECTED = [
  "hire-mondaycom-partner-questions",
  "monday-com-implementation",
  "hire-monday-com-experts",
  "monday-com-implementation-certified-experts",
  "monday-com-consultant-implementation-framework",
  "monday-com-vs-clickup-1",
  "monday-crm-consultants",
  "monday-com-consultants-help",
  "monday-com-partner-fruition-services",
]
const NORMAL = "monday-com-vs-clickup"

vi.mock("@/sanity/queries", () => ({
  getBlogPosts: vi.fn(async () =>
    [...REDIRECTED, NORMAL].map((slug) => ({ slug, publishedAt: "2026-01-01T00:00:00Z" })),
  ),
  getBlogAuthors: vi.fn(async () => []),
  getAllSolutionPages: vi.fn(async () => []),
  getAllPartnershipPages: vi.fn(async () => []),
}))

describe("sitemap /post entries", () => {
  beforeEach(() => vi.resetModules())

  it("omits posts whose URL redirects and keeps the rest", async () => {
    const { default: sitemap } = await import("./sitemap")
    const paths = (await sitemap()).map((e) => new URL(e.url).pathname)
    for (const slug of REDIRECTED) expect(paths).not.toContain(`/post/${slug}`)
    expect(paths).toContain(`/post/${NORMAL}`)
  })
})
