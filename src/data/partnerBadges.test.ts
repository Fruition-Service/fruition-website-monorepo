import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { PARTNER_BADGES, partnerBadgesForPath } from "./partnerBadges"

const keys = (path: string, opts?: { explicitOnly?: boolean }) =>
  partnerBadgesForPath(path, opts).map((b) => b.key)

describe("partnerBadgesForPath", () => {
  it("gives each service page its own badge", () => {
    expect(keys("/partnerships/certified-hubspot-partner")).toEqual(["hubspot"])
    expect(keys("/hubspot-consulting")).toEqual(["hubspot"])
    expect(keys("/hubspot-consulting", { explicitOnly: true })).toEqual(["hubspot"])
    expect(keys("/partnerships/certified-atlassian-partner")).toEqual(["atlassian"])
    expect(keys("/partnerships/certified-atlassian-partner", { explicitOnly: true })).toEqual(["atlassian"])
    expect(keys("/partnerships/certified-clickup-partner")).toEqual(["clickup"])
    expect(keys("/partnerships/make-partners")).toEqual(["make"])
    expect(keys("/partnerships/aws-partner")).toEqual(["aws"])
    expect(keys("/partnerships/google-cloud-partner")).toEqual(["googleCloud"])
    expect(keys("/partnerships/openai-chatgpt-partner")).toEqual(["openai"])
    expect(keys("/partnerships/anthropic-claude-partner")).toEqual(["claude"])
    expect(keys("/partnerships/elevenlabs-partner")).toEqual(["elevenlabs"])
    expect(keys("/ai-consulting/agent-development")).toEqual(["claude", "openai", "elevenlabs", "googleCloud"])
  })

  it("pairs migration pages with both platforms", () => {
    // The HubSpot to monday migration now lives on the HubSpot hub, whose
    // hero shows the HubSpot badge only (monday 2900266080).
    expect(keys("/hubspot-consulting")).not.toContain("monday")
    // The Jira to monday.com migration now lives on the Atlassian hub.
    expect(keys("/atlassian-consulting")).toEqual(["atlassian", "monday"])
  })

  it("never shows Make outside the Make page", () => {
    for (const path of ["/monday-implementation-consultants", "/training", "/industries/healthcare", "/partnerships/aircall-partner"]) {
      expect(keys(path)).not.toContain("make")
    }
  })

  it("defaults monday work to the monday badge", () => {
    expect(keys("/monday-implementation-consultants")).toEqual(["monday"])
    expect(keys("/monday-consulting-solutions/monday-for-hr/")).toEqual(["monday"])
    expect(keys("/partnerships/monday-consulting-partner")).toEqual(["monday"])
  })

  it("shows nothing on partner pages without a badge, or off-map with explicitOnly", () => {
    expect(keys("/partnerships/aircall-partner")).toEqual([])
    expect(keys("/partnerships")).toEqual([])
    expect(keys("/integrations/zapier", { explicitOnly: true })).toEqual([])
    expect(keys("/hubspot-consulting", { explicitOnly: true })).toEqual(["hubspot"])
  })

  it("points at artwork that exists", () => {
    for (const badge of Object.values(PARTNER_BADGES)) {
      expect(existsSync(join(process.cwd(), "public", badge.src)), badge.src).toBe(true)
    }
  })
})
