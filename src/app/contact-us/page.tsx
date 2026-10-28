import { getSiteSettings } from "@/sanity/queries"
import ContactHeroSection from "@/components/sections/ContactHeroSection"
import BookingSection from "@/components/sections/BookingSection"
import ContactChannelsSection from "@/components/sections/ContactChannelsSection"
import OfficesBandSection, { type ContactOffice } from "@/components/sections/OfficesBandSection"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import FaqAccordion from "@/components/sections/FaqAccordion"
import type { FaqTab } from "@/components/sections/types"
import { buildOgMetadata } from "@/lib/metadata"
import { siteText, toSiteCopy } from "@/lib/siteCopy"

const SALES_EMAIL = "contact@fruitionservices.io"

export async function generateMetadata() {
  const title = "Contact Us | Fruition"
  const description = "Talk to the Fruition team. Reach sales or support by email, call us, or find the office nearest you across our six locations worldwide."
  return {
    alternates: { canonical: "/contact-us" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/contact-us",
    }),
  }
}

interface RawOffice {
  city?: string
  country?: string
  flag?: string
  label?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

/** Wording reused verbatim from the home page FAQ (src/components/home/copy.ts). */
const FAQ_TABS: FaqTab[] = [
  {
    _key: "contact",
    label: "Contact",
    items: [
      {
        _key: "what-we-do",
        question: "What does Fruition Services do?",
        answer:
          "Fruition Services is a technology consultancy that implements and integrates monday.com, Atlassian and HubSpot, and delivers AI advisory and change management. Headquartered in Sydney, Fruition works with mid-market and enterprise teams across Australia, the UK, the US, Singapore, India and the Philippines.",
      },
      {
        _key: "partner",
        question: "Is Fruition an official monday.com partner?",
        answer:
          "Yes. Fruition is a monday.com Platinum Partner and won the Rising Star Award at the 2026 monday.com Partner Summit. Our founder spent six years at monday.com before starting Fruition, so we know the platform from the inside.",
      },
      {
        _key: "platforms",
        question: "Which platforms and AI tools do you work with?",
        answer:
          "monday.com, Atlassian (Jira, Jira Service Management, Confluence) and HubSpot, plus AI implementation across Anthropic Claude, OpenAI and Microsoft Copilot, with automation on n8n and native platform integrations.",
      },
      {
        _key: "where",
        question: "Where does Fruition operate?",
        answer:
          "Fruition is headquartered at 64 York Street, Sydney, with entities in Australia, the US and the UK, and consultants delivering across Australia, the UK, the US, Singapore, India and the Philippines: coverage in your time zone.",
      },
    ],
  },
]

export default async function ContactPage() {
  const siteSettings = await getSiteSettings()
  const copy = toSiteCopy(siteSettings?.copy)

  const offices: ContactOffice[] = ((siteSettings?.offices as RawOffice[] | undefined) ?? [])
    .filter((o) => o?.city)
    .map((o) => ({
      city: o.city!,
      country: o.country,
      flag: o.flag,
      label: o.label,
      address: o.address,
      addressUrl: o.addressUrl,
      phone: o.phone,
      phoneTel: o.phoneTel,
    }))

  const supportEmail = siteSettings?.contactEmail || "support@fruitionservices.io"
  const firstPhone = offices.find((o) => o.phone)
  const phone = siteSettings?.phone || firstPhone?.phone
  const phoneTel = firstPhone?.phoneTel

  return (
    <>
      <ContactHeroSection salesEmail={SALES_EMAIL} />

      {/* Booking band stays second on the page; BookingSection owns id="book". */}
      <BookingSection
        eyebrow={siteText(copy, "booking-contact-eyebrow")}
        heading={siteText(copy, "booking-contact-heading")}
        sub={siteText(copy, "booking-contact-sub")}
        email={SALES_EMAIL}
      />

      <ContactChannelsSection salesEmail={SALES_EMAIL} supportEmail={supportEmail} phone={phone} phoneTel={phoneTel} />

      <OfficesBandSection offices={offices} />

      {/* Mid-page conversion banner, shared site-wide */}
      <AuditCtaBanner />

      <FaqAccordion tabs={FAQ_TABS} contactEmail={SALES_EMAIL} />
    </>
  )
}
