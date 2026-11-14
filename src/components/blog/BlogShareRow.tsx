"use client"

import { useState } from "react"

/**
 * Version C share row on a blog post (hero meta column and the author card).
 * Facebook and LinkedIn are plain links, so they work before hydration;
 * "Copy link" and "Share" need the clipboard and the Web Share API. The URL is
 * the canonical post URL passed in by the server, not window.location, so a
 * shared link never carries tracking parameters.
 */
export default function BlogShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const enc = encodeURIComponent(url)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: nothing useful to fall back to */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* the visitor closed the share sheet */
      }
      return
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${enc}`
  }

  return (
    <div className="shr">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
        <svg viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path d="M11.83 6.08V4.66c0-.69.46-.86.78-.86h1.98V1.02L11.85 1c-3.02 0-3.71 2.27-3.71 3.72v1.36H6.39v2.97h1.78v7.95h3.43V9.05h2.54l.12-1.17.19-1.8h-2.62Z" fill="currentColor" />
        </svg>
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <svg viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path d="M4.3 6.43H1.22v9.92H4.3V6.43ZM2.76 1.08c-1.06 0-1.76.7-1.76 1.6 0 .89.68 1.6 1.72 1.6h.02c1.08 0 1.76-.71 1.76-1.6-.02-.9-.68-1.6-1.74-1.6ZM12.31 6.21c-1.63 0-2.36.9-2.77 1.53V6.43H6.46c.04.87 0 9.92 0 9.92h3.08v-5.54c0-.28.02-.55.1-.75.22-.55.73-1.13 1.59-1.13 1.12 0 1.57.85 1.57 2.1v5.32H15.9v-5.68c0-2.85-1.52-4.17-3.55-4.17l-.04-.29Z" fill="currentColor" />
        </svg>
      </a>
      <button type="button" aria-label={copied ? "Link copied" : "Copy link"} title={copied ? "Link copied" : "Copy link"} className={copied ? "copied" : undefined} onClick={copyLink}>
        <svg viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path d="M8 11.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M11 7.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" aria-label="Share" onClick={nativeShare}>
        <svg viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path d="M17 2 9.5 9.5M17 2l-5 15-2.5-7.5L2 7l15-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
