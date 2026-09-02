import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Poppins, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { OfficeStrapProvider } from "@/components/OfficeStrapProvider"
import NavigationProgress from "@/components/NavigationProgress"
import CookieNotice from "@/components/CookieNotice"
import SiteFrame from "@/components/SiteFrame"
import CtaClickTracker from "@/components/CtaClickTracker"
import AwardBanner from "@/components/home/AwardBanner"
import { ThemeProvider } from "@/components/ThemeProvider"
import { getSiteSettings } from "@/sanity/queries"
import { bookingHref } from "@/lib/bookingLink"
import { officeStrap } from "@/data/offices"
import { urlFor } from "@/sanity/image"
import { buildOgMetadata, defaultOgImage } from "@/lib/metadata"



// RB2B loader. Disclosure of B2B visitor identification lives in
// /data-privacy and /terms-and-conditions. RB2B handles region-level
// suppression server-side per the account's compliance settings.
//
// Opt-out gate: visitors who clicked "Decline" in <CookieNotice /> get a
// "declined" value under this localStorage key, which suppresses the loader on
// every later visit. Keep the key in sync with src/components/CookieNotice.tsx.
const REB2B_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("9NMMZHR9W0NW");})();`

// Google Tag Manager. Container GTM-PF6XWTL6 is the single tagging surface
// for the site: it carries the two GA4 Google Tags, the Google Ads tag
// (AW-1003400430), and the Calendly booking conversion — tag, trigger and the
// postMessage listener that fires it. Nothing about measurement lives in this
// repo any more, so Benjie can change what is tracked without a deploy.
//
// What used to be here: a hand-rolled `gtag.js` snippet plus a
// <CalendlyBookingTracker /> React listener, both carrying hard-coded Google
// Ads IDs. See the container for their replacements.
const GTM_ID = "GTM-PF6XWTL6"
const GTM_LOADER = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`


// OpenAI Ads conversion tracking (oaiq). Base loader sitewide — stubs the
// queue synchronously so oaiq(...) calls never drop while the SDK is still
// in flight, then fires the pixel init. Pixel ID from OpenAI Ads Manager.
// Consent: honours the same fruition-visitor-consent localStorage gate as
// REB2B — keep in sync with src/components/CookieNotice.tsx.
const OAIQ_PIXEL_ID = "RNJ1b2hooXBRHiYSWb3K6h"
const OAIQ_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}
!(function(o,a,i,q){if(o.oaiq)return;var n=o.oaiq=function(){n.queue.push(arguments)};n.queue=[];var s=a.createElement(i);s.async=!0;s.src=q;var e=a.getElementsByTagName(i)[0];e.parentNode.insertBefore(s,e)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js"));
oaiq("init", { pixelId: "RNJ1b2hooXBRHiYSWb3K6h" });
})();`
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
})

// The mono accent voice (DESIGN.md): eyebrows, tags, stats, pricing metadata.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

// Light-only: declaring a single scheme also stops browsers (notably mobile
// Chrome/Android) from auto-inverting the page.
export const viewport: Viewport = {
  colorScheme: "light",
}

// Cap the CDN cache TTL for the whole site.
//
// Fully-static (prerendered) pages otherwise ship `Cache-Control:
// s-maxage=31536000` (one year), so Cloudflare keeps serving the build-time
// HTML and NEW deploys don't appear live until the entry is evicted or the
// cache is purged by hand — that's why sticky-CTA/content fixes lagged prod.
// Setting a route-segment `revalidate` turns these into ISR and lowers the
// header to `s-maxage=60, stale-while-revalidate=...`, so a deploy self-heals
// within ~a minute. Because the lowest `revalidate` in a route wins, this
// applies site-wide from the root layout (a new page can't re-introduce the
// 1-year cache by forgetting to set it). `force-dynamic` routes (the /internal
// admin) are unaffected. Blog post/author pages drop from 3600s to 60s —
// harmless (fresher, negligible extra revalidation).
//
// NOTE: this only governs cache entries written from here on. Existing 1-year
// entries must be cleared once with a Cloudflare "Purge Everything" AFTER this
// ships; thereafter the site stays fresh on its own.
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [s, ogImage] = await Promise.all([getSiteSettings(), defaultOgImage()])
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io",
    ),
    title: s?.defaultSeoTitle,
    description: s?.defaultSeoDescription,
    ...buildOgMetadata({
      title: s?.defaultSeoTitle,
      description: s?.defaultSeoDescription,
      path: "/",
      image: ogImage,
    }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: [
        "h7rPggK-qoBgzjiEXeiHKaKsYbQI2LjippLHnlizyp8",
        "SNyBhKEoT5fNsGG4BxYuy2XLiTubLFfvDvVbZwwpb8c",
        "jyOeWAMmPK3KH3Fwf4vm55PLSK-wBwKarqv_BG5xHbk",
      ],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getSiteSettings()

  // Local preview of the Site Architecture v2.1 nav without writing to Sanity:
  // NAV_V2_PREVIEW=1 npm run dev  (see scripts/seed-nav-v2.ts for the real rollout)
  if (process.env.NAV_V2_PREVIEW === '1' && siteSettings) {
    const { NAV_V2 } = await import('@/data/nav-v2')
    siteSettings.navigation = NAV_V2
  }

  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"
  const socials = Array.isArray(siteSettings?.socialLinks)
    ? (siteSettings.socialLinks as Array<{ href?: string }>)
        .map((l) => l?.href)
        .filter((h): h is string => Boolean(h))
    : []
  let logoUrl = `${BASE}/og-image.png`
  try {
    if (siteSettings?.logo) logoUrl = urlFor(siteSettings.logo).width(512).url()
  } catch {
    logoUrl = `${BASE}/og-image.png`
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: "Fruition",
        url: BASE,
        logo: logoUrl,
        description:
          "Fruition is a consulting and implementation firm across monday.com (Platinum Partner), Atlassian, HubSpot, and AI platforms, serving Australia, the UK, and the US.",
        // §05 AEO: entity signals for every practice, not just monday.com
        knowsAbout: [
          "monday.com",
          "monday CRM",
          "Atlassian",
          "Jira",
          "Confluence",
          "Jira Service Management",
          "HubSpot",
          "AI consulting",
          "Anthropic Claude",
          "OpenAI ChatGPT",
          "Microsoft Copilot",
          "Google Gemini",
          "Google Cloud",
          "AWS Bedrock",
          "n8n",
          "Make",
          "Zapier",
          "Aircall",
          "Twilio",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Consulting services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "monday.com consulting & implementation", url: `${BASE}/monday-implementation-consultants` },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "AI consulting & implementation", url: `${BASE}/ai-consulting` },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "Atlassian consulting", url: `${BASE}/atlassian-consulting` },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "HubSpot consulting", url: `${BASE}/hubspot-consulting` },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "Integration & automation services", url: `${BASE}/integrations` },
            },
          ],
        },
        ...(socials.length ? { sameAs: socials } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        name: "Fruition",
        url: BASE,
        publisher: { "@id": `${BASE}/#organization` },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: GTM_LOADER }}
        />
        <script dangerouslySetInnerHTML={{ __html: REB2B_LOADER }} />
        <script dangerouslySetInnerHTML={{ __html: OAIQ_LOADER }} />
      </head>
      <body className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}>
        <CtaClickTracker />
        {/* GTM's no-JS fallback. It records the pageview only; none of the
            container's tags run without JavaScript. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <NavigationProgress />
          <OfficeStrapProvider value={officeStrap(siteSettings?.offices)}>
            <SiteFrame
              header={
                <div key="site-header">
                  <AwardBanner />
                  <Navbar siteSettings={siteSettings} />
                </div>
              }
              footer={<Footer key="site-footer" siteSettings={siteSettings} />}
              cookie={<CookieNotice key="site-cookie" />}
              stickyCtaHeading={siteSettings?.stickyCtaHeading || undefined}
              stickyCtaDefaults={{
                label: siteSettings?.stickyCtaLabel || "Book a Free Consultation",
                mobileLabel: siteSettings?.stickyCtaMobileLabel || undefined,
                href: bookingHref(
                  siteSettings?.stickyCtaUrl || siteSettings?.calendlyLink,
                ),
              }}
            >
              {children}
            </SiteFrame>
          </OfficeStrapProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
