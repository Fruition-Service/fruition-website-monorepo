import "@/styles/vc/pages/monday-implementation-consultants.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-implementation-consultants"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-implementation-consultants" />
}
