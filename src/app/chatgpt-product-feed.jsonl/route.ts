import { vercelStegaClean } from "@vercel/stega"
import type { VcPageData } from "@/components/vc/types"
import { currency } from "@/lib/currency/kit"
import { getVcPage } from "@/sanity/vcQueries"
import { PAGE_PATH, PAGE_URL, SITE_URL } from "../implementation-packages/content"

/*
 * ChatGPT shopping product feed (OpenAI Agentic Commerce file format, JSONL,
 * https://developers.openai.com/commerce/specs/feed). Submitted with the
 * ChatGPT Merchants application on 2026-11-13.
 *
 * One row per fixed-price package on /implementation-packages, read from the
 * same Sanity page document the pricing page renders, so a price edited in
 * Studio changes here too. Rows without a price are left out, because `price`
 * is required. The standard OpenAI upload targets the US, so every price is
 * USD: AUD service prices go through the site's currency kit and its marketing
 * rounding, the same figure a US visitor sees on the page.
 */

export const revalidate = 3600

type Row = {
  item_id: string
  title: string
  description: string
  url: string
  brand: string
  seller_name: string
  seller_url: string
  image_url: string
  availability: "in_stock"
  price: string
  product_category: string
  is_eligible_search: true
}

const clean = (s?: string) => vercelStegaClean(s ?? "").replace(/\s+/g, " ").trim()
const slug = (s: string) => clean(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

/** "$2,500" / "US$2,500" -> USD 2500, "A$18,000" -> AUD 18000; bare "$" is USD (the packages are priced in USD). */
function parsePrice(raw?: string): { amount: number; code: "USD" | "AUD" } | null {
  const s = clean(raw)
  const amount = Number(s.replace(/[^0-9.]/g, ""))
  if (!amount) return null
  return { amount, code: /^A\$|AUD/i.test(s) ? "AUD" : "USD" }
}

function usd(raw?: string): string | null {
  const p = parsePrice(raw)
  if (!p) return null
  const value = p.code === "USD" ? p.amount : currency.roundMarketing(currency.convert(p.amount, "AUD", "USD"))
  return `${value.toFixed(2)} USD`
}

const image = (title: string) => `${SITE_URL}/og-card?title=${encodeURIComponent(title)}&v=1`

const BASE = {
  brand: "Fruition",
  seller_name: "Fruition Services",
  seller_url: SITE_URL,
  availability: "in_stock",
  is_eligible_search: true,
} as const

export function buildFeedRows(page: VcPageData): Row[] {
  const sections = page.sections ?? []
  const rows: Row[] = []

  const packages = sections.find((s) => s._type === "vcPriceCards" && clean(s.anchor) === "packages")
  for (const it of packages?._type === "vcPriceCards" ? packages.items ?? [] : []) {
    const name = clean(it.title)
    const price = usd(it.price)
    if (!name || !price) continue
    const monthly = /month/i.test(clean(it.unit))
    const title = `monday.com ${name} implementation package${monthly ? " (monthly)" : ""}`
    const description = [
      `Fixed-fee monday.com implementation package from Fruition Services, a monday.com Platinum Partner.`,
      clean(it.meta) && `Scope: ${clean(it.meta)}.`,
      clean(it.best) && `Best for ${clean(it.best).replace(/\.$/, "")}.`,
      ...(it.bullets ?? []).map((b) => clean(b)).filter(Boolean).map((b) => (/[.!?]$/.test(b) ? b : `${b}.`)),
      `Starting price ${monthly ? "per month" : "one-time"}; the final price is fixed before work starts.`,
    ]
      .filter(Boolean)
      .join(" ")
    rows.push({
      ...BASE,
      item_id: `monday-${slug(name)}`,
      title,
      description,
      url: `${PAGE_URL}#packages`,
      image_url: image(`monday.com ${name} package`),
      price,
      product_category: "Business Services > Software Consulting > monday.com Implementation",
    })
  }

  const services = sections.find((s) => s._type === "vcServices")
  for (const tab of services?._type === "vcServices" ? services.tabs ?? [] : []) {
    const label = clean(tab.label)
    if (/monday/i.test(label)) continue // the monday.com packages are the price cards above
    for (const r of tab.rows ?? []) {
      const name = clean(r.name)
      const price = usd(r.price)
      const href = clean(r.href)
      if (!name || !price || !href) continue
      const initial = /initial phase/i.test(clean(r.note))
      const title = initial ? `${name} (initial phase)` : name
      const description = [
        `${initial ? "Fixed-fee initial phase" : "Fixed-fee package"} from Fruition Services: ${name}.`,
        clean(tab.body),
        `Starting price; the final price is fixed before work starts.`,
      ]
        .filter(Boolean)
        .join(" ")
      rows.push({
        ...BASE,
        item_id: `${slug(label)}-${slug(name)}`,
        title,
        description,
        url: `${SITE_URL}${href.startsWith("/") ? href : `/${href}`}`,
        image_url: image(name),
        price,
        product_category: `Business Services > Consulting > ${label}`,
      })
    }
  }

  // item_id must be unique within the feed.
  const seen = new Set<string>()
  return rows.filter((r) => (seen.has(r.item_id) ? false : (seen.add(r.item_id), true)))
}

export async function GET(): Promise<Response> {
  const page = await getVcPage(PAGE_PATH)
  const rows = page ? buildFeedRows(page) : []
  if (!rows.length) return new Response("feed unavailable\n", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })
  return new Response(rows.map((r) => JSON.stringify(r)).join("\n") + "\n", {
    headers: {
      "Content-Type": "application/jsonl; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  })
}
