"use client"

import Link from "next/link"
import { memo, type ReactNode } from "react"
import { parseInlineMarkdown } from "@/lib/inlineMarkdown"
import { parseBlocks, safeHref } from "@/lib/askFruit/markdown"

function Inline({ text }: { text: string }) {
  const runs = parseInlineMarkdown(text)
  return (
    <>
      {runs.map((run, i) => {
        if (run.href) {
          const href = safeHref(run.href)
          if (!href) return <span key={i}>{run.text}</span>
          if (href.startsWith("/")) {
            return (
              <Link key={i} href={href} className="font-medium text-brand underline decoration-lilac-strong underline-offset-2 hover:decoration-brand">
                {run.text}
              </Link>
            )
          }
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline decoration-lilac-strong underline-offset-2 hover:decoration-brand">
              {run.text}
            </a>
          )
        }
        let node: ReactNode = run.text
        if (run.em) node = <em>{node}</em>
        if (run.strong) node = <strong className="font-semibold text-body">{node}</strong>
        return <span key={i}>{node}</span>
      })}
    </>
  )
}

function MarkdownImpl({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown)
  return (
    <div className="flex flex-col gap-3 text-[15px] leading-[1.65] text-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <p key={i} className="font-semibold text-body">
                <Inline text={block.text} />
              </p>
            )
          case "list": {
            const Tag = block.ordered ? "ol" : "ul"
            return (
              <Tag key={i} className={`flex flex-col gap-1.5 pl-5 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-muted`}>
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <Inline text={item} />
                  </li>
                ))}
              </Tag>
            )
          }
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-chip border border-ui">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead className="bg-surface-subtle">
                    <tr>
                      {block.header.map((h, j) => (
                        <th key={j} className="border-b border-ui px-3 py-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                          <Inline text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className="border-b border-dashed border-ui last:border-0">
                        {row.map((cell, c) => (
                          <td key={c} className="px-3 py-2 align-top">
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            )
        }
      })}
    </div>
  )
}

export const Markdown = memo(MarkdownImpl)
