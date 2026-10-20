# Deployment — Vercel, Brevo, domain, Turnstile, Search Console

Step-by-step guide for the manual setup (accounts, DNS, env variables) plus
the day-to-day release workflow. Checkbox states reflect the last update of
this page — when in doubt, check the Vercel / Cloudflare dashboards.

## Release workflow

1. Merge feature PRs into `staging` → Vercel deploys the **staging** project.
2. Test on staging (forms, mobile and desktop).
3. Open a PR `staging` → `main` (Claude Code: `/release`) and merge it
   with **"Create a merge commit"**
   (never squash) → Vercel deploys **production**.

CI (GitHub Actions, `.github/workflows/ci.yml`) runs lint, typecheck, tests
and build on every push/PR to `main` and `staging`.

## Environments

- **Production** = branch `main` → `https://www.laboon-app.com`
  (Vercel project `laboon-website`, fallback URL `laboon-website-black.vercel.app`).
- **Staging** = branch `staging` → second Vercel project
  `laboon-website-staging` whose _Production Branch_ is `staging`.
  (On the free Hobby plan, attaching a custom domain to a _Preview_ branch is
  paid — a second project is the free workaround.)

## Environment variables

Set them in Vercel → project → _Settings → Environment Variables_, on **both**
projects, then **Redeploy** (a variable is only picked up by a new build).
Full list with comments: [`.env.example`](../.env.example).

| Variable                                                  | Feature                 | Notes                                                                      |
| --------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `BREVO_API_KEY`                                           | signup, contact         | [brevo.md](integrations/brevo.md)                                          |
| `BREVO_LIST_ID_LAUNCH` / `BREVO_LIST_ID_BETA`             | signup                  | prod `5`/`6`, staging `7`/`8`                                              |
| `BREVO_DOI_TEMPLATE_ID`                                   | signup                  | `1`                                                                        |
| `BREVO_DOI_TEMPLATE_ID_EN`                                | signup (English)        | optional: English confirmation template (else the French one)              |
| `CONTACT_TO_EMAIL`                                        | contact                 | inbox receiving messages                                                   |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | anti-bot                | _Production_ environment only                                              |
| `NEXT_PUBLIC_API_URL`                                     | account links           | Laboon API base URL with `/v1` (+ site origin in the API's `CORS_ORIGINS`) |
| `NEXT_PUBLIC_API_STAGING_KEY`                             | account links (staging) | value of the `X-Laboon-Staging` header (staging only; empty in production) |
| `SENTRY_DSN`                                              | error alerts            | same value on both projects (environments are told apart automatically)    |

Online, a missing variable makes the related form show an error (never a
fake success). Locally, missing Brevo variables = dry run.

**After each deploy**, Vercel → project → _Logs_: lines starting with
`[env]` list the features that are missing variables (e.g.
`[env] contact form: missing CONTACT_TO_EMAIL`). No `[env]` line = all set.

## 1. Brevo — ✅ done (2026-09-27)

Account, domain, lists, template and API key are set up — details in
[integrations/brevo.md](integrations/brevo.md).

- [x] Brevo variables on the staging project, tested (signup → lists 7 and 8).
- [ ] Confirm Brevo variables on the production project (lists 5 and 6).

## 2. GitHub — ✅ done (2026-06-14, moved 2026-10-05)

- Repo `Laboon-Music/website` (public, in the `Laboon-Music`
  organization), branches `main` and `staging`.
- The old private repo `Algodrill/Laboon-website` is archived: it keeps the
  pre-move commit and PR history.

### GitHub — repo settings

✅ Done (2026-10-05). Applied on `Laboon-Music/website` (public repo):

- **Rulesets** `protect-staging` and `protect-main`: pull request required
  (0 approvals), check **"Format, lint, typecheck, test & build"** must pass,
  no force push, no branch deletion. Edit them in _Settings → Rules →
  Rulesets_.
- **Outside users**: Issues, Wiki, Projects and Discussions disabled;
  _Settings → Moderation options → Interaction limits_ = collaborators only.
  ⚠️ This limit expires after 6 months (next: **2027-04-05**) — re-enable it.
- **Actions**: workflows from outside contributors' PRs need approval.
- **Security**: secret scanning + push protection, Dependabot alerts and
  security updates enabled.
- **Organization** `Laboon-Music`: base permission _Read_, contact email
  `laboon.app@gmail.com`.

### GitHub — Dependabot

`.github/dependabot.yml` is enough: Dependabot starts opening PRs on its own.

## 3. Vercel

- [x] Production project imported (framework Next.js detected).
- [x] Production online.
- Staging project:
  - [ ] Vercel → _Add New → Project_ → import the **same** repo.
  - [ ] Name `laboon-website-staging`.
  - [ ] _Settings → Git → Production Branch_ = `staging`, then Redeploy.
  - [ ] (Optional) domain `staging.laboon-app.com` on this project +
        Cloudflare CNAME `staging` → `cname.vercel-dns.com` (DNS only).

## 4. Domain — `laboon-app.com`

Bought at **OVH**, DNS managed by **Cloudflare** (create records in
Cloudflare, not OVH).

- [ ] Vercel → _Settings → Domains_: add `laboon-app.com` and `www.laboon-app.com`.
- [ ] Cloudflare → laboon-app.com → _DNS → Records_:
  - `A` `@` → `76.76.21.21` (or the value Vercel shows)
  - `CNAME` `www` → `cname.vercel-dns.com` (or the value Vercel shows)
  - ⚠️ **Proxy status = DNS only (grey cloud)** for both, otherwise the Vercel
    HTTPS certificate fails / redirect loop.
  - Delete older conflicting `A`/`CNAME` records on `@` and `www`.
- [ ] Wait until Vercel shows "Valid" + HTTPS.

## 5. Contact form

- [ ] Pick the receiving address (e.g. `contact@laboon-app.com`).
- [ ] Add `CONTACT_TO_EMAIL` on prod **and** staging, Redeploy.
- [ ] On staging: send a message → it arrives, and _Reply_ goes to the
      address typed in the form.

## Anti-bot — Cloudflare Turnstile

- [ ] dash.cloudflare.com → **Turnstile** (left menu, account level) →
      **Add widget**: name `Laboon website`, hostname `laboon-app.com`
      (covers `www.` and `staging.`), mode **Managed**, pre-clearance no.
- [ ] Copy the **Site Key** and **Secret Key**.
- [ ] Vercel, prod **and** staging: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
      `TURNSTILE_SECRET_KEY`, environment **Production only** (preview URLs
      `*.vercel.app` are not allowed by the widget), then **Redeploy** (the
      site key is baked into the build).
- [ ] Test signup + contact on staging.

## Google Search Console

- [ ] search.google.com/search-console → _Add property_ → **Domain**:
      `laboon-app.com` (covers www + staging).
- [ ] Copy the `google-site-verification=…` TXT value.
- [ ] Cloudflare → _DNS → Records → Add record_: type **TXT**, name `@`,
      content = that value → Save, then _Verify_ in Search Console.
- [ ] Search Console → _Sitemaps_ → add `sitemap.xml`.

## Error monitoring — Sentry

Free plan is enough. Sentry emails you when a signup or contact message fails.

- [x] sentry.io → sign up (use the team address, e.g. laboon.app@gmail.com)
      → organisation `laboon` → data region **EU** (GDPR).
- [x] _Create project_ → platform **Next.js** → name `laboon-website` →
      alert frequency **"Alert me on every new issue"** → _Create project_.
- [x] Skip the setup wizard (the code is already set up). Copy the **DSN**
      (_Settings → Projects → laboon-website → Client Keys (DSN)_), it looks
      like `https://…@o….ingest.de.sentry.io/…`.
- [x] Vercel, prod **and** staging projects: add `SENTRY_DSN` = that DSN
      (all environments), then **Redeploy**. ✅ Set on prod and staging (2026-10-05).
      ⚠️ Takes effect once the Sentry code (branch
      `chore/cleanup-design-system-docs-tests`) is merged and deployed.
- [x] **Alert on every failure** (created 2026-10-05) (by default Sentry only emails the first
      time a given problem happens). Sentry → _Alerts_ → _Create Alert_:
  - _Source_: **Alert on all issues in selected projects**, project
    `laboon-website`.
  - _Filter Issues_: **All Environments** for now (the `production` /
    `staging` environments only appear in the list after their first event;
    switch to `production` later if staging emails become noise).
  - _Alert Builder_ → _WHEN_: **delete the 4 default triggers** (new issue,
    resolved, escalates, regresses — hover a row, click the bin; the last one
    can only be deleted once another trigger exists) and add **An event or
    issue activity is captured** (fires on every event, not only new issues).
  - _IF_: leave **Any event**.
  - _THEN_ → _Select an action_ → **Notify on preferred channel** → change
    "Suggested Assignees" to **Member** → **Laboon** (laboon.app@gmail.com).
  - _Throttling_: **Get notified on every trigger**.
  - Name it (pencil next to "New Alert"), e.g. `Laboon — every server error`,
    then _Send Test Notification_ to check the email arrives, then
    **Create Alert**.
- [x] After deploying to staging, check the Vercel logs show no
      `[env] error monitoring: missing SENTRY_DSN` line. ✅ Staging OK (2026-10-05):
      no `[env]` line at all, every feature is configured.
- [ ] Test on staging: temporarily set a wrong `BREVO_API_KEY`, sign up,
      check the issue appears in Sentry (environment `staging`), restore the key.

## GDPR / legal

- [ ] Fill the `[à compléter]` placeholders of the legal documents before the
      public launch ([legal-documents.md](features/legal-documents.md)).

## Local machine notes

- Node.js **24** (see `.nvmrc`; Vercel and CI use 24). Node ≥ 22 works locally.
- `npm run dev` for local work, `npm run check` + `npm run build` before pushing.
