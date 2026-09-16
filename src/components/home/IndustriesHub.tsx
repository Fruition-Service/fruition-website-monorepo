"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { INDUSTRIES } from "./data"

const TOTAL_CHIPS = INDUSTRIES.reduce((sum, card) => sum + card.chips.length, 0)
const STEP_MS = 1100

/** Index of the first chip belonging to each card. */
const CHIP_OFFSETS = INDUSTRIES.reduce<number[]>((acc, card, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + INDUSTRIES[i - 1].chips.length)
  return acc
}, [])

/**
 * Industries — four focus areas whose sub-sectors light up one at a time,
 * with the active board sending energy down into the Fruition hub.
 *
 * The highlight walks every chip in sequence (15 in total) so the section
 * quietly enumerates the full list rather than looping four headline cards.
 * The connector graphic only renders at `lg`, where the four columns line up
 * with the stems; below that the cards stack and the hub is dropped.
 */
export default function IndustriesHub() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setStep((s) => (s + 1) % TOTAL_CHIPS), STEP_MS)
    return () => clearInterval(id)
  }, [])

  const activeCard = INDUSTRIES.findIndex(
    (card, i) => step >= CHIP_OFFSETS[i] && step < CHIP_OFFSETS[i] + card.chips.length
  )
  const activeX = 12.5 + 25 * Math.max(0, activeCard)

  return (
    <section id="industries" className="relative scroll-mt-24 overflow-hidden bg-surface-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 70% 85%, rgba(128,21,232,0.2) 0%, rgba(128,21,232,0) 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1348px] px-5 py-16 md:px-8 md:py-20 lg:pt-24 lg:pb-18">
        <div className="max-w-[760px]">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-amber">
            Industries we focus on
          </p>
          <h2 className="text-section-h2 mt-4 text-white">Four industries. One method.</h2>
          <p className="text-body mt-4 text-white/65 lg:text-[17px]">
            We work deep in a small set of industries — so your processes aren&apos;t new to us.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-5 lg:mt-14 lg:grid-cols-4">
          {INDUSTRIES.map((card, ci) => {
            const isActive = ci === activeCard
            const activeChip = step - CHIP_OFFSETS[ci]
            return (
              <div
                key={card.num}
                className={`rounded-[20px] p-4 transition-all duration-400 md:p-6.5 ${
                  isActive
                    ? "border border-[rgba(186,131,240,0.5)] bg-white/6"
                    : "border border-white/10 bg-white/4"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full font-mono text-xs transition-all duration-400 ${
                      isActive
                        ? "border border-amber text-amber shadow-[0_0_14px_rgba(253,171,61,0.3)]"
                        : "border border-white/35 text-white/70"
                    }`}
                  >
                    {card.num}
                  </span>
                  <span className="text-[15px] font-semibold break-words text-white md:text-xl">{card.title}</span>
                </div>
                <p className="mt-3 text-[12.5px] text-white/60 md:mt-3.5 md:text-[13.5px]">{card.tagline}</p>
                <div className="mt-4 flex flex-col items-start gap-2">
                  {card.chips.map((chip, j) => {
                    const chipActive = isActive && j === activeChip
                    return (
                      <span
                        key={chip}
                        className={`inline-flex max-w-full items-center gap-2 rounded-pill px-2.5 py-[6px] text-[12px] transition-all duration-400 md:px-3.5 md:py-[7px] md:text-[13px] md:whitespace-nowrap ${
                          chipActive
                            ? "border border-[rgba(186,131,240,0.9)] bg-brand text-white shadow-[0_6px_18px_-6px_rgba(128,21,232,0.8)]"
                            : "border border-white/10 bg-white/5 text-white/75"
                        }`}
                      >
                        <span
                          className={`inline-block h-[5px] w-[5px] flex-none rounded-full transition-colors duration-400 ${
                            chipActive ? "bg-amber" : "bg-brand-light"
                          }`}
                        />
                        {chip}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Connector: each board stems down to a shared bus, which feeds the hub. */}
        <div className="relative hidden h-[150px] lg:block" aria-hidden>
          {INDUSTRIES.map((card, ci) => (
            <div
              key={card.num}
              className="absolute top-0 h-11 w-px transition-all duration-400"
              style={{
                left: `${12.5 + 25 * ci}%`,
                background:
                  ci === activeCard
                    ? "linear-gradient(to bottom, rgba(186,131,240,0.95), rgba(186,131,240,0.4))"
                    : "rgba(186,131,240,0.26)",
                boxShadow: ci === activeCard ? "0 0 10px rgba(186,131,240,0.55)" : "none",
              }}
            />
          ))}
          <div className="absolute top-11 right-[12.5%] left-[12.5%] h-px bg-[rgba(186,131,240,0.3)]" />
          <div
            className="absolute top-11 z-[2] h-px transition-all duration-500"
            style={{
              left: `${Math.min(activeX, 50)}%`,
              width: `${Math.abs(50 - activeX)}%`,
              background: "rgba(186,131,240,0.75)",
              boxShadow: "0 0 10px rgba(186,131,240,0.5)",
            }}
          />
          <div className="absolute top-11 left-1/2 h-[42px] w-0.5 -translate-x-1/2 overflow-hidden rounded-sm bg-gradient-to-b from-white via-brand-light to-brand shadow-[0_0_12px_3px_rgba(186,131,240,0.65)]">
            <span
              className="home-anim-stem absolute right-0 left-0 block h-3.5 bg-gradient-to-b from-transparent via-white to-transparent"
              style={{ animation: "fruStemFlow 1.6s linear infinite" }}
            />
          </div>
          {INDUSTRIES.map((_, ci) => {
            const on = ci === activeCard
            const beams = on ? [0, 0.55, 1.1] : [ci * 0.65]
            return beams.map((delay, k) => (
              <div
                key={`${ci}-${k}`}
                className="home-anim-energy absolute top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${12.5 + 25 * ci}%`,
                  width: on ? (k === 0 ? 9 : 6) : 4,
                  height: on ? (k === 0 ? 9 : 6) : 4,
                  background: on ? "#ffffff" : "rgba(186,131,240,0.85)",
                  boxShadow: on
                    ? `0 0 ${k === 0 ? 18 : 12}px ${k === 0 ? 5 : 3}px rgba(186,131,240,${k === 0 ? 0.9 : 0.6})`
                    : "0 0 8px 2px rgba(186,131,240,0.35)",
                  zIndex: on ? 3 : 1,
                  animation: `fruEnergy${ci} ${on ? 2.6 : 4.2}s cubic-bezier(0.45,0,0.55,1) ${delay}s infinite`,
                }}
              />
            ))
          })}
          <div
            className="home-anim-hub absolute top-[86px] left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-pill border border-[rgba(186,131,240,0.45)] px-7.5 py-3.25"
            style={{ animation: "fruHubCharge 2.6s linear infinite" }}
          >
            <Image
              src="/images/logo-fruition-white.svg"
              alt=""
              width={88}
              height={22}
              unoptimized
              className="block h-[22px] w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
