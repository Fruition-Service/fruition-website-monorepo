import Image from "next/image"
import CtaButton from "@/components/CtaButton"
import { HERO_NODES, ORBIT_LOGOS } from "./data"

/** Packets that travel along a connector path, with per-path colour + timing. */
const PACKETS = [
  { path: "M280 74 L280 214", color: "var(--purple-primary)", dur: "2.8s", delay: "0s" },
  { path: "M128 138 L242 210", color: "var(--accent-blue)", dur: "3.4s", delay: "0.6s" },
  { path: "M432 138 L318 210", color: "var(--purple-primary)", dur: "3.1s", delay: "1.1s" },
  { path: "M456 306 L330 256", color: "var(--purple-light)", dur: "3s", delay: "1.7s" },
  { path: "M368 418 L302 280", color: "var(--purple-primary)", dur: "3.5s", delay: "2.4s" },
]

/** Connectors that carry a travelling dash in addition to the static hairline. */
const FLOWING = [
  { path: "M280 74 L280 214", delay: "0s" },
  { path: "M432 138 L318 210", delay: "1.3s" },
  { path: "M192 418 L258 280", delay: "2.2s" },
  { path: "M104 306 L230 256", delay: "3.1s" },
]

const CONNECTORS = [
  "M280 74 L280 214",
  "M128 138 L242 210",
  "M432 138 L318 210",
  "M104 306 L230 256",
  "M456 306 L330 256",
  "M192 418 L258 280",
  "M368 418 L302 280",
]

const ORBIT_RADIUS = 196
const ORBIT_STEP = 30

interface Props {
  bookingHref: string
}

/**
 * Hero — the "network" variant from the design: copy on the left, and on the
 * right an animated data-flow graphic where platform pills feed a Fruition hub
 * while a ring of integration logos orbits behind it.
 *
 * The graphic is authored at a fixed 620×580 and scaled down per breakpoint
 * rather than reflowed, since every node is absolutely positioned against the
 * same 560×480 SVG canvas. It is decorative and `aria-hidden`.
 */
export default function HeroNetwork({ bookingHref }: Props) {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(820px 420px at 78% 42%, var(--purple-tint) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1348px] grid-cols-1 items-center gap-10 px-5 pt-14 pb-10 md:px-8 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-[88px] lg:pb-12">
        <div className="flex flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-[9px] rounded-pill border border-lilac-strong bg-tint py-[7px] pr-4 pl-[13px] text-[13px] font-semibold tracking-[0.01em] text-brand">
            <span className="text-[15px] leading-none">🏆</span>Rising Star 2026
          </div>
          <h1 className="text-display text-foreground lg:text-[52px] lg:leading-[1.16]" style={{ textWrap: "pretty" }}>
            Implementation, integration and AI advisory for{" "}
            <span className="text-brand">monday.com, Atlassian and HubSpot.</span>
          </h1>
          <p className="text-body-lead mt-6 max-w-[560px] text-muted">
            Fruition is a monday.com Platinum Partner helping small businesses, mid-market and
            enterprise teams across Australia, India, the Philippines, Singapore, the UK and the US.
            We design the way work should run — build it, and help you maintain it.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <CtaButton href={bookingHref} label="Book a discovery call" variant="primary" />
            <CtaButton href="#services" label="Explore our services" variant="outline" />
          </div>
          <div className="mt-11 flex items-center gap-[18px]">
            <Image
              src="/monday-marketing-partner.avif"
              alt="monday.com Platinum Partner"
              width={140}
              height={42}
              className="h-[42px] w-auto"
            />
            <span className="h-[30px] w-px bg-ui" />
            <span className="text-caption text-muted">900+ implementations · 6 markets</span>
          </div>
        </div>

        <HeroGraphic />
      </div>
    </section>
  )
}

function HeroGraphic() {
  return (
    <div
      aria-hidden
      className="relative hidden h-[460px] justify-self-center overflow-hidden md:flex md:w-full md:items-center md:justify-center lg:h-[620px]"
    >
      {/* Fixed-size stage, scaled to fit the breakpoint. */}
      <div className="relative h-[580px] w-[620px] shrink-0 scale-[0.72] lg:scale-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(460px 340px at 50% 49%, #faf8ff 0%, rgba(250,248,255,0) 72%)",
          }}
        />

        {/* Integration ring: the ring rotates, each badge counter-rotates so
            its logo stays upright. */}
        <div
          className="home-anim-orbit absolute top-1/2 left-1/2 z-0 h-0 w-0 origin-top-left"
          style={{ animation: "fruSpin 100s linear infinite" }}
        >
          {ORBIT_LOGOS.map((logo, i) => (
            <div
              key={logo.slug}
              className="absolute origin-top-left"
              style={{ transform: `rotate(${i * ORBIT_STEP}deg) translate(0, -${ORBIT_RADIUS}px)` }}
            >
              <div
                className="home-anim-orbit origin-top-left"
                style={{ animation: "fruSpinRev 100s linear infinite" }}
              >
                <div
                  className="flex h-11 w-11 origin-top-left items-center justify-center rounded-full border border-lilac bg-surface shadow-[0_3px_14px_rgba(16,0,58,0.05)]"
                  style={{ transform: `rotate(${-i * ORBIT_STEP}deg) translate(-50%, -50%)` }}
                >
                  <Image
                    src={`/images/home/logos/${logo.slug}.svg`}
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                    className="block h-5 w-5 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
          <div
            className="absolute origin-top-left"
            style={{ transform: `rotate(${11 * ORBIT_STEP}deg) translate(0, -${ORBIT_RADIUS}px)` }}
          >
            <div
              className="home-anim-orbit origin-top-left"
              style={{ animation: "fruSpinRev 100s linear infinite" }}
            >
              <div
                className="flex h-11 w-11 origin-top-left items-center justify-center rounded-full border border-dashed border-[#cbb2f2] bg-tint text-[12.5px] font-bold text-brand"
                style={{ transform: `rotate(${-11 * ORBIT_STEP}deg) translate(-50%, -50%)` }}
              >
                +40
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[55px] left-[30px] z-[1] h-[480px] w-[560px]">
          <svg width="560" height="480" viewBox="0 0 560 480" className="absolute inset-0" aria-hidden>
            {CONNECTORS.map((d) => (
              <path key={d} d={d} stroke="var(--border-lilac-strong)" strokeWidth="1.5" fill="none" />
            ))}
            {FLOWING.map((f) => (
              <path
                key={f.path}
                d={f.path}
                stroke="var(--purple-mid)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="6 60"
                className="home-anim-dash"
                style={{ animation: `fruDash 4s linear infinite`, animationDelay: f.delay }}
              />
            ))}
          </svg>

          {PACKETS.map((p) => (
            <div
              key={p.path + p.delay}
              className="home-anim-packet absolute h-[9px] w-[9px] rounded-full"
              style={{
                background: p.color,
                boxShadow: `0 0 10px ${p.color}`,
                offsetPath: `path('${p.path}')`,
                animation: `fruTravel ${p.dur} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            />
          ))}

          {/* Hub */}
          <div className="absolute top-[235px] left-[280px] -translate-x-1/2 -translate-y-1/2">
            <div
              className="home-anim-ring absolute top-1/2 left-1/2 -mt-[52px] -ml-[52px] h-[104px] w-[104px] rounded-full border-[1.5px] border-[#d9c3f8]"
              style={{ animation: "fruRing 3.2s ease-out infinite" }}
            />
            <div className="relative h-[104px] w-[104px] overflow-hidden rounded-full border border-lilac bg-surface shadow-[0_18px_40px_-18px_rgba(128,21,232,0.4)]">
              <Image
                src="/images/home/fruition-hub.png"
                alt=""
                width={104}
                height={104}
                className="block h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Platform pills */}
          {HERO_NODES.map((node, i) => (
            <div
              key={node.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
            >
              <div
                className="home-anim-float flex items-center gap-[10px] rounded-pill border border-lilac bg-surface px-[19px] py-[11px] text-[14.5px] font-semibold whitespace-nowrap text-body shadow-[0_6px_22px_rgba(16,0,58,0.07)]"
                style={{ animation: "fruFloat 6s ease-in-out infinite", animationDelay: `${i * 0.9}s` }}
              >
                <Image
                  src={`/images/home/logos/${node.slug}.svg`}
                  alt=""
                  width={22}
                  height={22}
                  unoptimized
                  className="block h-[22px] w-[22px] shrink-0 object-contain"
                />
                {node.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
