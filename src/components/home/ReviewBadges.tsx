import Image from "next/image"

export const G2_REVIEWS_URL = "https://www.g2.com/products/fruition-services/reviews"
export const TRUSTPILOT_REVIEWS_URL = "https://www.trustpilot.com/review/fruitionservices.io"

/**
 * Live figures, verified against both profiles on 2026-09-01: Trustpilot 4.0
 * from 3 reviews, G2 5.0 from 1 review.
 *
 * The review counts are deliberately not rendered. That makes the star strips
 * the only rating signal on the page, so they have to stay honest: the
 * Trustpilot asset below is the 4-star one, matching the real 4.0 score, not
 * the 5-star strip from the sample badge the design was taken from.
 */
export const G2_RATING = "5.0"

/**
 * Temporary kill switch. The badges are hidden site-wide while the review
 * profiles are being worked on; nothing here is removed, so flipping this back
 * to `true` restores them exactly as they were.
 */
const SHOW_REVIEW_BADGES = false

interface Props {
  className?: string
}

/** Untinted so each vendor's own mark carries the colour, as in their badges. */
const badgeClass =
  "flex flex-1 flex-col justify-start gap-2.5 rounded-card px-3.5 py-3 transition-colors hover:bg-surface-subtle"

/**
 * Trustpilot and G2 rating badges, sized to sit under the Client proof CTA.
 * Each is a single external link to the source profile, so the rating is always
 * one click from the reviews behind it.
 *
 * Laid out as the vendors present their own badges — mark above, stars below —
 * with the logos kept as assets under `public/images/home/logos` so their brand
 * colours stay out of the token layer, matching the existing partner logos.
 */
export default function ReviewBadges({ className = "" }: Props) {
  if (!SHOW_REVIEW_BADGES) return null

  return (
    <div className={`flex flex-col gap-2 md:flex-row md:items-start ${className}`}>
      <a
        href={TRUSTPILOT_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={badgeClass}
        aria-label="Fruition Services on Trustpilot: TrustScore 4.0 from 3 reviews. Opens in a new tab."
      >
        <Image
          src="/images/home/logos/trustpilot.svg"
          alt="Trustpilot"
          width={1133}
          height={278}
          unoptimized
          className="h-auto w-[97px]"
        />
        <Image
          src="/images/home/logos/trustpilot-stars-4.svg"
          alt=""
          aria-hidden
          width={432}
          height={80}
          unoptimized
          className="h-auto w-[150px]"
        />
      </a>

      <a
        href={G2_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={badgeClass}
        aria-label={`Fruition Services on G2: rated ${G2_RATING} out of 5. Opens in a new tab.`}
      >
        <span className="flex items-center gap-1.5">
          <Image
            src="/images/home/logos/g2.svg"
            alt=""
            aria-hidden
            width={1000}
            height={1000}
            unoptimized
            className="size-[26px]"
          />
          <span className="text-[17px] leading-[22px] font-bold tracking-[-0.02em] text-foreground">
            Reviews
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[17px] leading-[22px] font-bold tracking-[-0.02em] text-foreground">
            {G2_RATING}
          </span>
          <Image
            src="/images/home/logos/g2-stars-5.svg"
            alt=""
            aria-hidden
            width={140}
            height={24}
            unoptimized
            className="h-auto w-[104px]"
          />
        </span>
      </a>
    </div>
  )
}
