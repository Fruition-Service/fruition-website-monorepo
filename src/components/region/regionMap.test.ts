import { describe, expect, it } from "vitest"
import { REGION_MAP_DATA } from "./regionMapData.generated"
import { REGION_MAPS } from "@/data/regionMaps"
import { REGION_PAGES } from "@/data/regionPages"
import type { RegionSlug } from "./types"

const SLUGS = Object.keys(REGION_PAGES) as RegionSlug[]

/**
 * Mirrors RegionMap's MAX_MAP_HEIGHT and the mark's 22px diameter. The
 * generator enforces the same gap, but only when someone remembers to re-run
 * it — this fails the build if the committed data ever stops matching.
 */
const MAX_MAP_HEIGHT = 440
const MIN_MARKER_GAP_PX = 32

describe("region hero maps", () => {
  it("covers every region page", () => {
    expect(Object.keys(REGION_MAP_DATA).sort()).toEqual([...SLUGS].sort())
    expect(Object.keys(REGION_MAPS).sort()).toEqual([...SLUGS].sort())
  })

  for (const slug of SLUGS) {
    describe(slug, () => {
      const map = REGION_MAP_DATA[slug]

      it("is in sync with the config it was generated from", () => {
        expect(map.markers.map((m) => m.city)).toEqual(REGION_MAPS[slug].markers.map((m) => m.city))
        expect(map.markers.map((m) => m.labelSide)).toEqual(
          REGION_MAPS[slug].markers.map((m) => m.labelSide),
        )
      })

      it("has a drawable grid", () => {
        expect(map.dots).toMatch(/^<circle /)
        expect(map.dots.match(/<circle/g)!.length).toBeGreaterThan(200)
        expect(map.viewBox).toMatch(/^0 0 [\d.]+ [\d.]+$/)
        expect(map.aspectRatio).toBeGreaterThan(0)
      })

      it("places every mark inside the map", () => {
        for (const marker of map.markers) {
          expect(marker.left, marker.city).toBeGreaterThan(0)
          expect(marker.left, marker.city).toBeLessThan(100)
          expect(marker.top, marker.city).toBeGreaterThan(0)
          expect(marker.top, marker.city).toBeLessThan(100)
        }
      })

      it("marks exactly one headquarters", () => {
        expect(map.markers.filter((m) => m.headquarters)).toHaveLength(1)
      })

      it("keeps the marks far enough apart to be legible", () => {
        const widthPx = MAX_MAP_HEIGHT * map.aspectRatio
        for (let i = 0; i < map.markers.length; i++) {
          for (let j = i + 1; j < map.markers.length; j++) {
            const a = map.markers[i]
            const b = map.markers[j]
            const gap = Math.hypot(
              ((a.left - b.left) / 100) * widthPx,
              ((a.top - b.top) / 100) * MAX_MAP_HEIGHT,
            )
            expect(gap, `${a.city} to ${b.city}`).toBeGreaterThanOrEqual(MIN_MARKER_GAP_PX)
          }
        }
      })

      it("only marks cities the page's own copy names", () => {
        // Guards the drift the other way: renaming a city in regionPages.ts
        // without touching regionMaps.ts would leave the map advertising a
        // place the page no longer mentions.
        const copy = JSON.stringify(REGION_PAGES[slug])
        for (const marker of map.markers) {
          expect(copy, marker.city).toContain(marker.city)
        }
      })
    })
  }
})
