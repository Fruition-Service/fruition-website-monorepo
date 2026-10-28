import Link from "next/link"
import { Phone } from "lucide-react"
import Reveal from "./Reveal"
import { homeText, type HomeCopy, type HomeCopySlot } from "./copy"

export interface Office {
  _key?: string
  city?: string
  flag?: string
  label?: string
  phone?: string
  phoneTel?: string
  href?: string
}

/** Display country per flag — `siteSettings.offices` has no country field. */
const COUNTRY: Record<string, HomeCopySlot> = {
  "🇦🇺": "where-country-au",
  "🇸🇬": "where-country-sg",
  "🇵🇭": "where-country-ph",
  "🇮🇳": "where-country-in",
  "🇬🇧": "where-country-uk",
  "🇺🇸": "where-country-us",
}

/** The design's column order, west-to-east from the Sydney HQ. */
const ORDER = ["🇦🇺", "🇸🇬", "🇵🇭", "🇮🇳", "🇬🇧", "🇺🇸"]

interface Props {
  offices: Office[]
  copy: HomeCopy
}

export default function WhereWeWork({ offices, copy }: Props) {
  const columns = offices
    .filter((office) => office.flag && COUNTRY[office.flag])
    .sort((a, b) => ORDER.indexOf(a.flag!) - ORDER.indexOf(b.flag!))
    .map((office) => {
      // `city` is stored as "Sydney, Australia" / "New York, US Office".
      const place = (office.city ?? "").split(",")[0].trim()
      const isHq = /head office/i.test(office.label ?? "")
      const country = homeText(copy, COUNTRY[office.flag!])
      // Offices without a city yet store the country as their `city`, which
      // would render "India / India" — drop the second line in that case.
      const cityLine = place && place !== country ? place : ""
      return {
        key: office._key ?? office.flag!,
        flag: office.flag!,
        country,
        place: cityLine && isHq ? `${cityLine} HQ` : cityLine,
        phone: office.phone,
        phoneTel: office.phoneTel,
        href: office.href && office.href !== "#" ? office.href : undefined,
      }
    })

  if (columns.length === 0) return null

  return (
    <section id="markets" className="scroll-mt-24 bg-tint py-16 md:py-20 lg:pt-25 lg:pb-26">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-12">
          <div className="max-w-[620px]">
            <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">
              {homeText(copy, "where-eyebrow")}
            </p>
            <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[40px]">
              {homeText(copy, "where-heading")}
            </h2>
          </div>
          <p className="text-body-sm max-w-[340px] flex-none text-muted lg:pb-1 lg:text-[15.5px]">
            {homeText(copy, "where-lead")}
          </p>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-lilac-quiet pt-8 sm:grid-cols-3 lg:mt-12 lg:grid-cols-6 lg:gap-x-11">
          {columns.map((col) => (
            <div key={col.key} className="flex flex-col gap-2.5">
              <span className="text-3xl leading-none">{col.flag}</span>
              {col.href ? (
                <Link
                  href={col.href}
                  className="mt-0.5 text-[16.5px] font-semibold text-foreground hover:text-brand"
                >
                  {col.country}
                </Link>
              ) : (
                <span className="mt-0.5 text-[16.5px] font-semibold text-foreground">
                  {col.country}
                </span>
              )}
              {col.place && <span className="text-[13.5px] text-muted">{col.place}</span>}
              {col.phoneTel && col.phone && (
                <a
                  href={`tel:${col.phoneTel}`}
                  className="inline-flex items-center gap-[7px] text-[13.5px] font-medium whitespace-nowrap text-brand hover:text-[color:var(--blue-press)]"
                >
                  <Phone size={13} className="flex-none" aria-hidden strokeWidth={2} />
                  {col.phone}
                </a>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
