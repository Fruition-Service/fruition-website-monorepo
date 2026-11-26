#!/usr/bin/env bash
# Ship the current branch: commit -> push -> PR -> wait for CI -> squash merge.
#
# Usage:  ship.sh "commit message"     commit everything, then ship
#         ship.sh --no-commit          branch is already committed
#         ship.sh --dry-run [...]      run every check, stop before push/PR/merge
#
# Run it from anywhere inside the target repo. The base branch is the repo's
# own default branch (production here, main for marketa and the others), so this
# works across every repo under ~/Github/Fruition-Service.
#
# Refuses to merge unless every required check passes. Never force-pushes.
set -euo pipefail

POLL_TIMEOUT_MIN="${SHIP_TIMEOUT_MIN:-20}"

# --dry-run does all the validation and then stops before anything leaves the
# machine. Use it to exercise the guardrails; a bare run really does deploy.
DRY=0
ARGS=()
for a in "$@"; do
  if [ "$a" = "--dry-run" ]; then DRY=1; else ARGS+=("$a"); fi
done
set -- ${ARGS+"${ARGS[@]}"}

die() { printf '\033[31mship: %s\033[0m\n' "$*" >&2; exit 1; }
say() { printf '\033[36m==>\033[0m %s\n' "$*"; }

command -v gh >/dev/null || die "gh CLI not found"
gh auth status >/dev/null 2>&1 || die "gh is not authenticated (run: gh auth login)"

git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository.
cd into the repo you want to ship first, e.g.:
    cd ~/Github/Fruition-Service/fruition-website-monorepo"
cd "$(git rev-parse --show-toplevel)"

REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
BASE="${SHIP_BASE:-$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)}"
[ -z "$BASE" ] && die "could not determine the default branch for $REPO"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[ "$BRANCH" = "$BASE" ] && die "you are on '$BASE' — that is what we merge into.
Create a feature branch first:
    git switch -c fix/my-change"
[ "$BRANCH" = "HEAD" ] && die "detached HEAD — check out a branch first"

say "repo $REPO  |  $BRANCH -> $BASE"

# ---------------------------------------------------------------- commit
if [ "${1:-}" = "--no-commit" ]; then
  shift
else
  MSG="${1:-}"
  [ -z "$MSG" ] && die "need a commit message:
    ship.sh \"fix(scope): what changed\"
  or pass --no-commit if the branch is already committed."

  if [ -n "$(git status --porcelain)" ]; then
    say "committing working tree"
    git add -A
    git commit -q -m "$MSG" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
  else
    say "working tree clean — nothing new to commit"
  fi
fi

git fetch origin "$BASE" --quiet
if [ -z "$(git log "origin/$BASE..HEAD" --oneline)" ]; then
  die "'$BRANCH' has no commits that '$BASE' doesn't already have — nothing to ship"
fi

if [ "$DRY" = "1" ]; then
  say "DRY RUN — would push '$BRANCH' and open/merge a PR into '$BASE'. Stopping here."
  say "commits that would ship:"
  git log "origin/$BASE..HEAD" --oneline | sed 's/^/      /'
  exit 0
fi

# ---------------------------------------------------------------- push
say "pushing $BRANCH"
git push -u origin "$BRANCH" --quiet

# ---------------------------------------------------------------- PR
PR="$(gh pr list --head "$BRANCH" --base "$BASE" --state open --json number --jq '.[0].number // empty')"
if [ -z "$PR" ]; then
  say "opening PR against $BASE"
  gh pr create --base "$BASE" --head "$BRANCH" --fill >/dev/null
  PR="$(gh pr list --head "$BRANCH" --base "$BASE" --state open --json number --jq '.[0].number')"
  say "opened PR #$PR"
else
  say "reusing open PR #$PR"
fi

# ---------------------------------------------------------------- CI
say "waiting for checks (timeout ${POLL_TIMEOUT_MIN}m) — will NOT merge unless they pass"
set +e
gh pr checks "$PR" --watch --fail-fast --interval 15 >/dev/null 2>&1
set -e

# Re-read the final state rather than trusting the watch exit code alone.
FAILED="$(gh pr checks "$PR" --json name,state \
  --jq '[.[] | select(.state=="FAILURE" or .state=="TIMED_OUT" or .state=="CANCELLED" or .state=="ACTION_REQUIRED")] | map(.name) | join(", ")' 2>/dev/null || echo "")"
PENDING="$(gh pr checks "$PR" --json name,state \
  --jq '[.[] | select(.state=="PENDING" or .state=="QUEUED" or .state=="IN_PROGRESS")] | map(.name) | join(", ")' 2>/dev/null || echo "")"

[ -n "$FAILED" ]  && die "checks FAILED: $FAILED
Nothing was merged. Inspect: gh pr checks $PR"
[ -n "$PENDING" ] && die "checks still pending after ${POLL_TIMEOUT_MIN}m: $PENDING
Nothing was merged. Inspect: gh pr checks $PR"

MERGEABLE="$(gh pr view "$PR" --json mergeable --jq .mergeable)"
[ "$MERGEABLE" = "CONFLICTING" ] && die "PR #$PR conflicts with $BASE — rebase first. Nothing was merged."

# ---------------------------------------------------------------- merge
# Merge from outside the repo with an explicit --repo so gh never tries to switch
# or delete the LOCAL branch. That local step fails in a multi-worktree checkout
# ("'production' is already used by worktree at ...") and would report a failure
# *after* the PR had already merged. Remote branch cleanup comes from the repo's
# delete_branch_on_merge setting.
say "all checks green — squash-merging #$PR into $BASE"
( cd / && gh pr merge "$PR" --squash --repo "$REPO" ) || true

# Trust the PR's actual state, not the merge command's exit code.
STATE="$(gh pr view "$PR" --repo "$REPO" --json state --jq .state)"
[ "$STATE" != "MERGED" ] && die "PR #$PR did not merge (state: $STATE). Inspect: gh pr view $PR --web"

MERGE_SHA="$(gh pr view "$PR" --repo "$REPO" --json mergeCommit --jq '.mergeCommit.oid // empty')"
say "shipped #$PR as ${MERGE_SHA:0:9} -> $BASE"

# Local tidy-up is best-effort: never fail the run for it, the change is already live.
git fetch origin "$BASE" --prune --quiet || true
say "done. $BASE is now at $(git rev-parse --short "origin/$BASE")"
