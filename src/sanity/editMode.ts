import type { FilterDefault } from '@sanity/client/stega'

/** Non-httpOnly flag cookie the browser reads to load the edit overlay. */
export const EDIT_FLAG_COOKIE = 'fruition_edit'

/**
 * True while a portal user has the inline editor on. Edit mode IS Next draft
 * mode, which can only be switched on by /api/internal/edit/enable after the
 * Google login check. draftMode() throws outside a request (build scripts,
 * generateStaticParams), which simply means "not editing".
 */
export async function isEditMode(): Promise<boolean> {
  try {
    const { draftMode } = await import('next/headers')
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

// Fields that hold machine values the templates compare against or put in
// attributes. Encoding them would break `variant === "dark"` style checks.
// Alt text only ever lands in an attribute, where it can't be clicked, so it
// stays clean too.
const MACHINE_KEYS = new Set([
  'variant', 'style', 'theme', 'layout', 'icon', 'iconName', 'color', 'colour',
  'alignment', 'align', 'slug', 'current', 'href', 'url', 'link', 'anchor', 'id',
  'region', 'regions', 'type', 'kind', 'size', 'tone', 'email', 'phone',
  'calendlyLink', 'videoId', 'cadence', 'youtubeId', 'lang', 'locale', 'alt', 'altText',
  // Version C machine values: map artwork markup and design-system classes.
  'mapSvg', 'mapKind', 'mapAspect', 'artClass', 'gridClass', 'tagClass', 'titleClass', 'sectionClass', 'imageFrame', 'shape', 'logoShape', 'floatBadgeClass', 'cityStyle', 'side', 'source', 'groups',
])

// Fields that only ever hold human copy, so a lowercase single word there
// ("monday.com", "n8n") is still copy and gets a source map.
const TEXT_KEYS = new Set([
  'label', 'heading', 'title', 'text', 'description', 'eyebrow', 'subheading', 'body', 'footerNote',
])

// Lists whose `region` field is a visible card title ("APAC"), not a region
// code like the ad pages' `region: "au"`.
const COPY_REGION_PARENTS = new Set(['coverageRegions'])

/**
 * Which strings get the hidden source map. Only human copy: it must not sit
 * under a system or machine-value key, and it must contain a space, start with
 * a capital letter or sit in a known text field (enums and keys elsewhere are
 * lowercase single words). Paths and URLs are machine values, but a house-style
 * eyebrow starting with two slashes ("// Public sector security") is copy.
 */
export const stegaFilter: FilterDefault = (props) => {
  if (!props.filterDefault(props)) return false
  const keys = props.sourcePath.filter((s): s is string => typeof s === 'string')
  const copyRegion = keys.some((k) => COPY_REGION_PARENTS.has(k))
  if (keys.some((k) => k.startsWith('_') || (MACHINE_KEYS.has(k) && !(copyRegion && k === 'region')))) {
    return false
  }
  const v = props.value.trim()
  if (v.length < 2 || /^https?:|^\/(?!\/)|^#|^mailto:|^tel:/i.test(v)) return false
  return /\s/.test(v) || /^[A-Z0-9]/.test(v) || TEXT_KEYS.has(keys[keys.length - 1] ?? '')
}
