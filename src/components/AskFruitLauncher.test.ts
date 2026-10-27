import { describe, expect, it } from "vitest"
import { CLEARANCE, launcherPlacement } from "@/components/AskFruitLauncher"

const HIDDEN = { visible: false, height: 0, right: 0 }

// Measured on the Cloudflare preview: at 375 wide the launcher's left edge is
// 303 and the notice's card runs to 359 with its wrapper 275px tall.
const PHONE_LEFT = 303
const PHONE_NOTICE = { visible: true, height: 275, right: 359 }

describe("launcherPlacement", () => {
  it("keeps the floor with nothing else down there", () => {
    expect(launcherPlacement(HIDDEN, HIDDEN, PHONE_LEFT)).toEqual({
      lift: 0,
      layer: "z-40",
    })
  })

  it("lifts clear of the consent notice on a phone, below it in z-order", () => {
    expect(launcherPlacement(HIDDEN, PHONE_NOTICE, PHONE_LEFT)).toEqual({
      lift: 275 + CLEARANCE,
      layer: "z-40",
    })
  })

  it("stays put when the notice sits in the bottom-left corner", () => {
    // 1440 wide: the notice card stops at 24 + 432, far left of the launcher.
    const notice = { visible: true, height: 210, right: 456 }
    expect(launcherPlacement(HIDDEN, notice, 1440 - 32 - 60)).toEqual({
      lift: 0,
      layer: "z-40",
    })
  })

  it("assumes a collision with the notice before the first measurement", () => {
    expect(launcherPlacement(HIDDEN, PHONE_NOTICE, null).lift).toBe(
      275 + CLEARANCE,
    )
  })

  it("takes the larger lift when the bar and the notice are both up", () => {
    const shortBar = { visible: true, height: 90, right: 359 }
    expect(launcherPlacement(shortBar, PHONE_NOTICE, PHONE_LEFT).lift).toBe(
      275 + CLEARANCE,
    )
    const tallBar = { visible: true, height: 320, right: 359 }
    expect(launcherPlacement(tallBar, PHONE_NOTICE, PHONE_LEFT).lift).toBe(
      320 + CLEARANCE,
    )
  })

  it("keeps the bar rule: lifted at z-40, beside a short bar at z-[60]", () => {
    const fullBar = { visible: true, height: 90, right: 359 }
    expect(launcherPlacement(fullBar, HIDDEN, PHONE_LEFT)).toEqual({
      lift: 90 + CLEARANCE,
      layer: "z-40",
    })
    const cappedBar = { visible: true, height: 90, right: 1320 }
    expect(launcherPlacement(cappedBar, HIDDEN, 1440 - 32 - 60)).toEqual({
      lift: 0,
      layer: "z-[60]",
    })
  })
})
