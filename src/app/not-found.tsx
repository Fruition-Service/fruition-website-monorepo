import type { Metadata } from "next"
import Link from "next/link"
import { Home } from "lucide-react"
import CtaButton from "@/components/CtaButton"

export const metadata: Metadata = {
  title: "Page not found · Fruition Services",
  description:
    "The page you were looking for doesn't exist. Head back home or pick up one of our most-visited pages.",
}

const QUICK_LINKS = [
  { href: "/consulting-blog", label: "Consulting blog" },
  { href: "/implementation-packages", label: "Implementation packages" },
  { href: "/monday-implementation-consultants", label: "Consulting solutions" },
]

export default function NotFound() {
  return (
    <section className="relative flex min-h-[68vh] flex-col items-center justify-center overflow-hidden px-6 py-[clamp(4rem,12vw,8rem)] text-center">
      {/* Decorative purple glow behind the numeral */}
      <div
        aria-hidden="true"
        className="nf-glow pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[min(34rem,90vw)] w-[min(34rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(128,21,232,0.22) 0%, rgba(186,131,240,0.12) 42%, rgba(128,21,232,0) 72%)",
        }}
      />

      {/* Oversized decorative error code (not a heading) */}
      <p
        aria-hidden="true"
        className="nf-rise mb-2 select-none font-[var(--font-sans)] font-bold leading-none text-brand"
        style={{
          fontSize: "clamp(5.5rem, 16vw, 11rem)",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </p>

      <h1
        className="nf-rise text-section-h2 text-body"
        style={{ animationDelay: "80ms", textWrap: "balance" }}
      >
        We can&rsquo;t find that page.
      </h1>

      <p
        className="nf-rise text-body-lead mx-auto mt-4 max-w-[52ch] text-muted"
        style={{ animationDelay: "160ms", textWrap: "pretty" }}
      >
        The page may have moved, or the link was mistyped. Here&rsquo;s the way
        back.
      </p>

      <div
        className="nf-rise mt-9 flex flex-wrap items-center justify-center gap-4"
        style={{ animationDelay: "240ms" }}
      >
        <CtaButton href="/" label="Back to home" variant="primary" icon={<Home size={18} aria-hidden />} />
        <CtaButton href="/contact-us" label="Contact us" variant="outline" />
      </div>

      <div
        className="nf-rise mt-12 flex flex-col items-center gap-3"
        style={{ animationDelay: "320ms" }}
      >
        <span className="text-micro uppercase text-muted">
          Or try one of these
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {QUICK_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-[var(--border-ui)]">
                  ·
                </span>
              )}
              <Link
                href={link.href}
                className="text-body-sm font-medium text-brand transition-colors hover:text-[var(--purple-dark)] hover:underline"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {/* Recovery links for machine readers. A 404 that only says "not found"
          is a dead end for a crawler; naming the machine-readable indexes in
          plain text gives it somewhere to go next (ora.ai check
          agent-friendly-404). */}
      <div
        className="nf-rise mt-10 max-w-[62ch]"
        style={{ animationDelay: "400ms" }}
      >
        <p className="text-body-sm text-muted">
          Site index for AI agents:{" "}
          <a
            href="/llms.txt"
            className="font-medium text-brand hover:underline"
          >
            /llms.txt
          </a>
          . Full page list:{" "}
          <a
            href="/sitemap.xml"
            className="font-medium text-brand hover:underline"
          >
            /sitemap.xml
          </a>
          . Markdown copy of the homepage:{" "}
          <a
            href="/index.md"
            className="font-medium text-brand hover:underline"
          >
            /index.md
          </a>
          . Capabilities:{" "}
          <a
            href="/.well-known/agent-skills/index.json"
            className="font-medium text-brand hover:underline"
          >
            /.well-known/agent-skills/index.json
          </a>
          .
        </p>
      </div>
    </section>
  )
}
