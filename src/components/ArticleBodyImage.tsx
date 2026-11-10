import type { ReactNode } from "react"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import ZoomableImage from "@/components/ZoomableImage"
import { LIGHTBOX_MAX_WIDTH, imageLinkHref, lightboxSize, sanityImageSize } from "@/lib/sanityImageSize"

/**
 * Wraps an article body image so it either keeps the link an editor gave it,
 * or (the common case) becomes click-to-enlarge. Server component: only the
 * small `ZoomableImage` trigger and dialog ship to the client.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleBodyImage({ value, children }: { value: any; children: ReactNode }) {
  const alt: string = value?.alt || ""
  const href = imageLinkHref(value)

  if (href) {
    const internal = href.startsWith("/") || href.startsWith("#")
    return internal ? (
      <Link href={href} className="block w-full">
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        {children}
      </a>
    )
  }

  const largeSrc = urlFor(value).width(LIGHTBOX_MAX_WIDTH).fit("max").auto("format").quality(85).url()
  const size = lightboxSize(sanityImageSize(value?.asset?._ref))

  return (
    <ZoomableImage
      largeSrc={largeSrc}
      alt={alt}
      caption={typeof value?.caption === "string" ? value.caption : undefined}
      width={size?.width}
      height={size?.height}
    >
      {children}
    </ZoomableImage>
  )
}
