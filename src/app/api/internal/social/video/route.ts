import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { uploadFileStream } from "@/lib/sanityWriteClient"

export const runtime = "nodejs"
export const maxDuration = 300

/**
 * Upload a video for a YouTube post.
 *
 * Unlike the image and document routes this takes the file as the RAW request
 * body rather than multipart form data, with the name and type in the query
 * string. A video is the one thing the portal handles that is too big to hold
 * in memory: `formData()` materialises the whole file and `arrayBuffer()`
 * copies it again, which is roughly twice the file inside a Worker that has
 * 128 MB. Streaming the body straight to Sanity costs a buffer's worth however
 * long the video is.
 *
 * It goes to Sanity's public file assets, the same store the LinkedIn PDFs
 * use, because Zernio fetches media by URL and needs somewhere it can reach.
 *
 * Cloudflare refuses a request body over 100 MB before it ever reaches this
 * route, so that is the real ceiling. Anything longer is pasted as a URL in
 * the composer instead.
 */
const MAX_VIDEO_BYTES = 100 * 1024 * 1024

const ALLOWED: Record<string, string> = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-ms-wmv": "wmv",
  "video/x-flv": "flv",
  "video/3gpp": "3gp",
  "video/webm": "webm",
}

export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const params = new URL(req.url).searchParams
  const name = (params.get("filename") || "video.mp4").replace(/[\r\n"]/g, "").slice(0, 120)
  const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase()

  const ext = ALLOWED[type]
  if (!ext) {
    return NextResponse.json(
      { error: "YouTube takes MP4, MOV, AVI, WMV, FLV, 3GP or WebM." },
      { status: 415 },
    )
  }

  // Trust the header only to refuse early; a lying one still can't get past
  // Cloudflare's own limit, which is the ceiling that actually holds.
  const declared = Number(req.headers.get("content-length") ?? "0")
  if (Number.isFinite(declared) && declared > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      {
        error: `That video is ${(declared / 1024 / 1024).toFixed(0)} MB — the limit through the portal is 100 MB. Upload it somewhere public and paste the link instead.`,
      },
      { status: 413 },
    )
  }
  if (!req.body) return NextResponse.json({ error: "A video file is required." }, { status: 400 })

  const stem =
    name
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "video"

  try {
    const { url } = await uploadFileStream(req.body, type, `social-${stem}.${ext}`)
    return NextResponse.json({ ok: true, url, name })
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
