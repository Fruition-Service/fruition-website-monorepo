/**
 * Targeted migration: fetch images from original Wix site and patch
 * existing Sanity blog posts with cover + inline body images.
 */
import { createClient } from '@sanity/client'
import { parse } from 'node-html-parser'
import type { HTMLElement } from 'node-html-parser'
import * as dotenv from 'dotenv'
import { imageSize } from '../src/lib/imageSize.js'
import { WIX_PLACEHOLDER_WIDTH, wixOriginalUrl } from '../src/lib/wixImage.js'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const WIX_BASE = 'https://www.fruitionservices.io'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
const rk = () => Math.random().toString(36).slice(2, 10)

async function fetchHtml(url: string): Promise<HTMLElement> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36' },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return parse(await res.text()) as unknown as HTMLElement
}

async function uploadImage(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${WIX_BASE}${imageUrl}`
    const res = await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' },
      signal: AbortSignal.timeout(30000),
      redirect: 'follow',
    })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 500) return null // skip tiny images / tracking pixels

    // Never ingest a lazy-load placeholder, whatever the URL claimed to be.
    const size = imageSize(buffer)
    if (size && size.width < WIX_PLACEHOLDER_WIDTH) {
      console.log(`    Skipped ${size.width}x${size.height} placeholder`)
      return null
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const asset = await client.assets.upload('image', buffer, {
      filename: filename.substring(0, 100),
      contentType,
    })
    return asset._id
  } catch (err) {
    console.log(`    Upload failed: ${(err as Error).message}`)
    return null
  }
}

function extractOgImage(root: HTMLElement): string {
  const og = root.querySelector('meta[property="og:image"]')
  return og ? (og.getAttribute('content') || '') : ''
}

/**
 * Rewrite a Wix image URL to the full-resolution original.
 *
 * The previous version rewrote the `w_`/`h_` of a `fill` transform, which
 * silently did nothing for `fit` and `crop` transforms — that is how ~100 body
 * images were ingested at their 49px/147px placeholder size. Stripping the
 * transform outright is both simpler and correct for every transform Wix emits.
 */
function wixFullSize(url: string): string {
  return wixOriginalUrl(url)
}

/** Extract inline image URLs from the post body HTML */
function extractBodyImages(root: HTMLElement): { src: string; alt: string }[] {
  const container =
    root.querySelector('[data-hook="post-description"]') ||
    root.querySelector('.post-description') ||
    root.querySelector('[class*="post-description"]') ||
    root.querySelector('[data-hook="post-content"]') ||
    root.querySelector('article')
  if (!container) return []

  const imgs = container.querySelectorAll('img')
  const results: { src: string; alt: string }[] = []
  const seen = new Set<string>()

  for (const img of imgs) {
    let src = img.getAttribute('src') || img.getAttribute('data-src') || ''
    if (!src || src.startsWith('data:')) continue
    src = wixFullSize(src)
    // Dedupe by media ID (before fill params)
    const mediaId = src.match(/media\/([^/]+)/)?.[1] || src
    if (seen.has(mediaId)) continue
    seen.add(mediaId)
    results.push({ src, alt: img.getAttribute('alt') || '' })
  }
  return results
}

async function migratePost(post: { _id: string; slug: string; title: string; coverImage: any; body: any[] }, force: boolean) {
  const hasCover = !!post.coverImage?.asset
  const hasBodyImages = post.body?.some((b: any) => b._type === 'image') ?? false

  console.log(`\n[${post.slug}] "${post.title.substring(0, 50)}"`)

  const wixUrl = `${WIX_BASE}/post/${post.slug}`
  let root: HTMLElement
  try {
    root = await fetchHtml(wixUrl)
  } catch (err) {
    console.log(`  Skip — could not fetch: ${(err as Error).message}`)
    return
  }

  const patch: Record<string, any> = {}

  // 1. Cover image
  if (!hasCover || force) {
    const ogImg = wixFullSize(extractOgImage(root))
    if (ogImg) {
      console.log(`  Cover: ${ogImg.substring(0, 70)}`)
      const assetId = await uploadImage(ogImg, `${post.slug}-cover`)
      if (assetId) {
        patch.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
        console.log(`  Cover uploaded`)
      }
      await sleep(500)
    } else {
      console.log(`  No og:image found`)
    }
  } else {
    console.log(`  Cover already exists — skipping (use --force to re-upload)`)
  }

  // 2. Body images — insert into existing body array
  if (!hasBodyImages || force) {
    // If forcing, strip old image blocks from body first
    if (force && hasBodyImages) {
      post.body = (post.body || []).filter((b: any) => b._type !== 'image')
      console.log(`  Stripped old body images (--force)`)
    }
    const bodyImages = extractBodyImages(root)
    if (bodyImages.length > 0) {
      console.log(`  Found ${bodyImages.length} body image(s)`)

      // Upload all body images
      const uploaded: { assetId: string; alt: string }[] = []
      for (let i = 0; i < bodyImages.length; i++) {
        const { src, alt } = bodyImages[i]
        console.log(`    [${i + 1}/${bodyImages.length}] ${src.substring(0, 60)}`)
        const assetId = await uploadImage(src, `${post.slug}-body-${i + 1}`)
        if (assetId) uploaded.push({ assetId, alt })
        await sleep(400)
      }

      if (uploaded.length > 0) {
        // Strategy: append images after the first few text blocks (roughly after intro)
        // Since we don't know exact positions, we insert them spread throughout the body
        const body = [...(post.body || [])]
        const textBlocks = body.filter(b => b._type === 'block')
        const interval = Math.max(1, Math.floor(textBlocks.length / (uploaded.length + 1)))

        let insertOffset = 0
        for (let i = 0; i < uploaded.length; i++) {
          const insertAfterBlock = Math.min((i + 1) * interval, textBlocks.length - 1)
          // Find the actual index of that text block in the full body array
          let blockCount = 0
          let insertIdx = 0
          for (let j = 0; j < body.length; j++) {
            if (body[j]._type === 'block') {
              if (blockCount === insertAfterBlock) {
                insertIdx = j + 1
                break
              }
              blockCount++
            }
          }
          insertIdx += insertOffset
          body.splice(insertIdx, 0, {
            _type: 'image',
            _key: rk(),
            alt: uploaded[i].alt,
            asset: { _type: 'reference', _ref: uploaded[i].assetId },
          })
          insertOffset++
        }
        patch.body = body
        console.log(`  Inserted ${uploaded.length} image(s) into body`)
      }
    } else {
      console.log(`  No body images found on page`)
    }
  } else {
    console.log(`  Body already has images — skipping`)
  }

  // 3. Apply patch
  if (Object.keys(patch).length > 0) {
    await client.patch(post._id).set(patch).commit()
    console.log(`  Patched!`)
  } else {
    console.log(`  Nothing to patch`)
  }

  await sleep(800)
}

async function main() {
  // Accept optional slug filter and --force flag from CLI args
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const slugFilter = args.find(a => a !== '--force')

  let query: string
  let params: Record<string, any> = {}
  if (slugFilter) {
    query = `*[_type == "blogPost" && slug.current == $slug]{ _id, "slug": slug.current, title, coverImage, body }`
    params = { slug: slugFilter }
  } else {
    query = `*[_type == "blogPost"] | order(publishedAt desc) { _id, "slug": slug.current, title, coverImage, body }`
  }

  const posts = await client.fetch(query, params)
  console.log(`Found ${posts.length} post(s) to process`)

  let patched = 0
  for (const post of posts) {
    await migratePost(post, force)
    const after = true // we logged inside
    patched++
  }

  console.log(`\nDone — processed ${patched} post(s)`)
}

main().catch(err => { console.error(err); process.exit(1) })
