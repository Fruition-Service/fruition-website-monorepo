import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import Image from "next/image"
import { urlFor } from "@/sanity/image"

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="my-8 overflow-hidden rounded-xl">
          <Image
            src={urlFor(value).auto("format").quality(90).url()}
            alt={value.alt || ""}
            width={740}
            height={416}
            className="h-auto w-full"
            sizes="(max-width: 924px) 100vw, 740px"
          />
        </div>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 border-b border-ui pb-2 text-2xl font-bold tracking-tight text-body">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-lg font-semibold text-body">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-body">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-ui pl-4 italic text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-1 list-disc space-y-1.5 pl-5 text-body marker:text-muted">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-1 list-decimal space-y-1.5 pl-5 text-body marker:text-muted">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-body">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#8015E8] underline underline-offset-2 break-words hover:text-[#6a11c2]"
      >
        {children}
      </a>
    ),
  },
}

export default function PolicyContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="text-[15px]">
      <PortableText value={value} components={components} />
    </div>
  )
}
