import { Check } from "lucide-react"
import CtaButton from "@/components/CtaButton"
import Reveal from "./Reveal"
import { AI_TILES, type AiTile } from "./data"
import { homeText, type HomeCopy, type HomeCopySlot } from "./copy"

const POINTS: HomeCopySlot[] = ["ai-point-1", "ai-point-2", "ai-point-3"]

const TILE_W = 138
const TILE_H = 102
const COL_GAP = 168
const ROW_GAP = 140

/** Face gradient + extrusion stack per tone, giving each tile its depth. */
const TONES: Record<AiTile["tone"], { face: string; shadow: string; label: string; sub: string }> = {
  next: {
    face: "linear-gradient(135deg, #f6f1ff 0%, #e5daf9 100%)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.9), -3px 3px 0 #dccdf6, -6px 6px 0 #d3c2f2, -9px 9px 0 #cab6ee, -12px 12px 0 #c1aae9, -15px 15px 0 #b79ee4, -18px 18px 0 #ae92df, -34px 40px 40px rgba(52,10,100,0.16)",
    label: "#4a3670",
    sub: "rgba(74,54,112,0.6)",
  },
  live: {
    face: "linear-gradient(135deg, #9c3af2 0%, #7a10e0 100%)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.35), -3px 3px 0 #6f14c9, -6px 6px 0 #6712bd, -9px 9px 0 #5f10b1, -12px 12px 0 #570ea5, -15px 15px 0 #4f0c99, -18px 18px 0 #470a8d, -34px 40px 40px rgba(52,10,100,0.24)",
    label: "#ffffff",
    sub: "rgba(255,255,255,0.72)",
  },
  liveAlt: {
    face: "linear-gradient(135deg, #b062f5 0%, #8a25e8 100%)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.35), -3px 3px 0 #7b1fd4, -6px 6px 0 #731cc7, -9px 9px 0 #6b19ba, -12px 12px 0 #6316ad, -15px 15px 0 #5b13a0, -18px 18px 0 #531093, -34px 40px 40px rgba(52,10,100,0.22)",
    label: "#ffffff",
    sub: "rgba(255,255,255,0.72)",
  },
  core: {
    face: "linear-gradient(135deg, #4a0d86 0%, #1b0338 100%)",
    shadow:
      "inset 0 1px 0 rgba(186,131,240,0.45), -3px 3px 0 #2c0656, -6px 6px 0 #28054e, -9px 9px 0 #240446, -12px 12px 0 #20043e, -15px 15px 0 #1c0336, -18px 18px 0 #18032e, -21px 21px 0 #150226, -24px 24px 0 #12021f, -38px 46px 46px rgba(52,10,100,0.34), 0 0 34px rgba(128,21,232,0.4)",
    label: "#ffffff",
    sub: "rgba(255,255,255,0.72)",
  },
}

/** Packet paths between tiles: horizontal runs and vertical drops. */
const H_LINKS = [
  { left: 138, top: 190, live: "0s" },
  { left: 306, top: 190, live: "1.4s" },
  { left: 474, top: 190, live: "0.8s" },
  { left: 138, top: 50 },
  { left: 474, top: 50 },
  { left: 306, top: 330 },
]
const V_LINKS = [
  { left: 168, top: 102, live: "0.4s" },
  { left: 404, top: 102, live: "1.6s" },
  { left: 236, top: 242, live: "1.1s" },
  { left: 572, top: 242 },
]

const LEGEND: { swatch: string; labelSlot: HomeCopySlot; strong: boolean }[] = [
  { swatch: "linear-gradient(135deg, #4a0d86, #1b0338)", labelSlot: "ai-legend-1", strong: true },
  { swatch: "linear-gradient(135deg, #9c3af2, #7a10e0)", labelSlot: "ai-legend-2", strong: false },
  { swatch: "linear-gradient(135deg, #f6f1ff, #d9caf5)", labelSlot: "ai-legend-3", strong: false },
]

interface Props {
  bookingHref: string
  copy: HomeCopy
}

/**
 * AI capability — the business functions laid out as an isometric board with
 * the AI layer sitting underneath them all.
 *
 * The board is a CSS 3D transform of a fixed 642×382 plane, so like the hero it
 * is scaled rather than reflowed and is hidden on the narrowest screens where
 * the tile labels would be unreadable.
 */
export default function AiCapability({ bookingHref, copy }: Props) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--purple-tint) 0%, var(--purple-tint-deep) 46%, var(--surface) 100%)",
      }}
    >
      <div className="mx-auto grid max-w-[1348px] grid-cols-1 items-center gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[384px_1fr] lg:pt-19 lg:pb-28">
        <Reveal>
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">{homeText(copy, "ai-eyebrow")}</p>
          <h2 className="text-section-h2 mt-4 text-foreground" style={{ textWrap: "pretty" }}>
            {homeText(copy, "ai-heading")}
          </h2>
          <p className="text-body mt-5 text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
            {homeText(copy, "ai-lead")}
          </p>
          <div className="mt-7 flex flex-col gap-3.25">
            {POINTS.map((pointSlot) => (
              <span key={pointSlot} className="flex items-center gap-2.5 text-[15px] font-medium text-body">
                <Check size={15} strokeWidth={3} className="flex-none text-brand" aria-hidden />
                {homeText(copy, pointSlot)}
              </span>
            ))}
          </div>
          <div className="mt-9">
            <CtaButton href={bookingHref} label={homeText(copy, "ai-cta")} variant="primary" />
          </div>
        </Reveal>

        <div
          aria-hidden
          className="relative hidden h-[420px] items-center justify-center md:flex lg:h-[600px]"
          style={{ perspective: "1800px" }}
        >
          <div className="relative h-[600px] w-full scale-[0.62] lg:scale-100">
            <div
              className="absolute top-[52%] left-1/2 h-[382px] w-[642px]"
              style={{
                transform: "translate(-50%, -50%) rotateX(49deg) rotateZ(-45deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Ground grid */}
              <div className="absolute -top-17.5 -right-19.5 -bottom-17.5 -left-19.5" style={{ transform: "translateZ(-1px)" }}>
                {[63, 231, 399, 567, 735].map((x) => (
                  <div key={x} className="absolute top-0 bottom-0 w-px bg-[rgba(128,21,232,0.09)]" style={{ left: x }} />
                ))}
                {[51, 191, 331, 471].map((y) => (
                  <div key={y} className="absolute right-0 left-0 h-px bg-[rgba(128,21,232,0.09)]" style={{ top: y }} />
                ))}
              </div>

              <div
                className="pointer-events-none absolute top-[141px] left-[69px] h-50 w-50 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(128,21,232,0.22), rgba(128,21,232,0) 70%)",
                  transform: "translateZ(-1px)",
                }}
              />

              {H_LINKS.map((link) => (
                <div
                  key={`h${link.left}-${link.top}`}
                  className="absolute h-0.5 w-7.5"
                  style={{
                    left: link.left,
                    top: link.top,
                    background: link.live ? "rgba(128,21,232,0.34)" : "rgba(128,21,232,0.2)",
                    transform: "translateZ(2px)",
                  }}
                >
                  {link.live && (
                    <span
                      className="home-anim-run absolute -top-0.5 left-0 -ml-[3px] h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_rgba(128,21,232,0.9)]"
                      style={{ animation: "fruRunX 2.2s linear infinite", animationDelay: link.live }}
                    />
                  )}
                </div>
              ))}
              {V_LINKS.map((link) => (
                <div
                  key={`v${link.left}-${link.top}`}
                  className="absolute h-9.5 w-0.5"
                  style={{
                    left: link.left,
                    top: link.top,
                    background: link.live ? "rgba(128,21,232,0.34)" : "rgba(128,21,232,0.2)",
                    transform: "translateZ(2px)",
                  }}
                >
                  {link.live && (
                    <span
                      className="home-anim-run absolute -left-0.5 top-0 -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_rgba(128,21,232,0.9)]"
                      style={{ animation: "fruRunY 2.2s linear infinite", animationDelay: link.live }}
                    />
                  )}
                </div>
              ))}

              {AI_TILES.map((tile) => {
                const tone = TONES[tile.tone]
                const isCore = tile.tone === "core"
                return (
                  <div
                    key={tile.labelSlot}
                    className={`absolute flex flex-col items-center justify-center gap-[5px] rounded-xl ${isCore ? "home-anim-tile" : ""}`}
                    style={{
                      left: tile.col * COL_GAP,
                      top: tile.row * ROW_GAP,
                      width: TILE_W,
                      height: TILE_H,
                      background: tone.face,
                      boxShadow: tone.shadow,
                      backfaceVisibility: "hidden",
                      animation: isCore ? "fruTilePop 2.6s ease-in-out infinite" : undefined,
                    }}
                  >
                    <span
                      className="text-[12.5px] font-bold tracking-[0.08em] whitespace-nowrap uppercase"
                      style={{ color: tone.label }}
                    >
                      {homeText(copy, tile.labelSlot)}
                    </span>
                    {isCore || !tile.subSlot ? (
                      <span className="h-0.5 w-7.5 rounded-sm bg-brand-light" />
                    ) : (
                      <span
                        className="text-[10px] font-semibold tracking-[0.04em]"
                        style={{ color: tone.sub }}
                      >
                        {homeText(copy, tile.subSlot)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div
              className="home-anim-legend absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-pill border border-lilac bg-white/86 px-5 py-2.75 whitespace-nowrap shadow-[0_6px_22px_rgba(52,10,100,0.08)]"
              style={{ animation: "fruLift 5s ease-in-out infinite" }}
            >
              {LEGEND.map((item, i) => (
                <span key={item.labelSlot} className="flex items-center gap-2.5">
                  {i > 0 && <span className="h-3.5 w-px bg-lilac" />}
                  <span
                    className={`flex items-center gap-2 text-[12.5px] ${item.strong ? "font-semibold text-body" : "font-medium text-muted"}`}
                  >
                    <span className="h-[11px] w-[11px] rounded-[3px]" style={{ background: item.swatch }} />
                    {homeText(copy, item.labelSlot)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
