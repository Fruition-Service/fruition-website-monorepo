import { afterEach, describe, expect, it } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import YouTubeEmbed, { youTubePosterChain } from "@/components/YouTubeEmbed"

// Lets React's act() run in a plain jsdom environment.
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const ID = "7vtrtlfC1Zg"
const poster = (size: string) => `https://i.ytimg.com/vi/${ID}/${size}.jpg`

describe("youTubePosterChain", () => {
  it("starts at maxresdefault by default", () => {
    expect(youTubePosterChain(ID)).toEqual([
      poster("maxresdefault"),
      poster("sddefault"),
      poster("hqdefault"),
    ])
  })

  it("starts at sddefault for sd", () => {
    expect(youTubePosterChain(ID, "sd")).toEqual([poster("sddefault"), poster("hqdefault")])
  })
})

describe("YouTubeEmbed poster", () => {
  let root: Root | null = null
  let host: HTMLDivElement | null = null

  afterEach(() => {
    act(() => root?.unmount())
    host?.remove()
    root = null
    host = null
  })

  function mount(el: React.ReactElement) {
    host = document.createElement("div")
    document.body.appendChild(host)
    root = createRoot(host)
    act(() => root!.render(el))
    return host.querySelector("img")!
  }

  /** Simulates the image loading at the given natural width. */
  function load(img: HTMLImageElement, naturalWidth: number) {
    Object.defineProperty(img, "naturalWidth", { configurable: true, value: naturalWidth })
    act(() => {
      img.dispatchEvent(new Event("load"))
    })
  }

  it("keeps maxresdefault as the default poster", () => {
    const html = renderToStaticMarkup(<YouTubeEmbed videoId={ID} title="Demo" />)
    expect(html).toContain(`<img src="${poster("maxresdefault")}"`)
    expect(html).toContain('loading="lazy"')
  })

  it("uses sddefault when posterQuality is sd", () => {
    const html = renderToStaticMarkup(<YouTubeEmbed videoId={ID} title="Demo" posterQuality="sd" />)
    expect(html).toContain(`<img src="${poster("sddefault")}"`)
    // Only the poster changes; the VideoObject JSON-LD still lists maxres.
    expect(html).not.toContain(`<img src="${poster("maxresdefault")}"`)
    expect(html).toContain('loading="lazy"')
  })

  it("falls back from the 120px placeholder to hqdefault in sd mode", () => {
    const img = mount(<YouTubeEmbed videoId={ID} title="Demo" posterQuality="sd" />)
    expect(img.getAttribute("src")).toBe(poster("sddefault"))
    load(img, 120)
    expect(img.getAttribute("src")).toBe(poster("hqdefault"))
    // The last poster is kept even if it is also a placeholder.
    load(img, 120)
    expect(img.getAttribute("src")).toBe(poster("hqdefault"))
  })

  it("keeps a real sddefault poster in sd mode", () => {
    const img = mount(<YouTubeEmbed videoId={ID} title="Demo" posterQuality="sd" />)
    load(img, 640)
    expect(img.getAttribute("src")).toBe(poster("sddefault"))
  })

  it("walks the full chain on placeholders by default", () => {
    const img = mount(<YouTubeEmbed videoId={ID} title="Demo" />)
    expect(img.getAttribute("src")).toBe(poster("maxresdefault"))
    load(img, 120)
    expect(img.getAttribute("src")).toBe(poster("sddefault"))
    load(img, 120)
    expect(img.getAttribute("src")).toBe(poster("hqdefault"))
  })

  it("moves to the next poster on error in sd mode", () => {
    const img = mount(<YouTubeEmbed videoId={ID} title="Demo" posterQuality="sd" />)
    act(() => {
      img.dispatchEvent(new Event("error"))
    })
    expect(img.getAttribute("src")).toBe(poster("hqdefault"))
  })
})
