import type { RegionLocalBusiness } from "@/components/region/types"

/**
 * The real office behind each /monday-partner-* page: the address and phone
 * number published in Sanity `siteSettings.offices`.
 *
 * Split out of `regionPages.ts` on purpose. The ProfessionalService JSON-LD is
 * emitted into <head> by a client component in the root layout (the only place
 * an inline script can reach the static <head> in the App Router), so whatever
 * it imports ships in the client bundle of every page on the site. This module
 * is the few hundred bytes of office data, not the several thousand lines of
 * region page copy that live next to it.
 */
export const REGION_LOCAL_BUSINESS = {
  "monday-partner-australia": {
    name: "monday.com Platinum Consulting Partner in Australia",
    description:
      "Fruition Services is a monday.com Platinum Partner providing monday.com consulting, implementation, CRM, automation, integrations, data migration, training and ongoing optimisation services across Australia.",
    telephone: "+61 483 955 931",
    address: {
      streetAddress: "Level 12, 64 York Street",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      postalCode: "2000",
      addressCountry: "AU",
    },
    areaServedCities: ["Sydney", "Melbourne", "Brisbane", "Adelaide", "Perth"],
    areaServedCountries: ["Australia", "New Zealand"],
  },
  "monday-partner-uk": {
    name: "monday.com Platinum Consulting Partner in the United Kingdom",
    description:
      "Fruition Services is a monday.com Platinum Partner providing monday.com consulting, implementation, CRM, automation, integrations, data migration, training and ongoing optimisation services across the United Kingdom.",
    telephone: "+44 7822 019548",
    address: {
      streetAddress: "423 Linen Hall, 162-168 Regent Street",
      addressLocality: "London",
      addressRegion: "England",
      postalCode: "W1B 5TE",
      addressCountry: "GB",
    },
    areaServedCities: [
      "London",
      "Manchester",
      "Birmingham",
      "Leeds",
      "Edinburgh",
      "Glasgow",
    ],
    areaServedCountries: ["United Kingdom"],
  },
  "monday-partner-us": {
    name: "monday.com Platinum Consulting Partner in the United States",
    description:
      "Fruition Services is a monday.com Platinum Partner providing monday.com consulting, implementation, CRM, automation, integrations, data migration, training and ongoing optimization services across the United States.",
    telephone: "+1 302 330 2496",
    address: {
      streetAddress: "205 W 37th St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10018",
      addressCountry: "US",
    },
    areaServedCities: [
      "New York",
      "Chicago",
      "Austin",
      "San Francisco",
      "Los Angeles",
    ],
    areaServedCountries: ["United States", "Canada"],
  },
  "monday-partner-singapore": {
    name: "monday.com Platinum Consulting Partner in Singapore",
    description:
      "Fruition Services is a monday.com Platinum Partner providing monday.com consulting, implementation, CRM, automation, integrations, data migration, training and ongoing optimisation services across Singapore and Southeast Asia.",
    telephone: "+65 3158 6808",
    address: {
      // Goldhill Plaza is a city-state address with no state or province.
      streetAddress: "Goldhill Plaza #07-07",
      addressLocality: "Singapore",
      postalCode: "308900",
      addressCountry: "SG",
    },
    areaServedCities: ["Singapore", "Kuala Lumpur", "Jakarta", "Bangkok", "Ho Chi Minh City"],
    areaServedCountries: [
      "Singapore",
      "Malaysia",
      "Indonesia",
      "Thailand",
      "Vietnam",
    ],
  },
  "monday-partner-india": {
    name: "monday.com Platinum Consulting Partner in India",
    description:
      "Fruition Services is a monday.com Platinum Partner providing monday.com consulting, implementation, CRM, automation, integrations, data migration, training and ongoing optimisation services across India.",
    telephone: "+91 7503735930",
    address: {
      streetAddress: "WeWork Eldeco Centre, Block A, Malviya Nagar",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110017",
      addressCountry: "IN",
    },
    areaServedCities: [
      "New Delhi",
      "Mumbai",
      "Bengaluru",
      "Hyderabad",
      "Pune",
      "Chennai",
    ],
    areaServedCountries: ["India"],
  },
  "monday-partner-philippines": {
    name: "monday.com Platinum Consulting Partner in the Philippines",
    description:
      "Fruition Services is a monday.com Platinum Partner providing monday.com consulting, implementation, CRM, automation, integrations, data migration, training and ongoing optimisation services across the Philippines.",
    telephone: "+63 947 230 4274",
    address: {
      streetAddress: "Menarco Tower, 32nd St, Bonifacio Global City",
      addressLocality: "Taguig",
      addressRegion: "Metro Manila",
      postalCode: "1634",
      addressCountry: "PH",
    },
    areaServedCities: ["Manila", "Taguig", "Cebu", "Davao", "Angeles"],
    areaServedCountries: ["Philippines"],
  },
} as const satisfies Record<string, RegionLocalBusiness>
