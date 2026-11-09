import { describe, expect, it, vi } from "vitest"
import { INTERNAL_VISITOR_KEY, POSTHOG_INTERNAL_TAG } from "./internalVisitor"

function run(search: string, stored: string | null) {
  const store = new Map<string, string>(stored ? [[INTERNAL_VISITOR_KEY, stored]] : [])
  const register = vi.fn()
  const window = {
    location: { search },
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
  }
  new Function("window", "posthog", POSTHOG_INTERNAL_TAG)(window, { register })
  return { register, stored: store.get(INTERNAL_VISITOR_KEY) }
}

describe("POSTHOG_INTERNAL_TAG", () => {
  it("leaves ordinary visitors untagged", () => {
    const r = run("?utm_source=google", null)
    expect(r.register).not.toHaveBeenCalled()
    expect(r.stored).toBeUndefined()
  })

  it("tags a browser the portal already marked", () => {
    expect(run("", "1").register).toHaveBeenCalledWith({ internal: true })
  })

  it("tags and remembers a QA run that passes ?fr_internal=1", () => {
    const r = run("?a=1&fr_internal=1", null)
    expect(r.register).toHaveBeenCalledWith({ internal: true })
    expect(r.stored).toBe("1")
  })

  it("does not match a lookalike parameter", () => {
    expect(run("?fr_internal=10", null).register).not.toHaveBeenCalled()
  })
})
