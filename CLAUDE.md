# Laboon — website

Landing page of **Laboon**, a mobile app that connects musicians. Main goal
before launch: **collect emails** (launch list + beta testers list). Also hosts
the app's companion pages (legal documents, password reset, deep link files).

Full documentation lives in [`docs/`](docs/README.md) — read the relevant page
before changing a feature. Act as **tech lead / architect**: keep the codebase
simple, consistent and clean; challenge changes that add duplication.

The project owner is **not a developer**: explain manual steps (Vercel,
Brevo, Cloudflare…) step by step, and automate whatever can be automated.

## Non-negotiable rules

1. **Language** — the website exists in **French** (default, informal "tu") and
   **English** (`/en`): UI text, error messages, metadata and e-mails to users
   are written in both (`content/fr` + `content/en`, see [docs/features/i18n.md](docs/features/i18n.md)). Documentation, code,
   comments, commits and PRs in **English**.
2. **Responsive** — every page must work on **mobile and desktop**.
   Mobile-first Tailwind classes (`px-4 sm:px-6`, `flex-col sm:flex-row`…),
   no horizontal scroll at 375 px, inputs `text-base`. Verify UI changes in
   the browser preview at 375 px and desktop width.
3. **Design system** — build UI from `@/components/ui` (Button, Input, Card,
   Field, FormError, Honeypot…) and `@/components/layout` (PageShell…). Never
   restyle these by hand; extend the design system instead.
   See [docs/design-system.md](docs/design-system.md).
4. **Unit tests with every change** — Vitest + Testing Library, `*.test.ts(x)`
   next to the code. New behaviour or bug fix ⇒ test. No real network calls.
   See [docs/testing.md](docs/testing.md).
5. **Docs with every change** — update `docs/` in the same change: new
   feature ⇒ `docs/features/<name>.md` + row in `docs/README.md`; new env
   variable ⇒ `.env.example` + `docs/deployment.md`; structural decision ⇒
   `docs/decisions.md`.
6. **Never fake success** — online, a missing config or failed integration
   returns a visible error; dry runs are for local dev only.
7. **Every public form** uses `useProtectedForm` (+ `form.formProps` on the
   `<form>`) + `<Honeypot>` + `<Turnstile>` client-side and `checkAntibot()`
   server-side.
8. **Accessibility** — Lighthouse a11y 100: labels on every control, tokens
   for colours (contrast), `TextLink` for links in text, `aria-hidden` on
   decoration. See [docs/design-system.md](docs/design-system.md#accessibility-rules).
9. **Env & errors** — read env variables only via `lib/env.ts`; report
   server failures with `reportError()` (`lib/monitoring.ts`) and never put
   personal data (email, name, message) in it.
10. **Texts** — home page, FAQ and interface texts live in `content/<lang>/`, not in JSX;
    every text exists in French **and** English. Links are written without the `/en` prefix.

## Stack

Next.js 16 (App Router, React 19, TypeScript strict) · Tailwind CSS v4 ·
Brevo (emails) · Cloudflare Turnstile (anti-bot) · Laboon API (account links) ·
Vercel (hosting + analytics) · Sentry (server error alerts) · Vitest · Prettier.

## Layout

- `app/` routes (thin) · `content/` editable texts · `components/ui` design
  system · `components/layout` page chrome · `components/<feature>/` feature
  UI · `hooks/` · `lib/` pure logic (env, monitoring, shared constants) ·
  `tests/` helpers · `docs/`.
- Details: [docs/architecture.md](docs/architecture.md).

## Commands

```bash
npm run dev          # local site on http://localhost:3000 (preview: "laboon-dev")
npm run format       # format everything (Prettier + Tailwind class order)
npm run check        # format check + lint (0 warnings) + typecheck + unit tests
npm test             # unit tests only
npm run build        # production build (preview "laboon-prod" serves it on :3001)
```

Run `npm run check` and `npm run build` before declaring work done.

## Git

- `staging` = default branch (staging env), `main` = production.
- Branch from `staging` (`feat/…`, `fix/…`, `chore/…`), conventional commits,
  PR into `staging`. Release: PR `staging` → `main` with a **merge commit**.
- Open PRs with the `/open-pr` skill; release to production with `/release`.
- No Claude attribution lines in commits or PRs.

## Environment variables

See [`.env.example`](.env.example) and [docs/deployment.md](docs/deployment.md).
