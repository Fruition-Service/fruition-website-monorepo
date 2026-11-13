"use client"

import { useId, useMemo, useState } from "react"
import type { RoiCalcConfig } from "./types"

interface RoiCalculatorProps {
  config?: RoiCalcConfig
}

/**
 * Interactive ROI / time-saved calculator. Two sliders (team size, hours/week
 * lost to manual updates) drive a live estimate of weekly/yearly hours and
 * dollars reclaimed by automation. Drives dwell time + personalized proof of
 * value (per PDF). Kept to 2 inputs to avoid fatigue.
 */
export default function RoiCalculator({ config = {} }: RoiCalculatorProps) {
  const {
    heading = "Calculate your savings",
    subheading = "Estimate the time and money automation reclaims for your team.",
    defaultTeamSize = 10,
    defaultHoursPerWeek = 6,
    hourlyRate = 45,
    reclaimRate = 0.7,
    currencySymbol = "$",
  } = config

  const [teamSize, setTeamSize] = useState(defaultTeamSize)
  const [hoursPerWeek, setHoursPerWeek] = useState(defaultHoursPerWeek)
  const uid = useId()

  const { weeklyHours, yearlyHours, yearlyDollars } = useMemo(() => {
    const reclaimedWeekly = teamSize * hoursPerWeek * reclaimRate
    const reclaimedYearly = reclaimedWeekly * 52
    return {
      weeklyHours: Math.round(reclaimedWeekly),
      yearlyHours: Math.round(reclaimedYearly),
      yearlyDollars: Math.round(reclaimedYearly * hourlyRate),
    }
  }, [teamSize, hoursPerWeek, reclaimRate, hourlyRate])

  const fmt = (n: number) => n.toLocaleString("en-US")

  return (
    <section className="px-4 py-[80px] bg-brand-soft">
      <style>{`
        .roi-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: var(--purple-track);
          outline: none;
          cursor: pointer;
        }
        .roi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--purple-primary);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--purple-primary) 45%, transparent);
          cursor: pointer;
        }
        .roi-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--purple-primary);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--purple-primary) 45%, transparent);
          cursor: pointer;
        }
        .roi-range::-moz-range-track { height: 8px; border-radius: 999px; background: var(--purple-track); }
      `}</style>
      <div className="mx-auto max-w-[920px]">
        <div className="text-center mb-9">
          <h2 className="text-section-h2 text-body">{heading}</h2>
          {subheading && (
            <p className="text-muted text-[17px] leading-[26px] mt-3">{subheading}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
          {/* Inputs */}
          <div className="rounded-card bg-surface-raised flex flex-col justify-center h-full p-9 border border-brand-soft shadow-[0_18px_36px_-24px_color-mix(in_srgb,var(--purple-dark)_20%,transparent)] dark:shadow-none dark:border dark:border-ui">
            <Slider
              id={`${uid}-team`}
              label="Team size"
              value={teamSize}
              min={1}
              max={250}
              suffix={teamSize === 1 ? "person" : "people"}
              onChange={setTeamSize}
            />
            <div className="h-9" />
            <Slider
              id={`${uid}-hours`}
              label="Hours/week each person loses to manual updates"
              value={hoursPerWeek}
              min={1}
              max={40}
              suffix={hoursPerWeek === 1 ? "hour" : "hours"}
              onChange={setHoursPerWeek}
            />
          </div>

          {/* Outputs */}
          <div className="rounded-card flex flex-col justify-center h-full p-9 text-white bg-[linear-gradient(-38deg,var(--purple-primary)_0%,var(--dark-bg)_100%)]">
            <Result big value={`${fmt(yearlyHours)} hrs`} label="reclaimed per year" />
            <div className="h-5" />
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <Result value={`${fmt(weeklyHours)} hrs`} label="per week" />
              <Result value={`${currencySymbol}${fmt(yearlyDollars)}`} label="saved per year" />
            </div>
            <p className="text-xs leading-[18px] text-white/60 mt-[22px]">
              Estimate assumes automation reclaims ~{Math.round(reclaimRate * 100)}% of manual hours at a{" "}
              {currencySymbol}
              {hourlyRate}/hr fully-loaded cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  suffix: string
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-3.5">
        <label htmlFor={id} className="font-medium text-[17px] leading-6 text-body max-w-[65%]">
          {label}
        </label>
        <span className="font-bold shrink-0 font-mono text-[28px] leading-[30px] text-brand">
          {value} <span className="font-mono text-xs font-semibold text-muted">{suffix}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range"
      />
    </div>
  )
}

function Result({ value, label, big = false }: { value: string; label: string; big?: boolean }) {
  return (
    <div>
      <div
        className={`font-bold font-mono leading-[1.1] break-words ${
          big ? "text-[clamp(28px,8vw,44px)]" : "text-[clamp(20px,5vw,26px)]"
        }`}
      >
        {value}
      </div>
      <div className="font-mono text-xs font-semibold text-white/70 mt-1">{label}</div>
    </div>
  )
}
