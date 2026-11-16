import "@/styles/vc/pages/monday-partner-us.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { locationHreflangAlternates } from "@/lib/metadata"

const PATH = "/monday-partner-us"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_US", languages: locationHreflangAlternates() })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-us" />
}
