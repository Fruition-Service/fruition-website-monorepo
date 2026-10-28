import LeadForm, { type LeadFormField } from "./LeadForm"

/** Answers land under the keys the monday sink reads: "Phone" fills the phone
 *  column, "Message" the notes column (see pushToMonday in @/lib/leadNotify). */
const FORM_FIELDS: LeadFormField[] = [
  { label: "Phone", name: "Phone", inputType: "tel", autoComplete: "tel" },
  {
    label: "What do you need help with?",
    name: "Message",
    type: "textarea",
    required: true,
    placeholder: "A sentence or two is plenty.",
  },
]

const PILL =
  "inline-flex min-h-12 w-full items-center justify-center rounded-pill px-[26px] py-3.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none md:w-auto"

/**
 * /contact-us hero: copy and the two pill CTAs on the left, the lead form card
 * on the right. One column on mobile (copy, then form).
 */
export default function ContactHeroSection({ salesEmail }: { salesEmail: string }) {
  return (
    <section className="hero-band section-y">
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="min-w-0 lg:pt-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">Contact us</p>
          <h1 className="text-display mt-4 text-ink text-balance">We&rsquo;d love to hear from you</h1>
          <p className="text-body-lead mt-5 max-w-[56ch] text-muted text-pretty">
            Reach the team directly, or find the office nearest you. We answer every message within one business day.
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <a
              href="#book"
              className={`${PILL} bg-brand bg-linear-to-r from-brand to-brand-light text-white shadow-card hover:from-brand-dark hover:to-brand-dark`}
            >
              Book a time
            </a>
            <a
              href={`mailto:${salesEmail}`}
              className={`${PILL} border border-ui bg-surface text-ink hover:border-brand hover:text-brand`}
            >
              Email us
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <LeadForm
            variant="card"
            heading="Send us a message"
            subheading="Tell us a little about what you need and a specialist will get back to you within one business day."
            source="contact-us"
            showCompany={false}
            fields={FORM_FIELDS}
            submitLabel="Send message"
            successMessage="Thanks, a specialist will be in touch within one business day."
          />
        </div>
      </div>
    </section>
  )
}
