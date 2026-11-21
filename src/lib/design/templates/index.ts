import type { DocTemplate, StoredTemplate, StylesheetId, TemplateId } from "./types"
import { signoff } from "./signoff"
import { proposal } from "./proposal"
import { report } from "./report"
import { slides } from "./slides"
import { rebrand } from "./rebrand"

export type { DocTemplate, StoredTemplate, StylesheetId, TemplateId }

/** Registry order is picker order. */
export const TEMPLATES: readonly DocTemplate[] = [signoff, proposal, report, slides, rebrand]

export const DEFAULT_TEMPLATE_ID: TemplateId = "signoff"

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && TEMPLATES.some((t) => t.id === value)
}

/** Look up a template, falling back to the default for unknown/missing ids. */
export function getTemplate(id: string | null | undefined): DocTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? signoff
}

/**
 * Which stylesheet a stored document renders against. `legacy` documents (saved
 * before templates existed) carry their own model-authored CSS and must not have
 * a stylesheet injected over the top — only the old print fixes.
 */
export function stylesheetFor(stored: string | null | undefined): StylesheetId | "legacy" {
  if (!stored || stored === "legacy") return "legacy"
  return getTemplate(stored).stylesheet
}
