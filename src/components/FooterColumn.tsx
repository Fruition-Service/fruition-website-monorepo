"use client"
import Link from 'next/link'
import { useId, useState } from 'react'

interface FooterColumnProps {
  heading?: string
  links: { label?: string; href?: string }[]
}

/**
 * One footer link column. From md up it is a plain heading and list; on a
 * phone the heading becomes a toggle, so five columns of links don't stack
 * into a page-length footer. The links are always in the HTML (only hidden by
 * CSS when collapsed), so crawlers see every one of them.
 */
export default function FooterColumn({ heading, links }: FooterColumnProps) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  return (
    <div className="border-b border-white/15 md:border-b-0">
      <h2 className="text-sm font-semibold text-white">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full min-h-11 items-center justify-between py-3 text-left md:hidden"
        >
          {heading}
          <svg
            aria-hidden
            className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <span className="hidden md:block font-mono text-xs uppercase tracking-[0.14em] mb-4">{heading}</span>
      </h2>
      <ul id={listId} className={`${open ? 'block' : 'hidden'} pb-3 md:block md:pb-0`}>
        {links.map((link, i) => (
          <li key={`${link.href}-${i}`}>
            <Link
              href={link.href || '#'}
              className="block py-2 text-sm text-white/75 transition-colors hover:text-white md:py-1.5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
