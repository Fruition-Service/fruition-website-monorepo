// Version C (14 Nov 2026): built on the approved Agent development layout, so it shares that page's
// stylesheet and scope class. Content: vcPage document for /ai-consulting/operations-back-office (docs/version-c.md).
import "@/styles/vc/pages/agent-development.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-consulting/operations-back-office"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="agent-development" />
}
