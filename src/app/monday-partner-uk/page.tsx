import "@/styles/vc/pages/monday-partner-uk.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { locationHreflangAlternates } from "@/lib/metadata"

const PATH = "/monday-partner-uk"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_GB", languages: locationHreflangAlternates() })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-uk" />
}
