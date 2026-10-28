import FaqAccordion from "@/components/sections/FaqAccordion"
import type { FaqTextPair } from "@/lib/faqSchema"

interface Props {
  heading: string
  contactLead: string
  items: FaqTextPair[]
  contactEmail?: string
}

/** Region-page FAQ: the shared FaqAccordion with one untabbed group. */
export default function RegionFaqSection({ heading, contactLead, items, contactEmail }: Props) {
  return (
    <FaqAccordion
      heading={heading}
      contactLead={contactLead}
      contactEmail={contactEmail}
      tabs={[{ items }]}
    />
  )
}
