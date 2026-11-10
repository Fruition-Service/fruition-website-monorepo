import "@/styles/vc/pages/atlassian-consulting.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/atlassian-consulting"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="atlassian-consulting" />
}
