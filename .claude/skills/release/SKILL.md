---
name: release
description: Prepare a production release of the Laboon website — open the pull request staging → main on Laboon-Music/website with a dated title, the list of changes shipped since the last release and the release checklist, assigned to the requesting user. Use whenever the user asks to release, ship, deploy or put the site in production ("mettre en prod", "MEP").
---

# Release staging → main

Opens the release PR with `gh pr create`. It is a visible, shared action:
**show the title and description and get an explicit yes before creating
it**. Merging stays with the user — never merge the release PR yourself.

## Step 0 — Preconditions

- `gh auth status`: the **Algodrill** account must be active. Otherwise stop
  and tell the user (`gh auth switch`) — never use the work account.
- `git fetch origin main staging`.
- Nothing to release (`git log --oneline origin/main..origin/staging` is
  empty)? Say so and stop.
- A release PR already open (`gh pr list --repo Laboon-Music/website
--base main --head staging --state open`)? Show its URL and offer to refresh
  its description instead of opening a second one.
- Staging health — report, don't block, but flag anything not green:
  - CI on the `staging` tip: `gh run list --repo Laboon-Music/website
--branch staging --limit 1 --json status,conclusion`.
  - Vercel staging deployment of that commit:
    `gh api repos/Laboon-Music/website/commits/<sha>/status --jq
'.statuses[] | select(.context | endswith("staging")) | .state'`.

## Step 1 — What ships

```bash
git log --first-parent --format='%H %s' origin/main..origin/staging
```

- Each squash-merged PR is one commit ending in `(#N)`. For each one, read
  the PR: `gh pr view N --repo Laboon-Music/website --json
number,title,body,author`.
- Commits without `(#N)` (direct commits, merges of `main` back into
  `staging`): list them as plain commits, or skip pure merge commits.
- Group by conventional-commit type, in this order, omitting empty groups:
  ✨ Features (`feat`), 🐛 Fixes (`fix`), ⚡ Performance (`perf`),
  ♻️ Refactoring (`refactor`), 📝 Docs (`docs`), 🔧 Maintenance (`chore`,
  `ci`, `test`, `style`, dependency bumps).
- Line format: `- #N title` (GitHub renders the PR link). Dependabot bumps
  can be collapsed into one line: `- Dependency updates (#12, #14)`.

## Step 2 — Production steps

From each shipped PR's **Deploy notes** section (and `.env.example` /
`docs/deployment.md` changes in `git diff origin/main...origin/staging`),
collect what must be done in production: env variables to set on the
**production** Vercel project, listmonk / Supabase / Cloudflare steps. Ignore
"None." notes.

## Step 3 — Title and description

- Title: `release: YYYY-MM-DD` (today's date).
- Description: read `.github/PULL_REQUEST_TEMPLATE/release.md` and fill it
  in as-is, HTML comments stripped:
  - keep the merge-commit warning;
  - **What ships**: the grouped list from Step 1;
  - **Before merging**: leave the boxes unchecked; add one unchecked box per
    production step from Step 2 (e.g. `- [ ] Set NEW_VAR on the production
Vercel project (#N)`); if there is none, strike through the env-variable
    and outside-steps boxes;
  - **After merging**: unchanged;
  - if Step 0 found CI or the staging deploy not green, add a
    `> [!WARNING]` block at the top saying so.

## Step 4 — Confirm and open

1. Show the exact title and full description; ask for an explicit yes.
2. Write the description to a file in the scratchpad, then:

```bash
gh pr create \
  --repo Laboon-Music/website \
  --base main \
  --head staging \
  --title "release: YYYY-MM-DD" \
  --body-file <file> \
  --assignee @me
```

3. Give the PR URL back and remind the user to:
   - test on **staging.laboon-app.com** and tick the checklist;
   - merge with **Create a merge commit** — never squash;
   - ask Claude to check the production deployment afterwards (Vercel
     status on the `main` commit, then `www.laboon-app.com` responds).

## Rules

- No Claude attribution anywhere (no "Generated with Claude Code", no
  Co-Authored-By line).
- Never tick a box, never merge, never push to `main` or `staging`.
- Title and description in English, whatever language the conversation is in.
