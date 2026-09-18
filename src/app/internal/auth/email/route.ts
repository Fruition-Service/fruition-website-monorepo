import { NextResponse } from "next/server"
import { getPortalClient, isAllowedEmail } from "@/lib/portalAuth"

export const runtime = "nodejs"

/**
 * Email magic-link sign-in. Validates the address against the
 * @fruitionservices.io Workspace domain, then sends a Supabase OTP email. The
 * email template links to /internal/auth/confirm (token-hash flow), which
 * verifies the OTP, re-checks the domain, and mints the session. `next` is
 * kept for the error-redirect back to the login form; the magic link itself
 * lands on the portal home.
 */
export async function POST(req: Request) {
  const origin = new URL(req.url).origin
  const form = await req.formData()
  const email = String(form.get("email") ?? "").trim().toLowerCase()
  const nextParam = String(form.get("next") ?? "")
  const next = nextParam.startsWith("/") ? nextParam : "/internal"

  const back = (params: Record<string, string>) => {
    const qs = new URLSearchParams({ ...params, next }).toString()
    return NextResponse.redirect(new URL(`/internal/login?${qs}`, origin), { status: 303 })
  }

  if (!isAllowedEmail(email)) {
    return back({ error: "Use your @fruitionservices.io email address" })
  }

  const supabase = await getPortalClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Used as {{ .RedirectTo }} / fallback; the template's token-hash link to
      // /internal/auth/confirm is what actually completes sign-in.
      emailRedirectTo: `${origin}/internal`,
      shouldCreateUser: true,
    },
  })

  if (error) {
    return back({ error: error.message })
  }

  return back({ sent: email })
}
