import Link from "next/link"
import Image from "next/image"
import { urlFor } from "@/sanity/image"

interface HeroSectionProps {
  heading: string
  subheading?: string
  primaryCta: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
  heroImage?: { asset: { _ref: string } }
}

export default function HeroSection({ heading, subheading, primaryCta, secondaryCta, heroImage }: HeroSectionProps) {
  const imageUrl = heroImage?.asset ? urlFor(heroImage).width(1400).height(500).fit("crop").auto("format").url() : null

  return (
    <section className="relative bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4 overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <Image src={imageUrl} alt="" fill className="object-cover opacity-20" priority />
        </div>
      )}
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{heading}</h1>
        {subheading && (
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{subheading}</p>
        )}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href={primaryCta.url}
            className="bg-white text-blue-700 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.url}
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
