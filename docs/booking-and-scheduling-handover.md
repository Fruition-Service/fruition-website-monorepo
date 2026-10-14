> **Status 2026-10-14:** partly out of date. The consultant picker is now ON (`BOOKING_MODE = "consultant"` in
> `src/components/sections/BookingSection.tsx`) over the shared global Calendly account. The
> self-iframe rule below still holds. Current flow: [architecture.md §8](architecture.md#8-integrations).

# Booking & scheduling — handover

_Last updated 2026-07-31._

Everything about how the site books consultations: what ships today, what the
custom scheduler is, why it isn't switched on, and the exact steps to finish it.

---

## 1. What ships today

**One booking surface, site-wide.** The dark purple band —
`src/components/sections/BookingSection.tsx` — is the only contact/scheduling
component on the site. Its right-hand white card contains **Calendly's own
inline widget** pointed at the account page
(`https://calendly.com/global-calendar-fruitionservices`), which lists the four
regional consultations.

How pages reach it:

```
page  →  CalendlySection (thin wrapper, sets eyebrow + default heading)
             → BookingSection (dark band + copy + white card)
                  → CalendlyEmbed (Calendly inline widget)
```

- `CalendlySection` is used by ~34 pages plus the Sanity page-builder
  `calendlyBlock`.
- `ContactSection` (/contact-us) and `monday-training` render `BookingSection`
  directly with their own copy.
- The homepage passes the redesign's copy through `CalendlySection`.

**Retired in the same pass:** the "Book your free 15-minute workflow audit"
`LeadForm`. It rendered on the same pages as the booking band and competed with
it. `leadFormEnabled` in `CroSections.tsx` is now hard-`false` regardless of the
Sanity flag — flip it back if the form is ever wanted again.

### The self-iframe trap (don't reintroduce this)

`src/lib/bookingLink.ts` exports `bookingHref()`, which rewrites **any**
Calendly URL to the on-site anchor `BOOKING_ANCHOR = "/contact-us#book"`. That's
correct for CTA *links* — buttons should scroll to the booking band, not leave
the site — and it's applied to Sanity values as they're loaded.

It is very wrong for an *embed*. Passing that value to Calendly's widget made
pages iframe themselves (`/implementation-packages` rendered the whole contact
page inside its own booking card). `CalendlyEmbed` therefore ignores anything
that isn't an absolute `calendly.com` URL and falls back to the account page.

**Rule:** the embed takes a real Calendly URL. `bookingHref()` output is for
`href`s only.

---

## 2. The custom scheduler — built, working, switched off

`BookingSection` still contains `BookingCard`, a bespoke three-step picker
(choose day/time → details → confirmed) backed by:

| Piece | Path |
| --- | --- |
| Availability | `src/app/api/scheduling/availability/route.ts` |
| Booking | `src/app/api/scheduling/book/route.ts` |
| Calendly wrapper | `src/lib/calendlyClient.ts` |
| Lead routing | `src/lib/leadNotify.ts` (`pushMeetingToMonday`) |

It reads live availability, books through Calendly's API, and records the lead
on the ILE board with status "Meeting Booked" — considerably better than the
embed, which captures leads only via the `invitee.created` webhook.

**To switch it back on:** in `BookingSection`, swap `<CalendlyEmbed …/>` back to
`<BookingCard duration={duration} askTeamSize={askTeamSize} calendlyUrl={calendlyUrl} />`
and restore the card's `padding: 30`. That single line is the whole toggle.

### Why it's off

Not because it's broken — it isn't. Because **which calendar it books against
is still wrong**, and that's a Calendly-side configuration problem.

---

## 3. The Calendly account, as it actually is

Verified against the API on 2026-07-31 using the `global-calendar@` PAT.

### The four public event types are one shared calendar

All four consultations on
`calendly.com/global-calendar-fruitionservices` are **solo** event types hosted
by a single account — `Fruition <global-calendar@fruitionservices.io>`. Not four
people. What differs is the working-hours schedule on each:

| Event type | Hours offered |
| --- | --- |
| [US & Canada] | 08:00–17:30 America/New_York |
| [UK & Europe] | 09:00–16:30 Europe/London |
| [South-East Asia] | Singapore business hours |
| [Australia & New Zealand] | Sydney business hours |

**This means availability reflects nobody's real calendar.** They offer a
near-flat 15–20 slots every weekday because the shared account has almost
nothing booked on it. A visitor can book over a consultant's real meeting.

### The collective duplicates

There are also three `collective` duplicates on secret `/d/…` links, hosted by
the shared account **plus** one real person each (APAC + Josh Jebathilak, UK +
Kevin Zhao, US + Zach Weller). Collective pooling only offers a slot when
*every* host is free, so these do real conflict checking — but the intersection
of two calendars is brutally thin, and one person's recurring commitment erases
a whole weekday:

| Event type | Mon | Tue | Wed | Thu | Fri | week total |
| --- | --- | --- | --- | --- | --- | --- |
| [AU & NZ] solo (public) | 19 | 20 | 20 | 20 | 20 | 99 |
| [SEA] solo (public) | 15 | 16 | 16 | 16 | 16 | 79 |
| [US & CA] solo (public) | 8 | 20 | 19 | 20 | 20 | 99 |
| [UK & EU] solo (public) | 15 | 15 | 15 | 16 | 16 | 77 |
| [APAC] collective | 4 | 4 | **0** | 5 | 7 | 20 |
| [US] collective | 6 | 3 | 1 | **0** | 9 | 19 |
| [UK] collective | 5 | 7 | 6 | 8 | 8 | 34 |

_(week of 3 Aug 2026, in SGT)_

`REGION_EVENT_TYPES` in `calendlyClient.ts` currently points at the **four
public solo types** — full weekday coverage, but no real conflict checking.

---

## 4. The fix: round-robin

Convert the three existing collective event types from **Collective** to
**Round Robin** — any one free host takes the booking instead of requiring all
of them. That keeps real conflict checking, removes the weekday holes, and
distributes calls across the team.

Do it in the Calendly UI (there is **no API** for assigning hosts —
`POST /event_type_memberships` returns 404), and it needs an **owner or admin**:

- **owner:** Josh Jebathilak
- **admin:** Kevin Zhao, Nikki Glucksman, Suzzane Castro
- `global-calendar@` is role `user` — it cannot manage teams (403 on `/groups`)

Steps:

1. On each `/d/…` event type, change host assignment Collective → Round Robin.
2. Add the real regional consultants as hosts.
3. Confirm each host has their calendar connected — this is what makes
   availability real.
4. Check the availability schedule still matches the region's business hours.
5. There is no `[SEA]` collective; either create one or leave SEA/IND on APAC.

**Converting in place keeps the UUIDs**, so the code change is just repointing
`REGION_EVENT_TYPES` back to them. Avoid recreating the four public solo types
as team events — a user-owned solo event can't become a team event, so you'd get
new UUIDs and new public links.

Afterwards, availability per weekday per region can be verified from the API in
about a minute.

---

## 5. Bugs already fixed in the scheduler

These are committed and apply the moment `BookingCard` is switched back on.

1. **14-day horizon** — `getAvailableSlots` fetched two 7-day windows, so the
   picker went dark 14 days out and the rest of the month looked fully booked.
   Now six windows (~42 days) via `WINDOW_DAYS` / `HORIZON_WINDOWS`.
2. **Opened on an empty month** — `monthOffset` started at the current month
   regardless of availability, so on 31 July it opened on a fully greyed July.
   Now derived from the first bookable day, with a manual override once the
   visitor pages with the arrows.
3. **Region drift** — `/availability` derives the region from the country header
   alone, `/book` from country *and* timezone, and the client sent neither. Where
   `cf-ipcountry` is absent (local dev, VPNs, `XX`/`T1`) the two disagreed: APAC
   slots booked against the SEA event type, Calendly rejected it, and the client
   silently fell back to opening Calendly. The client now echoes the region the
   slots came from; `/book` already prefers a supplied region.

### Calendly API notes

- `POST /invitees` **works** and is authorised by this PAT. Verified: a past
  `start_time` returns _"start_time must be in the future"_; a real slot with a
  malformed email returns _"invitee.email is in invalid format"_.
- A misleading error to know: booking an **unavailable** slot returns
  _"Specified location kind is not configured for this event type"_. It is not
  about location — the slot simply isn't bookable.
- Calendly rejects the default Python `urllib` User-Agent with 403. Send a
  browser/curl UA when scripting against it.
- `CALENDLY_API_TOKEN` lives in `.dev.vars` and `.env.local` locally, and as a
  Worker secret in production.

---

## 6. Not yet verified

**No real end-to-end booking has been completed.** Every probe stopped short on
purpose, because completing one puts a real meeting on a real calendar and sends
an invite. The region fix is verified up to the request payload, not through to
a created event. Book one real slot and delete it before trusting the API path.

Also unconfirmed: the account has `-gotopartners` duplicates of the US and UK
event types. The current mapping picks the non-partner ones by name and
availability — worth a test booking to confirm it lands where expected.

---

## 7. Quick reference

| Want to… | Do this |
| --- | --- |
| Switch the custom picker back on | Swap `<CalendlyEmbed/>` → `<BookingCard/>` in `BookingSection` |
| Change which calendar a region books | `REGION_EVENT_TYPES` in `src/lib/calendlyClient.ts` |
| Change how far ahead slots are offered | `HORIZON_WINDOWS` in `calendlyClient.ts` |
| Change the booking heading on a page | The `heading` prop on `CalendlySection` |
| Bring back the workflow-audit form | `leadFormEnabled` in `CroSections.tsx` |
| Point CTA buttons somewhere else | `BOOKING_ANCHOR` in `src/lib/bookingLink.ts` |
