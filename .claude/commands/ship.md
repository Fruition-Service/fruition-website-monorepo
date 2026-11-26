---
description: Commit, PR, and squash-merge the current branch into its repo's default branch once CI passes
allowed-tools: Bash, Read, Glob, Grep
---

Ship the work in progress.

$ARGUMENTS

**Never run `ship.sh` to test it, demo it, or explore what it does.** A bare run
pushes, opens a PR, and merges to production for real — including on a branch you
only meant to poke at. Use `--dry-run`, which validates everything and stops before
anything leaves the machine. Only run it for real on a branch the user has asked
you to ship.

**Pick the repo first.** This project root holds several repos
(`fruition-website-monorepo`, `marketa-monorepo`, other client repos, plus
worktrees). Ship the one whose files you actually changed this session. If that
is genuinely ambiguous, ask rather than guessing — merging deploys to
production. `cd` into it before running anything.

Then:

1. Run `git status --short` and `git diff` (plus `git diff --cached`) to see everything that would ship. Read enough of the changed files to know what the change actually does.
2. Sanity-check before shipping. Stop and tell the user instead of shipping if you see:
   - debug leftovers (`console.log`, `debugger`, commented-out blocks left behind)
   - secrets, tokens, or `.env` values in the diff
   - unrelated work mixed in — these repos squash-merge, so one PR should be one change
   - the change is obviously incomplete or was mid-edit
3. If the branch is the default branch (`production` on the website repo, `main` on marketa and the other repos), create a feature branch first — the script refuses to run there.
4. Write a commit message: a `type(scope): summary` subject under ~72 chars, then a body explaining *why*, not just what. If the user passed a message in `$ARGUMENTS`, use it.
5. Run the shipper:

   ```bash
   ~/Github/Fruition-Service/.claude/scripts/ship.sh "type(scope): summary"
   ```

   Use `--no-commit` instead of a message if the branch is already committed, and
   add `--dry-run` to see what would ship without shipping it.
   It works from anywhere inside the repo and targets that repo's own default branch.

6. The script pushes, opens the PR, waits for the required checks, and squash-merges only if they all pass. If it exits non-zero, **nothing was merged** — report which check failed and offer to fix it. Do not retry blindly and do not merge by hand to work around a red check.
7. Report the PR link and the merge SHA. For the website repo, the merge triggers a production deploy — offer to verify the change on the live URL once it lands.
