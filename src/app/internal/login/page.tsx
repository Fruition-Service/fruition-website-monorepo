import LoginScreen from "@/components/internal/LoginScreen"

interface SearchParams {
  next?: string
  error?: string
  notice?: string
  /** Set to the address a sign-in link was just sent to. */
  sent?: string
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  return <LoginScreen next={sp.next} error={sp.error} notice={sp.notice} sent={sp.sent} />
}
