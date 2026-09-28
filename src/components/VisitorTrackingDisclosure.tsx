// Static disclosure for B2B visitor identification (RB2B) and the analytics /
// ad tags loaded in src/app/layout.tsx (GTM, Clarity, OpenAI). Keep the tool
// list in sync with the loaders there. Embedded on
// /data-privacy so we can update wording in code without an editor having to
// touch Sanity. Move to CMS later if marketing needs to edit this without a
// deploy.

const PRIVACY_EMAIL = "privacy@fruitionservices.com"

const h2 = "mt-12 mb-4 border-b border-ui pb-2 text-2xl font-bold tracking-tight text-body"
const h3 = "mt-8 mb-3 text-lg font-semibold text-body"
const p = "mb-4 leading-relaxed text-body"
const ul = "mb-6 ml-1 list-disc space-y-1.5 pl-5 text-body marker:text-muted"
const strong = "font-semibold text-body"
const link = "font-medium text-[#8015E8] underline underline-offset-2 hover:text-[#6a11c2]"

export default function VisitorTrackingDisclosure() {
  return (
    <section
      aria-labelledby="visitor-tracking-heading"
      className="mt-12 border-t border-ui pt-12 text-[15px]"
    >
      <h2 id="visitor-tracking-heading" className={h2}>
        Visitor Identification &amp; Analytics
      </h2>

      <p className={p}>
        We use a B2B visitor identification service (
        <strong className={strong}>RB2B</strong>, operated by Retention.com) to
        recognise business visitors to this website. RB2B matches anonymised
        device signals against publicly available business contact data so we
        can understand who is researching our services and follow up where
        appropriate. This service applies to visitors from every region we
        operate in, including the United States, the United Kingdom, the
        European Economic Area, and the rest of the world.
      </p>

      <h3 className={h3}>What we collect about you</h3>
      <ul className={ul}>
        <li className="leading-relaxed">
          <strong className={strong}>Business identity</strong>: first name,
          last name, job title, business email, LinkedIn URL, and the employer
          associated with you in business directories.
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>Company firmographics</strong>: company
          name, public website, industry, headcount range, estimated revenue,
          and approximate location (city, state/region, country).
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>Visit context</strong>: the pages you
          viewed on this site, the referring URL (if any), and the timestamp of
          your visits. Repeat visits update existing records rather than
          creating duplicates.
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>Company-only identification</strong>:
          where we can identify the company but not a specific individual, we
          record only the company and visit context.
        </li>
      </ul>
      <p className={p}>
        We do <strong className={strong}>not</strong> collect payment data,
        government identifiers, health information, or anything you have not
        published in a business context. RB2B does not place tracking cookies on
        your device; it relies on its own data graph.
      </p>

      <h3 className={h3}>Why we use it</h3>
      <p className={p}>
        We rely on our <strong className={strong}>legitimate interests</strong>{" "}
        (Article 6(1)(f) UK GDPR / EU GDPR) in:
      </p>
      <ul className={ul}>
        <li className="leading-relaxed">
          understanding which organisations engage with our content,
        </li>
        <li className="leading-relaxed">
          contacting prospective business customers about services they appear
          to be researching, and
        </li>
        <li className="leading-relaxed">
          improving how we present those services on this site.
        </li>
      </ul>
      <p className={p}>
        We have assessed that this processing is proportionate, limited to
        business contact data, and that you have a reasonable expectation of B2B
        outreach in this context.
      </p>

      <h3 className={h3}>Who receives this information</h3>
      <ul className={ul}>
        <li className="leading-relaxed">
          <strong className={strong}>Retention.com (RB2B)</strong> — the
          identification provider, acting as a data controller for the source
          contact data and as a processor for our visit signals.
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>monday.com</strong> — our CRM, where
          identified leads are stored.
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>Slack Technologies</strong> — internal
          notifications to our sales team.
        </li>
      </ul>
      <p className={p}>
        We do not sell your data, and we do not transfer it outside the purposes
        described here.
      </p>

      <h3 className={h3}>Analytics and advertising tools</h3>
      <p className={p}>
        We also use the following tools to measure how the site is used and
        whether our advertising works. They set cookies or similar identifiers
        in your browser.
      </p>
      <ul className={ul}>
        <li className="leading-relaxed">
          <strong className={strong}>Google Analytics and Google Ads</strong>{" "}
          (Google LLC), loaded through Google Tag Manager: pages viewed, how you
          arrived, device and approximate location, and whether you booked a
          meeting after clicking one of our ads.
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>Microsoft Clarity</strong> (Microsoft
          Corporation): heatmaps and session recordings of how visitors scroll,
          click and move through our public pages, so we can find and fix parts
          of the site that are confusing. Clarity does not run in our client
          portal or content management areas.
        </li>
        <li className="leading-relaxed">
          <strong className={strong}>OpenAI Ads</strong> (OpenAI): a
          measurement pixel that tells us whether visits from our ads on
          ChatGPT lead to an enquiry or booking.
        </li>
      </ul>
      <p className={p}>
        Choosing <strong className={strong}>Decline</strong>{" "}
        on our visitor notice stops RB2B, Microsoft Clarity and the OpenAI pixel from loading
        from your next page view onwards. To opt out of Google Analytics, use
        Google&apos;s{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          browser opt-out add-on
        </a>
        . You can also block or clear cookies in your browser settings at any
        time.
      </p>

      <h3 className={h3}>Your rights and how to opt out</h3>
      <p className={p}>
        You can ask us at any time to access, correct, or delete the information
        we hold about you, or to stop processing it. To exercise any of these
        rights, email{" "}
        <a href={`mailto:${PRIVACY_EMAIL}`} className={link}>
          {PRIVACY_EMAIL}
        </a>{" "}
        with the business email address or LinkedIn URL you would like us to
        action and we will respond within 30 days.
      </p>
      <p className={p}>
        To opt out of RB2B identification across every site that uses the
        service, submit a request directly to RB2B at{" "}
        <a
          href="https://www.rb2b.com/data-rights-request"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          rb2b.com/data-rights-request
        </a>
        .
      </p>
      <p className={p}>
        If you are in the UK or EEA and believe we have not handled your data
        correctly, you may also complain to your local data protection
        authority.
      </p>
    </section>
  )
}
