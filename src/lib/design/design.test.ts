import { describe, expect, it } from "vitest"
import { buildDocPrompt, designDocUserInstruction } from "./buildDocPrompt"
import { TEMPLATES, getTemplate, isTemplateId, stylesheetFor } from "./templates"
import { THEME_STYLE_ID, themeCss, withTheme } from "./theme"
import { buildEditPrompt } from "./docEdit"
import { extractPptx } from "./extract/pptx"
import { extractDocx } from "./extract/docx"

const DOC = "<!DOCTYPE html><html><body><div class='fr-doc'>hi</div></body></html>"

describe("template registry", () => {
  it("exposes the five templates", () => {
    expect(TEMPLATES.map((t) => t.id)).toEqual([
      "signoff",
      "proposal",
      "report",
      "slides",
      "rebrand",
    ])
  })

  it("falls back to signoff for unknown or missing ids", () => {
    expect(getTemplate("nope").id).toBe("signoff")
    expect(getTemplate(null).id).toBe("signoff")
    expect(isTemplateId("legacy")).toBe(false)
    expect(isTemplateId("slides")).toBe(true)
  })

  it("routes only the deck template at the slides stylesheet", () => {
    expect(stylesheetFor("slides")).toBe("slides")
    expect(stylesheetFor("report")).toBe("doc")
    expect(stylesheetFor("legacy")).toBe("legacy")
    expect(stylesheetFor(null)).toBe("legacy")
  })
})

describe("buildDocPrompt", () => {
  it("returns a distinct, non-empty prompt per template", () => {
    const prompts = TEMPLATES.map((t) => buildDocPrompt(t.id))
    prompts.forEach((p) => expect(p.length).toBeGreaterThan(500))
    expect(new Set(prompts).size).toBe(TEMPLATES.length)
  })

  it("forbids the model from writing CSS", () => {
    // The whole point of the theme rewrite: the repo owns the stylesheet.
    expect(buildDocPrompt("signoff")).toContain("Write NO CSS")
  })

  it("tells the model not to number its own sections", () => {
    // CSS counters do the numbering; a typed number yields "1. 1. Title".
    expect(buildDocPrompt("report")).toContain("Section numbering is automatic")
    expect(buildDocPrompt("report")).toContain("headings number themselves")
  })

  it("keeps the rebrand template free of imposed structure", () => {
    const p = buildDocPrompt("rebrand")
    expect(p).toContain("KEEP THE SOURCE'S OWN STRUCTURE")
    expect(p).toContain("fr-doc--unnumbered")
  })

  it("names the chosen template in the user instruction", () => {
    expect(designDocUserInstruction("slides")).toContain("Slide deck")
    expect(designDocUserInstruction("signoff", "Acme")).toContain('"Acme"')
  })
})

describe("buildEditPrompt", () => {
  it("forbids CSS for templated documents but not for legacy ones", () => {
    expect(buildEditPrompt("report")).toContain("Write NO CSS")
    expect(buildEditPrompt("legacy")).toContain("carries its own <style> block")
    expect(buildEditPrompt(null)).toContain("carries its own <style> block")
  })
})

describe("withTheme", () => {
  it("injects the stylesheet before </body>", () => {
    const out = withTheme(DOC, "signoff")
    expect(out).toContain(THEME_STYLE_ID)
    expect(out.indexOf(THEME_STYLE_ID)).toBeLessThan(out.indexOf("</body>"))
  })

  it("is idempotent", () => {
    const once = withTheme(DOC, "signoff")
    expect(withTheme(once, "signoff")).toBe(once)
  })

  it("picks the stylesheet from the template", () => {
    expect(themeCss("slides")).toContain(".fr-slide")
    expect(themeCss("slides")).toContain("size: 297mm 167mm")
    expect(themeCss("report")).toContain("size: A4")
    expect(themeCss("report")).not.toContain(".fr-slide-title")
  })

  it("gives templated documents the tokens they reference", () => {
    expect(themeCss("signoff")).toContain("--purple-primary: #8015e8")
  })

  it("gives legacy documents only the original print fixes", () => {
    // Legacy docs carry their own model-authored CSS; layering a full stylesheet
    // over CSS we didn't write would restyle them unpredictably.
    const legacy = themeCss("legacy")
    expect(legacy).toContain("@page { size: A4; margin: 18mm 16mm; }")
    expect(legacy).toContain('[class*="signoff" i]')
    expect(legacy).not.toContain("--purple-primary")
    expect(legacy).not.toContain(".fr-cover")
  })

  it("appends when the document has no body or html close tag", () => {
    expect(withTheme("<p>fragment</p>", "signoff")).toContain(THEME_STYLE_ID)
  })
})

describe("extractPptx", () => {
  /**
   * jsdom's File does not implement arrayBuffer(), so back it with the bytes
   * directly. Everything else about the fixture is a real zip.
   */
  function asFile(bytes: Uint8Array): File {
    const file = new File([bytes as unknown as BlobPart], "deck.pptx")
    Object.defineProperty(file, "arrayBuffer", { value: async () => bytes.buffer })
    return file
  }

  const slide = (...paras: string[]) =>
    `<p:sld>${paras.map((p) => `<a:p><a:r><a:t>${p}</a:t></a:r></a:p>`).join("")}</p:sld>`

  /** Minimal .pptx: a zip holding one XML part per slide. */
  async function fakePptx(entries: Record<string, string>): Promise<File> {
    const { zipSync, strToU8 } = await import("fflate")
    const zipped = Object.fromEntries(
      Object.entries(entries).map(([path, xml]) => [path, strToU8(xml)]),
    )
    return asFile(zipSync(zipped))
  }

  const deck = (...slides: string[]) =>
    Object.fromEntries(slides.map((xml, i) => [`ppt/slides/slide${i + 1}.xml`, xml]))

  it("extracts slides in order with the first line as the title", async () => {
    const file = await fakePptx(deck(slide("Welcome", "First point"), slide("Next up")))
    const out = await extractPptx(file)
    expect(out).toContain("## Slide 1: Welcome")
    expect(out).toContain("- First point")
    expect(out).toContain("## Slide 2: Next up")
    expect(out.indexOf("Slide 1")).toBeLessThan(out.indexOf("Slide 2"))
  })

  it("joins runs split mid-paragraph and decodes entities", async () => {
    // PowerPoint splits a sentence across runs whenever formatting changes.
    const xml = `<a:p><a:r><a:t>Fruition </a:t></a:r><a:r><a:t>&amp; monday</a:t></a:r></a:p>`
    const out = await extractPptx(await fakePptx(deck(`<p:sld>${xml}</p:sld>`)))
    expect(out).toContain("Fruition & monday")
  })

  it("orders slide10 after slide9 rather than lexically", async () => {
    const file = await fakePptx({
      "ppt/slides/slide9.xml": slide("Nine"),
      "ppt/slides/slide10.xml": slide("Ten"),
    })
    const out = await extractPptx(file)
    expect(out.indexOf("Nine")).toBeLessThan(out.indexOf("Ten"))
  })

  it("ignores non-slide parts of the archive", async () => {
    const file = await fakePptx({
      ...deck(slide("Real slide")),
      "ppt/slideLayouts/slideLayout1.xml": slide("Layout boilerplate"),
      "docProps/app.xml": "<Properties><a:t>Metadata</a:t></Properties>",
    })
    const out = await extractPptx(file)
    expect(out).toContain("Real slide")
    expect(out).not.toContain("Layout boilerplate")
    expect(out).not.toContain("Metadata")
  })

  it("rejects a file with no slides", async () => {
    await expect(extractPptx(await fakePptx({}))).rejects.toThrow(/No slides/)
  })
})

describe("extractDocx", () => {
  /** The three parts mammoth needs to accept an archive as a .docx. */
  async function fakeDocx(bodyXml: string): Promise<File> {
    const { zipSync, strToU8 } = await import("fflate")
    const bytes = zipSync({
      "[Content_Types].xml": strToU8(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
      ),
      "_rels/.rels": strToU8(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
      ),
      "word/document.xml": strToU8(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${bodyXml}</w:body></w:document>`,
      ),
    })
    const file = new File([bytes as unknown as BlobPart], "doc.docx")
    // jsdom's File does not implement arrayBuffer().
    Object.defineProperty(file, "arrayBuffer", { value: async () => bytes.buffer })
    return file
  }

  it("keeps headings and inline emphasis rather than flattening to text", async () => {
    // Structure is the whole point: the model re-renders a document, and a wall
    // of prose would make it guess the heading hierarchy back.
    const file = await fakeDocx(
      `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Scope of work</w:t></w:r></w:p>` +
        `<w:p><w:r><w:t>Fruition will deliver the </w:t></w:r><w:r><w:rPr><w:b/></w:rPr><w:t>intake board</w:t></w:r><w:r><w:t> first.</w:t></w:r></w:p>`,
    )
    const html = await extractDocx(file)
    expect(html).toContain("<h1>Scope of work</h1>")
    expect(html).toContain("<strong>intake board</strong>")
    // Runs split mid-sentence rejoin into one paragraph.
    expect(html).toContain("Fruition will deliver the <strong>intake board</strong> first.")
  })

  it("rejects an empty document", async () => {
    await expect(extractDocx(await fakeDocx(""))).rejects.toThrow(/empty/)
  })
})
