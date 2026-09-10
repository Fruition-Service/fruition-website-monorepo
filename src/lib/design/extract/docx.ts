/**
 * DOCX → HTML, in the browser.
 *
 * mammoth is imported dynamically so it never lands in the Cloudflare Worker
 * bundle — the same reason src/lib/clockifyPdf.ts defers pdfjs-dist. Client
 * chunks are served as static assets and don't count against the Worker's
 * 10 MiB limit; a static import here would.
 *
 * mammoth's `browser` entry is used explicitly: the default entry pulls in Node
 * built-ins (fs, path) that break the bundle.
 *
 * HTML rather than plain text on purpose — headings, lists and tables survive,
 * so the model re-renders a structure instead of guessing one back out of prose.
 */
export async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser")
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammoth.convertToHtml({ arrayBuffer })
  const html = value.trim()
  if (!html) throw new Error("That .docx appears to be empty.")
  return html
}
