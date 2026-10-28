interface CatalogCtaProps {
  calendlyUrl: string
}

export default function CatalogCta({ calendlyUrl }: CatalogCtaProps) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-5 md:px-7 py-16 lg:py-20">
        <div
          className="rounded-[var(--radius-card)] px-6 py-10 md:px-10 lg:px-14 lg:py-14 text-center text-white shadow-card"
          style={{
            background:
              "linear-gradient(135deg, var(--purple-dark) 0%, var(--purple-primary) 60%, var(--purple-light) 100%)",
          }}
        >
          <h2 className="text-2xl md:text-section-h2 text-white">
            The 2026 catalog keeps growing every quarter.
          </h2>
          <p className="text-body-lead mt-4 max-w-[640px] mx-auto text-white/85">
            If a client need does not match a template above, it usually becomes next quarter&rsquo;s
            solution. Ask about the ones we are pressure-testing right now.
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-cta-btn ui-cta-btn-primary mt-8 inline-flex"
          >
            Talk to Fruition <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
