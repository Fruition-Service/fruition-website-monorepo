import type { Metadata } from "next"
import { getSiteSettings } from "@/sanity/queries"
import { buildOgMetadata } from "@/lib/metadata"
import PracticesContent from "./PracticesContent"

const TITLE = "Six Practices, One Operating Model | Fruition"
const DESCRIPTION =
  "Fruition delivers six practices, from platform implementation to managed services, on one operating model that makes the platform fit how your business already works."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/practices" },
  ...buildOgMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/practices",
  }),
}

export default async function Page() {
  const settings = await getSiteSettings()
  return <PracticesContent logos={settings?.carouselLogos ?? []} />
}
