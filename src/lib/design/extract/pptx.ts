/**
 * PPTX → per-slide text, in the browser.
 *
 * A .pptx is a zip of XML. Each slide is ppt/slides/slideN.xml and its visible
 * text is the <a:t> runs, in document order. That is all the model needs — it
 * re-renders the deck in the Fruition template rather than reproducing the
 * original's layout, so shapes, positions and theming are deliberately ignored.
 *
 * fflate is dynamically imported to keep it out of the Worker bundle (see
 * docx.ts for the reasoning).
 */

/** Numeric part of ppt/slides/slide12.xml, for ordering. */
function slideNumber(path: string): number {
  return Number(path.match(/slide(\d+)\.xml$/)?.[1] ?? 0)
}

/** Visible text runs of one slide XML, in document order. */
function slideText(xml: string): string[] {
  // <a:t> holds every visible run. Paragraph breaks (</a:p>) separate lines;
  // runs within a paragraph are joined because Word/PowerPoint split a single
  // sentence across runs whenever formatting changes mid-line.
  return xml
    .split(/<\/a:p>/)
    .map((para) =>
      Array.from(para.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g))
        .map((m) => decodeXml(m[1]))
        .join("")
        .trim(),
    )
    .filter(Boolean)
}

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
}

export async function extractPptx(file: File): Promise<string> {
  const { unzipSync } = await import("fflate")
  const zip = unzipSync(new Uint8Array(await file.arrayBuffer()))

  const slidePaths = Object.keys(zip)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => slideNumber(a) - slideNumber(b))

  if (slidePaths.length === 0) throw new Error("No slides found in that .pptx.")

  const decoder = new TextDecoder()
  const slides = slidePaths.map((path, i) => {
    const lines = slideText(decoder.decode(zip[path]))
    // The first line of a slide is its title in all but pathological decks.
    const [title, ...body] = lines
    const heading = `## Slide ${i + 1}${title ? `: ${title}` : ""}`
    return body.length ? `${heading}\n\n${body.map((l) => `- ${l}`).join("\n")}` : heading
  })

  const out = slides.join("\n\n").trim()
  if (!out) throw new Error("That .pptx has no readable text.")
  return out
}
