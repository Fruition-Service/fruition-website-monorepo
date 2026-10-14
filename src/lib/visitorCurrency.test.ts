import { describe, expect, it } from "vitest"
import { currencyForVisitor } from "./visitorCurrency"

describe("currencyForVisitor", () => {
  it("maps the IP country to its currency", () => {
    expect(currencyForVisitor("SG")).toBe("SGD")
    expect(currencyForVisitor("gb")).toBe("GBP")
    expect(currencyForVisitor("AU")).toBe("AUD")
    expect(currencyForVisitor("DE")).toBe("EUR")
    expect(currencyForVisitor("IE")).toBe("EUR")
    expect(currencyForVisitor("US")).toBe("USD")
  })

  it("shows USD to a country with no currency of its own in the picker", () => {
    expect(currencyForVisitor("IN")).toBe("USD")
    expect(currencyForVisitor("NZ")).toBe("USD")
    expect(currencyForVisitor("CH")).toBe("USD")
  })

  it("trusts the country over the timezone", () => {
    expect(currencyForVisitor("US", "Australia/Sydney")).toBe("USD")
  })

  it("falls back to the timezone when Cloudflare cannot place the visitor", () => {
    expect(currencyForVisitor("XX", "Australia/Melbourne")).toBe("AUD")
    expect(currencyForVisitor("T1", "Europe/London")).toBe("GBP")
    expect(currencyForVisitor(undefined, "Asia/Singapore")).toBe("SGD")
    expect(currencyForVisitor(undefined, "Europe/Paris")).toBe("EUR")
  })

  it("defaults to USD when nothing places the visitor", () => {
    expect(currencyForVisitor()).toBe("USD")
    expect(currencyForVisitor("XX", "America/New_York")).toBe("USD")
    expect(currencyForVisitor("", "")).toBe("USD")
  })
})
