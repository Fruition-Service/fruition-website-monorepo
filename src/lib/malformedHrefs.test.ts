import { describe, expect, it } from "vitest"
import { classifyHref, findMalformedHrefs } from "./malformedHrefs"

describe("classifyHref", () => {
  it("flags a second or embedded scheme", () => {
    expect(classifyHref("/monday-partner-ukhttps://www.fruitionservices.io/monday-partner-uk")).toBe("embedded-scheme")
    expect(
      classifyHref(
        "https://www.businesswire.com/news/home/20260223954640/en/Fruition-Earns-https://www.fruitionservices.io/partnerships/monday-consulting-partner.com-Platinum-Partner-Status-in-APAC",
      ),
    ).toBe("embedded-scheme")
  })

  it("marks a domain inside another URL's path for review", () => {
    expect(classifyHref("https://example.com/redirect?to=evil.com/x")).toBe("domain-in-path")
    expect(classifyHref("https://example.com/en/Fruition-www.fruitionservices.io-x")).toBe("domain-in-path")
  })

  it("leaves normal hrefs alone", () => {
    for (const h of ["/monday-partner-uk", "https://www.fruitionservices.io/training", "mailto:a@b.com", "#top", "https://example.com/blog/my-post",
      "https://www.businesswire.com/news/home/20260223954640/en/Fruition-Earns-monday.com-Platinum-Partner-Status-in-APAC",
      "https://getlatka.com/companies/make.com"]) {
      expect(classifyHref(h), h).toBeNull()
    }
  })
})

describe("findMalformedHrefs", () => {
  it("walks markDefs and link-named string fields with Sanity paths", () => {
    const doc = {
      _id: "x",
      body: [
        {
          _key: "b1",
          _type: "block",
          markDefs: [
            { _key: "m1", _type: "link", href: "https://a.com/x-https://b.io/y" },
            { _key: "m2", _type: "link", href: "/ok" },
          ],
        },
      ],
      cta: { buttonUrl: "/fooHttps://bar.io" },
      text: "https://a.com https://b.com",
    }
    expect(findMalformedHrefs(doc)).toEqual([
      { path: 'body[_key=="b1"].markDefs[_key=="m1"].href', href: "https://a.com/x-https://b.io/y", kind: "embedded-scheme" },
      { path: "cta.buttonUrl", href: "/fooHttps://bar.io", kind: "embedded-scheme" },
    ])
  })
})
