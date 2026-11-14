/**
 * Route-change placeholder. It must be at least a full screen tall: at 60vh the
 * footer rose into view during in-app navigation and was then pushed back down
 * when the page streamed in, two layout shifts of about 0.25 each. PostHog
 * reported that as a CLS of 1.08 (p75) on /consulting-blog for visitors who
 * arrived there from the home page (14 Nov 2026).
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-[3px] border-ui border-t-[var(--purple-primary)] animate-spin"
        />
      </div>
    </div>
  )
}
