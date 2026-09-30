"use client"

import { usePathname } from "next/navigation"
import Breadcrumbs from "./Breadcrumbs"
import GooglePreferredSourceButton from "./GooglePreferredSourceButton"
import SiteStickyCta from "./SiteStickyCta"
import WhatsAppChatLauncher from "./WhatsAppChatLauncher"
import { StickyCtaProvider } from "./sections/StickyCtaContext"
import type { StickyCtaValue } from "./sections/StickyCtaContext"

/**
 * Wraps the marketing site chrome. The internal portal (/internal) renders its
 * own shell (shadcn sidebar), so we hide the external nav, footer, cookie
 * banner — and the marketing <main> wrapper — on those routes.
 *
 * The floating sticky CTA is rendered here, once, so every marketing page gets
 * it without opting in. Pages that want their own copy declare it with
 * <StickyCtaConfig>; <SiteStickyCta> merges that over the Site Settings
 * default and owns the remaining route exclusions.
 *
 * The WhatsApp launcher is rendered here for the same reason, and inside the
 * same provider: it reads the sticky CTA bar's measured height from there so
 * the two floating elements never overlap.
 *
 * Google's preferred-source button sits above the footer on every content page
 * (blog and informational routes alike). The homepage is a sales page rather
 * than content, so it is left out, as is Sanity Studio.
 */

/** Path prefixes that never get Google's preferred-source button. */
const EXCLUDED_PREFIXES = ["/internal", "/studio"]

/**
 * Full-screen app surfaces that render their own header: the portal and the
 * Ask Fruit workspace (which also serves printable briefs). The marketing
 * /ask-fruit page keeps the normal chrome.
 */
const CHROMELESS_PREFIXES = ["/internal", "/ask-fruit/workspace"]

export default function SiteFrame({
  header,
  footer,
  cookie,
  stickyCtaHeading,
  stickyCtaDefaults,
  whatsappHref,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  cookie: React.ReactNode
  stickyCtaHeading?: string
  stickyCtaDefaults: StickyCtaValue
  /** Resolved by the root layout from Site Settings via `src/lib/whatsapp.ts`. */
  whatsappHref: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (CHROMELESS_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) {
    return <>{children}</>
  }

  const showPreferredSource =
    Boolean(pathname) &&
    pathname !== "/" &&
    !EXCLUDED_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`))

  return (
    <StickyCtaProvider>
      {header}
      <Breadcrumbs />
      <main>{children}</main>
      {showPreferredSource ? (
        <div className="mx-auto flex max-w-[1348px] justify-center px-5 py-8 md:px-8">
          <GooglePreferredSourceButton />
        </div>
      ) : null}
      {footer}
      {cookie}
      <SiteStickyCta heading={stickyCtaHeading} defaults={stickyCtaDefaults} />
      <WhatsAppChatLauncher href={whatsappHref} />
    </StickyCtaProvider>
  )
}
