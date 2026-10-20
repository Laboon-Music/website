# Architecture

## Stack

| Layer            | Choice                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Framework        | **Next.js 16** (App Router, React 19, TypeScript, Turbopack)           |
| Styling          | **Tailwind CSS v4** (tokens in `app/globals.css`, no config file)      |
| Email / contacts | **Brevo** REST API (no SDK, see `lib/brevo.ts`)                        |
| Anti-bot         | Honeypot + minimum delay + **Cloudflare Turnstile**                    |
| Account links    | **Laboon API** (fetch from the browser), see account-links.md          |
| Analytics        | **Vercel Web Analytics** (cookieless)                                  |
| Hosting          | **Vercel** — two projects: production (`main`) and staging (`staging`) |
| Tests            | **Vitest** + Testing Library (jsdom)                                   |
| Monitoring       | **Sentry** (server-side only, no personal data)                        |
| Formatting       | **Prettier** (+ Tailwind class sorting)                                |
| CI               | GitHub Actions: format → lint → typecheck → test → build               |

## Folder layout

```
app/                         Routes (App Router). Pages are thin: they compose components.
├── layout.tsx               Root layout: <html lang="fr">, SEO metadata, viewport, Analytics
├── page.tsx                 Landing page (texts in content/home.ts)
├── contact/                 Contact page
├── inscription-confirmee/   Double opt-in landing page (+ signup_confirmed event)
├── reset-password/          Password reset page (Laboon API)
├── confirm-email/           Sign-up confirmation page (Laboon API)
├── cgu|cgv|charte|confidentialite|mentions-legales/   Public legal pages
├── legal/[slug]/            Bare legal pages for the app WebView (noindex)
├── .well-known/             iOS / Android deep link association files
├── api/subscribe/           POST — newsletter signup (Brevo double opt-in)
├── api/contact/             POST — contact message (Brevo transactional email)
├── not-found.tsx, error.tsx, global-error.tsx   French error pages
├── opengraph-image.tsx      Generated social share image
├── robots.ts, sitemap.ts    SEO
└── globals.css              Theme tokens, base styles, reduced motion (+ ui.css: button, checkbox, FAQ row, disc)

content/                     Editable website texts (no JSX) — see content.md
├── home.ts                  Home page texts
└── site.ts                  Title, description, share texts

components/
├── ui/                      Design system primitives (Button, Input, Card, TextLink…) — see design-system.md
├── layout/                  Page chrome (PageShell, SiteHeader, SiteFooter, Wordmark, CurrentYear)
├── home/                    Animated home scene (HomeScene, scene.ts, home.css) — see features/home-scene.md
├── faq/                     FAQ article, home FAQ section, FAQPage structured data
├── newsletter/              SignupForm, TrackSignupConfirmed
├── contact/                 ContactForm
├── antibot/                 Turnstile widget (lazy)
├── social/                  SocialLinks
└── legal/                   Legal registry, page wrapper, shared blocks, content/<locale>/*

hooks/
└── useProtectedForm.ts      Client submit lifecycle + anti-bot fields for every form

lib/                         Framework-agnostic logic (pure, unit-tested)
├── env.ts                   The only place reading environment variables (+ per-feature requirements)
├── monitoring.ts            reportError() → Vercel logs + Sentry; Sentry init
├── analytics.ts             trackEvent() — conversion event names
├── antibot.ts               Honeypot / delay / Turnstile checks (server)
├── brevo.ts                 Brevo API client
├── contact.ts               Contact subjects & limits (shared client/server)
├── newsletter.ts            Signup messages (shared client/server)
├── http.ts                  JSON response helpers, body parsing
├── validation.ts            Email / text normalisation, HTML escaping
├── password.ts              Password rules, French API error messages
├── api.ts                   Laboon API client (account links)
├── site.ts                  Canonical URL, production hosts, robots rules
└── cx.ts                    className joiner

instrumentation.ts           Server start: Sentry + missing-variable report; onRequestError
tests/                       Vitest setup + shared helpers (tests live next to their code)
docs/                        This documentation
```

### Layering rules

- **`app/`** only wires things together: routing, metadata, composing
  components. Route handlers stay thin: parse → `checkAntibot` → validate →
  call an integration.
- **`components/<feature>/`** owns the UI of one feature and uses
  `components/ui` + `components/layout`. No raw styling duplication.
- **`lib/`** holds logic with no React. Anything shared by client and server
  (limits, labels, messages) lives here so both sides agree.
- External services are called only from `lib/` (or the route that owns the
  flow), never from components — except `NEXT_PUBLIC_*` values read through `publicEnv`.
- Environment variables are read **only** through `lib/env.ts`
  (`readEnv`, `readIdEnv`, `missingEnv`, `publicEnv`); new variables are
  added to `ENV_NAMES` (+ `FEATURE_ENV` if a feature depends on it).
- Server failures that lose data go through `reportError()` (`lib/monitoring.ts`).
- Website texts of the home page live in `content/` (see [content.md](content.md)).

## Request flows

### Newsletter signup

```
SignupForm ──POST /api/subscribe──▶ checkAntibot ─▶ validate ─▶ Brevo /contacts/doubleOptinConfirmation
                                                                     │
visitor clicks link in Brevo email ◀──────────────────────────────────┘
        └──▶ added to lists ─▶ redirected to /inscription-confirmee
```

Details: [features/newsletter-signup.md](features/newsletter-signup.md).

### Contact

```
ContactForm ──POST /api/contact──▶ checkAntibot ─▶ validate ─▶ Brevo /smtp/email ─▶ CONTACT_TO_EMAIL
                                                              (replyTo = visitor)
```

Details: [features/contact-form.md](features/contact-form.md).

### Missing configuration

Both API routes follow the same rule:

- **Locally** (`npm run dev`, tests): missing Brevo config → _dry run_ (payload
  logged in the terminal, success returned) so forms can be tried without keys.
- **Online** (`NODE_ENV=production`): missing config → visible error. The site
  must **never** show a success message when nothing was saved or sent.

## Environments

| Env        | Branch    | Vercel project           | Brevo lists (launch / beta) |
| ---------- | --------- | ------------------------ | --------------------------- |
| Local      | any       | —                        | dry run                     |
| Staging    | `staging` | `laboon-website-staging` | 7 / 8                       |
| Production | `main`    | `laboon-website`         | 5 / 6                       |

Environment variables are listed in [`.env.example`](../.env.example) and
explained in [deployment.md](deployment.md).

## Security baseline

- Security headers on every response (`next.config.ts`): `nosniff`,
  `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`;
  `X-Powered-By` removed.
- All user input is normalised and length-limited server-side; HTML emails
  escape user content (`escapeHtml`).
- Secrets only in env variables (never `NEXT_PUBLIC_*` except public keys).
- Server errors reported to Sentry without personal data ([monitoring.md](features/monitoring.md)).
- Follow-ups (CSP, rate limiting): [roadmap.md](roadmap.md).
