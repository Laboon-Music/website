<!--
  Title: `release: YYYY-MM-DD` — base `main`, compare `staging`.
-->

> [!IMPORTANT]
> Merge with **Create a merge commit** — never squash, or `staging` and `main`
> stop sharing history.

## 🚀 What ships

<!-- PRs merged into staging since the last release (see "Commits" tab). -->

- #

## 🧪 Before merging

- [ ] Tested on **staging.laboon-app.com**, mobile and desktop
- [ ] Forms tested on staging (signup, contact, reset password if touched)
- [ ] New env variables set on the **production** Vercel project
- [ ] Outside steps done in production (listmonk, Supabase, Cloudflare…), or none
- [ ] CI green

## 🔁 After merging

- [ ] Vercel **production** deployment succeeded
- [ ] Vercel logs: no `[env]` line (every feature configured)
- [ ] Smoke test on **www.laboon-app.com** (home, signup, legal pages)
