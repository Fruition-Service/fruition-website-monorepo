/**
 * The WhatsApp contact behind the floating chat launcher.
 *
 * The live number is owned by the CMS: Site Settings > Social Links, the entry
 * labelled "WhatsApp", which is the same record that renders the footer icon
 * row. This module is the ONLY place in the app that restates it, so a Sanity
 * outage or a renamed label degrades to the number the footer has always
 * shipped instead of to a dead link. Do not repeat the number elsewhere.
 */

/** Single fallback, used only when the CMS entry is missing or unusable. */
export const WHATSAPP_FALLBACK_HREF = "https://wa.me/61435520959"

/** Prefilled first message, so the chat opens with context, not a blank thread. */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Fruition, I have a question about your consulting services."

/** The shape this module needs from a `siteSettings.socialLinks` entry. */
export interface WhatsAppSocialLink {
  label?: string | null
  href?: string | null
}

/** The hosts that actually open a WhatsApp conversation. */
const WHATSAPP_HREF_RE =
  /^https?:\/\/(?:www\.)?(?:wa\.me|(?:api|web|chat)\.whatsapp\.com)\//i

/** "WhatsApp", "Whats App", "whats-app" and friends all name the same channel. */
function isWhatsAppLabel(label: unknown): boolean {
  return (
    typeof label === "string" &&
    label.replace(/[\s._-]/g, "").toLowerCase() === "whatsapp"
  )
}

/**
 * The CMS WhatsApp link, with no prefilled message attached yet.
 *
 * Falls back when Site Settings is unreachable, the entry is missing, or its
 * href points somewhere that is not a WhatsApp conversation: an editor pasting
 * a LinkedIn URL into the WhatsApp row should not break the launcher.
 */
export function whatsappBaseHref(
  socialLinks?: readonly WhatsAppSocialLink[] | null,
): string {
  const entry = Array.isArray(socialLinks)
    ? socialLinks.find((link) => isWhatsAppLabel(link?.label))
    : undefined
  const href = typeof entry?.href === "string" ? entry.href.trim() : ""
  return WHATSAPP_HREF_RE.test(href) ? href : WHATSAPP_FALLBACK_HREF
}

/**
 * The href the launcher links to: the CMS number plus a `?text=` prefill.
 *
 * An href that already carries its own `text` keeps it, so an editor can write
 * the opening message in Sanity without needing a deploy.
 */
export function whatsappHref(
  socialLinks?: readonly WhatsAppSocialLink[] | null,
  message: string = WHATSAPP_DEFAULT_MESSAGE,
): string {
  const base = whatsappBaseHref(socialLinks)
  const trimmed = message.trim()
  if (!trimmed || /[?&]text=/i.test(base)) return base
  const separator = base.includes("?") ? "&" : "?"
  return `${base}${separator}text=${encodeURIComponent(trimmed)}`
}
