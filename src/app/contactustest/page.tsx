import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getSiteSettings } from "@/sanity/queries"
import BookingSection, { type BookingRegion } from "@/components/sections/BookingSection"
import V1ContactSection, { type ContactOffice } from "./versions/v1-contact-section"
import V2Scheduler from "./versions/v2-scheduler"
import V2ContactFormCard from "./versions/v2-contact-form-card"
import V3BookingSection from "./versions/v3-booking-section"
import V4BookingSection from "./versions/v4-booking-section"
import V5BookingSection from "./versions/v5-booking-section"
import V6BookingSection from "./versions/v6-booking-section"

/**
 * Every version of the contact + booking surface, running, on one page.
 *
 * The component people meet before they talk to us has been rebuilt six times
 * since June, and each rebuild replaced the last — so the only record of what
 * it used to be was a diff. Each section below is the real component from that
 * date, restored from the commit that shipped it (see ./versions), rendered and
 * clickable rather than screenshotted.
 *
 * What is faithful: the markup, the layout, the copy and the behaviour of each
 * version. What is not: the snapshots share today's global stylesheet, design
 * tokens and fonts, because they render inside the current site — so a change
 * that lived in globals.css rather than in the component shows up everywhere
 * here. They also read availability from the live endpoint, so the times on a
 * June card are the times we could offer this week.
 *
 * No archived card can write to us: every POST in the snapshots is routed
 * through previewWrite, so no lead reaches the CRM board and no enquiry reaches
 * the inbox however far someone clicks. The exception, called out on the page,
 * is the Calendly embed the later versions hand over to at their last step —
 * that iframe is the real calendar, and keeping it is the price of showing the
 * step as it was. The live section at the end behaves like every other page.
 */
export const metadata: Metadata = {
  title: "Contact & booking — every iteration",
  robots: { index: false, follow: false },
}

const REPO = "https://github.com/Fruition-Service/fruition-website-monorepo"

interface Iteration {
  id: string
  n: string
  date: string
  title: string
  /** What changed, and why it was worth changing. */
  note: string
  sha: string
  pr?: number[]
}

const ITERATIONS: Iteration[] = [
  {
    id: "v1",
    n: "01",
    date: "4 June 2026",
    title: "A page you write to",
    note:
      "The first contact surface: a hero, the dotted world map with a pin per office, the office band, and a message form. Booking a call meant sending a message and waiting for a reply — there was no calendar anywhere on the site.",
    sha: "8b7a29d",
  },
  {
    id: "v2",
    n: "02",
    date: "29 July 2026",
    title: "Our own slot picker, beside the form",
    note:
      "Calendly's iframe came out and a branded day-and-time grid went in, reading real availability from the regional event type and booking through Calendly's API — with the slot's own Calendly page as the fallback if that call failed. The message form moved into a shared card so /monday-training could reuse it. Two separate things on the page: pick a time, or write to us.",
    sha: "6c66013",
    pr: [83],
  },
  {
    id: "v3",
    n: "03",
    date: "29 July 2026",
    title: "One surface instead of two",
    note:
      "Picker and form folded into a single dark band: choose a slot, then give your details, then confirm. One component everywhere, with only the tagline changing per page — CalendlySection became a thin wrapper so all the existing placements upgraded where they stood.",
    sha: "a589fcd",
    pr: [86],
  },
  {
    id: "v4",
    n: "04",
    date: "15 August 2026",
    title: "A face on the card",
    note:
      "The visitor's region (from Cloudflare's cf-ipcountry) started choosing the consultant, and the card led with their photo and role. Details were captured before the Calendly hand-off, so someone who abandoned half-way was still a lead we knew about, and the availability horizon went from 14 days to about 42.",
    sha: "69d20e7",
    pr: [120],
  },
  {
    id: "v5",
    n: "05",
    date: "31 August 2026",
    title: "Two modes, one band",
    note:
      "A global mode that drops Calendly's own embed into the white card, for while regional routing was still being settled. The first attempt swapped the whole section and lost the brand band, the copy column, the proof strap and the office line; this one swaps only the card. Meeting times also started showing in the consultant's timezone, not just the visitor's.",
    sha: "85a620e",
    pr: [155, 156],
  },
  {
    id: "v6",
    n: "06",
    date: "10 September 2026",
    title: "The shared regional calendar",
    note:
      "Bookings moved off personal links onto the shared account's regional event types, and a page can now pin a desk instead of detecting one. Shipped once, reverted the same day, then reapplied. The “we detected your region and timezone” line went at the same time: it read as surveillance, and the two dropdowns directly under it already said the same thing.",
    sha: "c03a5da",
    pr: [180, 181, 201],
  },
]

const REGIONS: [BookingRegion, string, string][] = [
  ["APAC", "Australia & New Zealand", "books the [Australia & New Zealand] calendar"],
  ["SEA", "South-East Asia", "books the [South-East Asia] calendar"],
  ["IND", "India & UAE", "books the [India & UAE] calendar"],
  ["UK", "UK & Europe", "books the [UK & Europe] calendar"],
  ["NA", "US & Canada", "books the [US & Canada] calendar"],
]

function Band({ it }: { it: Iteration }) {
  return (
    <div
      id={it.id}
      className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-6 md:px-12 lg:px-[72px]"
      style={{ scrollMarginTop: 80 }}
    >
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
          {it.n}
        </span>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{it.title}</h2>
        <span className="text-sm text-[color:var(--color-text-secondary)]">{it.date}</span>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
        {it.note}
      </p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
        <a
          className="underline underline-offset-4 hover:text-[color:var(--purple-primary)]"
          href={`${REPO}/commit/${it.sha}`}
          target="_blank"
          rel="noreferrer"
        >
          {it.sha}
        </a>
        {(it.pr ?? []).map((n) => (
          <a
            key={n}
            className="underline underline-offset-4 hover:text-[color:var(--purple-primary)]"
            href={`${REPO}/pull/${n}`}
            target="_blank"
            rel="noreferrer"
          >
            #{n}
          </a>
        ))}
      </p>
    </div>
  )
}

function Snapshot({ it, children }: { it: Iteration; children: ReactNode }) {
  return (
    <section>
      <Band it={it} />
      {children}
    </section>
  )
}

interface RawOffice {
  city?: string
  country?: string
  flag?: string
  label?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

export default async function ContactUsTestPage() {
  // The June page read its offices from the CMS, so this one does too rather
  // than hard-coding a list that would quietly rot. It means the oldest
  // snapshot shows today's offices — the component is the artefact here, not
  // the data it was pointed at.
  const siteSettings = await getSiteSettings()
  const offices: ContactOffice[] = ((siteSettings?.offices as RawOffice[] | undefined) ?? [])
    .filter((o) => o?.city)
    .map((o) => ({
      city: o.city!,
      country: o.country,
      flag: o.flag,
      label: o.label,
      address: o.address,
      addressUrl: o.addressUrl,
      phone: o.phone,
      phoneTel: o.phoneTel,
    }))
  const supportEmail = siteSettings?.contactEmail || "support@fruitionservices.io"

  const byId = Object.fromEntries(ITERATIONS.map((i) => [i.id, i])) as Record<string, Iteration>

  return (
    <main>
      <div className="px-6 py-10 md:px-12 lg:px-[72px]">
        <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
          Internal preview · not indexed
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Contact &amp; booking, every iteration
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
          Six rebuilds since June, each one replacing the last, so the only record of what the
          component used to be was a diff. Every section below is the real code from the commit
          that shipped it, restored and running — click through them, they work. Availability is
          live, which is why a June card offers this week&rsquo;s times.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          Two things to keep in mind. No archived card can write to us: every message and every
          details step is intercepted, so nothing reaches the CRM board or the inbox no matter how
          far you click. The one live thing inside them is the Calendly embed the later versions
          hand over to at the last step — that is the real calendar, so don&rsquo;t press
          &ldquo;Schedule Event&rdquo; on it. And the snapshots borrow today&rsquo;s stylesheet,
          tokens and fonts, so anything that changed in{" "}
          <span className="font-mono">globals.css</span> rather than in the component itself has
          already reached all of them.
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          {ITERATIONS.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="underline underline-offset-4 hover:text-[color:var(--purple-primary)]"
            >
              {it.n} · {it.title}
            </a>
          ))}
          <a
            href="#today"
            className="underline underline-offset-4 hover:text-[color:var(--purple-primary)]"
          >
            07 · Today
          </a>
        </nav>
      </div>

      <Snapshot it={byId.v1}>
        <V1ContactSection
          offices={offices}
          salesEmail="contact@fruitionservices.io"
          supportEmail={supportEmail}
          phone={offices.find((o) => o.phone)?.phone}
          phoneTel={offices.find((o) => o.phoneTel)?.phoneTel}
        />
      </Snapshot>

      <Snapshot it={byId.v2}>
        <V2Scheduler />
        <V2ContactFormCard />
      </Snapshot>

      <Snapshot it={byId.v3}>
        <V3BookingSection />
      </Snapshot>

      <Snapshot it={byId.v4}>
        <V4BookingSection />
      </Snapshot>

      <Snapshot it={byId.v5}>
        <V5BookingSection />
      </Snapshot>

      <Snapshot it={byId.v6}>
        <V6BookingSection />
      </Snapshot>

      <section>
        <div
          id="today"
          className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-6 md:px-12 lg:px-[72px]"
          style={{ scrollMarginTop: 80 }}
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
              07
            </span>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              Today — the desk&rsquo;s flag, one card per region
            </h2>
            <span className="text-sm text-[color:var(--color-text-secondary)]">
              11 September 2026
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            The consultant&rsquo;s photo and name came off the card: the shared calendar hands the
            meeting to whoever covers that desk, so naming one person promised something the
            round-robin doesn&rsquo;t always keep. A circle-cropped country flag took its place —
            inline SVG, because flag emoji degrade to two bare letters on Windows — and the card now
            reads &ldquo;with a consultant in Australia&rdquo;, which is the question people actually
            ask. On the regional pages this band also moved up to third.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            This one is live, and every real placement detects your region from cf-ipcountry — so
            you can only ever see your own desk. The five copies below are each pinned to one
            region instead. The region switch inside a card still works; pinning only decides where
            it starts. Unlike the archived sections above, this is the production component: the
            details step does write.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            <a
              className="underline underline-offset-4 hover:text-[color:var(--purple-primary)]"
              href={`${REPO}/pull/205`}
              target="_blank"
              rel="noreferrer"
            >
              #205
            </a>
            <a
              className="underline underline-offset-4 hover:text-[color:var(--purple-primary)]"
              href={`${REPO}/pull/206`}
              target="_blank"
              rel="noreferrer"
            >
              #206
            </a>
          </p>
        </div>

        {REGIONS.map(([region, label, who]) => (
          <div key={region}>
            <div className="border-b border-[color:var(--color-border)] px-6 py-4 md:px-12 lg:px-[72px]">
              <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
                {region}
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">{label}</p>
              <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{who}</p>
            </div>
            <BookingSection forceRegion={region} mode="consultant" />
          </div>
        ))}
      </section>
    </main>
  )
}
