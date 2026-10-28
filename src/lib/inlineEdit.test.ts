import { describe, expect, it } from "vitest"
import {
  getAtPath,
  isEditablePagePath,
  isSafeDocId,
  parsePath,
  parseStegaHref,
  publishedId,
  safeReturnPath,
} from "./inlineEdit"

describe("parseStegaHref", () => {
  it("reads id, type and path from a Sanity edit intent url", () => {
    const href =
      '/studio/intent/edit/mode=presentation;id=x;type=locationPage;path=faq?baseUrl=%2Fstudio&id=locationPage-uk&type=locationPage&path=faq.items%5B_key%3D%3D%22faq-0%22%5D.answer&perspective=published'
    expect(parseStegaHref(href)).toEqual({
      id: "locationPage-uk",
      type: "locationPage",
      path: 'faq.items[_key=="faq-0"].answer',
    })
  })
  it("rejects urls without the fields", () => {
    expect(parseStegaHref("/studio")).toBeNull()
    expect(parseStegaHref("/studio?id=a")).toBeNull()
  })
})

describe("parsePath", () => {
  it("parses keys, indices and nested fields", () => {
    expect(parsePath('faq.items[_key=="faq-0"].answer')).toEqual(["faq", "items", { _key: "faq-0" }, "answer"])
    expect(parsePath("hero.stats[2].label")).toEqual(["hero", "stats", 2, "label"])
    expect(parsePath('body[_key=="a1"].children[_key=="b2"].text')).toEqual([
      "body", { _key: "a1" }, "children", { _key: "b2" }, "text",
    ])
  })
  it("rejects system fields and junk", () => {
    expect(parsePath("_id")).toBeNull()
    expect(parsePath("_system.base.rev")).toBeNull()
    expect(parsePath('a[_key=="x"; drop]')).toBeNull()
    expect(parsePath("")).toBeNull()
    expect(parsePath("a..b")).toBeNull()
  })
})

describe("getAtPath", () => {
  const doc = { faq: { items: [{ _key: "faq-0", answer: "Yes" }] }, stats: ["a", "b"] }
  it("walks keyed and indexed arrays", () => {
    expect(getAtPath(doc, parsePath('faq.items[_key=="faq-0"].answer')!)).toBe("Yes")
    expect(getAtPath(doc, parsePath("stats[1]")!)).toBe("b")
    expect(getAtPath(doc, parsePath('faq.items[_key=="nope"].answer')!)).toBeUndefined()
  })
})

describe("ids and return paths", () => {
  it("maps drafts to published ids", () => {
    expect(publishedId("drafts.homePage")).toBe("homePage")
    expect(publishedId("versions.r1.homePage")).toBe("homePage")
    expect(publishedId("homePage")).toBe("homePage")
  })
  it("validates doc ids", () => {
    expect(isSafeDocId("locationPage-monday-partner-uk")).toBe(true)
    expect(isSafeDocId("a b")).toBe(false)
    expect(isSafeDocId("")).toBe(false)
  })
  it("only returns same-site paths", () => {
    expect(safeReturnPath("/about-us?x=1")).toBe("/about-us?x=1")
    expect(safeReturnPath("//evil.com")).toBe("/")
    expect(safeReturnPath("https://evil.com")).toBe("/")
    expect(safeReturnPath(null)).toBe("/")
  })
  it("keeps the portal and studio out of edit mode", () => {
    expect(isEditablePagePath("/about-us")).toBe(true)
    expect(isEditablePagePath("/internal/blog")).toBe(false)
    expect(isEditablePagePath("/studio")).toBe(false)
  })
})
