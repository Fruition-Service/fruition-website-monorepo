import Image from "next/image"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import Reveal from "./Reveal"
import ReviewBadges from "./ReviewBadges"

export interface HomeTestimonial {
  _key?: string
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
  profilePhoto?: { asset?: { _ref?: string } }
}

/** Dot colours cycle so adjacent cards never repeat. */
const DOTS = ["var(--accent-green)", "var(--accent-blue)", "var(--purple-primary)", "var(--accent-amber)"]

/** Enough proof to scan in one view; the rest of the pool stays unrendered. */
const MAX_QUOTES = 6

function initials(name?: string) {
  if (!name) return ", "
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

interface Props {
  testimonials: HomeTestimonial[]
  bookingHref: string
  eyebrow?: string
  heading?: string
  intro?: string
  ctaLabel?: string
}

/**
 * Client proof — the heading and CTA beside up to six customer quotes, each
 * card shown whole.
 *
 * The homepage renders this with its defaults; `TestimonialsGrid` renders it as
 * the shared testimonials section across the marketing pages, passing their own
 * heading and CTA through.
 */
export default function TestimonialsRoll({
  testimonials,
  bookingHref,
  eyebrow = "Client proof",
  heading = "What our customers say about us",
  intro = "Operations and IT leaders on what changed after we mapped the process first.",
  ctaLabel = "Book a call",
}: Props) {
  // Some pages' case-study feeds carry the same quote more than once; the old
  // rolling columns hid that, a static grid would show it side by side.
  const seen = new Set<string>()
  const usable = testimonials.filter((t) => {
    const key = t.quote?.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
  if (usable.length === 0) return null

  return (
    <section className="bg-surface py-16 md:py-20 lg:pt-25 lg:pb-26">
      <Reveal className="site-container grid grid-cols-1 items-start gap-10 lg:grid-cols-[400px_1fr] lg:gap-20">
        <div className="flex flex-col lg:sticky lg:top-28 lg:pt-2">
          {eyebrow && (
            <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">{eyebrow}</p>
          )}
          <h2 className="text-section-h2 mt-4 text-foreground" style={{ textWrap: "pretty" }}>
            {heading}
          </h2>
          {intro && (
            <p className="text-body mt-4.5 text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
              {intro}
            </p>
          )}
          <div className="mt-7">
            <CtaButton href={bookingHref} label={ctaLabel} variant="primary" />
          </div>
          <ReviewBadges className="mt-7 max-w-[400px]" />
        </div>

        {/* Six quotes, laid out whole. This used to be two columns rolling
            behind a fade mask, but the mask sliced cards mid-sentence at the
            top and bottom edges, which read as a broken section. On a phone
            the quotes are a swipe rail (stacked they ran to six screens);
            from md they sit in a plain two-column grid. */}
        <div className="fr-swipe-rail gap-5 md:grid-cols-2">
          {usable.slice(0, MAX_QUOTES).map((t, i) => (
            <QuoteCard key={t._key ?? i} testimonial={t} index={i} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function QuoteCard({ testimonial, index }: { testimonial: HomeTestimonial; index: number }) {
  const photoRef = testimonial.profilePhoto?.asset?._ref
  return (
    <figure className="ui-hover-card flex h-auto flex-col rounded-card border border-lilac bg-surface-raised px-7 py-6.5 shadow-whisper">
      {testimonial.company && (
        <div className="flex items-center gap-[9px]">
          <span
            className="h-[7px] w-[7px] flex-none rounded-full"
            style={{ background: DOTS[index % DOTS.length] }}
          />
          <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-muted">
            {testimonial.company}
          </span>
        </div>
      )}
      <blockquote className="mt-4 mb-5.5 text-[16.5px] leading-[1.55] text-body" style={{ textWrap: "pretty" }}>
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3.5 border-t border-[#f1edfa] pt-4.5">
        {photoRef ? (
          <Image
            // Several profile photos are stored as HEIF, which browsers can't
            // decode — `auto("format")` makes Sanity transcode to WebP.
            src={urlFor(testimonial.profilePhoto).width(92).height(92).fit("crop").auto("format").url()}
            alt=""
            width={46}
            height={46}
            className="h-[46px] w-[46px] flex-none rounded-full border border-lilac object-cover"
          />
        ) : (
          <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border border-lilac bg-tint text-sm font-semibold tracking-[0.02em] text-brand">
            {initials(testimonial.authorName)}
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="text-[14.5px] font-semibold text-body">{testimonial.authorName}</span>
          <span className="text-[13px] text-muted">{testimonial.authorRole}</span>
        </span>
      </figcaption>
    </figure>
  )
}
