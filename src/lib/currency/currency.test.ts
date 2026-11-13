import { describe, expect, it, beforeEach } from "vitest"
import { createCurrencyKit, currency } from "./kit"
import { mountCurrency } from "./dom"
import { currencyScript, pageHasPrice } from "./inline"

describe("currency kit", () => {
  it("has a positive rate and a prefix for every code", () => {
    for (const c of currency.CODES) {
      expect(currency.RATES_PER_USD[c]).toBeGreaterThan(0)
      expect(currency.CURRENCIES[c].prefix.length).toBeGreaterThan(0)
    }
    expect(currency.RATES_PER_USD.USD).toBe(1)
  })

  it("rounds up to clean marketing steps", () => {
    expect(currency.roundMarketing(3671)).toBe(3700)
    expect(currency.roundMarketing(11234)).toBe(11500)
    expect(currency.roundMarketing(11500)).toBe(11500)
    expect(currency.roundMarketing(192241)).toBe(195000)
    expect(currency.roundMarketing(47)).toBe(47)
  })

  it("shows the exact figure in its own currency and a rounded one elsewhere", () => {
    expect(currency.display(2500, "USD", "USD")).toBe("US$2,500")
    expect(currency.display(2500, "USD", "AUD")).toBe("A$3,700")
    expect(currency.display(18000, "AUD", "USD")).toBe("US$12,500")
    expect(currency.display(18000, "AUD", "GBP")).toBe("£9,300")
    expect(currency.display(3000, "AUD", "INR")).toMatch(/^₹1,9\d,\d{3}$/)
    expect(currency.display(2500, "USD", "AED")).toBe("AED 9,200")
  })

  it("parses Sanity price strings", () => {
    expect(currency.parse("A$18,000")).toEqual({ amount: 18000, currency: "AUD" })
    expect(currency.parse("US$2,500")).toEqual({ amount: 2500, currency: "USD" })
    expect(currency.parse("AUD $24,500 + GST")).toEqual({ amount: 24500, currency: "AUD" })
    expect(currency.parse("$2,500")).toBeNull()
    expect(currency.parse("$2,500", "USD")).toEqual({ amount: 2500, currency: "USD" })
    expect(currency.parse("On request")).toBeNull()
  })

  it("converts every price in a run of copy", () => {
    expect(
      currency.convertText("AI consulting (from A$18,000) · HubSpot (from A$8,000)", "USD"),
    ).toBe("AI consulting (from US$12,500) · HubSpot (from US$5,500)")
    // Bare "$" only with a base.
    expect(currency.convertText("from $2,500 one-time", "AUD")).toBeNull()
    expect(currency.convertText("from $2,500 one-time", "AUD", "USD")).toBe("from A$3,700 one-time")
    // Mixed USD and AUD on one line both land in the display currency.
    expect(currency.convertText("packages from $2,500; AI from A$18,000", "GBP", "USD")).toBe(
      "packages from £1,900; AI from £9,300",
    )
  })

  it("carries a range's currency to its bare upper bound", () => {
    expect(currency.convertText("Pilots typically run AUD $25,000–$65,000.", "USD")).toBe(
      "Pilots typically run US$17,500–US$44,500.",
    )
    expect(currency.convertText("range from AUD $80,000 to $450,000 depending", "AUD")).toBe(
      "range from AUD $80,000 to $450,000 depending",
    )
  })

  it("leaves regional price lists, outcomes and non-prices alone", () => {
    expect(currency.convertText("Fixed fee: AUD $24,500, GBP £14,500 or USD $18,500.", "SGD")).toBeNull()
    expect(currency.convertText("$2.4M annualised, £4.2M saved", "AUD", "USD")).toBeNull()
    expect(currency.convertText("Monthly costs of over AUD 130k", "USD")).toBeNull()
    expect(currency.convertText("Up to 250 users in 2-4 weeks", "USD", "USD")).toBeNull()
  })

  it("maps countries and time zones, and knows nothing about the rest", () => {
    expect(currency.forCountry("au")).toBe("AUD")
    expect(currency.forCountry("DE")).toBe("EUR")
    expect(currency.forCountry("GB")).toBe("GBP")
    expect(currency.forCountry("PH")).toBeNull()
    expect(currency.forTimezone("Australia/Sydney")).toBe("AUD")
    expect(currency.forTimezone("America/Toronto")).toBe("CAD")
    expect(currency.forTimezone("America/Chicago")).toBe("USD")
    expect(currency.forTimezone("Asia/Manila")).toBeNull()
  })

  it("is self-contained, so it can be inlined into the ad pages", () => {
    const rebuilt = new Function(`return (${String(createCurrencyKit)})()`)()
    expect(rebuilt.display(18000, "AUD", "USD")).toBe("US$12,500")
  })
})

describe("DOM converter", () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, String(v)),
        removeItem: (k: string) => void store.delete(k),
        clear: () => store.clear(),
      },
    })
    document.body.innerHTML = ""
  })

  it("converts text, honours base and skip, and restores the original", () => {
    document.body.innerHTML = `
      <p id="a">From A$18,000 per phase</p>
      <div data-price-base="USD"><p id="b">from $2,500 one-time</p></div>
      <p id="c">about $6,000</p>
      <div data-currency-skip><p id="d">GBP £14,500 + VAT</p></div>`
    const c = mountCurrency(window, currency, { pageDefault: "GBP" })
    const text = (id: string) => document.getElementById(id)!.textContent
    expect(text("a")).toBe("From £9,300 per phase")
    expect(text("b")).toBe("from £1,900 one-time")
    expect(text("c")).toBe("about $6,000")
    expect(text("d")).toBe("GBP £14,500 + VAT")
    c.set("AUD")
    expect(text("a")).toBe("From A$18,000 per phase")
    expect(text("b")).toBe("from A$3,700 one-time")
    expect(JSON.parse(localStorage.getItem("fruition-currency")!).source).toBe("user")
  })

  it("lets a visitor's own pick beat the ad page's market", () => {
    localStorage.setItem("fruition-currency", JSON.stringify({ code: "NZD", source: "user", at: Date.now() }))
    document.body.innerHTML = `<p id="a">From US$2,500</p>`
    mountCurrency(window, currency, { pageDefault: "AUD" })
    expect(document.getElementById("a")!.textContent).toBe("From NZ$4,600")
  })
})

describe("ad page inline script", () => {
  it("detects priced pages and builds a runnable script", () => {
    expect(pageHasPrice(`<head><title>x</title></head><body><div class="price">From US$2,500</div></body>`)).toBe(true)
    expect(pageHasPrice(`<body><p>saved about $50,000 a year</p></body>`)).toBe(false)
    const js = currencyScript("AUD").replace(/^<script>|<\/script>$/g, "")
    expect(() => new Function(js)).not.toThrow()
  })
})
