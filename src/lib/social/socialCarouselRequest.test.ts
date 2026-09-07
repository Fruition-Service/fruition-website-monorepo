import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  createDraftPost,
  publishSocialDraft,
  republishCancelledPost,
  scheduleSocialPost,
  updateSocialDraft,
  platformSpec,
  type ZernioPost,
} from "@/lib/social/zernio"
import {
  channelImages,
  effectiveMedia,
  mediaUrlsOf,
  platformsFromInput,
} from "@/lib/social/composition"

/**
 * What actually goes over the wire to Zernio.
 *
 * socialCarousel.test.ts covers mediaItemsFor on its own. That is the piece
 * that builds the list, but it is not the piece that failed: a post carrying
 * four slides went out as one picture on Instagram, and every entry point into
 * Zernio had to be changed for it to stop. So these assert the request body of
 * each of those entry points, which is the only place the bug was visible.
 */

const SLIDES = [
  "https://cdn.sanity.io/images/p/production/a-1080x1350.png",
  "https://cdn.sanity.io/images/p/production/b-1080x1350.png",
  "https://cdn.sanity.io/images/p/production/c-1080x1350.png",
  "https://cdn.sanity.io/images/p/production/d-1080x1350.png",
]
/** 1080x1350 is 4:5, inside Instagram's range, so only the size cap applies. */
const SENT = SLIDES.map((u) => `${u}?w=1080&fit=max&fm=jpg`)

interface Sent {
  method: string
  body: Record<string, unknown>
}
let sent: Sent[] = []

function mediaOf(entry: Sent | undefined) {
  return (entry?.body.mediaItems ?? []) as Array<{ type: string; url: string; title?: string }>
}

/** The last write, which is the one that carries the finished media list. */
function lastWrite() {
  return [...sent].reverse().find((s) => s.method === "PUT" || s.method === "POST")
}

beforeEach(() => {
  process.env.ZERNIO_API_KEY = "test-key"
  sent = []
  globalThis.fetch = vi.fn(async (_url: unknown, init?: RequestInit) => {
    sent.push({
      method: init?.method ?? "GET",
      body: init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {},
    })
    return new Response(JSON.stringify({ post: { _id: "new-post-id", status: "publishing" } }), { status: 200 })
  }) as unknown as typeof fetch
})

describe("every Zernio entry point carries the whole carousel", () => {
  it("publishes four Instagram slides, in the order they were arranged", async () => {
    await publishSocialDraft({ postId: "p1", key: "instagram", content: "caption", blogUrl: "", imageUrls: SLIDES })
    const put = lastWrite()
    expect(mediaOf(put).map((m) => m.url)).toEqual(SENT)
    expect(put?.body.publishNow).toBe(true)
  })

  it("creates a draft carrying all four", async () => {
    await createDraftPost({
      target: { kind: "composition", compositionId: "c1" },
      key: "instagram",
      name: "Post",
      content: "caption",
      imageUrls: SLIDES,
    })
    expect(mediaOf(lastWrite()).map((m) => m.url)).toEqual(SENT)
  })

  it("schedules all four", async () => {
    await scheduleSocialPost({
      postId: "p1",
      key: "instagram",
      content: "caption",
      imageUrls: SLIDES,
      scheduledFor: new Date(Date.now() + 86_400_000).toISOString(),
    })
    expect(mediaOf(lastWrite()).map((m) => m.url)).toEqual(SENT)
  })

  it("updates a draft to all four", async () => {
    await updateSocialDraft({ postId: "p1", key: "instagram", content: "caption", imageUrls: SLIDES })
    expect(mediaOf(lastWrite()).map((m) => m.url)).toEqual(SENT)
  })

  it("carries them onto the fresh post when republishing a cancelled one", async () => {
    const oldPost = { _id: "old", status: "cancelled", content: "x", title: "T" } as ZernioPost
    await republishCancelledPost({ oldPost, key: "instagram", content: "caption", blogUrl: "", imageUrls: SLIDES })
    expect(mediaOf(lastWrite()).map((m) => m.url)).toEqual(SENT)
  })

  it("leaves media alone when a channel was given none", async () => {
    await updateSocialDraft({ postId: "p1", key: "instagram", content: "caption" })
    expect(lastWrite()?.body.mediaItems).toBeUndefined()
  })

  it("still sends one picture to a channel that only takes one", async () => {
    await publishSocialDraft({ postId: "p1", key: "gbp-au", content: "c", blogUrl: "", imageUrls: SLIDES })
    expect(mediaOf(lastWrite())).toHaveLength(1)
  })
})

describe("what a channel is understood to carry", () => {
  it("keeps the order the writer arranged", () => {
    expect(channelImages({ content: "", mediaUrls: [SLIDES[1], SLIDES[0]] })).toEqual([SLIDES[1], SLIDES[0]])
  })

  it("folds a pre-carousel row's single mediaUrl into a list", () => {
    expect(mediaUrlsOf({ content: "", mediaUrl: SLIDES[0] })).toEqual([SLIDES[0]])
  })

  it("keeps 'deliberately none' distinct from 'no choice recorded'", () => {
    expect(mediaUrlsOf({ content: "", mediaUrls: [] })).toEqual([])
    expect(mediaUrlsOf({ content: "", mediaUrl: "" })).toEqual([])
    expect(mediaUrlsOf({ content: "" })).toBeUndefined()
  })

  it("hands an over-full channel to the validator rather than trimming it", () => {
    const many = Array.from({ length: 12 }, (_, i) => `${SLIDES[0]}#${i}`)
    expect(effectiveMedia({ content: "", mediaUrls: many }, undefined, platformSpec("instagram"))).toHaveLength(12)
  })

  it("inherits the live draft's images only when no local choice exists", () => {
    const spec = platformSpec("instagram")
    const live = { postId: "p", status: "draft", mediaUrls: SLIDES.slice(0, 2) }
    expect(effectiveMedia(undefined, live, spec)).toEqual(SLIDES.slice(0, 2))
    expect(effectiveMedia({ content: "", mediaUrls: [] }, live, spec)).toEqual([])
  })
})

describe("the whole way from the composer's save to Zernio", () => {
  /**
   * The two halves of this bug were one step apart: #163 taught the publish
   * path to send every image, #164 stopped the save path throwing them away.
   * Each half is tested on its own, so a break in the seam between them would
   * pass both. This walks the actual chain instead.
   */
  it("keeps four picked slides from request body to published carousel", async () => {
    const parsed = platformsFromInput({ instagram: { content: "caption", mediaUrls: SLIDES } })
    const draft = parsed!.instagram!

    await publishSocialDraft({
      postId: "p1",
      key: "instagram",
      content: draft.content,
      blogUrl: "",
      imageUrls: channelImages(draft),
    })

    expect(mediaOf(lastWrite()).map((m) => m.url)).toEqual(SENT)
  })

  it("a channel that picked nothing leaves the live draft's media alone", async () => {
    const parsed = platformsFromInput({ instagram: { content: "caption" } })
    await updateSocialDraft({
      postId: "p1",
      key: "instagram",
      content: "caption",
      imageUrls: mediaUrlsOf(parsed!.instagram!),
    })
    expect(lastWrite()?.body.mediaItems).toBeUndefined()
  })

  it("a deliberate none clears the media", async () => {
    const parsed = platformsFromInput({ instagram: { content: "caption", mediaUrls: [] } })
    await updateSocialDraft({
      postId: "p1",
      key: "instagram",
      content: "caption",
      imageUrls: mediaUrlsOf(parsed!.instagram!),
    })
    expect(lastWrite()?.body.mediaItems).toEqual([])
  })
})

describe("a channel that never recorded a media choice", () => {
  /**
   * The composer and the publish route read the same row two ways: the composer
   * fell back to the channel's Zernio draft, publishing did not. So a channel
   * whose picture only lived on the draft showed an image in the portal and
   * went out without one. Both now resolve it through channelImages.
   */
  const spec = platformSpec("instagram")
  const live = { postId: "p1", status: "draft", mediaUrls: SLIDES.slice(0, 2) }

  it("inherits the Zernio draft's images, exactly as the composer shows them", () => {
    const draft = platformsFromInput({ instagram: { content: "caption" } })!.instagram!
    expect(channelImages(draft, live)).toEqual(SLIDES.slice(0, 2))
    expect(channelImages(draft, live)).toEqual(effectiveMedia(draft, live, spec))
  })

  it("publishes those inherited images rather than an empty post", async () => {
    const draft = platformsFromInput({ instagram: { content: "caption" } })!.instagram!
    await publishSocialDraft({
      postId: "p1",
      key: "instagram",
      content: "caption",
      blogUrl: "",
      imageUrls: channelImages(draft, live),
    })
    expect(mediaOf(lastWrite()).map((m) => m.url)).toEqual(SENT.slice(0, 2))
  })

  it("still caps the inherited carousel at the channel's limit", async () => {
    const many = Array.from(
      { length: 12 },
      (_, i) => `https://cdn.sanity.io/images/p/production/s${i}-1080x1350.png`,
    )
    const draft = platformsFromInput({ instagram: { content: "caption" } })!.instagram!
    await publishSocialDraft({
      postId: "p1",
      key: "instagram",
      content: "caption",
      blogUrl: "",
      imageUrls: channelImages(draft, { postId: "p1", status: "draft", mediaUrls: many }),
    })
    expect(mediaOf(lastWrite())).toHaveLength(spec.maxMedia)
  })

  it("leaves a deliberate none alone, on either row shape", () => {
    const picked = platformsFromInput({ instagram: { content: "caption", mediaUrls: [] } })!.instagram!
    expect(channelImages(picked, live)).toEqual([])
    // The pre-carousel shape the LinkedIn channel published with: "" is a
    // recorded choice to send no picture, not an absent one.
    expect(channelImages({ content: "", mediaUrl: "" }, live)).toEqual([])
  })

  it("publishes nothing for a channel that deliberately picked none", async () => {
    await publishSocialDraft({
      postId: "p1",
      key: "linkedin",
      content: "caption",
      blogUrl: "",
      imageUrls: channelImages({ content: "", mediaUrl: "" }, live),
    })
    expect(lastWrite()?.body.mediaItems).toBeUndefined()
  })

  it("never lets the draft override an explicit selection", () => {
    expect(channelImages({ content: "", mediaUrls: [SLIDES[3]] }, live)).toEqual([SLIDES[3]])
  })
})
