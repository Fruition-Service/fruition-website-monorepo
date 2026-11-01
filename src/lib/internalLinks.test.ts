import { describe, expect, it } from "vitest"
import {
  clampMaxLinks,
  countLinksPerTarget,
  isCtaListItem,
  keywordRegExp,
  normalizePath,
  planInternalLinks,
  type InternalLinkTarget,
  type PtBlock,
  type PtSpan,
} from "./internalLinks"

let n = 0
function block(text: string, extra: Partial<PtBlock> = {}): PtBlock {
  n++
  return {
    _type: "block",
    _key: `b${n}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${n}`, text, marks: [] }],
    ...extra,
  }
}

function spans(b: PtBlock): PtSpan[] {
  return (b.children ?? []) as PtSpan[]
}

function linkedTexts(blocks: PtBlock[]): Array<{ text: string; href: string }> {
  const out: Array<{ text: string; href: string }> = []
  for (const b of blocks) {
    const defs = new Map((b.markDefs ?? []).map((d) => [d._key, d]))
    for (const s of spans(b)) {
      for (const m of s.marks ?? []) {
        const d = defs.get(m)
        if (d?._type === "link") out.push({ text: s.text, href: d.href! })
      }
    }
  }
  return out
}

const T = (path: string, ...keywords: string[]): InternalLinkTarget => ({ path, keywords })

const run = (blocks: PtBlock[], targets: InternalLinkTarget[], extra: { maxLinks?: number; docPath?: string; skipFirstParagraph?: boolean } = {}) =>
  planInternalLinks({ blocks, targets, docPath: extra.docPath ?? "/post/test", maxLinks: extra.maxLinks, skipFirstParagraph: extra.skipFirstParagraph })

describe("keyword matching", () => {
  it("is case-insensitive and keeps the original casing as anchor text", () => {
    const res = run([block("We set up Monday CRM for sales teams.")], [T("/monday-crm-consulting", "monday CRM")])
    expect(linkedTexts(res.blocks)).toEqual([{ text: "Monday CRM", href: "/monday-crm-consulting" }])
    expect(res.added[0].anchorText).toBe("Monday CRM")
  })

  it("matches whole words only", () => {
    const re = (k: string) => keywordRegExp(k)
    expect("Our CRMs are great".match(re("CRM"))).toBeNull()
    expect("Daily scrum notes".match(re("CRM"))).toBeNull()
    expect("We use Airtable".match(re("AI"))).toBeNull()
    expect("She said yes".match(re("AI"))).toBeNull()
    expect("The CRM, finally.".match(re("CRM"))?.[0]).toBe("CRM")
    expect("Try AI-powered tools".match(re("AI"))?.[0]).toBe("AI")
    expect("Ünicode CRMé".match(re("CRM"))).toBeNull()
  })

  it("handles keywords that end in punctuation", () => {
    const re = keywordRegExp("monday.com")
    expect("Use monday.com today".match(re)?.[0]).toBe("monday.com")
    expect("Use monday.com's boards".match(re)?.[0]).toBe("monday.com")
    expect("Use monday.comx".match(re)).toBeNull()
    expect("Use mondayXcom".match(re)).toBeNull()
  })

  it("does not link inside a longer word in a real body", () => {
    const res = run([block("Our CRMs and scrum boards.")], [T("/crm", "CRM")])
    expect(res.added).toHaveLength(0)
  })

  it("prefers the longest phrase", () => {
    const res = run(
      [block("Start with an AI capability assessment this month.")],
      [T("/assessment", "assessment"), T("/ai-capability-assessment", "AI capability assessment")],
    )
    expect(linkedTexts(res.blocks)).toEqual([{ text: "AI capability assessment", href: "/ai-capability-assessment" }])
  })

  it("never creates overlapping links", () => {
    const res = run([block("Book monday CRM consulting now.")], [T("/a", "monday CRM"), T("/b", "CRM consulting")])
    expect(res.added).toHaveLength(1)
    expect(res.skipped.overlap).toBe(1)
  })
})

describe("limits", () => {
  const many = Array.from({ length: 8 }, (_, i) => T(`/t${i}`, `keyword number${i}`))
  const body = () => [block(many.map((_, i) => `About keyword number${i} here.`).join(" "))]

  it("caps links per document at the default of 5", () => {
    expect(run(body(), many).added).toHaveLength(5)
  })

  it("clamps the cap to 3..5", () => {
    expect(clampMaxLinks(undefined)).toBe(5)
    expect(clampMaxLinks(1)).toBe(3)
    expect(clampMaxLinks(50)).toBe(5)
    expect(clampMaxLinks(4)).toBe(4)
    expect(run(body(), many, { maxLinks: 1 }).added).toHaveLength(3)
    expect(run(body(), many, { maxLinks: 99 }).added).toHaveLength(5)
  })

  it("counts existing links to targets toward the cap, so a capped document stays capped on rerun", () => {
    const first = run(body(), many)
    expect(first.added).toHaveLength(5)
    expect(first.skipped.cap).toBe(3)
    const second = run(first.blocks, many)
    expect(second.added).toHaveLength(0)
    expect(second.blocks).toEqual(first.blocks)
  })

  it("links each target at most once per document", () => {
    const res = run([block("monday CRM is great."), block("Again monday CRM.")], [T("/crm", "monday CRM", "sales CRM")])
    expect(res.added).toHaveLength(1)
    expect(res.added[0].blockIndex).toBe(0)
  })

  it("links each anchor text at most once, even to different targets", () => {
    const res = run([block("Use Make.com daily."), block("Then make.com again.")], [T("/a", "Make.com"), T("/b", "make.com")])
    expect(res.added).toHaveLength(1)
    expect(res.skipped["anchor-used"]).toBe(1)
  })

  it("does not reuse an anchor text the body already links", () => {
    const linked = block("", {
      markDefs: [{ _key: "x", _type: "link", href: "https://example.com" }],
      children: [{ _type: "span", _key: "a1", text: "monday CRM", marks: ["x"] }],
    })
    const res = run([linked, block("More about monday CRM.")], [T("/crm", "monday CRM")])
    expect(res.added).toHaveLength(0)
  })
})

describe("where links never go", () => {
  const targets = [T("/crm", "monday CRM")]

  it("never links a document to itself", () => {
    const res = run([block("Read about monday CRM.")], [T("/Post/Test/?utm=x#top", "monday CRM")], { docPath: "/post/test" })
    expect(res.added).toHaveLength(0)
    expect(res.skipped["self-link"]).toBe(1)
  })

  it("normalises paths for comparison", () => {
    expect(normalizePath("https://www.fruitionservices.io/Training/?a=1#b")).toBe("/training")
    expect(normalizePath("/x/")).toBe("/x")
    expect(normalizePath("/")).toBe("/")
    expect(normalizePath("https://example.com/x")).toBeNull()
    expect(normalizePath("mailto:a@b.c")).toBeNull()
  })

  it("does not touch spans that already carry a link", () => {
    const b = block("", {
      markDefs: [{ _key: "x", _type: "link", href: "https://example.com" }],
      children: [{ _type: "span", _key: "a1", text: "Our monday CRM guide", marks: ["x"] }],
    })
    const res = run([b], targets)
    expect(res.added).toHaveLength(0)
    expect(res.skipped["inside-existing-link"]).toBe(1)
  })

  it("skips a target the body already links to, by path or alias", () => {
    const linked = block("", {
      markDefs: [{ _key: "x", _type: "link", href: "https://www.fruitionservices.io/monday-training/" }],
      children: [{ _type: "span", _key: "a1", text: "training", marks: ["x"] }],
    })
    const tgt: InternalLinkTarget = { path: "/training", keywords: ["monday.com training"], aliases: ["/monday-training"] }
    const res = run([linked, block("Book monday.com training.")], [tgt])
    expect(res.added).toHaveLength(0)
    expect(res.skipped["already-linked-target"]).toBe(1)
  })

  it("skips headings, blockquotes and tables", () => {
    const blocks: PtBlock[] = [
      block("monday CRM", { style: "h2" }),
      block("monday CRM", { style: "h3" }),
      block("monday CRM rocks", { style: "blockquote" }),
      { _type: "table", _key: "t", rows: [{ _key: "r", cells: ["monday CRM"] }] },
      { _type: "image", _key: "i", alt: "monday CRM", caption: "monday CRM" },
    ]
    const res = run(blocks, targets)
    expect(res.added).toHaveLength(0)
    expect(res.skipped.heading).toBe(2)
    expect(res.skipped.blockquote).toBe(1)
  })

  it("skips CTA-like list items but links normal prose list items", () => {
    const cta = block("Book a monday CRM demo with us", { listItem: "bullet", level: 1 })
    expect(isCtaListItem(cta)).toBe(true)
    expect(run([cta], targets).added).toHaveLength(0)

    const prose = block("Pipelines in monday CRM update as deals move forward.", { listItem: "bullet", level: 1 })
    expect(isCtaListItem(prose)).toBe(false)
    expect(run([prose], targets).added).toHaveLength(1)
  })

  it("can skip the first normal paragraph", () => {
    const blocks = [block("Intro", { style: "h2" }), block("monday CRM intro."), block("Later monday CRM.")]
    const res = run(blocks, targets, { skipFirstParagraph: true })
    expect(res.added).toHaveLength(1)
    expect(res.added[0].blockIndex).toBe(2)
    expect(run(blocks, targets).added[0].blockIndex).toBe(1)
  })

  it("ignores generic keywords unless the target allows them", () => {
    expect(run([block("Our services team.")], [T("/s", "services")]).added).toHaveLength(0)
    expect(run([block("Our services team.")], [{ path: "/s", keywords: ["services"], allowGeneric: true }]).added).toHaveLength(1)
  })

  it("does not link across spans with different marks", () => {
    const b = block("", {
      children: [
        { _type: "span", _key: "a", text: "Try monday ", marks: [] },
        { _type: "span", _key: "b", text: "CRM", marks: ["strong"] },
      ],
    })
    const res = run([b], targets)
    expect(res.added).toHaveLength(0)
    expect(res.skipped["cross-span"]).toBe(1)
  })
})

describe("insertion", () => {
  it("splits the span, keeps marks and adds a link markDef", () => {
    const b = block("", {
      children: [{ _type: "span", _key: "a", text: "We love monday CRM a lot", marks: ["em"] }],
    })
    const res = run([b], [T("/crm", "monday CRM")])
    const out = res.blocks[0]
    expect(spans(out).map((s) => s.text)).toEqual(["We love ", "monday CRM", " a lot"])
    const def = out.markDefs!.find((d) => d._type === "link")!
    expect(def.href).toBe("/crm")
    expect(spans(out)[1].marks).toEqual(["em", def._key])
    expect(spans(out)[0].marks).toEqual(["em"])
  })

  it("drops empty pre and post spans", () => {
    const res = run([block("monday CRM")], [T("/crm", "monday CRM")])
    expect(spans(res.blocks[0]).map((s) => s.text)).toEqual(["monday CRM"])
  })

  it("creates unique keys and no duplicate spans", () => {
    const b = block("", {
      _key: "il1",
      markDefs: [{ _key: "il2", _type: "link", href: "https://example.com" }],
      children: [
        { _type: "span", _key: "il3", text: "Ext", marks: ["il2"] },
        { _type: "span", _key: "il4", text: " then monday CRM and Make.com here.", marks: [] },
      ],
    })
    const res = run([b], [T("/crm", "monday CRM"), T("/make", "Make.com")])
    const out = res.blocks[0]
    const keys = [out._key, ...spans(out).map((s) => s._key), ...out.markDefs!.map((d) => d._key)]
    expect(new Set(keys).size).toBe(keys.length)
    expect(spans(out).map((s) => s.text).join("")).toBe("Ext then monday CRM and Make.com here.")
    expect(res.added.map((a) => a.targetPath)).toEqual(["/crm", "/make"])
  })

  it("does not mutate the input", () => {
    const blocks = [block("We love monday CRM."), block("And Make.com too.")]
    const snapshot = JSON.parse(JSON.stringify(blocks))
    const res = run(blocks, [T("/crm", "monday CRM"), T("/make", "Make.com")])
    expect(res.added).toHaveLength(2)
    expect(blocks).toEqual(snapshot)
    expect(res.blocks).not.toBe(blocks)
  })

  it("is idempotent: a second run adds nothing", () => {
    const targets = [T("/crm", "monday CRM"), T("/make", "Make.com"), T("/ai", "AI capability assessment")]
    const blocks = [block("monday CRM and Make.com."), block("Then an AI capability assessment, and monday CRM again.")]
    const first = run(blocks, targets)
    expect(first.added).toHaveLength(3)
    const second = run(first.blocks, targets)
    expect(second.added).toHaveLength(0)
    expect(second.blocks).toEqual(first.blocks)
    expect(countLinksPerTarget(second.blocks)).toEqual({ "/crm": 1, "/make": 1, "/ai": 1 })
  })

  it("reports a snippet around the anchor", () => {
    const res = run([block("We love monday CRM a lot")], [T("/crm", "monday CRM")])
    expect(res.added[0]).toMatchObject({ keyword: "monday CRM", targetPath: "/crm", style: "normal", before: "We love [monday CRM] a lot" })
  })
})
