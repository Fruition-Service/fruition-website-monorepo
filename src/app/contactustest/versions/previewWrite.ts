/**
 * Write-suppressing stand-in for `fetch`, used by every archived snapshot on
 * /contactustest.
 *
 * The snapshots read live: availability comes from the real endpoint, so the
 * times on an old card are the times a visitor would be offered today. Writing
 * is a different matter — an archived card must never create a lead on the CRM
 * board, a Calendly invitee, or an enquiry in the inbox, however far someone
 * clicks through it. Every POST in these files goes through here instead, which
 * answers the way the endpoint answered on success (so the card advances to the
 * state it used to reach) and records nothing anywhere.
 *
 * No `bookingUrl` comes back on purpose: the later versions then fall through to
 * the card's own calendar link, which is exactly what they do when the capture
 * call fails in production.
 */
export async function previewWrite(url: string, init?: RequestInit): Promise<Response> {
  if (typeof console !== "undefined") {
    console.info("[contactustest] write suppressed:", url, init?.body)
  }
  return new Response(JSON.stringify({ ok: true, preview: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}
