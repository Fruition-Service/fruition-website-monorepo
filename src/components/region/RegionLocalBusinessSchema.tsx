"use client"

import { usePathname } from "next/navigation"
import type { RegionLocalBusiness } from "./types"
import { REGION_LOCAL_BUSINESS } from "@/data/regionLocalBusiness"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"

/** The site-wide contact address, same one the footer and /contact-us publish. */
const CONTACT_EMAIL = "contact@fruitionservices.io"

/**
 * Every region office sells the same catalogue, so these two lists are shared
 * rather than restated per region.
 */
const SERVICE_TYPES = [
  "monday.com Consulting",
  "monday.com Implementation",
  "monday CRM Consulting",
  "monday.com Automation",
  "monday.com Integrations",
  "monday.com Data Migration",
  "monday.com Training",
  "monday AI Enablement",
]

const KNOWS_ABOUT = [
  "monday.com",
  "monday.com implementation",
  "monday.com consulting",
  "monday CRM",
  "workflow automation",
  "monday.com integrations",
  "data migration",
  "monday.com training",
  "monday AI",
]

function buildSchema(slug: string, lb: RegionLocalBusiness) {
  const url = `${SITE_URL}/${slug}`
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#localbusiness`,
    name: lb.name,
    url,
    description: lb.description,
    parentOrganization: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Fruition Services",
      url: `${SITE_URL}/`,
    },
    telephone: lb.telephone,
    email: CONTACT_EMAIL,
    address: { "@type": "PostalAddress", ...lb.address },
    areaServed: [
      ...lb.areaServedCities.map((name) => ({ "@type": "City", name })),
      ...lb.areaServedCountries.map((name) => ({ "@type": "Country", name })),
    ],
    serviceType: SERVICE_TYPES,
    knowsAbout: KNOWS_ABOUT,
  }
}

/**
 * Per-region `ProfessionalService` (a LocalBusiness subtype) JSON-LD, emitted
 * into <head>.
 *
 * Each region page describes one real office — the address and phone number
 * published in Sanity `siteSettings.offices` — hung off the site-wide
 * Organization node emitted by the root layout via `parentOrganization`.
 *
 * Why this is a client component mounted in the root layout's <head> rather
 * than a server component rendered by the page: in the App Router nothing a
 * page renders can reach <head>. React hoists <title>, <meta> and <link> from
 * anywhere in the tree, but an inline <script> is never hoisted (it hoists
 * scripts only when they carry both `async` and a `src`), and a parallel-route
 * slot rendered inside <head> arrives suspended — React streams it into a
 * hidden div and relocates it with JavaScript, so the served HTML still has it
 * in the body. Reading the pathname here is the one route-aware thing that
 * renders inline in the prerendered <head>. The pathname is known at build
 * time for these static routes, so this costs no dynamic rendering.
 *
 * Deliberately carries no `aggregateRating`. Google requires review markup to
 * reflect ratings actually collected and shown on the page; the region pages
 * display none, and Fruition's real published counts are single digits. Adding
 * an invented score risks a structured-data manual action.
 */
export default function RegionLocalBusinessSchema() {
  const pathname = usePathname()
  const slug = (pathname ?? "").replace(/^\/+|\/+$/g, "")
  const lb = (REGION_LOCAL_BUSINESS as Record<string, RegionLocalBusiness>)[slug]
  if (!lb) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(slug, lb)) }}
    />
  )
}
