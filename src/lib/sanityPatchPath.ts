/**
 * Reading a patch back off the document Sanity returns.
 *
 * `patch().set()` with a key-matched path — `body[_key=="abc"].asset._ref` —
 * silently does nothing when the path matches no node, and the commit still
 * reports success. On a bulk repair that failure mode is invisible: the log
 * says it patched twelve images and the document is untouched.
 *
 * So every write is verified against the returned document instead of trusted.
 * These helpers are the part worth testing on their own — the path grammar is
 * easy to get subtly wrong, and it is only exercised on an apply run.
 */

export interface PatchTargetDoc {
  coverImage?: { asset?: { _ref?: string } | null } | null
  body?: ({ _key?: string; asset?: { _ref?: string } | null } | null)[] | null
}

export type PatchTarget =
  | { kind: "cover" }
  | { kind: "body"; key: string }
  | { kind: "unknown" }

/**
 * Classify one of the patch paths this repair writes. Only the two shapes
 * `slotsFor()` produces are recognised; anything else is `unknown` so a caller
 * fails loudly rather than silently reporting success.
 */
export function parsePatchPath(path: string): PatchTarget {
  if (path === "coverImage.asset._ref") return { kind: "cover" }
  const key = /^body\[_key=="([^"]+)"\]\.asset\._ref$/.exec(path)?.[1]
  return key ? { kind: "body", key } : { kind: "unknown" }
}

/**
 * Did `path` end up holding `wantedRef` in the document Sanity returned?
 *
 * False for an unrecognised path, a missing key, or a null asset — all of which
 * mean the reference is not what we asked for, whatever the commit said.
 */
export function patchLanded(doc: PatchTargetDoc | null | undefined, path: string, wantedRef: string): boolean {
  if (!doc) return false
  const target = parsePatchPath(path)
  if (target.kind === "cover") return doc.coverImage?.asset?._ref === wantedRef
  if (target.kind === "body") {
    const block = (doc.body ?? []).find((b) => b?._key === target.key)
    return block?.asset?._ref === wantedRef
  }
  return false
}

/** The paths from `patch` whose reference did not end up on the document. */
export function unlandedPaths(
  doc: PatchTargetDoc | null | undefined,
  patch: Record<string, string>,
): string[] {
  return Object.entries(patch)
    .filter(([path, ref]) => !patchLanded(doc, path, ref))
    .map(([path]) => path)
}
