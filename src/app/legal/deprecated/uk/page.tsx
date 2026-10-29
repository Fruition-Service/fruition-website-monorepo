import { buildOgMetadata } from "@/lib/metadata"

const oldPdfUrl = "/fruition-service-agreement-uk-deprecated.pdf"
const newPageUrl = "/legal/services-agreement-uk"

export async function generateMetadata() {
  const title = "Service Agreement UK (Deprecated) | Fruition Services"
  const description = "This service agreement has been superseded. See the current UK service agreement."
  return {
    title,
    description,
    alternates: { canonical: "/legal/deprecated/uk" },
    // Superseded agreement: keep it out of the index, same as /studio.
    robots: { index: false, follow: false },
    ...buildOgMetadata({ title, description, path: "/legal/deprecated/uk" }),
  }
}

export default function DeprecatedAgreementUkPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 p-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700">
          Deprecated
        </p>
        <h1 className="mb-2 text-2xl font-bold text-amber-900">
          This service agreement has been superseded
        </h1>
        <p className="mb-4 text-amber-800">
          You are viewing a deprecated version of the UK service agreement. The
          current version is available below.
        </p>
        <a
          href={newPageUrl}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          See current Service Agreement UK →
        </a>
      </div>

      <section className="rounded-lg border border-ui bg-white">
        <iframe
          src={oldPdfUrl}
          className="h-[80vh] w-full"
          title="Fruition Services Agreement UK (Deprecated)"
        />
      </section>
    </main>
  )
}
