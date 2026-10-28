import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import Reveal from "./Reveal"
import { homeText, type HomeCopy } from "./copy"

export interface HomePost {
  _id?: string
  title?: string
  slug?: string
  publishedAt?: string
  author?: string
  excerpt?: string
  charCount?: number
  coverImage?: { asset?: { _ref?: string } }
  categories?: { _id?: string; title?: string }[]
}

/** Same 200 wpm assumption as BlogCard, so read times agree across the site. */
function readTime(charCount?: number) {
  return charCount ? Math.max(1, Math.round(charCount / 5 / 200)) : 5
}

function formatDate(iso?: string) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function initials(name?: string) {
  if (!name) return "F"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

interface Props {
  posts: HomePost[]
  copy: HomeCopy
}

/** Latest thinking — one featured post plus the two behind it. */
export default function InsightsGrid({ posts, copy }: Props) {
  const usable = posts.filter((post) => post.title && post.slug).slice(0, 3)
  if (usable.length === 0) return null

  const [featured, ...rest] = usable

  return (
    <section id="insights" className="scroll-mt-24 bg-tint py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-8">
          <div>
            <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">{homeText(copy, "insights-eyebrow")}</p>
            <h2 className="text-section-h2 mt-4 text-foreground">
              {homeText(copy, "insights-heading")}
            </h2>
          </div>
          <Link
            href="/consulting-blog"
            className="text-[15px] font-semibold whitespace-nowrap text-brand hover:text-[color:var(--blue-press)]"
          >
            {homeText(copy, "insights-all")}
          </Link>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-1 items-stretch gap-7 lg:mt-14 lg:grid-cols-[1.15fr_1fr]">
          <Link
            href={`/post/${featured.slug}`}
            className="ui-hover-card flex flex-col overflow-hidden rounded-card border border-lilac bg-surface-raised text-inherit shadow-whisper"
          >
            <div className="relative min-h-[240px] flex-1 lg:min-h-[300px] lg:max-h-[360px]">
              {featured.coverImage?.asset?._ref ? (
                <Image
                  src={urlFor(featured.coverImage).width(900).height(600).fit("crop").auto("format").url()}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-tint" />
              )}
            </div>
            <div className="flex flex-none flex-col p-7 lg:px-10 lg:pt-9 lg:pb-8">
              <div className="flex items-center gap-2.5 text-[13px] text-muted">
                {featured.categories?.[0]?.title && (
                  <>
                    <span className="font-semibold text-brand">{featured.categories[0].title}</span>
                    <span className="opacity-50">·</span>
                  </>
                )}
                <span>{formatDate(featured.publishedAt)}</span>
              </div>
              <h3 className="text-section-h3 mt-4 text-foreground lg:text-[30px]" style={{ textWrap: "pretty" }}>
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-body mt-4.5 text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
                  {featured.excerpt}
                </p>
              )}
              <div className="mt-7 flex items-center justify-between gap-4 border-t border-lilac pt-5.5">
                <span className="flex items-center gap-3">
                  <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-lilac bg-tint text-[12.5px] font-semibold text-brand">
                    {initials(featured.author)}
                  </span>
                  <span className="text-[13.5px] text-muted">
                    {featured.author}
                    <span className="mx-1.75 opacity-50">·</span>
                    {readTime(featured.charCount)} {homeText(copy, "insights-min-read")}
                  </span>
                </span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-7">
            {rest.map((post) => (
              <Link
                key={post._id ?? post.slug}
                href={`/post/${post.slug}`}
                className="ui-hover-card flex flex-1 flex-col rounded-card border border-lilac bg-surface-raised p-7 text-inherit shadow-whisper lg:px-8.5"
              >
                <div className="flex items-center gap-2.5 text-[12.5px] text-muted">
                  {post.categories?.[0]?.title && (
                    <>
                      <span className="font-semibold text-brand">{post.categories[0].title}</span>
                      <span className="opacity-50">·</span>
                    </>
                  )}
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="mt-4.5 flex items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-[21px] leading-[1.32] font-semibold text-foreground" style={{ textWrap: "pretty" }}>
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 text-[15.5px] leading-[1.65] text-muted" style={{ textWrap: "pretty" }}>
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  {post.coverImage?.asset?._ref && (
                    <div className="relative hidden h-[170px] w-[152px] flex-none overflow-hidden rounded-2xl sm:block">
                      <Image
                        src={urlFor(post.coverImage).width(304).height(340).fit("crop").auto("format").url()}
                        alt=""
                        fill
                        sizes="152px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-auto flex items-center gap-3 border-t border-lilac pt-5">
                  <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-lilac bg-tint text-[12.5px] font-semibold text-brand">
                    {initials(post.author)}
                  </span>
                  <span className="text-[13.5px] text-muted">
                    {post.author}
                    <span className="mx-1.75 opacity-50">·</span>
                    {readTime(post.charCount)} {homeText(copy, "insights-min-read")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
