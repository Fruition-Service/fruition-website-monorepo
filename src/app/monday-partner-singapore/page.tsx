import "@/styles/vc/pages/monday-partner-singapore.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { locationHreflangAlternates } from "@/lib/metadata"

const PATH = "/monday-partner-singapore"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_SG", languages: locationHreflangAlternates() })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-singapore" />
}
