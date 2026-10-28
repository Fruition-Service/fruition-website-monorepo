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
  'calendlyLink', 'videoId', 'youtubeId', 'lang', 'locale', 'alt', 'altText',
])

/**
 * Which strings get the hidden source map. Only human copy: it must contain a
 * space or start with a capital letter (enums and keys are lowercase single
 * words), and it must not sit under a system or machine-value key.
 */
export const stegaFilter: FilterDefault = (props) => {
  if (!props.filterDefault(props)) return false
  const keys = props.sourcePath.filter((s): s is string => typeof s === 'string')
  if (keys.some((k) => k.startsWith('_') || MACHINE_KEYS.has(k))) return false
  const v = props.value.trim()
  if (v.length < 2 || /^https?:|^\/|^#|^mailto:|^tel:/i.test(v)) return false
  return /\s/.test(v) || /^[A-Z0-9]/.test(v)
}
