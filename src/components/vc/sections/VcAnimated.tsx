"use client"

import { useEffect, useRef, type ReactNode } from "react"

/**
 * The section element for the animated home blocks. It only adds behaviour:
 * the markup inside is server-rendered content, and these effects toggle
 * classes and inline widths on it, exactly as the approved mock-up does
 * (ported from MethodTimeline and IndustriesHub).
 */

const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
const all = (root: Element, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))

/** Method: one clock drives the week marker, the gantt bars and the step bars. */
function runMethod(root: HTMLElement) {
  const CYCLE = 22000
  const WEEKS = 12
  const STEPS = [[1, 2], [3, 5], [6, 9], [10, 12]]
  const marker = root.querySelector<HTMLElement>(".mt-marker")
  const label = root.querySelector<HTMLElement>(".mt-mlabel")
  const bars = all(root, ".mt-bar span")
  const progs = all(root, ".mt-prog span")
  const steps = all(root, ".mt-step")
  const setWeek = (week: number) => {
    steps.forEach((s, i) => s.classList.toggle("on", week >= STEPS[i][0] && week <= STEPS[i][1]))
    if (label) label.textContent = `W${week}`
  }
  if (reduced()) {
    ;[...bars, ...progs].forEach((e) => (e.style.width = "100%"))
    if (marker) marker.style.left = "100%"
    setWeek(WEEKS)
    return () => {}
  }
  if (!marker) return () => {}
  let raf = 0
  let lastWeek = 0
  const start = performance.now()
  const tick = (now: number) => {
    const p = ((now - start) % CYCLE) / CYCLE
    const el = p * WEEKS
    const week = Math.min(WEEKS, Math.floor(el) + 1)
    if (week !== lastWeek) {
      setWeek(week)
      lastWeek = week
    }
    marker.style.left = `${p * 100}%`
    STEPS.forEach((st, i) => {
      const f = Math.max(0, Math.min(1, (el - (st[0] - 1)) / (st[1] - (st[0] - 1))))
      const w = `${f * 100}%`
      if (bars[i]) bars[i].style.width = w
      if (progs[i]) progs[i].style.width = w
    })
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

/** Industries: the highlight walks every chip, the active board feeds the hub. */
function runIndustries(root: HTMLElement) {
  const cards = all(root, ".in-card")
  if (!cards.length) return () => {}
  const chips = cards.map((c) => all(c, ".in-chip"))
  const total = chips.reduce((a, c) => a + c.length, 0)
  const offs: number[] = []
  let acc = 0
  chips.forEach((c) => {
    offs.push(acc)
    acc += c.length
  })
  const stems = all(root, ".in-stem")
  const bus = root.querySelector<HTMLElement>(".in-busact")
  const idle = all(root, ".in-beam.idle")
  const act = all(root, ".in-beam.act")
  let step = 0
  let lastCard = -1
  const render = () => {
    let ac = 0
    for (let i = 0; i < cards.length; i++) if (step >= offs[i] && step < offs[i] + chips[i].length) ac = i
    cards.forEach((c, i) => c.classList.toggle("on", i === ac))
    chips.forEach((list, i) => list.forEach((ch, j) => ch.classList.toggle("on", i === ac && j === step - offs[i])))
    stems.forEach((s, i) => s.classList.toggle("on", i === ac))
    const x = 12.5 + 25 * ac
    if (bus) {
      bus.style.left = `${Math.min(x, 50)}%`
      bus.style.width = `${Math.abs(50 - x)}%`
    }
    if (ac !== lastCard) {
      idle.forEach((b, i) => (b.style.visibility = i === ac ? "hidden" : "visible"))
      act.forEach((b) => {
        b.style.animationName = "none"
        void b.offsetWidth
        b.style.animationName = `vc-fruEnergy${ac}`
      })
      lastCard = ac
    }
  }
  render()
  if (reduced()) return () => {}
  const id = setInterval(() => {
    step = (step + 1) % total
    render()
  }, 1100)
  return () => clearInterval(id)
}

export default function VcAnimated({
  kind,
  className,
  id,
  dataSec,
  children,
}: {
  kind: string
  className?: string
  id?: string
  dataSec?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (kind === "method") return runMethod(el)
    if (kind === "industries") return runIndustries(el)
  }, [kind])
  return (
    <section ref={ref} className={className} id={id} data-sec={dataSec}>
      {children}
    </section>
  )
}
