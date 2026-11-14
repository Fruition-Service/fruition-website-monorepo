// Version C (14 Nov 2026): built on the approved Claude partner layout, so it shares that page's
// stylesheet and scope class. Content: vcPage document for /partnerships/google-cloud-partner (docs/version-c.md).
import "@/styles/vc/pages/anthropic-claude-partner.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/partnerships/google-cloud-partner"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="anthropic-claude-partner" />
}
