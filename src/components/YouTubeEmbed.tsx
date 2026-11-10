"use client"

import { useState } from "react"
import { buildVideoObject } from "@/lib/videoObject"

interface YouTubeEmbedProps {
  /** Full YouTube URL or embed URL. videoId extracted automatically. */
  url?: string
  /** Direct video id (overrides url). */
  videoId?: string
  title?: string
  className?: string
  style?: React.CSSProperties
  /**
   * VideoObject enrichment. This component is a click-to-load facade, so
   * Googlebot can't see the video without structured data — these feed the
   * emitted VideoObject JSON-LD. uploadDate (ISO 8601) is what makes a video
   * eligible for video results; description/duration are recommended.
   */
  uploadDate?: string
  description?: string
  duration?: string
  /**
   * Where the poster fallback chain starts. "maxres" (default) starts at the
   * 1280x720 maxresdefault.jpg. "sd" starts at the 640x480 sddefault.jpg, about a
   * third of the bytes; its baked-in letterbox bars sit exactly where
   * object-cover crops a 16:9 box, so it looks the same at up to ~640px wide.
   */
  posterQuality?: "maxres" | "sd"
}

/** Poster URLs to try in order, best first. */
export function youTubePosterChain(id: string, quality: "maxres" | "sd" = "maxres"): string[] {
  const chain = [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  ]
  return quality === "sd" ? chain.slice(1) : chain
}

function extractVideoId(input?: string): string | null {
  if (!input) return null
  try {
    const u = new URL(input)
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "") || null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.replace("/embed/", "") || null
      }
      return u.searchParams.get("v")
    }
  } catch {
    return null
  }
  return null
}

/**
 * High-quality YouTube facade. Renders a sharp maxresdefault.jpg poster
 * until the user clicks play, then swaps to the iframe. Avoids the
 * blurry default YouTube preview thumbnail.
 */
export default function YouTubeEmbed({
  url,
  videoId,
  title,
  className,
  style,
  uploadDate,
  description,
  duration,
  posterQuality = "maxres",
}: YouTubeEmbedProps) {
  const id = videoId || extractVideoId(url)
  const [playing, setPlaying] = useState(false)
  // Poster fallback chain: not every video has the higher resolutions, and
  // YouTube answers a missing size with a VALID 120x90 grey placeholder
  // (so onError never fires) — onLoad checks naturalWidth to catch it.
  const [posterIdx, setPosterIdx] = useState(0)
  if (!id) return null
  const posters = youTubePosterChain(id, posterQuality)
  const poster = posters[posterIdx]
  const nextPoster = () => setPosterIdx((i) => Math.min(i + 1, posters.length - 1))

  // VideoObject JSON-LD so the facaded video is discoverable by Googlebot.
  // Null when there's no meaningful title (avoids placeholder-named markup).
  const videoObject = buildVideoObject({ id, title, uploadDate, description, duration })
  const videoLd = videoObject ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObject) }}
    />
  ) : null

  if (playing) {
    return (
      <>
        {videoLd}
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={className}
          style={{ border: 0, width: "100%", height: "100%", ...style }}
        />
      </>
    )
  }

  return (
    <button
      type="button"
      aria-label={title ? `Play ${title}` : "Play video"}
      onClick={() => setPlaying(true)}
      className={`relative w-full h-full block group ${className ?? ""}`}
      style={{ padding: 0, border: 0, cursor: "pointer", background: "black", ...style }}
    >
      {videoLd}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        onError={nextPoster}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth <= 120 && posterIdx < posters.length - 1) nextPoster()
        }}
        alt={title || "Video thumbnail"}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-90"
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: 72,
            height: 72,
            background: "rgba(0,0,0,0.7)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
