import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { htmlToMarkdown, htmlToText, toFruitionBrand } from "./htmlToMarkdown"

describe("htmlToMarkdown", () => {
  it("converts headings, paragraphs and inline marks", () => {
    const md = htmlToMarkdown(
      '<h2>Why <strong>it</strong> matters</h2><p>Use <strong>HubSpot</strong> and <em>ClickUp</em>, <a href="https://x.io/a b">see&nbsp;here</a>.</p>',
    )
    expect(md).toBe("## Why it matters\n\nUse **HubSpot** and *ClickUp*, [see here](https://x.io/a%20b).")
  })

  it("flattens lists, including nested ones and li > p", () => {
    const md = htmlToMarkdown("<ul><li><p>One</p></li><li>Two<ul><li>Two a</li></ul></li></ul><ol><li>A</li><li>B</li></ol>")
    expect(md).toBe("- One\n\n- Two\n\n- Two a\n\n1. A\n\n2. B")
  })

  it("lifts images to their own line and skips tracking pixels", () => {
    const md = htmlToMarkdown(
      '<p>Intro <img src="https://cdn.x/a.png" alt="A [chart]"></p><img src="https://t.x/p.gif" width="1" height="1">',
    )
    expect(md).toBe("Intro\n\n![A chart](https://cdn.x/a.png)")
  })

  it("writes tables as GFM pipe tables", () => {
    const md = htmlToMarkdown("<table><tbody><tr><td></td><td>HubSpot</td></tr><tr><td><strong>For</strong></td><td>a|b</td></tr></tbody></table>")
    expect(md).toBe("|  | HubSpot |\n| --- | --- |\n| **For** | a\\|b |")
  })

  it("quotes blockquotes and drops scripts and comments", () => {
    expect(htmlToMarkdown("<blockquote><p>Say it</p></blockquote><script>alert(1)</script><!-- x --><p>End</p>")).toBe(
      "> Say it\n\nEnd",
    )
  })

  it("lifts headings so the top level is h2", () => {
    expect(htmlToMarkdown("<h3>A</h3><p>x</p><h4>B</h4>")).toBe("## A\n\nx\n\n### B")
    expect(htmlToMarkdown("<h2>A</h2><h3>B</h3>")).toBe("## A\n\n### B")
  })

  it("survives an unclosed tag", () => {
    expect(htmlToMarkdown("<p>One<p>Two")).toContain("One")
  })
})

describe("toFruitionBrand", () => {
  it("swaps the OG Labs name and domain for Fruition", () => {
    expect(toFruitionBrand("At OG Labs, see https://oglabs.io/contact or oglabs.io")).toBe(
      "At Fruition, see https://www.fruitionservices.io/contact or fruitionservices.io",
    )
  })
})

describe("htmlToText", () => {
  it("strips tags and entities", () => {
    expect(htmlToText("<p>A&nbsp;<b>b</b>&amp;c</p>")).toBe("A b&c")
  })
})

describe("sync safety", () => {
  it("never reaches social: the sync imports nothing from Zernio, Marketa or the composer", () => {
    for (const f of ["sync.ts", "client.ts", "plan.ts", "htmlToMarkdown.ts", "miniHtml.ts"]) {
      const src = readFileSync(resolve(process.cwd(), "src/lib/hubspotBlog", f), "utf8")
      expect(src, f).not.toMatch(/from\s+["'][^"']*(social|zernio|marketa)[^"']*["']/i)
    }
  })
})

describe("categoriesFor", () => {
  it("tags by product names in the body and topics in the title", async () => {
    const { categoriesFor, industryFor } = await import("./categories")
    const post = {
      title: "ClickUp for Construction Project Management",
      excerpt: "A setup guide for Australian builders",
      body: "We connect HubSpot and ClickUp with Make and n8n.",
    }
    expect(categoriesFor(post).sort()).toEqual(["blogCategory-clickup", "blogCategory-construction", "blogCategory-hubspot"])
    expect(industryFor(post)).toBe("construction")
  })
})
