/** Structured data for the use case pages. `<` is escaped so copy cannot close the script. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
