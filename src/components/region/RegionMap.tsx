import { REGION_MAP_DATA, type RegionMapMarkerData } from "./regionMapData.generated"
import type { RegionSlug } from "./types"

/**
 * The region hero's map — a dot-grid outline of the country with a Fruition
 * mark on every city the page's coverage section lists.
 *
 * The grid is pre-rendered into `regionMapData.generated.ts`, so this ships no
 * map library and runs entirely on the server: the dots are a static string of
 * `<circle>` elements with no fill of their own, tinted by `currentColor` on
 * the `<svg>`.
 *
 * Marks and labels are absolutely positioned HTML rather than SVG `<text>`,
 * because text inside a viewBox scales with the viewport — a 13px label in the
 * 1200px layout would drop under 9px in the narrowest column the map renders
 * in. Positions are percentages of the same box the dots are drawn in, which is
 * cropped to the shape's true extent, so a mark lands on its dot at any size.
 *
 * Which side a label runs off is hand-set per city in `src/data/regionMaps.ts`:
 * the projection cannot know that Melbourne's label is about to collide with
 * Adelaide's.
 */

/**
 * Tallest the map may draw, in px. Countries differ wildly in proportion — the
 * United Kingdom is half as wide as it is tall, the lower 48 nearly twice as
 * wide — so sizing on width alone made the UK and the Philippines heroes half
 * again as tall as Australia's. Budget the height instead and let width follow
 * the shape, and all six heroes come out the same height.
 */
const MAX_MAP_HEIGHT = 440

/**
 * Room reserved either side of the map, in px, for the city labels to run into.
 * Without it the east-coast labels on the Australia map — Sydney and Brisbane
 * sit within 3% of the map's right edge — were clipped by the hero section's
 * `overflow-hidden` at `lg` widths.
 */
const LABEL_GUTTER = 64

const LABEL_POSITION: Record<RegionMapMarkerData["labelSide"], string> = {
  right: "left-full top-1/2 -translate-y-1/2 ml-2 text-left",
  left: "right-full top-1/2 -translate-y-1/2 mr-2 text-right",
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5 text-center",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5 text-center",
}

/** The Fruition mark, defined once and referenced by every city. */
function FruitionMarkSymbol() {
  return (
    <svg aria-hidden className="absolute h-0 w-0" focusable="false">
      <symbol id="region-map-fruition-mark" viewBox="-4 -4 312 288">
        <path d="M174.742 0.108448C176.067 -0.0704959 176.112 -0.0538986 177.403 0.355942C177.505 0.710944 177.769 1.72544 177.742 2.05663C175.048 35.2566 149.641 63.0196 116.878 69.1153C113.306 69.7798 109.413 70.1846 105.717 70.5966C128.176 72.1306 142.771 75.9729 162.037 88.263C166.701 72.0008 161.049 48.7185 176.23 33.9181C184.031 26.3137 192.447 26.4443 202.482 26.5973C202.35 21.2131 201.139 5.56264 204.555 3.00691C218.066 -7.09767 214.836 23.4383 214.77 26.6326C219.747 26.4955 228.513 26.2834 233.07 28.6053C260.978 40.7541 247.108 80.6969 259.238 98.934C272.602 119.026 285.789 122.87 296.441 148.991C305.743 172.192 305.557 198.122 295.925 221.188C285.01 246.861 266.204 263.37 240.69 273.595C237.607 274.667 234.476 275.598 231.308 276.385C205.079 282.846 180.712 278.13 157.844 264.268C144.418 271.817 133.398 276.104 117.909 278.249C90.6553 281.879 63.0726 274.569 41.188 257.916C19.1491 241.193 4.687 216.366 1.00691 188.939C-2.86964 161.385 4.54457 133.433 21.5666 111.428C40.4913 86.8517 64.9455 74.9447 95.0805 71.0656C95.087 63.4381 94.5317 55.6728 94.942 48.0698C95.2197 42.9238 96.3613 39.6277 101.635 38.8845C110.05 41.2317 107.159 59.7734 107.418 67.6491C110.454 52.4511 113.579 41.3818 123.389 28.7251C136.026 12.4202 154.356 2.60501 174.742 0.108448ZM107.251 82.9243C107.398 88.5553 108.1 92.8716 102.086 95.5197C94.4812 95.2974 94.8851 89.1426 95.0675 83.428C68.7108 87.0602 47.2763 98.0227 30.9161 119.529C16.0675 138.995 9.69964 163.633 13.2563 187.861C16.6783 211.978 29.5163 233.754 48.9574 248.417C60.7813 257.313 76.5228 264.17 91.3108 265.891C115.522 269.407 140.13 263.038 159.6 248.217C179.17 233.341 192.034 211.3 195.363 186.936C198.501 162.666 191.872 138.141 176.936 118.76C159.317 95.9136 135.475 85.2167 107.251 82.9243ZM172.557 96.4339C194.614 117.098 207.23 140.444 208.306 171.224C209.36 199.096 199.134 226.215 179.941 246.445C176.29 250.325 172.867 253.279 168.821 256.683C190.02 267.059 206.299 269.384 229.518 264.207C252.704 256.943 270.243 244.292 281.752 222.33C291.806 203.058 293.826 180.587 287.369 159.829C284.755 151.537 278.693 138.694 272.804 132.621C257.081 116.406 243.82 106.569 241.802 82.1003C240.825 70.2539 241.354 48.155 229.4 40.6357C223.778 37.598 198.471 38.9603 191.577 39.075C176.798 44.1302 176.856 63.5882 176.013 76.4462C175.514 84.0586 174.593 89.0928 172.557 96.4339ZM123.851 54.475C136.806 49.2034 147.115 41.8119 155.284 30.2454C157.228 27.4927 162.213 18.9799 161.386 15.7632C144.75 23.105 131.835 33.1612 124.703 50.622C124.158 51.9547 123.626 53.0868 123.851 54.475Z" />
        <path d="M74.4501 95.6351C81.7832 96.3992 83.0013 104.179 89.1552 106.628C95.4541 109.018 108.989 110.081 114.526 105.761C118.456 102.696 123.696 93.4236 130.214 97.0811C133.632 101.02 132.295 104.535 129.822 108.442C128.04 110.853 125.883 112.963 123.436 114.693C97.5369 132.922 55.8938 107.989 74.4501 95.6351Z" />
      </symbol>
    </svg>
  )
}

interface Props {
  slug: RegionSlug
  /** Country name for the map's accessible label — a leading "the" is trimmed. */
  countryName: string
}

export default function RegionMap({ slug, countryName }: Props) {
  const map = REGION_MAP_DATA[slug]
  const country = countryName.replace(/^the /, "")

  return (
    <div
      className="mx-auto"
      style={{
        // The gutter is padding, so the map inside is never taller than the
        // budget and never wider than the column minus its label room.
        width: `min(100%, ${Math.round(MAX_MAP_HEIGHT * map.aspectRatio) + LABEL_GUTTER * 2}px)`,
        paddingInline: `${LABEL_GUTTER}px`,
      }}
      role="group"
      aria-label={`Where Fruition delivers in ${country}: ${map.markers
        .map((m) => m.city)
        .join(", ")}`}
    >
      <FruitionMarkSymbol />

      <div className="relative w-full" style={{ aspectRatio: map.aspectRatio }}>
        {/* The country itself. Decorative: every city it carries also has a
            visible label, so there is nothing here to announce twice. */}
        <svg
          aria-hidden
          focusable="false"
          viewBox={map.viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full text-map-dot"
          fill="currentColor"
          dangerouslySetInnerHTML={{ __html: map.dots }}
        />

        {map.markers.map((marker) => (
          <div
            key={marker.city}
            className="absolute"
            style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              {/* The office city gets the halo, so it reads first. */}
              {marker.headquarters && (
                <>
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand opacity-10"
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-[38px] w-[38px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand opacity-20"
                  />
                </>
              )}

              <span
                className={`relative grid place-items-center rounded-full bg-brand text-surface shadow-card ring-2 ring-surface ${
                  marker.headquarters ? "h-[30px] w-[30px]" : "h-[22px] w-[22px]"
                }`}
              >
                <svg
                  aria-hidden
                  focusable="false"
                  fill="currentColor"
                  className={marker.headquarters ? "h-[17px] w-[17px]" : "h-[13px] w-[13px]"}
                >
                  <use href="#region-map-fruition-mark" />
                </svg>
              </span>

              <span
                className={`absolute hidden whitespace-nowrap text-[12px] font-semibold leading-none md:block ${
                  marker.headquarters ? "text-brand" : "text-body"
                } ${LABEL_POSITION[marker.labelSide]}`}
              >
                {marker.city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
