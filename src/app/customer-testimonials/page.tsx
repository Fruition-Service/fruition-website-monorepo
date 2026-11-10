import "@/styles/vc/pages/customer-testimonials.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/customer-testimonials"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="customer-testimonials" />
}
