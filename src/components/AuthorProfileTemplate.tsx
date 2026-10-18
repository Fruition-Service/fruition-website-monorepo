import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import BlogCard from "@/components/BlogCard"
import BioText from "@/components/BioText"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = any

interface BlogCategoryRef {
  _id?: string
  title: string
  slug: string
}

interface AuthorPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  author?: string
  coverImage?: { asset: { _ref: string } }
  charCount?: number
  categories?: BlogCategoryRef[]
}

export interface TeamMemberProfile {
  name?: string
  role?: string
  emoji?: string
  photo?: SanityImage
  bio?: string
  linkedinUrl?: string
  regions?: string[]
}

interface AuthorProfileTemplateProps {
  name: string
  postCount: number
  posts: AuthorPost[]
  member?: TeamMemberProfile | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const REGION_FLAGS: Record<string, { flag: string; label: string }> = {
  APAC: { flag: "🌏", label: "APAC" },
  IN: { flag: "🇮🇳", label: "India" },
  UK: { flag: "🇬🇧", label: "United Kingdom" },
  US: { flag: "🇺🇸", label: "United States" },
  AU: { flag: "🇦🇺", label: "Australia" },
}

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "F"
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "F"
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AuthorAvatar({ name, photo }: { name: string; photo?: SanityImage }) {
  const photoSrc = photo?.asset?._ref ? urlFor(photo).width(224).height(224).fit("crop").url() : null

  if (photoSrc) {
    return (
      <div className="relative shrink-0 size-[88px] md:size-[112px] rounded-full overflow-hidden ring-1 ring-black/5 shadow-[0_8px_28px_color-mix(in_srgb,var(--color-brand)_18%,transparent)]">
        <Image src={photoSrc} alt={name} fill className="object-cover" sizes="112px" />
      </div>
    )
  }

  return (
    <div
      className="shrink-0 size-[88px] md:size-[112px] rounded-full flex items-center justify-center text-white font-semibold text-[28px] md:text-[34px] leading-none select-none shadow-[0_8px_28px_color-mix(in_srgb,var(--color-brand)_25%,transparent)] bg-gradient-to-br from-brand to-brand-light"
      aria-hidden="true"
    >
      {authorInitials(name)}
    </div>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 19 19" fill="currentColor" aria-hidden="true">
      <path d="M4.3 6.43H1.22v9.92H4.3V6.43ZM2.76 1.08c-1.06 0-1.76.7-1.76 1.6 0 .89.68 1.6 1.72 1.6h.02c1.08 0 1.76-.71 1.76-1.6-.02-.9-.68-1.6-1.74-1.6ZM12.31 6.21c-1.63 0-2.36.9-2.77 1.53V6.43H6.46c.04.87 0 9.92 0 9.92h3.08v-5.54c0-.28.02-.55.1-.75.22-.55.73-1.13 1.59-1.13 1.12 0 1.57.85 1.57 2.1v5.32H15.9v-5.68c0-2.85-1.52-4.17-3.55-4.17l-.04-.29Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main template                                                      */
/* ------------------------------------------------------------------ */

export default function AuthorProfileTemplate({
  name,
  postCount,
  posts,
  member,
}: AuthorProfileTemplateProps) {
  const role = member?.role
  const bio = member?.bio
  const linkedinUrl = member?.linkedinUrl
  const regions = (member?.regions ?? []).map((r) => REGION_FLAGS[r]).filter(Boolean)
  const countLabel = `${postCount} article${postCount === 1 ? "" : "s"}`

  return (
    <div className="bg-surface w-full">
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-16">
        {/* Back to blog */}
        <Link
          href="/consulting-blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          All articles
        </Link>

        {/* Header */}
        <header className="mt-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <AuthorAvatar name={name} photo={member?.photo} />

          <div className="min-w-0">
            <h1 className="font-bold text-body leading-[1.1] tracking-[-0.02em] text-[clamp(1.9rem,5vw,2.75rem)] text-balance">
              {name}
            </h1>

            {(role || regions.length > 0) && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[15px] text-muted">
                {role && <span className="font-medium text-body">{role}</span>}
                {role && regions.length > 0 && <span aria-hidden className="text-muted">·</span>}
                {regions.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    {regions.map((r) => (
                      <span key={r.label} title={r.label} className="text-base leading-none">
                        {r.flag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{countLabel}</span>
              {linkedinUrl && (
                <>
                  <span aria-hidden className="text-muted">·</span>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors"
                  >
                    <LinkedInIcon />
                    LinkedIn profile
                  </a>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Bio */}
        {bio && (
          <p className="mt-6 max-w-[68ch] text-[17px] leading-[1.65] text-body text-pretty">
            <BioText bio={bio} />
          </p>
        )}

        {/* Mid-page conversion banner — shared site-wide */}
        <AuditCtaBanner contained={false} className="my-[32px]" />

        {/* Divider */}
        <div className="mt-10 md:mt-12 border-t border-ui" />

        {/* Posts */}
        <section className="mt-10 md:mt-12">
          <h2 className="text-xl font-bold text-body mb-8">
            {postCount === 1 ? "The article" : `Articles by ${name.split(/\s+/)[0]}`}
          </h2>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <div
                  key={post._id ?? post.slug}
                  className="animate-reveal-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
                >
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm py-8">No articles yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
