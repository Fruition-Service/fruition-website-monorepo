"use client"

import { useState } from "react"

/**
 * The office map in the coverage section, as a click-to-load facade.
 *
 * A Google Maps embed pulls in roughly 335 KB of script the moment its iframe
 * mounts, even with `loading="lazy"` once it scrolls near the viewport, and
 * most visitors never touch it. Until someone asks for the map, this renders a
 * static placeholder in the same box (so nothing shifts when the iframe swaps
 * in) and loads Google only on click. The "Open in Google Maps" link under it
 * still works with no JavaScript at all.
 */
export default function RegionOfficeMap({
  address,
  mapQuery,
}: {
  address: string
  mapQuery: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-[320px] overflow-hidden rounded-[16px] bg-surface-subtle md:h-[420px]">
      {loaded ? (
        <iframe
          title={`Map of the Fruition Services office: ${address}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
          className="block size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-5 px-6 text-center">
          {/* Decorative dot grid in the map palette, standing in for the tiles. */}
          <svg
            aria-hidden
            focusable="false"
            className="absolute inset-0 h-full w-full text-map-dot"
          >
            <defs>
              <pattern id="region-office-map-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="1.6" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#region-office-map-dots)" />
          </svg>

          <span aria-hidden className="relative grid size-[54px] place-items-center rounded-full bg-brand/10">
            <span className="grid size-[38px] place-items-center rounded-full bg-brand text-surface shadow-card ring-2 ring-surface">
              <svg aria-hidden focusable="false" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
            </span>
          </span>

          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="cta-btn cta-btn-outline relative min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label={`Load interactive map of ${address}`}
          >
            Load interactive map
          </button>
        </div>
      )}
    </div>
  )
}
