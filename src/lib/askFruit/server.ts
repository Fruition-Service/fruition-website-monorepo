/**
 * Request plumbing shared by the Ask Fruit route handlers: visitor identity,
 * origin checks, rate and budget limits, and keeping a turn alive on the Worker.
 */
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { Usage } from "./store"

export const VISITOR_COOKIE = "ask_fruit_vid"
const VISITOR_RE = /^[0-9a-f-]{36}$/

/**
 * The visitor id from the httpOnly cookie, or a new one. `isNew` tells the
 * caller to set the cookie on its response. The cookie is the only credential:
 * a random v4 UUID nobody else can guess, never exposed to page scripts.
 */
export async function getVisitor(): Promise<{ id: string; isNew: boolean }> {
  const value = (await cookies()).get(VISITOR_COOKIE)?.value
  if (value && VISITOR_RE.test(value)) return { id: value, isNew: false }
  return { id: crypto.randomUUID(), isNew: true }
}

export function withVisitorCookie<T extends Response>(res: T, visitor: { id: string; isNew: boolean }): T {
  if (visitor.isNew) {
    res.headers.append(
      "Set-Cookie",
      `${VISITOR_COOKIE}=${visitor.id}; Path=/; Max-Age=${60 * 60 * 24 * 365}; HttpOnly; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    )
  }
  return res
}

/**
 * Reject cross-site writes. Browsers always send Origin on a fetch POST/PATCH;
 * it must match the host the request came in on (www, workers.dev preview or
 * localhost alike).
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return false
  try {
    return new URL(origin).host === new URL(req.url).host || new URL(origin).host === req.headers.get("host")
  } catch {
    return false
  }
}

export async function hashIp(req: Request): Promise<string | null> {
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  if (!ip) return null
  const salt = process.env.ASK_FRUIT_IP_SALT || "ask-fruit"
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32)
}

function intEnv(name: string, fallback: number): number {
  const n = Number(process.env[name])
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function limits() {
  return {
    visitorHour: intEnv("ASK_FRUIT_VISITOR_HOURLY_TURNS", 20),
    visitorDay: intEnv("ASK_FRUIT_VISITOR_DAILY_TURNS", 60),
    ipDay: intEnv("ASK_FRUIT_IP_DAILY_TURNS", 150),
    dailyBudgetUsd: intEnv("ASK_FRUIT_DAILY_BUDGET_USD", 40),
  }
}

/** The first limit this usage breaks, as a visitor-facing message, or null. */
export function limitBreach(usage: Usage, l = limits()): { code: string; message: string } | null {
  if (usage.cost_day >= l.dailyBudgetUsd) {
    return { code: "DAILY_CAPACITY", message: "Fruit has reached today's capacity. Book a call and a consultant will pick this up with you." }
  }
  if (usage.visitor_hour >= l.visitorHour) {
    return { code: "RATE_LIMITED", message: "You have sent a lot of messages this hour. Take a short break and try again." }
  }
  if (usage.visitor_day >= l.visitorDay || usage.ip_day >= l.ipDay) {
    return { code: "RATE_LIMITED", message: "You have reached today's message limit. Book a call to keep going with a consultant." }
  }
  return null
}

export function askFruitEnabled(): boolean {
  return process.env.ASK_FRUIT_ENABLED !== "false" && Boolean(process.env.OPENROUTER_API_KEY)
}

export function jsonError(status: number, code: string, message: string, retryable = false) {
  return NextResponse.json({ error: { code, message, retryable } }, { status, headers: { "Cache-Control": "no-store" } })
}

/** Keep the Worker alive until `promise` settles, even if the visitor disconnects. */
export function keepAlive(promise: Promise<unknown>): void {
  try {
    getCloudflareContext().ctx.waitUntil(promise)
  } catch {
    // next dev without the Cloudflare context: the Node process outlives the request anyway.
    void promise
  }
}
