import type { Metadata } from 'next'
import { getHomePage, getHomeSectionData } from '@/features/content/loaders'
import { buildOgMetadata } from '@/lib/metadata'
import HeroNetwork from '@/components/home/HeroNetwork'
import ServicesGrid from '@/components/home/ServicesGrid'
import ByTheNumbers from '@/components/home/ByTheNumbers'
import ClientsGrid, { type ClientLogo } from '@/components/home/ClientsGrid'
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

  return (
    <>
      <HeroNetwork bookingHref={bookingHref} />

      {/* Same opening as the six regional partner pages: who we work with,
          then the way to book, then what we do and what clients say. The
          booking band sits high because visitors engage but rarely scroll. */}
      <ClientsGrid logos={settings.carouselLogos ?? []} />
      {/* The site's single contact/scheduling surface, shared with every
          other page via CalendlySection → BookingSection. */}
      <CalendlySection
        heading="Let's design the way your business should run."
        subheading="30 minutes. No obligation. Speak to a consultant, not a salesperson."
        calendlyUrl={calendlyUrl || undefined}
      />
      <ServicesGrid />
      <TestimonialsRoll testimonials={data.testimonials ?? []} bookingHref={bookingHref} />

      <ByTheNumbers />
      <MethodTimeline />
      <WhereWeWork offices={offices} />

      {/* Mid-page conversion banner — shared site-wide. The home page's own
          sections all sit in a 1348px container, so match it here; the
          component's 1200px default suits the narrower inner pages. */}
      <AuditCtaBanner containerClassName="max-w-[1348px] px-5 md:px-8" />

      <IndustriesHub />
      <PlatformsCertified />
      <AiCapability bookingHref={bookingHref} />
      <InsightsGrid posts={data.posts ?? []} />
      <FaqSplit contactEmail={contactEmail} />
    </>
  )
}
