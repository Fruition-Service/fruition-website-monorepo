# Display currency

Every price on the site shows in one display currency, picked per visitor.

- **Detection:** first visit asks `/api/visitor-region` for the Cloudflare country (falls back to the
  browser time zone, then USD). AUD, USD, GBP, EUR, SGD, NZD, INR, AED, CAD.
- **Switcher:** the site footer (`src/components/currency/CurrencySwitcher.tsx`, styles in
  `src/styles/vc/chrome.css` `.vcf .cur`), designed in Claude Design ("Footer currency switcher").
  The choice is stored in `localStorage["fruition-currency"]` and wins everywhere.
- **Ad landing pages** (`src/app/{au,uk,us,sea}`) get the same runtime as an inline script plus a
  footer control (`src/lib/currency/inline.ts`), defaulting to their own market (AU AUD, UK GBP,
  US USD, SEA SGD) unless the visitor picked a currency. Only pages with an explicit price get it.

## Rules for prices in code and Sanity

- Store prices once, in their real currency, written explicitly: `A$18,000`, `US$2,500`,
  `AUD $24,500`, `£14,500`. Explicit figures convert anywhere on the site.
- A bare `$2,500` converts only on pages listed in `src/lib/currency/pageBase.ts` (it says what `$`
  means there). Elsewhere it is left alone, because it may be a client's outcome in any currency.
- Structured prices render through `<Price value="A$18,000" />` (`src/components/currency/Price.tsx`).
  Prices inside copy are converted by the text converter (`src/lib/currency/dom.ts`).
- Not converted: anything inside `data-currency-skip` (case studies, regional fixed-fee lists),
  figures with a k/M/B suffix (outcomes), text listing three or more currencies (a regional price
  list), `/internal`, `/studio`, and the inline editor.
- JSON-LD and metadata keep the canonical currency. The static HTML always shows the canonical
  figure, so pages stay statically rendered and crawlers see the real price.

## Rates

`RATES_PER_USD` in `src/lib/currency/kit.ts` is a fixed, checked-in table (no FX call at request
time). Update it and `RATES_AS_OF` together by hand. Converted figures round **up** to a clean step
(100 under 10,000, 500 under 100,000, 5,000 under 1,000,000), so a converted price is never below
the real one.

`createCurrencyKit` and `mountCurrency` must stay self-contained (no outside references): the ad
pages inline them with `String(fn)`. The test suite checks that.
