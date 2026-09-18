import Link from "next/link"
import { getPortalUser } from "@/lib/portalAuth"
import LoginScreen from "@/components/internal/LoginScreen"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

/**
 * What the portal shows when a URL under /internal doesn't resolve.
 *
 * Without this, an unmatched portal URL fell through to the marketing site's
 * 404 — which, to a signed-out colleague opening a link to a portal page, is
 * indistinguishable from the page being gone. So sign-in comes first: if
 * there's no session, this IS the login screen, because "you're not signed in"
 * is nearly always the real reason. Only a signed-in person, who genuinely can
 * see the portal, is told the page doesn't exist.
 */
export default async function InternalNotFound() {
  const user = await getPortalUser()
  if (!user) return <LoginScreen next="/internal" />

  return (
    <div className="portal-theme flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p aria-hidden className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        That page isn&apos;t here
      </h1>
      <p className="max-w-[46ch] text-sm text-muted-foreground">
        The link may be out of date, or whatever it pointed at has been deleted.
      </p>
      <Link href="/internal" className={cn(buttonVariants({ variant: "default" }), "mt-2")}>
        Back to the portal
      </Link>

      {/* A dead link usually means someone was heading somewhere specific.
          These are the three places they were most likely going. */}
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        {[
          { href: "/internal/blog", label: "Blog posts" },
          { href: "/internal/social", label: "Social posts" },
          { href: "/internal/insights", label: "Performance" },
        ].map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium text-[var(--purple-primary)] hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
