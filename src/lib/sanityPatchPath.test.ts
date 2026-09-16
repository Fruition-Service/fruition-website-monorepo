import { describe, expect, it } from "vitest"
import { parsePatchPath, patchLanded, unlandedPaths } from "./sanityPatchPath"

const COVER_PATH = "coverImage.asset._ref"
const bodyPath = (key: string) => `body[_key=="${key}"].asset._ref`

const NEW = "image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200x675-jpg"
const OLD = "image-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-147x83-jpg"

describe("parsePatchPath", () => {
  it("recognises the two shapes the repair writes", () => {
    expect(parsePatchPath(COVER_PATH)).toEqual({ kind: "cover" })
    expect(parsePatchPath(bodyPath("mxeqs9rd"))).toEqual({ kind: "body", key: "mxeqs9rd" })
  })

  it("treats anything else as unknown rather than guessing", () => {
    expect(parsePatchPath("body[0].asset._ref").kind).toBe("unknown")
    expect(parsePatchPath("coverImage.asset").kind).toBe("unknown")
    expect(parsePatchPath("").kind).toBe("unknown")
  })

  it("keeps keys that contain regex-ish characters intact", () => {
    expect(parsePatchPath(bodyPath("a-b_c.d"))).toEqual({ kind: "body", key: "a-b_c.d" })
  })
})

describe("patchLanded", () => {
  const doc = {
    coverImage: { asset: { _ref: NEW } },
    body: [
      { _key: "k1", asset: { _ref: NEW } },
      { _key: "k2", asset: { _ref: OLD } },
      { _key: "k3", asset: null },
      null,
    ],
  }

  it("confirms a reference that actually moved", () => {
    expect(patchLanded(doc, COVER_PATH, NEW)).toBe(true)
    expect(patchLanded(doc, bodyPath("k1"), NEW)).toBe(true)
  })

  it("catches the silent no-op: commit succeeded, reference unchanged", () => {
    expect(patchLanded(doc, bodyPath("k2"), NEW)).toBe(false)
  })

  it("is false when the key is not in the body at all", () => {
    // The failure this whole check exists for — a stale _key matches nothing.
    expect(patchLanded(doc, bodyPath("gone"), NEW)).toBe(false)
  })

  it("survives nulls without throwing", () => {
    expect(patchLanded(doc, bodyPath("k3"), NEW)).toBe(false)
    expect(patchLanded(null, COVER_PATH, NEW)).toBe(false)
    expect(patchLanded({}, COVER_PATH, NEW)).toBe(false)
    expect(patchLanded({ body: null }, bodyPath("k1"), NEW)).toBe(false)
  })

  it("refuses to vouch for a path shape it does not understand", () => {
    expect(patchLanded(doc, "body[0].asset._ref", NEW)).toBe(false)
  })
})

describe("unlandedPaths", () => {
  it("names exactly the writes that did not take", () => {
    const doc = {
      coverImage: { asset: { _ref: NEW } },
      body: [
        { _key: "k1", asset: { _ref: NEW } },
        { _key: "k2", asset: { _ref: OLD } },
      ],
    }
    const patch = {
      [COVER_PATH]: NEW,
      [bodyPath("k1")]: NEW,
      [bodyPath("k2")]: NEW,
      [bodyPath("missing")]: NEW,
    }
    expect(unlandedPaths(doc, patch).sort()).toEqual([bodyPath("k2"), bodyPath("missing")].sort())
  })

  it("is empty when every write landed", () => {
    const doc = { coverImage: { asset: { _ref: NEW } } }
    expect(unlandedPaths(doc, { [COVER_PATH]: NEW })).toEqual([])
  })
})
