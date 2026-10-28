import Link from "next/link"
import Image from "next/image"
import { authorSlug } from "@/sanity/authorSlug"
import { urlFor } from "@/sanity/image"

interface BlogCategory {
  _id?: string
  title: string
  slug: string
}

interface BlogCardProps {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  author?: string
  /** The author's team headshot, attached by the blog queries in src/sanity/queries.ts. */
  authorPhotoUrl?: string
  coverImage?: { asset: { _ref: string } }
  charCount?: number
  categories?: BlogCategory[]
}

function buildImageUrl(ref: string) {
  // CDN-optimized URL with size constraints via the urlFor builder.
  return ref ? urlFor({ asset: { _ref: ref } }).width(800).height(600).fit("crop").auto("format").url() : ""
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("")
}

/** Bylines that are Fruition itself rather than a person, shown with the Fruition mark. */
function isBrandByline(name: string) {
  return /^fruition\b/i.test(name.trim())
}

function hashIndex(input: string, modulo: number) {
  let hash = 0
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) & 0x7fffffff
  return hash % modulo
}

const AVATAR_PALETTES = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
]

const GRADIENT_PALETTES = [
  "from-blue-500 via-indigo-500 to-purple-600",
  "from-rose-400 via-pink-500 to-fuchsia-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-sky-400 via-blue-500 to-indigo-600",
  "from-violet-400 via-purple-500 to-fuchsia-600",
  "from-lime-400 via-emerald-500 to-teal-600",
  "from-slate-600 via-slate-700 to-slate-900",
]

function relativeTime(iso?: string) {
  if (!iso) return ""
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const diff = Math.max(0, Date.now() - then)
  const min = Math.floor(diff / 60000)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  const mo = Math.floor(day / 30)
  const yr = Math.floor(day / 365)
  if (yr > 0) return `${yr}y ago`
  if (mo > 0) return `${mo}mo ago`
  if (day > 0) return `${day} day${day === 1 ? "" : "s"} ago`
  if (hr > 0) return `${hr}h ago`
  if (min > 0) return `${min}m ago`
  return "just now"
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  publishedAt,
  author,
  authorPhotoUrl,
  coverImage,
  charCount,
  categories,
}: BlogCardProps) {
  const imageUrl = coverImage?.asset?._ref ? buildImageUrl(coverImage.asset._ref) : null
  const readTime = charCount ? Math.max(1, Math.round(charCount / 5 / 200)) : 5
  const displayAuthor = author || "Fruition Team"
  const avatarClass = AVATAR_PALETTES[hashIndex(displayAuthor, AVATAR_PALETTES.length)]
  const gradientClass = GRADIENT_PALETTES[hashIndex(title, GRADIENT_PALETTES.length)]
  const category = categories?.[0]

  const authorHref = author ? `/author/${authorSlug(author)}` : null

  return (
    <div className="group relative block">
      {/* Stretched overlay link — whole card navigates to the post. Interactive
          children (author link) sit above this via position+z-index. */}
      <Link
        href={`/post/${slug}`}
        aria-label={title}
        className="absolute inset-0"
      />
      <div
        className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br ${gradientClass}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-end p-5">
              <span className="text-white text-lg font-semibold leading-snug line-clamp-4 drop-shadow-sm">
                {title}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {authorPhotoUrl ? (
              <Image
                src={`${authorPhotoUrl}?w=64&h=64&fit=crop&auto=format`}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 shrink-0 rounded-full object-cover"
                unoptimized
              />
            ) : isBrandByline(displayAuthor) ? (
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-brand-soft">
                <Image src="/images/logo-fruition-mark.svg" alt="" width={18} height={17} className="w-[18px] h-auto" />
              </div>
            ) : (
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${avatarClass}`}
              >
                {initials(displayAuthor) || "F"}
              </div>
            )}
            <div className="leading-tight min-w-0">
              {authorHref ? (
                <Link
                  href={authorHref}
                  className="relative z-10 text-sm text-body truncate hover:text-[#8015e8] transition-colors"
                >
                  {displayAuthor}
                </Link>
              ) : (
                <div className="text-sm text-body truncate">{displayAuthor}</div>
              )}
              <div className="text-xs text-muted flex items-center gap-1.5">
                {publishedAt && <span>{relativeTime(publishedAt)}</span>}
                {publishedAt && <span aria-hidden>·</span>}
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
          <span
            aria-hidden
            className="text-muted group-hover:text-body transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </span>
        </div>

        {category && (
          <span className="inline-block bg-violet-100 text-violet-800 px-2.5 py-1 rounded-md text-xs font-medium mb-2">
            {category.title}
          </span>
        )}

        <h3 className="text-xl font-bold text-body mb-2 line-clamp-2 leading-snug group-hover:text-body">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-muted line-clamp-2 mb-4 leading-relaxed">{excerpt}</p>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-ui">
          <span aria-hidden className="text-muted group-hover:text-body transition-colors">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4.5L5 21V5a1 1 0 0 1 1-1z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
