import type {
  BenefitLedgerContent,
  CapabilityBlocksContent,
  IndustrySections,
  TemplateSpecContent,
} from '@/data/industrySections'
import type { CapabilityBlock, IndustryPoint, SpecGroup, SpecPanel } from '@/components/sections/types'

/*
 * The long-form industry sections (capability blocks, benefit ledger, template
 * spec) as they come back from an `industryPage` document. Every field is
 * optional and may be null: GROQ returns null for fields the editor never set.
 */
type Maybe<T> = T | null | undefined

export interface IndustryPointDoc { label?: Maybe<string>; text?: Maybe<string> }
export interface CapabilityBlockDoc {
  number?: Maybe<string>
  title?: Maybe<string>
  lead?: Maybe<string>
  points?: Maybe<Maybe<IndustryPointDoc>[]>
  note?: Maybe<string>
}
export interface CapabilityBlocksDoc {
  eyebrow?: Maybe<string>
  heading?: Maybe<string>
  headingAccent?: Maybe<string>
  lead?: Maybe<string>
  columns?: Maybe<number>
  blocks?: Maybe<Maybe<CapabilityBlockDoc>[]>
}
export interface BenefitLedgerDoc {
  eyebrow?: Maybe<string>
  heading?: Maybe<string>
  headingAccent?: Maybe<string>
  intro?: Maybe<string>
  items?: Maybe<Maybe<IndustryPointDoc>[]>
  footnote?: Maybe<string>
}
export interface SpecGroupDoc { label?: Maybe<string>; bullets?: Maybe<Maybe<string>[]> }
export interface SpecPanelDoc {
  title?: Maybe<string>
  lead?: Maybe<string>
  bullets?: Maybe<Maybe<string>[]>
  chipsLabel?: Maybe<string>
  chips?: Maybe<Maybe<string>[]>
  groups?: Maybe<Maybe<SpecGroupDoc>[]>
  note?: Maybe<string>
}
export interface TemplateSpecDoc {
  eyebrow?: Maybe<string>
  heading?: Maybe<string>
  headingAccent?: Maybe<string>
  lead?: Maybe<string>
  columns?: Maybe<number>
  panels?: Maybe<Maybe<SpecPanelDoc>[]>
}
export interface IndustrySectionsDoc {
  capabilityBlocks?: Maybe<CapabilityBlocksDoc>
  benefitLedger?: Maybe<BenefitLedgerDoc>
  templateSpec?: Maybe<TemplateSpecDoc>
}

/** Blank strings from the Studio are "not set", not "set to empty". */
function clean(value: Maybe<string>): string | undefined {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || undefined
}

function text(value: Maybe<string>, fallback: string | undefined): string | undefined {
  return clean(value) ?? fallback
}

/** Copies only the keys whose value is set, so optional fields stay absent. */
function compact<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T
}

/** The usable rows of a Studio list; an empty result means "not set". */
function rows<TDoc, TOut>(items: Maybe<Maybe<TDoc>[]>, map: (item: TDoc) => TOut | undefined): TOut[] {
  return (items ?? []).flatMap((item) => {
    const out = item ? map(item) : undefined
    return out === undefined ? [] : [out]
  })
}

/** Only a list with usable rows replaces the code list. */
function list<TDoc, TOut>(
  items: Maybe<Maybe<TDoc>[]>,
  fallback: TOut[] | undefined,
  map: (item: TDoc) => TOut | undefined,
): TOut[] | undefined {
  const mapped = rows(items, map)
  return mapped.length ? mapped : fallback
}

function strings(items: Maybe<Maybe<string>[]>): string[] | undefined {
  const mapped = rows(items, clean)
  return mapped.length ? mapped : undefined
}

function columns(value: Maybe<number>, fallback: 2 | 3 | undefined): 2 | 3 | undefined {
  return value === 2 || value === 3 ? value : fallback
}

function point(p: IndustryPointDoc): IndustryPoint | undefined {
  const t = clean(p.text)
  return t ? compact({ label: clean(p.label), text: t }) : undefined
}

function block(b: CapabilityBlockDoc): CapabilityBlock | undefined {
  const title = clean(b.title)
  if (!title) return undefined
  const points = rows(b.points, point)
  return compact({
    number: clean(b.number),
    title,
    lead: clean(b.lead),
    points: points.length ? points : undefined,
    note: clean(b.note),
  })
}

function group(g: SpecGroupDoc): SpecGroup | undefined {
  const label = clean(g.label)
  const bullets = strings(g.bullets)
  return label && bullets ? { label, bullets } : undefined
}

function panel(p: SpecPanelDoc): SpecPanel | undefined {
  const title = clean(p.title)
  if (!title) return undefined
  const groups = rows(p.groups, group)
  return compact({
    title,
    lead: clean(p.lead),
    bullets: strings(p.bullets),
    chipsLabel: clean(p.chipsLabel),
    chips: strings(p.chips),
    groups: groups.length ? groups : undefined,
    note: clean(p.note),
  })
}

/*
 * Each section: the Sanity object wins field by field over the code section.
 * A blank string, an unusable row or an emptied list keeps the code value.
 * A list from Sanity replaces the code list as a whole (rows are not merged by
 * position). A section with no code copy renders from Sanity alone only once
 * it has an eyebrow, a heading and at least one usable row.
 */

export function mergeCapabilityBlocks(
  code: CapabilityBlocksContent | undefined,
  doc: Maybe<CapabilityBlocksDoc>,
): CapabilityBlocksContent | undefined {
  if (!doc) return code
  const eyebrow = text(doc.eyebrow, code?.eyebrow)
  const heading = text(doc.heading, code?.heading)
  const blocks = list(doc.blocks, code?.blocks, block)
  if (!eyebrow || !heading || !blocks?.length) return code
  return compact({
    ...code,
    eyebrow,
    heading,
    headingAccent: text(doc.headingAccent, code?.headingAccent),
    lead: text(doc.lead, code?.lead),
    columns: columns(doc.columns, code?.columns),
    blocks,
  })
}

export function mergeBenefitLedger(
  code: BenefitLedgerContent | undefined,
  doc: Maybe<BenefitLedgerDoc>,
): BenefitLedgerContent | undefined {
  if (!doc) return code
  const eyebrow = text(doc.eyebrow, code?.eyebrow)
  const heading = text(doc.heading, code?.heading)
  const items = list(doc.items, code?.items, point)
  if (!eyebrow || !heading || !items?.length) return code
  return compact({
    ...code,
    eyebrow,
    heading,
    headingAccent: text(doc.headingAccent, code?.headingAccent),
    intro: text(doc.intro, code?.intro),
    items,
    footnote: text(doc.footnote, code?.footnote),
  })
}

export function mergeTemplateSpec(
  code: TemplateSpecContent | undefined,
  doc: Maybe<TemplateSpecDoc>,
): TemplateSpecContent | undefined {
  if (!doc) return code
  const eyebrow = text(doc.eyebrow, code?.eyebrow)
  const heading = text(doc.heading, code?.heading)
  const panels = list(doc.panels, code?.panels, panel)
  if (!eyebrow || !heading || !panels?.length) return code
  return compact({
    ...code,
    eyebrow,
    heading,
    headingAccent: text(doc.headingAccent, code?.headingAccent),
    lead: text(doc.lead, code?.lead),
    columns: columns(doc.columns, code?.columns),
    panels,
  })
}

/** The page's three long-form sections, Sanity over code. */
export function mergeIndustrySections(
  code: IndustrySections,
  doc: Maybe<IndustrySectionsDoc>,
): IndustrySections {
  if (!doc) return code
  return compact({
    capabilityBlocks: mergeCapabilityBlocks(code.capabilityBlocks, doc.capabilityBlocks),
    benefitLedger: mergeBenefitLedger(code.benefitLedger, doc.benefitLedger),
    templateSpec: mergeTemplateSpec(code.templateSpec, doc.templateSpec),
  })
}
