"use client"

import { useEffect, useRef } from "react"

const PUBLISHER_JS = "https://news.google.com/swg/js/v1/publisher.js"

/**
 * Google's "add as a preferred source" button. publisher.js finds this
 * placeholder and swaps in its own localised, Google-styled button, so we render
 * the bare attribute and nothing else.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 *
 * publisher.js (about 170 kB, plus a second 180 kB Google bundle it pulls in)
 * sits at the very bottom of the page, so it is injected only when the
 * placeholder is within 800px of the viewport instead of on every page load.
 * The placeholder reserves the button's height so nothing shifts when it is
 * swapped in.
 */
export default function GooglePreferredSourceButton({
  theme = "light",
  className,
}: {
  theme?: "light" | "dark"
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || document.getElementById("google-preferred-source")) return
    const load = () => {
      if (document.getElementById("google-preferred-source")) return
      const s = document.createElement("script")
      s.id = "google-preferred-source"
      s.async = true
      s.src = PUBLISHER_JS
      document.head.appendChild(s)
    }
    if (typeof IntersectionObserver === "undefined") {
      load()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          load()
        }
      },
      { rootMargin: "800px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Not a known DOM attribute, so TypeScript rejects it written inline.
  const attrs = { "google-add-preferred-source-btn": "" }
  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: 40 }}
      data-theme={theme}
      {...attrs}
    />
  )
}
