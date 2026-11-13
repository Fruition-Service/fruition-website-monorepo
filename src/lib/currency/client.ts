"use client"

import { useSyncExternalStore } from "react"
import { currency, type CurrencyCode } from "./kit"
import { mountCurrency, type CurrencyController, type CurrencyState } from "./dom"

/*
 * One currency controller per browser tab, shared by <CurrencyRuntime/> (which
 * starts it), <Price/> and the footer switcher. Server render and first
 * hydration always see `null`, so the static HTML carries the canonical
 * figures and React never sees a hydration mismatch; the converted figures
 * arrive right after.
 */

const EVENT = "fruition:currency"
let controller: CurrencyController | null = null
/** Staff surfaces keep every figure exactly as stored. */
export const STAFF_PATH = /^\/(internal|studio)(\/|$)/

export function startCurrency(): CurrencyController {
  if (!controller) {
    controller = mountCurrency(window, currency, {
      detect: true,
      defer: true,
      isActive: () => !STAFF_PATH.test(window.location.pathname),
    })
  }
  return controller
}

export function setDisplayCurrency(code: CurrencyCode) {
  startCurrency().set(code)
}

function subscribe(fn: () => void) {
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}
const snapshot = () => (window as unknown as { __fruitionCurrency?: CurrencyState }).__fruitionCurrency ?? null
const serverSnapshot = () => null

/** The visitor's display currency, or null until it is known (and always on the server). */
export function useDisplayCurrency(): CurrencyState | null {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
