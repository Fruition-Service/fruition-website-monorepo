/**
 * Generates src/components/region/regionMapData.generated.ts.
 *
 *   node scripts/build-region-maps.mjs
 *
 * Re-run it after editing src/data/regionMaps.ts. dotted-map carries the whole
 * world's country geometry, so the dot grid is computed here, once, and the
 * finished circles are committed — the region pages then render a plain SVG and
 * pull in no map library at all, on the server or in the browser.
 *
 * Marker positions come from the same map instance as the dots (`getPin`), so a
 * mark always lands exactly on a dot rather than floating between them.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { getMapJSON } from "dotted-map"
// The `{ map }` constructor lives in the country-free build; the main entry
// expects the generation parameters instead.
import DottedMap from "dotted-map/without-countries"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const CONFIG = join(ROOT, "src/data/regionMaps.ts")
const OUT = join(ROOT, "src/components/region/regionMapData.generated.ts")

const DOT_RADIUS = 0.34
/** Breathing room around the shape, in dot units, so marks never touch the edge. */
const PAD = 1.4
/**
 * How tall the map renders, in px — MAX_MAP_HEIGHT in RegionMap. The collision
 * check below is in rendered pixels rather than dot units, because dot units
 * mean different distances at different resolutions: raising `height` to pull
 * two marks apart on the grid does not move them apart on screen at all.
 */
const RENDER_HEIGHT = 440
/** A mark is 22px across. Below this they touch. */
const MIN_MARKER_GAP_PX = 32

/**
 * Reads REGION_MAPS out of the TypeScript config without a TS toolchain: the
 * file is plain data, so stripping the type annotations leaves valid JS.
 */
async function loadDefinitions() {
  const src = readFileSync(CONFIG, "utf8")
  const start = src.indexOf("export const REGION_MAPS")
  if (start === -1) throw new Error(`REGION_MAPS not found in ${CONFIG}`)
  const body = src
    .slice(src.indexOf("=", start) + 1)
    .replace(/^\s*Record<[^>]*>\s*=/, "")
    .trim()
  const literal = body.endsWith("}") ? body : body.slice(0, body.lastIndexOf("}") + 1)
  return (0, eval)(`(${literal})`)
}

/**
 * dotted-map looks countries up by key and reduces over the result without
 * checking, so an unknown code dies deep inside the library on
 * `undefined.geometry`. Fail here instead, naming the code. Note that Singapore
 * genuinely has no polygon in the bundled dataset.
 */
function assertKnownCountries(slug, countries) {
  const unknown = countries.filter((code) => {
    try {
      getMapJSON({ height: 2, countries: [code] })
      return false
    } catch {
      return true
    }
  })
  if (unknown.length) {
    throw new Error(`${slug}: dotted-map has no geometry for ${unknown.join(", ")}`)
  }
}

function buildRegion(slug, def) {
  assertKnownCountries(slug, def.countries)
  const json = getMapJSON({
    height: def.height,
    grid: "diagonal",
    countries: def.countries,
    ...(def.region ? { region: def.region } : {}),
    avoidOuterPins: true,
  })
  const map = new DottedMap({ map: JSON.parse(json) })
  const points = map.getPoints()
  if (!points.length) throw new Error(`${slug}: dotted-map produced no points`)

  // The library's own viewBox is the lattice size, not the shape's extent — on
  // a diagonal grid the rows are 0.866 apart, so the dots stop well short of
  // the stated height. Measure the real bounds instead and crop to them, which
  // both removes the dead band and makes the marker fractions exact.
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of points) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  }
  const originX = minX - PAD
  const originY = minY - PAD
  const width = maxX - minX + PAD * 2
  const height = maxY - minY + PAD * 2

  const round = (n) => Math.round(n * 100) / 100
  // `r` on each <circle> rather than once on a parent: it is a geometry
  // property, and inheriting it through a <g> is not something to rely on. A
  // <defs> circle plus a <use> per dot would save nothing at this id length and
  // would build a shadow tree per dot, which is slower than the plain elements.
  const dots = points
    .map((p) => `<circle cx="${round(p.x - originX)}" cy="${round(p.y - originY)}" r="${DOT_RADIUS}"/>`)
    .join("")

  const markers = []
  for (const marker of def.markers) {
    const pin = map.getPin({ lat: marker.lat, lng: marker.lng })
    if (!pin) throw new Error(`${slug}: "${marker.city}" falls outside the map`)
    const x = pin.x - originX
    const y = pin.y - originY
    const scale = RENDER_HEIGHT / height
    for (const placed of markers) {
      const gap = Math.hypot(placed.rawX - x, placed.rawY - y) * scale
      if (gap < MIN_MARKER_GAP_PX) {
        throw new Error(
          `${slug}: "${marker.city}" and "${placed.city}" render ${gap.toFixed(0)}px apart ` +
            `(minimum ${MIN_MARKER_GAP_PX}px). They are too close together to mark separately ` +
            `at this size — drop one. Raising "height" will not help: it refines the grid ` +
            `without moving the cities further apart on screen.`,
        )
      }
    }
    markers.push({
      city: marker.city,
      headquarters: Boolean(marker.headquarters),
      labelSide: marker.labelSide,
      // Percentages of the cropped box, so the component can place the marks as
      // absolutely positioned HTML and keep the label text at a fixed px size.
      left: round((x / width) * 100),
      top: round((y / height) * 100),
      rawX: x,
      rawY: y,
    })
  }

  return {
    viewBox: `0 0 ${round(width)} ${round(height)}`,
    aspectRatio: round(width / height),
    dots,
    markers: markers.map(({ rawX: _x, rawY: _y, ...rest }) => rest),
  }
}

const definitions = await loadDefinitions()
const entries = Object.entries(definitions).map(([slug, def]) => [slug, buildRegion(slug, def)])

const body = entries
  .map(
    ([slug, map]) => `  "${slug}": {
    viewBox: "${map.viewBox}",
    aspectRatio: ${map.aspectRatio},
    markers: [
${map.markers
  .map(
    (m) =>
      `      { city: ${JSON.stringify(m.city)}, left: ${m.left}, top: ${m.top}, labelSide: "${m.labelSide}"${
        m.headquarters ? ", headquarters: true" : ""
      } },`,
  )
  .join("\n")}
    ],
    dots: ${JSON.stringify(map.dots)},
  },`,
  )
  .join("\n")

writeFileSync(
  OUT,
  `// GENERATED FILE — do not edit by hand.
// Run \`node scripts/build-region-maps.mjs\` to regenerate after editing
// src/data/regionMaps.ts.
//
// \`dots\` is the pre-rendered dot grid for one country: <circle> elements with
// no fill of their own, so the colour comes from \`currentColor\` on the <svg>
// that holds them.
// Coordinates are in the viewBox's units; marker positions are percentages of
// the same box, because the marks render as HTML on top of the SVG rather than
// inside it (an SVG label would shrink with the viewport; an HTML one does not).

import type { RegionSlug } from "./types"

export interface RegionMapMarkerData {
  city: string
  /** Percent of the map box, from its left edge. */
  left: number
  /** Percent of the map box, from its top edge. */
  top: number
  labelSide: "left" | "right" | "top" | "bottom"
  headquarters?: boolean
}

export interface RegionMapData {
  viewBox: string
  /** width / height of the dot grid, so the box reserves the right space. */
  aspectRatio: number
  markers: RegionMapMarkerData[]
  dots: string
}

export const REGION_MAP_DATA: Record<RegionSlug, RegionMapData> = {
${body}
}
`,
  "utf8",
)

const size = readFileSync(OUT, "utf8").length
console.log(`Wrote ${OUT} (${(size / 1024).toFixed(0)} KB)`)
for (const [slug, map] of entries) {
  const dots = (map.dots.match(/<circle/g) || []).length
  console.log(`  ${slug.padEnd(30)} ${String(dots).padStart(5)} dots  ${map.markers.length} markers  ratio ${map.aspectRatio}`)
}
