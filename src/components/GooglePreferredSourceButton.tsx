/** The domain Google lists as the preferred source. */
const PREFERRED_SOURCE_URL = "https://www.google.com/preferences/source?q=fruitionservices.io"

/**
 * "Add as a preferred source" link to Google's source preferences tool.
 *
 * Google's official deeplink, not its publisher.js widget: the widget draws a
 * fixed, coloured button inside a shadow root that our CSS cannot reach, and
 * costs about 350 kB of script. This is a plain outline button in the footer's
 * own style (`.vcf .btn.ghost` in src/styles/vc/chrome.css) with a one-colour
 * Google mark, and it works without JavaScript.
 * https://developers.google.com/search/docs/appearance/preferred-sources#deeplink-implementation
 */
export default function GooglePreferredSourceButton() {
  return (
    <a
      href={PREFERRED_SOURCE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="btn ghost sm"
      data-cta-variant="secondary"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
      Add as preferred source
    </a>
  )
}
