import "@/styles/vc/pages/contact-us.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/contact-us"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="contact-us" />
}
