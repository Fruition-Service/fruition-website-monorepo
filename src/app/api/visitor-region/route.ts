import { NextResponse } from "next/server"
import { detectRegion } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * The visitor's regional desk, for chrome that only runs in some markets.
 *
 * This exists as a request-time endpoint rather than a value read in the root
 * layout on purpose: `headers()` in the root layout opts EVERY route out of
 * static rendering (it did, once — 163 of 165 routes went `no-store` and TTFB
 * went to seconds). A page stays static and the one component that cares about
 * geography asks for it after hydration.
 *
 * `detectRegion` is the same resolver the booking form and the lead pipeline
 * use, so "South-East Asia" means one thing site-wide. It prefers Cloudflare's
 * `cf-ipcountry`; `tz` is the browser's own zone, which covers local dev and
 * the "XX"/"T1" placeholders Cloudflare sends for some networks. Anything it
 * can't place falls through to APAC, so an unknown visitor is never treated as
 * being in a region.
 */
export async function GET(req: Request) {
  const country = req.headers.get("cf-ipcountry") ?? undefined
  const tz = (new URL(req.url).searchParams.get("tz") ?? "").slice(0, 64)
  const region = detectRegion({ country, timezone: tz || undefined })
  return NextResponse.json(
    { region },
    // Per-visitor and never shared: a cached "SEA" served to Sydney would show
    // the launcher to the wrong half of the audience.
    { headers: { "cache-control": "private, no-store" } },
  )
}
