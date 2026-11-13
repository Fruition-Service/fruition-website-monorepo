export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-[3px] border-ui border-t-[var(--purple-primary)] animate-spin"
        />
      </div>
    </div>
  )
}
