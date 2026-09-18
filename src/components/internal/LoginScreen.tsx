import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * The portal sign-in screen.
 *
 * Lives here rather than inside the login route because two places need it:
 * /internal/login itself, and the portal's not-found page — a signed-out
 * person who lands on any portal URL should be asked to sign in, not shown
 * the marketing site's 404.
 */

// Light-only: dark mode is disabled site-wide, so always use the light
// panel image and logo.
const scopedStyles = `
  .login-bg {
    background-image: url('/images/login-bg-light.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .portal-logo-dark { display: none; }
`

export default function LoginScreen({
  next: requested,
  error,
  notice,
  sent,
}: {
  /** Where to land after signing in. Ignored unless it's a local path. */
  next?: string
  error?: string
  notice?: string
  /** The address a link was just sent to — swaps the form for the wait state. */
  sent?: string
}) {
  const next = requested && requested.startsWith("/") ? requested : "/internal"
  const startHref = `/internal/auth/start?next=${encodeURIComponent(next)}`

  return (
    <div className="portal-theme relative min-h-screen w-full bg-background lg:grid lg:grid-cols-2">
      <style dangerouslySetInnerHTML={{ __html: scopedStyles }} />

      {/* Back to site — top-right corner */}
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 z-30 text-foreground lg:right-8 lg:top-8",
        )}
      >
        Back to site
      </Link>

      {/* Left brand panel */}
      <div className="relative hidden h-full flex-col justify-between overflow-hidden p-10 text-white lg:flex">
        <div className="login-bg absolute inset-0" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75"
          aria-hidden
        />
        <div className="relative z-20">
          <Image
            src="/images/logo-fruition-white.svg"
            alt="Fruition"
            width={148}
            height={34}
            className="h-8 w-auto"
            priority
          />
        </div>
        <blockquote className="relative z-20 space-y-3">
          <p className="text-lg leading-relaxed">
            &ldquo;Fruition turns monday.com into the system that runs our
            business — sales, projects, and operations finally live in one
            place.&rdquo;
          </p>
          <footer className="text-sm text-white/70">The Fruition Team</footer>
        </blockquote>
      </div>

      {/* Right form panel */}
      <div className="flex min-h-screen items-center justify-center p-6 lg:min-h-0 lg:p-8">
        <div className="mx-auto flex w-full max-w-[360px] flex-col justify-center space-y-6">
          {/* Logo above the form (visible where the brand panel is hidden) */}
          <div className="flex justify-center lg:hidden">
            <Image
              src="/images/logo-fruition-black.svg"
              alt="Fruition"
              width={148}
              height={34}
              className="portal-logo-light h-8 w-auto"
            />
            <Image
              src="/images/logo-fruition-white.svg"
              alt="Fruition"
              width={148}
              height={34}
              className="portal-logo-dark h-8 w-auto"
            />
          </div>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Sign in to Fruition Internal
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your Fruition email below to sign in to your account
            </p>
          </div>

          {error && (
            <div
              className="rounded-md px-3 py-2 text-sm"
              style={{
                backgroundColor: "var(--danger-surface)",
                color: "var(--danger-strong)",
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              className="rounded-md border bg-muted px-3 py-2 text-sm text-foreground"
              role="status"
            >
              {notice}
            </div>
          )}

          {sent ? (
            <div className="grid gap-5">
              <div className="flex size-11 items-center justify-center rounded-chip bg-[var(--purple-primary)]/10">
                <Mail className="size-5 text-[var(--purple-primary)]" />
              </div>
              <div className="grid gap-1.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Check your inbox
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A sign-in link is on its way to{" "}
                  <span className="font-medium text-foreground">{sent}</span>. It works once.
                </p>
              </div>
              <div className="grid gap-1.5 rounded-chip bg-muted px-3 py-2.5">
                <p className="text-xs font-medium text-foreground">Nothing arrived?</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Check spam, then send another. A link older than an hour stops working and drops
                  you back here without saying why.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href={`/internal/login?next=${encodeURIComponent(next)}`}
                  className={cn(buttonVariants({ variant: "outline" }), "h-11 text-sm")}
                >
                  Use a different address
                </a>
                <form action="/internal/auth/email" method="post">
                  <input type="hidden" name="next" value={next} />
                  <input type="hidden" name="email" value={sent} />
                  <button
                    type="submit"
                    className={cn(buttonVariants({ variant: "default" }), "h-11 w-full text-sm")}
                  >
                    Send another
                  </button>
                </form>
              </div>
            </div>
          ) : (
          <div className="grid gap-6">
            {/* Email magic-link */}
            <form action="/internal/auth/email" method="post" className="grid gap-2">
              <input type="hidden" name="next" value={next} />
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@fruitionservices.io"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                className="h-11 text-sm"
              />
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 w-full text-sm font-medium",
                )}
              >
                Sign In with Email
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google SSO */}
            <a
              href={startHref}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 w-full gap-3 text-sm font-medium",
              )}
            >
              <GoogleGlyph />
              Google
            </a>
          </div>
          )}

          <p className="px-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/data-privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}
