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

const ROLL_SECONDS = 74

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
 * Client proof — two columns of quotes rolling in opposite directions behind a
 * soft top/bottom mask. Each column repeats its cards once so the -50% travel
 * loops seamlessly; the duplicate copy is `aria-hidden` so screen readers and
 * crawlers see each quote exactly once.
 *
 * Hovering pauses both columns (`.home-quote-track` in globals). Below `lg` the
 * rolling is dropped for a plain stacked list.
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
  const usable = testimonials.filter((t) => t.quote)
  if (usable.length === 0) return null

  const columnA = usable.filter((_, i) => i % 2 === 0)
  const columnB = usable.filter((_, i) => i % 2 === 1)

  return (
    <section className="bg-surface py-16 md:py-20 lg:pt-25 lg:pb-26">
      <Reveal className="mx-auto grid max-w-[1348px] grid-cols-1 items-start gap-10 px-5 md:px-8 lg:grid-cols-[400px_1fr] lg:gap-20">
        <div className="flex flex-col lg:pt-2">
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

        {/* Rolling columns (lg+) */}
        <div
          className="relative hidden h-[660px] overflow-hidden lg:block"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          }}
        >
          <div className="home-quote-track grid grid-cols-2 items-start gap-5">
            <div style={{ animation: `fruQuoteRoll ${ROLL_SECONDS}s linear infinite` }}>
              {columnA.map((t, i) => (
                <QuoteCard key={t._key ?? i} testimonial={t} index={i * 2} />
              ))}
              {columnA.map((t, i) => (
                <QuoteCard key={`dup-${t._key ?? i}`} testimonial={t} index={i * 2} duplicate />
              ))}
            </div>
            <div
              className="-mt-15"
              style={{ animation: `fruQuoteRoll ${ROLL_SECONDS}s linear infinite reverse` }}
            >
              {columnB.map((t, i) => (
                <QuoteCard key={t._key ?? i} testimonial={t} index={i * 2 + 1} />
              ))}
              {columnB.map((t, i) => (
                <QuoteCard key={`dup-${t._key ?? i}`} testimonial={t} index={i * 2 + 1} duplicate />
              ))}
            </div>
          </div>
        </div>

        {/* Below lg, no rolling. On a phone the six quotes are a swipe rail:
            stacked they ran to six screens, and a quote is too long to read
            two-up. From md it goes back to a plain two-column grid. */}
        <div className="fr-swipe-rail gap-5 md:grid-cols-2 lg:hidden">
          {usable.slice(0, 6).map((t, i) => (
            <QuoteCard key={t._key ?? i} testimonial={t} index={i} railItem />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function QuoteCard({
  testimonial,
  index,
  duplicate = false,
  railItem = false,
}: {
  testimonial: HomeTestimonial
  index: number
  duplicate?: boolean
  /** In the phone swipe rail: no bottom margin, and equal-height cards. */
  railItem?: boolean
}) {
  const photoRef = testimonial.profilePhoto?.asset?._ref
  return (
    <figure
      aria-hidden={duplicate || undefined}
      className={`ui-hover-card rounded-card border border-lilac bg-surface-raised px-7 py-6.5 shadow-whisper ${
        railItem ? "flex h-auto flex-col md:mb-5" : "mb-5"
      }`}
    >
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
      <blockquote className="mt-4 text-[16.5px] leading-[1.55] text-body" style={{ textWrap: "pretty" }}>
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-5.5 flex items-center gap-3.5 border-t border-[#f1edfa] pt-4.5">
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
