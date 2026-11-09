/**
 * Staff and QA traffic tagging for PostHog.
 *
 * A browser is "internal" once it has rendered a signed-in portal page
 * (MarkInternalVisitor) or opened any site URL with `?fr_internal=1`, the hook
 * for automated QA runs that never sign in. The PostHog loader in the root
 * layout then registers `internal: true` on every event, and project 693212's
 * test-account filter drops events where `internal` is `true`.
 */
export const INTERNAL_VISITOR_KEY = "fruition-internal"
export const INTERNAL_VISITOR_PARAM = "fr_internal"

/** Inline snippet run right after `posthog.init` in the root layout loader. */
export const POSTHOG_INTERNAL_TAG = `try{if(/[?&]${INTERNAL_VISITOR_PARAM}=1(&|$)/.test(window.location.search))window.localStorage.setItem("${INTERNAL_VISITOR_KEY}","1");if(window.localStorage.getItem("${INTERNAL_VISITOR_KEY}")==="1")posthog.register({internal:true});}catch(e){}`
