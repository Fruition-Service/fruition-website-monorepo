import type { Metadata } from "next"
import BookingSection, { type BookingRegion } from "@/components/sections/BookingSection"

/**
 * Local preview of the booking card, one copy per region.
 *
 * Every real placement detects the visitor's region from cf-ipcountry, which
 * means you can only ever see your own. This pins each card to a desk instead,
 * so all five can be reviewed side by side before the flow goes live.
 *
 * The region switch inside each card still works — pinning only sets where it
 * starts. Every card talks to the live Calendly account, so the slots are real,
 * but nothing is written anywhere until the details step is submitted.
 */
export const metadata: Metadata = {
  title: "Booking preview — all regions",
  robots: { index: false, follow: false },
}

const REGIONS: [BookingRegion, string, string][] = [
  ["APAC", "Australia & New Zealand", "Josh Jebathilak · books [Australia & New Zealand]"],
  ["SEA", "South-East Asia", "Nikki Glucksman · books [South-East Asia]"],
  ["IND", "India & UAE", "Nikhil Tiwari · books [India & UAE] — new event type"],
  ["UK", "UK & Europe", "Kevin Zhao · books [UK & Europe]"],
  ["NA", "US & Canada", "Zach Weller · books [US & Canada]"],
]

export default function ContactUsTestPage() {
  return (
    <main>
      <div className="px-6 py-10 md:px-12 lg:px-[72px]">
        <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
          Internal preview · not indexed
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Booking card, every region
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
          Each card below is pinned to one desk so you can see all five without changing your
          location. Availability is live from the shared Calendly account, and the region switch
          inside each card still works — pinning only decides where it starts. Nothing is recorded
          until you submit the details step.
        </p>
      </div>

      {REGIONS.map(([region, label, who]) => (
        <section key={region}>
          <div className="border-y border-[color:var(--color-border)] px-6 py-4 md:px-12 lg:px-[72px]">
            <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
              {region}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight">{label}</p>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{who}</p>
          </div>
          <BookingSection forceRegion={region} mode="consultant" />
        </section>
      ))}
    </main>
  )
}
