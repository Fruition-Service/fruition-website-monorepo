import type { PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { articleImageProps } from "@/sanity/image"

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      const img = articleImageProps(value)
      return (
        <div className="my-8 relative w-full rounded-xl overflow-hidden">
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
      )
    },
    code: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
        <code className="whitespace-pre">{value?.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-words hover:text-blue-900">
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link href={value?.slug?.current ? `/${value.slug.current}` : "#"} className="text-blue-700 underline hover:text-blue-900">
        {children}
      </Link>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold text-body mt-10 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold text-body mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold text-body mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold text-body mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-700 pl-4 italic text-muted my-4">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="text-body leading-relaxed mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-body">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-body">{children}</ol>,
  },
}

export default portableTextComponents