import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import { authorSlug } from "@/sanity/authorSlug"
import { parseInlineMarkdown } from "@/lib/inlineMarkdown"
import { midCtaCopyFor, splitBodyForMidCta } from "@/lib/blogMidCta"
import { extractBlogFaq, type BlogFaq } from "@/lib/blogFaq"
import { answerToPlainText, generateFaqJsonLdFromPairs } from "@/lib/faqSchema"
import { parseVideoUrl, videoEmbedSrc } from "@/lib/videoEmbed"
import ArticleBodyImage from "@/components/ArticleBodyImage"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import BlogShareRow from "@/components/blog/BlogShareRow"
import BlogAuditBand from "@/components/blog/BlogAuditBand"
import VcFaqTabs from "@/components/vc/sections/VcFaqTabs"
import { VcClosing } from "@/components/vc/sections/basic"
import { Badge } from "@/components/vc/primitives"
import type { VcClosingData } from "@/components/vc/types"

/*
 * Blog post template, Version C (approved by Edward on 14 Nov 2026; mock-ups
 * review-v3 p/blog-sap.html and p/blog-claude-github.html). Styles are
 * src/styles/vc/pages/blog-post.css, imported by the route: the /consulting-blog
 * stylesheet plus scripts/vc/extras-blog-post.css.
 *
 * Sections: hero (crumb, H1, lead, meta column, cover), article (sticky "On this
 * page" + one ~680px reading column), FAQ accordion, author card, related
 * articles, the blog's closing band. The body renders verbatim and in order;
 * only the FAQ block moves into the accordion (src/lib/blogFaq.ts).
 *
 * Marketa writes these posts (docs/architecture.md §9): the blogPost fields,
 * the doc id rule and /post/<slug> are a contract, so this file only reads.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io").replace(/\/+$/, "")

// Hosts allowed to embed players (Twitch rejects unknown `parent`s). Derived
// from the deployed site URL, plus the apex + localhost for dev/preview.
const EMBED_PARENTS = (() => {
  let host = "www.fruitionservices.io"
  try {
    host = new URL(SITE_URL).hostname
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
  slug?: string
  author?: string
  authorPhotoUrl?: string
  publishedAt?: string
  coverImage?: SanityImage
  excerpt?: string
  seoDescription?: string
  body?: PortableTextBlock[]
  categories?: BlogCategoryRef[]
  videoUrls?: string[]
}

export interface RelatedBlogPost {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  author?: string
  authorPhotoUrl?: string
  excerpt?: string
  charCount?: number
  coverImage?: SanityImage
  categories?: BlogCategoryRef[]
}

interface BlogPostTemplateProps {
  post: BlogPostData
  relatedPosts?: RelatedBlogPost[]
  /** The /consulting-blog closing band (vcPage-consulting-blog), shared by every post. */
  closing?: VcClosingData | null
}

/** Category shown on posts that carry none (the blog index's `otherLabel`). */
const OTHER_CATEGORY = "General"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso?: string): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
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

/** Same estimate as the /consulting-blog cards, so a post reads the same time in both places. */
function cardMinutes(charCount?: number): number {
  return Math.max(1, Math.round((charCount ?? 5000) / 5 / 200))
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
}

/** The body's H2s (an editor's H1 renders as an H2), slugified and deduped, for "On this page". */
function extractH2s(body?: PortableTextBlock[]): TocEntry[] {
  if (!body?.length) return []
  const seen = new Set<string>()
  const out: TocEntry[] = []
  for (const block of body) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style = (block as any)?.style
    if (block?._type !== "block" || (style !== "h2" && style !== "h1")) continue
    const text = blockText(block).trim()
    if (!text) continue
    const id = slugify(text)
    // Anchors aren't suffix-deduped in the renderer, so skip repeats to keep
    // every link pointing at a real, first-occurrence heading.
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push({ id, text })
  }
  return out
}

function uniqueCategories(categories?: BlogCategoryRef[]): BlogCategoryRef[] {
  // Older posts reference the same category more than once.
  const list = (categories ?? []).filter((c) => c?.title)
  return list.filter((cat, i) => list.findIndex((c) => (c.slug || c.title) === (cat.slug || cat.title)) === i)
}

/* ------------------------------------------------------------------ */
/*  Portable text: rendered into `.prose`, styled by blog-post.css     */
/* ------------------------------------------------------------------ */

function BodyLink({ href, children }: { href?: string; children: React.ReactNode }) {
  // Relative hrefs stay in-app (same tab); anything absolute opens a new tab.
  if (href && (href.startsWith("/") || href.startsWith("#"))) return <Link href={href}>{children}</Link>
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

const blogPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => <h2 id={slugify(blockText(value))}>{children}</h2>,
    h2: ({ children, value }) => <h2 id={slugify(blockText(value))}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={slugify(blockText(value))}>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => <BodyLink href={value?.href}>{children}</BodyLink>,
    internalLink: ({ children, value }) => (
      <Link href={value?.slug?.current ? `/${value.slug.current}` : "#"}>{children}</Link>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      const src = urlFor(value).auto("format").quality(90).url()
      return (
        <figure className="pic">
          <ArticleBodyImage value={value}>
            <Image src={src} alt={value.alt || ""} width={1360} height={765} quality={90} sizes="(max-width: 767px) 100vw, 680px" />
          </ArticleBodyImage>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    // Inline video player, placed exactly where the author dropped the URL.
    videoEmbed: ({ value }) => <BodyVideo url={value?.url} caption={value?.caption} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: ({ value }: any) => <BodyTable rows={value?.rows} />,
  },
}

/**
 * A table cell's inline markdown, rendered. The schema stores cells as plain
 * strings (blogPost.ts), so a cell the editor showed as bold arrives as
 * `**Use case**`; parsing here also repairs every post already live.
 */
function CellText({ text }: { text: string }) {
  return (
    <>
      {parseInlineMarkdown(text).map((run, i) => {
        if (run.href) {
          return (
            <BodyLink key={i} href={run.href}>
              {run.text}
            </BodyLink>
          )
        }
        let node: React.ReactNode = run.text
        if (run.em) node = <em>{node}</em>
        if (run.strong) node = <strong>{node}</strong>
        return <Fragment key={i}>{node}</Fragment>
      })}
    </>
  )
}

/** A blog `table` block: the first row is the header, each body row's first cell labels the row. */
function BodyTable({ rows }: { rows?: { cells?: string[] }[] }) {
  if (!rows?.length) return null
  const [head, ...body] = rows
  return (
    <figure className="tbl">
      <table>
        {head?.cells?.length ? (
          <thead>
            <tr>
              {head.cells.map((c, i) => (
                <th key={i} scope="col">
                  <CellText text={c} />
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {(r.cells ?? []).map((c, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row">
                    <CellText text={c} />
                  </th>
                ) : (
                  <td key={ci}>
                    <CellText text={c} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/** YouTube uses the click-to-load facade (and its VideoObject JSON-LD); Vimeo, Twitch and Loom a lazy iframe. */
function BodyVideo({ url, caption, title }: { url?: string; caption?: string; title?: string }) {
  if (!url) return null
  const parsed = parseVideoUrl(url)
  if (!parsed) return null
  const name = caption || title || "Video"
  return (
    <figure>
      <div className="vid-live">
        {parsed.provider === "youtube" ? (
          <YouTubeEmbed url={parsed.canonicalUrl} title={name} className="w-full h-full" />
        ) : (
          <iframe
            src={videoEmbedSrc(parsed, { parents: EMBED_PARENTS })}
            title={name}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

function Avatar({ src, size }: { src?: string; size: number }) {
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${src}?w=${size * 2}&h=${size * 2}&fit=crop&auto=format`} alt="" width={size} height={size} loading="lazy" decoding="async" />
  )
}

function Hero({ post, url, readingTime }: { post: BlogPostData; url: string; readingTime: string }) {
  const category = uniqueCategories(post.categories)[0]?.title ?? OTHER_CATEGORY
  const lead = post.seoDescription || post.excerpt
  const cover = post.coverImage?.asset?._ref ? urlFor(post.coverImage).width(2400).fit("max").auto("format").quality(85).url() : null
  const authorHref = post.author ? `/author/${authorSlug(post.author)}` : null
  return (
    <section className="ah" data-sec="hero">
      <div className="wrap">
        <div className="ah-top">
          <div className="ah-main">
            <div className="ah-crumb">
              <Link className="label" href="/consulting-blog">
                Blog
              </Link>
              <span className="label" aria-hidden="true">
                /
              </span>
              <Badge>{category}</Badge>
            </div>
            <h1 className="display">{post.title}</h1>
            {lead && <p className="lead">{lead}</p>}
          </div>
          <dl className="ah-meta">
            {post.author && authorHref && (
              <div>
                <dt className="label">Author</dt>
                <dd>
                  <Link className="ah-who" href={authorHref}>
                    <Avatar src={post.authorPhotoUrl} size={36} />
                    <span>{post.author}</span>
                  </Link>
                </dd>
              </div>
            )}
            {post.publishedAt && (
              <div>
                <dt className="label">Published</dt>
                <dd>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </dd>
              </div>
            )}
            <div>
              <dt className="label">Reading time</dt>
              <dd>{readingTime}</dd>
            </div>
            <div>
              <dt className="label">Share</dt>
              <dd>
                <BlogShareRow url={url} title={post.title} />
              </dd>
            </div>
          </dl>
        </div>
        {cover && (
          <figure className="ah-cover">
            <ArticleBodyImage value={{ ...post.coverImage, alt: post.title }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={post.title} width={1600} height={900} fetchPriority="high" decoding="async" />
            </ArticleBodyImage>
          </figure>
        )}
      </div>
    </section>
  )
}

function Toc({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 2) return null
  const list = (
    <ol>
      {entries.map((e) => (
        <li key={e.id}>
          <a href={`#${e.id}`}>{e.text}</a>
        </li>
      ))}
    </ol>
  )
  return (
    <>
      <nav className="toc" aria-label="On this page">
        <span className="label">On this page</span>
        {list}
      </nav>
      <details className="toc-m">
        <summary>
          <span className="label">On this page</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </summary>
        {list}
      </details>
    </>
  )
}

function FaqSection({ faq }: { faq: BlogFaq }) {
  const jsonLd = generateFaqJsonLdFromPairs(
    faq.items.map((it) => ({ question: it.question, answer: answerToPlainText(it.answer) })),
  )
  return (
    <section className="alt" id={faq.id} data-sec="faq">
      <div className="wrap faq">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <VcFaqTabs
          badge={<Badge>FAQ</Badge>}
          heading={<h2 className="h2 mt24">{faq.heading}</h2>}
          tabs={[{ _key: "faq", label: faq.heading, items: faq.items.map((it, i) => ({ _id: `${faq.id}-${i}`, question: it.question, answer: it.answer })) }]}
        />
      </div>
    </section>
  )
}

function AuthorCard({ post, url }: { post: BlogPostData; url: string }) {
  return (
    <section className="wb" data-sec="author">
      <div className="wrap">
        <div className="wb-in">
          {post.author ? (
            <Link className="who" href={`/author/${authorSlug(post.author)}`}>
              <Avatar src={post.authorPhotoUrl} size={64} />
              <span>
                <span className="label">Written by</span>
                <span className="title">{post.author}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          <div className="wb-share">
            <span className="label">Share this article</span>
            <BlogShareRow url={url} title={post.title} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Related({ posts, tone }: { posts: RelatedBlogPost[]; tone: "plain" | "alt" }) {
  if (!posts.length) return null
  return (
    <section className={tone === "alt" ? "alt rel" : "rel"} data-sec="related">
      <div className="wrap">
        <div className="rel-h">
          <h2 className="h2">
            Related <span className="acc">articles</span>
          </h2>
          <Link className="label more" href="/consulting-blog">
            See all →
          </Link>
        </div>
        <div className="posts">
          {posts.slice(0, 3).map((p) => {
            const href = `/post/${p.slug}`
            const src = p.coverImage?.asset?._ref ? urlFor(p.coverImage).width(720).auto("format").url() : null
            const category = uniqueCategories(p.categories)[0]?.title ?? OTHER_CATEGORY
            return (
              <article className="post" key={p._id}>
                <Link className="pic" href={href} tabIndex={-1} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {src && <img src={src} alt="" loading="lazy" decoding="async" />}
                </Link>
                <div className="top">
                  <span className="label">{category}</span>
                  <span className="label">{cardMinutes(p.charCount)} min read</span>
                </div>
                <h3 className="h3">
                  <Link href={href}>{p.title}</Link>
                </h3>
                <div className="by">
                  {p.authorPhotoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="av" src={`${p.authorPhotoUrl}?w=56&h=56&fit=crop&auto=format`} alt="" width={28} height={28} loading="lazy" decoding="async" />
                  )}
                  <span className="label">
                    {formatDate(p.publishedAt)}
                    {p.author ? ` · ${p.author}` : ""}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main template                                                      */
/* ------------------------------------------------------------------ */

export default function BlogPostTemplate({ post, relatedPosts = [], closing }: BlogPostTemplateProps) {
  const url = `${SITE_URL}/post/${post.slug ?? ""}`
  const readingTime = estimateReadingTime(post.body)
  // The FAQ block (an "FAQs" H2 followed by H3 questions) leaves the reading
  // column for the accordion; posts whose FAQ does not fit that shape keep it inline.
  const { body, faq } = extractBlogFaq(post.body, slugify)
  const toc = extractH2s(body)
  if (faq) toc.push({ id: faq.id, text: faq.heading })
  // One audit band per post: at the mid-article split on long posts, else at the end of the column.
  const { before, after, hasMidCta } = splitBodyForMidCta(body)
  const mid = midCtaCopyFor(post)
  const band = <BlogAuditBand heading={mid?.heading} body={mid?.body} ctaLabel={mid?.ctaLabel} />
  const videos = (post.videoUrls ?? []).filter((u) => parseVideoUrl(u))

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
    <div className="vc vc-p-consulting-blog vc-p-blog-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <Hero post={post} url={url} readingTime={readingTime} />
      <section className="ab" data-sec="article">
        <div className="wrap ab-grid">
          <Toc entries={toc} />
          <article className="prose">
            {before.length > 0 && <PortableText value={before} components={blogPortableTextComponents} />}
            {hasMidCta && band}
            {after.length > 0 && <PortableText value={after} components={blogPortableTextComponents} />}
            {videos.map((u, i) => (
              <BodyVideo key={u} url={u} title={`Video ${i + 1}`} />
            ))}
            {!hasMidCta && band}
          </article>
          <div className="ab-r" aria-hidden="true" />
        </div>
      </section>
      {/* The author card sits under the article, before the FAQs (Edward, 14 Nov 2026). */}
      <AuthorCard post={post} url={url} />
      {faq && <FaqSection faq={faq} />}
      {/* Grey and white alternate: after the grey FAQ band the related posts sit on white. */}
      <Related posts={relatedPosts} tone={faq ? "plain" : "alt"} />
      {closing && <VcClosing s={closing} />}
    </div>
  )
}
