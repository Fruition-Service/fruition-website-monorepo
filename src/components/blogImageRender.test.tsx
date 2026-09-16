import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import BlogPostTemplate, { type BlogPostData } from "./BlogPostTemplate"

/**
 * The blur regression, asserted on the rendered markup.
 *
 * A 147x83 Wix placeholder used to be emitted with width="740" and
 * class="w-full", i.e. blown up 5x across the article column. These lock in
 * that it is laid out at its own size instead, and that a real image still
 * fills the column exactly as before.
 */

const PLACEHOLDER = "image-2c23664a25be2830c55411a2bad67b0a36fb4669-147x83-jpg"
const FULL_SIZE = "image-cd931c72e90f9ab11de540fbfc545aeb3c8e0a07-1200x675-jpg"

function renderWithBodyImage(ref: string): string {
  const post: BlogPostData = {
    title: "Roadmap",
    body: [
      {
        _type: "image",
        _key: "img1",
        alt: "A screenshot",
        asset: { _type: "reference", _ref: ref },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ],
  }
  return renderToStaticMarkup(<BlogPostTemplate post={post} />)
}

/** The <img> carrying our alt text, as raw markup. */
function imgTag(html: string): string {
  const m = /<img[^>]*alt="A screenshot"[^>]*>/.exec(html)
  if (!m) throw new Error("no article image rendered")
  return m[0]
}

describe("blog body images", () => {
  it("lays a placeholder scrape out at its own size, never stretched", () => {
    const tag = imgTag(renderWithBodyImage(PLACEHOLDER))

    expect(tag).toContain('width="147"')
    expect(tag).toContain('height="83"')
    // The old behaviour, and the whole bug: 740px of column for 147px of pixels.
    expect(tag).not.toContain('width="740"')
    // `max-w-full` caps it at the column; `w-full` would stretch it to fill.
    expect(tag).toContain('class="h-auto max-w-full"')
    expect(tag).toContain('sizes="147px"')
    // And it must not ask the CDN to upscale either.
    expect(tag).toContain("w%3D147")
    expect(tag).not.toContain("w%3D1480")
  })

  it("still fills the column for an image that has the pixels", () => {
    const tag = imgTag(renderWithBodyImage(FULL_SIZE))

    expect(tag).toContain('width="740"')
    expect(tag).toContain('class="w-full h-auto"')
    expect(tag).toContain("w%3D1200")
  })
})
