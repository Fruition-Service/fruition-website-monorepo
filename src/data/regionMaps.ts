import type { RegionSlug } from "@/components/region/types"

/**
 * Per-region hero map definitions — the input to `scripts/build-region-maps.mjs`.
 *
 * Each region page gets a dot-grid map of its own country instead of the one
 * shared product illustration every page used to run. The generator turns this
 * file into `src/components/region/regionMapData.generated.ts`; nothing here is
 * read at runtime, so edit this file and re-run the script, never the other way
 * round.
 *
 * Country keys are the ISO 3166-1 alpha-3 ids in dotted-map's bundled
 * `countries.geo.json`.
 */

export interface RegionMapMarker {
  /** Label drawn beside the mark. Keep it short — it sits over the map. */
  city: string
  lat: number
  lng: number
  /** The office city. Renders larger, with the halo rings. */
  headquarters?: boolean
  /**
   * Which way the label runs off the mark. Hand-placed per city: the projection
   * has no idea which neighbour a label is about to collide with, and there are
   * only about thirty markers across all six pages.
   */
  labelSide: "left" | "right" | "top" | "bottom"
}

export interface RegionMapDefinition {
  /** Countries to draw as dots. */
  countries: string[]
  /**
   * Optional crop. Without it the grid fits the full extent of `countries`,
   * which is wrong wherever a country owns distant territory — the continental
   * United States is a legible shape, the United States plus Alaska, Hawaii and
   * the Aleutians shrunk to fit beside it is not.
   */
  region?: { lat: { min: number; max: number }; lng: { min: number; max: number } }
  /** Dot rows. Higher is finer and heavier — every dot is an element in the HTML. */
  height: number
  markers: RegionMapMarker[]
}

export const REGION_MAPS: Record<RegionSlug, RegionMapDefinition> = {
  "monday-partner-australia": {
    countries: ["AUS"],
    height: 40,
    markers: [
      { city: "Sydney", lat: -33.87, lng: 151.21, headquarters: true, labelSide: "right" },
      { city: "Brisbane", lat: -27.47, lng: 153.03, labelSide: "right" },
      { city: "Melbourne", lat: -37.81, lng: 144.96, labelSide: "bottom" },
      { city: "Adelaide", lat: -34.93, lng: 138.6, labelSide: "left" },
      { city: "Perth", lat: -31.95, lng: 115.86, labelSide: "left" },
    ],
  },

  "monday-partner-uk": {
    // Great Britain and Northern Ireland only — the GBR feature also carries
    // the overseas territories, which the crop drops.
    countries: ["GBR"],
    region: { lat: { min: 49.8, max: 59.5 }, lng: { min: -8.6, max: 2.2 } },
    height: 40,
    markers: [
      { city: "London", lat: 51.51, lng: -0.13, headquarters: true, labelSide: "right" },
      { city: "Birmingham", lat: 52.49, lng: -1.89, labelSide: "left" },
      { city: "Manchester", lat: 53.48, lng: -2.24, labelSide: "left" },
      // Leeds is in the coverage list but not on the map: it sits 26px from
      // Manchester once the map is sized, and the two marks would overlap. It
      // is also the one city of the five the hero's eyebrow pill leaves out.
      { city: "Edinburgh", lat: 55.95, lng: -3.19, labelSide: "left" },
    ],
  },

  "monday-partner-us": {
    // The lower 48. Alaska and Hawaii are deliberately outside the crop.
    countries: ["USA"],
    region: { lat: { min: 24.5, max: 49.4 }, lng: { min: -125, max: -66.9 } },
    // Lower than the rest because this is the one map wide enough to be sized
    // by the column rather than the height budget, so it draws smaller.
    height: 24,
    markers: [
      { city: "New York", lat: 40.71, lng: -74.01, headquarters: true, labelSide: "right" },
      { city: "Chicago", lat: 41.88, lng: -87.63, labelSide: "top" },
      { city: "Austin", lat: 30.27, lng: -97.74, labelSide: "bottom" },
      // Above rather than beside: this mark sits within 4% of the map's west
      // edge, and "San Francisco" is the longest label on any of these maps.
      { city: "San Francisco", lat: 37.77, lng: -122.42, labelSide: "top" },
      { city: "Los Angeles", lat: 34.05, lng: -118.24, labelSide: "bottom" },
    ],
  },

  "monday-partner-singapore": {
    // Singapore alone is a single dot at any usable scale, and this page sells
    // an ASEAN desk rather than a city-state — so the map is the region the
    // office actually covers, with Singapore marked inside it. "SGP" is not a
    // key in dotted-map's geometry at all (the source dataset has no Singapore
    // polygon), which is the same point from the other direction.
    countries: ["MYS", "IDN", "THA", "VNM", "PHL", "KHM", "LAO", "MMR", "BRN"],
    region: { lat: { min: -10.5, max: 21.5 }, lng: { min: 94, max: 127.5 } },
    height: 40,
    markers: [
      { city: "Singapore", lat: 1.35, lng: 103.82, headquarters: true, labelSide: "bottom" },
      { city: "Bangkok", lat: 13.76, lng: 100.5, labelSide: "left" },
      { city: "Ho Chi Minh City", lat: 10.82, lng: 106.63, labelSide: "right" },
      { city: "Manila", lat: 14.6, lng: 120.98, labelSide: "right" },
      { city: "Kuala Lumpur", lat: 3.14, lng: 101.69, labelSide: "left" },
      { city: "Jakarta", lat: -6.21, lng: 106.85, labelSide: "bottom" },
    ],
  },

  "monday-partner-india": {
    countries: ["IND"],
    height: 40,
    markers: [
      { city: "New Delhi", lat: 28.61, lng: 77.21, headquarters: true, labelSide: "right" },
      { city: "Mumbai", lat: 19.08, lng: 72.88, labelSide: "left" },
      { city: "Hyderabad", lat: 17.39, lng: 78.49, labelSide: "right" },
      { city: "Bengaluru", lat: 12.97, lng: 77.59, labelSide: "left" },
      { city: "Chennai", lat: 13.08, lng: 80.27, labelSide: "right" },
    ],
  },

  "monday-partner-philippines": {
    countries: ["PHL"],
    height: 40,
    markers: [
      { city: "Metro Manila", lat: 14.6, lng: 120.98, headquarters: true, labelSide: "left" },
      { city: "Cebu", lat: 10.32, lng: 123.89, labelSide: "right" },
      { city: "Iloilo", lat: 10.72, lng: 122.56, labelSide: "left" },
      { city: "Davao", lat: 7.07, lng: 125.61, labelSide: "right" },
    ],
  },
}
