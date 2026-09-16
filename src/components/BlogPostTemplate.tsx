import { BOOKING_ANCHOR } from "@/lib/bookingLink"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { articleImageProps, urlFor } from "@/sanity/image"
import { authorSlug } from "@/sanity/authorSlug"
import { parseInlineMarkdown } from "@/lib/inlineMarkdown"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import { parseVideoUrl, videoEmbedSrc } from "@/lib/videoEmbed"

// Hosts allowed to embed players (Twitch rejects unknown `parent`s). Derived
// from the deployed site URL, plus the apex + localhost for dev/preview.
const EMBED_PARENTS = (() => {
  let host = "www.fruitionservices.io"
  try {
    host = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io").hostname
  } catch {
    /* keep default */
  }
  return [...new Set([host, host.replace(/^www\./, ""), "localhost"])]
})()

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = any

export interface BlogCategoryRef {
  _id?: string
  title: string
  slug: string
}

export interface BlogPostData {
  title: string
  author?: string
  publishedAt?: string
  coverImage?: SanityImage
  excerpt?: string
  body?: PortableTextBlock[]
  categories?: BlogCategoryRef[]
  videoUrls?: string[]
}

export interface RelatedBlogPost {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  coverImage?: SanityImage
}

interface BlogPostTemplateProps {
  post: BlogPostData
  relatedPosts?: RelatedBlogPost[]
  calendlyUrl?: string
}

const DEFAULT_CALENDLY = BOOKING_ANCHOR

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function estimateReadingTime(body?: PortableTextBlock[]): string {
  if (!body?.length) return "1 min read"
  let wordCount = 0
  for (const block of body) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: any[] = (block as any).children || []
    for (const child of children) {
      if (typeof child?.text === "string") {
        wordCount += child.text.split(/\s+/).filter(Boolean).length
      }
    }
  }
  const minutes = Math.max(1, Math.round(wordCount / 225))
  return `${minutes} min read`
}

function authorInitials(name?: string): string {
  if (!name) return "F"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "F"
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Plain text of a portable-text block (joined span text). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blockText(block: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = block?.children || []
  return children.map((c) => (typeof c?.text === "string" ? c.text : "")).join("")
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

/** h2/h3 headings from the body, slugified, deduped, for the jump-to TOC. */
function extractHeadings(body?: PortableTextBlock[]): TocEntry[] {
  if (!body?.length) return []
  const seen = new Set<string>()
  const out: TocEntry[] = []
  for (const block of body) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style = (block as any)?.style
    if (block?._type !== "block" || (style !== "h2" && style !== "h1" && style !== "h3")) continue
    const text = blockText(block).trim()
    if (!text) continue
    const id = slugify(text)
    // Anchors aren't suffix-deduped in the renderer, so skip repeats to keep
    // every TOC link pointing at a real, first-occurrence heading.
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push({ id, text, level: style === "h3" ? 3 : 2 })
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  Portable text components — pixel-matched to Figma article body    */
/* ------------------------------------------------------------------ */
/*  Figma rules:                                                       */
/*    - Montserrat Regular/Bold                                        */
/*    - body: 18px / leading-27px / text-body                         */
/*    - h2 (section): 28px Bold / leading-35px / pt-45px               */
/*    - h3 (sub): 22px Bold / leading-27px / pt-36px                   */
/*    - h4 (inline): 18px Bold / leading-27px / pt-32px                */
/*    Headings carry no bottom padding — the next block's pt-27.5px    */
/*    supplies the below-gap, so the gap above a heading is always     */
/*    larger and each heading visually opens the section below it.     */
/*    - between paragraphs: pt-27.5px                                  */
/*    - link color: #604c97                                            */
/*    - image: w-[740px] with figcaption centered, 14px                */
/*    - lists: list-disc with 27px indent                              */
/* ------------------------------------------------------------------ */

const blogPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => (
      <h2 id={slugify(blockText(value))} className="scroll-mt-[100px] font-bold text-[24px] md:text-[28px] leading-[31px] md:leading-[35px] text-body w-full pt-[45px] first:pt-0">
        {children}
      </h2>
    ),
    h2: ({ children, value }) => (
      <h2 id={slugify(blockText(value))} className="scroll-mt-[100px] font-bold text-[24px] md:text-[28px] leading-[31px] md:leading-[35px] text-body w-full pt-[45px] first:pt-0">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugify(blockText(value))} className="scroll-mt-[100px] font-bold text-[22px] leading-[27px] text-body w-full pt-[36px] first:pt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-bold text-[18px] leading-[27px] text-body w-full pt-[32px] first:pt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-normal text-[18px] leading-[27px] text-body w-full pt-[27.5px] pl-[20px] border-l-[3px] border-brand-dark italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="font-normal text-[18px] leading-[27px] text-body w-full pt-[27.5px] first:pt-0">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc w-full pl-[27px] pt-[27.5px] space-y-[8px]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal w-full pl-[27px] pt-[27.5px] space-y-[8px]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-normal text-[18px] leading-[27px] text-body">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="font-normal text-[18px] leading-[27px] text-body">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-dark underline hover:no-underline"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link
        href={value?.slug?.current ? `/${value.slug.current}` : "#"}
        className="text-brand-dark underline hover:no-underline"
      >
        {children}
      </Link>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      const img = articleImageProps(value)
      return (
        <figure className="w-full flex flex-col items-start pt-[27.5px] isolate">
          <div className="relative w-full overflow-hidden">
            <Image
              src={img.src}
              alt={value.alt || ""}
              width={img.width}
              height={img.height}
              quality={90}
              className={img.fillsColumn ? "w-full h-auto" : "h-auto max-w-full"}
              sizes={img.sizes}
            />
          </div>
          {value.caption && (
            <figcaption className="w-full flex items-center justify-center p-[16px]">
              <span className="font-normal text-[14px] leading-[27px] text-body text-center">
                {value.caption}
              </span>
            </figcaption>
          )}
        </figure>
      )
    },
    // Inline video player, placed exactly where the author dropped the URL.
    videoEmbed: ({ value }) => <BodyVideoEmbed url={value?.url} caption={value?.caption} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: ({ value }: any) => <BodyTable rows={value?.rows} />,
  },
}

/**
 * A table cell's inline markdown, rendered.
 *
 * Everywhere else in the body, bold/italic/links arrive as Portable Text marks
 * and are styled by `blogPortableTextComponents.marks`. Table cells can't: the
 * schema stores them as plain strings (blogPost.ts), so a cell the editor
 * showed as bold publishes as the literal characters `**Use case**`. Parsing
 * here — rather than at publish time — also repairs every post already live.
 * Styling deliberately mirrors the `strong` / `em` / `link` marks above.
 */
function CellText({ text }: { text: string }) {
  return (
    <>
      {parseInlineMarkdown(text).map((run, i) => {
        if (run.href) {
          // Relative hrefs stay in-app; anything absolute opens in a new tab,
          // matching the `link` vs `internalLink` marks.
          const internal = run.href.startsWith("/") || run.href.startsWith("#")
          return internal ? (
            <Link key={i} href={run.href} className="text-brand-dark underline hover:no-underline">
              {run.text}
            </Link>
          ) : (
            <a
              key={i}
              href={run.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark underline hover:no-underline"
            >
              {run.text}
            </a>
          )
        }
        let node: React.ReactNode = run.text
        if (run.em) node = <em className="italic">{node}</em>
        if (run.strong) node = <strong className="font-bold">{node}</strong>
        return <Fragment key={i}>{node}</Fragment>
      })}
    </>
  )
}

/** Renders a blog `table` block. First row is treated as the header. */
function BodyTable({ rows }: { rows?: { cells?: string[] }[] }) {
  if (!rows?.length) return null
  const [head, ...body] = rows
  return (
    <figure className="w-full overflow-x-auto pt-[27.5px]">
      <table className="w-full border-collapse text-[16px] leading-[24px] text-body">
        {head?.cells?.length ? (
          <thead>
            <tr>
              {head.cells.map((c, i) => (
                <th
                  key={i}
                  className="border border-ui bg-surface-raised p-[10px] text-left font-bold align-top"
                >
                  <CellText text={c} />
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {(r.cells ?? []).map((c, ci) => (
                <td key={ci} className="border border-ui p-[10px] align-top">
                  <CellText text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/** Inline body video: YouTube uses the click-to-load facade (perf + SEO);
 *  Vimeo/Twitch/Loom render a lazy iframe via the shared embed helper. */
function BodyVideoEmbed({ url, caption }: { url?: string; caption?: string }) {
  if (!url) return null
  const parsed = parseVideoUrl(url)
  if (!parsed) return null
  return (
    <figure className="w-full flex flex-col items-start pt-[27.5px]">
      <div className="aspect-video w-full overflow-hidden rounded-card">
        {parsed.provider === "youtube" ? (
          <YouTubeEmbed url={parsed.canonicalUrl} title={caption || "Video"} className="w-full h-full" />
        ) : (
          <iframe
            src={videoEmbedSrc(parsed, { parents: EMBED_PARENTS })}
            title={caption || "Video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ border: 0 }}
          />
        )}
      </div>
      {caption && (
        <figcaption className="w-full flex items-center justify-center p-[16px]">
          <span className="font-normal text-[14px] leading-[27px] text-body text-center">
            {caption}
          </span>
        </figcaption>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-components (pixel-matched fragments)                           */
/* ------------------------------------------------------------------ */

function AuthorAvatar({ name }: { name?: string }) {
  return (
    <div
      className="shrink-0 size-[32px] rounded-[16px] flex items-center justify-center text-white font-semibold text-[12px] leading-none select-none bg-gradient-to-br from-brand to-brand-light"
      aria-hidden="true"
    >
      {authorInitials(name)}
    </div>
  )
}

function AuthorMetaRow({
  author,
  publishedAt,
  readingTime,
}: {
  author?: string
  publishedAt?: string
  readingTime: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-y-[4px] w-full">
      {/* Avatar — 32px with 12px right padding */}
      {author ? (
        <Link
          href={`/author/${authorSlug(author)}`}
          aria-label={`More articles by ${author}`}
          className="flex flex-col h-[32px] items-start pr-[12px] w-[44px]"
        >
          <div className="content-stretch flex flex-col items-start overflow-clip rounded-[16px] shrink-0 size-[32px]">
            <AuthorAvatar name={author} />
          </div>
        </Link>
      ) : (
        <div className="flex flex-col h-[32px] items-start pr-[12px] w-[44px]">
          <div className="content-stretch flex flex-col items-start overflow-clip rounded-[16px] shrink-0 size-[32px]">
            <AuthorAvatar name={author} />
          </div>
        </div>
      )}
      {/* Name */}
      {author && (
        <div className="flex flex-col items-start min-w-0">
          <Link
            href={`/author/${authorSlug(author)}`}
            className="font-normal text-[14px] leading-[21px] text-body truncate max-w-full hover:text-brand-dark transition-colors"
          >
            {author}
          </Link>
        </div>
      )}
      {/* Date */}
      {publishedAt && (
        <div className="flex gap-[6px] items-center pl-[6px] shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.14em] leading-[21px] text-muted whitespace-nowrap">
          <span>·</span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      )}
      {/* Reading time */}
      <div className="flex gap-[6px] items-center pl-[6px] shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.14em] leading-[21px] text-muted whitespace-nowrap">
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </div>
  )
}

function ArticleTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="font-bold text-[28px] leading-[36px] md:text-[40px] md:leading-[50px] text-body w-full">
        {title}
      </h1>
    </div>
  )
}

function CoverFigure({
  image,
  alt,
}: {
  image: SanityImage
  alt: string
}) {
  if (!image?.asset?._ref) return null
  const img = articleImageProps(image)
  return (
    <figure className="w-full flex flex-col items-start pt-[27.5px] isolate">
      <div className="relative w-full overflow-hidden">
        <Image
          src={img.src}
          alt={alt}
          width={img.width}
          height={img.height}
          priority
          quality={90}
          className={img.fillsColumn ? "w-full h-auto" : "h-auto max-w-full"}
          sizes={img.sizes}
        />
      </div>
    </figure>
  )
}

function VideoEmbeds({ urls }: { urls: string[] }) {
  const embeds = urls.map((u) => parseVideoUrl(u)).filter((v): v is NonNullable<typeof v> => !!v)
  if (embeds.length === 0) return null
  return (
    <div className="w-full flex flex-col gap-[24px] pt-[27.5px]">
      {embeds.map((v, i) => (
        <div key={i} className="aspect-video w-full overflow-hidden rounded-card">
          {v.provider === "youtube" ? (
            <YouTubeEmbed url={v.canonicalUrl} title={`Video ${i + 1}`} className="w-full h-full" />
          ) : (
            <iframe
              src={videoEmbedSrc(v, { parents: EMBED_PARENTS })}
              title={`Video ${i + 1}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function TagsRow({ categories }: { categories: BlogCategoryRef[] }) {
  if (!categories?.length) return null
  return (
    <div className="flex flex-wrap items-start gap-x-[12px] gap-y-[10px] w-full">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/consulting-blog/categories/${cat.slug}`}
          className="inline-flex items-start px-[13px] py-[7px] bg-surface-raised border border-ui hover:border-brand-dark transition-colors"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] leading-[17px] text-brand">
            {cat.title}
          </span>
        </Link>
      ))}
    </div>
  )
}

function EngagementBar() {
  return (
    <div className="flex flex-col items-start w-full">
      {/* Share icons row — divider top, 66px min-h, pt-24 pb-23 */}
      <div className="relative flex items-center min-h-[66px] pt-[24px] pb-[23px] w-full border-t border-ui">
        <div className="flex gap-[30px] items-center">
          {/* Facebook */}
          <button
            aria-label="Share on Facebook"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.83 6.08V4.66c0-.69.46-.86.78-.86h1.98V1.02L11.85 1c-3.02 0-3.71 2.27-3.71 3.72v1.36H6.39v2.97h1.78v7.95h3.43V9.05h2.54l.12-1.17.19-1.8h-2.62Z"
                fill="var(--text-body)"
              />
            </svg>
          </button>
          {/* LinkedIn */}
          <button
            aria-label="Share on LinkedIn"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.3 6.43H1.22v9.92H4.3V6.43ZM2.76 1.08c-1.06 0-1.76.7-1.76 1.6 0 .89.68 1.6 1.72 1.6h.02c1.08 0 1.76-.71 1.76-1.6-.02-.9-.68-1.6-1.74-1.6ZM12.31 6.21c-1.63 0-2.36.9-2.77 1.53V6.43H6.46c.04.87 0 9.92 0 9.92h3.08v-5.54c0-.28.02-.55.1-.75.22-.55.73-1.13 1.59-1.13 1.12 0 1.57.85 1.57 2.1v5.32H15.9v-5.68c0-2.85-1.52-4.17-3.55-4.17l-.04-.29Z"
                fill="var(--text-body)"
              />
            </svg>
          </button>
          {/* Link */}
          <button
            aria-label="Copy link"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 11.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M11 7.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"
                stroke="var(--text-body)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Send */}
          <button
            aria-label="Share"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 2 9.5 9.5M17 2l-5 15-2.5-7.5L2 7l15-5Z"
                stroke="var(--text-body)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Like row — divider top, pt-19 */}
      <div className="relative flex items-center justify-end pt-[19px] w-full border-t border-ui">
        <button
          aria-label="Like post"
          className="flex items-center justify-center size-[19px] hover:opacity-70 transition-opacity"
        >
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.5 16.5s-6-3.63-6-8.25A3.75 3.75 0 0 1 9.5 5.25 3.75 3.75 0 0 1 15.5 8.25c0 4.62-6 8.25-6 8.25Z"
              stroke="#E84A43"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

/** Quick-read "On this page" jump-to list, generated from the body headings. */
function ArticleToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 3) return null
  return (
    <nav
      aria-label="On this page"
      className="w-full rounded-[16px] p-[24px] md:p-[28px] bg-surface-subtle border border-ui"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        On this page
      </p>
      <ul className="mt-[14px] flex flex-col gap-[8px] list-none p-0">
        {entries.map((e) => (
          <li key={e.id} className={e.level === 3 ? "pl-[16px]" : ""}>
            <a
              href={`#${e.id}`}
              className={`hover:underline ${
                e.level === 3
                  ? "text-muted text-[14px] font-normal"
                  : "text-body text-[15px] font-semibold"
              }`}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function RelatedPostCard({ post }: { post: RelatedBlogPost }) {
  const imgSrc = post.coverImage?.asset?._ref
    ? urlFor(post.coverImage).width(580).height(324).url()
    : null
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group bg-surface-raised relative flex-1 min-w-0 max-w-[290.67px] self-stretch rounded-card shadow-whisper ring-1 ring-ui hover:ring-brand-dark dark:shadow-none transition-colors overflow-hidden"
    >
      <div className="flex flex-col items-start h-full">
        {/* Image — 162px tall, full card width */}
        <div className="relative w-full h-[162.36px] overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              sizes="290px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-brand to-brand-light" />
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col items-start flex-1 w-full pt-[24px] px-[24px] pb-[24px]">
          <div className="flex flex-col items-start w-full overflow-hidden">
            <p className="font-bold text-[18px] leading-[normal] text-body w-full line-clamp-2 group-hover:text-brand-dark transition-colors">
              {post.title}
            </p>
          </div>
          {/* Footer — divider top, pt-16, h-34 */}
          <div className="mt-auto w-full pt-[16px] flex items-start justify-between h-[34px] border-t border-ui">
            <div className="flex items-center h-full">
              <div className="flex items-center gap-[6px]">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 2C5.5 2 2.17 4.44 1 6c1.17 1.56 4.5 4 8.5 4s7.33-2.44 8.5-4c-1.17-1.56-4.5-4-8.5-4Zm0 6.67A2.67 2.67 0 1 1 9.5 3.33a2.67 2.67 0 0 1 0 5.34Z"
                    fill="var(--text-body)"
                  />
                </svg>
                <span className="font-normal text-[12px] leading-[18px] text-body">
                  0
                </span>
              </div>
            </div>
            <div className="flex items-center h-full">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.5 16.5s-6-3.63-6-8.25A3.75 3.75 0 0 1 9.5 5.25 3.75 3.75 0 0 1 15.5 8.25c0 4.62-6 8.25-6 8.25Z"
                  stroke="#E84A43"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function RelatedPostsSection({ posts }: { posts: RelatedBlogPost[] }) {
  if (!posts?.length) return null
  return (
    <section className="flex flex-col items-start gap-[20px] w-full">
      {/* Header */}
      <header className="flex items-start justify-between w-full h-[27px]">
        <div className="flex flex-col items-start self-stretch">
          <h2 className="font-normal text-[18px] leading-[27px] text-body whitespace-nowrap">
            Recent Posts
          </h2>
        </div>
        <Link
          href="/consulting-blog"
          className="flex flex-col items-start self-stretch font-normal text-[14px] leading-[21px] text-body whitespace-nowrap hover:text-brand-dark transition-colors"
        >
          See All
        </Link>
      </header>
      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[34px] items-start w-full">
        {posts.slice(0, 2).map((p) => (
          <RelatedPostCard key={p._id} post={p} />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main template                                                      */
/* ------------------------------------------------------------------ */

export default function BlogPostTemplate({
  post,
  relatedPosts = [],
  calendlyUrl = DEFAULT_CALENDLY,
}: BlogPostTemplateProps) {
  const readingTime = estimateReadingTime(post.body)
  const headings = extractHeadings(post.body)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    publisher: { "@type": "Organization", name: "Fruition" },
  }

  return (
    <div className="bg-surface w-full">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <div className="mx-auto w-full max-w-[1470px] flex items-start justify-center px-6 md:px-12 lg:px-20 py-[48px] lg:py-[80px]">
        <div className="flex flex-col gap-[40px] items-center justify-center w-full max-w-[924px]">
          {/* Author meta */}
          <AuthorMetaRow
            author={post.author}
            publishedAt={post.publishedAt}
            readingTime={readingTime}
          />

          {/* Title */}
          <ArticleTitle title={post.title} />

          {/* Quick-read jump-to (auto-generated from headings) */}
          {headings.length >= 3 && (
            <div className="w-full">
              <ArticleToc entries={headings} />
            </div>
          )}

          {/* Body */}
          <div className="flex flex-col items-start pb-[0.5px] w-full">
            {/* Cover image as first figure inside body */}
            {post.coverImage && (
              <CoverFigure image={post.coverImage} alt={post.title} />
            )}

            {/* Portable text */}
            {post.body && (
              <PortableText
                value={post.body}
                components={blogPortableTextComponents}
              />
            )}

            {/* Video embeds */}
            {post.videoUrls && post.videoUrls.length > 0 && (
              <VideoEmbeds urls={post.videoUrls} />
            )}
          </div>

          {/* Bottom-of-article conversion CTA */}
          <AuditCtaBanner bookingUrl={calendlyUrl} contained={false} />

          {/* Tags (from categories) */}
          {post.categories && post.categories.length > 0 && (
            <TagsRow categories={post.categories} />
          )}

          {/* Engagement bar */}
          <EngagementBar />

          {/* Related posts */}
          <RelatedPostsSection posts={relatedPosts} />
        </div>
      </div>
    </div>
  )
}
