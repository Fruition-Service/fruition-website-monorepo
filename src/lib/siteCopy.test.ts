import { describe, expect, it } from "vitest"
import { SITE_COPY, siteText, toSiteCopy } from "./siteCopy"
import { stegaFilter } from "@/sanity/editMode"

describe("siteCopy", () => {
  it("falls back to the default when a slot is missing or blank", () => {
    expect(siteText(undefined, "award-text")).toBe(SITE_COPY["award-text"].text)
    expect(siteText({ "award-text": "  " }, "award-text")).toBe(SITE_COPY["award-text"].text)
    expect(siteText({ "award-text": "New" }, "award-text")).toBe("New")
  })
  it("maps Sanity slots by key", () => {
    expect(toSiteCopy([{ _key: "audit-cta", text: "Go" }, { text: "orphan" }])).toEqual({ "audit-cta": "Go" })
  })
  it("uses ids that are valid Sanity keys", () => {
    for (const id of Object.keys(SITE_COPY)) expect(id).toMatch(/^[\w-]+$/)
  })
})

describe("stegaFilter", () => {
  const run = (value: string, sourcePath: (string | { _key: string })[]) =>
    stegaFilter({ value, sourcePath, filterDefault: () => true } as unknown as Parameters<typeof stegaFilter>[0])
  it("marks lowercase single words in text fields", () => {
    expect(run("monday.com", ["navigation", { _key: "a" }, "label"])).toBe(true)
    expect(run("n8n", ["copy", { _key: "hero-node-n8n" }, "text"])).toBe(true)
  })
  it("still skips enums and machine keys", () => {
    expect(run("columns", ["navigation", { _key: "a" }, "layout"])).toBe(false)
    expect(run("dark", ["hero", "variant"])).toBe(false)
    expect(run("Fruition logo", ["logo", "alt"])).toBe(false)
  })
})
