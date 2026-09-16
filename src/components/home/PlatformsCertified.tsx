import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import Reveal from "./Reveal"

const MONDAY_POINTS = [
  "Work OS rollouts",
  "monday CRM builds",
  "Platform migrations",
  "monday AI enablement",
]

const ALSO_CERTIFIED = [
  { src: "/images/home/partner-claude.png", alt: "Claude Select Services Partner", h: 44 },
  { src: "/images/home/partner-make.png", alt: "Make Partner", h: 36 },
  { src: "/images/home/partner-aws.png", alt: "AWS Partner", h: 58 },
  { src: "/images/home/partner-googlecloud.png", alt: "Google Cloud Partner", h: 34 },
  { src: "/images/home/partner-clickup.png", alt: "ClickUp Registered Partner", h: 58 },
]

/** Platform credentials: monday.com as the anchor, Atlassian and HubSpot beside it. */
export default function PlatformsCertified() {
  return (
    <section id="platforms" className="scroll-mt-24 bg-tint py-16 md:py-20 lg:pt-25 lg:pb-19">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:gap-12">
          <div className="max-w-[680px]">
            <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">
              Certifications
            </p>
            <h2 className="text-section-h2 mt-4 text-foreground" style={{ textWrap: "pretty" }}>
              Certified where it counts.
            </h2>
            <p className="text-body-lead mt-4 text-muted" style={{ textWrap: "pretty" }}>
              Platinum on the platform we build on. Credentialled on everything it has to talk to.
            </p>
          </div>
          <div className="flex flex-none items-center gap-7 lg:pb-1.5">
            <span className="flex flex-col">
              <span className="text-3xl leading-[1.15] font-semibold tracking-[-0.02em] text-brand">
                8
              </span>
              <span className="text-[13px] text-muted">vendor certifications</span>
            </span>
            <span className="h-10 w-px bg-[#e4dcf8]" />
            <span className="flex flex-col">
              <span className="text-3xl leading-[1.15] font-semibold tracking-[-0.02em] text-brand">
                900+
              </span>
              <span className="text-[13px] text-muted">implementations</span>
            </span>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-1 items-stretch gap-5 lg:mt-12 lg:grid-cols-[1.18fr_1fr]">
          <div
            className="relative flex flex-col overflow-hidden rounded-card p-8 lg:p-11"
            style={{
              backgroundImage:
                "linear-gradient(-38deg, var(--purple-primary) -25%, var(--dark-bg-secondary) 45%, var(--dark-bg) 100%)",
            }}
          >
            <Image
              src="/images/bg-purple-circle.avif"
              alt=""
              width={600}
              height={600}
              aria-hidden
              className="pointer-events-none absolute -right-50 -bottom-60 w-[600px] max-w-none opacity-45 mix-blend-screen"
            />
            <div className="relative flex flex-1 flex-col">
              <Image
                src="/images/home/partner-monday.png"
                alt="monday.com Platinum Partner"
                width={220}
                height={84}
                className="h-[84px] w-auto max-w-full self-start object-contain"
              />
              <h3 className="text-section-h3 mt-6.5 max-w-[460px] text-white lg:text-[30px] lg:leading-[1.28]" style={{ textWrap: "pretty" }}>
                Platinum tier — the top 1% of monday.com partners.
              </h3>
              <p className="text-body mt-3.5 max-w-[470px] text-white/76" style={{ textWrap: "pretty" }}>
                Our founder spent six years in sales leadership at monday.com, so rollouts start from
                how the platform is meant to be used.
              </p>
              <div className="mt-7.5 grid grid-cols-1 gap-x-7 gap-y-3 sm:grid-cols-2">
                {MONDAY_POINTS.map((point) => (
                  <span key={point} className="flex items-center gap-[9px] text-[14.5px] font-medium text-white">
                    <Check size={15} strokeWidth={2.5} className="flex-none text-brand-light" aria-hidden />
                    <span>{point}</span>
                  </span>
                ))}
              </div>
              <Link
                href="/monday-consulting-solutions"
                className="mt-auto pt-8.5 text-[15px] font-semibold text-white hover:text-brand-light"
              >
                Our monday.com services →
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <PlatformCard
              href="/atlassian-consulting"
              logo="/images/home/partner-atlassian.png"
              logoAlt="Atlassian Platinum Solution Partner"
              logoHeight={74}
              boxHeight={78}
              title="Jira, JSM and Confluence"
              body="Service desks and engineering workflows, with accredited cloud migrations."
              cta="Our Atlassian services"
            />
            <PlatformCard
              href="/hubspot-consulting"
              logo="/images/home/partner-hubspot.png"
              logoAlt="HubSpot Solutions Partner"
              logoHeight={124}
              boxHeight={124}
              title="Marketing and sales hubs"
              body="Pipeline and campaign automation, synced two ways with monday CRM."
              cta="Our HubSpot services"
            />
          </div>
        </Reveal>

        <Reveal className="mt-5 flex flex-wrap items-center gap-x-11 gap-y-6 rounded-card border border-lilac bg-surface-raised px-6 py-7 shadow-whisper lg:px-9">
          <span className="text-micro flex-none font-bold tracking-[0.12em] uppercase text-label">
            Also certified
          </span>
          <div className="flex flex-wrap items-center gap-x-11 gap-y-6 lg:ml-auto">
            {ALSO_CERTIFIED.map((badge) => (
              <span key={badge.alt} className="flex h-[58px] items-center">
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={200}
                  height={badge.h}
                  className="w-auto object-contain"
                  style={{ height: badge.h }}
                />
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function PlatformCard({
  href,
  logo,
  logoAlt,
  logoHeight,
  boxHeight,
  title,
  body,
  cta,
}: {
  href: string
  logo: string
  logoAlt: string
  logoHeight: number
  boxHeight: number
  title: string
  body: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="ui-hover-card flex flex-1 flex-col rounded-card border border-lilac bg-surface-raised p-8 text-inherit shadow-whisper hover:border-brand-light"
    >
      <span className="flex items-center" style={{ height: boxHeight }}>
        <Image
          src={logo}
          alt={logoAlt}
          width={260}
          height={logoHeight}
          className="w-auto max-w-full object-contain"
          style={{ height: logoHeight }}
        />
      </span>
      <span className="mt-5 text-xl font-semibold tracking-[-0.01em] text-foreground">{title}</span>
      <span className="text-body-sm mt-1.75 text-muted lg:text-[14.5px]">{body}</span>
      <span className="mt-5 flex items-center gap-2 text-caption font-semibold text-brand">
        <span>{cta}</span>
        <ArrowRight size={20} strokeWidth={2} className="flex-none" aria-hidden />
      </span>
    </Link>
  )
}
