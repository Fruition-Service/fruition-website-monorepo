import { describe, expect, it } from "vitest"
import {
  WHATSAPP_DEFAULT_MESSAGE,
  WHATSAPP_FALLBACK_HREF,
  whatsappBaseHref,
  whatsappHref,
} from "./whatsapp"

/** The shape `siteSettings.socialLinks` actually ships (see queries.ts). */
const CMS_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/fruition" },
  { label: "WhatsApp", href: "https://wa.me/61483955931" },
  { label: "YouTube", href: "https://www.youtube.com/@fruition" },
]

describe("whatsappBaseHref", () => {
  it("reads the number out of the CMS social links", () => {
    expect(whatsappBaseHref(CMS_LINKS)).toBe("https://wa.me/61483955931")
  })

  it("matches the label case- and separator-insensitively", () => {
    const variants = ["whatsapp", "WHATSAPP", "Whats App", "whats-app"]
    for (const label of variants) {
      expect(whatsappBaseHref([{ label, href: "https://wa.me/123" }])).toBe(
        "https://wa.me/123",
      )
    }
  })

  it("accepts the other hosts that open a conversation", () => {
    expect(
      whatsappBaseHref([
        { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=123" },
      ]),
    ).toBe("https://api.whatsapp.com/send/?phone=123")
  })

  // The number itself, not just "some fallback": this is the line the launcher
  // dials whenever Sanity is unreachable, so a typo here is a dead channel.
  it("falls back to the published WhatsApp number", () => {
    expect(WHATSAPP_FALLBACK_HREF).toBe("https://wa.me/61435520959")
  })

  it("falls back when the CMS has no WhatsApp entry", () => {
    expect(whatsappBaseHref([{ label: "LinkedIn", href: "https://x.test/" }])).toBe(
      WHATSAPP_FALLBACK_HREF,
    )
  })

  it("falls back when Site Settings is unavailable or malformed", () => {
    expect(whatsappBaseHref(undefined)).toBe(WHATSAPP_FALLBACK_HREF)
    expect(whatsappBaseHref(null)).toBe(WHATSAPP_FALLBACK_HREF)
    expect(whatsappBaseHref([])).toBe(WHATSAPP_FALLBACK_HREF)
    expect(whatsappBaseHref([{ label: "WhatsApp" }])).toBe(WHATSAPP_FALLBACK_HREF)
    expect(whatsappBaseHref([{ label: "WhatsApp", href: "   " }])).toBe(
      WHATSAPP_FALLBACK_HREF,
    )
  })

  it("ignores a WhatsApp row pointing at something that is not WhatsApp", () => {
    // An editor pasting the wrong URL into that row must not break the launcher.
    expect(
      whatsappBaseHref([
        { label: "WhatsApp", href: "https://www.linkedin.com/company/fruition" },
      ]),
    ).toBe(WHATSAPP_FALLBACK_HREF)
  })
})

describe("whatsappHref", () => {
  it("appends the prefilled message, URL encoded", () => {
    expect(whatsappHref(CMS_LINKS)).toBe(
      `https://wa.me/61483955931?text=${encodeURIComponent(
        WHATSAPP_DEFAULT_MESSAGE,
      )}`,
    )
  })

  it("encodes spaces as %20 rather than +, which WhatsApp shows literally", () => {
    const href = whatsappHref(CMS_LINKS)
    expect(href).toContain("%20")
    expect(href).not.toContain("+")
  })

  it("joins with & when the CMS href already carries a query", () => {
    expect(
      whatsappHref(
        [{ label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=123" }],
        "Hello",
      ),
    ).toBe("https://api.whatsapp.com/send/?phone=123&text=Hello")
  })

  it("keeps a prefill the CMS href already declares", () => {
    const href = "https://wa.me/61483955931?text=Editor%20wrote%20this"
    expect(whatsappHref([{ label: "WhatsApp", href }], "Hello")).toBe(href)
  })

  it("adds nothing when the message is empty", () => {
    expect(whatsappHref(CMS_LINKS, "   ")).toBe("https://wa.me/61483955931")
  })

  it("still resolves to the fallback number when the CMS is down", () => {
    expect(whatsappHref(null)).toContain(WHATSAPP_FALLBACK_HREF)
  })
})
