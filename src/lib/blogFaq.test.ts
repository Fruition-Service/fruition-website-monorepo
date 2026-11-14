import { describe, expect, it } from "vitest"
import { extractBlogFaq } from "./blogFaq"

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
const b = (style: string, t: string, extra: Record<string, unknown> = {}) => ({ _type: "block", style, children: [{ _type: "span", text: t }], ...extra })

describe("extractBlogFaq", () => {
  it("moves an FAQs H2 with H3 questions out of the body, up to the next H2", () => {
    const body = [
      b("normal", "Intro"),
      b("h2", "FAQs"),
      b("h3", "Can it sync?"),
      b("normal", "Yes."),
      b("normal", "Both ways."),
      b("h3", "Is it costly?"),
      b("normal", "It depends.", { listItem: "bullet" }),
      b("h2", "Wrapping Up"),
      b("normal", "Bye"),
    ]
    const { body: rest, faq } = extractBlogFaq(body, slug)
    expect(rest.map((x) => x.children[0].text)).toEqual(["Intro", "Wrapping Up", "Bye"])
    expect(faq?.heading).toBe("FAQs")
    expect(faq?.id).toBe("faqs")
    expect(faq?.items.map((i) => i.question)).toEqual(["Can it sync?", "Is it costly?"])
    expect(faq?.items[0].answer).toHaveLength(2)
  })

  it("runs to the end of the body when no H2 follows", () => {
    const { body: rest, faq } = extractBlogFaq([b("normal", "A"), b("h2", "Frequently Asked Questions"), b("h3", "Q?"), b("normal", "A.")], slug)
    expect(rest).toHaveLength(1)
    expect(faq?.items).toHaveLength(1)
  })

  it("leaves the body alone when the FAQ has another shape", () => {
    const intro = [b("h2", "FAQs"), b("normal", "Some intro"), b("h3", "Q?"), b("normal", "A.")]
    expect(extractBlogFaq(intro, slug).faq).toBeNull()
    const image = [b("h2", "FAQs"), b("h3", "Q?"), { _type: "image" }, b("normal", "A.")]
    expect(extractBlogFaq(image, slug).faq).toBeNull()
    const h4 = [b("h2", "FAQs"), b("h3", "Q?"), b("h4", "Sub"), b("normal", "A.")]
    expect(extractBlogFaq(h4, slug).faq).toBeNull()
    const empty = [b("h2", "FAQs"), b("h3", "Q?"), b("h3", "Q2?"), b("normal", "A.")]
    expect(extractBlogFaq(empty, slug).faq).toBeNull()
    expect(extractBlogFaq(empty, slug).body).toBe(empty)
  })

  it("ignores posts without an FAQ heading", () => {
    const body = [b("h2", "Why it matters"), b("h3", "Q?"), b("normal", "A.")]
    expect(extractBlogFaq(body, slug)).toEqual({ body, faq: null })
    expect(extractBlogFaq(undefined, slug)).toEqual({ body: [], faq: null })
  })
})
