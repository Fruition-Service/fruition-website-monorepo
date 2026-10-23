/**
 * Unit tests for the header-only image dimension reader.
 *
 * Each helper builds the smallest byte sequence a real encoder would emit for
 * that format's header, so the tests exercise the same offsets a downloaded
 * image hits.
 */
import { describe, expect, it } from "vitest"
import { imageSize } from "@/lib/imageSize"

function png(width: number, height: number): Buffer {
  const b = Buffer.alloc(24)
  b.writeUInt32BE(0x89504e47, 0)
  b.writeUInt32BE(0x0d0a1a0a, 4)
  b.writeUInt32BE(13, 8)
  b.write("IHDR", 12, "ascii")
  b.writeUInt32BE(width, 16)
  b.writeUInt32BE(height, 20)
  return b
}

function gif(width: number, height: number): Buffer {
  const b = Buffer.alloc(13)
  b.write("GIF89a", 0, "ascii")
  b.writeUInt16LE(width, 6)
  b.writeUInt16LE(height, 8)
  return b
}

/** SOI, an APP0 segment to skip over, then the SOF0 that carries the size. */
function jpeg(width: number, height: number): Buffer {
  const app0 = Buffer.alloc(4 + 12)
  app0.writeUInt16BE(0xffe0, 0)
  app0.writeUInt16BE(14, 2)
  app0.write("JFIF\0", 4, "ascii")

  const sof0 = Buffer.alloc(11)
  sof0.writeUInt16BE(0xffc0, 0)
  sof0.writeUInt16BE(9, 2)
  sof0.writeUInt8(8, 4)
  sof0.writeUInt16BE(height, 5)
  sof0.writeUInt16BE(width, 7)
  sof0.writeUInt8(1, 9)

  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, sof0])
}

function webpLossless(width: number, height: number): Buffer {
  const b = Buffer.alloc(30)
  b.write("RIFF", 0, "ascii")
  b.write("WEBP", 8, "ascii")
  b.write("VP8L", 12, "ascii")
  b.writeUInt8(0x2f, 20) // VP8L signature byte
  b.writeUInt32LE(((height - 1) << 14) | (width - 1), 21)
  return b
}

describe("imageSize", () => {
  it("reads PNG dimensions", () => {
    expect(imageSize(png(1200, 675))).toEqual({ width: 1200, height: 675 })
  })

  it("reads GIF dimensions", () => {
    expect(imageSize(gif(800, 600))).toEqual({ width: 800, height: 600 })
  })

  it("reads JPEG dimensions past a leading APP0 segment", () => {
    expect(imageSize(jpeg(2500, 1406))).toEqual({ width: 2500, height: 1406 })
  })

  it("reads lossless WebP dimensions", () => {
    expect(imageSize(webpLossless(1480, 832))).toEqual({ width: 1480, height: 832 })
  })

  it("reads the Wix placeholder sizes that broke the blog", () => {
    expect(imageSize(jpeg(147, 83))).toEqual({ width: 147, height: 83 })
    expect(imageSize(png(49, 25))).toEqual({ width: 49, height: 25 })
  })

  it("accepts a Uint8Array as well as a Buffer", () => {
    expect(imageSize(new Uint8Array(png(64, 64)))).toEqual({ width: 64, height: 64 })
  })

  it("returns null for bytes it cannot read", () => {
    expect(imageSize(Buffer.from("<html>not an image</html>"))).toBeNull()
    expect(imageSize(Buffer.alloc(0))).toBeNull()
    expect(imageSize(Buffer.from([0xff, 0xd8]))).toBeNull() // truncated JPEG
  })
})
