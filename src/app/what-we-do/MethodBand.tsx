import { METHOD_STEPS } from '@/components/home/data'

/**
 * The four delivery phases, as a static band.
 *
 * Copy and sequence come straight from METHOD_STEPS (the home page's animated
 * MethodTimeline), so the hub says exactly what the home page says without
 * repeating its dark, animated panel: this page closes on the dark CTA, and two
 * immersive bands back to back read as one heavy block.
 */
export default function MethodBand() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {METHOD_STEPS.map((step) => (
        <div key={step.num} className="rounded-card bg-surface-raised p-6 ring-1 ring-ui shadow-whisper">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{step.num}</p>
          <h3 className="text-card-title mt-3">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
        </div>
      ))}
    </div>
  )
}
