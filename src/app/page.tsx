import type { Metadata } from 'next'
import { getHomePage, getHomeSectionData } from '@/features/content/loaders'
import { homeText, toHomeCopy } from '@/components/home/copy'
import { buildOgMetadata } from '@/lib/metadata'
import HeroNetwork from '@/components/home/HeroNetwork'
import ServicesGrid from '@/components/home/ServicesGrid'
import ByTheNumbers from '@/components/home/ByTheNumbers'
import ClientLogoCarousel, { type ClientLogo } from '@/components/home/ClientLogoCarousel'
import MethodTimeline from '@/components/home/MethodTimeline'
import WhereWeWork, { type Office } from '@/components/home/WhereWeWork'
import TestimonialsRoll, { type HomeTestimonial } from '@/components/home/TestimonialsRoll'
import IndustriesHub from '@/components/home/IndustriesHub'
import PlatformsCertified from '@/components/home/PlatformsCertified'
import AiCapability from '@/components/home/AiCapability'
import InsightsGrid, { type HomePost } from '@/components/home/InsightsGrid'
import FaqSplit from '@/components/home/FaqSplit'
import CalendlySection from '@/components/sections/CalendlySection'
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

const FALLBACK_EMAIL = 'contact@fruitionservices.io'

interface HomeData {
  settings?: {
    contactEmail?: string
    phone?: string
    calendlyLink?: string
    offices?: Office[]
    carouselLogos?: ClientLogo[]
  }
  testimonials?: HomeTestimonial[]
  posts?: HomePost[]
  copy?: { _key?: string; text?: string }[] | null
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  const title = homePage?.seoTitle ?? "Fruition | monday.com Platinum Partners | monday CRM Experts"
  const description = homePage?.seoDescription ?? "monday.com Partner certified: Fruition is an expert in Monday implementation and integration."
  return {
    alternates: { canonical: '/' },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/",
    }),
  }
}

export default async function Home() {
  const data: HomeData = (await getHomeSectionData()) ?? {}
  const settings = data.settings ?? {}

  const contactEmail = settings.contactEmail || FALLBACK_EMAIL
  // Last-resort link inside BookingSection if the availability API is down —
  // the section itself is the booking destination, so on-page CTAs scroll to it.
  const calendlyUrl = settings.calendlyLink || ''
  const bookingHref = '#book'

  const offices = settings.offices ?? []
  const copy = toHomeCopy(data.copy)

  return (
    <>
      <HeroNetwork bookingHref={bookingHref} copy={copy} />

      {/* Who we work with as one compact scrolling strip (it replaced the
          5x5 wall in Oct 2026), so what we do follows straight after the
          hero. The booking band still sits high because visitors engage but
          rarely scroll; the hero CTA scrolls to it. */}
      <ClientLogoCarousel logos={settings.carouselLogos ?? []} copy={copy} />
      <ServicesGrid copy={copy} />
      {/* The site's single contact/scheduling surface, shared with every
          other page via CalendlySection → BookingSection. */}
      <CalendlySection
        heading={homeText(copy, "booking-heading")}
        subheading={homeText(copy, "booking-subheading")}
        calendlyUrl={calendlyUrl || undefined}
      />
      <TestimonialsRoll
        testimonials={data.testimonials ?? []}
        bookingHref={bookingHref}
        eyebrow={homeText(copy, "testimonials-eyebrow")}
        heading={homeText(copy, "testimonials-heading")}
        intro={homeText(copy, "testimonials-intro")}
        ctaLabel={homeText(copy, "testimonials-cta")}
      />

      <ByTheNumbers copy={copy} />
      <MethodTimeline copy={copy} />
      <WhereWeWork offices={offices} copy={copy} />

      {/* Mid-page conversion banner — shared site-wide. The home page's own
          sections all sit in a 1348px container, so match it here; the
          component's 1200px default suits the narrower inner pages. */}
      <AuditCtaBanner containerClassName="max-w-[1348px] px-5 md:px-8" />

      <IndustriesHub copy={copy} />
      <PlatformsCertified copy={copy} />
      <AiCapability bookingHref={bookingHref} copy={copy} />
      <InsightsGrid posts={data.posts ?? []} copy={copy} />
      <FaqSplit contactEmail={contactEmail} copy={copy} />
    </>
  )
}
