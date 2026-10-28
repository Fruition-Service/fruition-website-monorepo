import FaqAccordion from "@/components/sections/FaqAccordion"
import { FAQS } from "./data"
import { homeText, type HomeCopy } from "./copy"

interface Props {
  contactEmail: string
  copy: HomeCopy
}

/**
 * Homepage FAQ: the shared FaqAccordion with the homepage's own Sanity-editable
 * copy. Answers are short and self-contained, and the same set is emitted as
 * FAQPage JSON-LD so answer engines can lift them directly.
 */
export default function FaqSplit({ contactEmail, copy }: Props) {
  return (
    <FaqAccordion
      eyebrow={homeText(copy, "faq-eyebrow")}
      heading={homeText(copy, "faq-heading")}
      intro={homeText(copy, "faq-lead")}
      contactLead={homeText(copy, "faq-person")}
      contactEmail={contactEmail}
      tabs={[
        {
          items: FAQS.map((faq) => ({
            _key: faq.questionSlot,
            question: homeText(copy, faq.questionSlot),
            answer: homeText(copy, faq.answerSlot),
          })),
        },
      ]}
    />
  )
}
