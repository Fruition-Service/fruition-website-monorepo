"use client"

import { useEffect, useMemo, useState } from "react"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import type { CaseStudy, SanityImageRef } from "./types"

interface TestimonialCtaBannerProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  testimonial?: CaseStudy
  testimonials?: CaseStudy[]
  autoScrollMs?: number
}

function safeImageUrl(ref?: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).width(400).auto("format").url() } catch { return null }
}

export default function TestimonialCtaBanner({
  headingPart1 = "Join ",
  headingAccent = "900+ organisations",
  headingPart2 = " that have maximised their workflows with our monday.com expert support",
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  testimonial,
  testimonials,
  autoScrollMs = 6000,
}: TestimonialCtaBannerProps) {
  const slides = useMemo(() => {
    const list = (testimonials && testimonials.length > 0 ? testimonials : (testimonial ? [testimonial] : []))
      .filter((t) => t?.quote)
    return list
  }, [testimonials, testimonial])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, autoScrollMs)
    return () => clearInterval(id)
  }, [slides.length, autoScrollMs])

  const active = slides[index]
  const photoSrc = safeImageUrl(active?.profilePhoto)
  const role = active?.clientCompany || active?.clientRole || ""

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative w-full rounded-[28px] bg-black text-white overflow-hidden">
          {/* Layered gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(90,110,255,0.32),transparent_25%),radial-gradient(circle_at_45%_70%,rgba(70,90,255,0.22),transparent_28%),linear-gradient(135deg,#020307_15%,#050814_45%,#090d24_75%,#04050c_100%)]" />

          {/* Decorative orbs */}
          <div className="absolute inset-0 opacity-80 pointer-events-none">
            <div className="absolute -left-20 top-20 h-[420px] w-[420px] rounded-full border border-white/5" />
            <div className="absolute left-[22%] top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(83,106,255,0.25),transparent_60%)] blur-2xl" />
            <div className="absolute left-[10%] bottom-[-10%] h-[320px] w-[900px] rotate-[-28deg] bg-[linear-gradient(90deg,transparent,rgba(99,122,255,0.55),transparent)] blur-xl" />
            <div className="absolute left-[18%] top-[12%] h-[260px] w-[780px] rotate-[-28deg] bg-[linear-gradient(90deg,transparent,rgba(92,115,255,0.4),transparent)] blur-xl" />
          </div>

          {/* Content grid */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 px-8 py-10 md:px-12 md:py-14 items-center">
            {/* Left: heading + CTAs */}
            <div className="max-w-[480px]">
              <h2 className="text-[2.25rem] md:text-[3.25rem] leading-[1.12] font-semibold tracking-[-0.04em]">
                <span>{headingPart1}</span>
                <span className="text-brand-light">{headingAccent}</span>
                <span>{headingPart2}</span>
              </h2>

              <div className="mt-10 flex flex-col gap-4 max-w-[330px]">
                {primaryCtaLabel && primaryCtaUrl && (
                  <CtaButton
                    href={primaryCtaUrl}
                    label={primaryCtaLabel}
                    variant="onDarkPrimary"
                    className="w-full h-14"
                  />
                )}
                {secondaryCtaLabel && secondaryCtaUrl && (
                  <CtaButton
                    href={secondaryCtaUrl}
                    label={secondaryCtaLabel}
                    variant="primary"
                    className="w-full h-14"
                  />
                )}
              </div>
            </div>

            {/* Right: testimonial card (auto-rotating) */}
            {active && (
              <div
                key={active._id || index}
                className="bg-white text-black rounded-[18px] px-8 py-9 md:px-10 md:py-10 shadow-2xl shadow-black/30 max-w-[500px] justify-self-end animate-fade-in flex flex-col min-h-[420px]"
              >
                {active.quote && (
                  <p className="text-[1.08rem] md:text-[1.15rem] leading-[1.5] font-semibold tracking-[-0.02em] text-black/90 overflow-hidden line-clamp-6">
                    {active.quote}
                  </p>
                )}

                <div className="mt-auto flex items-end gap-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoSrc || "/images/default-avatar.svg"}
                    alt={active.clientName || ""}
                    className="h-24 w-24 shrink-0 rounded-full object-cover bg-ui"
                  />
                  <div className="pb-1">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center bg-brand text-white text-2xl font-bold rounded-sm">
                      &ldquo;
                    </div>
                    <div className="text-[1.05rem] font-semibold">
                      {active.clientName ?? ""}
                    </div>
                    {role && (
                      <div className="text-[0.95rem] text-black/60">{role}</div>
                    )}
                  </div>
                </div>

                {slides.length > 1 && (
                  <div className="mt-6 flex gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show testimonial ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-[22px] bg-brand" : "w-2 bg-ui"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
