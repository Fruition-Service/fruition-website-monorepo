import type { CurrencyCode } from "./kit"

/**
 * What a bare "$" means on a page, for the pages whose copy writes prices
 * without a currency marker ("from $2,500"). Rendered as data-price-base on the
 * page root, so both <Price/> fallbacks and the text converter read it. Pages
 * not listed here never convert a bare "$" (it might be a client's outcome in
 * any currency); explicit figures such as "A$18,000" convert everywhere.
 */
export const PAGE_PRICE_BASE: Record<string, CurrencyCode> = {
  "/implementation-packages": "USD",
}
