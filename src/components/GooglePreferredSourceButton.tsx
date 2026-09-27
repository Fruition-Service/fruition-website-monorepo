/**
 * Google's "add as a preferred source" button. publisher.js (loaded once in the
 * root layout) finds this placeholder and swaps in its own localised, Google-styled
 * button, so we render the bare attribute and nothing else.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export default function GooglePreferredSourceButton({
  theme = "light",
  className,
}: {
  theme?: "light" | "dark"
  className?: string
}) {
  // Not a known DOM attribute, so TypeScript rejects it written inline.
  const attrs = { "google-add-preferred-source-btn": "" }
  return <div className={className} data-theme={theme} {...attrs} />
}
