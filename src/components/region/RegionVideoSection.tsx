import SectionIntro from "@/components/sections/SectionIntro"
import YouTubeEmbed from "@/components/YouTubeEmbed"

interface Props {
  eyebrow?: string
  heading: string
  lead: string
  caption?: string
  videoId: string
  videoTitle: string
}

export default function RegionVideoSection({
  eyebrow = "See it in action",
  heading,
  lead,
  caption,
  videoId,
  videoTitle,
}: Props) {
  return (
    <section className="bg-surface py-14 md:py-24">
      <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionIntro align="left" eyebrow={eyebrow} heading={heading} lead={lead} />
          {caption && <p className="mt-6 text-caption text-faint">{caption}</p>}
        </div>
        <div className="aspect-video overflow-hidden rounded-card border border-lilac shadow-card">
          <YouTubeEmbed videoId={videoId} title={videoTitle} />
        </div>
      </div>
    </section>
  )
}
