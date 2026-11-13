"use client"

import { vercelStegaClean } from "@vercel/stega"
import { currency, type CurrencyCode } from "@/lib/currency/kit"
import { useDisplayCurrency } from "@/lib/currency/client"

/**
 * A price in the visitor's display currency.
 *
 * Pass either `amount` + `currency`, or `value` (a Sanity string such as
 * "A$18,000" or "$2,500") with `base` naming what a bare "$" means. The static
 * HTML renders the canonical figure exactly as written (crawlers and JSON-LD
 * keep the real currency); after hydration it shows the converted, rounded
 * figure. Anything that is not a price ("On request") renders unchanged.
 */
export default function Price({
  value,
  amount,
  currency: from,
  base,
  className,
}: {
  value?: string
  amount?: number
  currency?: CurrencyCode
  base?: CurrencyCode
  className?: string
}) {
  const shown = useDisplayCurrency()
  const parsed =
    typeof amount === "number" && from
      ? { amount, currency: from }
      : currency.parse(vercelStegaClean(value ?? ""), base ?? null)
  const canonical = value ?? (parsed ? currency.format(parsed.amount, parsed.currency) : "")
  if (!parsed) return <>{canonical}</>
  let text = canonical
  if (shown && shown.code !== parsed.currency) {
    text =
      value !== undefined
        ? currency.convertText(vercelStegaClean(value), shown.code, base ?? null) ?? canonical
        : currency.display(parsed.amount, parsed.currency, shown.code)
  }
  return (
    <span data-price="" data-price-amount={parsed.amount} data-price-currency={parsed.currency} className={className}>
      {text}
    </span>
  )
}
