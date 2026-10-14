"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import { useMemo, useState } from "react"
import { urlFor } from "@/sanity/image"
import CtaLabel from "@/components/CtaLabel"
import FramedMedia from "@/components/common/FramedMedia"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import CalendlySection from "@/components/sections/CalendlySection"

export interface TeamMember {
  _id: string
  name: string
  role?: string
  emoji?: string
  photo?: SanityImageRef
  photoUrl?: string
  bio?: string
  linkedinUrl?: string
  regions?: string[]
  order?: number
  certifications?: string[]
}

/** Short, hover-revealed explanation per certification. */
const CERT_INFO: Record<string, string> = {
  "Certified Core Consultant": "Certified on monday.com core platform configuration and delivery.",
  "Advanced Workflow Builder": "Builds advanced automations, dependencies, and cross-board logic.",
  "CRM Specialist": "Specializes in monday CRM and sales-pipeline architecture.",
  "Make.com Certified": "Certified to build Make.com integration scenarios.",
  "n8n Specialist": "Designs custom n8n workflows and API integrations.",
  "Solutions Architect": "Architects end-to-end Work OS solutions for enterprise teams.",
}

export interface TeamRegion {
  code: string
  label: string
  emoji: string
}

export interface HeroDescriptionBlock {
  style?: "paragraph" | "bold"
  text: string
}

interface Props {
  members: TeamMember[]
  heroHeading: string
  heroCtaLabel: string
  calendlyUrl: string
  partnerBadges: PartnerBadge[]
  certificationBadge?: SanityImageRef
  regions: TeamRegion[]
  heroDescriptionBlocks?: HeroDescriptionBlock[]
  croSections?: CroSectionsData | null
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(560).height(560).fit("crop").url()
  } catch {
    return null
  }
}

function roleRank(role?: string): number {
  const r = (role ?? "").toLowerCase()
  if (!r) return 5
  if (r.includes("founder") || r.includes("ceo") || r.includes("chief")) return 0
  if (r.includes("director") || r.includes("head of") || r.includes(" vp ") || r.startsWith("vp")) return 1
  if (r.includes("lead") || r.includes("manager") || r.includes("principal")) return 2
  if (r.includes("engineer") || r.includes("developer") || r.includes("architect")) return 3
  if (r.includes("senior")) return 3
  return 4
}

function safeBadgeUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(800).auto("format").url()
  } catch {
    return null
  }
}

export default function FruitionTeamClient({
  members,
  heroHeading,
  heroCtaLabel,
  calendlyUrl,
  partnerBadges,
  regions,
  heroDescriptionBlocks,
  croSections,
}: Props) {
  const [region, setRegion] = useState<string>(regions[0]?.code ?? "APAC")

  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => Array.isArray(m.regions) && m.regions.includes(region))
      .sort((a, b) => {
        if (a.name === "Josh Jebathilak") return -1
        if (b.name === "Josh Jebathilak") return 1
        if (a.name === "Edward Zehua Zhang") return 1
        if (b.name === "Edward Zehua Zhang") return -1
        return roleRank(a.role) - roleRank(b.role) || a.name.localeCompare(b.name)
      })
  }, [members, region])

  return (
    <div>
      <StickyCtaConfig label={croSections?.stickyCtaLabel} mobileLabel={croSections?.stickyCtaMobileLabel} href={bookingHref(croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* Hero */}
      <section className="bg-surface">
        <div
          className="mx-auto flex flex-col items-center"
          style={{
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 80,
            paddingBottom: 60,
            maxWidth: 1100,
          }}
        >
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeBadgeUrl(badge.image)
                if (!src) return null
                return (
                  <FramedMedia key={badge._key || `badge-${i}`} className="dark:p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={badge.name || "Partner badge"}
                      width={120}
                      height={44}
                      className="h-[44px] w-auto rounded-[5px]"
                    />
                  </FramedMedia>
                )
              })}
            </div>
          )}

          <h1
            className="text-center font-bold"
            style={{
              fontSize: "clamp(32px, 8vw, 48px)",
              lineHeight: 1.2,
              marginTop: partnerBadges.length > 0 ? 36 : 0,
              maxWidth: 920,
              color: "var(--text-body)",
            }}
          >
            {heroHeading}
          </h1>

          <Link
            href={calendlyUrl}
            className="flex items-center justify-center font-bold text-white"
            style={{
              marginTop: 32,
              width: 240,
              height: 53,
              borderRadius: 100,
              background: "linear-gradient(to right, #8015e8, #ba83f0)",
              fontSize: 16,
            }}
          >
            <CtaLabel label={heroCtaLabel} />
          </Link>

          {/* Description */}
          {heroDescriptionBlocks && heroDescriptionBlocks.length > 0 && (
            <div
              className="flex flex-col text-center"
              style={{ gap: 20, marginTop: 48, maxWidth: 880 }}
            >
              {heroDescriptionBlocks.map((block, i) =>
                block.style === "bold" ? (
                  <p
                    key={`hero-desc-${i}`}
                    className="font-bold"
                    style={{ fontSize: 22, lineHeight: "30px", color: "var(--text-body)", marginTop: 8 }}
                  >
                    {block.text}
                  </p>
                ) : (
                  <p
                    key={`hero-desc-${i}`}
                    style={{ fontSize: 17, lineHeight: "28px", color: "var(--text-body)" }}
                  >
                    {block.text}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Region selector tabs */}
      <section className="bg-surface">
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: 16, paddingTop: 8, paddingBottom: 8 }}
          >
            {regions.map((r) => {
              const active = region === r.code
              return (
                <button
                  key={r.code}
                  onClick={() => setRegion(r.code)}
                  className="cursor-pointer transition-all"
                  style={{
                    padding: "12px 28px",
                    borderRadius: 100,
                    fontSize: 16,
                    fontWeight: 600,
                    ...(active
                      ? {
                          background: "linear-gradient(to right, #8015e8, #ba83f0)",
                          color: "white",
                          boxShadow: "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                          border: "none",
                        }
                      : {
                          backgroundColor: "var(--surface-raised)",
                          color: "var(--text-body)",
                          border: "1px solid var(--border-ui)",
                        }),
                  }}
                >
                  {r.label} {r.emoji}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="bg-surface" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          {filteredMembers.length === 0 ? (
            <p className="text-center" style={{ color: "var(--text-muted-fg)", fontSize: 16 }}>
              No team members listed for this region yet.
            </p>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gap: 28 }}
            >
              {filteredMembers.map((m) => {
                const photo = safeImageUrl(m.photo) || m.photoUrl
                return (
                  <article
                    key={m._id}
                    className="bg-surface-raised rounded-card border border-ui overflow-hidden flex flex-col shadow-whisper dark:shadow-none"
                  >
                    <div
                      style={{
                        aspectRatio: "1 / 1",
                        backgroundColor: "#f5f0ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span style={{ fontSize: 80 }}>{m.emoji || "🍎"}</span>
                      )}
                    </div>
                    <div className="flex flex-col" style={{ padding: 24, flex: 1 }}>
                      {m.role && (
                        <p
                          className="font-semibold"
                          style={{
                            fontSize: 13,
                            color: "#8015e8",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {m.role}
                        </p>
                      )}
                      <h3
                        className="font-bold"
                        style={{
                          fontSize: 22,
                          lineHeight: "28px",
                          color: "var(--text-body)",
                          marginTop: 8,
                        }}
                      >
                        {m.name} {m.emoji && <span>{m.emoji}</span>}
                      </h3>
                      {m.bio && (
                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: "22px",
                            color: "var(--text-body)",
                            marginTop: 14,
                            flex: 1,
                          }}
                        >
                          {m.bio}
                        </p>
                      )}
                      {Array.isArray(m.certifications) && m.certifications.length > 0 && (
                        <ul
                          className="flex flex-wrap"
                          style={{ gap: 6, marginTop: 14, listStyle: "none", padding: 0 }}
                        >
                          {m.certifications.map((cert) => (
                            <li
                              key={cert}
                              title={CERT_INFO[cert] ?? cert}
                              className="inline-flex items-center font-semibold"
                              style={{
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 999,
                                backgroundColor: "#f3e9ff",
                                color: "#5a0ea5",
                                fontSize: 11,
                                lineHeight: "16px",
                                cursor: "help",
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              {cert}
                            </li>
                          ))}
                        </ul>
                      )}
                      {m.linkedinUrl && (
                        <Link
                          href={m.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                          style={{
                            marginTop: 16,
                            color: "#8015e8",
                            fontSize: 14,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          LinkedIn →
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      <CroSections data={croSections} primaryCtaUrl={calendlyUrl} />

      {/* Gives the page its own #book so the hero and sticky CTAs scroll here
          instead of leaving for /contact-us, like the About page. */}
      <CalendlySection
        heading="Let's design the way your business should run."
        subheading="30 minutes. No obligation. Speak to a consultant, not a salesperson."
      />
    </div>
  )
}
