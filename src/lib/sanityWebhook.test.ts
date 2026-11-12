import { createHmac } from "node:crypto"
import { describe, expect, it } from "vitest"
import { isValidSanitySignature, signSanityWebhook } from "./sanityWebhook"

const SECRET = "test-secret"
const BODY = JSON.stringify({ _id: "vcQuote-x", _type: "vcQuote" })

describe("isValidSanitySignature", () => {
  it("accepts a signature built the way Sanity builds it", () => {
    const t = 1633519811129
    const v1 = createHmac("sha256", SECRET).update(`${t}.${BODY}`).digest("base64url")
    expect(isValidSanitySignature(`t=${t},v1=${v1}`, BODY, SECRET)).toBe(true)
  })

  it("accepts the helper's own header", () => {
    expect(isValidSanitySignature(signSanityWebhook(BODY, SECRET), BODY, SECRET)).toBe(true)
  })

  it("accepts standard base64 with padding", () => {
    const t = 1700000000000
    const v1 = createHmac("sha256", SECRET).update(`${t}.${BODY}`).digest("base64")
    expect(isValidSanitySignature(`t=${t}, v1=${v1}`, BODY, SECRET)).toBe(true)
  })

  it("rejects a tampered body, a wrong secret, and malformed headers", () => {
    const header = signSanityWebhook(BODY, SECRET)
    expect(isValidSanitySignature(header, BODY + " ", SECRET)).toBe(false)
    expect(isValidSanitySignature(header, BODY, "other")).toBe(false)
    expect(isValidSanitySignature(null, BODY, SECRET)).toBe(false)
    expect(isValidSanitySignature("v1=abc", BODY, SECRET)).toBe(false)
    expect(isValidSanitySignature("t=abc,v1=abc", BODY, SECRET)).toBe(false)
    expect(isValidSanitySignature(header, BODY, "")).toBe(false)
  })
})
