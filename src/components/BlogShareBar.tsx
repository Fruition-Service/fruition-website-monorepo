"use client"

import { useState } from "react"

/**
 * Share row under a blog article. The icons used to be inert buttons carried
 * over from the Wix template; each one now does what its label says, reading
 * the URL at click time so the server render stays static.
 */

function popup(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=560")
}

const iconBtn =
  "size-[38px] rounded-full flex items-center justify-center text-body border border-ui hover:border-brand-dark hover:text-brand-dark transition-colors"

export default function BlogShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const pageUrl = () => window.location.href.split("#")[0]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: nothing useful to fall back to */
    }
  }

  async function nativeShare() {
    const url = pageUrl()
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* user dismissed the sheet */
      }
      return
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  }

  return (
    <div className="flex items-center justify-between gap-4 w-full py-[20px] border-y border-ui">
      <span className="text-[14px] font-semibold text-body">Share this article</span>
      <div className="flex items-center gap-[10px]">
        <button
          type="button"
          aria-label="Share on Facebook"
          className={iconBtn}
          onClick={() =>
            popup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl())}`)
          }
        >
          <svg width="17" height="17" viewBox="0 0 19 19" fill="none" aria-hidden>
            <path
              d="M11.83 6.08V4.66c0-.69.46-.86.78-.86h1.98V1.02L11.85 1c-3.02 0-3.71 2.27-3.71 3.72v1.36H6.39v2.97h1.78v7.95h3.43V9.05h2.54l.12-1.17.19-1.8h-2.62Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Share on LinkedIn"
          className={iconBtn}
          onClick={() =>
            popup(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`,
            )
          }
        >
          <svg width="17" height="17" viewBox="0 0 19 19" fill="none" aria-hidden>
            <path
              d="M4.3 6.43H1.22v9.92H4.3V6.43ZM2.76 1.08c-1.06 0-1.76.7-1.76 1.6 0 .89.68 1.6 1.72 1.6h.02c1.08 0 1.76-.71 1.76-1.6-.02-.9-.68-1.6-1.74-1.6ZM12.31 6.21c-1.63 0-2.36.9-2.77 1.53V6.43H6.46c.04.87 0 9.92 0 9.92h3.08v-5.54c0-.28.02-.55.1-.75.22-.55.73-1.13 1.59-1.13 1.12 0 1.57.85 1.57 2.1v5.32H15.9v-5.68c0-2.85-1.52-4.17-3.55-4.17l-.04-.29Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Link copied" : "Copy link"}
          className={iconBtn}
          onClick={copyLink}
        >
          {copied ? (
            <svg width="17" height="17" viewBox="0 0 19 19" fill="none" aria-hidden>
              <path
                d="m4 10 3.5 3.5L15 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 19 19" fill="none" aria-hidden>
              <path
                d="M8 11.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M11 7.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <button type="button" aria-label="Share" className={iconBtn} onClick={nativeShare}>
          <svg width="17" height="17" viewBox="0 0 19 19" fill="none" aria-hidden>
            <path
              d="M17 2 9.5 9.5M17 2l-5 15-2.5-7.5L2 7l15-5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  )
}
