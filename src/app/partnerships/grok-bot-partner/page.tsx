// Built on the approved OpenClaw partner layout, so it shares that page's
// Version C stylesheet and scope class (docs/version-c.md).
import "@/styles/vc/pages/openclaw-partner.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/partnerships/grok-bot-partner"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="openclaw-partner" />
}
