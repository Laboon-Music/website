<!--
  Title: conventional commit, e.g. `feat(contact): add a phone field`.
  Base branch: `staging`. Releasing staging → main? Use the release template:
  run `/release` in Claude Code, or add `?template=release.md` to the PR URL.
-->

## 🎯 What & why

<!-- 1–3 sentences: the problem, then the change. Link the ticket if any. -->

## 🔍 Changes

<!-- Key changes grouped by area — reviewers read this first. -->

-

## 🧪 How to test

<!-- Steps a reviewer can follow on the Vercel preview (link posted by Vercel below). -->

1.

## 📸 Screenshots

<!-- UI changes only — delete this section otherwise. -->

| 📱 Mobile (375 px) | 🖥️ Desktop |
| :----------------: | :--------: |
|                    |            |

## ✅ Definition of done

<!-- CI already blocks the merge if check or build fail. Strike through (~~like this~~) what doesn't apply. -->

- [ ] 📱 Tested on **mobile (375 px)** and **desktop**
- [ ] 🧪 **Unit tests** added or updated for the change
- [ ] 📚 **Docs** updated (`docs/`; new env variable → `.env.example` + `deployment.md`)
- [ ] 🔐 No secret committed, no personal data in logs

## 🚚 Deploy notes

<!-- Anything to do outside the code before/after merging: Vercel env variables
     (prod + staging), listmonk / Supabase / Cloudflare settings… -->

None.
