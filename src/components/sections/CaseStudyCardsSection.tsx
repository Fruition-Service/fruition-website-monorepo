"use client"

import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "./types"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import CardRail from "@/components/common/CardRail"

interface CaseStudyCard {
  _key?: string
  title?: string
  description?: string
  personName?: string
  personRole?: string
  image?: SanityImageRef
  imageUrl?: string
  videoUrl?: string
}

interface CaseStudyCardsSectionProps {
  heading?: string
  cards?: CaseStudyCard[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).width(400).auto("format").url() } catch { return null }
}

function toEmbedUrl(url?: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

export default function CaseStudyCardsSection({
  heading,
  cards = [],
}: CaseStudyCardsSectionProps) {
  if (cards.length === 0) return null

  return (
    <section className="bg-surface section-y">
      <div className="site-container">
        {heading && (
          <h2 className="text-section-h2 text-body mb-12">
            {heading}
          </h2>
        )}
        <CardRail
          label={heading || "Case studies"}
          count={cards.length}
          className="md:grid-cols-2 gap-7"
          stackedClassName="grid grid-cols-1 md:grid-cols-2 gap-7"
        >
          {cards.map((card, i) => {
            const imageSrc = safeImageUrl(card.image) || card.imageUrl || null
            const embedUrl = toEmbedUrl(card.videoUrl)
            return (
              <div
                key={card._key || i}
                className="bg-surface-raised rounded-card border border-ui overflow-hidden flex flex-col shadow-whisper dark:shadow-none"
              >
                {/* Media: video or image */}
                {embedUrl ? (
                  <div className="aspect-video">
                    <YouTubeEmbed url={embedUrl} title={card.title || "Case study video"} />
                  </div>
                ) : imageSrc ? (
                  <div className="aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={card.title || "Case study"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Content */}
                <div className="p-7 flex-1">
                  {card.title && (
                    <h3 className="text-xl font-semibold text-body">
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <p className="text-[15px] leading-[22.5px] text-body mt-3 whitespace-pre-line">
                      {card.description}
                    </p>
                  )}
                  {card.personName && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-body">
                        {card.personName}
                      </p>
                      {card.personRole && (
                        <p className="text-[13px] text-muted">
                          {card.personRole}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardRail>
      </div>
    </section>
  )
}
