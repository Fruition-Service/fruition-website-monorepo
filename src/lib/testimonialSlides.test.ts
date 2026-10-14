import { describe, expect, it } from "vitest"
import { orderSlides } from "./testimonialSlides"

const photo = { _type: "image", asset: { _ref: "image-abc-55x51-heif", _type: "reference" } }

describe("orderSlides", () => {
  it("keeps one slide per quote and prefers the copy with a photo", () => {
    const slides = orderSlides([
      { _id: "migrated-0", clientName: "Jade Wood", quote: "We are now utilising monday.com" },
      { _id: "casestudy-0", clientName: "Jade Wood", quote: "We are now utilising monday.com", profilePhoto: photo },
      { _id: "casestudy-5", clientName: "Louis Stenmark", quote: "Windfall" },
    ])
    expect(slides.map((s) => s._id)).toEqual(["casestudy-0", "casestudy-5"])
  })

  it("starts on the featured testimonial", () => {
    const list = [
      { _id: "a", clientName: "A", quote: "one" },
      { _id: "b", clientName: "B", quote: "two" },
      { _id: "c", clientName: "C", quote: "three" },
    ]
    expect(orderSlides(list, list[2]).map((s) => s._id)).toEqual(["c", "a", "b"])
  })
})
