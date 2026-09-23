import { describe, expect, it } from "vitest"

import { BLOG_PLATFORMS, PLATFORMS, mediaItemsFor, platformSpec } from "@/lib/social/zernio"
import { problemsFor } from "@/lib/social/validate"
import { effectiveVideo, platformsFromInput } from "@/lib/social/composition"

/**
 * YouTube is the one channel whose post IS a file.
 *
 * It was left out of the integration entirely while the account sat connected
 * in Zernio, so these fix the shape it was added in: a video and nothing else,
 * never part of a blog's fan-out, and a caption alone can't publish.
 */

const VIDEO = "https://cdn.sanity.io/files/p/production/abc.mp4"
const IMAGE = "https://cdn.sanity.io/images/p/production/aaa-1080x1350.png"

const YT = {
  label: "YouTube",
  limit: 5000,
  titleLimit: 100,
  titleRequired: true,
  needsMedia: false,
  supportsMedia: false,
  supportsVideo: true,
  needsVideo: true,
  maxMedia: 0,
}

describe("the YouTube platform", () => {
  it("is a channel the composer can post to", () => {
    expect(PLATFORMS.map((p) => p.key)).toContain("youtube")
    expect(platformSpec("youtube").platform).toBe("youtube")
  })

  it("stays out of a blog's fan-out, because an article has no video", () => {
    expect(BLOG_PLATFORMS.map((p) => p.key)).not.toContain("youtube")
    expect(BLOG_PLATFORMS).toHaveLength(PLATFORMS.length - 1)
  })

  it("publishes the video as the post's only media item", () => {
    const items = mediaItemsFor(platformSpec("youtube"), { videoUrl: VIDEO, imageUrls: [IMAGE] })
    expect(items).toEqual([{ type: "video", url: VIDEO }])
  })

  it("titles the video with the post name when one is given", () => {
    const items = mediaItemsFor(platformSpec("youtube"), { videoUrl: VIDEO }, "How we cut approvals")
    expect(items![0].title).toBe("How we cut approvals")
  })

  it("never hands a video to a channel that can't take one", () => {
    expect(mediaItemsFor(platformSpec("linkedin"), { videoUrl: VIDEO })).toBeUndefined()
    expect(mediaItemsFor(platformSpec("twitter"), { videoUrl: VIDEO, imageUrls: [IMAGE] })).toEqual([
      { type: "image", url: IMAGE },
    ])
  })
})

describe("what blocks a YouTube post", () => {
  it("refuses a caption with no video", () => {
    expect(problemsFor(YT, { content: "a description", title: "A title" })).toEqual([
      "YouTube: a video is required — every post here is a video.",
    ])
  })

  it("passes once a video is attached", () => {
    expect(problemsFor(YT, { content: "a description", title: "A title", videoUrl: VIDEO })).toEqual([])
  })

  it("still wants a title, the way Reddit does", () => {
    const problems = problemsFor(YT, { content: "a description", videoUrl: VIDEO })
    expect(problems).toContain("YouTube: a title is required.")
  })

  it("says so plainly when a video lands on a channel that can't post one", () => {
    const linkedin = { label: "LinkedIn", limit: 3000, needsMedia: false, supportsMedia: true }
    expect(problemsFor(linkedin, { content: "hi", videoUrl: VIDEO })).toEqual([
      "LinkedIn: this channel can't post a video — YouTube is the only one that can.",
    ])
  })

  it("doesn't call a video channel text-only", () => {
    // supportsMedia is false on YouTube, and that used to be the text-only rule.
    const problems = problemsFor(YT, { content: "hi", title: "t", videoUrl: VIDEO, mediaUrls: [IMAGE] })
    expect(problems).toEqual([])
  })
})

describe("the video survives a save", () => {
  it("reads the video off a composer payload", () => {
    const parsed = platformsFromInput({
      youtube: { content: "desc", title: "A title", videoUrl: VIDEO, videoName: "clip.mp4" },
    })
    expect(parsed?.youtube?.videoUrl).toBe(VIDEO)
    expect(parsed?.youtube?.videoName).toBe("clip.mp4")
  })

  it("falls back to the Zernio draft when no choice was recorded here", () => {
    const spec = platformSpec("youtube")
    const live = { postId: "1", status: "draft", mediaUrls: [], videoUrl: VIDEO }
    expect(effectiveVideo({ content: "" }, live, spec)).toBe(VIDEO)
    // A deliberate "" is a removal, and has to beat what the draft still holds.
    expect(effectiveVideo({ content: "", videoUrl: "" }, live, spec)).toBe("")
  })

  it("is ignored on channels that don't take video", () => {
    const live = { postId: "1", status: "draft", mediaUrls: [], videoUrl: VIDEO }
    expect(effectiveVideo({ content: "", videoUrl: VIDEO }, live, platformSpec("linkedin"))).toBe("")
  })
})
