/**
 * Claude Partner Network badge artwork for the site's code-side surfaces.
 *
 *   node scripts/claude-partner-tier/artwork.mjs certified <badge.avif|png|svg|webp>
 *   node scripts/claude-partner-tier/artwork.mjs select
 *
 * certified: from the official horizontal badge Anthropic issues, writes
 *   public/images/partner-badges/claude-certified.webp   (416x132, hero badges)
 *   public/images/home/partner-claude-certified.png      (253x80, home and contact rows)
 *   src/app/opengraph-image.jpg                          (default share card, badge swapped in)
 * select: puts the original share card back (scripts/claude-partner-tier/opengraph-image-select.jpg).
 *   The Select badge files never left public/, so nothing else is needed.
 *
 * The share card is built from the Select original, so running this twice is safe.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const OG = path.join(ROOT, 'src/app/opengraph-image.jpg')
const OG_SELECT = path.join(ROOT, 'scripts/claude-partner-tier/opengraph-image-select.jpg')
/** Where the Claude badge sits on the 1200x630 share card (measured from the Select original). */
const OG_BOX = { left: 850, top: 286, width: 266, height: 84 }
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 }

async function fit(src, width, height) {
  return sharp(src, { density: 600 }).resize(width, height, { fit: 'contain', background: CLEAR })
}

async function certified(src) {
  if (!src || !fs.existsSync(src)) throw new Error('Pass the path to the Certified Services Partner badge')
  await (await fit(src, 416, 132)).webp({ quality: 92 }).toFile(path.join(ROOT, 'public/images/partner-badges/claude-certified.webp'))
  await (await fit(src, 253, 80)).png({ compressionLevel: 9 }).toFile(path.join(ROOT, 'public/images/home/partner-claude-certified.png'))

  // Cover the old badge with the card's own gradient (sampled either side of
  // the box, row by row), then place the new badge in the same box.
  const pad = 3
  const box = { left: OG_BOX.left - pad, top: OG_BOX.top - pad, width: OG_BOX.width + pad * 2, height: OG_BOX.height + pad * 2 }
  const { data, info } = await sharp(OG_SELECT).raw().toBuffer({ resolveWithObject: true })
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels
    return [data[i], data[i + 1], data[i + 2]]
  }
  const patch = Buffer.alloc(box.width * box.height * 3)
  for (let y = 0; y < box.height; y++) {
    const a = px(box.left - 2, box.top + y)
    const b = px(box.left + box.width + 1, box.top + y)
    for (let x = 0; x < box.width; x++) {
      const f = x / (box.width - 1)
      for (let c = 0; c < 3; c++) patch[(y * box.width + x) * 3 + c] = Math.round(a[c] + (b[c] - a[c]) * f)
    }
  }
  const badge = await (await fit(src, OG_BOX.width, OG_BOX.height)).png().toBuffer()
  const out = await sharp(OG_SELECT)
    .composite([
      { input: patch, raw: { width: box.width, height: box.height, channels: 3 }, left: box.left, top: box.top },
      { input: badge, left: OG_BOX.left, top: OG_BOX.top },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer()
  fs.writeFileSync(OG, out)
  console.log('Wrote claude-certified.webp, partner-claude-certified.png and opengraph-image.jpg')
}

const [tier, src] = process.argv.slice(2)
if (tier === 'certified') await certified(src)
else if (tier === 'select') {
  fs.copyFileSync(OG_SELECT, OG)
  console.log('Restored the Select share card. Set CLAUDE_PARTNER_TIER = "select" in src/data/claudePartnerTier.ts.')
} else throw new Error('Usage: artwork.mjs certified <badge> | select')
