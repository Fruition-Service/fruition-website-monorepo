/**
 * Read an image's pixel dimensions straight out of its header bytes.
 *
 * The blog image repair needs to know whether a re-fetched original is actually
 * bigger than the asset it would replace — *before* uploading it, so a failed
 * recovery does not leave an orphan asset behind. That is the whole job, so it
 * covers the four formats Wix and the CMS actually serve rather than pulling in
 * an image library.
 */

export interface ImageSize {
  width: number
  height: number
}

function png(b: Buffer): ImageSize | null {
  // 8-byte signature, then an IHDR chunk whose data starts at offset 16.
  if (b.length < 24) return null
  if (b.readUInt32BE(0) !== 0x89504e47) return null
  if (b.toString("ascii", 12, 16) !== "IHDR") return null
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
}

function gif(b: Buffer): ImageSize | null {
  if (b.length < 10 || b.toString("ascii", 0, 3) !== "GIF") return null
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) }
}

function jpeg(b: Buffer): ImageSize | null {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null
  let i = 2
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) {
      i++ // resync: padding between segments is legal
      continue
    }
    const marker = b[i + 1]
    // Standalone markers carry no length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    if (marker === 0xd9 || marker === 0xda) return null // end of header section
    const length = b.readUInt16BE(i + 2)
    if (length < 2) return null
    // SOF0..SOF15, minus the DHT/JPG/DAC markers that share the range.
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isSof) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) }
    i += 2 + length
  }
  return null
}

function webp(b: Buffer): ImageSize | null {
  if (b.length < 30) return null
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null
  const chunk = b.toString("ascii", 12, 16)
  if (chunk === "VP8 ") {
    // Lossy: 3-byte frame tag + 3-byte start code, then 14-bit dimensions.
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === "VP8L") {
    // Lossless: 14-bit width-1 and height-1 packed into 4 bytes after the sig.
    const bits = b.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (chunk === "VP8X") {
    // Extended: 24-bit canvas width-1 / height-1, little-endian.
    const w = b[24] | (b[25] << 8) | (b[26] << 16)
    const h = b[27] | (b[28] << 8) | (b[29] << 16)
    return { width: w + 1, height: h + 1 }
  }
  return null
}

/** Dimensions of an encoded PNG / GIF / JPEG / WebP, or null if unreadable. */
export function imageSize(bytes: Buffer | Uint8Array): ImageSize | null {
  const b = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes)
  const size = png(b) ?? gif(b) ?? jpeg(b) ?? webp(b)
  if (!size) return null
  if (!Number.isFinite(size.width) || !Number.isFinite(size.height)) return null
  if (size.width <= 0 || size.height <= 0) return null
  return size
}
