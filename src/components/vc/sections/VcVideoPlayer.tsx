"use client"

import { useState } from "react"
import { vercelStegaClean } from "@vercel/stega"
import { SImg } from "../primitives"
import type { VcImage } from "../types"

/** Click-to-load YouTube facade in the mock-ups' video frame: poster first, iframe on play. */
export default function VcVideoPlayer({ id, poster, alt, caption }: { id?: string; poster?: VcImage; alt?: string; caption?: string }) {
  const [playing, setPlaying] = useState(false)
  const vid = vercelStegaClean(id ?? "")
  if (playing && vid) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`}
          title={vercelStegaClean(alt ?? "Video")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="vc-iframe"
        />
      </div>
    )
  }
  return (
    <div className="video">
      {poster?.asset ? (
        <SImg image={poster} width={760} alt={alt} />
      ) : vid ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`} alt={vercelStegaClean(alt ?? "")} loading="lazy" />
      ) : null}
      {vid && (
        <button type="button" aria-label="Play video" onClick={() => setPlaying(true)}>
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
      {caption && <span className="cap label">{caption}</span>}
    </div>
  )
}
