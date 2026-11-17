"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { CallOffice } from "@/lib/callOffices"

/**
 * Carries `siteSettings.offices` (phone numbers included) from the root layout,
 * which already loads Site Settings, down to the booking band. The band renders
 * as a client component on 40+ pages and cannot fetch it itself. Same pattern
 * as OfficeStrapProvider; the nav reads the same field, so the numbers have one
 * source.
 */
const CallOfficesContext = createContext<CallOffice[]>([])

export function CallOfficesProvider({ value, children }: { value: CallOffice[]; children: ReactNode }) {
  return <CallOfficesContext.Provider value={value}>{children}</CallOfficesContext.Provider>
}

export function useCallOffices(): CallOffice[] {
  return useContext(CallOfficesContext)
}
