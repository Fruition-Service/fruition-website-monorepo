"use client"

import { usePathname } from "next/navigation"
import Breadcrumbs from "./Breadcrumbs"
import SiteStickyCta from "./SiteStickyCta"
import AskFruitLauncher from "./AskFruitLauncher"
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
 * The Implementation Calculator launcher is rendered here for the same reason, and inside the
 * same provider: it reads the sticky CTA bar's measured height from there so
 * the two floating elements never overlap.
 *
 * Google's preferred-source button lives in the footer, under the booking CTA
 * (see Footer.tsx), so pages no longer draw their own.
 */

/**
 * Full-screen app surfaces that render their own header: the portal and the
 * The Implementation Calculator workspace (which also serves printable briefs). The marketing
 * /ask-fruit page keeps the normal chrome.
 */
const CHROMELESS_PREFIXES = ["/internal", "/ask-fruit/workspace"]

export default function SiteFrame({
  header,
  footer,
  cookie,
  stickyCtaHeading,
  stickyCtaDefaults,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  cookie: React.ReactNode
  stickyCtaHeading?: string
  stickyCtaDefaults: StickyCtaValue
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (CHROMELESS_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) {
    return <>{children}</>
  }

  return (
    <StickyCtaProvider>
      {header}
      <Breadcrumbs />
      <main>{children}</main>
      {footer}
      {cookie}
      <SiteStickyCta heading={stickyCtaHeading} defaults={stickyCtaDefaults} />
      <AskFruitLauncher />
    </StickyCtaProvider>
  )
}
