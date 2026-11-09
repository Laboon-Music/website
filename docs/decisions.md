# Decision log

Structural decisions, newest last. Add an entry for every decision that
changes the stack, the architecture or a convention.

## 2026-06-14 — Initial setup

- **Next.js (App Router, TypeScript)**: standard on Vercel, Node.js-based, fast.
- **Tailwind CSS, dark & modern theme**: chosen by the owner (dark / light / colourful).
- **Brevo for emails** (vs Supabase / Resend): EU (GDPR), free plan, campaigns
  can be sent from the same tool.
- **Two lists, "launch" and "beta"**: the visitor picks with checkboxes (at
  least one required).
- **Environments**: prod (`main`) + staging (`staging`) on Vercel.

## 2026-06-28 → 2026-07-17 — App companion pages

- **`/reset-password` web fallback** using the app's Supabase instance.
- **Legal documents as React components with a registry**, served both as
  public pages and as bare `/legal/<slug>` pages for the app WebView.
- **Deep link files served by Next routes** (`/.well-known/*`) rather than
  static files, to control content-type and keep them typed.

## 2026-09-27 — Brevo wired

- **Separate lists per environment**: prod 5/6, staging 7/8 — staging tests
  never pollute real lists.
- **Double opt-in**: contacts join lists only after confirming by email
  (GDPR + no signing someone up without consent).
- **Fail loudly online**: a missing config returns an error instead of a fake
  "Merci" (bug found the same day: variables were missing on Vercel).

## 2026-10-04 — Contact, anti-bot, social, SEO, first production release

- **Contact form via Brevo transactional email** with `replyTo` = visitor.
- **French form errors**: `noValidate` on forms, messages come from the API.
- **Three invisible anti-bot layers** (honeypot, 3 s delay, Turnstile
  interaction-only) instead of a visible CAPTCHA, to keep conversion high.
- **Only production is indexable** (robots by Host header).
- **Vercel Web Analytics** (cookieless, no consent banner).

## 2026-10-05 — Clean-up, design system, tests, docs

- **Design system** (`components/ui`, `components/layout`) + `useProtectedForm`
  hook: page chrome, buttons, inputs and the anti-bot submit logic were
  duplicated across 4–5 files.
- **Feature folders** in `components/` mirroring `docs/features/`.
- **Logic in `lib/` as pure functions** (validation, anti-bot, Brevo, robots,
  password rules) so it is unit-testable; route handlers stay thin.
- **Vitest + Testing Library**, tests next to the code, **mandatory with every
  change**; CI runs lint (0 warnings) → typecheck → tests → build.
- **Documentation in English in `/docs`** (single source of truth, replaces
  `.claude/context/`); **website content stays in French**; code and comments
  in English.
- **Responsive is a requirement**: mobile-first, checked at 375 px and desktop.
- **Dependency policy**: minor/patch updates applied; TypeScript 7 and ESLint
  10 majors deferred until `eslint-config-next` / Next.js officially support
  them. `@types/node` pinned to the runtime major (24).
- **Baseline security headers** in `next.config.ts`.

## 2026-10-05 — Reliability, conversion, accessibility, tooling

- **Sentry for alerting** (server-side only, EU region, no personal data
  collected): a failed signup must be noticed immediately. Chosen over Vercel
  alerts (paid plans) and custom email alerts (would depend on Brevo, the
  very service that may be failing).
- **`lib/env.ts` as the single entry point** for environment variables, with
  per-feature requirements reported at server start.
- **Turnstile loaded on first interaction** and submit **waits for the
  token** instead of erroring: fewer Cloudflare calls, no lost early clicks.
- **Conversion events** via Vercel Analytics custom events, behind
  `trackEvent()` (works once on the Pro plan; no-op before).
- **Website texts in `content/`** so the owner can edit them on GitHub
  without touching JSX.
- **Accessibility target: Lighthouse 100** — muted colour lightened to
  `#a6a6ba` (contrast over glows), underlined text links (`TextLink`), skip
  link, `<main>` landmark, reduced-motion support. French 404/error pages.
- **Prettier** (with Tailwind class sorting) enforced in CI; **Dependabot**
  weekly grouped updates on `staging`; PR template with the definition of
  done; branch protection documented.
- **Favicon / icons deferred** until a logo exists; share image generated
  from text meanwhile.
- **Single legal contact address** `laboon.app@gmail.com` (`CONTACT_EMAIL` in
  `lib/site.ts`), replacing `contact@laboon.fr` (wrong domain) in the CGV,
  privacy policy and legal notice.

## 2026-10-05 — Repo moved to the `Laboon-Music` organization

- **GitHub organization `Laboon-Music`** owned by the owner's personal
  account (no dedicated Laboon account): repos grouped under the brand,
  contact email `laboon.app@gmail.com`.
- **Public repo**: Vercel Hobby cannot deploy private repos owned by an
  organization, and branch protection is free on public repos. No secret is
  versioned (they live in Vercel env variables); outside users can read the
  code but cannot push, and interactions are limited to collaborators.
- **History restarted** (one production commit on `main`, one staging commit
  on top) to drop personal emails from the public history. The old private
  repo `Algodrill/Laboon-website` is archived and keeps the full history.

## 2026-10-11 — FAQ shared by the website and the mobile app

- **One content, two routes**: `/faq` (site chrome, indexed, in the sitemap)
  and `/faq/embed` (bare, `noindex`) for the app WebView — same pattern as
  the legal documents, but outside the legal registry because it is not a
  legal document (no Supabase `legal_document` row).
- **Texts in `content/faq.ts`** (editable without code); answers support
  `[label](address)` links through a tiny `RichText` renderer.
- **`Disclosure`** added to the design system (native `<details>`).

## 2026-10-13 — Repo renamed `Laboon-Music/website`

- The `Laboon-` prefix is redundant inside the `Laboon-Music` organization.
  GitHub redirects the old `Laboon-website` URL, so existing links, PRs and
  clones keep working. The `laboon-website` npm package name is unchanged.

## 2026-10-20 — New brand design (product designer)

- **Single light/blue brand theme** replaces the dark violet/pink one: tokens
  redefined in `app/globals.css` (same names, so components keep working);
  inner pages = night-blue gradient + solid blue panel, home = animated scene.
- **Fonts via `next/font`** (Bricolage Grotesque + Sora), self-hosted: no
  request to Google from visitors (GDPR), replaces the designer's CDN link.
- **No Lenis** (inertial scroll from a CDN): native scroll kept — less scroll
  hijacking, no third-party script. The scroll engine of the mockup
  (`scrollcraft.js`, 62 KB) was replaced by a small typed module
  (`components/home/scene.ts` + tested maths in `lib/scene-math.ts`).
- **Mockup forms were simulated**: replaced by our real forms (API, double
  opt-in, anti-bot). Password: only the look of the mockup is applied to
  `/reset-password`. See the last entry for the switch to the Laboon API.
- **Accessibility fixes over the mockup**: skip link, content visible without
  JavaScript (intro hide has an 8 s failsafe), keyboard Tab ends the intro,
  "pause animations" button (WCAG 2.2.2), FAQ structured data generated from
  `content/faq.ts`.
- Kept from our site (absent in the mockup): FAQ group "Lancement et
  disponibilité", Facebook link, embed pages for the app, 404/error pages.

## 2026-10-20 — Account links move from Supabase to the Laboon API

- **Supabase removed from the website** (dependency, `lib/supabase.ts`, env vars): the new
  Laboon API ([Laboon-Music/api](https://github.com/Laboon-Music/api)) e-mails
  `/reset-password?code=…` and `/confirm-email?code=…`; the site sends the code and the
  password to it. One-time code in the query string instead of tokens in the URL fragment.
- **`/reset-password` without a code is now the "forgot password" page** (the API answers the
  same for every address, so nothing leaks), and **`/confirm-email` is new**.
- **Password rules follow the API** (12 characters, uppercase, digit, special character).
- **Exception to "every public form is anti-bot protected server-side"**: these forms call the
  API from the browser, protected by its rate limits (see account-links.md).

## 2026-10-20 — English version

- **French stays the default without a prefix, English under `/en`**: no existing address changes
  (app links, e-mails, search engines). Everything lives in `app/[lang]`; `proxy.ts` rewrites.
- **No automatic redirection by browser language**: the visitor chooses with the footer link
  (avoids surprising people and search-engine duplicates); `hreflang` tells Google the pairs.
- **No i18n library**: dictionaries are plain typed objects (`content/<lang>/`), the English ones are typed
  on the French ones, so a missing translation does not compile (+ a parity test). Server code uses
  `getContent(locale)`, client code `useUi()`.
- **Same legal slugs in both languages** (they are shared with the app).
- **Brevo**: one confirmation template per language (`BREVO_DOI_TEMPLATE_ID_EN`, French fallback) and a
  `LANGUAGE` attribute.

## 2026-10-26 — E-mail templates for listmonk

- **One source for Brevo and listmonk**: the texts and the layout are shared, only the variables differ
  (`emails/syntax.ts`). The Brevo files are unchanged; listmonk ones go to `emails/dist/listmonk/`.
- **listmonk's opt-in e-mail picks its language from the `language` attribute** (it has one system template for every
  language), French by default like the site.
- **Greeting from a `first_name` attribute**, not listmonk's name, which defaults to the e-mail address.

## 2026-11-07 — listmonk replaces Brevo on the website

- **Newsletter signup and contact form go through listmonk** (self-hosted, already used by the API), as planned in the
  infra repo (`docs/email.md`): one tool for contacts and campaigns, Brevo is cancelled once the contacts are imported.
- **Admin API to create, public API when the e-mail exists**: only `POST /api/subscribers` sets attributes (`language`
  picks the opt-in e-mail language), but it answers 409 for a known address. The public `/api/public/subscription`
  then adds the lists and resends the opt-in without touching the attributes, and needs no extra permission to look the
  subscriber up (`subscribers:get_all` would expose every contact to a token stored on Vercel). Cost: the website
  lists are public.
- **One API user `laboon-website`**, `subscribers:manage` + `tx:send`, limited to the four website lists.
- **Contact form via `/api/tx` in `external` mode** with a template holding the subject: the visitor's text only
  travels as data, escaped by listmonk, never parsed as a template. `escapeHtml` is gone with Brevo.
- **listmonk sends its own opt-in, in the visitor's language**: one system template switches body and subject
  (`<title data-i18n>`, knadh/listmonk#1727) on the `language` attribute. Rejected: listmonk's automatic opt-in turned
  off and the site triggering FR/EN opt-ins through `/api/tx` (owner's choice: listmonk's own workflow sends it). The file lives in a dedicated Coolify volume read with
  `--static-dir`, not in the uploads volume (served publicly) nor inline in the compose (13 KB of HTML in the YAML).
- **The opt-in click ends on listmonk's page**: listmonk cannot redirect to `/inscription-confirmee`, so the
  `signup_confirmed` event no longer fires. Kept the page for now (follow-up: link to it from listmonk's page).

## 2026-11-08 — Laboon theme for listmonk's public pages

- **Custom CSS pasted in listmonk** (_Settings → Appearance → Public_), kept in `listmonk/public.css`: no change on the
  server. Rejected for now: overriding listmonk's HTML templates (`--static-dir`), heavier to keep in sync with
  listmonk updates for little gain.
- **Fonts served by the site** (`public/fonts`, open to other origins) rather than Google Fonts: no visitor request
  to Google, as on the site.
- **Colours copied, not generated**: a hand-written file stays readable to paste; a test keeps it equal to the tokens.

## 2026-11-09 — Brevo templates removed

- **listmonk is the only target of `emails/`**: neither the website nor the API sends through Brevo any more, so the
  Brevo files and the `Syntax` switch of 2026-10-26 are gone. `emails/dist/listmonk/` keeps its address and its content.
  The migration steps stay until the contacts are imported and Brevo is cancelled
  ([Leaving Brevo](integrations/listmonk.md#leaving-brevo)).
